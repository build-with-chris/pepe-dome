# Tests

## Wichtig: Die Testsuite löscht Tabellen

`tests/setup.ts` räumt vor und nach **jedem** Test alle Tabellen per `deleteMany`
leer, damit Tests isoliert laufen. Gegen eine echte Datenbank löscht das die
echten Daten.

Deshalb gibt es eine Schutzschranke (`tests/db-guard.ts`): Zeigt `DATABASE_URL`
auf einen gehosteten Anbieter (Supabase, Neon, RDS …), **bricht der komplette
Lauf sofort ab**, bevor ein einziger Test läuft. Gehostete Anbieter sind auch
mit Override gesperrt.

## Wie man Tests ausführt

| Befehl | Was passiert |
|--------|--------------|
| `npm test` | Unit-Tests ohne Datenbank (`DATABASE_URL=` → Prisma-Mock). Schnell, kann nichts löschen. Standard. |
| `npm run test:watch` | Dasselbe im Watch-Modus. |
| `npm run test:db` | Voller Lauf inklusive DB-Tests. Braucht eine **Wegwerf-Test-DB** in `DATABASE_URL`. |

Für `npm run test:db` eine eigene Datenbank setzen, deren Name `test` enthält
oder die auf `localhost` läuft, z. B.:

```bash
DATABASE_URL="postgresql://postgres:pw@localhost:5432/pepe_test" npm run test:db
```

Lokale Docker-DB mit anderem Namen? Dann bewusst freischalten:

```bash
ALLOW_DESTRUCTIVE_DB_TESTS=true DATABASE_URL="postgresql://…@localhost:5432/dev" npm run test:db
```

**Niemals** die Produktions-`DATABASE_URL` aus `.env` für `test:db` verwenden.
Die Schranke fängt es ab, aber der richtige Weg ist eine getrennte Test-DB.
