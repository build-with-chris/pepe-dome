# Kurse pflegen

**Für:** Kursorganisation Pepe Dome
**Stand:** 28.07.2026

Kurse stehen seit Juli 2026 in der Datenbank und werden im Admin gepflegt. Vorher lagen sie im Programmcode, jede Änderung brauchte eine Entwicklerin. Das ist vorbei.

---

## Der Grundgedanke: ein Kurs, mehrere Termine

Das ist die einzige Sache, die man verstanden haben muss.

**Luftakrobatik läuft viermal pro Woche:** montags 17:15 und 18:15, mittwochs 17:00 und 18:00. Trotzdem ist es **ein Kurs mit vier Terminen**, nicht vier Kurse.

Warum das wichtig ist: Wenn die Beschreibung geändert werden muss oder ein Trainername falsch ist, macht man das an einer Stelle. Früher standen die vier Termine als vier vollständige Kopien da, und als „Michael Heiduk" zu „Michael" werden sollte, musste das an drei Stellen passieren. Eine wurde vergessen.

**Faustregel:** Gleicher Kurs an einem anderen Tag oder zu einer anderen Uhrzeit? Dann ein Termin mehr im selben Kurs. Anderer Inhalt, andere Zielgruppe? Dann ein neuer Kurs.

---

## Wo

Admin öffnen, links im Menü **Kurse**. Man braucht die Rolle „Editor" oder höher.

---

## Einen Kurs ändern

1. In der Liste auf den Kurs klicken.
2. Ändern.
3. Unten auf **Änderungen speichern**.

Die Änderung ist danach sofort auf der Website. Nicht erst nach einer Stunde, nicht erst nach dem nächsten Deployment. Einmal speichern reicht, mehrfaches Klicken ändert nichts.

---

## Einen Kurs pausieren statt löschen

Wenn ein Kurs eine Weile nicht stattfindet:

1. Kurs öffnen.
2. Unter **Sichtbarkeit** den Status auf **Pausiert** stellen.
3. Speichern.

Der Kurs verschwindet von der Website. Beschreibung, Inhalte und Termine bleiben vollständig erhalten. Kommt der Kurs zurück, stellt man den Status wieder auf **Veröffentlicht** und alles ist wie vorher.

**Das ist fast immer der richtige Weg.** Löschen gibt es nur für Super-Admins und entfernt die Texte endgültig. Eine gut geschriebene Kursbeschreibung ist Arbeit, die man nicht wegwirft, weil ein Kurs zwei Monate Pause hat.

Die drei Status bedeuten:

| Status | Heißt |
|---|---|
| **Entwurf** | Noch nie veröffentlicht, steht nicht auf der Website. Zum in Ruhe Vorbereiten. |
| **Veröffentlicht** | Steht auf der Website. |
| **Pausiert** | War schon mal online, ist gerade heruntergenommen. Texte bleiben. |

---

## Einen neuen Kurs anlegen

Oben rechts **Neuer Kurs**. Die Felder von oben nach unten:

**Titel** — Die Überschrift, z.B. „Kinder Akrobatik".

**Unterzeile** — Steht im Wochenplan klein unter dem Titel, z.B. „5 bis 12 Jahre · mit Michael".

**Beschreibung** — Der erste Satz landet als Vorschautext auf der Kurskarte, der ganze Text im Detail-Fenster. Es lohnt sich also, mit einem Satz zu beginnen, der für sich allein steht und sagt, was in der Stunde passiert. „Spielerische Akrobatik für Kinder mit Michael." ist ein guter erster Satz. „In diesem Kurs, der seit 2024 läuft, gibt es viele Möglichkeiten." ist keiner.

**Termine** — Für jeden Wochentermin eine Zeile: Tag, Beginn, Ende. Mit **+ Termin hinzufügen** kommt eine weitere dazu. Der neue Termin startet, wo der vorige aufhört, das spart meistens Tippen.

**Zielgruppe** — Kinder, Jugendliche oder Erwachsene. Bestimmt die Farbe des Punkts und in welchem Filter der Kurs auftaucht.

**Trainer:in** — Nur der Name, so wie ihn Besucher lesen sollen. „Michael", nicht „Michael Heiduk".

**Altersangabe** — Steht ganz oben auf der Kurskarte, in der Kursfarbe: „Für Kinder von 5 bis 12". Eltern suchen zuerst danach, deshalb kurz und konkret. Ohne Angabe steht dort nur „Kinder" oder „Erwachsene", was weniger hilft.

**Für wen, ausführlich** — Steht im Detail-Fenster. Hier ist Platz für „Einstieg jederzeit möglich, Schnupperstunde unverbindlich".

**Inhalte** — Drei bis sechs Stichpunkte fürs Detail-Fenster. Leere Zeilen werden beim Speichern verworfen, man muss sie nicht wegräumen.

**Buchung** — Leer lassen. Nur ausfüllen, wenn der Kurs *nicht* über Eversports läuft. Beispiel Luftakrobatik: Buchung geht über Aircrobatic Studios, deshalb steht dort ein Link.

**Reihenfolge** — Kleinere Zahl steht weiter vorn in der Kursübersicht. Die vorhandenen Kurse sind in Zehnerschritten nummeriert (10, 20, 30…), damit man etwas dazwischenschieben kann, ohne alles umzunummerieren.

---

## Hinweise für leere Tage

Unter der Kursliste steht **Hinweise im Wochenplan**, eine Zeile pro Wochentag.

Das ist der Text, der im Wochenplan bei Tagen ohne Kurse erscheint, zum Beispiel donnerstags „Tricking & Breaking in Planung, Termine folgen." Feld leeren und speichern entfernt den Hinweis, der Tag steht dann ohne Zusatz da.

Jede Zeile hat einen eigenen Speichern-Knopf.

---

## Adressen bleiben stabil

Jeder Kurs hat eine feste Adresse, unter der man ihn direkt verlinken kann, z.B.:

```
https://www.pepe-dome.de/de/training?kurs=kinder-akrobatik-mi
```

Diese Adresse wird beim Anlegen einmal aus dem Titel gebildet und ändert sich danach **nicht mehr**, auch wenn der Titel umbenannt wird. Das ist Absicht: Links, die schon per WhatsApp verschickt wurden, sollen weiter funktionieren.

Die Adresse steht oben auf der Bearbeitungsseite.

---

## Was noch nicht geht

- **Kursbilder und Trainerfotos.** Ist geplant, aber noch nicht gebaut.
- **Englische Kurstexte.** Die Oberfläche der Website ist zweisprachig, die Kursbeschreibungen sind überall auf Deutsch.
- **Ferien und einzelne Ausfälle.** Wenn eine Woche ausfällt, gibt es dafür noch kein Feld. Behelf: einen Hinweis beim betreffenden Wochentag eintragen.

---

## Wenn etwas nicht stimmt

**Die Änderung ist nicht auf der Website zu sehen.** Erst die Seite im Browser neu laden, am besten mit gedrückter Umschalttaste. Bleibt es dabei, im Admin nachsehen, ob der Kurs wirklich auf **Veröffentlicht** steht.

**Der Kurs taucht in keinem Filter auf.** Zielgruppe prüfen. Ein Kurs ohne passende Zielgruppe erscheint nur unter „Alle".

**Speichern schlägt fehl.** Über dem Formular steht die Meldung. Häufigste Ursachen: ein Termin, dessen Ende vor dem Beginn liegt, oder ein Buchungslink ohne `https://` am Anfang.
