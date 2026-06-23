# API Reference — SmartFlow

> **Project II · Web Programming · ETIC_Algarve · 2025/26**

---

## Base URL

```
http://localhost/api
```

All paths below are relative to this base. In production the host changes but the `/api` prefix is always preserved by the Nginx reverse proxy.

---

## Authentication

Most endpoints require a **Bearer JWT** in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are issued by the login endpoints and expire after **8 hours**. Two token types exist:

| Type | Issued by | Required by |
|------|-----------|-------------|
| **operator** | `POST /auth/login` | All `/intersections`, `/events`, `/admin/*` endpoints |
| **citizen** | `POST /citizens/login` or `POST /citizens/register` | All `/citizens/*` endpoints |

The JWT payload for operator tokens contains: `sub`, `email`, `name`, `role`, `municipalityId`.  
The JWT payload for citizen tokens contains: `sub`, `email`, `type: "citizen"`.

---

## Health

### `GET /health`

Liveness check. No authentication required.

**Response `200`**
```json
{ "status": "ok" }
```

---

## Auth

### `POST /auth/login`

Authenticate an operator or admin and receive a JWT.

**Auth required:** No

**Request body**
```json
{
  "email": "admin@albufeira.pt",
  "password": "password"
}
```

**Response `200`**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Admin Albufeira",
    "email": "admin@albufeira.pt",
    "role": "admin",
    "municipalityId": "uuid",
    "municipality": "Albufeira"
  }
}
```

**Errors**

| Code | Body | Reason |
|------|------|--------|
| 400 | `{"error":"Email and password are required"}` | Missing field |
| 401 | `{"error":"Invalid credentials"}` | Wrong email or password |

---

### `POST /auth/logout`

Stateless logout — clears no server state. The client should discard the token.

**Auth required:** No

**Response `200`**
```json
{ "message": "Logged out successfully" }
```

---

## Municipalities

### `GET /municipalities`

List all municipalities on the platform.

**Auth required:** No

**Response `200`**
```json
[
  { "id": "uuid", "name": "Albufeira", "district": "Faro", "createdAt": "2026-06-08T20:52:09.000Z" },
  { "id": "uuid", "name": "Faro",      "district": "Faro", "createdAt": "2026-06-08T20:52:09.000Z" }
]
```

---

## Intersections

All intersection endpoints are scoped to the **authenticated user's municipality** — the `municipalityId` is read from the JWT, not from a request parameter.

### `GET /intersections`

List all intersections for the caller's municipality.

**Auth required:** Yes (any role)

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "municipalityId": "uuid",
      "name": "Av. da Liberdade / R. do Ouro",
      "address": "Avenida da Liberdade, Albufeira",
      "lat": "37.0890",
      "lng": "-8.2500",
      "status": "idle",
      "createdAt": "2026-06-08T20:52:09.000Z",
      "updatedAt": "2026-06-08T20:52:09.000Z"
    }
  ]
}
```

---

### `GET /intersections/:id`

Get a single intersection by ID (must belong to the caller's municipality).

**Auth required:** Yes (any role)

**Response `200`** — same shape as a single element of the list above.

**Errors**

| Code | Body | Reason |
|------|------|--------|
| 404 | `{"error":"Intersection not found"}` | Not found or belongs to another municipality |

---

### `POST /intersections`

Create a new intersection. New intersections are created with `status: "pending"` and must be approved by a SuperAdmin before becoming active.

**Auth required:** Yes (`admin` or `superadmin`)

**Request body**
```json
{
  "name": "R. 5 de Outubro / R. do Mar",
  "address": "Rua 5 de Outubro, Albufeira",
  "lat": 37.088,
  "lng": -8.249
}
```

| Field | Type | Required |
|-------|------|----------|
| `name` | string | Yes |
| `address` | string | Yes |
| `lat` | number (-90 … 90) | Yes |
| `lng` | number (-180 … 180) | Yes |
| `status` | string | No (defaults to `"pending"`) |

**Response `201`**
```json
{
  "data": {
    "id": "uuid",
    "municipalityId": "uuid",
    "name": "R. 5 de Outubro / R. do Mar",
    "address": "Rua 5 de Outubro, Albufeira",
    "lat": "37.0880",
    "lng": "-8.2490",
    "status": "pending",
    "createdAt": "2026-06-23T10:00:00.000Z",
    "updatedAt": "2026-06-23T10:00:00.000Z"
  }
}
```

**Errors**

| Code | Body | Reason |
|------|------|--------|
| 400 | `{"error":"Validation failed","details":[...]}` | Invalid payload |
| 403 | `{"error":"Admin role required"}` | Insufficient role |

---

### `PUT /intersections/:id`

Update an existing intersection. All fields are optional — only provided fields are changed.

**Auth required:** Yes (`admin` or `superadmin`)

**Status restrictions:**
- `admin` can set: `priority`, `offline`, `pending`
- `superadmin` can set any status including `idle`

**Request body** (all fields optional)
```json
{
  "name": "Updated Name",
  "address": "New Address",
  "lat": 37.091,
  "lng": -8.252,
  "status": "offline"
}
```

**Response `200`** — updated intersection wrapped in `{ "data": {...} }`.

**Errors**

| Code | Body | Reason |
|------|------|--------|
| 400 | `{"error":"Validation failed","details":[...]}` | Invalid value |
| 403 | `{"error":"Admin role required"}` | Insufficient role |
| 404 | `{"error":"Intersection not found"}` | Not found or wrong municipality |

---

### `DELETE /intersections/:id`

Delete an intersection.

**Auth required:** Yes (`admin` or `superadmin`)

**Response `204`** — empty body.

**Errors**

| Code | Body | Reason |
|------|------|--------|
| 403 | `{"error":"Admin role required"}` | Insufficient role |
| 404 | `{"error":"Intersection not found"}` | Not found |

---

## Detection Events

All event endpoints are scoped to the caller's municipality via JWT.

### `GET /events`

List detection events. Supports optional query filters.

**Auth required:** Yes (any role)

**Query parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `intersectionId` | uuid | Filter by intersection |
| `date` | YYYY-MM-DD | Events on a specific calendar date |
| `from` | YYYY-MM-DD | Start of a date range (inclusive) |
| `to` | YYYY-MM-DD | End of a date range (inclusive) |
| `status` | `active` \| `resolved` | Active = `resolvedAt` is null |

**Response `200`**
```json
[
  {
    "id": "uuid",
    "intersectionId": "uuid",
    "triggeredBy": "manual",
    "greenDurationS": 30,
    "detectedAt": "2026-06-23T10:05:00.000Z",
    "resolvedAt": null,
    "intersection": {
      "name": "Av. da Liberdade / R. do Ouro",
      "address": "Avenida da Liberdade, Albufeira"
    }
  }
]
```

---

### `GET /events/:id`

Get a single detection event.

**Auth required:** Yes (any role)

**Response `200`** — single event object (same shape as list element above).

**Errors**

| Code | Body | Reason |
|------|------|--------|
| 404 | `{"error":"Event not found"}` | Not found |

---

### `POST /events/trigger`

Manually trigger a detection event on an intersection. Sets the intersection `status` to `"priority"` atomically.

**Auth required:** Yes (any role — in practice only admin-role users see the button in the UI)

**Request body**
```json
{
  "intersectionId": "uuid",
  "greenDurationS": 30
}
```

| Field | Type | Required |
|-------|------|----------|
| `intersectionId` | uuid | Yes |
| `greenDurationS` | positive integer | Yes |

**Response `201`**
```json
{
  "id": "uuid",
  "intersectionId": "uuid",
  "triggeredBy": "manual",
  "greenDurationS": 30,
  "detectedAt": "2026-06-23T10:05:00.000Z",
  "resolvedAt": null
}
```

**Errors**

| Code | Body | Reason |
|------|------|--------|
| 400 | `{"error":"intersectionId and greenDurationS are required"}` | Missing fields |
| 400 | `{"error":"greenDurationS must be a positive number"}` | Invalid duration |
| 403 | `{"error":"Intersection not found or not in your municipality"}` | Wrong municipality |

---

### `POST /events/:id/resolve`

Resolve an active detection event. Sets `resolvedAt` to the current time and returns the intersection to `"idle"`.

**Auth required:** Yes (any role)

**Response `200`** — updated event object with `resolvedAt` populated.

**Errors**

| Code | Body | Reason |
|------|------|--------|
| 400 | `{"error":"Event is already resolved"}` | Already resolved |
| 404 | `{"error":"Event not found"}` | Not found |

---

## Admin (SuperAdmin only)

All `/admin/*` endpoints require `role: "superadmin"` in the JWT. Any other role receives `403`.

### `GET /admin/municipalities`

List all municipalities with intersection count stats.

**Auth required:** Yes (`superadmin`)

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Albufeira",
      "district": "Faro",
      "createdAt": "2026-06-08T20:52:09.000Z",
      "total": 5,
      "pending": 1,
      "priority": 0,
      "offline": 0
    }
  ]
}
```

---

### `POST /admin/municipalities`

Create a new municipality and its first admin user in one request.

**Auth required:** Yes (`superadmin`)

**Request body**
```json
{
  "name": "Portimão",
  "district": "Faro",
  "adminEmail": "admin@portimao.pt",
  "adminPassword": "securepassword"
}
```

**Response `201`**
```json
{
  "data": {
    "id": "uuid",
    "name": "Portimão",
    "district": "Faro",
    "createdAt": "2026-06-23T10:00:00.000Z",
    "admin": {
      "email": "admin@portimao.pt",
      "name": "Admin Portimão"
    }
  }
}
```

**Errors**

| Code | Body | Reason |
|------|------|--------|
| 400 | `{"error":"name, district, adminEmail and adminPassword are required"}` | Missing fields |
| 409 | `{"error":"Municipality or email already exists"}` | Duplicate |

---

### `PUT /admin/municipalities/:id`

Update a municipality's name or district.

**Auth required:** Yes (`superadmin`)

**Request body** (all fields optional)
```json
{ "name": "New Name", "district": "New District" }
```

**Response `200`** — updated municipality wrapped in `{ "data": {...} }`.

---

### `DELETE /admin/municipalities/:id`

Delete a municipality. Fails if the municipality still has intersections or users.

**Auth required:** Yes (`superadmin`)

**Response `204`** — empty body.

**Errors**

| Code | Body | Reason |
|------|------|--------|
| 404 | `{"error":"Municipality not found"}` | Not found |
| 409 | `{"error":"Cannot delete municipality with existing intersections or users"}` | Has dependants |

---

### `GET /admin/intersections`

List all intersections across all municipalities.

**Auth required:** Yes (`superadmin`)

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "municipalityId": "uuid",
      "name": "Av. da Liberdade / R. do Ouro",
      "address": "Avenida da Liberdade, Albufeira",
      "lat": "37.0890",
      "lng": "-8.2500",
      "status": "pending",
      "createdAt": "2026-06-23T10:00:00.000Z",
      "updatedAt": "2026-06-23T10:00:00.000Z",
      "municipality": { "name": "Albufeira" }
    }
  ]
}
```

---

### `GET /admin/intersections/pending`

List intersections with `status: "pending"` awaiting approval.

**Auth required:** Yes (`superadmin`)

**Response `200`** — same shape as `GET /admin/intersections`.

---

### `PUT /admin/intersections/:id/approve`

Approve a pending intersection — sets its status to `"idle"`.

**Auth required:** Yes (`superadmin`)

**Response `200`** — updated intersection wrapped in `{ "data": {...} }`.

**Errors**

| Code | Body | Reason |
|------|------|--------|
| 400 | `{"error":"Only pending intersections can be approved"}` | Wrong current status |
| 404 | `{"error":"Intersection not found"}` | Not found |

---

### `PUT /admin/intersections/:id/reject`

Reject a pending intersection — sets its status to `"offline"`.

**Auth required:** Yes (`superadmin`)

**Response `200`** — updated intersection wrapped in `{ "data": {...} }`.

**Errors**

| Code | Body | Reason |
|------|------|--------|
| 400 | `{"error":"Only pending intersections can be rejected"}` | Wrong current status |
| 404 | `{"error":"Intersection not found"}` | Not found |

---

### `GET /admin/history`

All detection events across all municipalities, most recent first (capped at 100).

**Auth required:** Yes (`superadmin`)

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "intersectionId": "uuid",
      "triggeredBy": "sos",
      "greenDurationS": 120,
      "detectedAt": "2026-06-23T10:05:00.000Z",
      "resolvedAt": null,
      "intersection": {
        "name": "Av. da Liberdade / R. do Ouro",
        "address": "Avenida da Liberdade, Albufeira",
        "municipality": { "name": "Albufeira" }
      }
    }
  ]
}
```

---

## Citizens

Citizens authenticate with a separate token type (`type: "citizen"`). Endpoints that require citizen auth reject operator tokens with `403`.

### `POST /citizens/register`

Create a citizen account and receive a JWT.

**Auth required:** No

**Request body**
```json
{
  "name": "Maria Silva",
  "email": "maria@example.com",
  "password": "mypassword",
  "phone": "+351912345678"
}
```

| Field | Type | Required |
|-------|------|----------|
| `name` | string | Yes |
| `email` | string | Yes |
| `password` | string | Yes |
| `phone` | string | No |

**Response `201`**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "uuid",
    "name": "Maria Silva",
    "email": "maria@example.com",
    "type": "citizen"
  }
}
```

**Errors**

| Code | Body | Reason |
|------|------|--------|
| 400 | `{"error":"name, email and password are required"}` | Missing fields |
| 409 | `{"error":"Email already registered"}` | Duplicate email |

---

### `POST /citizens/login`

Authenticate an existing citizen.

**Auth required:** No

**Request body**
```json
{ "email": "maria@example.com", "password": "mypassword" }
```

**Response `200`** — same shape as `/citizens/register` `201` response.

---

### `GET /citizens/me`

Get the full profile of the authenticated citizen. The `passwordHash` field is always excluded.

**Auth required:** Yes (citizen token)

**Response `200`**
```json
{
  "data": {
    "id": "uuid",
    "name": "Maria Silva",
    "email": "maria@example.com",
    "phone": "+351912345678",
    "address": "R. das Flores 10",
    "addressFloor": "2",
    "addressDoor": "Esq",
    "lat": null,
    "lng": null,
    "age": 34,
    "bloodType": "A+",
    "conditions": "Diabetes tipo 2",
    "allergies": "Penicilina",
    "medication": "Metformina 850mg",
    "emergencyName": "João Silva",
    "emergencyPhone": "+351961234567",
    "notes": null,
    "createdAt": "2026-06-18T10:00:00.000Z"
  }
}
```

---

### `PUT /citizens/profile`

Update any profile field. All fields are optional — only provided fields are written.

**Auth required:** Yes (citizen token)

**Request body** (example — all fields optional)
```json
{
  "name": "Maria Silva",
  "phone": "+351912345678",
  "address": "R. das Flores 10",
  "addressFloor": "2",
  "addressDoor": "Esq",
  "lat": 37.089,
  "lng": -8.250,
  "age": 34,
  "bloodType": "A+",
  "conditions": "Diabetes tipo 2",
  "allergies": "Penicilina",
  "medication": "Metformina 850mg",
  "emergencyName": "João Silva",
  "emergencyPhone": "+351961234567",
  "notes": "Marcar urgência sempre como pediátrica"
}
```

**Response `200`** — updated citizen profile wrapped in `{ "data": {...} }` (same shape as `GET /citizens/me`).

---

### `POST /citizens/sos`

Trigger an SOS emergency request. The system:
1. Picks a random idle intersection and sets it to `priority`
2. Creates a `DetectionEvent` with `triggeredBy: "sos"` and `greenDurationS: 120`
3. Generates a Portuguese-language simulated 112 call transcript using the citizen's health data
4. Records an `EmergencyRequest` linking the citizen to the selected intersection

**Auth required:** Yes (citizen token)

**Request body** — none required.

**Response `201`**
```json
{
  "message": "Emergência simulada criada com sucesso.",
  "status": "simulated_call",
  "callTranscript": "Chamada simulada para o 112:\n\nOlá, esta é uma chamada automática...",
  "emergency": {
    "id": "uuid",
    "createdAt": "2026-06-23T10:05:00.000Z"
  },
  "smartflowEvent": {
    "eventId": "uuid",
    "intersection": "Av. da Liberdade / R. do Ouro",
    "municipality": "uuid",
    "status": "priority"
  }
}
```

> `smartflowEvent` is `null` if no idle intersection was found.

---

### `GET /citizens/emergencies`

List all SOS emergency requests submitted by the authenticated citizen.

**Auth required:** Yes (citizen token)

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "citizenId": "uuid",
      "intersectionId": "uuid",
      "status": "simulated_call",
      "callTranscript": "...",
      "createdAt": "2026-06-23T10:05:00.000Z",
      "resolvedAt": null,
      "intersection": {
        "name": "Av. da Liberdade / R. do Ouro",
        "address": "Avenida da Liberdade, Albufeira"
      }
    }
  ]
}
```

---

## Chat

### `POST /chat`

Send a message to the AI support assistant (powered by NVIDIA NIM / Llama 3.1 8B). Rate-limited to **20 requests per minute per IP**.

**Auth required:** No

**Request body**
```json
{
  "message": "Como funciona o sistema SmartFlow?",
  "language": "pt"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | User message (PT or EN) |
| `language` | `"pt"` \| `"en"` | Response language (defaults to `"pt"`) |

**Response `200`**
```json
{
  "reply": "O SmartFlow é uma plataforma web que permite às câmaras municipais..."
}
```

**Errors**

| Code | Body | Reason |
|------|------|--------|
| 429 | `{"error":"Too many requests"}` | Rate limit exceeded |
| 503 | `{"error":"Chat service unavailable"}` | `NVIDIA_API_KEY` not configured |

---

*SmartFlow · Group D · ETIC_Algarve · 2025/26*
