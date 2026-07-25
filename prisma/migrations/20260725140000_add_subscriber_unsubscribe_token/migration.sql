-- Abmelde-Token pro Abonnent.
--
-- Bisher genügte die E-Mail-Adresse als Parameter, um jemanden auszutragen.
-- Damit konnte ein Fremder mit einer Adressliste den kompletten Verteiler leeren.
-- Ab jetzt braucht die Abmeldung ein Geheimnis, das nur in der jeweiligen Mail steht.

-- 1. Spalte zunächst nullable anlegen, damit bestehende Zeilen nicht kollidieren.
ALTER TABLE "subscribers" ADD COLUMN "unsubscribe_token" TEXT;

-- 2. Bestandsdaten befüllen. Zwei zusammengesetzte UUIDs ergeben 256 Bit Zufall,
--    genug gegen Erraten, und gen_random_uuid() ist ab PostgreSQL 13 eingebaut,
--    also ohne pgcrypto-Extension verfügbar.
UPDATE "subscribers"
SET "unsubscribe_token" = replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '')
WHERE "unsubscribe_token" IS NULL;

-- 3. Erst jetzt verpflichtend machen.
ALTER TABLE "subscribers" ALTER COLUMN "unsubscribe_token" SET NOT NULL;

-- 4. Default als Sicherheitsnetz.
--    Ohne ihn müsste jede Stelle, die einen Abonnenten anlegt, das Feld selbst
--    setzen; ein vergessener Aufruf bricht dann erst zur Laufzeit. Die
--    regulären Wege setzen weiterhin ein eigenes 256-Bit-Token.
ALTER TABLE "subscribers" ALTER COLUMN "unsubscribe_token" SET DEFAULT gen_random_uuid()::text;

-- CreateIndex
CREATE UNIQUE INDEX "subscribers_unsubscribe_token_key" ON "subscribers"("unsubscribe_token");
