-- Drei Kanäle für das Kanal-Kit.
--
-- IN München, WhatsApp und Presse haben keine API, sondern ein Formular. Sie
-- werden von Hand eingetragen und das Häkchen im Admin schreibt danach eine
-- Zeile nach "event_distributions" — dieselbe Zeile, die ein Adapter später
-- auch schreiben würde.
--
-- Diese Migration tut absichtlich nichts anderes: neue Enum-Werte lassen sich
-- in derselben Transaktion, in der sie angelegt wurden, nicht verwenden.
-- Getrennt gehalten kann keine spätere Änderung darüber stolpern.
--
-- ADD VALUE hängt an, sperrt die Tabelle nicht und ist damit unkritisch.

ALTER TYPE "distribution_channel" ADD VALUE IF NOT EXISTS 'in_muenchen';
ALTER TYPE "distribution_channel" ADD VALUE IF NOT EXISTS 'whatsapp';
ALTER TYPE "distribution_channel" ADD VALUE IF NOT EXISTS 'presse';
