# SPEC: Kursverwaltung im Backend

## Kern

Die Kursorganisation ändert Kurszeiten, Texte und den Status selbst im Admin, ohne dass jemand Code anfasst. Woran man es merkt: die drei Korrekturen von heute (Trainer falsch, zwei Kurse gestrichen, Buchungstext veraltet) wären ein Vorgang im Browser gewesen statt vier Commits.

## Nicht-Ziele

- **Bilder, überall.** Kein Kursbild, kein Trainerfoto, kein Umbau des Detail-Modals. Das ist der sichtbarste Teil und trotzdem nicht der Kern: es macht die Seite schöner, nicht pflegbar. Kommt in v2, wenn die Pflege läuft.
- **Trainer-Tabelle.** Trainer bleiben ein Textfeld am Kurs. Das Duplikat-Problem, das eine Trainer-Tabelle löst, verschwindet schon durch die Trennung Kurs/Zeitslot: „Michael" steht dann einmal statt dreimal.
- **Englische Kurstexte.** Bleibt wie heute: deutsche Inhalte, übersetzte Oberfläche. Eine Übersetzungs-Oberfläche verdoppelt jedes Formularfeld für einen Bruchteil der Besucher.
- **Freigabe-Schritt vor dem Livegang.** Ausdrücklich abgewählt. Eine eingearbeitete Person pflegt, Fehler sind in 30 Sekunden korrigiert. Ein Vier-Augen-Prinzip würde Entwurf und Live trennen und damit das Modell verkomplizieren.
- **Kursbuchung im eigenen System.** Gebucht wird weiter über Eversports und Aircrobatic Studios. Wir verwalten die Darstellung, nicht die Plätze.
- **Aufräumen der übrigen `src/data`-Altlasten.** `news.json`, `events.json`, `newsletter.json` sind toter Code (nachgewiesen: alle Seiten lesen aus `lib/db-data.ts`), aber sie stören niemanden. Eigener Vorgang.

## Betroffene Dateien und Schnittstellen

**Neu**

| Pfad | Inhalt |
|---|---|
| `prisma/migrations/<ts>_add_courses/migration.sql` | Additive Migration, drei Tabellen |
| `src/lib/db-courses.ts` | Leseseite: Kurse laden, nach Wochentag gruppieren, Typen für die Website |
| `src/app/api/admin/courses/route.ts` | GET Liste, POST anlegen |
| `src/app/api/admin/courses/[id]/route.ts` | GET, PATCH, DELETE |
| `src/app/api/admin/schedule-notes/route.ts` | Tagesnotizen lesen und schreiben |
| `src/app/admin/(dashboard)/courses/page.tsx` | Liste, Filter nach Status |
| `src/app/admin/(dashboard)/courses/new/page.tsx` | Anlegen |
| `src/app/admin/(dashboard)/courses/[id]/edit/page.tsx` | Bearbeiten |
| `src/components/admin/forms/CourseForm.tsx` | Formular inkl. Zeitslot-Liste |
| `scripts/seed-courses.ts` | Einmalige Übernahme des heutigen Bestands |
| `docs/admin-kurse-guide.md` | Kurzanleitung für die Orga |

**Geändert**

| Pfad | Änderung |
|---|---|
| `prisma/schema.prisma` | Modelle `Course`, `CourseSlot`, `ScheduleNote`; `ContentStatus` wird wiederverwendet |
| `src/app/[lang]/training/page.tsx` | Liest aus `db-courses` statt aus `WOCHE`; ISR statt statisch; `localizeWoche`/`NOTE_DE_TO_EN` fallen weg |
| `src/components/custom/CourseScheduleGrid.tsx` | Die Gruppierung nach `title\|trainer\|target` entfällt, die Daten kommen schon gruppiert. Typen `Kurs`/`Tag`/`Slot` wandern nach `db-courses.ts` |
| `src/components/admin/AdminSidebar.tsx` | Menüpunkt „Kurse" |
| `src/lib/admin-routes.ts` | Route-Registrierung für die Rechteprüfung |
| `src/data/training-data.ts` | **Entfällt** nach der Übernahme. `DISCIPLINES` zieht um nach `src/data/disciplines.ts` |

**Datenmodell, kurz**

```
Course        id, slug (stabil), title, sub, description, inhalte[], alter,
              fuerWen, target(kinder|jugendliche|erwachsene), trainer,
              bookingUrl?, bookingLabel?, bookingNote?, status, sortOrder
CourseSlot    id, courseId, weekday(1-7), startTime "HH:MM", endTime "HH:MM"
ScheduleNote  weekday(1-7) unique, text
```

Ein Kurs, beliebig viele Slots. Luftakrobatik ist eine Zeile mit vier Slots.

## Akzeptanzkriterien

| # | Kriterium (prüfbar formuliert) | Aufwand |
|---|---|---|
| 1 | Migration läuft auf der Prod-DB durch, `migrate diff` vorher zeigt nur die drei neuen Tabellen, kein Datenverlust an bestehenden | 0,5 T |
| 2 | `/de/training` und `/en/training` zeigen exakt denselben Plan wie heute, gelesen aus der DB | 0,5 T |
| 3 | Fällt die DB aus, zeigt die Seite weiter den zuletzt erfolgreich erzeugten Plan statt eines leeren Bereichs | 0,25 T |
| 4 | `/admin/courses` listet alle Kurse mit Status und Slot-Anzahl, filterbar nach veröffentlicht/pausiert | 0,25 T |
| 5 | Ein neuer Kurs lässt sich mit mindestens einem Zeitslot anlegen; Slots lassen sich im Formular hinzufügen und entfernen | 1 T |
| 6 | Ein Kurs auf „pausiert" verschwindet von der Website, bleibt im Admin sichtbar und wiederherstellbar | 0,25 T |
| 7 | Die Tagesnotizen für Donnerstag, Samstag und Sonntag sind im Admin änderbar | 0,5 T |
| 8 | Nach dem Speichern ist die Änderung beim nächsten Seitenaufruf sichtbar, ohne Wartezeit und ohne Deployment | 0,25 T |
| 9 | Die 5 aktiven und 3 pausierten Kurse stehen mit allen Texten in der DB, Slugs unverändert, alte `?kurs=`-Links funktionieren weiter | 0,5 T |
| 10 | `training-data.ts` ist entfernt, nichts importiert es mehr, Build und Tests grün | 0,25 T |

**Summe: 4,25 Arbeitstage**

Referenzklasse: der Events-Bereich im Admin, laut deiner Einschätzung rund ein Arbeitstag für Modell, API, Liste und Formular.

**Das ist etwa das Vierfache der Referenz. Der Unterschied ist benennbar und nicht wegzudiskutieren:**
- Events haben ein flaches Formular, Kurse brauchen eine Liste von Zeitslots zum Hinzufügen und Entfernen. Das ist der teuerste Einzelposten (#5).
- Events hatten keine Bestandsdaten zu übernehmen, hier müssen 8 Kurse mit langen Texten migriert werden (#9).
- Events bekamen eine neue Seite, hier wird eine bestehende, funktionierende Seite umgebaut (#2, #3, #10).
- `revalidatePath` gibt es im Projekt noch nirgends, #8 ist neues Terrain.

**Drumherum, separat: rund 1 Arbeitstag**
- Tests für Leseseite und API, passend zu den vorhandenen 492
- Migration auf der Produktions-DB, mit `migrate diff` vorher (siehe Riskanteste Annahme)
- Kurzanleitung `docs/admin-kurse-guide.md`
- Rollout und Nachschauen auf der Live-Seite

**Gesamt: rund 5 Arbeitstage.**

Falls das zu viel ist, sind das die billigsten weiteren Schnitte, in dieser Reihenfolge:
1. Tagesnotizen zurück in den Code (#7): **-0,5 T**, Preis: bei „Tricking startet" muss ich wieder ran.
2. Slots ohne Endzeit, nur Startzeit: **-0,25 T**, Preis: „17:15 bis 18:15" wird zu „ab 17:15".
3. Kein Pausieren, nur Löschen (#6): **-0,25 T**, Preis: gestrichene Kurse verlieren ihre Texte. Rate ich ab, genau das war heute das Thema.

## Unterhalb der Schnittlinie (v2, bewusst verschoben)

- **Kursbild und Trainerfoto im Detail-Modal.** Der ursprüngliche Wunsch. Infrastruktur steht bereits: `/api/admin/upload` schreibt nach Supabase Storage, `ImageDropzone` ist gebaut. Braucht: zwei Felder am Modell, zwei Felder im Formular, Modal-Umbau. Schätzung 0,75 T, sobald v1 läuft.
- **Trainer als eigene Tabelle** mit Foto, Kurzvorstellung und Verknüpfung zu mehreren Kursen.
- **Englische Kurstexte** über ein `translations`-JSON, wie beim Event-Modell.
- **Ferien und Ausfälle** („diese Woche kein Training"), heute gar nicht abgebildet.
- **Sortierung der Kurse per Ziehen** statt über ein Zahlenfeld.

## Riskanteste Annahme

**Dass die Migration sauber auf die Produktions-DB geht.**

Die DB hatte ursprünglich keine Migrationshistorie und wurde nachträglich auf `0_init` gebaselined. Seitdem liefen sechs additive Migrationen problemlos, das spricht dafür. Wäre die Annahme falsch, steht im schlimmsten Fall die Live-Datenbank schief, und daran hängen Newsletter, Abonnenten und Events, nicht nur Kurse.

Billig vorab prüfbar, vor jeder Schemaänderung:

```bash
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script
```

Zeigt das etwas anderes als `CREATE TABLE` für die drei neuen Tabellen, wird nicht migriert, sondern erst geklärt. `event_distributions` nicht anfassen.

Zweitgrößte Annahme, deutlich billiger zu prüfen: dass `revalidatePath` auf Vercel für eine ISR-Seite mit `[lang]`-Segment beide Sprachvarianten trifft. Ein Wegwerf-Test mit einer bestehenden Seite klärt das in 20 Minuten, bevor #8 gebaut wird.

## End-to-End-Prüfschritt

Ausführbar von jemand anderem, mit echten Daten:

1. Im Admin unter `/admin/courses` den Kurs „Kinder Akrobatik" öffnen.
2. Die Startzeit des Mittwoch-Slots von `16:30` auf `16:45` ändern und speichern.
3. `/de/training` in einem neuen Tab öffnen. In der Kursübersicht steht auf der Karte „Mittwochs, 16:45 bis 18:00 Uhr", im Wochenplan bei Mittwoch dasselbe. Ohne Deployment, ohne Wartezeit.
4. Denselben Kurs auf „pausiert" setzen und speichern.
5. `/de/training` neu laden: Der Kurs ist weg, der Zähler im Filter „Kinder" steht auf 1 statt 2, Mittwoch zeigt „2 Kurse" statt 3.
6. Den Kurs wieder auf „veröffentlicht" setzen. Schritt 3 gilt wieder, alle Texte sind unverändert vorhanden.
7. `https://www.pepe-dome.de/de/training?kurs=kinder-akrobatik-mi` aufrufen: das Detail-Fenster öffnet sich wie vorher. Der alte Link darf nicht gebrochen sein.

## Offene Punkte

- **Zielgruppen-Bezeichner.** Im Code heißt die mittlere Gruppe `teens`, angezeigt wird seit heute „Jugendliche". Bei der Migration entweder umbenennen (sauberer, aber Datenmigration) oder den technischen Namen behalten. Vorschlag: behalten, ist unsichtbar.
- **Wer bekommt Schreibrechte?** Es gibt `viewer`, `editor`, `super_admin`. Kurse anlegen und ändern passt zu `editor`, dieselbe Stufe wie Events. Müsste bestätigt werden.
- **Löschen erlaubt?** Ich würde im Formular nur „pausieren" anbieten und echtes Löschen `super_admin` vorbehalten, damit niemand versehentlich Texte verliert.
