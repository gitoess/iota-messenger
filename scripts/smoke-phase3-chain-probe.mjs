/**
 * Phase 3 — Chain-Probe: Testnet-RPC + PACKAGE_ID + MAILBOX_ID aus product/testnet-starter.json
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { IotaClient } from '@iota/iota-sdk/client'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const starter = JSON.parse(fs.readFileSync(path.join(ROOT, 'product', 'testnet-starter.json'), 'utf8'))

const HEX64 = /^0x[a-fA-F0-9]{64}$/i

function ok(msg) {
  console.log('  OK', msg)
}
function fail(msg) {
  console.error('FAIL', msg)
  process.exitCode = 1
}

function isMailboxType(typeStr) {
  return String(typeStr || '').toLowerCase().includes('::messaging::mailbox')
}

async function main() {
  console.log('Phase 3 Chain-Probe\n')
  const { rpcUrl, packageId, mailboxId, label } = starter
  console.log('  Starter:', label)

  let client
  try {
    client = new IotaClient({ url: rpcUrl })
    await client.getLatestCheckpointSequenceNumber()
    ok(`RPC erreichbar: ${rpcUrl}`)
  } catch (e) {
    fail(`RPC nicht erreichbar: ${e instanceof Error ? e.message : e}`)
    return
  }

  try {
    const pkg = await client.getObject({ id: packageId, options: { showType: true } })
    if (pkg.error) fail(`PACKAGE_ID on-chain: ${pkg.error.code}`)
    else ok(`PACKAGE_ID existiert: ${packageId.slice(0, 10)}…`)
  } catch (e) {
    fail(`PACKAGE_ID: ${e instanceof Error ? e.message : e}`)
  }

  try {
    const mb = await client.getObject({ id: mailboxId, options: { showType: true } })
    if (mb.error) {
      fail(`MAILBOX_ID on-chain: ${mb.error.code}`)
    } else {
      const typeStr = mb.data?.type ?? ''
      const pkgFromType = String(typeStr).split('::')[0]?.toLowerCase()
      if (!isMailboxType(typeStr)) fail(`MAILBOX_ID Typ unerwartet: ${typeStr}`)
      else if (pkgFromType !== packageId.toLowerCase()) fail(`MAILBOX_ID Package-Mismatch: ${pkgFromType}`)
      else ok(`MAILBOX_ID gültig: ${mailboxId.slice(0, 10)}…`)
    }
  } catch (e) {
    fail(`MAILBOX_ID: ${e instanceof Error ? e.message : e}`)
  }

  console.log('\nChain-Probe fertig (exit', process.exitCode ?? 0, ')')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
