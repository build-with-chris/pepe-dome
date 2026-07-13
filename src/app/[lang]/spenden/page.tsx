/**
 * Spenden / Donate Page — localized.
 *
 * Zeigt Bankverbindung und PayPal-Kontakt des Trägervereins
 * Circus Akademie München e.V. Bewusst schlicht gehalten und
 * nur diskret aus dem Footer verlinkt.
 */
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import HeroSection from '@/components/custom/HeroSection'
import { isLocale, type Locale } from '@/i18n/config'

type Content = {
  meta: { title: string; description: string }
  hero: { title: string; subtitle: string }
  intro: string
  bank: {
    title: string
    holderLabel: string
    addressLabel: string
    ibanLabel: string
    purposeLabel: string
    purposeText: string
  }
  paypal: {
    title: string
    recipientLabel: string
    note: string
    cta: string
  }
  disclaimerTitle: string
  disclaimer: string
  thanks: string
}

const content: Record<Locale, Content> = {
  de: {
    meta: {
      title: 'Unterstützen — Circus Akademie München e.V.',
      description:
        'Unterstütze den Pepe Dome und den Trägerverein Circus Akademie München e.V. per Überweisung oder PayPal. Hinweis: keine Spendenquittung möglich.',
    },
    hero: {
      title: 'Unterstützen',
      subtitle:
        'Der Pepe Dome wird vom Verein Circus Akademie München e.V. getragen. Danke für deine Unterstützung.',
    },
    intro:
      'Wenn du unsere Arbeit für zeitgenössischen Zirkus, Artistik und Kultur in München fördern möchtest, freuen wir uns über jeden Beitrag.',
    bank: {
      title: 'Bankverbindung',
      holderLabel: 'Kontoinhaber',
      addressLabel: 'Anschrift',
      ibanLabel: 'IBAN',
      purposeLabel: 'Verwendungszweck',
      purposeText: 'Unterstützung Pepe Dome',
    },
    paypal: {
      title: 'PayPal',
      recipientLabel: 'PayPal-Adresse',
      note:
        'Bitte in PayPal „an Freunde senden" wählen und im Verwendungszweck „Unterstützung Pepe Dome" angeben.',
      cta: 'Mit PayPal unterstützen',
    },
    disclaimerTitle: 'Hinweis',
    disclaimer:
      'Die Circus Akademie München e.V. ist derzeit nicht als gemeinnützig anerkannt. Wir können daher keine Spendenquittungen (Zuwendungsbestätigungen) ausstellen. Zuwendungen sind steuerlich nicht absetzbar.',
    thanks: 'Herzlichen Dank — jeder Beitrag hilft, den Dome offen zu halten.',
  },
  en: {
    meta: {
      title: 'Support us — Circus Akademie München e.V.',
      description:
        'Support the Pepe Dome and its operator Circus Akademie München e.V. via bank transfer or PayPal. Note: contributions are not tax-deductible.',
    },
    hero: {
      title: 'Support us',
      subtitle:
        'The Pepe Dome is operated by the association Circus Akademie München e.V. Thank you for your support.',
    },
    intro:
      'If you would like to support our work for contemporary circus, artistry and culture in Munich, we appreciate every contribution.',
    bank: {
      title: 'Bank details',
      holderLabel: 'Account holder',
      addressLabel: 'Address',
      ibanLabel: 'IBAN',
      purposeLabel: 'Reference',
      purposeText: 'Support Pepe Dome',
    },
    paypal: {
      title: 'PayPal',
      recipientLabel: 'PayPal address',
      note:
        'Please use PayPal "send to friends" and add "Support Pepe Dome" as reference.',
      cta: 'Support via PayPal',
    },
    disclaimerTitle: 'Please note',
    disclaimer:
      'Circus Akademie München e.V. is currently not registered as a tax-exempt non-profit organisation. We therefore cannot issue German donation receipts (Zuwendungsbestätigungen), and contributions are not tax-deductible.',
    thanks: 'Thank you — every contribution helps keep the Dome open.',
  },
}

const HOLDER = 'Circus Akademie München e.V.'
const ADDRESS_LINES = ['Ranhazweg 18', '85521 Ottobrunn', 'Deutschland']
const IBAN_PRETTY = 'DE36 4306 0967 1379 5914 00'
const PAYPAL_URL = 'https://paypal.me/circusakademie'
const PAYPAL_HANDLE = 'paypal.me/circusakademie'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) return {}
  const c = content[rawLang]
  return {
    title: c.meta.title,
    description: c.meta.description,
    alternates: { canonical: `https://www.pepe-dome.de/${rawLang}/spenden` },
  }
}

export default async function SpendenPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) notFound()
  const lang: Locale = rawLang
  const c = content[lang]

  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      <HeroSection title={c.hero.title} subtitle={c.hero.subtitle} size="sm" />

      <section className="py-16 md:py-24">
        <div className="stage-container">
          <div className="max-w-3xl mx-auto space-y-10">
            <p className="text-[var(--pepe-t80)] leading-relaxed text-lg">{c.intro}</p>

            {/* Rechtlicher Hinweis: kein gemeinnütziger Verein, keine Spendenquittung */}
            <div className="rounded-xl border border-[var(--pepe-line)] bg-[var(--pepe-ink)]/60 px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--pepe-gold)] mb-2">
                {c.disclaimerTitle}
              </p>
              <p className="text-sm leading-relaxed text-[var(--pepe-t80)]">
                {c.disclaimer}
              </p>
            </div>

            {/* Bankverbindung */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-10 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                {c.bank.title}
              </h2>

              <dl className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <div>
                  <dt className="text-sm font-bold text-[var(--pepe-gold)] uppercase tracking-wider mb-2">
                    {c.bank.holderLabel}
                  </dt>
                  <dd className="text-[var(--pepe-white)] font-semibold">{HOLDER}</dd>
                </div>

                <div>
                  <dt className="text-sm font-bold text-[var(--pepe-gold)] uppercase tracking-wider mb-2">
                    {c.bank.addressLabel}
                  </dt>
                  <dd>
                    {ADDRESS_LINES.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-bold text-[var(--pepe-gold)] uppercase tracking-wider mb-2">
                    {c.bank.ibanLabel}
                  </dt>
                  <dd className="text-[var(--pepe-white)] font-mono text-lg tracking-wide select-all">
                    {IBAN_PRETTY}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-bold text-[var(--pepe-gold)] uppercase tracking-wider mb-2">
                    {c.bank.purposeLabel}
                  </dt>
                  <dd>{c.bank.purposeText}</dd>
                </div>
              </dl>
            </div>

            {/* PayPal */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-10 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                {c.paypal.title}
              </h2>

              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <div>
                  <p className="text-sm font-bold text-[var(--pepe-gold)] uppercase tracking-wider mb-2">
                    {c.paypal.recipientLabel}
                  </p>
                  <a
                    href={PAYPAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--pepe-white)] font-mono text-lg hover:text-[var(--pepe-gold)] hover:underline break-all"
                  >
                    {PAYPAL_HANDLE}
                  </a>
                </div>

                <p className="text-[var(--pepe-t64)] text-sm">{c.paypal.note}</p>

                <a
                  href={PAYPAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--pepe-gold)] px-6 py-3 text-sm font-semibold text-[var(--pepe-gold)] hover:bg-[var(--pepe-gold)] hover:text-[var(--pepe-black)] transition-colors"
                >
                  {c.paypal.cta}
                </a>
              </div>
            </div>

            <p className="text-center text-[var(--pepe-t64)] italic pt-4">{c.thanks}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
