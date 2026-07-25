-- Endzeit für Events, und Aufräumen der bestehenden Startzeiten.
--
-- Die Uhrzeit ist ein Textfeld, das Datumsfeld trägt nur den Kalendertag.
-- Ohne Vorgabe stand in der Redaktion mal "20:00", mal "20:00 Uhr", mal "ab 20".
-- Auf der Website standen dadurch unterschiedlich formatierte Karten nebeneinander.
-- Ab jetzt speichert die API ausschließlich "HH:MM" (src/lib/event-time.ts).

-- 1. Endzeit ergänzen. Optional: die meisten Shows geben nur den Beginn an.
ALTER TABLE "events" ADD COLUMN "end_time" TEXT;

-- 2. Bestandsdaten auf "HH:MM" ziehen.
--
--    Beide UPDATEs fassen nur an, was zweifelsfrei eine Uhrzeit ist. Werte wie
--    "nach Vereinbarung" oder "20:00 Uhr, Einlass 19:30" bleiben unverändert
--    stehen: sie tragen eine Information, die ein Umschreiben verlieren würde.
--    Die Ausgabe auf der Website kommt mit beidem zurecht.

-- 2a. Zeitspannen aufteilen: "10:00 – 16:00 Uhr", "8:00 - 9:30", "14.00 - 16.00 Uhr".
--     Genau dafür gibt es die neue Spalte. Bisher stand die Spanne komplett im
--     Startfeld und wurde auf den Karten als Klumpen ausgegeben.
UPDATE "events"
SET "time" =
      lpad(substring("time" from '^\s*(?:ab\s+)?(\d{1,2})\s*[:.]'), 2, '0')
      || ':' ||
      lpad(substring("time" from '^\s*(?:ab\s+)?\d{1,2}\s*[:.]\s*(\d{1,2})'), 2, '0'),
    "end_time" =
      lpad(substring("time" from '(?:-|–|—|bis)\s*(\d{1,2})\s*[:.]'), 2, '0')
      || ':' ||
      lpad(substring("time" from '(?:-|–|—|bis)\s*\d{1,2}\s*[:.]\s*(\d{1,2})'), 2, '0')
WHERE "time" ~* '^\s*(?:ab\s+)?(?:[01]?[0-9]|2[0-3])\s*[:.]\s*[0-5]?[0-9]\s*(?:-|–|—|bis)\s*(?:[01]?[0-9]|2[0-3])\s*[:.]\s*[0-5]?[0-9]\s*(?:uhr)?\s*$';

-- 2b. Stunde und Minute vorhanden: "20:00 Uhr", "ab 19.30", "9:5"
UPDATE "events"
SET "time" =
      lpad(substring("time" from '(\d{1,2})\s*[:.]'), 2, '0')
      || ':' ||
      lpad(substring("time" from '[:.]\s*(\d{1,2})'), 2, '0')
WHERE "time" ~* '^\s*(?:ab\s+)?(?:[01]?[0-9]|2[0-3])\s*[:.]\s*[0-5]?[0-9]\s*(?:uhr)?\s*$';

-- 2c. Nur die volle Stunde: "20", "20 Uhr", "ab 20h"
UPDATE "events"
SET "time" = lpad(substring("time" from '(\d{1,2})'), 2, '0') || ':00'
WHERE "time" ~* '^\s*(?:ab\s+)?(?:[01]?[0-9]|2[0-3])\s*(?:uhr|h)?\s*$';

-- 2d. Leere Strings sind kein "keine Angabe" für Prisma, aber genau das sind sie.
UPDATE "events" SET "time" = NULL WHERE btrim("time") = '';
