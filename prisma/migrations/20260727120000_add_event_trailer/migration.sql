-- Trailer am Event.
--
-- Eine Spalte, nullable, kein Default: bestehende Events bleiben unangetastet
-- und zeigen weiterhin keinen Trailer. Rein additiv, insbesondere wird
-- "event_distributions" nicht angefasst.
--
-- Der Inhalt ist bewusst Text und keine engere Struktur: das Feld nimmt sowohl
-- einen YouTube-/Vimeo-Link als auch einen Pfad wie "/videos/showreel.mp4"
-- entgegen. Die Unterscheidung trifft die Anwendung (src/lib/event-trailer.ts),
-- nicht die Datenbank.

-- AlterTable
ALTER TABLE "public"."events" ADD COLUMN "trailer_url" TEXT;
