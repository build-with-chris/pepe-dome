# Spec: Event-Verteilsystem

**Status**: Ready for Review
**Priority**: Phase 1 hoch, Phase 2 bis 4 mittel, Phase 5 bewusst nicht bauen
**Target**: Ein Event einmal im Dome anlegen, danach möglichst weit außen sichtbar
**Owner**: Development Team
**Datum**: 2026-07-26

---

## 0. Die unbequeme Kernaussage zuerst

Die ursprüngliche Idee hinter der Tabelle war: Event einmal anlegen, automatisch überall
veröffentlichen. Die Recherche zeigt, dass diese Idee für den größeren Teil der sechs
angelegten Kanäle nicht aufgeht, und zwar nicht wegen fehlender Entwicklungszeit,
sondern weil es die Schnittstellen nicht gibt.

- **Ein Facebook-Event lässt sich nicht per API anlegen.** Der Endpunkt ist weg.
- **Rausgegangen hat keinen Feed-Import.** Nachgewiesen, nicht vermutet. Der Enum-Wert
  `rausgegangen_feed` beschreibt etwas, das nicht existiert.
- **In keinen großen Münchner Kalender führt ein kostenloser Selbstbedienungs-Feed.**
  Nicht muenchen.de, nicht IN München, nicht die Stadtmagazine.
- **Google Business Profile** ginge technisch, kostet aber zwei Google-Freigabeverfahren
  und läuft bis zur zweiten Freigabe alle 7 Tage ab.

Was übrig bleibt, ist trotzdem viel wert, aber es teilt sich in zwei Sorten Arbeit:

1. **Automatisieren, was automatisierbar ist:** eigene Feeds (ICS, JSON-LD),
   Eventbrite, Meta-Beiträge.
2. **Manuelle Eintragung billiger machen**, statt sie wegzuwünschen: Serientermine,
   Self-Publish-Rechte, vorbereitete Textbausteine.

Ein Spec, der sechs Adapter verspricht, wäre gelogen. Dieser hier plant drei echte
Adapter, zwei eigene Feeds und einen ehrlichen Umgang mit dem Rest.

---

## 1. Stand heute (Analyse, nicht Vermutung)

### 1.1 Was in der Datenbank liegt

`prisma/schema.prisma:204-227` enthält `EventDistribution` mit `@@unique([eventId, channel])`,
dazu die Enums `DistributionChannel` (`:352-362`) und `DistributionStatus` (`:364-371`).
Die Tabelle existiert seit `prisma/migrations/0_init/migration.sql:96-107`.

**Die Tabelle hat null Zeilen und wird von keiner einzigen Codestelle angesprochen.**
Bestätigt durch:

- `grep` über `src/`, `scripts/`, `docs/`: null Treffer für `EventDistribution` oder `prisma.eventDistribution`
- `git log --all` über alle 20 Branches: es wurde nie Verteil-Code committet

Der Kommentar im Schema (`:205-210`) beschreibt das korrekt: ein angefangenes Feature,
das nur deshalb im Schema steht, damit Prisma nicht bei jeder Migration vorschlägt, es zu löschen.

### 1.2 Was nicht existiert

Gesucht und **nicht gefunden**:

- keine `.ics`-Route, kein `text/calendar`, kein `BEGIN:VCALENDAR` irgendwo im Repo
- kein RSS, kein Atom, kein eigenständiger JSON- oder JSON-LD-Endpunkt
- **kein `supabase/`-Verzeichnis**, keine Edge-Function-Quelle

`src/components/seo/JsonLd.tsx:303` verweist auf "die Edge Functions (feed-ics, feed-jsonld)",
`:197` auf "siehe feed-ics für Doku". Diese Funktionen sind nicht im Repo.
Ob sie je in Supabase deployt wurden, lässt sich von hier aus nicht feststellen.
Aktuell sind das Kommentare, die auf Code zeigen, den niemand lesen kann.

### 1.3 Was schon funktioniert, und wo es falsch liegt

`EventJsonLd` (`src/components/seo/JsonLd.tsx:287-381`) rendert schema.org-Markup auf jeder
Event-Detailseite (`src/app/[lang]/events/[slug]/page.tsx:123`). Gemessen an Googles
aktuellen Anforderungen (Pflicht sind nur `name`, `startDate`, `location`, `location.address`)
ist das solide.

Drei Befunde aus dem Abgleich mit Googles heutiger Doku:

- **`eventStatus` ist fest auf `EventScheduled` verdrahtet** (`:345`). Google verlangt für
  Absagen `EventCancelled` bei **erhaltener URL und unverändertem `startDate`**.
  Es gibt in `ContentStatus` (DRAFT, PUBLISHED, ARCHIVED) aber gar keinen Absage-Zustand.
  Eine Absage ist heute nur als Löschen oder Archivieren darstellbar, und beides ist
  genau das, was Google ausdrücklich nicht will. Siehe Aufgabe 1.6.
- **`eventAttendanceMode`** (`:346`) hat Google Mitte 2025 aus der Event-Doku entfernt.
  Bleibt gültiges schema.org, bringt bei Google aber nichts mehr. Kann stehen bleiben.
- **`ItemListJsonLd`** auf `/events` und `/news` erzeugt keine Rich Results.
  Google unterstützt Karussells nur für Course, Movie, Recipe und Restaurant, nicht für Event.
  Nicht schädlich, aber es ist kein Verteilkanal. Der Kanal `jsonld_website` ist inhaltlich
  über die Detailseiten bereits erledigt.

Wichtig für die Redaktion, weil es die Datenpflege betrifft: Google verlangt, dass Events
**öffentlich buchbar** sind. Geschlossene Firmenveranstaltungen und Mitglieder-Trainings
gehören nicht ins Markup. Das deckt sich mit dem Ausschluss von `BUSINESS` weiter unten.

### 1.4 Wo der Auslöser fehlt

`PUT /api/admin/events/[id]` (`src/app/api/admin/events/[id]/route.ts:64-107`) schreibt
`DRAFT -> PUBLISHED` als ganz normales Spaltenupdate. **Kein `revalidatePath`, kein Hook,
kein Nebeneffekt.** Genau hier muss der Auslöser hin.

---

## 2. Die vier Randbedingungen, die den Entwurf bestimmen

### 2.1 Vercel Pro: der Cron-Engpass ist weg

**Seit dem Upgrade auf Pro (Juli 2026) gilt die frühere Einschränkung nicht mehr.**
Zur Einordnung, warum der Code aussieht, wie er aussieht: Commit `fc962c4` musste den
Newsletter-Cron von stündlich auf täglich zurücknehmen, weil Hobby nur tägliche
Cron-Jobs erlaubt und ein häufigerer Ausdruck vom Deployment abgewiesen wird,
**bevor überhaupt ein Build startet**.

Auf Pro gilt stattdessen:

- bis zu 100 Cron-Jobs pro Projekt, **minütliche Granularität**
- Ausführung innerhalb der angegebenen Minute statt irgendwann in der Stunde
- `maxDuration` 300 Sekunden als Voreinstellung, konfigurierbar bis 800 Sekunden

Ein eigener Verteil-Cron ist damit erlaubt. Trotzdem bleibt `after()` der Hauptweg,
und zwar aus einem inhaltlichen Grund, nicht aus einem Plangrund: Die Redaktion soll
das Ergebnis nach Sekunden sehen und nicht erst beim nächsten Cron-Lauf. Der Cron ist
die Sicherung.

Zwei Punkte, die Vercel ausdrücklich dokumentiert und die den Aufräumlauf betreffen:
**Cron-Ausführung ist best effort**, Läufe können ausfallen und auch doppelt zugestellt
werden, und **Vercel wiederholt fehlgeschlagene Cron-Aufrufe nicht**. Der Aufräumlauf
muss also idempotent sein. Das ist er durch `@@unique([eventId, channel])` und die
Unterscheidung publish/update ohnehin (siehe 6.3).

**Zu prüfen:** Projekte, die vor dem 23.04.2025 angelegt wurden und **nicht** auf Fluid
Compute laufen, haben auf Pro weiterhin 15 Sekunden Voreinstellung und 300 Sekunden
Maximum statt 300/800. Vor dem Bau einmal in den Projekteinstellungen nachsehen,
sonst bricht `after()` mitten im dritten Adapter ab.

**Sofort umsetzbar und unabhängig von diesem Feature:** Der Newsletter-Cron kann
zurück auf stündlich. Die in `fc962c4` beschriebene Einschränkung, dass geplante
Newsletter nicht mehr zur geplanten Stunde rausgehen, sondern beim nächsten
Tageslauf, ist damit behebbar.

### 2.2 Das Repo ist öffentlich

`build-with-chris/pepe-dome` ist public. Kein Token, kein Secret in eine getrackte Datei.
Alles ausschließlich als Environment-Variable in Vercel. `.env.example` bekommt nur
Platzhalter und Kommentare.

### 2.3 Die Event-Daten sind Freitext

| Feld | Realität | Problem für externe Kanäle |
|---|---|---|
| `date` | nur Kalendertag, `timestamp without time zone` | keine Uhrzeit, keine Zone |
| `time` / `endTime` | Text "HH:MM", Altbestand auch "ab 20", "19.30 Uhr" | muss geparst werden |
| `price` | Freitext: "ab 22 €", "Eintritt frei", "Kostenlos" | Eventbrite will Zahl plus Währung |
| `ticketUrl` | URL **oder blanke E-Mail-Adresse** (`src/lib/ticket-url.ts`, `isMailTicket`) | als URL unbrauchbar |
| `imageUrl` | optional, kann `null` sein | Instagram kann ohne Bild nicht posten |
| `translations` | JSON, Deutsch bleibt Quelle | extern wird Deutsch gepostet |

Die Logik, die aus `date` plus `time` einen korrekten Berlin-Zeitstempel macht
(`parseTime`, `berlinOffsetFor`, `toBerlinIso`, `plusHoursIso`), liegt heute
**modulprivat** in `JsonLd.tsx:191-266` und ist laut eigenem Kommentar bereits in den
Edge Functions dupliziert. Eine dritte Kopie wäre der Punkt, an dem die drei Fassungen
anfangen, sich zu widersprechen.

### 2.4 Nicht jeder Kanal ist derselbe Kanaltyp

Das ist der eigentliche Konstruktionsfehler im vorhandenen Enum. Es gibt drei Sorten,
nicht eine:

**Push:** Wir rufen eine fremde API pro Event auf, bekommen eine externe ID zurück,
und es kann fehlschlagen. Das sind `eventbrite`, `facebook_page`, `instagram_business`
und theoretisch `google_business_profile`. Für diese Sorte passt `EventDistribution` exakt.

**Pull:** Wir veröffentlichen einen Feed, die Gegenseite holt ihn ab. Kein Aufruf pro Event,
keine externe ID, kein Fehlerzustand pro Event. Das ist `jsonld_website`. Eine Zeile pro
Event wäre hier bedeutungslos: `status: success` würde nur behaupten, dass Zeilen in
einer Datei stehen.

**Manuell:** Ein Mensch tippt es in ein Formular. Das ist `rausgegangen_feed`, und das
ist nach heutiger Faktenlage die einzige mögliche Einordnung, siehe 3.5.

**Entscheidung:** `EventDistribution` protokolliert ausschließlich Push-Kanäle.
Die übrigen Enum-Werte bleiben stehen, ungenutzt, aus demselben Grund, aus dem die
Tabelle stehen geblieben ist: Einen Enum-Wert zu entfernen ist eine Migration mit
Risiko, und der Nutzen wäre null.

---

## 3. Machbarkeit pro Kanal (recherchiert, Stand Juli 2026)

| Kanal | Urteil | Kern |
|---|---|---|
| `jsonld_website` | **fertig, kleine Korrekturen** | rendert bereits, `eventStatus` ist falsch verdrahtet |
| eigener ICS-Feed | **bauen, höchster Nutzen pro Aufwand** | existiert nicht, hängt von niemandem ab |
| `eventbrite` | **erst Schlüssel testen, dann bauen** | Quellenlage widersprüchlich, siehe 3.2 |
| `facebook_page` | **Event unmöglich, Beitrag machbar** | Endpunkt für Events ist entfernt |
| `instagram_business` | **machbar, aber schwach** | kein klickbarer Link in der Caption |
| `google_business_profile` | **möglich, aber nicht empfohlen** | zwei Freigabeverfahren, Token läuft alle 7 Tage ab |
| `rausgegangen_feed` | **falsche Annahme, es gibt keinen Feed** | nur manuelles Formular |

### 3.1 Eigene Feeds

Zwei Dinge, die keinen fremden Zugang brauchen und die jede spätere Partnergespräch
ohnehin voraussetzt: sauberes `Event`-JSON-LD pro Detailseite (ist da) und ein
öffentlicher ICS-Feed (fehlt). Details in 6.1 bis 6.6.

### 3.2 Eventbrite: widersprüchliche Quellenlage, deshalb Test vor Bau

Die beiden Recherchen kommen zu unterschiedlichen Ergebnissen, und das gehört
in dieses Dokument statt geglättet zu werden.

**Dafür:** Die API v3 ist dokumentiert und lebt. Ablauf ist
`POST /organizations/{organization_id}/events/` (legt als Draft an),
`POST /events/{event_id}/ticket_classes/`, `POST /events/{event_id}/publish/`.
Pflichtfelder beim Anlegen: `event.name.html`, `event.start.utc` plus `event.start.timezone`,
`event.end.utc` plus `event.end.timezone`, `event.currency`. Auth über Private Token,
kein OAuth-Tanz für die eigene Organisation. Rate Limit 1000 Aufrufe pro Stunde pro Token.

**Dagegen:** Sämtliche Entwicklerseiten von Eventbrite antworteten der zweiten Recherche
mit 403, und es gibt Berichte aus 2025, nach denen der Support Entwicklern mitteilt,
die API werde nicht mehr unterstützt. Der API-Support läuft seit 2020 ohnehin nur
über Community. Dazu die Übernahme durch Bending Spoons (Abschluss circa März 2026).

**Konsequenz:** Aufgabe 7.1 ist ein Test mit einem echten Schlüssel, bevor eine Zeile
Adapter-Code entsteht. Fällt der Test negativ aus, entfällt Phase 2 ersatzlos.
Fällt er positiv aus, wird der Adapter bewusst austauschbar geschnitten.

Zwei Details, die man vorher wissen muss: **auch ein kostenloses Event braucht eine
Ticketklasse** (`free: true`), sonst lässt es sich nicht veröffentlichen. Und
`unpublish` funktioniert **nur solange keine Bestellungen existieren**.

### 3.3 Facebook

**Ein Facebook-Event lässt sich nicht per API anlegen.** Metas aktuelle Referenz zum
Event-Node (v25.0) sagt bei Creating, Updating und Deleting, die Handlung sei auf diesem
Endpunkt nicht durchführbar, und ergänzt, Zugriff auf Events sei nur Facebook Marketing
Partners vorbehalten. `POST /{page-id}/events` ist aus der Referenz verschwunden.
Der einzige offizielle Weg ist die Official Events API, ein geschlossenes Partnerprogramm
für Ticketing-Plattformen, dessen Onboarding seit COVID ausgesetzt ist.

Was geht: `POST /{page-id}/feed` mit `message` plus `link`, also ein Beitrag, der auf die
eigene Event-Seite verlinkt. Berechtigungen `pages_manage_posts` und `pages_read_engagement`,
langlebiger Page Access Token.

Für die **eigene** Seite mit **eigener** App reicht laut Metas Access-Levels-Doku
Standard Access, also ohne App Review und ohne Business Verification. Das ist die
dokumentierte Lesart, aber Metas Durchsetzung driftet. **Vor Phase 3 gehört ein halber
Tag Spike mit einer Wegwerf-App dagegen.**

Ein Meta-Setup existiert bereits im Projekt (`META_CAPI_ACCESS_TOKEN`,
`NEXT_PUBLIC_META_PIXEL_ID`), die Seite ist `facebook.com/pepedome`.

### 3.4 Instagram

Zweistufiger Container-Flow: `POST /{ig-user-id}/media`, Status pollen,
`POST /{ig-user-id}/media_publish`. Konto `@pepe_arts` muss ein Professional Account sein.
Limit 100 API-Posts pro 24 Stunden.

Drei harte Einschränkungen: **nur JPEG**, **Bild muss über eine öffentliche URL erreichbar
sein** (Bytes lassen sich nicht hochladen), und **Links in der Caption sind nicht klickbar**.
Damit ist Instagram ein Reichweiten-Kanal, kein Conversion-Kanal, und steht bewusst hinten.
Ein Event ohne `imageUrl` ist hier `skipped`, nicht `failed`.

### 3.5 Rausgegangen: es gibt keinen Feed

Das ist der Befund, der den Enum-Wert widerlegt. Nachgeprüft wurden die komplette
Zentrale-FAQ (11 Artikel), die komplette Veranstalter-Wissensdatenbank (33 Artikel),
die Feature-Liste, die Veranstalter-AGB und diverse `api.`-Hostnamen. **Null Treffer**
für API, Schnittstelle, Import, iCal, XML, JSON oder Massen-Upload. Der einzige Import,
den es gibt, ist ein Gästelisten-Import für Ticketkäufer, nicht für Events.

Der reale Weg: kostenloses Konto auf `zentrale.events`, danach ein manuelles
Vier-Schritt-Formular pro Event, redaktionelle Prüfung 2 bis 3 Werktage.
Listung ist kostenlos, eigenes Ticketing kostet nichts.

Zwei Hebel, die den Aufwand echt senken und die in eine Redaktionsanleitung gehören,
nicht in Code:

1. **Serientermine:** Wiederkehrende Formate werden einmal mit vielen Terminen angelegt.
   Genau das, was ein Haus mit wöchentlichem Training braucht.
2. **Self-Publish-Rechte sind erhältlich.** Die Redaktion vergibt auf Anfrage eine
   Berechtigung, mit der man selbst veröffentlicht. Das beseitigt die 2 bis 3 Tage Wartezeit.

**Aufgabe:** eine E-Mail an die Redaktion, kein Adapter.

### 3.6 Google Business Profile: möglich, aber nicht empfohlen

Anders als zunächst angenommen ist der Kanal technisch am Leben:
`POST https://mybusiness.googleapis.com/v4/{parent}/localPosts` mit
`LocalPostTopicType: EVENT` existiert, und der Changelog vom 07.04.2026 hat sogar
wiederkehrende Posts ergänzt. Verbreitete Behauptungen, v4 sei abgeschaltet, sind falsch:
v4 wurde aufgeteilt, und Local Posts, Reviews und Medien blieben dort.

Der Preis dafür ist der Grund für die Empfehlung dagegen:

- **Zwei getrennte Google-Freigaben.** Die Legacy-API ist in der Cloud Console
  überhaupt erst sichtbar, wenn der Antrag durch ist (Google nennt 14 Tage).
  `business.manage` ist zusätzlich ein sensibler Scope, der eine OAuth-App-Verifizierung
  verlangt (berichtet werden 2 bis 6 Wochen).
- **Bis die zweite Freigabe durch ist, läuft das Refresh-Token alle 7 Tage ab.**
  Ein Consent Screen im Status "Testing" bekommt genau das. Die Automatik würde also
  wöchentlich stillstehen.
- **Kein Service Account**, sondern ein Nutzerkonto mit Refresh-Token.
- Die Wirkungsmessung ist weg: `localPosts.reportInsights` wurde 2023 abgeschaltet.

Der einzige Hebel, der das kippt: Hat der Dome Google Workspace, kann der Consent Screen
auf "Internal" stehen und die Verifizierung entfällt. **Aufgabe 7.3 klärt genau das.**
Bis dahin: von Hand im GBP-Interface posten.

---

## 4. Kanäle, die im Enum fehlen und mehr bringen als drei der sechs

Die Recherche hat vier Wege gefunden, die maschinelle Übernahme tatsächlich anbieten
oder strategisch der richtige Anschluss sind. Keiner davon ist heute im Enum.
Sie sind hier dokumentiert, damit die Entscheidung darüber bewusst fällt.

| Weg | Was er annimmt | Einschätzung |
|---|---|---|
| **Bandsintown for Venues** | Bulk-Upload, und auf Anfrage automatischer Import per **RSS, CSV, XLS oder JSON** | Der einzige gefundene Anbieter, der einen direkten Feed ausdrücklich anbietet. Musiklastig, ob Zirkus und Workshops akzeptiert werden, ist offen. Setzt eine beanspruchte Venue-Seite voraus. |
| **kulturkurier.de** | CSV- und XLSX-Import, verteilt weiter Richtung EVENTIM Guide und meinestadt | Halbautomatisch. Automatischer Dauerimport existiert nur ab Reservix. |
| **IN München** | kostenloses Formular mit KI-Generator für Serientermine | Kein Feed, aber die Redaktion von muenchen.de zieht von dort. Der beste manuelle Weg in den größten Münchner Kalender. |
| **BayernCloud Tourismus / ODTA** | Open-Data-Drehscheibe auf schema.org-Basis, Zugang über München Tourismus | Das eigentliche Fernziel. Wer ordentliches schema.org auf der eigenen Seite hat, hat die Vorarbeit schon geleistet. |

Ausdrücklich geprüft und **ohne Weg**: muenchen.de (kein Einreichformular),
Münchens Open-Data-Portal (nur Statistik-CSVs), Eventim Light (manuell, und die
Verteilung auf eventim.de kostet 10 Prozent pro Ticket), München Ticket (Schnittstelle
erwähnt, aber nicht dokumentiert, dazu ein unbestätigtes Gerücht über eine Abschaltung),
Ticketmaster (Publish-API-Doku antwortet mit 404), Meetup (GraphQL vorhanden, aber
OAuth-Consumer erfordert ein kostenpflichtiges Meetup Pro).

---

## 5. Architektur

### 5.1 Ablauf

```
Redaktion speichert Event (PUT /api/admin/events/[id])
        |
        v
Status wechselt nach PUBLISHED?  ---- nein ---->  fertig, kein Nebeneffekt
        |  ja
        v
planDistribution(eventId)
  schreibt pro aktivem Push-Kanal eine Zeile 'pending' (upsert)
        |
        v
after() aus next/server           <-- Antwort geht sofort raus, Redaktion wartet nicht
        |
        v
runDistribution(eventId)
  pro Kanal: Adapter aufrufen, Ergebnis in die Zeile schreiben
        |
        +---> success  : externalId, externalUrl, completedAt
        +---> failed   : errorMessage, attemptedAt
        +---> skipped  : errorMessage als Begründung

Was 'failed' oder 'pending' blieb:
        |
        v
Täglicher Aufräumlauf, angehängt an den bestehenden 04:00-UTC-Cron
        |
        v
Manueller Knopf "Erneut versuchen" im Admin, pro Kanal
```

### 5.2 Warum `after()` und nicht eine Queue

Der Redaktionsvorgang darf niemals daran scheitern, dass Eventbrite gerade langsam ist.
`after()` läuft, nachdem die Antwort rausgegangen ist, aber noch in derselben
Function-Ausführung. Damit gilt: Speichern bleibt schnell und schlägt nie wegen eines
externen Dienstes fehl, das Ergebnis liegt trotzdem nach Sekunden in der Datenbank,
und es braucht keinen dritten Cron (siehe 2.1).

`after()` gibt aber keine Zustellgarantie. Es läuft innerhalb derselben Function und
**zählt auf deren `maxDuration`**; läuft die Function aus, wird die Zusage abgebrochen.
Dann bleibt die Zeile auf `pending`. Genau dafür ist der Aufräumlauf da: Er ist die
Sicherung, nicht der Hauptweg.

Vercel Queues gibt es seit Februar 2026 als Public Beta und wäre die lehrbuchmäßige
Antwort. Für ein Haus mit einigen Events pro Woche ist das überdimensioniert:
zusätzliche Kosten pro Operation, `v2beta`-Konfiguration und ein zweites bewegliches
Teil, für eine Last, die eine einzelne Function in Millisekunden erledigt.
Erst interessant, wenn die Zahl der Kanäle deutlich wächst.

### 5.3 Adapter-Schnittstelle

```ts
// src/lib/distribution/types.ts

export type DistributionResult =
  | { status: 'success'; externalId: string; externalUrl: string | null }
  | { status: 'failed'; error: string }
  | { status: 'skipped'; reason: string }

export interface ChannelAdapter {
  channel: DistributionChannel
  /** Ohne diese Env-Variablen ist der Kanal aus. Nicht konfiguriert heißt aus, nicht kaputt. */
  isConfigured(): boolean
  publish(event: DistributableEvent): Promise<DistributionResult>
  update(event: DistributableEvent, externalId: string): Promise<DistributionResult>
  retract(externalId: string): Promise<DistributionResult>
}
```

`DistributableEvent` ist ein bereits normalisiertes Objekt, kein rohes Prisma-`Event`.
Die Normalisierung passiert einmal zentral, nicht in jedem Adapter: Berlin-Zeitstempel,
Preis als Zahl plus Originaltext, Ticket-URL nur wenn es wirklich eine URL ist,
absolute Bild-URL, absolute Event-URL.

### 5.4 Dateien

```
src/lib/event-datetime.ts              NEU  aus JsonLd.tsx extrahiert, einzige Quelle
src/lib/distribution/
  types.ts                             NEU  Schnittstelle, DistributableEvent
  normalize.ts                         NEU  Prisma-Event -> DistributableEvent
  registry.ts                          NEU  Liste der Adapter, Konfigurationsprüfung
  run.ts                               NEU  planDistribution, runDistribution, retractDistribution
  adapters/eventbrite.ts               NEU  Phase 2, nur nach positivem Test 7.1
  adapters/facebook-page.ts            NEU  Phase 3
  adapters/instagram.ts                NEU  Phase 4
src/lib/feed/events-ics.ts             NEU  Phase 1
src/app/events.ics/route.ts            NEU  Phase 1
src/app/api/admin/events/[id]/distributions/route.ts  NEU  GET Status, POST Retry
src/components/admin/DistributionPanel.tsx           NEU  Sidebar-Karte
```

Geändert:

```
src/components/seo/JsonLd.tsx          Helfer importieren, eventStatus dynamisch
src/app/api/admin/events/[id]/route.ts Auslöser in PUT, retract in DELETE
src/app/admin/(dashboard)/events/[id]/edit/page.tsx  distributions mitladen
src/components/admin/forms/EventForm.tsx            Panel einhängen
src/app/api/cron/sync-suppressions/route.ts         Aufräumlauf anhängen
src/app/sitemap.ts, src/app/robots.ts               Feed-URL bekannt machen
.env.example                                        neue Variablen dokumentieren
```

`EventForm.tsx` hat die Sidebar-Karten zwischen `:816` und `:902`. Das Panel kommt
zwischen "Einstellungen" (endet `:880`) und "Actions" (`:883`), nur im Edit-Modus,
analog zur Karte "Englische Übersetzung" (`:719`).

### 5.5 Environment-Variablen

```bash
# Globaler Notaus. Ohne "true" wird nichts nach außen veröffentlicht.
DISTRIBUTION_ENABLED="false"

# Schreibt nur ins Log, was gepostet würde, ohne die fremden APIs aufzurufen.
DISTRIBUTION_DRY_RUN="true"

# Eventbrite (nur falls Test 7.1 positiv ausfällt)
EVENTBRITE_PRIVATE_TOKEN=""
EVENTBRITE_ORGANIZATION_ID=""

# Meta, Facebook-Seite und Instagram teilen sich die App
META_PAGE_ID=""
META_PAGE_ACCESS_TOKEN=""
META_IG_USER_ID=""
```

Die beiden Schalter sind nicht Kosmetik. `DISTRIBUTION_ENABLED=false` ist der
Auslieferungszustand: Das Feature geht als toter Code live und wird erst eingeschaltet,
wenn ein Mensch das entscheidet. `DISTRIBUTION_DRY_RUN` ist der einzige Weg, den Ablauf
gegen echte Produktionsdaten zu prüfen, ohne dass irgendwo ein Post erscheint.

**`isConfigured()` gibt bei fehlenden Variablen `false` zurück, der Kanal wird `skipped`,
nicht `failed`.** Ein nicht eingerichteter Kanal ist kein Fehler. Sonst steht das
Admin-Panel voll roter Meldungen für Dinge, die absichtlich aus sind.

---

## 6. Die Fälle, an denen naive Umsetzungen scheitern

Jeder Punkt ist ein Befund aus dem vorhandenen Code oder aus der Recherche,
kein Lehrbuchbeispiel.

### 6.1 Löschen zerstört die externe ID, bevor man sie braucht

`EventDistribution.event` hat `onDelete: Cascade` (`schema.prisma:221`).
`DELETE /api/admin/events/[id]` löscht das Event, Postgres löscht die Verteilzeilen mit,
**und damit ist die `externalId` weg**. Das Eventbrite-Event und der Facebook-Beitrag
bleiben für immer draußen stehen, ohne dass noch irgendetwas weiß, dass sie zu uns gehören.

**Lösung:** In der DELETE-Route zuerst `retractDistribution(eventId)` aufrufen und auf
das Ergebnis warten, erst danach löschen. Nicht in `after()`, denn nach dem Löschen gibt
es nichts mehr zu lesen.

### 6.2 Absage ist kein Löschen

Google verlangt bei einer Absage: Seite bleibt erreichbar, `eventStatus` wird
`EventCancelled`, **`startDate` bleibt unverändert** (es identifiziert das Event).
Bei Verschiebung bleibt zunächst das alte Datum stehen, bei Neuterminierung wird
`EventRescheduled` gesetzt und optional `previousStartDate` ergänzt.

Heute gibt es dafür keinen Zustand. `ContentStatus` kennt nur DRAFT, PUBLISHED, ARCHIVED,
und `eventStatus` steht fest auf `EventScheduled`. Das ist die einzige Stelle im ganzen
Spec, die eine Schema-Migration braucht: ein Wert `CANCELLED` in `ContentStatus`
(`ALTER TYPE ... ADD VALUE`, läuft ohne Sperre), plus die Regel, dass abgesagte Events
weiter ausgeliefert werden und nicht aus der Detailseite fallen.

Damit hängt auch der ICS-Fall zusammen: `STATUS:CANCELLED` bei gleicher UID und
erhöhtem `SEQUENCE`. Ein Event einfach aus dem Feed zu entfernen, lässt es in jedem
abonnierten Kalender stehen.

### 6.3 Zweiter Speichervorgang darf nicht doppelt posten

`@@unique([eventId, channel])` verhindert doppelte Zeilen. Der Ablauf muss zusätzlich
unterscheiden: Zeile hat schon eine `externalId` heißt `update()`, nicht `publish()`.
Ohne das erzeugt jedes Speichern ein neues Eventbrite-Event.

### 6.4 Wiederkehrende Events

`Event` hat `recurrence`, `recurrenceEnd`, `parentEventId` und `childEvents`
(`schema.prisma:187-192`). Ein wöchentliches Training über ein halbes Jahr sind
26 Kindevents, also ungefiltert 26 Instagram-Posts.

**Regel:** Kindevents mit gesetztem `parentEventId` werden auf Social-Kanälen `skipped`.
Verteilt wird das Elternevent. Im ICS-Feed erscheinen dagegen **alle** Termine als
einzelne VEVENTs, denn dafür ist ein Kalender da.

### 6.5 Freitext-Preis trifft auf Pflichtfeld Währung

Die Zuordnung nutzt exakt dieselbe Logik wie das vorhandene JSON-LD (`JsonLd.tsx:352-373`):
`isFreeEntry()` aus `src/lib/event-price.ts` entscheidet über Gratis, sonst wird die
niedrigste Zahl per Regex gezogen. Findet sich weder das eine noch das andere,
ist das Ergebnis `skipped` mit Begründung, **nicht** ein geratener Preis.

### 6.6 Ticket-URL ist manchmal eine E-Mail-Adresse

`src/lib/ticket-url.ts` hat `isMailTicket()`, weil im Feld auch blanke Adressen stehen.
Wer das ungeprüft als `offers.url` oder als Facebook-`link` weitergibt, produziert kaputte
Links. Der Normalisierer gibt `ticketUrl` nur weiter, wenn es wirklich eine `http(s)`-URL
ist, sonst fällt alles auf die eigene Event-Seite zurück.

### 6.7 Zeitzone und Nullminuten-Events

Die Endzeit-Logik aus `JsonLd.tsx:303-320` (Ende fehlt oder liegt vor dem Start ergibt
Start plus zwei Stunden, Endzeit vor Startzeit heißt über Mitternacht) muss identisch
für ICS und Eventbrite gelten. Eventbrite lehnt Events mit `end <= start` ab.
Deshalb wird die Logik in Aufgabe 6.2 extrahiert statt ein drittes Mal abgeschrieben.

### 6.8 Token laufen ab, und zwar leise

Ein Meta-Page-Token, das aus einem abgelaufenen User-Token abgeleitet wurde, hört ohne
Vorwarnung auf zu funktionieren. Das darf nicht als anonymes `failed` in einer Zeile
enden, die niemand ansieht. Der Adapter erkennt Meta-Fehlercode 190 und schreibt eine
unmissverständliche `errorMessage`, die im Admin-Panel sichtbar ist.

---

## 7. Aufgaben

### Phase 0: Fundament, ohne einen einzigen externen Aufruf

- **0.1 Die Geisterfunktionen klären.** Im Supabase-Dashboard nachsehen, ob `feed-ics`
  und `feed-jsonld` existieren und ob sie jemand aufruft. Ergebnis: entweder übernehmen
  wir sie nach `src/`, oder sie werden gelöscht. In beiden Fällen verschwinden danach die
  irreführenden Verweise in `JsonLd.tsx:197` und `:303`.
  **Es darf am Ende nicht zwei Fassungen der Berlin-Zeit-Logik geben.**
- **0.2** `parseTime`, `berlinOffsetFor`, `toBerlinIso`, `plusHoursIso` und die
  Endzeit-Sanity nach `src/lib/event-datetime.ts` extrahieren, exportieren,
  `JsonLd.tsx` auf Import umstellen. Verhalten unverändert, abgesichert durch Tests
  gegen die heutige Ausgabe.
- **0.3** `types.ts` und `normalize.ts`. Reiner Datenumbau, keine Netzwerkaufrufe.
- **0.4** `registry.ts` und `run.ts` mit `planDistribution`, `runDistribution`,
  `retractDistribution`, inklusive beider Schalter.
- **0.5** `GET/POST /api/admin/events/[id]/distributions`. GET mit
  `requireApiRole(ROLES.VIEWER)`, POST mit `requireApiRole(ROLES.SUPER_ADMIN)`,
  Begründung in Abschnitt 9.
- **0.6** `DistributionPanel.tsx` in die Event-Sidebar, `getEvent` in
  `events/[id]/edit/page.tsx:22-52` um `distributions` erweitern.
- **0.7** Auslöser in `PUT`: bei Wechsel nach `PUBLISHED` `planDistribution`,
  danach `after(() => runDistribution(...))`. Zurückziehen bei Wechsel weg von
  `PUBLISHED`. `retractDistribution` synchron in DELETE, vor dem Löschen (siehe 6.1).
- **0.8** Aufräumlauf als eigener Cron `/api/cron/retry-distributions`, auf Pro
  stündlich möglich (`0 * * * *`). Zeilen `pending` oder `failed` mit `attemptedAt`
  älter als eine Stunde erneut versuchen, gedeckelt pro Lauf, mit Zählerspalte gegen
  Endlosschleifen bei dauerhaft kaputten Kanälen. Auth nach dem Muster aus
  `sync-suppressions/route.ts:13-33` (Bearer plus zeitkonstanter Vergleich).
  Muss idempotent sein, weil Vercel Cron-Läufe auch doppelt zustellen kann.

Nach Phase 0 ist das Gerüst vollständig und tut nach außen nichts.

### Phase 1: Eigene Kanäle. Wenn nur eine Phase gebaut wird, dann diese.

- **1.1** `src/lib/feed/events-ics.ts`. **Bewusste Entscheidung: Zeiten als UTC
  ausgeben** (`DTSTART:20260912T180000Z`), nicht als `TZID=Europe/Berlin`.
  Ein TZID verlangt zwingend einen vollständigen `VTIMEZONE`-Block mit STANDARD- und
  DAYLIGHT-Teil im selben VCALENDAR. Ohne den ist der Feed kaputt, und ihn korrekt zu
  erzeugen ist unnötiges Risiko. UTC braucht kein VTIMEZONE.
- **1.2** Pro VEVENT: **stabile UID aus dem Datenbankschlüssel**
  (`event-<id>@pepe-dome.de`), niemals eine neue UID pro Render, sonst entstehen in jedem
  abonnierten Kalender Dubletten. Dazu `DTSTAMP`, `LAST-MODIFIED` (beides, es ist nicht
  dasselbe), `SUMMARY`, `DESCRIPTION`, `LOCATION`, `URL`, `SEQUENCE` (aus `updatedAt`
  abgeleitet, monoton), `STATUS`, `CATEGORIES`.
- **1.3** Wiederkehrende Formate **als einzelne VEVENTs ausschreiben** mit
  deterministischer UID pro Termin (`event-42-20260912@pepe-dome.de`), nicht als RRULE.
  Viele Importer behandeln RRULE schlecht, und einzelne abweichende Termine (eine
  ausgefallene Woche, ein anderer Preis) lassen sich damit sauber abbilden.
- **1.4** VCALENDAR-Kopf: `VERSION:2.0`, `PRODID`, `CALSCALE:GREGORIAN`, `METHOD:PUBLISH`,
  dazu `NAME` und `DESCRIPTION` nach RFC 7986 **und** `X-WR-CALNAME` (das lesen Google
  und Apple tatsächlich), `REFRESH-INTERVAL;VALUE=DURATION:PT6H`, `SOURCE`,
  `X-PUBLISHED-TTL` für Outlook.
- **1.5** `GET /events.ics`: `Content-Type: text/calendar; charset=utf-8`
  (ohne `charset` mangeln die Umlaute), `Content-Disposition: inline`,
  `Cache-Control: public, max-age=3600`, `ETag` und `Last-Modified`.
  **CRLF als Zeilenende und Faltung auf 75 Oktett sind Pflicht**, nicht Stil:
  LF-only lädt in Apple Kalender und verschluckt dabei still Termine, Outlook lehnt ab.
  Dafür eine erprobte Bibliothek nehmen statt Stringverkettung.
- **1.6** `eventStatus` in `EventJsonLd` dynamisch machen und den Zustand `CANCELLED`
  einführen (siehe 6.2). Abgesagte Events bleiben erreichbar und behalten `startDate`.
- **1.7** Feed in `robots.ts`, `sitemap.ts` und als `<link rel="alternate">` bekannt machen,
  plus `webcal://`-Variante und ein "Zum Kalender hinzufügen" auf der Detailseite.

Zur Erwartungshaltung, die dokumentiert gehört: **Google Kalender holt abonnierte
ICS-Feeds nur alle 8 bis 24 Stunden ab, und niemand kann das erzwingen.**
`REFRESH-INTERVAL` ist ein Hinweis, keine Steuerung. Der Feed ist gut für Entdeckung
und **niemals** der richtige Kanal für eine Absage. Dafür ist der Newsletter da.

### Phase 2: Eventbrite, nur nach positivem Test

- **7.1 zuerst** (siehe unten). Fällt der Test negativ aus, entfällt diese Phase.
- **2.1** Adapter mit den drei POSTs, `update`, `retract`.
- **2.2** Preis- und Ticketklassen-Zuordnung inklusive Gratis-Fall.
- **2.3** Fehlerbehandlung: Rate Limit, abgelaufener Token, Unpublish mit Bestellungen.
- **2.4** Ende-zu-Ende im Dry-Run, danach ein echtes Testevent als `listed: false`.

### Phase 3: Facebook-Seitenbeitrag

- **3.1 Spike, halber Tag:** Wegwerf-App, prüfen ob Standard Access wirklich ohne
  App Review auf `facebook.com/pepedome` posten darf. **Entscheidet, ob 3.2 gebaut wird.**
- **3.2** Adapter `POST /{page-id}/feed` mit `message` plus `link`.
- **3.3** Token-Ablauf sichtbar machen (siehe 6.8).

### Phase 4: Instagram

Erst wenn Phase 3 steht, dieselbe App, dasselbe Token-Fundament.
JPEG-Zwang und fehlendes `imageUrl` als `skipped`.

### Phase 5: Kein Code, sondern Entscheidungen und E-Mails

- **7.1 Eventbrite-Test.** Schlüssel anlegen, `POST /organizations/{id}/events/` gegen
  ein Testevent. Eine Stunde Arbeit, entscheidet über Phase 2.
- **7.2 Rausgegangen.** Konto auf `zentrale.events`, danach eine E-Mail an die Redaktion
  mit der Bitte um Self-Publish-Rechte, und Serientermine für die wöchentlichen Formate
  nutzen. Kein Adapter.
- **7.3 Google Business Profile.** Nur eine Frage vorab klären: **Läuft der Dome auf
  Google Workspace?** Falls ja, entfällt die OAuth-Verifizierung und der Kanal wird
  interessant. Falls nein, bleibt es beim manuellen Posten.
- **7.4 Bandsintown for Venues** anschreiben und fragen, ob Zirkus und Artistik
  akzeptiert werden und ob ein JSON- oder RSS-Feed übernommen wird.
  Der ICS-Feed aus Phase 1 ist die Vorarbeit dafür.
- **7.5 IN München** Formular nutzen, inklusive Serientermin-Generator.
  Das ist der beste manuelle Weg in den Kalender von muenchen.de.
- **7.6 München Tourismus** wegen BayernCloud kontaktieren. Fernziel, aber schema.org
  ist die Eintrittskarte, und die liegt nach Phase 1 vor.

---

## 8. Tests

Randbedingung aus `CLAUDE.md` und `tests/README.md`: `npm test` läuft ohne Datenbank
gegen den Prisma-Mock. Kein MSW im Projekt, gemockt wird über `vi.mock` an der
Modulgrenze (Vorbild `tests/resend/email-send.test.ts:12-47`).

- `tests/lib/event-datetime.test.ts`: Sommer- und Winterzeit, Mitternachtsübergang,
  fehlende Zeit, Altbestand "ab 20" und "19.30 Uhr". Muss die heutige JSON-LD-Ausgabe
  exakt reproduzieren.
- `tests/lib/distribution-normalize.test.ts`: Gratis-Preis, "ab 22 €", `ticketUrl`
  als E-Mail, fehlendes Bild, Kindevent.
- `tests/lib/distribution-run.test.ts`: `DISTRIBUTION_ENABLED=false` ruft keinen Adapter
  auf, Dry-Run ruft keine API auf, nicht konfigurierter Kanal wird `skipped`,
  vorhandene `externalId` führt zu `update` statt `publish`, ein fehlschlagender Kanal
  stoppt die anderen nicht.
- `tests/lib/feed-ics.test.ts`: **UID über zwei Läufe identisch** (der wichtigste Test
  der ganzen Datei), CRLF, Faltung bei langen Beschreibungen, `SEQUENCE` steigt bei
  Änderung, `STATUS:CANCELLED` bleibt im Feed, Umlaute korrekt kodiert.
- Adaptertests je Kanal mit gemocktem `fetch`: Erfolg, 401, 429, Meta-Fehlercode 190.

Ein Hinweis nebenbei, kein Teil dieses Specs: Fünf Fälle in
`tests/api/cron-scheduled.test.ts` senden nur den Header `x-vercel-cron`, den die Route
gar nicht liest. Sie bestehen nur, weil `CRON_SECRET` im Testprozess leer ist, und laufen
wegen der DB-Ausschlussliste unter `npm test` ohnehin nie. Wer den Aufräumlauf in 0.8
testet, sollte nicht von dieser Datei abschreiben.

---

## 9. Sicherheit

- **Alle Admin-Routen** nach dem Muster aus `SECURITY.md:176-183`:
  `const guard = await requireApiRole(...)`, `if (guard.response) return guard.response`,
  als erste Anweisung vor dem try/catch.
- **Manuelles Auslösen nach außen ist `SUPER_ADMIN`.** `SECURITY.md` legt fest, dass alles,
  was echte Mail an echte Menschen schickt, `SUPER_ADMIN` verlangt. Ein Instagram- oder
  Facebook-Beitrag im Namen des Dome ist öffentlich und praktisch nicht zurückzuholen,
  gehört also in dieselbe Klasse. Lesen reicht `VIEWER`.
- **Keine Secrets im Repo** (Abschnitt 2.2).
- **Fehlermeldungen nach außen bleiben stumpf.** Antworten fremder APIs können Token,
  Konto-IDs und interne Hosts enthalten. Ins Log darf das Detail, in `errorMessage` und
  in die HTTP-Antwort nur eine gekürzte Fassung. Vorbild ist
  `src/app/api/events/route.ts:30-45`, wo genau deshalb die rohe Prisma-Meldung
  entfernt wurde. Länge begrenzen wie in `src/lib/suppressions.ts:43` (200 Zeichen).
- **Redaktionstexte gehen ungefiltert an fremde Systeme.** Das ist Nutzereingabe.
  Längen kürzen, Steuerzeichen entfernen, und im ICS-Generator Komma, Semikolon,
  Backslash und Zeilenumbruch maskieren. Sonst bricht ein `\n` im Titel den
  Kalendereintrag auf. Dieselbe Klasse Problem, gegen die `src/lib/json-ld.ts` schützt.

---

## 10. Abnahmekriterien

1. Ein Event von `DRAFT` auf `PUBLISHED` zu setzen, erzeugt Verteilzeilen und verändert
   die Antwortzeit des Speicherns nicht spürbar.
2. Fällt ein Kanal aus, wird das Event trotzdem veröffentlicht und die anderen Kanäle
   laufen durch.
3. Zweimal speichern erzeugt keinen zweiten externen Eintrag.
4. `PUBLISHED -> DRAFT` zieht extern zurück oder erklärt sichtbar, warum nicht.
5. Ein Event zu löschen hinterlässt keine verwaiste externe Veröffentlichung.
6. Ein abgesagtes Event bleibt unter derselben URL erreichbar, behält `startDate`,
   meldet `EventCancelled` und steht mit `STATUS:CANCELLED` weiter im ICS-Feed.
7. Das Admin-Panel zeigt pro Kanal Status, Zeitpunkt, Link und Fehlertext,
   der Retry-Knopf funktioniert.
8. `DISTRIBUTION_ENABLED=false` führt zu null ausgehenden Aufrufen.
9. `/events.ics` lässt sich in Apple Kalender, Google Kalender und Outlook abonnieren,
   zeigt die richtige Ortszeit im Sommer wie im Winter, und ein zweiter Abruf erzeugt
   keine Dubletten.
10. `npm test` ist grün, ohne Datenbank und ohne Netzwerk.
11. Der neue Cron-Eintrag wird von Vercel akzeptiert und das Deployment läuft.
    Zweimaliges Auslösen desselben Laufs erzeugt keine doppelte Veröffentlichung.

---

## 11. Offene Punkte

1. **Existieren die Supabase-Funktionen `feed-ics` und `feed-jsonld`?**
   Blockiert Aufgabe 0.1. Nur im Supabase-Dashboard zu beantworten.
2. **Funktioniert die Eventbrite-API mit einem frisch erzeugten Schlüssel?**
   Blockiert Phase 2 vollständig. Aufgabe 7.1.
3. **Läuft der Dome auf Google Workspace?** Entscheidet allein darüber, ob Google
   Business Profile jemals sinnvoll automatisierbar wird. Aufgabe 7.3.
4. **Soll die Verteilung pro Event abwählbar sein?** Der Entwurf verteilt automatisch an
   alle konfigurierten Kanäle. Ein internes Firmenevent will man aber weder auf Instagram
   noch im Google-Markup haben, letzteres verstößt sogar gegen Googles Regel, dass Events
   öffentlich buchbar sein müssen. Bis eine Migration dafür da ist, gilt die Kategorie
   als Filter: `BUSINESS` grundsätzlich nicht nach außen.
5. **Meta-App:** vorhandene App aus dem Pixel- und CAPI-Setup weiterverwenden
   oder eine eigene anlegen?
6. **Sprache extern:** Der Entwurf postet Deutsch. Englische Fassungen liegen in
   `translations`, würden aber doppelte Beiträge bedeuten.
7. **Läuft das Projekt auf Fluid Compute?** Entscheidet, ob `maxDuration` bei
   300 Sekunden oder bei 15 Sekunden liegt (siehe 2.1). Eine Minute in den
   Projekteinstellungen.
