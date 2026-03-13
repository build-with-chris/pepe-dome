# Ladegeschwindigkeit & Optimierung (v. a. Mobile)

## Analyse (Stand: Projekt-Check)

### Kritische Punkte

| Bereich | Befund | Auswirkung Mobile |
|--------|--------|-------------------|
| **Hero-Video** | `PepeDome-Atmosphaere.mp4` ~18 MB, kein Poster, `preload` standardmäßig auto | Hoher initialer Datenverbrauch, langsamer LCP, Risiko für langsame 3G/4G |
| **Video-Sektion** | 4 Clips (showreel ~55 MB, vertical-* je ~7–14 MB), Carousel lädt mit Seite | Viel Traffic, auch wenn nur ein Video sichtbar ist (Desktop: preload=none für inaktiv bereits umgesetzt) |
| **Bilder Startseite** | Features: Next/Image ohne `sizes`; Events/News über Komponenten | Größere Bilder als nötig auf schmalen Viewports |
| **Fonts** | Outfit + Inter (next/font), `display: swap` | Text erscheint schnell; Fonts erhöhen etwas Ladezeit |
| **Third-Party** | Google Analytics (Tag Manager) mit `afterInteractive` | Gut: blockiert nicht das erste Rendering |
| **Below-the-fold** | VideoCarousel, EventCards, NewsCards, Newsletter-Bereich | Werden trotzdem mit initialem HTML/JS geladen |

### Bereits umgesetzt

- VideoCarousel Mobile: ein großes Video, nur ein `<video>`-src (Lazy pro Clip).
- VideoCarousel Desktop: nur aktives Video mit `preload="auto"`, Rest `preload="none"`.
- Fonts: `display: swap`.
- GA: `strategy="afterInteractive"`.
- HomeDotCloud: dynamischer Import (`ssr: false`).

---

## Empfehlungen (Priorität)

### 1. Hero-Video (größter Hebel für Mobile)

- **Poster-Bild:** Ein statisches Bild (z. B. erster Frame oder reduziertes Bild) als `poster="/images/hero-poster.jpg"` am Hero-`<video>`. Verbessert LCP und Wahrnehmung der Ladezeit, während das Video nachlädt.
- **Preload reduzieren:** `preload="metadata"` statt nichts/auto, damit zuerst nur wenig geladen wird. Video startet dann etwas verzögert; in Kombination mit Poster oft akzeptabel.
- **Optional – Mobile-spezifisches Video:** Kürzeres oder stärker komprimiertes MP4 nur für Mobile (z. B. `<source media="(max-width: 768px)" src="...-mobile.mp4">`), um Datenvolumen zu senken.

### 2. Video-Sektion (Erlebe den Dome live)

- **VideoCarousel dynamisch laden:** `dynamic(import('…VideoCarousel'), { ssr: true })`, damit der Carousel-Code in einem eigenen Chunk liegt und die initiale JS-Größe der Startseite sinkt.
- **Videos komprimieren:** showreel.mp4 (~55 MB) und ggf. vertical-* mit niedrigerer Bitrate/Auflösung re-encodieren; gleiche Abmessungen, geringere Dateigröße.
- **Mobile:** Bereits umgesetzt: nur ein Video-Stream; Strip-Thumbnails mit `preload="metadata"` – beibehalten.

### 3. Bilder

- **Startseite „Was dich erwartet“:** Für jede Feature-Karte `sizes` setzen (z. B. `(max-width: 768px) 100vw, 50vw`) und `loading="lazy"`, damit Next.js passende Breiten ausliefert und Below-the-fold-Bilder verzögert geladen werden.
- **Event/News-Karten:** In EventCard/NewsCard bereits `sizes` prüfen; auf Mobil „100vw“ oder 1 Spalte, auf Desktop passend zur Grid-Spalte.

### 4. Fonts

- **Optional:** Nur eine Schrift (z. B. Outfit) für den Above-the-fold-Bereich nutzen, Inter erst für Fließtext dynamisch nachladen, um die erste Anzeige zu beschleunigen.

### 5. Sonstiges

- **Next.js Image:** Durchgängig `sizes` für alle responsiven Bilder setzen.
- **Kritische CSS-Inline:** Next bringt bereits viel; zusätzliche Above-the-fold-Styles nur wenn messbar nötig.
- **Caching:** Deployment (z. B. Vercel) nutzt in der Regel starkes Caching; lange Cache-Header für statische Assets prüfen.

---

## Kurz-Checkliste

- [ ] Hero: Poster-Bild hinzufügen (optional; `preload="metadata"` ist gesetzt).
- [x] Hero: `preload="metadata"` am Video (weniger initialer Download).
- [x] VideoCarousel: dynamischer Import (separater Chunk, weniger initiales JS).
- [x] Feature-Bilder Startseite: `sizes` + `loading="lazy"`.
- [ ] Optional: Hero-Video Mobile-Version (kleinere Datei).
- [ ] Optional: Showreel/Vertical-Videos komprimieren.
- [ ] Optional: LCP-Element (Hero-Titel/Poster) mit `fetchpriority="high"` falls sinnvoll.
