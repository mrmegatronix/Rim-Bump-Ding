# Rim-Bump-Ding (RBD)

> **South Island New Zealand Live Pothole Radar & Hazard Reporting Network**
> Real-time crowdsourced reporting, proximity audio alerts, and contractor dispatch for Te Wai Pounamu state highways.

## Key Features

- **Interactive South Island Road Radar**: Powered by Leaflet & dark high-contrast road mapping bounded to the South Island.
- **Severity Rating System**:
  - 💥 **Rim Bender**: Critical crater / wheel damage risk
  - ⚠️ **Bump**: Moderate suspension jolt
  - ⚡ **Ding**: Minor seal defect
  - ✅ **Repaired**: Waka Kotahi / Council patched
- **State Highway Corridors**: Dedicated filters and routes for SH1, SH6, SH7, SH8, SH73 (Arthur's Pass / Otira Gorge), SH94 (Milford Road), and Crown Range Road.
- **Proximity Audio & Visual HUD**: Haversine distance tracking alerting approaching drivers (< 1.5 km) with synthesized Web Audio alarms.
- **Waka Kotahi NZTA Emergency Links**: Direct 0800 4 HIGHWAYS (0800 44 44 49) and local council contact cards.
- **Contractor Ops Dashboard (`admin.html`)**: Live incident queue for road crews (Fulton Hogan, Downer, Higgins) to dispatch teams, update repair states, and export CSVs.
- **Drive Telemetry Simulator (`remote.html`)**: Virtual GPS route feeder simulating transit through South Island alpine passes.

## Quick Start

Serve with any static HTTP server:

```bash
python3 -m http.server 8080
```

Open:
- Radar Map: `http://localhost:8080/index.html`
- Contractor Dispatch: `http://localhost:8080/admin.html`
- Drive Simulator: `http://localhost:8080/remote.html`
