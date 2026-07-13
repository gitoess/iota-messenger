# IOTA Messenger — Test-Logbuch

| Datum | Setup | Schritte | Ergebnis |
|-------|--------|----------|----------|
| 2026-07-10 | PC, `npm run smoke:phase3-desk` | API + Chain-Probe + 15 Unit-Tests (Peering/Handshake/Gruppe) | **PASS** — Schreibtisch |
| 2026-07-13 | PC, APK-Branding `de.iota.messenger` | `npm run smoke:standalone-apk` + `apk:debug:build` | **PASS** — Schreibtisch + frische Debug-APK |
| | 2× Gerät / 2× Browser-Profil | `docs/PHASE-3-ZWEI-GERAETE-TEST.md` A–E | *offen* |

**Vorlage für Feldtest-Zeile:**

```text
| YYYY-MM-DD | 2× Android / 2× Chrome-Profil | Phase 3 A1–E3; Build commit … | PASS/FAIL — z.B. Handshake OK, Gruppe 2 TX |
```
