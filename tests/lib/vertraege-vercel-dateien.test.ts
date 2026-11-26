// @vitest-environment node
/**
 * Dateien, die das Vertrags-PDF auf Vercel braucht.
 *
 * Auf Vercel liegt neben einer Funktion nur, was der Build ihr zuordnet. Was
 * der Code zur Laufzeit von der Platte liest, muss in
 * `outputFileTracingIncludes` stehen (next.config.ts). Fehlt dort etwas, läuft
 * lokal und in jedem anderen Test alles, und erst auf Vercel antwortet die
 * PDF-Route mit 500. So ist es am 26.11.2026 passiert: pdfkit lädt die Maße
 * seiner Standardschrift erst beim Zeichnen nach.
 *
 * Dieser Test kann Vercel nicht nachstellen. Er hält fest, was dort gebraucht
 * wird, und schlägt an, wenn ein Update von pdfkit die Dateien verschiebt.
 */

import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { describe, it, expect } from 'vitest'
import nextConfig from '../../next.config'

const wurzel = path.resolve(__dirname, '../..')
const mitgegeben = nextConfig.outputFileTracingIncludes?.['/api/admin/contracts/**'] ?? []

describe('Dateien für die PDF-Routen auf Vercel', () => {
  it.each([
    ['das Logo', './public/vertraege/**'],
    ['die Schrift', './src/lib/vertraege/fonts/*.ttf'],
    ['die Standardschriften von pdfkit', './node_modules/pdfkit/js/standard-fonts/**'],
  ])('gibt %s mit', (_was, muster) => {
    expect(mitgegeben).toContain(muster)
  })

  it('findet alles davon auch wirklich an seinem Platz', () => {
    expect(existsSync(path.join(wurzel, 'public/vertraege/logo-pepe-dome.png'))).toBe(true)
    expect(existsSync(path.join(wurzel, 'src/lib/vertraege/fonts/Inter-Regular.ttf'))).toBe(true)
    expect(existsSync(path.join(wurzel, 'src/lib/vertraege/fonts/Inter-Bold.ttf'))).toBe(true)
  })

  it('pdfkit hält seine Standardschrift dort bereit, wo die Liste sie erwartet', () => {
    // Zieht pdfkit die Dateien bei einem Update um, stimmt der Eintrag in
    // next.config.ts nicht mehr. Dann die PDF-Probe auf einem Vercel-Preview
    // aufrufen: /api/admin/contracts/pdf-probe.
    const ordner = path.join(wurzel, 'node_modules/pdfkit/js/standard-fonts')
    const dateien = readdirSync(ordner)
    expect(dateien).toContain('Helvetica.cjs')
    expect(dateien).toContain('HelveticaBold.cjs')
  })

  it('lässt die PDF-Bibliothek ungebündelt', () => {
    expect(nextConfig.serverExternalPackages).toContain('@react-pdf/renderer')
  })
})
