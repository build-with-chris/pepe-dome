# Neue Datenbank einrichten (nach Render-Löschung)

Die App nutzt **PostgreSQL** mit Prisma. So richtest du eine neue Datenbank ein.

---

## 1. Neuen PostgreSQL-Host anlegen

Kostenlose Optionen (ohne Kreditkarte oder mit Free Tier):

### Option A: Neon (empfohlen, Free Tier)
1. Gehe zu [neon.tech](https://neon.tech) und registriere dich.
2. Neues Projekt anlegen → Region z.B. **Frankfurt**.
3. Unter **Connection string** die URL kopieren (Format: `postgresql://user:password@host/dbname?sslmode=require`).

### Option B: Supabase
1. Gehe zu [supabase.com](https://supabase.com) → dein Projekt auswählen.
2. Links: **Project Settings** (Zahnrad) → **Database**.
3. Unter **Connection string** den Tab **URI** wählen.
4. Die **URI** kopieren – sie sieht so aus:  
   `postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres`  
   **Wichtig:** Für Prisma brauchst du diese **Datenbank-Connection-URL**, nicht die Projekt-URL (`https://….supabase.co`) und nicht den API Key (anon/key). In der URI musst du `[YOUR-PASSWORD]` durch das Datenbank-Passwort ersetzen (das du beim Anlegen des Projekts vergeben hast; bei Bedarf unter **Database → Reset database password** neu setzen).

### Option C: Railway
1. Gehe zu [railway.app](https://railway.app) → New Project → **Provision PostgreSQL**.
2. In der DB-Service-Ansicht unter **Connect** die **Postgres Connection URL** kopieren.

### Option D: Render (kostenpflichtig nach Free Tier)
1. [render.com](https://render.com) → New → **PostgreSQL**.
2. Nach dem Erstellen unter **Info** die **Internal Database URL** oder **External Database URL** kopieren.

---

## 2. `DATABASE_URL` setzen

**Lokal (`.env`):**

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
```

Ersetze `USER`, `PASSWORD`, `HOST` und `DATABASE` mit den Werten aus deinem Anbieter.

**Vercel (Production):**

1. Vercel Dashboard → dein Projekt → **Settings** → **Environment Variables**.
2. `DATABASE_URL` anlegen und die gleiche Connection-URL eintragen (für Production die **External** URL des Anbieters verwenden).

---

## 3. Schema anwenden (Tabellen anlegen)

**Variante A – Prisma (empfohlen):** Im Projektordner im Terminal:

```bash
npm run db:migrate
```

Das führt `prisma migrate deploy` aus und legt alle Tabellen an.

**Variante B – SQL direkt in Supabase:** Wenn du die Tabellen lieber per SQL anlegen willst: Im Supabase Dashboard **SQL Editor** öffnen, den Inhalt der Datei **`prisma/supabase-init.sql`** einfügen und **Run** ausführen. Das erstellt alle Enums und Tabellen in einem Schritt. Danach bitte **nicht** mehr `npm run db:migrate` ausführen (die Tabellen existieren ja schon); Prisma erwartet dann die gleiche Struktur.

---

## 4. Optional: Startdaten einspielen (Events Jan/Feb 2026)

```bash
npm run db:seed
```

Das führt das Script `scripts/seed-jan-feb-2026.ts` aus und legt die definierten Events an (inkl. Bild-Download, falls URLs gesetzt sind).

---

## 5. Prüfen

- **Lokal:** `npm run dev` → z.B. `/events` aufrufen; Events sollten erscheinen, wenn du geseeded hast.
- **Vercel:** Nach dem Setzen von `DATABASE_URL` in Vercel einen neuen Deploy auslösen.

---

## Übersicht der Befehle

| Befehl | Beschreibung |
|--------|--------------|
| `npm run db:migrate` | Migrations anwenden (Tabellen anlegen/aktualisieren) |
| `npm run db:seed` | Seed-Script ausführen (Beispiel-Events anlegen) |
| `npm run db:reset` | **Vorsicht:** DB zurücksetzen (löscht alle Daten), dann Migrations neu anwenden |

---

## Tabellen (Prisma-Schema)

- **events** – Veranstaltungen  
- **articles** – News-Artikel  
- **subscribers** – Newsletter-Abonnenten  
- **newsletters** – Newsletter-Entwürfe/versendet  
- **newsletter_content** – Inhalte pro Newsletter  
- **newsletter_stats** – Öffnungs-/Klickstatistik  
- **newsletter_events** – Events pro Empfänger (opens, clicks)  
- **test_recipients** – Test-Empfänger für Newsletter  

Nach dem Anlegen der DB und optionalem Seed sind Events und der Rest der App nutzbar; Newsletter-Versand funktioniert mit konfigurierter Resend-API.
