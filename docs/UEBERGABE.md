# Übergabeprotokoll

Stand: 24. Juli 2026 · Branch `main` · letzter Commit `e88451a`

Zusammenfassung einer Arbeitsphase an Newsletter-Infrastruktur, Landingpage,
Trainings- und Café-Seite. Sortiert nach Dringlichkeit: zuerst was noch offen
ist, dann die Erkenntnisse, die man kennen muss, bevor man hier weiterarbeitet.

---

## 1. Offen: braucht eine Entscheidung oder einen Handgriff

| # | Thema | Was zu tun ist | Warum es wichtig ist |
|---|-------|----------------|----------------------|
| 1 | **Suppression-Cron** | Im Vercel-Dashboard `/api/cron/sync-suppressions` täglich einplanen (z. B. `0 4 * * *`) | Code ist fertig und getestet, läuft aber noch nicht automatisch |
| 2 | **`email.delivered` in Resend** | Prüfen, ob das Event im Webhook abonniert ist | `deliveredCount` steht auf 0, während Öffnungen reinlaufen. Zustellrate sonst nicht messbar |
| 3 | **Einwilligungslage** | Entscheiden, wie mit 189 ACTIVE ohne Bestätigungsnachweis umgegangen wird | Rechtliches Risiko, siehe Abschnitt 3.3 |
| 4 | **`DEEPL_API_KEY`** | In `.env` und Vercel eintragen | Ohne den Key ist der Übersetzen-Button im Event-Admin funktionslos |
| 5 | **Café-Bilder** | Zwei Fotos in höherer Auflösung liefern | „Chris im Café" und „entspannte Atmosphäre" liegen nur in ~141 px vor, daher aktuell nur klein eingesetzt |
| 6 | **`.claude/worktrees`** | Nichts tun, nur wissen | Wurde versehentlich versioniert und in `0cd01d3` wieder entfernt, steht jetzt in `.gitignore` |

> **Keine `vercel.json` anlegen, ohne den bestehenden Newsletter-Cron zu übernehmen.**
> Es gibt derzeit keine `vercel.json`; der Versand-Cron ist im Dashboard konfiguriert.
> Eine neue `vercel.json` mit Crons würde die Dashboard-Konfiguration ersetzen und den
> Newsletter-Versand stilllegen.

---

## 2. Die wichtigste Erkenntnis: Das Newsletter-Tracking war vollständig blind

Über **alle** bisherigen Versände hinweg, bis zu 1736 Empfänger pro Kampagne, standen
sämtliche Engagement-Zahlen auf null: keine Zustellungen, keine Öffnungen, keine Klicks,
keine Bounces. In der Event-Tabelle existierten ausschließlich `SENT`-Einträge, die der
Sendecode selbst schreibt. Bei **0 von 1569** Abonnent:innen war je ein `lastOpenAt` gesetzt.

Die Interaktionsrate war also nie schlecht, sie wurde schlicht nie erfasst.

Ursache waren **drei hintereinanderliegende Fehler**. Jeder einzelne hätte für sich genommen
gereicht, um das gesamte Tracking auszuhebeln:

**a) Signaturprüfung (`aa22b64`)**
`verifyWebhookSignature` las einen Header `resend-signature`, den Resend gar nicht sendet, und
verglich ihn per Gleichheit mit dem Secret. Resend signiert über Svix
(`svix-id` / `svix-timestamp` / `svix-signature`, HMAC-SHA256). Da `RESEND_WEBHOOK_SECRET`
gesetzt war, wurde jeder eingehende Webhook mit **401** abgewiesen.
Jetzt korrekte Svix-Verifikation ohne zusätzliche Abhängigkeit, gegen den offiziellen
Svix-Testvektor geprüft. Wichtig dabei: Die Signatur gilt für den **Roh-Body**, deshalb wird
`request.text()` vor dem Parsen gelesen.

**b) Fehlende Zuordnung (`4b790f9`)**
Der Versand speicherte die Resend-`email_id` nicht, der Webhook ordnete Events ausschließlich
über `tags` zu. Ohne Tags wären Events selbst nach Fix (a) niemandem zuzuordnen gewesen.
Jetzt landet die `email_id` in `NewsletterEvent.resendEventId` (Feld existierte, blieb leer),
und der Webhook nutzt sie als Fallback. Index dafür ist angelegt.

**c) Tag-Format (`68c907e`)**, der Fehler, der nach (a) und (b) noch übrig blieb
Beim Versand werden Tags als **Array** `[{ name, value }]` gesetzt, im Webhook-Payload liefert
Resend sie als **Objekt-Map** `{ name: value }`. `tags.find(...)` warf dadurch bei jedem
einzelnen Event einen `TypeError`, direkt nach der bestandenen Signaturprüfung. In den Logs
sichtbar als durchgehende `500` mit `a.find is not a function`.
`getTagValue()` liest jetzt beide Formen und ignoriert unerwartete Formate, statt zu crashen.

**Belegter Verlauf im Log:** bis 18:12:52 durchgehend `500`, ab 18:13:26 (neues Deployment)
`200` mit korrekt gelesener `subscriberId` und `newsletterId`. Erste Events sind in der DB
angekommen. Resend liefert fehlgeschlagene Webhooks mit wachsendem Abstand nach, die Zahlen
füllen sich also noch.

---

## 3. Weitere Erkenntnisse, nach Tragweite

### 3.1 Zustellbarkeit der Bestätigungsmail (`2710eaf`)

Die Double-Opt-in-Mail ging **HTML-only und ohne `List-Unsubscribe`-Header** raus. Genau die
erste Mail landete dadurch überdurchschnittlich oft im Spam, was die niedrige Bestätigungsrate
gut erklärt. DNS (SPF, DKIM, DMARC) war dagegen in Ordnung.
Bestätigungs-, Welcome- und Newsletter-Mail haben jetzt einen Plain-Text-Teil; die
Bestätigungsmail zusätzlich die `List-Unsubscribe`-Header, die Gmail und Yahoo seit 2024 für
Bulk-Mail verlangen.

### 3.2 CSS-Landmine: unlayered Tailwind-Duplikate

In `src/styling/components.css` lag ein handgeschriebener Block, der Tailwind-Utilities
außerhalb von `@layer` nachbaute. Unlayered CSS schlägt `@layer utilities` immer. Folgen,
site-weit und lange unbemerkt:

- **Alle** `bg-gradient-to-*`-Verläufe waren unsichtbar (`background-image: none`), weil ein
  alter Tailwind-v3-Gradient-Shim mit v4-Stops ein ungültiges Gradient erzeugte
- Sämtliche responsiven Varianten (`sm:`, `md:`, `lg:`) wurden ausgehebelt; das Event-Grid
  blieb dadurch immer einspaltig

Behoben: Shim entfernt, restliche Duplikate in `@layer components` gewrappt.
**Regel für die Zukunft:** Custom-CSS in `styling/*.css` gehört in `@layer components`.
Bei „diese Tailwind-Klasse wirkt nicht" zuerst dort nach einer unlayered Doppelung suchen.

### 3.3 Einwilligungslage der Mailingliste

121 unbestätigte Abonnent:innen wurden auf ausdrückliche Entscheidung des Betreibers manuell
auf `ACTIVE` gesetzt, obwohl kein Double-Opt-in-Klick vorlag. Die rechtlichen und
reputationsseitigen Risiken wurden vorher benannt und bewusst getragen.

Umsetzung bewusst so:
- `confirmedAt` bleibt **leer**, weil keine Bestätigung existiert. Ein gesetzter Zeitstempel
  wäre ein falscher Nachweis
- In `metadata` steht `activation: "manual_bulk"` mit Zeitstempel und Begründung

Dadurch ist die Gruppe jederzeit identifizierbar und die Änderung umkehrbar.
**Gesamtstand: 189 ACTIVE ohne `confirmedAt`**, also die 121 plus 68, die schon vorher ohne
Nachweis aktiv waren, vermutlich aus einem Import.

### 3.4 Statische Seiten plus Vercel-Build-Cache

Die Café-Seite wird als SSG vorgerendert. Ein Vercel-**Redeploy nutzt den Build-Cache** und
rendert statische Seiten nicht neu. Nach dem Nachtragen von `GOOGLE_PLACES_ID` blieb der
Review-Slider deshalb leer, obwohl alles korrekt konfiguriert war.
Gelöst, indem die Reviews zur Laufzeit über `/api/cafe-reviews` geladen werden (`6a1144f`).
**Merksatz:** Alles, was von nachträglich änderbaren Env-Variablen abhängt, nicht zur Bauzeit
in eine statische Seite backen.

### 3.5 Prisma-Migrationen sind gedriftet

`prisma migrate dev` will die **Produktionsdatenbank zurücksetzen**, weil die
Migrationshistorie nicht zum Schema passt. Das darf nicht passieren.
Schemaänderungen wurden deshalb additiv per `prisma db execute` eingespielt
(`events.translations`, Index auf `newsletter_events.resend_event_id`).
**Vor dem nächsten größeren Schema-Schritt sollte die Migrationshistorie bereinigt werden.**

### 3.6 Build-brechender Rest eines Umbaus (`71dd25b`)

Die Kontaktseite war halbfertig umgebaut: Der Server-Wrapper übergab `phone`, der Client
erwartete `whatsapp`. `next build` scheiterte am Typfehler, das Deployment wäre blockiert
gewesen. Behoben, das Formular mit Rückruf-, WhatsApp- und E-Mail-Kanal läuft.

### 3.7 Resend-API-Grenzen

- `GET /emails/{id}` liefert für **Batch-versendete** Mails durchgehend `404`. Ein
  rückwirkender Statusabgleich über gespeicherte Mail-IDs ist damit nicht möglich
- `GET /suppressions` funktioniert und ist die verlässliche Quelle für unterdrückte Adressen
- Aktuell 5 Suppressions im Account, alle Bounces, **keine davon aus der Pepe-Dome-Liste**
  (stammen vom zweiten Projekt `gddc-sh.de` im selben Account)

---

## 4. Was inhaltlich umgebaut wurde

**Startseite (`09ee1e8`, `94b6ed5`, `b096c53`)**
Struktur folgt jetzt den Besucherfragen: Nutzenversprechen als H1 statt Markenname, Events und
„Was dich erwartet" direkt nach dem Hero, Feature-Karten verlinkt statt Sackgassen, Vision und
Mission auf die Über-uns-Seite verschoben, Pressestimmen von SZ und tz ergänzt.
Hero-Kontrast über einen radialen Scrim hinter dem Titel abgesichert, damit die Schrift
unabhängig vom Video-Frame lesbar bleibt.

**Trainingsseite (`83bc740`)**
Buchung war unverständlich, weil zwei Anbieter im Spiel sind. Jetzt zwei klar getrennte Wege
(Eversports für eigene Kurse, Aircrobatic Studios für Luftakrobatik), Wellpass und Urban Sports
Club als „in Vorbereitung" ausgewiesen. Veraltete Termine entfernt, Texte auf Evergreen
umgestellt. Das Disziplinen-Grid ist raus, weil es Angebote ohne existierende Kurse listete.

**Café-Seite (`3ad95ce`, `fb4cc58`, `6a1144f`)**
Neu, inklusive Menüpunkt. Bild-Hero, Öffnungszeiten, Atmosphäre und ein Google-Review-Slider,
der die Bewertungen zur Laufzeit über die Places API zieht (aktuell 5,0 bei 17 Bewertungen).
Eigene Anreise-Sektion mit drei Wegen, weil Besucher den Dome häufig nicht finden. Die
Ortsnamen stammen aus der Zulieferer-Anfahrtskarte, nicht aus Vermutungen:
**Abenteuerspielplatz Maulwurfshausen**, Michaeligarten, U-Bahn Quiddestraße.

**Artikel und Navigation (`a2151cb`, `050ba43`)**
Artikel-Layout mit Hero-Titel und einem Renderer, der die Klartext-Konventionen der
DB-Inhalte erkennt (Zwischenüberschriften, Zitate, Listen). Hauptmenü verschlankt, News und
Business liegen im „Mehr"-Dropdown.

**Events auf Englisch (`3f4fe04`)**
Neue JSONB-Spalte `events.translations`. Deutsch bleibt die Quelle, fehlende englische Felder
fallen feldweise auf Deutsch zurück. Im Admin gibt es einen DeepL-Button plus editierbare
Felder für Korrekturen.

**Sprachstil (`71dd25b`)**
Auf Wunsch wurden alle Gedankenstriche aus der sichtbaren Copy entfernt und die Sätze
umformuliert statt nur Zeichen getauscht. Wort-Bindestriche bleiben.
**Diese Vorgabe gilt weiter.** DB-Inhalte wurden bewusst nicht angefasst.

---

## 5. Umgebungsvariablen

| Variable | Zweck | Status |
|----------|-------|--------|
| `RESEND_API_KEY` | Mailversand, Suppression-Abgleich | gesetzt, Vollzugriff |
| `RESEND_WEBHOOK_SECRET` | Svix-Signaturprüfung | gesetzt, verifiziert funktionsfähig |
| `GOOGLE_PLACES_API_KEY` / `GOOGLE_PLACES_ID` | Café-Reviews | gesetzt, live verifiziert |
| `CRON_SECRET` | Absicherung der Cron-Routen | gesetzt |
| `DEEPL_API_KEY` | Event-Übersetzung im Admin | **fehlt noch** |
| `DIRECT_DATABASE_URL` | Prisma-Migrationen | lokal ergänzt |
| `NEXT_PUBLIC_DISABLE_CLERK_IN_DEV` | lokal Admin ohne Login | lokal `true`, dadurch sind Admin-Seiten **lokal nicht aufrufbar** |

---

## 6. Nächste sinnvolle Schritte

Sobald das Tracking ein paar Tage Daten gesammelt hat, greifen die eigentlichen Hebel für die
Interaktionsrate, in dieser Reihenfolge:

1. **Betreffzeilen**, größter Einfluss auf die Öffnungsrate, jetzt erstmals messbar
2. **Versandzeitpunkt**, bisher sehr uneinheitlich (06:08, 07:07, 09:19, 14:03)
3. **Nachfassen an Nicht-Öffner** nach drei bis vier Tagen mit anderer Betreffzeile,
   erfahrungsgemäß 20 bis 30 Prozent zusätzliche Reichweite
4. **Segmentierung** über das vorhandene, aber ungenutzte Feld `subscribers.interests`

Beim nächsten Versand außerdem Bounce- und Beschwerdequote beobachten. Über rund 2 Prozent
Bounces oder 0,1 Prozent Beschwerden sollte die manuell aktivierte Gruppe separat betrachtet
werden. Hard Bounces und Beschwerden tragen sich seit dem Webhook-Fix automatisch aus.

Offene größere Baustelle: Die **Über-uns-Seite** hat zehn Sektionen, von denen mehrere
(Ökosystem, Netzwerk, Forschung) eher Förderer als Besucher ansprechen. Kandidat für eine
eigene Unterseite.
