import type { CapacitorConfig } from '@capacitor/cli'

/**
 * IOTA Messenger — eigenständige Android-App (nicht Morgendrot-Paket-ID).
 * Web-Assets aus statischem Next-Export (`out`).
 */
const config: CapacitorConfig = {
  appId: 'de.iota.messenger',
  appName: 'IOTA Messenger',
  webDir: 'out',
}

export default config
