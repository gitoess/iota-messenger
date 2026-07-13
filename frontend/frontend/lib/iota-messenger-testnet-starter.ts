/**
 * Phase 2 — eingebauter Testnet-Starter (kein Handoff, kein Boss).
 * SSOT: `product/testnet-starter.json` + Env-Override optional.
 */
import starter from '../../../product/testnet-starter.json'
import { isIotaMessengerProduct } from '@/frontend/lib/product-identity'
import type { StandaloneSoloChainFormValues } from '@/frontend/lib/standalone-solo-setup'

export const IOTA_MESSENGER_TESTNET_STARTER_LS_KEY = 'iota-messenger.testnetStarterApplied.v1'

export type IotaMessengerTestnetStarter = {
  label: string
  network: string
  rpcUrl: string
  packageId: string
  mailboxId: string
}

export function readIotaMessengerTestnetStarter(): IotaMessengerTestnetStarter {
  const rpcUrl =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_IOTA_MESSENGER_TESTNET_RPC_URL?.trim()) ||
    starter.rpcUrl
  const packageId =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_IOTA_MESSENGER_TESTNET_PACKAGE_ID?.trim()) ||
    starter.packageId
  const mailboxId =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_IOTA_MESSENGER_TESTNET_MAILBOX_ID?.trim()) ||
    starter.mailboxId
  return {
    label: starter.label,
    network: starter.network,
    rpcUrl,
    packageId,
    mailboxId,
  }
}

export function iotaMessengerTestnetStarterToSoloForm(): StandaloneSoloChainFormValues {
  const s = readIotaMessengerTestnetStarter()
  return { rpcUrl: s.rpcUrl, packageId: s.packageId, mailboxId: s.mailboxId }
}

export function isIotaMessengerTestnetStarterApplied(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(IOTA_MESSENGER_TESTNET_STARTER_LS_KEY) === '1'
  } catch {
    return false
  }
}

export function markIotaMessengerTestnetStarterApplied(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(IOTA_MESSENGER_TESTNET_STARTER_LS_KEY, '1')
  } catch {
    /* ignore */
  }
}

export function shouldUseIotaMessengerTestnetStarter(): boolean {
  return isIotaMessengerProduct()
}
