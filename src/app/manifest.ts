/**
 * Web-App-Manifest (wird von Next automatisch unter /manifest.webmanifest
 * ausgeliefert und im <head> verlinkt).
 *
 * Ergänzt die vorhandenen Icons und Marken-Farben um die Installations-Metadaten,
 * die Browser und Suchmaschinen für „zum Startbildschirm hinzufügen" und das
 * App-Panel auslesen. Theme-Farbe ist das Markenblau (#016dca).
 */

import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pepe Dome — Artistik & Kultur in München',
    short_name: 'Pepe Dome',
    description:
      'Der Pepe Dome im Ostpark München: Shows, Training und Events in der geodätischen Kuppel.',
    start_url: '/',
    display: 'standalone',
    lang: 'de',
    background_color: '#0a0a0a',
    theme_color: '#016dca',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}
