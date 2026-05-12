import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import LocalizedConfirmContent from '@/components/newsletter/LocalizedConfirmContent'
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Confirm subscription | Pepe Dome Newsletter',
  description: 'Confirm your subscription to the Pepe Dome Newsletter.',
  robots: { index: false, follow: false },
}

export default async function NewsletterConfirmPage({
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
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-[var(--pepe-gold)] border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        }
      >
        <LocalizedConfirmContent lang={lang} dict={dict} />
      </Suspense>
    </div>
  )
}
