'use client'

/**
 * Bot-Schutz für die Newsletter-Formulare: unsichtbares Feld plus Ausfüllzeit.
 * Die Prüfung dazu steht in src/lib/bot-schutz.ts.
 */

import { useEffect, useRef, useState } from 'react'

export function useBotSchutz() {
  const [website, setWebsite] = useState('')
  const angezeigtAm = useRef<number | null>(null)

  // Erst im Browser messen. Beim Server-Rendering wäre die Zeit die des
  // Servers, und die Differenz hätte mit dem Ausfüllen nichts zu tun.
  useEffect(() => {
    angezeigtAm.current = Date.now()
  }, [])

  return {
    honeypotProps: { value: website, onChange: setWebsite },
    botFelder: () => ({
      website,
      fillMs: angezeigtAm.current === null ? 0 : Date.now() - angezeigtAm.current,
    }),
  }
}

/**
 * Für Menschen unsichtbar und mit Tab nicht erreichbar. Bewusst nicht
 * `display: none`: Manche Bots überspringen genau solche Felder.
 * Screenreader überspringen es dank `aria-hidden`.
 */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}
    >
      <label>
        Website
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  )
}
