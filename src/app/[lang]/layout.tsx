import { notFound } from 'next/navigation'
import { isLocale, LOCALES } from '@/i18n/config'
import LocaleSync from '@/components/layout/LocaleSync'

/**
 * Statically generate one branch per locale.
 * `dynamicParams: false` → unknown locales hit notFound() instead of
 * rendering a broken page.
 */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export const dynamicParams = false

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
