# User Guide — SmartFlow

> **Project II · Web Programming · ETIC_Algarve · 2025/26**

---

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| [Docker](https://docs.docker.com/get-docker/) | 24 + | Includes Docker Compose v2 |
| [Git](https://git-scm.com/) | any | |
| NVIDIA NIM API key | — | Optional — only required for the AI support chat feature |

No local Node.js or PostgreSQL installation is needed. Everything runs inside containers.

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Tomas4030/smartflow.git
cd smartflow
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` in a text editor. The defaults work out of the box for local development. If you want the AI chat feature, set your key:

```
NVIDIA_API_KEY=nvapi-xxxxxxxxxxxxxxxxxxxx
```

All other values can be left unchanged for a local run.

### 3. Start the stack

```bash
make start
```

This single command installs frontend dependencies, builds and starts all containers, runs Prisma migrations, and seeds demo data. The app is ready when you see:

```
  ✓ SmartFlow is running at http://localhost
```

Open **http://localhost** in your browser.

### Other useful Makefile commands

| Command | What it does |
|---------|-------------|
| `make dev` | Starts DB + backend in Docker, runs Vite dev server with hot reload on :5173 |
| `make stop` | Stop all containers |
| `make seed` | Re-run the seed script (adds demo data without wiping anything) |
| `make reset` | ⚠️ Wipe the database and start fresh |
| `make logs` | Tail logs from all containers |
| `make test` | Run backend unit tests |

---

## Logging In

### Operator / Admin login

Navigate to **http://localhost/login**.

| Municipality | Email | Password | Role |
|---|---|---|---|
| Albufeira | admin@albufeira.pt | password | admin |
| Faro | admin@faro.pt | password | admin |
| Lagos | admin@lagos.pt | password | admin |
| Portimão | admin@portimao.pt | password | admin |

> Seed credentials for development only.

After login you are taken to the **Dashboard** — a live map showing all intersections for your municipality, plus a sidebar with the recent events log.

### SuperAdmin login

Navigate to **http://localhost/admin/login**.

| Email | Password |
|-------|----------|
| superadmin@smartflow.pt | password |

The superadmin is the platform owner — above all municipality operators and admins. They can create and delete municipalities, approve or reject new intersections that admins submit, and view the full detection event history across every municipality.

### Citizen (SOS) login

Navigate to **http://localhost/client/login** or create a new account at **http://localhost/client/register**.

Citizens do not belong to a municipality. Their session uses a separate JWT claim (`type: "citizen"`) and grants access only to the citizen profile and SOS endpoints.

---

## Dashboard Overview

After operator login you will see:

| Panel | Description |
|-------|-------------|
| **Map** | Leaflet map with colour-coded intersection markers (green = idle, red = priority, grey = offline) |
| **Events log** | Table of recent detection events — detected time, intersection, duration, status |
| **Stat cards** | Count of intersections by status (idle / priority / offline / pending) |

The map and events table auto-refresh every 5 seconds.

---

## How to Trigger a Detection

A *detection* simulates an emergency vehicle arriving at an intersection. The intersection switches to `priority` status (red on the map) and a new entry appears in the events log.

### Option 1 — Dashboard simulate button (recommended for demos)

1. Log in as an admin user.
2. Click any intersection marker on the map, or open the **Intersections** page from the sidebar.
3. Click the **Simulate detection** button next to an intersection.
4. Choose the green corridor duration (seconds) and confirm.
5. The intersection marker turns red immediately. Refresh the events log to see the new entry.

### Option 2 — Simulator page

Navigate to **http://localhost/simulator** for a dedicated testing interface. You can fire multiple detections in quick succession and watch the map update in real time.

### Option 3 — Direct API call

Send a `POST /api/events/trigger` request with a valid operator JWT:

```bash
# 1. Get a token
TOKEN=$(curl -s -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@albufeira.pt","password":"password"}' \
  | jq -r '.token')

# 2. List intersections and pick an id
curl -s http://localhost/api/intersections \
  -H "Authorization: Bearer $TOKEN" | jq '.data[0]'

# 3. Trigger a detection
curl -s -X POST http://localhost/api/events/trigger \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"intersectionId":"<id-from-step-2>","greenDurationS":30}'
```

A `201 Created` response confirms the event was recorded and the intersection is now in `priority` status.

---

## How to Resolve an Event

Resolving an event clears the `priority` status and returns the intersection to `idle`.

### Via the dashboard

Open the **Events** page and click **Resolve** on any active event (one with no resolved time).

### Via the API

```bash
curl -s -X POST http://localhost/api/events/<event-id>/resolve \
  -H "Authorization: Bearer $TOKEN"
```

---

## Triggering an SOS (Citizen flow)

1. Register a citizen account at **http://localhost/client/register**.
2. Fill in your profile at **http://localhost/client/profile** — health information (blood type, conditions, allergies) and emergency contact are used to generate the call transcript.
3. Navigate to **http://localhost/client/sos** and press the SOS button.

The system will:
- Select a random idle intersection and set it to `priority`
- Create a `DetectionEvent` with `triggered_by = "sos"`
- Generate a Portuguese-language simulated 112 call transcript with your health data
- Return the transcript and event details to the page

---

## AI Support Chat

Click the **chat bubble** icon (bottom-right corner of any page) to open the support chat. The bot answers questions about SmartFlow in Portuguese or English.

The chat requires `NVIDIA_API_KEY` to be set in `.env`. Without the key the endpoint returns a 503 and the chat widget shows an error message.
