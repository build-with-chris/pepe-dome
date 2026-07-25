/**
 * JSON-LD im Script-Tag
 *
 * Anlass: Die SEO-Blöcke gingen durch JSON.stringify direkt in ein
 * dangerouslySetInnerHTML. JSON.stringify escaped `<` nicht, ein schliessendes
 * Script-Tag in einem redaktionellen Feld brach also aus dem Block aus und lief
 * als JavaScript — auf jeder öffentlichen Event-, Artikel- und Newsletter-Seite.
 */

import { describe, it, expect } from 'vitest'
import { jsonLdScriptContent } from '@/lib/json-ld'

// Zusammengesetzt, damit dieser Testdatei selbst kein Script-Tag im Quelltext steht
const CLOSING_SCRIPT = '</' + 'script>'
const OPENING_SCRIPT = '<' + 'script>'

// U+2028/U+2029: in JSON erlaubt, in JavaScript Zeilenumbrueche.
// Bewusst ueber fromCharCode statt als Literal — im Quelltext waeren sie unsichtbar.
const LINE_SEP = String.fromCharCode(0x2028)
const PARA_SEP = String.fromCharCode(0x2029)

describe('jsonLdScriptContent', () => {
  it('lässt kein rohes spitzes Klammernpaar durch', () => {
    const out = jsonLdScriptContent({ headline: `Fest ${CLOSING_SCRIPT}${OPENING_SCRIPT}alert(1)${CLOSING_SCRIPT}` })

    expect(out).not.toContain('<')
    expect(out).not.toContain('>')
    expect(out.toLowerCase()).not.toContain('</script')
  })

  it('escaped auch das kaufmännische Und', () => {
    // Sonst liesse sich über HTML-Entities im Script-Kontext nachhelfen
    expect(jsonLdScriptContent({ a: 'A & B' })).not.toContain('&')
  })

  it('escaped die JavaScript-Zeilentrenner U+2028 und U+2029', () => {
    const out = jsonLdScriptContent({ a: `x${LINE_SEP}y${PARA_SEP}z` })

    expect(out).not.toContain(LINE_SEP)
    expect(out).not.toContain(PARA_SEP)
  })

  it('verändert den Inhalt nicht — Suchmaschinen lesen dasselbe', () => {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: `Sommerfest ${CLOSING_SCRIPT} & mehr`,
      description: `Zeilen${LINE_SEP}umbruch`,
      offers: { price: '12.50', currency: 'EUR' },
      tags: ['zirkus', 'open air'],
    }

    expect(JSON.parse(jsonLdScriptContent(data))).toEqual(data)
  })

  it('kommt mit den Standardtypen klar', () => {
    expect(JSON.parse(jsonLdScriptContent({ n: 1, b: true, nil: null }))).toEqual({
      n: 1,
      b: true,
      nil: null,
    })
  })
})
