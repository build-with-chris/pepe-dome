-- Englische Fassung für Artikel, nach demselben Muster wie bei Events.
--
-- Rein additiv: bestehende Artikel bekommen ein leeres Objekt und zeigen auf
-- /en/news/… weiter den deutschen Text, bis eine Übersetzung gepflegt ist.

-- AlterTable
ALTER TABLE "public"."articles" ADD COLUMN "translations" JSONB NOT NULL DEFAULT '{}';
