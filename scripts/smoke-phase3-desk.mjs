/**
 * Phase 3 — Schreibtisch-Smoke vor dem 2-Geräte-Feldtest.
 * 1) Phase-1 API-Smoke  2) Chain-Probe  3) Peering/Handshake Unit-Tests
 */
import { spawnSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function run(title, cmd, args, cwd = ROOT, opts = {}) {
  console.log(`\n=== ${title} ===\n`)
  const shell = opts.shell ?? cmd !== process.execPath
  const r = spawnSync(cmd, args, { cwd, stdio: 'inherit', shell })
  if (r.status !== 0) {
    console.error(`\nAbbruch: ${title} (exit ${r.status})`)
    process.exit(r.status ?? 1)
  }
}

run('Phase 1 — API-Smoke', process.execPath, ['scripts/smoke-iota-messenger.mjs'])
run('Phase 3 — Chain-Probe', process.execPath, ['scripts/smoke-phase3-chain-probe.mjs'])

const vitestTests = [
  'frontend/lib/peering-qr.test.ts',
  'frontend/lib/direct-iota-peering.test.ts',
  'frontend/lib/direct-iota-handshake-submit.test.ts',
  'frontend/lib/group-mailbox-pairwise-send.test.ts',
  'frontend/lib/iota-messenger-testnet-starter.test.ts',
]

run(
  'Phase 3 — Unit (Peering/Handshake/Gruppe)',
  npm,
  ['exec', 'vitest', 'run', ...vitestTests],
  path.join(ROOT, 'frontend')
)

console.log('\n=== Schreibtisch grün — jetzt docs/PHASE-3-ZWEI-GERAETE-TEST.md am Feld durchgehen ===\n')
