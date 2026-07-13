# Standalone-APK — IOTA Messenger

**Eigenständige Android-App** ohne Boss, Handoff, Funk oder Telegram.  
**Paket-ID:** `de.iota.messenger` — kann **parallel** zu Morgendrot Messenger (`de.morgendrot.messenger`) installiert werden.

---

## 0. Schreibtisch (vor dem Handy)

```bash
cd Desktop/iota-messenger
npm run smoke:standalone-apk
```

Erwartung: Branding + `smoke:phase3-desk` grün.

---

## 1. APK bauen

**Voraussetzung:** Android SDK + JDK (wie Morgendrot-APK).

```bash
cd frontend
npm run apk:debug:build
```

**Ausgabe:** `frontend/android/app/build/outputs/apk/debug/app-debug.apk`

Optional direkt installieren (USB-Debugging):

```bash
npm run apk:debug:install
```

---

## 2. Erster Start (ein Gerät)

| # | Schritt | Erwartung |
|---|---------|-----------|
| S1 | APK installieren, App öffnen | Launcher: **IOTA Messenger** (nicht Morgendrot) |
| S2 | Solo-Wizard / Wallet anlegen | Mnemonic oder Import; Tresor entsperrt |
| S3 | Testnet-IDs | Automatisch aus `product/testnet-starter.json` — kein Chain-Wizard |
| S4 | Statuszeile | „Standalone-APK aktiv — Direkt-RPC“ |
| S5 | **Keine** Basis-URL setzen | Einstellungen → Basis-URL leer (kein PC-Server nötig) |
| S6 | Puls: Sendeweg | **Direkt** (Standard), Drain an |

---

## 3. Zwei Geräte (Kern-Messenger)

Vollständige Checkliste: [`PHASE-3-ZWEI-GERAETE-TEST.md`](PHASE-3-ZWEI-GERAETE-TEST.md)

| Gate | Inhalt |
|------|--------|
| **C1–C5** | Peering → Handshake → verschl. Chat |
| **D2–D3** | Gruppe anlegen + Nachricht |
| **E1–E2** | IOTA-Transfer zwischen Wallets |

**Minimum:** 2× gleiche APK (Commit notieren), je eigene Wallet, Testnet-Gas auf beiden Adressen.

---

## 4. Was bewusst nicht drin ist

- Boss-Export / Handoff-ZIP
- LoRa / Meshtastic / Telegram
- SOS / Einsatzleitung
- Pflicht-Morgendrot-Server (`/api` nur optional)

---

## 5. Paralleler Vergleich mit Morgendrot

| | **IOTA Messenger** | **Morgendrot Messenger** |
|---|---|---|
| Repo | `gitoess/iota-messenger` | `gitoess/morgendrot-messenger` |
| `applicationId` | `de.iota.messenger` | `de.morgendrot.messenger` |
| Standalone-Doku | dieses Dokument | `docs/STANDALONE-SMOKE-CHECKLIST.md` (Morgendrot-Repo) |
| Einstieg | Solo-Wizard + Testnet-Starter | Handoff-ZIP vom Boss |

---

## 6. Logbuch

Eintrag in [`TEST-RUN-LOGBOOK.md`](TEST-RUN-LOGBOOK.md):

```text
| YYYY-MM-DD | 2× Android, IOTA Messenger APK commit … | STANDALONE-APK S1–S6 + Phase 3 A–E | PASS/FAIL — Kurznotiz |
```

---

## 7. Gate „Standalone fertig“

| Kriterium | Status |
|-----------|--------|
| Eigene `applicationId` + App-Name | Code ✓ — Feldtest offen |
| `npm run smoke:standalone-apk` grün | Schreibtisch |
| APK gebaut + auf 2 Geräten installiert | manuell |
| Phase 3 A–E PASS | manuell |

**Release-Hinweis:** Debug-APK nur für Feldtest — kein Play-Store-Signing in Phase 1–3.
