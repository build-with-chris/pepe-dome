import { notFound } from 'next/navigation'
import { isLocale, LOCALES } from '@/i18n/config'
import LocaleSync from '@/components/layout/LocaleSync'

/**
 * Statically generate one branch per locale.
 *
 * `dynamicParams` steht bewusst auf true, obwohl es hier nur zwei gültige
 * Sprachen gibt. Mit `false` weigert sich Next, eine Seite unterhalb von
 * [lang] nach einem revalidatePath neu zu erzeugen: die Parameterliste gilt
 * dann als abgeschlossen, die Anfrage endet mit NoFallbackError und die
 * Seite antwortet 404 statt mit frischem Inhalt. Aufgefallen beim Umbau der
 * Trainingsseite auf ISR, bei der eine Kursänderung sofort sichtbar sein soll.
 *
 * Unbekannte Sprachen laufen weiterhin in notFound() — das erledigt die
 * Laufzeitprüfung unten und zusätzlich jede Seite unter [lang] für sich.
 * Der Schutz hängt also nicht an dieser Einstellung.
 */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export const dynamicParams = true

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()

  return (
    <>
      <LocaleSync lang={lang} />
      {children}
    </>
  )
}
