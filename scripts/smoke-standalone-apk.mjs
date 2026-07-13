#!/usr/bin/env node
/**
 * Standalone-APK Schreibtisch-Check (IOTA Messenger).
 * Prüft Branding, Android-Paket-ID und optional vorhandene Debug-APK.
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const frontend = join(root, 'frontend')
const apkPath = join(frontend, 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk')

const IOTA_APP_ID = 'de.iota.messenger'
const MORG_APP_ID = 'de.morgendrot.messenger'

function ok(msg) {
  console.log('  OK', msg)
}

function fail(msg) {
  console.error('  FAIL', msg)
  process.exitCode = 1
}

function mustInclude(file, needle, label) {
  const p = join(root, file)
  if (!existsSync(p)) {
    fail(`fehlt: ${file}`)
    return
  }
  const text = readFileSync(p, 'utf8')
  if (!text.includes(needle)) {
    fail(`${label || file}: erwartet „${needle}“`)
    return
  }
  ok(`${label || file}`)
}

function mustNotInclude(file, needle, label) {
  const p = join(root, file)
  if (!existsSync(p)) return
  const text = readFileSync(p, 'utf8')
  if (text.includes(needle)) {
    fail(`${label || file}: enthält noch „${needle}“`)
    return
  }
  ok(`kein ${needle} in ${label || file}`)
}

console.log('=== IOTA Messenger — Standalone-APK Schreibtisch ===\n')

mustInclude('frontend/capacitor.config.ts', `appId: '${IOTA_APP_ID}'`, 'capacitor appId')
mustInclude('frontend/capacitor.config.ts', "appName: 'IOTA Messenger'", 'capacitor appName')
mustInclude('frontend/android/app/build.gradle', `applicationId "${IOTA_APP_ID}"`, 'gradle applicationId')
mustInclude('frontend/android/app/src/main/res/values/strings.xml', 'IOTA Messenger', 'Android strings')
mustInclude('frontend/frontend/lib/product-identity.ts', "PRODUCT_ID = 'iota-messenger'", 'product-identity')
mustNotInclude('frontend/capacitor.config.ts', MORG_APP_ID, 'capacitor')
mustNotInclude('frontend/android/app/build.gradle', MORG_APP_ID, 'gradle')

const javaMain = join(frontend, 'android/app/src/main/java/de/iota/messenger/MainActivity.java')
if (existsSync(javaMain)) ok('Java package de.iota.messenger')
else fail('Java MainActivity unter de.iota.messenger fehlt')

console.log('\n=== Phase-3 / API Smoke ===\n')
const smoke = spawnSync(process.execPath, ['scripts/smoke-phase3-desk.mjs'], {
  cwd: root,
  stdio: 'inherit',
  shell: false,
})
if (smoke.status !== 0) process.exitCode = smoke.status ?? 1

console.log('\n=== APK-Artefakt ===\n')
if (existsSync(apkPath)) {
  ok(`Debug-APK vorhanden: ${apkPath}`)
} else {
  console.log('  [ ] APK noch nicht gebaut — cd frontend && npm run apk:debug:build')
}

console.log('\n=== Nächster Schritt: Feldtest ===\n')
console.log('  docs/STANDALONE-APK.md — 2 Geräte installieren (parallel zu Morgendrot-APK möglich)')
console.log('  docs/PHASE-3-ZWEI-GERAETE-TEST.md — Checkliste A–E\n')

process.exit(process.exitCode ?? 0)
