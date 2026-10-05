# SPEC: Artists bei Events

## Kern

Wer auf einer Event-Detailseite mehr wissen will, sieht, wer auftritt: Foto, Name, ein paar Sätze dazu, was die Person kann, woher sie kommt und welchen Hintergrund sie hat, dazu Instagram und Website zum Folgen. Woran man es merkt: Auf der Seite von Circus & Poetry steht unter der Beschreibung ein Abschnitt „Wer auftritt“. Eine Bio wird einmal gepflegt und hängt an jedem Termin, bei dem die Person mitmacht.

## Nicht-Ziele

- **Eigene Profilseite pro Artist** (`/artists/[slug]`). Der Kern ist Tiefe *am Event*. Eine eigene URL bringt Teilbarkeit und SEO, aber niemand hat danach gefragt.
- **Artist-Übersichtsseite.** Sie ergibt erst Sinn, wenn es Profilseiten gibt.
- **Rolle pro Event** („Regie“, „Luft“, „Musik“). Das hieße ein Zusatzfeld an der Verknüpfung und eine Eingabe pro Event und Person. Die Bio sagt schon, was jemand macht.
- **Artists auf Event-Kacheln, im Newsletter, im Channel-Kit.** Die Kacheln sind schon voll, und der Newsletter ist ein eigener Renderpfad. Erst sehen, ob der Abschnitt auf der Detailseite genutzt wird.
- **Instagram-Einbettungen und Follower-Zahlen.** Das bringt Drittanbieter-Skripte und damit Consent-Fragen. Ein Link tut es.
- **Freie Linkliste** (TikTok, YouTube, Linktree …). Bewusst nur Instagram und Website: zwei feste Felder, sauber mit Icons. Bei Bedarf kann man einen Linktree als Website eintragen.
- **Reihenfolge per Drag & Drop.** Die Artists erscheinen in der Reihenfolge, in der sie im Event ausgewählt wurden.
- **Entwurf/Veröffentlicht-Status für Artists.** Ein Artist ist sichtbar, sobald er an einem veröffentlichten Event hängt. Wer nicht sichtbar sein soll, wird nicht zugeordnet.
- **Serienlogik.** Im Code gibt es keine automatisch erzeugten Folgetermine, `recurrence` ist nur ein gespeichertes Feld. Folgetermine entstehen über „Duplizieren“, und das nimmt die Artists mit (AK 6). Mehr braucht es nicht.
- **JSON-LD `performer`.** Ist günstig, gehört aber zu einer SEO-Runde, nicht hierher.

## Betroffene Dateien und Schnittstellen

- `prisma/schema.prisma`: neues Model `Artist` (id, slug, name, imageUrl, bio, translations Json wie bei Event mit `{ en: { bio } }`, instagramUrl, websiteUrl, Zeitstempel). Neues Model `EventArtist` als Verknüpfung nach dem Muster von `ArticleEvent`, mit Feld `position` für die Reihenfolge und `onDelete: Cascade` an beiden Seiten. `Event` bekommt die Relation `artists`.
- `prisma/migrations/<datum>_add_artists/migration.sql` (**neu**): nur `CREATE TABLE`, Indizes und Fremdschlüssel. Keine Änderung an `events`.
- `src/lib/artist-validation.ts` (**neu**): Zod-Schema. Name Pflicht. Bio Pflicht, höchstens 600 Zeichen. Bio EN optional, höchstens 600. Instagram als URL oder `@handle`, normalisiert auf `https://www.instagram.com/<handle>/`. Website nur `https://`.
- `src/app/api/admin/artists/route.ts` (**neu**): GET-Liste mit Anzahl verknüpfter Events, POST.
- `src/app/api/admin/artists/[id]/route.ts` (**neu**): GET, PUT, DELETE.
- `src/app/api/admin/artists/[id]/translate/route.ts` (**neu**): Bio per `deeplTranslate` aus `src/lib/deepl.ts` übersetzen, Aufbau wie `api/admin/events/[id]/translate`.
- `src/app/admin/(dashboard)/artists/page.tsx`, `new/page.tsx`, `[id]/page.tsx` (**neu**): Liste, Anlegen, Bearbeiten nach dem Muster von `admin/(dashboard)/courses`.
- `src/components/admin/forms/ArtistForm.tsx` (**neu**): Felder Name, Foto (bestehender Upload über `ImageDropzone` und `api/admin/upload`), Bio DE, Bio EN mit DeepL-Knopf, Instagram, Website.
- `src/components/admin/AdminSidebar.tsx`: Eintrag „Artists“. **Achtung:** Die Datei hat gerade nicht committete Änderungen (Freigabe-Bereich). Vor dem Umsetzen klären, ob sie committet sind.
- `src/components/admin/forms/EventForm.tsx`: neuer Block „Wer auftritt“ mit Mehrfachauswahl aus den vorhandenen Artists. Die Reihenfolge ergibt sich aus der Auswahl.
- `src/app/api/admin/events/route.ts` und `src/app/api/admin/events/[id]/route.ts`: nehmen `artistIds: string[]` an und ersetzen die Verknüpfungen in einer Transaktion.
- `src/app/api/admin/events/[id]/duplicate/route.ts`: kopiert die `EventArtist`-Zeilen mit.
- `src/lib/db-data.ts`: nur `getEventBySlug` lädt die Artists sortiert nach `position`. `EventData` bekommt ein optionales Feld `artists`. Listing, Newsletter und Channel-Kit bleiben unberührt.
- `src/components/events/EventArtists.tsx` (**neu**): Abschnitt mit Karten (Foto, Name, Bio, Icons für Instagram und Website, `target="_blank" rel="noopener noreferrer"`). Ist keine EN-Bio da, wird auf Englisch die deutsche gezeigt.
- `src/app/[lang]/events/[slug]/page.tsx`: bindet `EventArtists` zwischen Beschreibung und Highlights ein, nur wenn mindestens ein Artist zugeordnet ist.
- `src/dictionaries/de.json`, `en.json`: Überschrift „Wer auftritt“ / „Who's performing“, Link-Labels für Screenreader.
- Tests (**neu**): `tests/lib/artist-validation.test.ts`, `tests/components/event-artists.test.tsx`, ein Test für die Duplicate-Route mit Prisma-Mock.

## Akzeptanzkriterien

| # | Kriterium (prüfbar formuliert) | Aufwandsschätzung |
|---|-------------------------------|-------------------|
| 1 | Die Migration legt `artists` und `event_artists` an und ändert keine bestehende Tabelle. `prisma migrate diff` zeigt nur CREATE-Anweisungen. | 15 min |
| 2 | Die Admin-API lehnt einen Artist ohne Namen, mit über 600 Zeichen Bio oder mit `http://`-Website mit 400 ab. `@pepe.dome` wird als `https://www.instagram.com/pepe.dome/` gespeichert. | 25 min |
| 3 | Unter `/admin/artists` lässt sich ein Artist mit Foto, Bio DE, Instagram und Website anlegen und bearbeiten. Die Liste zeigt pro Artist die Zahl der Events. | 40 min |
| 4 | Der DeepL-Knopf füllt das Feld Bio EN aus der deutschen Bio. Das Feld bleibt danach von Hand editierbar. | 10 min |
| 5 | Löschen eines Artists, der an 2 Events hängt, fragt nach („Hängt an 2 Events. Trotzdem löschen?“). Danach fehlt er auf beiden Eventseiten, die Events selbst bleiben unverändert. | 10 min |
| 6 | Im Event-Formular lassen sich mehrere Artists auswählen. Nach dem Speichern und Neuladen stehen sie in derselben Reihenfolge da. | 30 min |
| 7 | „Duplizieren“ eines Events mit 2 Artists ergibt eine Kopie mit denselben 2 Artists in derselben Reihenfolge. | 5 min |
| 8 | `/de/events/<slug>` zeigt „Wer auftritt“ mit Foto, Name, Bio und funktionierenden Links. `/en/events/<slug>` zeigt die EN-Bio, ohne EN-Bio die deutsche. Ohne zugeordnete Artists erscheint der Abschnitt nicht. Auf 375px Breite gibt es keinen horizontalen Scroll. | 35 min |

**Summe: ca. 2 h 50 min.** Referenzklasse: die Kursverwaltung (Tabelle, Admin-API, Formular, Bild-Upload, Leseseite) hat nach deiner Angabe tatsächlich etwa 2 Stunden gedauert. Dort fehlten Englisch, eine Verknüpfungstabelle und die Integration in ein bestehendes großes Formular (`EventForm.tsx`, 958 Zeilen). Deshalb liegt diese Schätzung höher.

**Drumherum:**
- Tests schreiben und `npm test` grün: 25 min
- Migration auf Supabase per `npm run db:migrate` (geht nicht automatisch beim Build): 10 min, **nur nach Rückfrage**, weil sie die Produktions-DB betrifft
- Durchklicken im Browser, Desktop und mobil: 15 min
- Datenpflege: die ersten Artists anlegen und zuordnen, ca. 5 min pro Person. Das ist deine Zeit und nicht in der Summe enthalten.

**Gesamt ohne Datenpflege: ca. 3 h 40 min.**

## Unterhalb der Schnittlinie (v2, bewusst verschoben)

- Profilseite `/[lang]/artists/[slug]` und Übersicht aller Artists (der `slug` wird schon angelegt, damit das später ohne Migration geht)
- Rolle pro Event an `EventArtist`
- Artists auf Event-Kacheln, im Newsletter-Template und im Channel-Kit
- JSON-LD `performer` auf der Eventseite
- Weitere Link-Typen (TikTok, YouTube)
- Reihenfolge per Drag & Drop

## Riskanteste Annahme

Die Migration ist rein additiv und lässt die bestehenden Events unangetastet. Falls Prisma beim Hinzufügen der Relation doch etwas an `events` ändern will, trifft das die Produktions-DB, und dort gibt es keinen einfachen Rückweg. **Vorab billig prüfen:** Die Migration mit `npx prisma migrate dev --create-only --name add_artists` gegen eine lokale Wegwerf-DB erzeugen (`DATABASE_URL` auf `localhost`, nie die `.env`-DB, siehe CLAUDE.md) und die erzeugte `migration.sql` lesen, bevor irgendetwas angewendet wird. Erlaubt sind nur `CREATE TABLE`, `CREATE INDEX` und `ADD CONSTRAINT` auf den neuen Tabellen.

## End-to-End-Prüfschritt

1. Im Admin unter `/admin/artists` einen Artist anlegen: echter Name aus dem Circus-&-Poetry-Ensemble, Foto hochladen, deutsche Bio (2 bis 3 Sätze), Instagram als `@handle`, Website. Speichern.
2. Auf „Übersetzen“ klicken, die EN-Bio prüfen, speichern.
3. Einen zweiten Artist genauso anlegen.
4. Das Circus-&-Poetry-Event am 8. Oktober öffnen, beide Artists auswählen, speichern.
5. `/de/events/<slug des 8. Oktober>` öffnen: Unter der Beschreibung steht „Wer auftritt“ mit beiden Karten in der gewählten Reihenfolge. Der Instagram-Link öffnet das richtige Profil in einem neuen Tab.
6. `/en/events/<slug>` öffnen: Überschrift „Who's performing“, englische Bios.
7. Das Event am 8. Oktober duplizieren: Die Kopie hat dieselben beiden Artists.
8. Den zweiten Artist löschen: Es kommt die Rückfrage mit „2 Events“. Danach zeigt die Eventseite nur noch den ersten. Die Kopie aus Schritt 7 wieder löschen.
9. Die Seite auf 375px Breite ansehen: Die Karten stehen untereinander, nichts läuft über.

## Offene Punkte

- `AdminSidebar.tsx` hat zurzeit nicht committete Änderungen aus dem Freigabe-Bereich. Vor dem Umsetzen committen oder verwerfen, damit sich die Arbeiten nicht vermischen.
- Bildformat der Artist-Fotos: Die vorhandenen Fotos in `public/images/artists` haben unterschiedliche Formate. Die Karte schneidet auf ein quadratisches Format zu (`object-cover`). Wenn Gesichter dabei abgeschnitten werden, braucht es einen Fokuspunkt. Das wird erst sichtbar, wenn echte Fotos drin sind.
