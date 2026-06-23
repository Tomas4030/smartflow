# Architecture — SmartFlow

> **Project II · Web Programming · ETIC_Algarve · 2025/26**

---

## System Architecture Diagram

```mermaid
flowchart TB
    Browser["🌐 Browser\nReact 18 · Vite · Leaflet"]
    Citizen["📱 Citizen App\nSOS flow"]

    subgraph compose["Docker Compose"]
        direction TB
        Nginx["Nginx\nStatic files · /api proxy"]
        Express["Express.js\nREST API · JWT auth"]
        Postgres[("PostgreSQL 16\nPrisma ORM")]
    end

    OSRM(["OSRM\nRoad routing\nexternal"])
    NVIDIA(["NVIDIA NIM\nLlama 3.1 8B\nexternal AI"])

    Browser -- "HTTP — static files" --> Nginx
    Browser -- "HTTP — /api/*" --> Nginx
    Citizen -- "HTTP — /api/citizens/*" --> Nginx
    Nginx -- "proxy /api/*" --> Express
    Express -- "SQL / Prisma" --> Postgres
    Browser -. "HTTPS — map routing" .-> OSRM
    Express -. "HTTPS — chat completions" .-> NVIDIA
```

---

## Data Flow

### Operator detection flow

```mermaid
sequenceDiagram
    actor Operator
    participant Browser
    participant Nginx
    participant Express
    participant DB as PostgreSQL

    Operator->>Browser: Opens SmartFlow
    Browser->>Nginx: GET /
    Nginx-->>Browser: Static HTML + JS bundle

    Operator->>Browser: Submits login form
    Browser->>Nginx: POST /api/auth/login
    Nginx->>Express: proxy
    Express->>DB: SELECT user WHERE email = ?
    DB-->>Express: User row
    Express-->>Browser: 200 · JWT token

    Browser->>Nginx: GET /api/intersections
    Nginx->>Express: proxy (JWT in header)
    Express->>DB: SELECT * FROM intersections WHERE municipality_id = ?
    DB-->>Express: Intersection rows
    Express-->>Browser: 200 · JSON array

    Operator->>Browser: Clicks "Simulate detection"
    Browser->>Nginx: POST /api/events/trigger
    Nginx->>Express: proxy
    Express->>DB: INSERT detection_event
    Express->>DB: UPDATE intersection SET status = 'priority'
    DB-->>Express: OK
    Express-->>Browser: 201 · Created event

    loop Every 5 seconds
        Browser->>Nginx: GET /api/intersections
        Express->>DB: SELECT intersections
        DB-->>Express: Updated rows
        Express-->>Browser: 200 · JSON
        Browser->>Browser: Update Leaflet marker colours
    end
```

### Citizen SOS flow

```mermaid
sequenceDiagram
    actor Citizen
    participant Browser
    participant Nginx
    participant Express
    participant DB as PostgreSQL

    Citizen->>Browser: Presses SOS button
    Browser->>Nginx: POST /api/citizens/sos (citizen JWT)
    Nginx->>Express: proxy
    Express->>DB: SELECT random idle intersection
    DB-->>Express: Intersection row
    Express->>DB: UPDATE intersection SET status = 'priority'
    Express->>DB: INSERT detection_event (triggered_by = 'sos')
    Express->>DB: INSERT emergency_request (transcript, citizen, intersection)
    DB-->>Express: OK
    Express-->>Browser: 201 · transcript + event info
    Browser->>Browser: Display simulated 112 call transcript
```

---

## Services

### `frontend` — Nginx (`nginx:alpine`)

Serves the compiled Vite/React bundle — HTML, JS chunks, CSS, fonts — and acts as a **reverse proxy** for all API requests. A single-origin setup means the browser never has to deal with CORS.

**Responsibilities:**
- Serve the static build output (HTML, JS, CSS, web fonts)
- Proxy all `/api/*` requests to the `backend` service
- `try_files $uri /index.html` fallback for client-side routing

**Key config:** [frontend/nginx.conf](../frontend/nginx.conf)

---

### `backend` — Node.js 20 (`node:20-alpine`)

Express.js REST API. On startup it runs `prisma migrate deploy` to apply pending migrations before accepting requests.

**Responsibilities:**

| Route prefix | Purpose | Auth |
|---|---|---|
| `POST /api/auth/login` | Issue JWT tokens | None |
| `GET /api/municipalities` | List municipalities | None |
| `GET|POST|PUT|DELETE /api/intersections` | Intersection CRUD (scoped to municipality) | Operator JWT |
| `GET /api/events` | List detection events | Operator JWT |
| `POST /api/events/trigger` | Manual detection trigger | Operator JWT |
| `POST /api/events/:id/resolve` | Close an active event | Operator JWT |
| `/api/admin/*` | SuperAdmin: manage municipalities, approve intersections, view global history | SuperAdmin JWT |
| `/api/citizens/*` | Citizen registration, login, profile, SOS | Citizen JWT (separate claim) |
| `POST /api/chat` | AI support chat via NVIDIA NIM | None (rate-limited) |

**Key files:** [backend/src/index.js](../backend/src/index.js), [backend/src/routes/](../backend/src/routes/), [backend/src/middleware/auth.js](../backend/src/middleware/auth.js)

---

### `db` — PostgreSQL 16 (`postgres:16-alpine`)

Relational database. Data is persisted in a named Docker volume (`pgdata`) so it survives container restarts. A `pg_isready` healthcheck ensures the backend waits for a healthy database before starting.

**Schema managed by:** Prisma — [backend/prisma/schema.prisma](../backend/prisma/schema.prisma)

---

### OSRM — External

The open-source routing engine used by the Leaflet map to draw road-following ambulance routes from an intersection to a citizen's location. Calls are made directly from the browser to `router.project-osrm.org`.

> **Note:** OSRM is a public third-party service. If it is unavailable, the map falls back to a straight-line route. This dependency is explicitly out of scope for reliability guarantees.

---

### NVIDIA NIM — External

The AI inference endpoint that powers the support chatbot (`POST /api/chat`). The backend sends the user message to the NVIDIA NIM API (Llama 3.1 8B Instruct) and streams the response back.

Requires `NVIDIA_API_KEY` in the environment. If the key is absent the endpoint returns `503`.

---

## Communication Patterns

| From | To | Protocol | Notes |
|------|----|----------|-------|
| Browser | Nginx | HTTP | Static delivery + API gateway |
| Citizen App | Nginx | HTTP | SOS and citizen API calls |
| Nginx | Express | HTTP | Reverse proxy for `/api/*` |
| Express | PostgreSQL | TCP / SQL | Via Prisma query engine |
| Browser | OSRM | HTTPS | External — ambulance route display only |
| Express | NVIDIA NIM | HTTPS | External — AI chat completions |

---

## Containerisation

A single `docker compose up --build` starts the entire stack. No host-level setup beyond Docker and a `.env` file is required.

```
docker compose up --build
```

| Service | Base image | Exposed port | Notes |
|---------|-----------|-------------|-------|
| frontend | nginx:alpine (custom) | **80 → 80** | Only externally-accessible port |
| backend | node:20-alpine (custom) | internal only | Reached via Nginx proxy |
| db | postgres:16-alpine | internal only | Named volume `pgdata` |

The backend and database ports are **not** exposed to the host. All external traffic enters through Nginx on port 80.

---

## Roles and Access Control

Three user tiers exist, each identified by the JWT payload:

| Tier | JWT field | Can do |
|------|-----------|--------|
| **Operator** | `role: "operator"` | View dashboard, view event log |
| **Admin** | `role: "admin"` | + Add/edit/delete intersections, trigger & resolve detections |
| **SuperAdmin** | `role: "superadmin"` | + Manage municipalities, approve/reject intersections, view global history |
| **Citizen** | `type: "citizen"` | Register, update profile, trigger SOS, view own emergency history |

Operator and Admin JWTs carry a `municipalityId` claim that scopes every query. SuperAdmin and Citizen JWTs do not.

---

*SmartFlow · Group D · ETIC_Algarve · 2025/26*
