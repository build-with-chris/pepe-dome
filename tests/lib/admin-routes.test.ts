/**
 * Welche Pfade die Middleware absichert
 *
 * Anlass: Die Schutzliste zählte die Admin-Bereiche früher einzeln auf und
 * /admin/test-recipients fehlte darin — die Seite war ohne Login erreichbar.
 * Diese Tests halten fest, dass jeder Admin-Pfad geschützt ist, auch künftige,
 * und dass die Login-Seiten selbst offen bleiben.
 */

import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { requiresAuth } from '@/lib/admin-routes'

function req(path: string) {
  return new NextRequest(new URL(path, 'https://pepe-dome.de'))
}

describe('requiresAuth', () => {
  it('schützt jede Admin-Seite', () => {
    const paths = [
      '/admin',
      '/admin/events',
      '/admin/events/new',
      '/admin/events/abc-123/edit',
      '/admin/articles',
      '/admin/newsletters',
      '/admin/newsletters/abc-123/edit',
      '/admin/subscribers',
      // Fehlte in der alten Liste und war damit ohne Login erreichbar
      '/admin/test-recipients',
      '/admin/zugang',
      '/admin/freigabe',
    ]

    for (const path of paths) {
      expect(requiresAuth(req(path)), `${path} muss geschützt sein`).toBe(true)
    }
  })

  it('schützt auch eine Admin-Seite, die es noch gar nicht gibt', () => {
    expect(requiresAuth(req('/admin/irgendwas-neues'))).toBe(true)
    expect(requiresAuth(req('/api/admin/irgendwas-neues'))).toBe(true)
  })

  it('schützt jede Admin-API', () => {
    const paths = [
      '/api/admin/events',
      '/api/admin/articles',
      '/api/admin/newsletters',
      '/api/admin/newsletters/abc-123/send',
      '/api/admin/subscribers',
      '/api/admin/subscribers/export',
      '/api/admin/test-recipients',
      '/api/admin/upload',
      '/api/admin/access-requests/decide',
    ]

    for (const path of paths) {
      expect(requiresAuth(req(path)), `${path} muss geschützt sein`).toBe(true)
    }
  })

  it('lässt die Login-Seiten offen, sonst käme niemand hinein', () => {
    expect(requiresAuth(req('/admin/sign-in'))).toBe(false)
    expect(requiresAuth(req('/admin/sign-in/factor-one'))).toBe(false)
    expect(requiresAuth(req('/admin/sign-up'))).toBe(false)
  })

  it('lässt die öffentliche Website in Ruhe', () => {
    const paths = [
      '/',
      '/de',
      '/de/events',
      '/news',
      '/newsletter',
      '/api/subscribers',
      '/api/subscribers/confirm',
      '/api/contact',
      '/api/events',
      '/api/webhooks/resend',
      '/api/cron/send-scheduled-newsletters',
    ]

    for (const path of paths) {
      expect(requiresAuth(req(path)), `${path} darf offen bleiben`).toBe(false)
    }
  })

  it('lässt sich nicht durch einen ähnlich klingenden Pfad umgehen', () => {
    // Kein Präfix-Treffer auf /admin: eine öffentliche Seite, die nur so heißt
    expect(requiresAuth(req('/administration'))).toBe(false)
    expect(requiresAuth(req('/de/admin-team'))).toBe(false)
  })
})
