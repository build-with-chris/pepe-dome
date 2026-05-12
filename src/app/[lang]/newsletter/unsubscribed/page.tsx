import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedUnsubscribedContent from '@/components/newsletter/LocalizedUnsubscribedContent'
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'

export const metadata: Metadata = {
  title: 'Unsubscribed | Pepe Dome Newsletter',
  description: 'You have been unsubscribed from the Pepe Dome Newsletter.',
  robots: { index: false, follow: false },
}

export default async function NewsletterUnsubscribedPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) notFound()
  const lang: Locale = rawLang
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      <LocalizedUnsubscribedContent lang={lang} dict={dict} />
    </div>
  )
}
