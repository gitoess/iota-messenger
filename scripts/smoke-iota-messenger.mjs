/**
 * Kurzer Smoke-Test für IOTA Messenger (Phase 1/2).
 * Prüft: Produkt-Dateien, API-Start, /api/status, Frontend-tsc (Kern).
 */
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const API_PORT = process.env.API_PORT || '3342'
const API_BASE = `http://127.0.0.1:${API_PORT}`

function ok(msg) {
  console.log('  OK', msg)
}

function fail(msg) {
  console.error('FAIL', msg)
  process.exitCode = 1
}

function mustExist(rel) {
  const p = path.join(ROOT, rel)
  if (!fs.existsSync(p)) {
    fail(`fehlt: ${rel}`)
    return false
  }
  ok(rel)
  return true
}

async function waitForApi(ms = 20000) {
  const start = Date.now()
  while (Date.now() - start < ms) {
    try {
      const res = await fetch(`${API_BASE}/api/status`)
      if (res.ok) return await res.json()
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error('API nicht erreichbar innerhalb Timeout')
}

async function main() {
  console.log('IOTA Messenger Smoke\n')

  mustExist('frontend/frontend/lib/product-identity.ts')
  mustExist('product/testnet-starter.json')
  mustExist('.morgendrot-runtime-config.json')

  const api = spawn(process.execPath, ['node_modules/tsx/dist/cli.mjs', 'src/start-with-secrets.ts'], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, API_PORT },
    shell: false,
  })

  let apiLog = ''
  api.stdout?.on('data', (d) => {
    apiLog += d.toString()
  })
  api.stderr?.on('data', (d) => {
    apiLog += d.toString()
  })

  try {
    const status = await waitForApi()
    if (status.messengerEdition !== 'iota-messenger') {
      fail(`messengerEdition=${status.messengerEdition} (erwartet iota-messenger)`)
    } else {
      ok(`messengerEdition=iota-messenger`)
    }
    if (status.uiVariant !== 'messenger') {
      fail(`uiVariant=${status.uiVariant}`)
    } else {
      ok('uiVariant=messenger')
    }
    ok('GET /api/status')
  } catch (e) {
    fail(e instanceof Error ? e.message : String(e))
    if (apiLog) console.error(apiLog.slice(-2000))
  } finally {
    api.kill('SIGTERM')
  }

  console.log('\nSmoke fertig (exit', process.exitCode ?? 0, ')')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
