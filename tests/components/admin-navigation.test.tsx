/**
 * Navigation im Admin-Panel
 *
 * Hintergrund: Es gab zeitweise drei Dateien, die wie eine Admin-Navigation
 * aussahen — AdminShell, AdminSidebar und AdminLayout. Gerendert wird nur
 * AdminShell. Ein Menüpunkt für die Kursverwaltung landete deshalb einmal in
 * AdminSidebar und war im Panel nie zu sehen, obwohl die Seite existierte.
 * Der Contentplan hatte dasselbe Problem schon länger.
 *
 * Dieser Test prüft nicht Aussehen, sondern die eine Frage, die dabei
 * schiefging: Ist jeder Admin-Bereich, den es gibt, auch erreichbar?
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AdminShell from '@/components/admin/AdminShell'
import { ROLES } from '@/lib/roles'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/admin',
}))

vi.mock('@clerk/nextjs', () => ({
  UserButton: () => <div data-testid="user-button" />,
  useClerk: () => ({ signOut: vi.fn() }),
}))

function linkZiele(): string[] {
  return screen
    .getAllByRole('link')
    .map((link) => link.getAttribute('href') ?? '')
    .filter((href) => href.startsWith('/admin'))
}

describe('AdminShell Navigation', () => {
  it('verlinkt die Kursverwaltung', () => {
    render(
      <AdminShell role={ROLES.EDITOR} userName="Test">
        <div />
      </AdminShell>
    )
    expect(linkZiele()).toContain('/admin/courses')
  })

  it('verlinkt den Contentplan', () => {
    render(
      <AdminShell role={ROLES.EDITOR} userName="Test">
        <div />
      </AdminShell>
    )
    expect(linkZiele()).toContain('/admin/contentplan')
  })

  it('zeigt einem Editor alle Bereiche außer den Super-Admin-Bereichen', () => {
    render(
      <AdminShell role={ROLES.EDITOR} userName="Test">
        <div />
      </AdminShell>
    )
    const ziele = linkZiele()
    for (const pfad of [
      '/admin',
      '/admin/events',
      '/admin/courses',
      '/admin/articles',
      '/admin/contentplan',
      '/admin/newsletters',
    ]) {
      expect(ziele).toContain(pfad)
    }
    // Abonnentendaten sind personenbezogen und bleiben super_admin vorbehalten.
    expect(ziele).not.toContain('/admin/subscribers')
    expect(ziele).not.toContain('/admin/test-recipients')
  })

  it('zeigt einem Super-Admin zusätzlich die geschützten Bereiche', () => {
    render(
      <AdminShell role={ROLES.SUPER_ADMIN} userName="Test">
        <div />
      </AdminShell>
    )
    const ziele = linkZiele()
    expect(ziele).toContain('/admin/subscribers')
    expect(ziele).toContain('/admin/test-recipients')
    expect(ziele).toContain('/admin/courses')
  })
})
