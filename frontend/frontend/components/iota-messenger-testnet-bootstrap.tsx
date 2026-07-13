'use client'

import { useEffect, useRef } from 'react'
import { STANDALONE_WALLET_UNLOCKED_EVENT } from '@/frontend/lib/handoff-standalone-ready'
import {
  applyIotaMessengerTestnetStarterLocal,
  finalizeIotaMessengerTestnetStarterWithWallet,
} from '@/frontend/lib/iota-messenger-testnet-apply'
import { shouldUseIotaMessengerTestnetStarter } from '@/frontend/lib/iota-messenger-testnet-starter'

/**
 * Phase 2: Testnet-Starter beim Start + nach Wallet-Entsperrung finalisieren.
 */
export function IotaMessengerTestnetBootstrap() {
  const ran = useRef(false)

  useEffect(() => {
    if (!shouldUseIotaMessengerTestnetStarter()) return

    if (!ran.current) {
      ran.current = true
      const res = applyIotaMessengerTestnetStarterLocal()
      if (!res.ok) console.warn('[iota-messenger] Starter lokal:', res.reason)
    }

    const onWallet = () => {
      finalizeIotaMessengerTestnetStarterWithWallet()
    }
    window.addEventListener(STANDALONE_WALLET_UNLOCKED_EVENT, onWallet)
    onWallet()
    return () => window.removeEventListener(STANDALONE_WALLET_UNLOCKED_EVENT, onWallet)
  }, [])

  return null
}
