'use client'

import { beginStandaloneSoloOnboarding } from '@/frontend/lib/standalone-onboarding'
import { persistDirectChainFieldIds } from '@/frontend/lib/direct-iota-chain-context'
import { setBrowserDirectIotaRpcUrlOverride, sanitizeDirectIotaRpcUrl } from '@/frontend/lib/direct-iota-rpc'
import { readLocalHandoffAppliedSnapshot, saveLocalHandoffAppliedSnapshot } from '@/frontend/lib/handoff-local-apply'
import { getDirectIotaSessionSignerAddress } from '@/frontend/lib/direct-iota-mnemonic-session'
import { isLikelyIotaHexId } from '@morgendrot/core/iota'
import {
  applyStandaloneSoloChainConfig,
  persistStandaloneSoloNetworkProfiles,
} from '@/frontend/lib/standalone-solo-setup'
import {
  iotaMessengerTestnetStarterToSoloForm,
  isIotaMessengerTestnetStarterApplied,
  markIotaMessengerTestnetStarterApplied,
  readIotaMessengerTestnetStarter,
  shouldUseIotaMessengerTestnetStarter,
} from '@/frontend/lib/iota-messenger-testnet-starter'

/** Ketten-IDs + RPC lokal setzen (ohne Wallet). */
export function applyIotaMessengerTestnetStarterLocal(): { ok: true } | { ok: false; reason: string } {
  if (!shouldUseIotaMessengerTestnetStarter()) return { ok: false, reason: 'not-iota-messenger' }
  if (isIotaMessengerTestnetStarterApplied()) return { ok: true }

  const form = iotaMessengerTestnetStarterToSoloForm()
  let rpcUrl: string
  try {
    rpcUrl = sanitizeDirectIotaRpcUrl(form.rpcUrl.trim())
  } catch {
    return { ok: false, reason: 'invalid-rpc' }
  }

  beginStandaloneSoloOnboarding()
  setBrowserDirectIotaRpcUrlOverride(rpcUrl)
  persistDirectChainFieldIds({ packageId: form.packageId, mailboxId: form.mailboxId })

  const snapshot = readLocalHandoffAppliedSnapshot()
  if (snapshot) {
    saveLocalHandoffAppliedSnapshot({
      ...snapshot,
      packageId: form.packageId,
      mailboxId: form.mailboxId,
      savedAtMs: Date.now(),
    })
  }

  markIotaMessengerTestnetStarterApplied()
  return { ok: true }
}

/** Nach Wallet-Entsperrung: Netzwerk-Profile + Mailbox-Snapshot vervollständigen. */
export function finalizeIotaMessengerTestnetStarterWithWallet(): boolean {
  if (!shouldUseIotaMessengerTestnetStarter()) return false
  const addr = getDirectIotaSessionSignerAddress()?.trim() ?? ''
  if (!isLikelyIotaHexId(addr)) return false

  const form = iotaMessengerTestnetStarterToSoloForm()
  const res = applyStandaloneSoloChainConfig(form)
  if (!res.ok) return false

  persistStandaloneSoloNetworkProfiles(form, addr)
  const s = readIotaMessengerTestnetStarter()
  console.info('[iota-messenger] Testnet-Starter mit Wallet abgeschlossen:', s.label)
  return true
}
