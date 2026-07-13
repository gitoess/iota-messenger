import { describe, expect, it } from 'vitest'
import {
  activeSendPathWriteDeniedReason,
  canComposerSendPathWrite,
  canExportDataCapability,
  composerSendPathWriteDeniedReason,
  canTransportWrite,
  exportDataDeniedReason,
  inboxSourceFilterReadAllowed,
  isPlaintextSendBlockedByCapabilities,
} from './messenger-capability-gates'
import type { ApiStatus } from '@/frontend/lib/api/status'

const baseCaps = {
  version: 1 as const,
  roleId: 12,
  simpleMode: true,
  product: {
    canCreateGroup: true,
    canInviteMembers: true,
    canExportData: true,
    canManageEinsatzTemplates: false,
  },
  transport: {
    lora: { read: true, write: true },
    telegram: { read: true, write: true },
    iota: { read: true, write: true },
    ble: { read: true, write: true },
    streams: { read: false, write: false },
  },
  security: { forceEncryptionOnly: false, allowPlaintextFallback: false },
}

describe('messenger-capability-gates (IOTA Messenger)', () => {
  it('blockiert Funk/Telegram/BLE unabhängig von capabilities', () => {
    const status = { roleId: 12, capabilities: baseCaps } as ApiStatus
    expect(canTransportWrite(status, 'lora')).toBe(false)
    expect(canTransportWrite(status, 'telegram')).toBe(false)
    expect(canTransportWrite(status, 'ble')).toBe(false)
    expect(canTransportWrite(status, 'iota')).toBe(true)
  })

  it('composer send path: nur online erlaubt', () => {
    const status = { roleId: 12, capabilities: baseCaps } as ApiStatus
    expect(canComposerSendPathWrite(status, 'internet')).toBe(true)
    expect(canComposerSendPathWrite(status, 'mesh')).toBe(false)
    expect(canComposerSendPathWrite(status, 'telegram')).toBe(false)
    expect(canComposerSendPathWrite(status, 'adhoc')).toBe(false)
  })

  it('inbox filter ohne funk/telegram', () => {
    const status = { roleId: 12, role: 'messenger', capabilities: baseCaps } as ApiStatus
    expect(inboxSourceFilterReadAllowed(status, 'funk')).toBe(false)
    expect(inboxSourceFilterReadAllowed(status, 'telegram')).toBe(false)
    expect(inboxSourceFilterReadAllowed(status, 'mailbox')).toBe(true)
    expect(inboxSourceFilterReadAllowed(status, 'all')).toBe(true)
  })

  it('export und plaintext-regeln für iota', () => {
    const status = {
      roleId: 12,
      role: 'messenger',
      capabilities: {
        ...baseCaps,
        product: { ...baseCaps.product, canExportData: false },
        security: { forceEncryptionOnly: true, allowPlaintextFallback: false },
        transport: {
          ...baseCaps.transport,
          iota: { read: true, write: false },
        },
      },
    } as ApiStatus
    expect(canExportDataCapability(status)).toBe(false)
    expect(exportDataDeniedReason(status)).toMatch(/Handoff-Rechte/)
    expect(composerSendPathWriteDeniedReason(status, 'internet')).toMatch(/Handoff-Rechte/)
    expect(activeSendPathWriteDeniedReason(status, 'internet', 'chain')).toMatch(/Handoff-Rechte/)
    expect(isPlaintextSendBlockedByCapabilities(status, false, 'internet')).toBe(false)
  })
})
