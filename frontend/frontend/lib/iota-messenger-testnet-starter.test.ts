import { describe, expect, it } from 'vitest'
import {
  iotaMessengerTestnetStarterToSoloForm,
  readIotaMessengerTestnetStarter,
} from '@/frontend/lib/iota-messenger-testnet-starter'

describe('iota-messenger-testnet-starter', () => {
  it('liefert gültige Testnet-Chain-IDs', () => {
    const s = readIotaMessengerTestnetStarter()
    expect(s.network).toBe('testnet')
    expect(s.rpcUrl).toMatch(/^https:\/\//)
    expect(s.packageId).toMatch(/^0x[a-f0-9]{64}$/i)
    expect(s.mailboxId).toMatch(/^0x[a-f0-9]{64}$/i)
  })

  it('mappt auf Solo-Formular', () => {
    const f = iotaMessengerTestnetStarterToSoloForm()
    expect(f.rpcUrl).toBeTruthy()
    expect(f.packageId).toMatch(/^0x[a-f0-9]{64}$/i)
    expect(f.mailboxId).toMatch(/^0x[a-f0-9]{64}$/i)
  })
})
