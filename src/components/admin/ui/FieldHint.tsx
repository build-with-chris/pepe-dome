import type { ReactNode } from 'react'

/**
 * Erklärtext unter einem Formularfeld
 *
 * Die Admin-Formulare hatten Labels wie "Preheader" oder "Kurzbeschreibung",
 * aber nichts, was sagt, wo dieser Text später landet. Wer nicht selbst am
 * Template gebaut hat, muss raten und dann speichern, um es zu sehen.
 *
 * Der Hinweis beantwortet deshalb immer dieselbe Frage: Wo taucht das auf, was
 * ich hier eintippe? Als eigene Komponente, damit die Hinweise nicht in drei
 * Formularen in drei Größen und Grautönen stehen.
 */
export default function FieldHint({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] leading-relaxed text-white/45">{children}</p>
  )
}
