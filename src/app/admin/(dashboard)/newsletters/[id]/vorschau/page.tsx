import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/components/admin/PageHeader'
import { STATUS_LABELS } from '@/lib/admin-constants'

export const dynamic = 'force-dynamic'

/**
 * Newsletter so, wie er in der Mail aussieht, auch als Entwurf.
 *
 * Die öffentliche Webseite unter /newsletter/[slug] gibt es erst nach dem
 * Versand, sonst wäre jeder Entwurf für alle lesbar, die den Slug erraten.
 * Testmails und der Knopf "Als Webseite" zeigten deshalb bei Entwürfen auf
 * einen 404. Hier sehen eingeloggte Admins dieselbe Vorschau wie im Editor,
 * nur in voller Größe. Den Login und die Rolle prüft das Layout.
 */

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function NewsletterVorschauPage({ params }: PageProps) {
  const { id } = await params

  const newsletter = await prisma.newsletter.findUnique({
    where: { id },
    select: { id: true, subject: true, slug: true, status: true },
  })
  if (!newsletter) notFound()

  const versendet = newsletter.status === 'SENT'

  return (
    <div className="space-y-6">
      <PageHeader
        title={newsletter.subject}
        description={
          versendet
            ? 'Vorschau der Mail. Die öffentliche Webseite ist ebenfalls online.'
            : `Vorschau der Mail. Status: ${STATUS_LABELS[newsletter.status] ?? newsletter.status}, öffentlich erst nach dem Versand sichtbar.`
        }
        action={
          <div className="flex gap-4 text-sm">
            {versendet && newsletter.slug && (
              <Link href={`/newsletter/${newsletter.slug}`} className="text-[#016dca] hover:underline">
                Öffentliche Seite
              </Link>
            )}
            <Link href={`/admin/newsletters/${newsletter.id}/edit`} className="text-[#016dca] hover:underline">
              Zum Bearbeiten
            </Link>
          </div>
        }
      />

      <div className="mx-auto w-full max-w-[680px] overflow-hidden rounded-xl bg-white">
        <iframe
          src={`/api/admin/newsletters/${newsletter.id}/preview`}
          title={`Vorschau: ${newsletter.subject}`}
          className="block h-[80vh] w-full border-0"
        />
      </div>
    </div>
  )
}
