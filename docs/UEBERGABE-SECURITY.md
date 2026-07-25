# Übergabe: Was du selbst erledigen musst

Stand: 25. Juli 2026

Alles hier sind Schritte, die ich nicht für dich machen konnte, weil sie
Zugangsdaten, fremde Oberflächen oder eine bewusste Entscheidung von dir
brauchen. Die technische Begründung zu jedem Punkt steht in
[SECURITY.md](../SECURITY.md).

Die Reihenfolge ist wichtig. **Punkt 1 und 2 vor dem Deploy**, sonst sperrst du
dich selbst aus.

---

## 🔴 Vor dem Deploy

### 1. Umgebungsvariablen in Vercel setzen

Vercel → Projekt → Settings → Environment Variables.

| Variable | Wert | Umgebung | Warum |
|---|---|---|---|
| `SUPER_ADMIN_EMAILS` | `chris.hermann9397@gmail.com` | Production, Preview | **Ohne das kommt niemand mehr ins Panel.** Diese Adresse ist immer Super Admin, unabhängig von Clerk. Dein Notausgang. |
| `ADMIN_APPROVAL_EMAIL` | `info@pepe-dome.de` | Production, Preview | Adresse für Freigabe-Anfragen. Ohne Angabe gilt genau dieser Wert als Default — du kannst die Variable also auch weglassen. |
| `RESEND_WEBHOOK_SECRET` | dein `whsec_…` aus Resend | Production | **Neu verpflichtend.** Der Webhook weist Requests jetzt ab, wenn das Secret fehlt. Vorher wurden unsignierte Requests angenommen. |
| `CRON_SECRET` | langer Zufallswert | Production | War schon nötig, prüf nur, dass er wirklich gesetzt ist. |
| `NEXT_PUBLIC_APP_URL` | `https://pepe-dome.de` | Production | Steckt in jedem Abmelde- und Bestätigungslink. Steht hier localhost, zeigen alle Links ins Leere. |

Prüf ausserdem: **`NEXT_PUBLIC_DISABLE_CLERK_IN_DEV` darf in Production nicht
gesetzt sein.** Der Code fängt das über `NODE_ENV` ab, aber die Variable hat in
Production nichts zu suchen. Lokal in deiner `.env` steht sie auf `true`, das ist
so gewollt und bleibt.

`SUPER_ADMIN_EMAILS` und `ADMIN_APPROVAL_EMAIL` habe ich dir lokal schon in die
`.env` geschrieben.

### 2. Datenbank-Migrationen einspielen

Zwei neue Migrationen liegen bereit:

- `20260725120000_add_admin_access_requests` — Tabelle für Zugriffsanfragen
- `20260725140000_add_subscriber_unsubscribe_token` — Abmelde-Token, füllt
  bestehende Abonnenten automatisch mit einem Zufallswert

```bash
npm run db:migrate
```

Das ist `prisma migrate deploy` und wendet nur offene Migrationen an. Es löscht
nichts. Läuft auch automatisch mit, wenn dein Vercel-Build das vorsieht — dann
kontrollier nur, dass beide Migrationen als angewendet auftauchen.

> **Nicht** `npm run db:reset` oder `vitest` mit der Produktions-`.env` starten.
> Beides leert die Datenbank.

---

## 🟠 Direkt nach dem Deploy

### 3. Bestehende Team-Konten freischalten

Durch die Umstellung auf „kein Zugriff als Default" ist **jedes bestehende
Clerk-Konto ausgesperrt**, ausser deinem aus `SUPER_ADMIN_EMAILS`.

Das ist so gewollt, aber es betrifft womöglich Kolleginnen und Kollegen.

Zwei Wege:

**A. Sie melden sich neu an.** Sie landen auf der Warteseite, du bekommst eine
Mail an info@pepe-dome.de, klickst den Link und vergibst die Rolle. Das ist der
vorgesehene Weg und gleich ein Test des neuen Ablaufs.

**B. Du setzt die Rolle direkt.** Clerk-Dashboard → Users → Person →
Metadata → Public metadata:

```json
{ "role": "editor" }
```

Erlaubt sind `viewer`, `editor`, `super_admin`.

### 4. Selbsttest des Freigabe-Ablaufs

Bitte einmal wirklich durchspielen, das lässt sich von hier aus nicht prüfen:

1. Mit einem fremden Google-Konto auf `/admin/sign-in` anmelden
2. Landet es auf `/admin/zugang`? (statt im Panel)
3. Kommt die Mail bei info@pepe-dome.de an?
4. Führt der Link zu `/admin/freigabe`?
5. Schaltet ein Klick auf „Als Editor freigeben" das Konto frei?
6. Danach: Konto in Clerk wieder löschen

### 5. Abmeldelink testen

**Das war kaputt.** Der Abmeldelink in *jeder* bisher versendeten Mail zeigte auf
eine Route, die es nie gab — ein 404. Es gab damit faktisch keinen
funktionierenden Opt-out, was bei der DSGVO ein echtes Problem ist.

Bitte einmal einen Testversand an dich selbst und dann:

- Der Link im Fussbereich der Mail öffnet eine Seite mit Rückfrage
- Der Knopf dort meldet tatsächlich ab
- In Gmail: Der eingebaute „Abmelden"-Knopf oben neben dem Absender funktioniert

---

## 🟡 In den nächsten Tagen

### 6. Sicherheitsfunktionen auf GitHub einschalten

Das Repository `build-with-chris/pepe-dome` ist **öffentlich**. Alle folgenden
Funktionen sind für öffentliche Repos kostenlos.

Settings → Advanced Security (bzw. Code security and analysis):

- ☑ **Dependabot alerts**
- ☑ **Dependabot security updates**
- ☑ **Secret scanning** und **Push protection** — verhindert, dass jemals ein
  API-Key eingecheckt wird
- ☑ **CodeQL** — der Workflow liegt schon bereit unter
  `.github/workflows/security.yml`

Die Konfiguration für Dependabot liegt in `.github/dependabot.yml`: wöchentlich
montags, gebündelt, maximal fünf offene PRs. Major-Sprünge bei Next und React
sind ausgenommen, die brauchen eine geplante Migration.

### 7. Dass das Repo öffentlich ist, einmal bewusst entscheiden

Ich habe die gesamte Git-Historie nach Zugangsdaten durchsucht: **es wurde nie
ein echtes Secret eingecheckt.** Die Treffer in `docs/setup.md` sind Platzhalter
wie `re_123456789abcdefghijklmnop`. Die `.env` war nie im Repository.

Trotzdem zwei Dinge zum Nachdenken:

- Der Supabase-Host steht in `next.config.ts` und ist damit öffentlich bekannt.
  Zusammen mit einem schwachen Datenbank-Passwort ist das eine Einladung. Das
  Passwort in deiner `.env` sieht nach Initialen plus Jahreszahl aus. **Ich würde
  es in Supabase auf einen langen Zufallswert ändern** und danach in Vercel und
  lokal nachziehen. Nicht dringend, aber lohnend.
- Öffentliches Repo heisst: Jeder liest mit, wie die Absicherung funktioniert.
  Das ist grundsätzlich in Ordnung — Sicherheit darf nicht davon abhängen, dass
  niemand den Code kennt. Nur sollte es eine bewusste Entscheidung sein.

### 8. Vercel-Cron prüfen

Ich habe `/api/cron/send-scheduled-newsletters` in `vercel.json` eingetragen.
**Der geplante Newsletterversand lief bisher nie**, weil der Eintrag fehlte.

Wichtig: Im **Hobby-Plan** erlaubt Vercel nur zwei Cron-Jobs und nur einmal
täglich. Eingetragen ist stündlich (`0 * * * *`). Falls du auf Hobby bist,
schlägt der Deploy fehl oder der Job läuft nur täglich. Dann entweder auf Pro
gehen oder in `vercel.json` auf `0 9 * * *` ändern.

---

## 🟢 Wenn du Zeit hast

### 9. Echtes Rate-Limiting

Aktuell zählt das Limit im Arbeitsspeicher jeder Serverless-Instanz. Bei
mehreren Instanzen gilt es damit vervielfacht, nach einem Kaltstart ist der
Zähler leer. Es bremst Doppelklicks, keinen Angreifer.

Der saubere Weg: Vercel → Storage → Upstash Redis anlegen (kostenloses
Kontingent reicht hier locker), dann `@upstash/ratelimit` einbauen. Betrifft nur
`src/lib/rate-limit.ts`, die aufrufenden Routen bleiben unverändert. Ein bis
zwei Stunden Arbeit.

### 10. Strengere Content-Security-Policy

Ich habe die Direktiven gesetzt, die nichts kaputtmachen können. Die stärkste
Schutzwirkung hätte `script-src` — die schaltet man aber nicht blind scharf,
sonst bleibt die Seite weiss. Der schrittweise Weg steht in
[SECURITY.md](../SECURITY.md) unter „Bekannte Grenzen".

### 11. 21 Hinweise aus dem neuen Linter

Das ESLint-Update brachte die React-Compiler-Regeln mit. Sie melden 21 Stellen
im Bestand über 15 Dateien, überwiegend `setState` direkt in einem Effect. Das
sind Korrektheitshinweise, kein Sicherheitsthema.

Ich habe sie auf `warn` gestellt, damit `npm run lint` nicht dauerhaft rot ist
und echte neue Fehler nicht im Altbestand untergehen. Sichtbar mit:

```bash
npm run lint
```

Wenn die Stellen aufgeräumt sind, in `eslint.config.mjs` wieder auf `error`
setzen.

---

## Was ich verändert habe

**Zugang und Rollen**
- Rollen-Default von `editor` auf `none` — der Kern des Problems
- Middleware schützt alles unter `/admin` und `/api/admin` statt einer Liste, in
  der `/admin/test-recipients` fehlte
- Server-seitiges Rollen-Gate über eine eigene Route-Group
- 40 Admin-API-Handler von „nur eingeloggt" auf echte Rollenprüfung; Versand,
  Löschen und Abonnenten sind jetzt Super Admin
- Freigabe-Ablauf mit Mail, Einmal-Token und POST-Bestätigung
- `/api/admin/debug-role` entfernt (gab Nutzer-Metadaten aus)

**Öffentliche Oberfläche**
- Abmeldung braucht jetzt ein Token; vorher genügte eine fremde Adresse, um
  jeden auszutragen
- Abmeldeseite gebaut — der Link führte bisher in einen 404
- Stored XSS über JSON-LD geschlossen (fünf Stellen)
- Speicher-DoS über `/api/newsletter-image` gestoppt: gemessen 43 Sekunden und
  5,9 GB pro anonymem Request, jetzt 9 Millisekunden
- SSRF über Weiterleitungen unterbunden, Download-Grösse begrenzt
- Anmeldung verrät nicht mehr, ob eine Adresse bekannt ist
- Wiederanmeldung nach Abmeldung wieder möglich, aber nur mit neuer Bestätigung
- Rohe Prisma-Fehler flogen aus der öffentlichen Events-API
- Rate-Limit-Schlüssel war vom Aufrufer frei wählbar
- Webhook nimmt ohne Secret keine Requests mehr an
- CSP und HSTS ergänzt
- CSV-Formel-Injection im Abonnenten-Export
- E-Mail-Adressen werden vereinheitlicht (Gross-/Kleinschreibung)

**Aus dem Gegen-Review nachgezogen**

Ich habe meine eigenen Änderungen anschliessend noch einmal von unabhängigen
Prüfern zerlegen lassen. Dreizehn Einwände hielten stand, darunter ein Fehler,
den ich selbst eingebaut hatte:

- **Anlegen von Abonnenten über das Panel war kaputt.** Das neue Pflichtfeld
  `unsubscribeToken` fehlte im Admin-Pfad, Prisma hätte bei jedem Versuch einen
  500er geworfen. Das Feld hat jetzt zusätzlich einen Datenbank-Default, damit
  auch künftige Codepfade nicht danebengreifen können.
- **Ein Editor konnte den Inhalt einer bereits terminierten Ausgabe
  umschreiben** — der Cron hätte den neuen Text an alle Abonnenten geschickt.
  Damit hätte ein Editor genau das erreicht, was ihm verwehrt ist. Terminierte
  und laufende Ausgaben sind jetzt für Editoren gesperrt.
- **Die Abmeldeseite meldete Erfolg, auch wenn nichts passiert ist.** Wer einen
  alten Link anklickte, hielt sich für abgemeldet und bekam weiter Post.
- E-Mail-Vereinheitlichung fehlte im Admin-Formular
- Security-Header fehlten auf Weiterleitungen und 401-Antworten
- Testversand erzeugte einen Abmeldelink, der nie jemanden austrägt
- EXIF-gedrehte Hochformate wurden beim Zuschnitt falsch beschnitten

**Abhängigkeiten**
- Von 29 auf 8 Schwachstellen, **keine kritischen mehr**, nichts Hohes mehr im
  Produktionscode
- `@clerk/nextjs` hatte eine kritische Lücke, die Middleware-Schutz umgehen liess
- `sharp` wurde in `src/lib/email-image.ts` importiert, stand aber gar nicht in
  den Abhängigkeiten — die App lief auf einer zufällig mitgelieferten Version
  mit vier libvips-CVEs
- ESLint auf Flat-Config umgestellt

**Automatisierung**
- CI mit Lint, Tests und Build
- Wöchentlicher Sicherheits-Workflow mit `npm audit` und CodeQL
- Dependabot

**Tests**
- 292 Tests, alle grün. Vorher waren drei rot (sie zeigten seit der
  i18n-Umstellung auf die falsche Seite).
- `npm run lint` ohne Fehler, `npm audit --omit=dev` ohne Befund.
- Neu abgesichert: Rollenlogik, geschützte Pfade, JSON-LD-Escaping,
  Bild-Grenzen, Rate-Limit-Schlüssel, Abmelde-Validierung

---

## Wenn du dich aussperrst

Kein Grund zur Panik. `SUPER_ADMIN_EMAILS` wirkt unabhängig von allem, was in
Clerk steht. Setz die Variable in Vercel auf deine Adresse, stoss ein
Redeployment an, melde dich neu an.

Falls auch das nicht greift, hilft immer noch der direkte Weg über
Clerk-Dashboard → Users → deine Person → Public metadata → `{"role":
"super_admin"}`.
