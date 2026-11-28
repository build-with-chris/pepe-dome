# Pepe Dome

Website, Admin und Newsletter für den Pepe Dome, die geodätische Kuppel im Ostpark München.

## Technik

- **Next.js 15** mit App Router, React 19, TypeScript
- **Tailwind CSS 4**
- **PostgreSQL** über Prisma 6 (gehostet bei Supabase)
- **Clerk** für den Login im Admin
- **Resend** für Newsletter und Bestätigungsmails
- **Vitest** für Tests

## Entwicklung

```bash
npm run dev
```

Die Seite läuft dann unter [http://localhost:3004](http://localhost:3004).

**Wichtig:** Die `.env` enthält die Produktionsdatenbank. Vor Tests und
Datenbankbefehlen [CLAUDE.md](CLAUDE.md) und [tests/README.md](tests/README.md)
lesen.

## Befehle

| Befehl | Was es tut |
|---|---|
| `npm run dev` | Entwicklungsserver auf Port 3004 |
| `npm run build` | Prisma-Client erzeugen und Produktions-Build bauen |
| `npm run lint` | ESLint |
| `npm test` | Tests ohne Datenbank (sicher) |
| `npm run test:db` | Tests mit Datenbank, nur gegen eine Wegwerf-Test-DB |
| `npm run db:migrate` | Offene Migrationen anwenden (`prisma migrate deploy`) |
| `npm run newsletter:preview` | Newsletter-Layout lokal als HTML ansehen |

## Aufbau

```
src/
  app/          Seiten und API-Routen (App Router)
  components/   React-Komponenten
  lib/          Datenzugriff, Mailversand, Verträge, Hilfsfunktionen
  i18n/         Sprachen (de, en)
prisma/         Schema und Migrationen
scripts/        Hilfsskripte für Bilder und Newsletter-Vorschau
tests/          Vitest
docs/           Anleitungen und Konzepte
```

## Weitere Doku

- [SECURITY.md](SECURITY.md): wie Login, Rollen und Schutzmaßnahmen funktionieren
- [docs/DATABASE_SETUP.md](docs/DATABASE_SETUP.md): Datenbank einrichten
- [docs/newsletter-system.md](docs/newsletter-system.md): Newsletter
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md): Farben, Schriften, Abstände
