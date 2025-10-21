PRD: Pepe Dome Beta Plattform (News + Events + Newsletter)

1. Hintergrund / Motivation

Im Pepe Dome passieren wöchentlich Shows, Workshops und Events. Die neue Website soll als digitaler Hub diese Vielfalt sichtbar machen — mit News, Kalender und einem leistungsstarken Newsletter-System. Die Seite wird in React umgesetzt und nutzt Resend für den Versand.

2. Zielsetzung
	•	Dynamische Website für Events & Ankündigungen
	•	Newsbereich als Magazin / Blog mit aktuellen Beiträgen
	•	Newsletter-Tool, das monatlich Event-Zusammenfassungen als Mail und Landingpage bereitstellt
	•	Admin-UI zur Verwaltung von Inhalten, Mailing-Listen und Versand
	•	Mail-Adressen sammeln und DSGVO-konform verwalten

3. Zielgruppen
	•	Besucher:innen des Pepe Dome (Shows, Workshops, Trainings)
	•	Firmenkunden / Mieter
	•	Partner & Kulturinteressierte
	•	Interne Redaktion & Redaktionsteam

4. Kern-Features (Beta)

4.1 News / Magazin
	•	News-Artikel mit Teaser, Kategorie, Autor, Bild
	•	Filterbar nach Kategorie & Schlagwort
	•	Verknüpfung zu Events, Profilen etc.

4.2 Event-Modul
	•	Anzeige kommender & vergangener Events
	•	Event-Detailseite mit Bild, Beschreibung, Zeit, Ort, Kategorie
	•	Optional: Ticket-Link
	•	Events nach Monat filterbar (Kalender-Ansicht)

4.3 Newsletter-Tool (Neu)
	•	Aus Events eines Monats wird automatisch ein Newsletter generiert
	•	Ausgabe als HTML-Seite (z. B. unter /newsletter/2025-10)
	•	Versand über Resend (API)
	•	Admin kann Inhalte vor Versand anpassen, testen, senden
	•	Vorschaufunktion für Mail & Web

4.4 Admin UI (Neu)
	•	Login / Auth
	•	Content-Management für:
	•	Newsartikel
	•	Events
	•	Newsletter-Ausgaben
	•	Newsletter-Versand: Empfängerlisten, Vorschau, Versandlog
	•	Formular für E-Mail-Opt-in über Website verwaltbar (DSGVO-konform)

4.5 Lead-Generierung
	•	Mail-Einsammeln auf Startseite, Events & News
	•	DSGVO-konformes Double Opt-In über Resend
	•	Speicherung in DB mit Zeitstempel, Kategorie (z. B. “Training”, “Show”)

5. Technische Umsetzung
	•	Frontend: React + Tailwind CSS
	•	Backend: tbd (Node/Express oder Next.js App Router)
	•	Newsletter-Versand: Resend API
	•	Datenbank: PostgreSQL
	•	Admin UI: Eigenes Panel, optional mit React Admin / Headless CMS

6. User-Flows
	•	Nutzer:in besucht Seite → Trägt sich für Newsletter ein → Erhält monatliche Vorschau
	•	Redaktion: erstellt Events & News → wählt für Newsletter aus → versendet Mail

7. Erfolgskriterien (KPIs)
	•	Anzahl Newsletter-Abonnent:innen
	•	Öffnungsrate, Klickrate
	•	Event-Aufrufe über Mailings
	•	Verweildauer / Bounce Rate
	•	Redaktionelle Aktivität

8. Roadmap (Beta)

Woche	Feature
1	Setup Projektstruktur, DB-Modelle, Seiten-Routing
2	News-Modul, Event-Modul, Startseite Hub
3	Newsletter-Seite + Resend-Integration
4	Admin UI mit Login, Bearbeitung, Mail-Test & Versand
5	Lead-Formulare, DSGVO, Tests & Launch Beta

9. Offene Fragen
	•	Sollen Empfänger segmentiert werden (z. B. Training vs Business)?
	•	Wer hat Admin-Rechte?
	•	Benötigen wir ein Rollen- / Rechtesystem für Autor:innen?
	•	Wird eine Archivfunktion für alte Newsletter benötigt?

⸻

Hinweis für Gamma-Präsi:
Dieser PRD bildet die inhaltliche Grundlage für deine Folien 1, 3, 5, 6, 7, 8, 9.
Visualisiere:
	•	Newsletter-Versand-Flow (Startseite → Mail → Event-Seite)
	•	Admin UI Mockup (z. B. Events auswählen → Vorschau → Send)
	•	Monatsvorschau als Landingpage mit Eventkarten (wie eine Mini-Website)
	•	Mail-Einsammeln auf allen Seiten, klarer CTA.

Auf Wunsch kann ich dir gerne auch das Admin-UI in React als Code-Vorlage liefern.