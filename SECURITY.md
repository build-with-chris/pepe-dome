# Sicherheit

Stand: 25. Juli 2026

Dieses Dokument beschreibt, wie die Plattform abgesichert ist, wo die Grenzen
liegen und was beim Weiterbauen zu beachten ist. Es richtet sich an alle, die
am Code arbeiten.

Was Chris einmalig selbst erledigen muss, steht getrennt in
[docs/UEBERGABE-SECURITY.md](docs/UEBERGABE-SECURITY.md).

---

## Das Grundprinzip: nichts ist erlaubt, bis es erlaubt wurde

Der schwerste Fehler in der bisherigen Fassung war ein freundlicher Default.
Wer eingeloggt war und keine Rolle hatte, galt automatisch als `editor`. Da sich
über Google jeder in Sekunden ein Konto anlegen konnte, hatte damit faktisch
jeder Mensch mit einem Google-Konto Schreibrechte auf Events, Artikel und
Newsletter.

Heute gilt durchgehend das Gegenteil. Ein Konto ohne ausdrückliche Freigabe hat
die Rolle `none` und damit gar nichts.

Beim Bauen an dieser Codebase gilt dieselbe Richtung: Wenn eine Prüfung nicht
entscheiden kann, lautet die Antwort *nein*. Ein Konfigurationsfehler soll
auffallen, nicht stillschweigend die Sicherung ausschalten.

---

## Wie der Zugang zum Admin-Bereich funktioniert

Drei Schichten, jede für sich wirksam:

**1. Middleware** (`src/middleware.ts`, `src/lib/admin-routes.ts`)
Alles unter `/admin` und `/api/admin` verlangt einen Login. Bewusst als
Wildcard, nicht als Liste einzelner Pfade — in der alten Liste fehlte
`/admin/test-recipients`, die Seite war ohne Login erreichbar. Eine neue
Admin-Seite ist jetzt automatisch geschützt.

**2. Rollen-Gate** (`src/app/admin/(dashboard)/layout.tsx`)
Ein Server-Layout vor jeder Seite der Route-Group. Wer keine Rolle hat, landet
auf `/admin/zugang`. Sign-in und Sign-up liegen in der Group `(auth)` und
laufen bewusst nicht durch dieses Gate, sonst drehte sich der Redirect im Kreis.

**3. Rollenprüfung je API-Route** (`requireApiRole` in `src/lib/roles.server.ts`)
Das Gate schützt die *Ansicht*. Die *Daten* schützt jede Route selbst. Diese
Trennung ist wichtig: Ein direkter Aufruf von `/api/admin/newsletters/<id>/send`
umgeht jede Seite.

### Rollen

| Rolle | Darf |
|---|---|
| `none` | nichts (Default für jedes neue Konto) |
| `viewer` | ansehen |
| `editor` | Events, Artikel, Newsletter anlegen und bearbeiten, Testversand |
| `super_admin` | zusätzlich löschen, echter Versand, Abonnenten, Freigaben |

Die verbindliche Quelle ist `publicMetadata.role` in Clerk. Daneben gibt es die
Bootstrap-Allowlist `SUPER_ADMIN_EMAILS` als Notausgang — ohne sie könnte nach
einem frischen Setup niemand die erste Rolle vergeben.

### Neue Personen freischalten

1. Person meldet sich an, landet ohne Rechte auf `/admin/zugang`.
2. Eine Anfrage entsteht, eine Mail geht an `info@pepe-dome.de`.
3. Der Link führt auf `/admin/freigabe?token=…`.
4. Dort wählt ein **eingeloggter Super Admin** die Rolle oder lehnt ab.

Zwei Schlösser: das Token aus der Mail **und** eine Super-Admin-Sitzung. Keines
allein genügt.

---

## Warum kein Link in einer Mail etwas verändert

Ein Muster, das an drei Stellen wiederkehrt und beim Weiterbauen einzuhalten ist:

> Ein GET-Aufruf darf niemals einen Zustand ändern.

Mailprogramme, Virenscanner und Link-Vorschauen rufen Links in Mails ungefragt
im Hintergrund auf. Ein GET-Link, der freischaltet oder abmeldet, wird dadurch
von allein ausgelöst — ohne dass ein Mensch geklickt hat.

Deshalb:

- **Freigabe**: Der Mail-Link öffnet nur eine Seite. Die Freigabe ist ein POST.
- **Abmeldung**: Der Mail-Link öffnet eine Rückfrage. Die Abmeldung ist ein POST.
- **Ausnahme mit Absicht**: `List-Unsubscribe` im Mail-Header zeigt auf
  `/api/subscribers/unsubscribe?token=…`, das per POST sofort abmeldet. Das
  verlangt RFC 8058 so, und Gmail blendet den Abmelde-Knopf sonst aus.

---

## Token im System

| Zweck | Feld | Lebensdauer |
|---|---|---|
| Double-Opt-in | `Subscriber.doubleOptInToken` | 7 Tage, danach verbraucht |
| Abmeldung | `Subscriber.unsubscribeToken` | dauerhaft |
| Admin-Freigabe | `AdminAccessRequest.token` | 7 Tage, einmalig |

Alle 256 Bit aus `crypto.randomBytes(32)`.

Das Abmelde-Token gilt bewusst unbegrenzt: Mails liegen jahrelang im Postfach,
und der Abmeldelink darin muss funktionieren. Vorher stand dort die
Subscriber-ID — kein Geheimnis, sie steht in jedem Export — und die Route
akzeptierte sogar die blosse E-Mail-Adresse. Mit einer Adressliste liess sich
der komplette Verteiler leeren.

---

## Bekannte Grenzen

Ehrlichkeit ist hier wichtiger als ein grüner Haken.

### Rate-Limiting greift nur begrenzt

`src/lib/rate-limit.ts` zählt im Arbeitsspeicher der jeweiligen
Serverless-Instanz. Auf Vercel laufen mehrere parallel und starten laufend neu.
Das Limit gilt damit **pro Instanz**, nicht global.

Es bremst Doppelklicks und plumpe Skripte, aber keinen entschlossenen Angreifer.
Für ein verlässliches Limit braucht es gemeinsamen Speicher (Upstash Redis oder
Vercel KV). Der Aufwand ist überschaubar, siehe Übergabedokument.

### Die CSP schränkt keine Skripte ein

`Content-Security-Policy` in `src/middleware.ts` setzt `base-uri`, `form-action`,
`object-src` und `frame-ancestors`. Diese Direktiven blockieren echte
Angriffswege und können nichts kaputtmachen.

Bewusst **nicht** gesetzt ist `script-src`. Das wäre der stärkste Schutz,
braucht aber Nonces für die Inline-Skripte von Next selbst und eine
vollständige Liste aller Fremdquellen. Ein Fehler darin legt die Seite still
lahm.

Der Weg dorthin, wenn es jemand angeht:

1. In `applySecurityHeaders` zusätzlich einen
   `Content-Security-Policy-Report-Only`-Header mit der strengen Fassung setzen.
2. Ein bis zwei Wochen die Verstösse in der Browser-Konsole sammeln.
3. Erst dann als scharfen Header übernehmen.

### Eine Next-Advisory bleibt offen

Zwei Meldungen zu `next` (HTTP Request Smuggling in Rewrites, unbegrenztes
Wachstum des `next/image`-Caches) haben **keine stabile Fix-Version** — auch das
aktuelle 16.2.11 liegt im verwundbaren Bereich.

Das Smuggling betrifft uns nicht: `next.config.ts` definiert keine `rewrites`.
Wir stehen auf 15.5.21, der aktuellsten Backport-Version. Beobachten, sobald
eine stabile Fassung erscheint, nachziehen.

### Lint-Werkzeuge tragen offene Meldungen

ESLint 10 würde sie beheben, ist aber mit dem `eslint-plugin-react` aus
`eslint-config-next` unverträglich (`contextOrFilename.getFilename is not a
function`). Wir stehen deshalb auf ESLint 9.39.5.

Es sind ReDoS-Meldungen in Werkzeugen, die nie auf dem Server laufen. `npm audit
--omit=dev` im CI ignoriert sie darum bewusst. Auflösen, sobald Upstream
nachzieht.

### Test-Datenbank

`tests/setup.ts` leert **alle Tabellen** vor und nach jedem Test. `npm test`
läuft daher ohne Datenbank gegen einen Mock. `tests/db-guard.ts` bricht jeden
Lauf ab, der auf einen gehosteten Anbieter zeigt. Diesen Schutz nie umgehen.

---

## Regeln für neuen Code

**Neue Admin-API-Route**

```ts
const guard = await requireApiRole(ROLES.EDITOR)
if (guard.response) return guard.response
```

Die Rolle nach der Wirkung wählen, nicht nach Bequemlichkeit: Alles, was echte
Mails an echte Menschen auslöst oder Daten löscht, ist `SUPER_ADMIN`.

**Neue Admin-Seite**
Unter `src/app/admin/(dashboard)/` anlegen, dann greift das Gate von selbst.

**JSON-LD oder anderes JSON in einem `<script>`-Tag**
Immer `jsonLdScriptContent()` aus `src/lib/json-ld.ts`, nie `JSON.stringify`
direkt. `JSON.stringify` escaped `<` nicht.

**Fehlermeldungen nach aussen**
Einzelheiten ins Log, nach draussen nur, *dass* etwas schiefging.
Prisma-Fehlertexte nennen Host, Port, Datenbank- und Benutzernamen.

**Antworten, die etwas über eine Person verraten**
Anmeldung, Abmeldung und Passwort-Abläufe antworten immer gleich, egal ob die
Adresse bekannt ist. Sonst wird der Endpunkt zur Auskunftsstelle über Dritte.

---

## Was automatisch läuft

| Wann | Was | Datei |
|---|---|---|
| Jeder Push und PR | Lint, Tests, Build | `.github/workflows/ci.yml` |
| Jeder Push, PR und montags | `npm audit`, CodeQL | `.github/workflows/security.yml` |
| Montags | Dependabot-PRs | `.github/dependabot.yml` |

`npm audit --omit=dev --audit-level=high` bricht den Lauf ab. Wird der Build
deswegen rot, ist das kein Ärgernis, sondern der Zweck.
