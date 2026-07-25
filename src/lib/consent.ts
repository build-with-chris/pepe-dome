/**
 * Consent-Verwaltung (TDDDG § 25 / DSGVO Art. 6 Abs. 1 lit. a)
 *
 * Zwei einwilligungspflichtige Kategorien:
 *   - analytics  → Google Analytics 4
 *   - marketing  → Meta Pixel + Conversions API
 *
 * Technisch notwendige Cookies brauchen keine Einwilligung und tauchen
 * hier deshalb nicht als schaltbare Kategorie auf.
 *
 * Wichtig: Wir laden Skripte erst NACH erteilter Einwilligung ("Basic
 * Consent Mode"). Der Advanced Mode würde Google auch bei Ablehnung
 * kontaktieren — das ist in Deutschland umstritten und für einen Verein
 * das unnötig größere Risiko.
 */

export interface ConsentState {
  analytics: boolean
  marketing: boolean
  /** Schema-Version. Hochzählen erzwingt erneutes Fragen. */
  version: number
  /** ISO-Zeitstempel der Entscheidung, dient dem Nachweis. */
  updatedAt: string
}

export const CONSENT_VERSION = 1

const STORAGE_KEY = 'pepe_consent'

/** Feuert, wenn sich die Einwilligung ändert. Detail: ConsentState */
export const CONSENT_CHANGE_EVENT = 'pepe:consent-change'
/** Feuert, wenn der Banner erneut geöffnet werden soll (Footer-Link). */
export const CONSENT_OPEN_EVENT = 'pepe:consent-open'

export const DENY_ALL: Omit<ConsentState, 'updatedAt'> = {
  analytics: false,
  marketing: false,
  version: CONSENT_VERSION,
}

/**
 * Liest die gespeicherte Entscheidung.
 * `null` heißt: noch nicht gefragt, oder die Version ist veraltet.
 */
export function readConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<ConsentState>
    if (parsed.version !== CONSENT_VERSION) return null

    return {
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
      version: CONSENT_VERSION,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
    }
  } catch {
    // Kaputter Eintrag oder localStorage gesperrt: wie "nie gefragt" behandeln.
    return null
  }
}

/** Speichert die Entscheidung und benachrichtigt alle Hörer. */
export function writeConsent(choice: { analytics: boolean; marketing: boolean }): ConsentState {
  const state: ConsentState = {
    analytics: choice.analytics,
    marketing: choice.marketing,
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  }

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Privater Modus o. ä. — die Entscheidung gilt dann nur für diese Sitzung.
    }
    window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_CHANGE_EVENT, { detail: state }))
  }

  return state
}

/** Widerruf: löscht die Entscheidung, der Banner erscheint wieder. */
export function resetConsent(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignorieren
  }
  window.dispatchEvent(
    new CustomEvent<ConsentState>(CONSENT_CHANGE_EVENT, {
      detail: { ...DENY_ALL, updatedAt: new Date().toISOString() },
    })
  )
}

export function hasConsent(category: 'analytics' | 'marketing'): boolean {
  const state = readConsent()
  return state ? state[category] : false
}

/** Abonniert Änderungen. Gibt die Abmeldefunktion zurück. */
export function onConsentChange(callback: (state: ConsentState | null) => void): () => void {
  if (typeof window === 'undefined') return () => {}

  const handler = () => callback(readConsent())
  window.addEventListener(CONSENT_CHANGE_EVENT, handler)
  // Auch auf Änderungen in anderen Tabs reagieren.
  window.addEventListener('storage', handler)

  return () => {
    window.removeEventListener(CONSENT_CHANGE_EVENT, handler)
    window.removeEventListener('storage', handler)
  }
}

/** Öffnet den Banner erneut, z. B. aus dem Footer heraus. */
export function openConsentSettings(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))
}
