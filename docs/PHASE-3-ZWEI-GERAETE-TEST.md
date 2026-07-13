# Phase 3 — Zwei-Geräte-Test (IOTA Messenger)

**Zweck:** Abnahme des **Kern-Flows** ohne Boss/Handoff: Wallet → Peering → Handshake → Chat → Gruppe → IOTA-Transfer.  
**Projekt:** `Desktop/iota-messenger` (eigenständig)  
**Netz:** Testnet-Starter aus `product/testnet-starter.json` (automatisch beim Start)

---

## 0. Schreibtisch (vor dem Feld)

```bash
cd Desktop/iota-messenger
npm run smoke:phase3-desk
```

Erwartung: API-Smoke + Chain-Probe + Peering/Handshake-Unit-Tests **grün**.

Optional APK:

```bash
cd frontend
npm run apk:debug:build
```

---

## 1. Voraussetzungen

| # | Check |
|---|--------|
| V1 | **2 Geräte** mit Internet (WLAN/Mobil) — oder **2 Browser-Profile** am PC (Notlösung) |
| V2 | Gleicher Build (Commit notieren) |
| V3 | **Kein** Boss-Server nötig — optional `npm run dev` nur wenn ihr Relay testen wollt; Standard ist **Direkt-RPC** |
| V4 | Pro Gerät/Profil: **eigene Wallet** (Mnemonic) — Testnet-Gas auf beiden Adressen |
| V5 | Testnet-Faucet: https://faucet.testnet.iotaledger.net (oder euer üblicher Weg) |

**Wichtig:** Beide Geräte nutzen dieselben Chain-IDs (automatisch via Testnet-Starter). Unterschiedlich sind nur die **Wallet-Adressen**.

---

## 2. Gerät A — Wallet + Peering-QR

| ID | Schritt | Erwartung | PASS / FAIL | Notiz |
|----|---------|-----------|-------------|-------|
| A1 | App öffnen (Browser http://127.0.0.1:3341 oder APK) | Titel **IOTA Messenger**; kein Handoff-Import sichtbar | | |
| A2 | Wallet anlegen / Mnemonic importieren | Tresor entsperrt; eigene `0x…`-Adresse sichtbar | | |
| A3 | Status: RPC Testnet, Package/Mailbox gesetzt | Kein Chain-Wizard (Phase 2) | | |
| A4 | **Chats** → **Puls** (oder Chat-Kopf) → **Mein Peering-QR** | QR mit Adresse + ECDH-Pub | | |
| A5 | Adresse notieren | `0x` + 64 Hex | | |

---

## 3. Gerät B — Kontakt per QR

| ID | Schritt | Erwartung | PASS / FAIL | Notiz |
|----|---------|-----------|-------------|-------|
| B1 | Wallet wie A2 | Eigene Adresse ≠ A | | |
| B2 | **Peering-QR scannen** (A’s QR) oder JSON einfügen | Partner A in Kontakten / Peers | | |
| B3 | Optional: B zeigt eigenen QR → A scannt | Gegenseitiges Peering | | |

---

## 4. Handshake + verschlüsselter 1:1-Chat

| ID | Schritt | Erwartung | PASS / FAIL | Notiz |
|----|---------|-----------|-------------|-------|
| C1 | **A:** Chat mit B → **Handshake senden** | Erfolg (Direkt-RPC) | | |
| C2 | **B:** **Posteingang** → Handshake-Anfrage | Sichtbar; **Annehmen** | | |
| C3 | **A → B:** verschlüsselte Nachricht (Online, Mailbox) | Senden OK; Badge **Direkt** | | |
| C4 | **B:** Posteingang aktualisieren | Nachricht lesbar | | |
| C5 | **B → A:** Antwort | Auf A lesbar | | |

---

## 5. Gruppenchat

| ID | Schritt | Erwartung | PASS / FAIL | Notiz |
|----|---------|-----------|-------------|-------|
| D1 | **A:** Chats → Gruppe **anlegen**; Mitglieder = B (Adresse) | Gruppe lokal gespeichert | | |
| D2 | **A:** Nachricht in Gruppe senden (verschlüsselt, Mailbox) | Erfolg — on-chain **N× pairwise** (ein TX pro Mitglied) | | |
| D3 | **B:** Posteingang / Gruppenansicht | Nachricht sichtbar | | |
| D4 | **B:** Antwort in Gruppe | Auf A bei allen Mitgliedern ankommend | | |

---

## 6. IOTA senden

| ID | Schritt | Erwartung | PASS / FAIL | Notiz |
|----|---------|-----------|-------------|-------|
| E1 | **A:** Dashboard → **IOTA senden** (oder Transfer-Karte) | Formular mit Empfänger + Betrag | | |
| E2 | Kleiner Betrag an **B** senden | TX-Digest; Balance aktualisiert | | |
| E3 | **B:** Empfang sichtbar (Balance / Inbox-Hinweis) | Betrag angekommen | | |

---

## 7. Negative Checks (kurz)

- [ ] Kein Handoff-/Boss-Menü in Einstellungen
- [ ] Kein LoRa/Telegram/SOS in der UI
- [ ] App-Neustart: Wallet + Testnet-IDs bleiben
- [ ] Flugmodus: Queue/offline-Hinweis ehrlich (kein Fake-„gesendet“)

---

## 8. Gate — wann Phase 3 „fertig“

| Ergebnis | Aktion |
|----------|--------|
| **C1–C5 PASS** + **D2–D3 PASS** | Kern-Messenger **abgenommen** |
| **E1–E2 PASS** | Wallet-Transfer **abgenommen** |
| Peering nur mit manueller Adresse, QR FAIL | Feintuning Peering-UI — Chat kann trotzdem go |
| Handshake FAIL | RPC/Package prüfen (`npm run smoke:phase3-chain`) |

---

## 9. Logbuch

Eintrag in `docs/TEST-RUN-LOGBOOK.md`:

```text
| 2026-07-10 | 2× Gerät, IOTA Messenger Phase 3 | A1–E3 … | PASS/FAIL — Kurznotiz |
```

---

## Alternative: 2 Browser-Profile (1 PC)

1. Chrome Profil **Alice** + Profil **Bob**
2. Jeweils http://127.0.0.1:3341 — `npm run dev` im Projektordner
3. QR: Screenshot von Alice → Bob lädt Bild hoch / JSON einfügen
4. Gleiche Schritte C–E

**Limitation:** Zwei Wallets auf einem PC ist OK für Entwicklung; echter Feldtest bleibt 2 Geräte.

---

## Verweise (Upstream-Konzepte)

Peering-QR: `frontend/frontend/lib/peering-qr.ts`  
Gruppen-Senden: `frontend/frontend/lib/group-mailbox-pairwise-send.ts`  
Testnet-IDs: `product/testnet-starter.json`
