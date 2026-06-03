# SmartFlow

> Emergency vehicle traffic priority system — Web Programming Project II  
> ETIC_Algarve · 2025/26 · Group D

---

## The Problem

In Portugal, emergency response times are critically affected by urban traffic. In 2024, an ambulance in Pombal took over an hour to reach a patient — resulting in a fatality. Without a way to clear intersections ahead of an emergency vehicle, every red light is a lost minute.

## The Solution

SmartFlow is a web platform that gives municipalities real-time visibility and control over their traffic intersections. A camera at each intersection detects the approach of an emergency vehicle by its lights and automatically holds a green corridor open until the vehicle passes.

The web platform lets operators monitor every intersection on a live map, review the history of all detection events, and simulate detections for testing and demonstration purposes.

> **MVP scope:** The camera detection hardware is out of scope for this project. Detection events are either received from an external camera system or triggered manually through the dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 (CDN) · Babel Standalone · Leaflet 1.9.4 |
| Styling | Custom CSS · design tokens · dark / light themes |
| i18n | Vanilla JS — PT / EN |
| Backend | Node.js 20 · Express.js |
| Auth | JWT · bcryptjs |
| ORM | Prisma |
| Database | PostgreSQL 16 |
| Web Server | Nginx (static files + `/api/*` proxy) |
| Containerisation | Docker · Docker Compose |
| CI | GitHub Actions |

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/) installed
- Git

### Run locally

```bash
# 1. Clone the repository
git clone https://github.com/<your-org>/smartflow.git
cd smartflow

# 2. Set up environment variables
cp .env.example .env
# Edit .env and set a strong JWT_SECRET

# 3. Start the full stack
docker compose up --build
```

The app will be available at **http://localhost**.

> On first run, Prisma runs migrations automatically and seeds the database with mock municipalities and intersections. No manual setup required.

### Default login

| Municipality | Email | Password |
|---|---|---|
| Albufeira | admin@albufeira.pt | password |
| Faro | admin@faro.pt | password |

> These are seed accounts for development only. Change credentials before any real deployment.

### Stop the stack

```bash
docker compose down          # stop containers
docker compose down -v       # stop containers and delete the database volume
```

---

## Team

| Name | Role |
|------|------|
| Tomás | Lead · Frontend + Backend |
| Lucas | Frontend + Backend |

See [`CONTRIBUTIONS.md`](CONTRIBUTIONS.md) for a full breakdown of individual contributions.

---

## Licence

Academic project — not for commercial use.  
© 2025/26 Tomás, Lucas · ETIC_Algarve