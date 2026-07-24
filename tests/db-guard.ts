/**
 * Schutzschranke gegen destruktive Tests auf einer echten Datenbank
 *
 * Hintergrund: Die Testsuite räumt in `tests/setup.ts` vor und nach jedem
 * Test alle Tabellen per `deleteMany` leer. Läuft das gegen die
 * Produktionsdatenbank, sind sämtliche Daten weg. Genau das ist passiert,
 * weil `DATABASE_URL` in der `.env` auf die Produktions-Supabase zeigt und
 * `prisma.config.ts` diese `.env` über `dotenv/config` in jeden Prozess lädt.
 *
 * Diese Datei entscheidet fail-closed: Nur eine eindeutig als Wegwerf-DB
 * erkennbare Verbindung darf destruktiv angefasst werden. Alles andere führt
 * zum sofortigen Abbruch, bevor ein einziger Test läuft.
 *
 * Die Kernfunktion ist bewusst rein (kein DB-Zugriff, keine Seiteneffekte),
 * damit sie sich ohne Datenbank testen lässt.
 */

/** Verwaltete/gehostete Anbieter: niemals zulässiges Ziel für Lösch-Tests. */
const HOSTED_PROVIDER_PATTERNS = [
  /supabase\.(co|com|net|in|io)/i,
  /\bpooler\./i, // Supabase/PgBouncer-Pooler-Hosts
  /neon\.tech/i,
  /rds\.amazonaws\.com/i,
  /\.render\.com/i,
  /railway\.app/i,
  /planetscale/i,
  /\.postgres\.database\.azure\.com/i,
  /cockroachlabs\.cloud/i,
]

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', 'host.docker.internal'])

export interface DbGuardResult {
  /** Darf `cleanDatabase()` destruktive Queries ausführen? */
  safe: boolean
  /** Ist überhaupt eine Datenbank konfiguriert? Ohne URL ist Prisma gemockt. */
  hasDatabase: boolean
  /** Menschlich lesbare Begründung, wird bei Abbruch angezeigt. */
  reason: string
}

/**
 * Bewertet eine DATABASE_URL, ohne sich zu verbinden.
 *
 * Regeln:
 * - keine URL  → keine DB (Prisma-Mock), Cleanup ist ein No-op, unbedenklich
 * - gehosteter Anbieter → immer unsicher, auch mit Override (harte Sperre)
 * - localhost → sicher
 * - DB-Name enthält "test" → sicher (z. B. pepe_test)
 * - sonst → nur mit ALLOW_DESTRUCTIVE_DB_TESTS=true und Nicht-Prod-Host
 */
export function evaluateDatabaseUrl(
  url: string | undefined,
  allowOverride = false
): DbGuardResult {
  if (!url) {
    return {
      safe: false,
      hasDatabase: false,
      reason: 'Keine DATABASE_URL gesetzt — Prisma läuft als Mock, Cleanup entfällt.',
    }
  }

  let host = ''
  let database = ''
  try {
    const parsed = new URL(url)
    host = parsed.hostname
    database = parsed.pathname.replace(/^\//, '')
  } catch {
    return {
      safe: false,
      hasDatabase: true,
      reason: `DATABASE_URL ist nicht parsebar und gilt daher als unsicher.`,
    }
  }

  const isHosted = HOSTED_PROVIDER_PATTERNS.some((pattern) => pattern.test(host))
  if (isHosted) {
    return {
      safe: false,
      hasDatabase: true,
      reason:
        `DATABASE_URL zeigt auf einen gehosteten Anbieter (${host}). ` +
        `Destruktive Tests sind dort grundsätzlich gesperrt, auch mit Override.`,
    }
  }

  const isLocal = LOCAL_HOSTS.has(host)
  const looksLikeTestDb = /(^|[_-])test(s)?([_-]|$)/i.test(database)

  if (isLocal || looksLikeTestDb || allowOverride) {
    return {
      safe: true,
      hasDatabase: true,
      reason: isLocal
        ? `Lokale Datenbank (${host}) — Cleanup erlaubt.`
        : looksLikeTestDb
          ? `Datenbankname "${database}" ist als Test-DB erkennbar — Cleanup erlaubt.`
          : `Override ALLOW_DESTRUCTIVE_DB_TESTS=true auf Nicht-Prod-Host (${host}) — Cleanup erlaubt.`,
    }
  }

  return {
    safe: false,
    hasDatabase: true,
    reason:
      `DATABASE_URL (${host}/${database}) ist nicht eindeutig als Test-Datenbank erkennbar.`,
  }
}

/**
 * Bricht den Testlauf ab, wenn die konfigurierte Datenbank nicht sicher
 * destruktiv behandelt werden darf. Gibt zurück, ob Cleanup laufen soll.
 */
export function assertSafeTestDatabase(
  env: Record<string, string | undefined> = process.env
): DbGuardResult {
  const result = evaluateDatabaseUrl(
    env.DATABASE_URL,
    env.ALLOW_DESTRUCTIVE_DB_TESTS === 'true'
  )

  // Ohne Datenbank ist nichts zu schützen: Prisma ist gemockt, Cleanup no-op.
  if (!result.hasDatabase) {
    return result
  }

  if (!result.safe) {
    const message = [
      '',
      '  ╔══════════════════════════════════════════════════════════════════╗',
      '  ║  TESTLAUF ABGEBROCHEN — unsichere DATABASE_URL                     ║',
      '  ╚══════════════════════════════════════════════════════════════════╝',
      '',
      `  ${result.reason}`,
      '',
      '  Die Testsuite leert vor jedem Test ALLE Tabellen. Gegen eine echte',
      '  Datenbank löscht das die Produktionsdaten. Deshalb der Abbruch.',
      '',
      '  So läufst du die Tests sicher:',
      '    • Nur Unit-Tests, ohne DB:   DATABASE_URL leeren  (Prisma nutzt dann einen Mock)',
      '    • Mit echter Test-DB:        DATABASE_URL auf eine Wegwerf-DB setzen,',
      '                                 deren Name "test" enthält oder auf localhost läuft',
      '    • Lokale Docker-DB o. Ä.:    ALLOW_DESTRUCTIVE_DB_TESTS=true setzen',
      '                                 (bei gehosteten Anbietern trotzdem gesperrt)',
      '',
    ].join('\n')

    throw new Error(message)
  }

  return result
}
