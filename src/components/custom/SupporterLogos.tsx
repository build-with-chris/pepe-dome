"use client";

import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { FUNDERS, SUPPORTERS, type Supporter } from "@/data/supporters";
import type { Locale } from "@/i18n/config";

/**
 * Die Logos der Förderer, einmal für die Über-uns-Seite und einmal für den
 * Footer.
 *
 * Warum weisse Kacheln: die Seite ist dunkel, die Logos sind schwarz auf weiss
 * gesetzt und teils mehrfarbig. Auf dem dunklen Grund waeren sie unsichtbar.
 * Sie einzufaerben oder zu invertieren ist keine Option, Foerderlogos duerfen
 * nicht veraendert werden. Eine helle Flaeche darunter ist der Weg, der die
 * Vorgaben einhaelt und trotzdem zum Rest der Seite passt. Baender bringen
 * diese Flaeche schon mit und bekommen deshalb keine Kachel.
 *
 * Warum nicht alle Logos gleich hoch: die Formate gehen weit auseinander. Das
 * Foerderband des Bund-Laender-Programms ist siebenmal so breit wie hoch und
 * traegt einen Fliesstext, das Stiftungslogo ist hochformatig. Auf eine
 * gemeinsame Hoehe gebracht waere der Text im Band unlesbar und die Stiftung
 * ein Briefmarken-Quadrat. Deshalb bekommt jedes Format seine eigene Groesse,
 * hergeleitet aus dem Seitenverhaeltnis der Datei.
 *
 * Ein Klick auf ein Logo oeffnet die Grossansicht: die Leiste in voller Breite
 * und darunter jeder Foerderer mit ein, zwei Saetzen, was er beitraegt. Im
 * Footer ist die Leiste so klein, dass man die Namen kaum lesen kann.
 */

const TEXTS = {
  de: {
    open: "Förderer in Großansicht zeigen",
    title: "Wer den Pepe Dome fördert",
    intro:
      "Ohne diese Förderung gäbe es den Dome im Ostpark nicht. Wer was beiträgt:",
    close: "Schließen",
  },
  en: {
    open: "Show funders in full size",
    title: "Who funds Pepe Dome",
    intro:
      "Without this funding there would be no Dome in Ostpark. Who contributes what:",
    close: "Close",
  },
} as const;

/**
 * Ab diesem Seitenverhältnis gilt ein Logo als Band und bekommt eine eigene
 * Zeile. Der Wert trennt das Foerderband des Bund-Laender-Programms (gut 7:1,
 * mit Fliesstext darin) von den normalen Logoleisten (etwa 4:1), die in der
 * gemeinsamen Zeile besser aufgehoben sind.
 */
const BAND_RATIO = 6;

function ratioOf(supporter: Supporter) {
  return supporter.width / supporter.height;
}

/** Gemeinsamer Fokus- und Hover-Zustand der Logo-Knoepfe. */
const triggerClass =
  "cursor-zoom-in rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pepe-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-black";

export default function SupporterLogos({
  variant = "page",
  lang = "de",
  className,
}: {
  /** `page` steht fuer sich, `footer` laeuft am Seitenende mit und ist kleiner. */
  variant?: "page" | "footer";
  lang?: Locale;
  className?: string;
}) {
  const t = TEXTS[lang];
  const isFooter = variant === "footer";
  const bands = SUPPORTERS.filter((s) => ratioOf(s) >= BAND_RATIO);
  const rest = SUPPORTERS.filter((s) => ratioOf(s) < BAND_RATIO);

  const tileClass = cn(
    "flex items-center justify-center rounded-lg bg-white",
    isFooter ? "px-3 py-2" : "px-5 py-4",
  );

  return (
    <Dialog.Root>
      <div
        className={cn(
          "flex flex-col items-center",
          isFooter ? "gap-3" : "gap-5",
          className,
        )}
      >
        {rest.length > 0 && (
          <ul
            className={cn(
              "flex list-none flex-wrap items-center justify-center",
              isFooter ? "gap-3" : "gap-5",
            )}
          >
            {rest.map((supporter) => {
              // Hochformatiges neben querformatigem Logo: auf gleicher Hoehe
              // wirkt das hochformatige deutlich kleiner, also bekommt es mehr.
              const isTall = ratioOf(supporter) < 1.2;
              return (
                <li key={supporter.src}>
                  <Dialog.Trigger
                    aria-label={t.open}
                    className={cn(tileClass, triggerClass, "hover:opacity-90")}
                  >
                    <Image
                      src={supporter.src}
                      alt={supporter.alt}
                      width={supporter.width}
                      height={supporter.height}
                      className={cn(
                        "w-auto object-contain",
                        isFooter
                          ? isTall
                            ? "h-11"
                            : "h-8"
                          : isTall
                            ? "h-20 md:h-24"
                            : "h-12 md:h-16",
                      )}
                      sizes={isFooter ? "160px" : "320px"}
                    />
                  </Dialog.Trigger>
                </li>
              );
            })}
          </ul>
        )}

        {bands.map((supporter) => (
          <Dialog.Trigger
            key={supporter.src}
            aria-label={t.open}
            // Keine weisse Kachel darunter: das Band bringt seine helle Flaeche
            // selbst mit, die Kachel waere nur ein zweites Weiss an derselben
            // Stelle. Ohne sie laesst sich das Bild leicht abdunkeln, damit der
            // Block auf der schwarzen Seite nicht knallt.
            className={cn("group block w-full overflow-hidden", triggerClass)}
          >
            <Image
              src={supporter.src}
              alt={supporter.alt}
              width={supporter.width}
              height={supporter.height}
              // Das Band traegt Pflichtangaben zum Foerderprogramm und bekommt
              // die volle Breite, damit der Text darin lesbar bleibt. Der
              // Container ist hoechstens 1180px breit, die Datei 1400px: das
              // Band wird also nie hochskaliert.
              className="h-auto w-full object-contain opacity-[0.88] transition-opacity group-hover:opacity-100"
              sizes="(max-width: 639px) 92vw, 1180px"
            />
          </Dialog.Trigger>
        ))}
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[9998] bg-black/90 backdrop-blur-sm" />
        <Dialog.Content
          // Kein Vollbild wie in der Galerie: hier gibt es Text zu lesen, der
          // auf breiten Schirmen eine Zeilenlaenge braucht. Die Karte scrollt
          // in sich, wenn sie auf kleinen Schirmen hoeher ist als der Bildschirm.
          className="fixed left-1/2 top-1/2 z-[9999] flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-[var(--pepe-line)] bg-[var(--pepe-ink)] shadow-2xl focus:outline-none"
        >
          <div className="flex flex-shrink-0 items-start justify-between gap-4 border-b border-[var(--pepe-line)] px-5 py-4 md:px-8 md:py-5">
            <div>
              <Dialog.Title className="text-xl md:text-2xl font-bold text-[var(--pepe-white)]">
                {t.title}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm md:text-base text-[var(--pepe-t64)]">
                {t.intro}
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label={t.close}
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pepe-gold)]"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </Dialog.Close>
          </div>

          <div className="min-h-0 overflow-y-auto px-5 py-6 md:px-8 md:py-8">
            {SUPPORTERS.map((supporter) => (
              <div
                key={supporter.src}
                // Weisse Flaeche mit Luft drumherum: das Band ist auf Weiss
                // gesetzt und braucht seinen Rand, sonst klebt die Schrift
                // an der Kante der Karte.
                className="mb-8 overflow-x-auto rounded-xl bg-white"
              >
                {/* Der Innenabstand sitzt hier statt am Scroll-Container:
                    dort ginge er beim Wischen rechts verloren. */}
                <div className="min-w-[672px] p-4 md:p-5">
                  <Image
                    src={supporter.src}
                    alt={supporter.alt}
                    width={supporter.width}
                    height={supporter.height}
                    // Unter 640px waere die Leiste zu klein zum Lesen. Dann
                    // bleibt sie lesbar breit und laesst sich seitlich wischen.
                    className="h-auto w-full max-w-none"
                    sizes="(max-width: 1024px) 100vw, 1000px"
                  />
                </div>
              </div>
            ))}

            <ul className="grid gap-4 sm:grid-cols-2">
              {FUNDERS.map((funder) => (
                <li
                  key={funder.name}
                  className="rounded-xl border border-[var(--pepe-line)] bg-white/[0.03] p-5"
                >
                  <h3 className="mb-2 text-base font-semibold leading-snug text-[var(--pepe-white)]">
                    {funder.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--pepe-t80)]">
                    {funder.text[lang]}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
