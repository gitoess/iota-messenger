# IOTA Messenger

**Eigenständiges Projekt** — Wallet + Mailbox-Chat + Gruppen + IOTA senden.  
**Kein** Boss, Helfer, Handoff, LoRa, Telegram, SOS.

Technische Basis: Move-Messenger-Protokoll (aus Morgendrot abgeleitet, siehe `UPSTREAM.md`).

## Voraussetzungen

- Node.js 20+
- Android SDK + JDK (nur für APK-Build)
- Deployed `PACKAGE_ID` + `MAILBOX_ID` auf Testnet oder Mainnet (vorbelegt in `product/testnet-starter.json`)

## Ersteinrichtung (Desktop)

```bash
npm install
cd frontend && npm install && cd ..
cp .env.example .env
npm run dev
```

- **UI:** http://127.0.0.1:3341  
- **API:** http://127.0.0.1:3342 (optional — Kernflows laufen per Direkt-RPC)

## Standalone-APK (Android)

**Paket-ID:** `de.iota.messenger` — parallel zu Morgendrot Messenger installierbar.

```bash
npm run smoke:standalone-apk   # Schreibtisch + Branding + Phase-3-Tests
cd frontend
npm run apk:debug:build        # → android/app/build/outputs/apk/debug/app-debug.apk
npm run apk:debug:install      # optional per USB
```

Anleitung + Feldtest: [`docs/STANDALONE-APK.md`](docs/STANDALONE-APK.md)  
Zwei-Geräte-Test: [`docs/PHASE-3-ZWEI-GERAETE-TEST.md`](docs/PHASE-3-ZWEI-GERAETE-TEST.md)

## Smoke-Tests

```bash
npm run smoke                  # API + Produkt-Checks
npm run smoke:phase3-desk      # + Chain-Probe + Peering/Handshake-Unit
npm run smoke:standalone-apk   # + APK-Branding + alles oben
```

## GitHub

https://github.com/gitoess/iota-messenger

## Lizenz

AGPL-3.0-or-later — siehe `LICENSE` und `UPSTREAM.md`.
