-- AlterTable
-- IF NOT EXISTS: Die Migrationshistorie der Produktion ist gedriftet, Spalten
-- wurden dort teils per `prisma db execute` eingespielt (docs/UEBERGABE.md 3.5).
-- So laeuft die Datei auf beiden Wegen und auch ein zweites Mal ohne Fehler.
ALTER TABLE "newsletter_content" ADD COLUMN IF NOT EXISTS "show_image" BOOLEAN NOT NULL DEFAULT true;
