/**
 * Contact Page — localized (DE / EN)
 * Server-Wrapper: lädt Dictionary + Site-Daten, gibt sie an Client.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSiteContent } from '@/lib/data'
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import ContactPageClient from '@/components/custom/ContactPageClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) return {}
  const dict = await getDictionary(rawLang)
  return {
    title: dict.contact.meta.title,
    description: dict.contact.meta.description,
    alternates: { canonical: `https://www.pepe-dome.de/${rawLang}/contact` },
  }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) notFound()
  const lang: Locale = rawLang
  const dict = await getDictionary(lang)
  const site = getSiteContent()

  return (
    <ContactPageClient
      lang={lang}
      dict={dict}
      email={site.email}
      whatsapp={site.whatsapp}
      social={site.social}
    />
  )
}
