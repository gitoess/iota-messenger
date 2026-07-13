#!/usr/bin/env node
/**
 * Einmalig: leeres GitHub-Repo anlegen (nutzt gespeicherte Git-Credentials).
 * Usage: node scripts/github-create-repo.mjs [owner/repo]
 */
import { execSync } from 'node:child_process'

const target = (process.argv[2] || 'gitoess/iota-messenger').trim()
const [owner, name] = target.split('/')
if (!owner || !name) {
  console.error('Usage: node scripts/github-create-repo.mjs owner/repo')
  process.exit(1)
}

function gitCredential() {
  const input = 'protocol=https\nhost=github.com\n\n'
  const out = execSync('git credential fill', { input, encoding: 'utf8' })
  const lines = Object.fromEntries(
    out
      .trim()
      .split('\n')
      .map((l) => l.split('='))
      .filter(([k]) => k)
  )
  if (!lines.username || !lines.password) {
    throw new Error('Keine GitHub-Credentials in git credential manager')
  }
  return { username: lines.username, token: lines.password }
}

const { token } = gitCredential()
const body = {
  name,
  description:
    'IOTA Messenger — Wallet, Mailbox-Chat, Gruppen, IOTA-Transfer (standalone, abgeleitet von Morgendrot)',
  private: false,
  has_issues: true,
  auto_init: false,
}

const res = await fetch(`https://api.github.com/user/repos`, {
  method: 'POST',
  headers: {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
    'User-Agent': 'iota-messenger-bootstrap',
  },
  body: JSON.stringify(body),
})

const text = await res.text()
let json
try {
  json = JSON.parse(text)
} catch {
  json = { message: text }
}

if (res.status === 422 && String(json.message || '').includes('already exists')) {
  console.log(`Repo existiert bereits: https://github.com/${owner}/${name}`)
  process.exit(0)
}

if (!res.ok) {
  console.error(`GitHub API ${res.status}:`, json.message || text)
  process.exit(1)
}

console.log(`Repo erstellt: ${json.html_url}`)
