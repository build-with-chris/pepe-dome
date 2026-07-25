/**
 * Rate-Limiting für öffentliche API-Endpunkte
 *
 * WICHTIGE EINSCHRÄNKUNG: Der Zähler liegt im Arbeitsspeicher der jeweiligen
 * Serverless-Instanz. Auf Vercel laufen mehrere Instanzen parallel und werden
 * laufend neu gestartet. Das eingestellte Limit gilt deshalb pro Instanz, nicht
 * global: Bei fünf gleichzeitigen Instanzen sind faktisch fünfmal so viele
 * Anfragen möglich, und nach einem Kaltstart ist der Zähler leer.
 *
 * Es bremst damit versehentliche Doppelklicks und plumpe Skripte, aber keinen
 * entschlossenen Angreifer. Für ein verlässliches Limit braucht es einen
 * gemeinsamen Speicher (Upstash Redis oder Vercel KV). Siehe SECURITY.md.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

/**
 * Check if a request should be rate limited
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 5, windowMs: 60 * 60 * 1000 } // 5 requests per hour
): RateLimitResult {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  // Clean up expired entries periodically
  if (Math.random() < 0.01) {
    cleanupExpiredEntries()
  }

  // No existing entry or expired window
  if (!entry || now > entry.resetAt) {
    const resetAt = now + config.windowMs
    rateLimitStore.set(identifier, { count: 1, resetAt })
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt,
    }
  }

  // Increment count
  entry.count++
  rateLimitStore.set(identifier, entry)

  return {
    allowed: entry.count <= config.maxRequests,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetAt: entry.resetAt,
  }
}

/**
 * Clean up expired entries from the store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key)
    }
  }
}

/**
 * Get client identifier from request (IP address or fallback)
 */
export function getClientIdentifier(request: Request): string {
  // 1. Von Vercel selbst gesetzt und für den Aufrufer nicht überschreibbar.
  //    Die erste Wahl, wo immer vorhanden.
  const vercelForwarded = request.headers.get('x-vercel-forwarded-for')
  if (vercelForwarded) {
    return vercelForwarded.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }

  // 2. x-forwarded-for: der LETZTE Eintrag, nicht der erste.
  //
  //    Der Header ist eine Kette "client, proxy1, proxy2". Jeder Proxy hängt
  //    hinten an. Was vorne steht, hat der Aufrufer geschickt und ist damit
  //    frei erfunden. Vorher wurde genau dieser erste Eintrag genommen: Ein
  //    Angreifer setzt bei jedem Request ein anderes `X-Forwarded-For` und
  //    bekommt jedes Mal einen frischen Zähler — das Limit greift nie.
  //    Der letzte Eintrag stammt vom nächstgelegenen, vertrauenswürdigen Proxy.
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const parts = forwardedFor.split(',').map((part) => part.trim()).filter(Boolean)
    if (parts.length > 0) {
      return parts[parts.length - 1]
    }
  }

  // 3. Keine verlässliche Quelle. Bewusst ein fester Eimer statt User-Agent
  //    und Sprache: Auch die schickt der Aufrufer, jede Variation ergäbe einen
  //    neuen Zähler. Hinter Vercel wird dieser Zweig nie erreicht.
  return 'unknown-client'
}
