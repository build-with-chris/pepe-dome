import { PublicDocument } from '@/components/layout/SiteDocument'
import { DEFAULT_LOCALE } from '@/i18n/config'

/**
 * /mithelfen liegt ausserhalb von /[lang] und braucht deshalb ein eigenes
 * Geruest. Die Seite gibt es vorerst nur auf Deutsch.
 */
export default function MithelfenLayout({ children }: { children: React.ReactNode }) {
  return <PublicDocument lang={DEFAULT_LOCALE}>{children}</PublicDocument>
}
