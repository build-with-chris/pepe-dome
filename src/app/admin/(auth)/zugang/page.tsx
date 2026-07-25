import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { SignOutButton } from '@clerk/nextjs'
import { getCurrentAdmin } from '@/lib/roles.server'
import { hasAdminAccess } from '@/lib/roles'
import {
  upsertAccessRequest,
  notifyApprover,
  accessBaseUrl,
  ACCESS_APPROVAL_EMAIL,
} from '@/lib/admin-access'

/**
 * Warteseite für angemeldete Accounts ohne Freigabe.
 *
 * Liegt bewusst in der (auth)-Group und damit außerhalb des Rollen-Gates: Wer
 * hier landet, hat ja gerade keine Rolle. Läge die Seite hinter dem Gate,
 * würde sie sich selbst wegleiten.
 *
 * Die Anfrage entsteht beim Aufruf, nicht schon beim Login. So sammeln sich
 * keine Einträge für Leute an, die nur versehentlich auf der Login-Seite waren.
 */

// Legt eine Anfrage an und verschickt eine Mail, darf also nicht statisch
// vorgerendert oder gecached werden.
export const dynamic = 'force-dynamic'

export default async function ZugangPage() {
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect('/admin/sign-in')
  }

  if (hasAdminAccess(admin.role)) {
    redirect('/admin')
  }

  let mailFailed = false

  if (admin.email) {
    try {
      const { request } = await upsertAccessRequest({
        clerkUserId: admin.userId,
        email: admin.email,
        name: admin.fullName,
      })
      await notifyApprover(request, accessBaseUrl())
    } catch (error) {
      // Die Anfrage steht in der Datenbank, nur die Mail ging nicht raus.
      // Kein harter Fehler: Der User soll trotzdem eine Erklärung sehen statt
      // einer leeren Fehlerseite, und die Anfrage bleibt auffindbar.
      console.error('[ADMIN-ACCESS] Freigabe-Mail konnte nicht gesendet werden:', error)
      mailFailed = true
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0A0A0A' }}>
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[460px] text-center">
          <div className="flex justify-center mb-10">
            <Image
              src="/PEPE_logos_dome.svg"
              alt="Pepe Dome"
              width={200}
              height={80}
              className="h-20 w-auto"
            />
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">Zugang angefragt</h1>

          <p className="text-gray-400 text-base leading-relaxed mb-8">
            Dein Konto ist angelegt, aber noch nicht freigeschaltet. Wir haben eine Anfrage
            an das Team geschickt. Sobald jemand sie bestätigt, kommst du mit demselben
            Login ins Panel.
          </p>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 mb-8 text-left">
            <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1">
              Angemeldet als
            </p>
            <p className="text-sm text-white/90 break-all">{admin.email || 'Unbekannt'}</p>
          </div>

          {mailFailed && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 mb-8 text-left">
              <p className="text-sm text-amber-200 leading-relaxed">
                Die Benachrichtigung konnte gerade nicht verschickt werden. Deine Anfrage ist
                trotzdem gespeichert. Melde dich bei {ACCESS_APPROVAL_EMAIL}, falls sich
                längere Zeit nichts tut.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <SignOutButton redirectUrl="/">
              <button className="w-full rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium py-3 transition-colors">
                Abmelden
              </button>
            </SignOutButton>

            <Link
              href="/"
              className="text-gray-500 hover:text-gray-300 transition-colors text-sm py-2"
            >
              &larr; Zurück zur Startseite
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
