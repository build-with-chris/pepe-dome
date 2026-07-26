# Spec: Kanal-Kit

**Status**: Gebaut. 9.2 bis 9.11 umgesetzt, 9.1 offen (Limits stehen auf `verified: false`)
**Priority**: Hoch. Kürzester Weg zu weniger Arbeit pro Event.
**Target**: Ein Event einmal schreiben, danach überall einfügen statt neu tippen
**Owner**: Development Team
**Datum**: 2026-07-26
**Verwandt**: [event-verteilsystem.md](./event-verteilsystem.md)

---

## 1. Warum das und nicht sechs API-Adapter

Die Analyse zum Verteilsystem hat ergeben, dass der automatische Weg für den
größeren Teil der Zielkanäle gar nicht existiert:

- Ein Facebook-Event lässt sich nicht per API anlegen, der Endpunkt ist entfernt.
- Rausgegangen hat nachweislich keinen Feed-Import, nur ein manuelles Formular.
- muenchen.de, IN München und die Stadtmagazine nehmen ausschließlich Formulare.
- Google Business Profile kostet zwei Freigabeverfahren für einen bescheidenen Ertrag.

Dazu kommt ein Befund aus dem eigenen Code: In `src/components/events/TicketLink.tsx:6`
steht, dass der Ticketkauf auf rausgegangen.de stattfindet. **Der Dome ist dort bereits
Veranstalter.** Das Problem ist also nicht fehlende Präsenz, sondern dass jedes Event
mehrfach von Hand abgetippt wird.

Das Kanal-Kit greift genau da an. Es automatisiert nicht das Veröffentlichen,
sondern das **Verfassen**. Der Mensch fügt ein, was der Dome vorbereitet hat.

| | Adapter-Ansatz | Kanal-Kit |
|---|---|---|
| Abgedeckte Kanäle | 2 bis 3 von 8 | alle, auch die ohne API |
| Fremde Freigaben nötig | Meta, Google, Eventbrite | keine |
| Bricht, wenn ein Anbieter etwas ändert | ja | nein |
| Aufwand bis zum ersten Nutzen | Wochen | eineinhalb bis zwei Tage |
| Laufende Wartung | Token, Rate Limits, Deprecations | Textbausteine pflegen |

Das Kanal-Kit ersetzt die Adapter nicht für immer. Es ist der Teil, der sofort trägt,
und es macht die Adapter danach optional statt notwendig.

---

## 2. Was gebaut wird

Im Admin bekommt jedes Event eine Ansicht "Kanal-Kit". Darin steht pro Zielkanal
genau das, was dessen Formular verlangt, feldweise, zeichengenau, mit Kopierknopf.

Beispiel Rausgegangen:

```
RAUSGEGANGEN                                          [ Alles kopieren ]

Titel                                                       38 / 80  [Kopieren]
  Cirque Nouveau: Schwerelos

Kurzbeschreibung                                          142 / 200  [Kopieren]
  Ein Abend zwischen Boden und Kuppel. Sechs Artistinnen und Artisten
  zeigen im Pepe Dome, was Schwerkraft alles nicht kann.

Beschreibung                                              871 / 2000 [Kopieren]
  ...

Datum und Zeit                                                       [Kopieren]
  Samstag, 12. September 2026, 20:00 bis 22:00 Uhr

Ort                                                                  [Kopieren]
  Pepe Dome, Albert-Schweitzer-Straße 62 (Theatron Ostpark), 81735 München

Preis                                                                [Kopieren]
  ab 22 €

Ticketlink                                                           [Kopieren]
  https://www.pepe-dome.de/de/events/schwerelos?utm_source=rausgegangen&…

☐ Bei Rausgegangen eingetragen        [ Link zur Veröffentlichung eintragen ]
```

Kein Speichern nötig, kein Warten, keine externe Abhängigkeit. Markieren, kopieren,
im Portal einfügen.

---

## 3. Der Bogen zurück zur ursprünglichen Idee

Die Zeile ganz unten ist der Punkt, an dem `EventDistribution` endlich einen Sinn bekommt.

Die Tabelle wurde gebaut für "Protokoll darüber, was wo gelandet ist". Genau das leistet
sie hier, nur ohne eine einzige fremde API: Setzt die Redaktion das Häkchen und fügt die
URL der Veröffentlichung ein, entsteht eine Zeile mit `status: success`, `externalUrl`
und `completedAt`. Der Kanal ist `rausgegangen_feed`, `facebook_page` und so weiter,
also exakt die Werte, die schon im Enum stehen.

Damit hat der Dome nach ein paar Wochen die Übersicht, die eigentlich das Ziel war:
Welches Event steht wo, wo fehlt es noch, und wann wurde es eingetragen. Und wenn später
doch ein echter Adapter dazukommt, schreibt der in dieselbe Tabelle, in demselben Format.
Die Handarbeit ist die Vorstufe der Automatik, nicht ihr Gegenteil.

Die Event-Übersicht bekommt dafür eine Spalte "verteilt", die zeigt, auf wie vielen
Kanälen ein Event steht. Das ist der eigentliche Redaktionsnutzen: sehen, was liegen blieb.

---

## 4. Kanäle in Phase 1

| Kanal | Enum-Wert | Felder |
|---|---|---|
| Rausgegangen | `rausgegangen_feed` | Titel, Kurzbeschreibung, Beschreibung, Datum, Ort, Preis, Ticketlink |
| IN München | neu, siehe 8.1 | Titel, Beschreibung, Datum, Ort, Preis, Web |
| Instagram | `instagram_business` | Caption, Hashtags, Bildhinweis |
| Facebook-Seite | `facebook_page` | Beitragstext, Link |
| Google Business Profile | `google_business_profile` | Titel, Zeitraum, Beschreibung, Button |
| WhatsApp | neu, siehe 8.1 | Kurznachricht mit Link |
| Presse | neu, siehe 8.1 | Dreizeiler plus Kontaktblock |

Eventbrite bleibt außen vor, solange nicht geklärt ist, ob der Kanal überhaupt bespielt
werden soll (siehe Verteilsystem-Spec, Aufgabe 7.1).

---

## 5. Architektur

### 5.1 Es wird nichts gespeichert

Die Texte werden bei jedem Aufruf frisch aus dem Event erzeugt. Kein neues Feld,
keine Migration für die Texte selbst, keine Möglichkeit, dass Kit und Event auseinanderlaufen.
Ändert die Redaktion die Beschreibung, ist der Kopiertext beim nächsten Blick korrekt.

Der einzige Zustand, der bleibt, ist das Häkchen aus Abschnitt 3, und das ist eine
`EventDistribution`-Zeile.

### 5.2 Dateien

```
src/lib/channel-kit/
  types.ts        ChannelKit, KitField, ChannelDefinition
  channels.ts     Kanaldefinitionen inklusive Limits (Konfiguration, siehe 6)
  portal-text.ts  Markdown zu Portaltext, Kürzen an Wortgrenzen
  hashtags.ts     Hashtags aus Kategorie
  build.ts        baut aus einem Event das vollständige Kit
src/app/api/admin/events/[id]/channel-kit/route.ts   GET, requireApiRole(VIEWER)
src/components/admin/ChannelKitPanel.tsx             Tabs, Feldkästen, Kopierknöpfe
src/components/admin/CopyField.tsx                   ein Feld mit Zähler und Knopf
```

Geändert:

```
src/app/admin/(dashboard)/events/[id]/edit/page.tsx   Kit-Panel einhängen
src/app/admin/(dashboard)/events/page.tsx             Spalte "verteilt"
src/lib/utm.ts                                        Quelle verallgemeinern (6.5)
```

### 5.3 Was wiederverwendet wird, statt es neu zu bauen

Das ist der Grund, warum der Aufwand klein bleibt. Fast alles existiert:

| Zweck | Vorhanden in |
|---|---|
| Markdown zu reinem Text | `markdownToPlainText`, `src/lib/markdown.ts:204` |
| Uhrzeit "20:00 bis 22:00 Uhr" | `formatTimeRange`, `src/lib/event-time.ts:104` |
| Gratis-Erkennung im Preis | `isFreeEntry`, `src/lib/event-price.ts` |
| Ticketlink oder Mailadresse | `isMailTicket`, `ticketHref`, `src/lib/ticket-url.ts` |
| Absolute URL je Sprache | `absoluteUrl`, `src/lib/seo.ts:40` |
| UTM-Parameter | `buildCampaignId`, `contentId`, `src/lib/utm.ts` |
| Adresse und Social-Handles | `getSiteContent`, `src/data/content.json` |
| Kopieren in die Zwischenablage inklusive Fallback | `src/components/custom/ShareButtons.tsx:25` |
| Erklärtext unter einem Feld | `FieldHint`, `src/components/admin/ui/FieldHint.tsx` |
| Panel-Muster in der Event-Maske | `EventForm.tsx:719` (Karte "Englische Übersetzung") |

### 5.4 Kein LLM in Phase 1

Bewusste Entscheidung. Deterministische Vorlagen sind kostenlos, sofort da, in Tests
festnagelbar und liefern zweimal dasselbe Ergebnis. Ein Sprachmodell würde bei jedem
Aufruf leicht anders formulieren, Kosten pro Event verursachen und müsste vor jeder
Veröffentlichung gegengelesen werden.

Die Redaktion kann jeden Text nach dem Einfügen ohnehin anpassen. Wenn sich nach einigen
Wochen zeigt, dass bestimmte Felder regelmäßig umformuliert werden, ist das die
Information, aus der man später einen sinnvollen Assistenten baut. Vorher wäre es geraten.

---

## 6. Die Regeln, an denen so ein Generator scheitert

### 6.1 Zeichenlimits sind Konfiguration, nicht Wahrheit

Die Formulare von Rausgegangen und IN München liegen hinter einem Login, und
Portalanbieter ändern ihre Felder ohne Ankündigung. Deshalb stehen alle Limits an
**einer** Stelle in `channels.ts`, jeweils mit Herkunft:

```ts
{
  id: 'rausgegangen',
  label: 'Rausgegangen',
  fields: [
    { key: 'title', label: 'Titel', max: 80, verified: false },
    { key: 'teaser', label: 'Kurzbeschreibung', max: 200, verified: false },
  ],
}
```

`verified: false` heißt: plausibel angenommen, aber nicht am echten Formular geprüft.
Das Panel zeigt bei unbestätigten Limits einen dezenten Hinweis, damit niemand einem
Zähler vertraut, den nie jemand nachgemessen hat.

**Aufgabe 9.1** ist, die Werte einmal am echten Formular abzulesen und `verified: true`
zu setzen. Das ist eine halbe Stunde Handarbeit und danach dauerhaft richtig.
Ein Generator, der falsche Limits hartkodiert, ist schlimmer als gar keiner:
er erzeugt Texte, die beim Einfügen abgeschnitten werden, und niemand merkt es.

### 6.2 Kürzen ohne Wortsalat

Wird ein Text zu lang, wird an der letzten Wortgrenze vor dem Limit gekürzt und ein
Auslassungszeichen angehängt. **Niemals mitten in einem Wort und niemals innerhalb einer
URL**, sonst entsteht ein Link, der ins Leere führt. Ist ein Pflichtfeld auch nach dem
Kürzen zu lang, wird es rot markiert statt still beschnitten. Die Redaktion soll das
sehen und entscheiden, nicht der Generator.

### 6.3 Keine Gedankenstriche in erzeugter Copy

`markdownToPlainText` gibt eine Trennlinie heute als `—` aus (`markdown.ts:220`).
In Portaltexten ist das genau das Zeichen, das in sichtbarer Copy nicht vorkommen soll.
`portal-text.ts` ersetzt es und prüft das Ergebnis zusätzlich auf `—` und `–`.
Ein Test sichert das ab, sonst schleicht sich das über Umwege wieder ein.

### 6.4 Ticketlink ist manchmal eine Mailadresse

`isMailTicket` existiert, weil im Feld auch blanke Adressen stehen. In einem Portalfeld
"Ticketlink" wäre das ein kaputter Eintrag. Regel: Ist es eine Mailadresse, wird das
Feld nicht als Link ausgegeben, sondern als Satz ("Anmeldung per Mail an ..."),
und im Feld Ticketlink steht die eigene Event-Seite.

### 6.5 Jeder Kanal bekommt seine eigene Quelle

Jeder ausgegebene Link trägt `utm_source` mit dem Kanalnamen. `utm.ts` kann das fast
schon, ist aber auf `newsletter` festgenagelt. Die Konstante wird zum Parameter.

Das ist der Punkt, an dem sich das Kanal-Kit selbst bewertet: Zusammen mit dem bereits
vorhandenen `TicketClick`-Ereignis (`src/lib/tracking.ts:162`) lässt sich nach einigen
Wochen sagen, welcher Kanal tatsächlich Ticketklicks bringt. Ohne das bleibt die Frage,
ob sich der ganze Aufwand lohnt, dauerhaft unbeantwortbar.

### 6.6 Instagram hat keine klickbaren Links

Eine URL in der Caption ist toter Text. Die Instagram-Caption enthält deshalb keinen
Link, sondern Datum, Uhrzeit, Ort und den Hinweis auf den Link im Profil.
Der Link wird als eigenes Feld "Link für die Bio" ausgegeben, damit er dort landet,
wo er wirkt.

Hashtags kommen aus der Kategorie plus einem festen Sockel (`#pepedome`, `#münchen`,
`#ostpark`). Getrennt vom Caption-Feld, weil viele sie lieber in den ersten Kommentar
setzen.

### 6.7 Fehlende Daten sichtbar machen, nicht überspielen

Kein Bild, kein Preis, kein Ticketlink: Das Panel sagt, welches Portal dieses Feld
verlangt und dass es fehlt. Ein Generator, der stattdessen "Preis auf Anfrage" erfindet,
schreibt Fehlinformationen in fremde Portale.

### 6.8 Wiederkehrende Formate ergeben ein Kit, nicht sechsundzwanzig

Kindevents mit gesetztem `parentEventId` bekommen kein eigenes Kit. Stattdessen erzeugt
das Elternevent ein Kit mit Terminliste, passend zu den Serienterminen, die Rausgegangen
und IN München ohnehin anbieten. Das ist die Stelle, an der das Kanal-Kit am meisten
Zeit spart.

### 6.9 Geschlossene Veranstaltungen gehören nicht nach außen

Events der Kategorie `BUSINESS` sind Firmenvermietungen. Für sie wird kein Kit erzeugt.
Google verlangt für Event-Markup ohnehin öffentliche Buchbarkeit, und eine
Firmenfeier in einem Stadtmagazin ist niemandem geholfen.

---

## 7. Oberfläche

Eigener Reiter in der Event-Bearbeitung, nicht in die Sidebar gequetscht, weil sieben
Kanäle mit je fünf bis sieben Feldern zu viel für eine schmale Spalte sind.

- Links die Kanalliste mit Häkchenstatus, rechts die Felder des gewählten Kanals.
- Pro Feld: Beschriftung, Text in einer Monospace-Box, Zeichenzähler `142 / 200`,
  Kopierknopf mit derselben Rückmeldung wie in `ShareButtons.tsx` ("Kopiert" für zwei Sekunden).
- Zähler wird gelb ab 90 Prozent, rot über dem Limit.
- Pro Kanal "Alles kopieren" als ein Block mit Feldnamen, für Portale,
  deren Formular man ohnehin in einem Rutsch ausfüllt.
- Unten das Häkchen "eingetragen" plus Feld für die URL der Veröffentlichung.
- Nur im Edit-Modus, wie die Übersetzungskarte. Bei `mode === 'create'` ein Hinweis,
  dass das Kit nach dem Speichern bereitsteht.

Rollen: Lesen ab `VIEWER`, Häkchen setzen ab `EDITOR`. Es geht nichts nach außen,
also ist `SUPER_ADMIN` hier nicht nötig.

---

## 8. Datenbank

### 8.1 Eine Migration, drei Enum-Werte

Für IN München, WhatsApp und Presse fehlen Werte in `DistributionChannel`.
`ALTER TYPE ... ADD VALUE` läuft in PostgreSQL ohne Tabellensperre und ist damit
unkritisch. Zu beachten: Neue Enum-Werte lassen sich in älteren PostgreSQL-Versionen
nicht innerhalb derselben Transaktion verwenden, in der sie angelegt wurden.
Deshalb eine eigene Migration, die nur das tut, getrennt von allem anderen.

Vor dem Eingriff wie immer `prisma migrate diff` prüfen, damit die Baseline aus
`0_init` nicht angetastet wird.

### 8.2 Sonst nichts

Keine Änderung an `Event`. Das Kit ist abgeleitet.

---

## 9. Aufgaben

Stand: 9.2 bis 9.11 sind gebaut, die Migration aus 9.10 ist eingespielt,
`npm test` ist grün (414 Tests, ohne Datenbank).

9.1 ist für die **beiden Portale erledigt**, auf die es ankommt. Die Werte
stehen mit `verified: true` in `channels.ts` und sind in
`tests/lib/channel-kit.test.ts` festgenagelt, damit eine Änderung am Portal
einen roten Test erzeugt statt still einen abgeschnittenen Titel.

**Rausgegangen** (`zentrale.events`, fünf Schritte). Drei Annahmen widerlegt:

- Titel fasst **180 Zeichen**, nicht 80.
- Die Beschreibung hat **kein Limit**, das Feld ist ein Rich-Text-Editor.
  Die angenommenen 2000 hätten grundlos gekürzt.
- Eine **Kurzbeschreibung gibt es nicht**, ein **Ticketlink-Feld auch nicht**:
  Rausgegangen ist selbst der Ticketshop. Beide Felder sind entfallen.
- Der Ort wird aus einer Liste gewählt, nicht getippt. Dazu ein Tag-Feld
  (Schlagwörter ohne Raute) und Preise erst in Schritt 4 als Ticketkategorie.

**IN München** (`in-muenchen.de/eintragsformular`, öffentlich):

- Titel ist auf **60 Zeichen** begrenzt, nicht auf 100, und keine Versalien.
- Die Beschreibung hat ebenfalls **kein Limit**, Rich-Text-Editor.
- Das Feld Ticketlink verlangt ausdrücklich **nur echte Ticketlinks**, für die
  eigene Seite gibt es ein eigenes Feld "Webseite". Ort, Straße und PLZ sind
  ebenfalls getrennte Felder.

Damit war die ursprüngliche Annahme in beiden Fällen an derselben Stelle falsch:
Titel zu kurz angesetzt, Beschreibung unnötig gekürzt. Genau der Schaden, den
Abschnitt 6.1 beschreibt.

**Instagram und Facebook** brauchen kein Ablesen: dort gibt es kein Formular mit
Feldgrenzen, nur ein Textfeld. Ein Limit als "ungeprüft" zu markieren wäre dort
irreführend gewesen. Deshalb kennt `channels.ts` jetzt drei Herkünfte statt
eines Ja/Nein (`LimitOrigin` in `types.ts`):

| Herkunft | Bedeutung | Marke im Panel |
|---|---|---|
| `portal` | am Formular abgelesen oder dokumentiert | keine |
| `redaktion` | eigene Vorgabe, das Portal erlaubt mehr | `~` |
| `annahme` | geschätzt, nie nachgemessen | `?` |

Damit bleibt als echte Restunsicherheit nur **Google Business Profile**. Die
Felder des Beitragstyps "Veranstaltung" sind dokumentiert (Titel sowie Start und
Ende sind Pflicht, dazu Beschreibung, Foto und eine Aktionsschaltfläche mit
Link), Zeichenlimits nennt Google aber nirgends. Titel und Beschreibung stehen
dort deshalb als `annahme`.

- **9.1** Feldstrukturen und Limits einmal an den echten Formularen ablesen:
  Rausgegangen (`zentrale.events`, Vier-Schritt-Formular), IN München
  (`in-muenchen.de/eintragsformular`), Google Business Profile, Instagram, Facebook.
  Werte in `channels.ts` eintragen und `verified: true` setzen.
  **Das ist die einzige Aufgabe, die vor dem Bau erledigt sein sollte**, weil die
  Limits das Verhalten des Generators bestimmen.
- **9.2** `types.ts` und `channels.ts` anlegen.
- **9.3** `portal-text.ts`: Markdown zu Portaltext, Kürzen an Wortgrenze,
  Gedankenstrich-Ersetzung, Leerzeilen normalisieren.
- **9.4** `hashtags.ts`: Kategorie-Zuordnung plus fester Sockel.
- **9.5** `build.ts`: Kit aus einem Event bauen, inklusive Serienfall (6.8)
  und Ausschluss von `BUSINESS` (6.9).
- **9.6** `utm.ts` verallgemeinern: `utm_source` als Parameter statt Konstante,
  Newsletter-Aufrufe unverändert weiterlaufen lassen.
- **9.7** `GET /api/admin/events/[id]/channel-kit`.
- **9.8** `CopyField.tsx` und `ChannelKitPanel.tsx`.
- **9.9** Häkchen "eingetragen" schreibt eine `EventDistribution`-Zeile,
  `POST` auf die bestehende Distributions-Route oder eine eigene.
- **9.10** Migration für die drei Enum-Werte (8.1).
- **9.11** Spalte "verteilt" in der Event-Übersicht.

Aufwand insgesamt: etwa eineinhalb bis zwei Tage, plus die halbe Stunde für 9.1.

---

## 10. Tests

`npm test` läuft ohne Datenbank gegen den Prisma-Mock. Alles hier ist reine
Textverarbeitung und damit vollständig ohne Datenbank testbar. Das ist ein Nebenvorteil
gegenüber den Adaptern.

`tests/lib/channel-kit.test.ts`:

- Markdown-Beschreibung ergibt sauberen Fließtext ohne `#`, `**` und `[]()`
- **Kein `—` und kein `–` in irgendeinem erzeugten Feld**, auch nicht über eine
  Markdown-Trennlinie
- Zu langer Text wird an der Wortgrenze gekürzt, nie mitten im Wort
- Eine URL wird nie durch Kürzen zerschnitten
- `ticketUrl` als Mailadresse ergibt einen Anmeldesatz und keinen kaputten Link
- Gratis-Preis ("Kostenlos", "Eintritt frei", "umsonst") ergibt "Eintritt frei"
- Fehlendes Bild, fehlender Preis: Hinweis statt erfundenem Inhalt
- Instagram-Caption enthält keine URL
- Jeder ausgegebene Link trägt das richtige `utm_source`
- Kindevent erzeugt kein eigenes Kit, Elternevent erzeugt eine Terminliste
- `BUSINESS` erzeugt kein Kit
- Umlaute und Anführungszeichen überstehen die Umwandlung

---

## 11. Abnahmekriterien

1. Ein Event mit Markdown-Beschreibung ergibt für jeden Kanal Text, der ohne
   Nacharbeit in dessen Formular passt.
2. Jedes Feld lässt sich mit einem Klick kopieren, mit sichtbarer Rückmeldung.
3. Zeichenzähler stimmt mit dem tatsächlichen Limit des Portals überein,
   und unbestätigte Limits sind als solche gekennzeichnet.
4. Kein erzeugter Text enthält Markdown-Reste oder Gedankenstriche.
5. Ein Event ohne Bild oder ohne Preis erzeugt sichtbare Hinweise statt erfundener Inhalte.
6. Das Häkchen "eingetragen" erzeugt eine `EventDistribution`-Zeile mit URL und Zeitpunkt.
7. Die Event-Übersicht zeigt pro Event, auf wie vielen Kanälen es steht.
8. Ein wöchentliches Training erzeugt ein Kit mit Terminliste, nicht sechsundzwanzig Kits.
9. `npm test` ist grün, ohne Datenbank und ohne Netzwerk.

---

## 12. Offene Punkte

1. **Die echten Feldstrukturen** (Aufgabe 9.1). Alles andere hängt daran.
   Der Zugang zu `zentrale.events` existiert bereits, weil dort die Tickets verkauft werden.
2. **Presse-Verteiler:** Gibt es eine Liste von Redaktionen, an die der Dreizeiler geht?
   Falls ja, wäre das später ein Fall für den vorhandenen Resend-Stack statt für Copy-Paste.
3. **WhatsApp:** Kanal oder Broadcast-Liste? Beeinflusst nur die Textlänge, nicht den Bau.
4. **Englische Fassung:** Die Übersetzungen liegen in `translations`. Portale außerhalb
   von München und Instagram wären Kandidaten für Englisch. Vorschlag: Phase 1 nur Deutsch,
   danach anhand der Attribution aus 6.5 entscheiden.
5. **Reihenfolge der Kanäle im Panel:** am besten nach tatsächlichem Ertrag sortieren,
   sobald die Zahlen aus 6.5 vorliegen. Bis dahin alphabetisch.
