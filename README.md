# IOTA Messenger

**Eigenständiges Projekt** — Wallet + Mailbox-Chat + Gruppen + IOTA senden.  
**Kein** Boss, Helfer, Handoff, LoRa, Telegram, SOS.

Technische Basis: Move-Messenger-Protokoll (aus Morgendrot abgeleitet, siehe `UPSTREAM.md`).

## Voraussetzungen

- Node.js 20+
- Deployed `PACKAGE_ID` + `MAILBOX_ID` auf Testnet oder Mainnet

## Ersteinrichtung

```bash
npm install
cd frontend && npm install && cd ..
cp .env.example .env
# .env: PACKAGE_ID, MAILBOX_ID, RPC_URL eintragen
npm run dev
```

- **UI:** http://127.0.0.1:3341  
- **API:** http://127.0.0.1:3342 (optional — Kernflows laufen auch per Direkt-RPC)

## APK (Android)

```bash
cd frontend
npm run apk:debug:build
```

## Was Phase 2 enthält (Testnet-Starter)

- `product/testnet-starter.json` — feste Testnet-`PACKAGE_ID` / `MAILBOX_ID` (Feldtest Block2)
- Automatische Anwendung beim App-Start (`IotaMessengerTestnetBootstrap`)
- Kein manueller Chain-Wizard nötig — nur noch **Wallet anlegen** (Mnemonic)
- `.env` / `.env.example` mit denselben Testnet-IDs vorbelegt

## Smoke-Test

```bash
npm run smoke              # API + Produkt-Checks
npm run smoke:phase3-desk  # + Chain-Probe + Peering/Handshake-Unit
```

## Phase 3 — Zwei-Geräte-Feldtest

Anleitung: [`docs/PHASE-3-ZWEI-GERAETE-TEST.md`](docs/PHASE-3-ZWEI-GERAETE-TEST.md)  
Logbuch: [`docs/TEST-RUN-LOGBOOK.md`](docs/TEST-RUN-LOGBOOK.md)

## Lizenz

AGPL-3.0-or-later — siehe `LICENSE` und `UPSTREAM.md`.
