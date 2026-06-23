# SmartFlow

[![CI](https://github.com/Tomas4030/smartflow/actions/workflows/ci.yml/badge.svg)](https://github.com/Tomas4030/smartflow/actions/workflows/ci.yml)

> Emergency vehicle traffic priority system — Web Programming Project II  
> ETIC_Algarve · 2025/26 · Group D

---

## The Problem

In Portugal, emergency response times are critically affected by urban traffic. In 2024, an ambulance in Pombal took over an hour to reach a patient — resulting in a fatality. Without a way to clear intersections ahead of an emergency vehicle, every red light is a lost minute.

## The Solution

SmartFlow is a web platform that gives municipalities real-time visibility and control over their traffic intersections. A camera at each intersection detects the approach of an emergency vehicle by its lights and automatically holds a green corridor open until the vehicle passes.

The platform lets operators monitor every intersection on a live map, review the full history of detection events, and simulate detections for testing. Citizens can register, provide health information, and press a single SOS button to trigger emergency services and activate the SmartFlow priority corridor simultaneously.

> **MVP scope:** Camera detection hardware is out of scope. Detection events are received from an external camera system or triggered manually through the dashboard or via the citizen SOS flow.

---

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Frontend | React 18 + Vite | Component model suits the real-time dashboard; Vite gives fast local dev and small production bundles |
| Styling | Tailwind CSS 4 + custom design tokens | Utility classes for layout speed; tokens enforce the dark/light theme contract across all components |
| Maps | Leaflet 1.9.4 + react-leaflet | Lightweight, open-source, no API key required; OSRM provides road-following routes |
| i18n | Vanilla JS (PT / EN) | No framework overhead for two static language files |
| Backend | Node.js 20 + Express.js | Large ecosystem, simple REST API surface, good Prisma support |
| Auth | JWT + bcryptjs | Stateless tokens suit the single-server MVP; short 8 h expiry limits exposure |
| ORM | Prisma 5 | Type-safe queries, migration history, and a clean schema file as the single source of truth |
| Database | PostgreSQL 16 | Relational model fits the municipality → intersection → event hierarchy; ACID transactions for atomic status updates |
| Web server | Nginx | Serves static files and reverse-proxies `/api/*` in one hop — no CORS configuration needed |
| Containerisation | Docker Compose | One command to start the full stack; isolated volumes for data persistence |
| AI chat | NVIDIA NIM (Llama 3.1 8B) | Bilingual support assistant without hosting a model locally |
| CI | GitHub Actions | Lint + test + Docker build pipeline |

---

## Architecture Overview

```
Browser / Citizen App
        │
        ▼
   Nginx : 80          ← static files + /api/* reverse proxy
        │
        ▼
  Express.js           ← REST API, JWT auth, Prisma
        │
        ▼
  PostgreSQL 16        ← persisted in Docker named volume
```

All three services run in a single Docker Compose stack. The backend port is not exposed to the host — all traffic enters through Nginx on port 80.

External dependencies:
- **OSRM** (`router.project-osrm.org`) — ambulance route display on the map (browser → OSRM directly)
- **NVIDIA NIM** — AI support chat (backend → NVIDIA API)

See [docs/architecture.md](docs/architecture.md) for detailed diagrams and data-flow sequences.

---

## Documentation

| Document | Contents |
|----------|----------|
| [docs/user-guide.md](docs/user-guide.md) | Prerequisites, install, login, how to trigger a detection |
| [docs/api-reference.md](docs/api-reference.md) | Every endpoint with method, path, auth, request body, response example |
| [docs/architecture.md](docs/architecture.md) | System diagram, service descriptions, data flow |
| [docs/data-model.md](docs/data-model.md) | ER diagram and table/column descriptions |

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Docker Compose v2
- Git

### Run locally

```bash
# 1. Clone the repository
git clone https://github.com/Tomas4030/smartflow.git
cd smartflow

# 2. Set up environment variables
cp .env.example .env
# Optionally set NVIDIA_API_KEY in .env for the AI support chat

# 3. Start the full stack
make all
```

The app will be available at **http://localhost**.

`make start` installs frontend dependencies, builds and starts all containers, runs Prisma migrations, and seeds demo data — all in one step.

### Makefile commands

| Command | What it does |
|---------|-------------|
| `make start` | Full start: install deps, build containers, migrate, seed, open at http://localhost |
| `make dev` | Dev mode: Docker for DB + backend, Vite dev server with hot reload on :5173 |
| `make stop` | Stop all containers |
| `make seed` | Re-run the seed script inside the running backend container |
| `make reset` | ⚠️ Wipe DB volume and start fresh (migrate + seed) |
| `make logs` | Tail logs from all containers |
| `make test` | Run backend unit tests |

### Default login

| Account | Email | Password | Role |
|---------|-------|----------|------|
| Albufeira admin | admin@albufeira.pt | password | admin |
| Faro admin | admin@faro.pt | password | admin |
| Lagos admin | admin@lagos.pt | password | admin |
| Portimão admin | admin@portimao.pt | password | admin |
| **SmartFlow owner** | **superadmin@smartflow.pt** | **password** | **superadmin** |

The superadmin account logs in at **http://localhost/admin/login** and can approve intersections, manage municipalities, and view the full event history across all municipalities.

> Seed credentials — change before any real deployment.

---

## Team

| Name | Role |
|------|------|
| Tomás | Lead · Frontend + Backend |
| Lucas | Frontend + Backend |

See [CONTRIBUTIONS.md](CONTRIBUTIONS.md) for a full breakdown of individual contributions.

---

## Licence

Academic project — not for commercial use.  
© 2025/26 Tomás, Lucas · ETIC_Algarve
