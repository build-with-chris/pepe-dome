/**
 * Kleine Skizzen, wo die Newsletter-Felder landen
 *
 * Betreff und Hero-Titel wurden im Editor oft verwechselt: Man änderte den
 * Betreff, erwartete eine neue Überschrift in der Mail und sah keine
 * Änderung, weil ein eigener Hero-Titel gesetzt war. Umgekehrt stand ohne
 * Hero-Titel plötzlich der Betreff als Überschrift in der Mail.
 *
 * Die Skizzen zeigen deshalb live, was getippt wird, an der Stelle, an der es
 * später erscheint: einmal das Postfach, einmal der Kopf der geöffneten Mail.
 */

import type { ReactNode } from 'react'

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="ml-2 inline-block rounded bg-amber-400/15 px-1.5 py-0.5 align-middle text-[10px] font-medium uppercase tracking-wide text-amber-300">
      {children}
    </span>
  )
}

function Caption({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
      {children}
    </p>
  )
}

/** So erscheint die Mail in der Liste des Postfachs, noch ungeöffnet. */
export function InboxPreview({ subject, preheader }: { subject: string; preheader?: string }) {
  return (
    <div>
      <Caption>So sieht es im Postfach aus, vor dem Öffnen</Caption>
      <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[13px] font-semibold text-white">PEPE Dome</span>
          <span className="text-[11px] text-white/35">09:00</span>
        </div>
        <p className="truncate text-[13px] text-white">
          {subject || <span className="text-white/30">Betreff</span>}
          <span className="text-[10px] text-sky-300/70"> ← Betreff</span>
        </p>
        <p className="truncate text-[12px] text-white/45">
          {preheader || <span className="text-white/25">Preheader (leer: Anfang des Intro-Texts)</span>}
          <span className="text-[10px] text-sky-300/70"> ← Preheader</span>
        </p>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-white/45">
        Betreff und Preheader stehen nur hier, in der Mail selbst sieht man sie nicht.
        Die große Überschrift in der Mail stellst du unter „Kopfbereich (Hero)“ ein.
      </p>
    </div>
  )
}

/** So erscheint der Kopf der geöffneten Mail. */
export function HeroPreview({
  subject,
  heroTitle,
  heroSubtitle,
  heroCTALabel,
  hasImage,
}: {
  subject: string
  heroTitle?: string
  heroSubtitle?: string
  heroCTALabel?: string
  hasImage: boolean
}) {
  const usesSubject = !heroTitle
  return (
    <div>
      <Caption>So sieht der Anfang der geöffneten Mail aus</Caption>
      <div className="overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.03]">
        {hasImage && (
          <div className="flex h-14 items-center justify-center bg-white/[0.06] text-[11px] text-white/35">
            Hero-Bild
          </div>
        )}
        <div className="space-y-1.5 px-4 py-3">
          <p className="text-[16px] font-bold leading-snug text-white">
            {heroTitle || subject || <span className="text-white/30">Hero-Titel</span>}
            {usesSubject && subject && <Tag>vom Betreff übernommen</Tag>}
          </p>
          {heroSubtitle && <p className="text-[12px] text-white/55">{heroSubtitle}</p>}
          {heroCTALabel && (
            <span className="inline-block rounded-md border border-white/20 px-3 py-1 text-[11px] text-white/80">
              {heroCTALabel}
            </span>
          )}
        </div>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-white/45">
        {usesSubject
          ? 'Solange der Hero-Titel leer ist, steht hier der Betreff. Trägst du einen Hero-Titel ein, ändert ein neuer Betreff an dieser Stelle nichts mehr.'
          : 'Hier steht dein Hero-Titel. Ein geänderter Betreff wirkt sich darauf nicht aus, er steht nur im Postfach.'}
      </p>
    </div>
  )
}
