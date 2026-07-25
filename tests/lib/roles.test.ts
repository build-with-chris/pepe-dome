/**
 * Rollen-Logik
 *
 * Der Schwerpunkt liegt auf dem Default. Vorher galt ein eingeloggter Account
 * ohne gesetzte Rolle als 'editor' — damit konnte sich jeder mit einem
 * Google-Konto Schreibrechte auf Events, Artikel und Newsletter verschaffen.
 * Die Tests hier halten fest, dass ohne ausdrückliche Freigabe nichts geht.
 */

import { describe, it, expect } from 'vitest'
import {
  ROLES,
  ASSIGNABLE_ROLES,
  isAssignableRole,
  getRoleFromMetadata,
  hasMinimumRoleLevel,
  hasAdminAccess,
  canRoleEdit,
  canRoleDelete,
  canRoleViewSubscribers,
  canRoleSendNewsletter,
  canRoleTestSendNewsletter,
  getRoleDisplayName,
} from '@/lib/roles'

describe('getRoleFromMetadata', () => {
  it('gibt ohne Metadaten keine Rechte', () => {
    expect(getRoleFromMetadata(undefined)).toBe(ROLES.NONE)
  })

  it('gibt bei leeren Metadaten keine Rechte', () => {
    expect(getRoleFromMetadata({})).toBe(ROLES.NONE)
  })

  it('liest eine gesetzte Rolle aus', () => {
    expect(getRoleFromMetadata({ role: 'super_admin' })).toBe(ROLES.SUPER_ADMIN)
    expect(getRoleFromMetadata({ role: 'editor' })).toBe(ROLES.EDITOR)
    expect(getRoleFromMetadata({ role: 'viewer' })).toBe(ROLES.VIEWER)
  })

  it('ignoriert unbekannte Rollenwerte statt sie durchzulassen', () => {
    expect(getRoleFromMetadata({ role: 'admin' })).toBe(ROLES.NONE)
    expect(getRoleFromMetadata({ role: 'SUPER_ADMIN' })).toBe(ROLES.NONE)
    expect(getRoleFromMetadata({ role: '' })).toBe(ROLES.NONE)
  })

  it('lässt sich nicht durch andere Typen austricksen', () => {
    expect(getRoleFromMetadata({ role: true })).toBe(ROLES.NONE)
    expect(getRoleFromMetadata({ role: 3 })).toBe(ROLES.NONE)
    expect(getRoleFromMetadata({ role: ['super_admin'] })).toBe(ROLES.NONE)
    expect(getRoleFromMetadata({ role: { toString: () => 'editor' } })).toBe(ROLES.NONE)
  })

  it('nimmt keine Rolle aus einem anderen Feld an', () => {
    expect(getRoleFromMetadata({ rolle: 'super_admin' })).toBe(ROLES.NONE)
    expect(getRoleFromMetadata({ Role: 'super_admin' })).toBe(ROLES.NONE)
  })
})

describe('isAssignableRole', () => {
  it('erkennt die drei vergebbaren Rollen', () => {
    for (const role of ASSIGNABLE_ROLES) {
      expect(isAssignableRole(role)).toBe(true)
    }
  })

  it('lehnt "none" ab — eine leere Rolle darf man nicht vergeben', () => {
    expect(isAssignableRole(ROLES.NONE)).toBe(false)
  })

  it('lehnt Unsinn ab', () => {
    expect(isAssignableRole(undefined)).toBe(false)
    expect(isAssignableRole(null)).toBe(false)
    expect(isAssignableRole('root')).toBe(false)
  })
})

describe('hasAdminAccess', () => {
  it('sperrt Accounts ohne Freigabe aus', () => {
    expect(hasAdminAccess(ROLES.NONE)).toBe(false)
  })

  it('lässt jede vergebene Rolle ins Panel', () => {
    expect(hasAdminAccess(ROLES.VIEWER)).toBe(true)
    expect(hasAdminAccess(ROLES.EDITOR)).toBe(true)
    expect(hasAdminAccess(ROLES.SUPER_ADMIN)).toBe(true)
  })
})

describe('hasMinimumRoleLevel', () => {
  it('ordnet die Hierarchie super_admin > editor > viewer > none', () => {
    expect(hasMinimumRoleLevel(ROLES.SUPER_ADMIN, ROLES.EDITOR)).toBe(true)
    expect(hasMinimumRoleLevel(ROLES.EDITOR, ROLES.VIEWER)).toBe(true)
    expect(hasMinimumRoleLevel(ROLES.VIEWER, ROLES.NONE)).toBe(true)
  })

  it('lässt niemanden über seine Stufe hinaus', () => {
    expect(hasMinimumRoleLevel(ROLES.EDITOR, ROLES.SUPER_ADMIN)).toBe(false)
    expect(hasMinimumRoleLevel(ROLES.VIEWER, ROLES.EDITOR)).toBe(false)
  })

  it('erfüllt für "none" keine einzige echte Anforderung', () => {
    expect(hasMinimumRoleLevel(ROLES.NONE, ROLES.VIEWER)).toBe(false)
    expect(hasMinimumRoleLevel(ROLES.NONE, ROLES.EDITOR)).toBe(false)
    expect(hasMinimumRoleLevel(ROLES.NONE, ROLES.SUPER_ADMIN)).toBe(false)
  })
})

describe('Berechtigungen je Rolle', () => {
  it('gibt "none" gar nichts', () => {
    expect(canRoleEdit(ROLES.NONE)).toBe(false)
    expect(canRoleDelete(ROLES.NONE)).toBe(false)
    expect(canRoleViewSubscribers(ROLES.NONE)).toBe(false)
    expect(canRoleSendNewsletter(ROLES.NONE)).toBe(false)
    expect(canRoleTestSendNewsletter(ROLES.NONE)).toBe(false)
  })

  it('lässt den Viewer nur lesen', () => {
    expect(canRoleEdit(ROLES.VIEWER)).toBe(false)
    expect(canRoleDelete(ROLES.VIEWER)).toBe(false)
    expect(canRoleViewSubscribers(ROLES.VIEWER)).toBe(false)
    expect(canRoleSendNewsletter(ROLES.VIEWER)).toBe(false)
  })

  it('lässt den Editor pflegen, aber nicht löschen oder versenden', () => {
    expect(canRoleEdit(ROLES.EDITOR)).toBe(true)
    expect(canRoleTestSendNewsletter(ROLES.EDITOR)).toBe(true)
    expect(canRoleDelete(ROLES.EDITOR)).toBe(false)
    expect(canRoleSendNewsletter(ROLES.EDITOR)).toBe(false)
    expect(canRoleViewSubscribers(ROLES.EDITOR)).toBe(false)
  })

  it('gibt dem Super Admin alles', () => {
    expect(canRoleEdit(ROLES.SUPER_ADMIN)).toBe(true)
    expect(canRoleDelete(ROLES.SUPER_ADMIN)).toBe(true)
    expect(canRoleViewSubscribers(ROLES.SUPER_ADMIN)).toBe(true)
    expect(canRoleSendNewsletter(ROLES.SUPER_ADMIN)).toBe(true)
  })
})

describe('getRoleDisplayName', () => {
  it('benennt jede Rolle', () => {
    expect(getRoleDisplayName(ROLES.SUPER_ADMIN)).toBe('Super Admin')
    expect(getRoleDisplayName(ROLES.EDITOR)).toBe('Editor')
    expect(getRoleDisplayName(ROLES.VIEWER)).toBe('Viewer')
    expect(getRoleDisplayName(ROLES.NONE)).toBe('Kein Zugriff')
  })
})
