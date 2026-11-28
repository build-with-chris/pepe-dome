-- AlterEnum
-- Zwei neue Vertragstypen. IF NOT EXISTS: siehe
-- 20261107120000_add_newsletter_content_show_image, die Datei laeuft so auch
-- ein zweites Mal ohne Fehler.
--
-- Postgres kann Werte eines Enums nicht wieder entfernen. Wird ein Typ nicht
-- mehr gebraucht, bleibt sein Wert einfach ungenutzt stehen.
ALTER TYPE "ContractType" ADD VALUE IF NOT EXISTS 'KUENSTLER';
ALTER TYPE "ContractType" ADD VALUE IF NOT EXISTS 'VERANSTALTER';
