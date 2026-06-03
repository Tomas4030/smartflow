# Contributors — SmartFlow

> **Project II · Web Programming · ETIC_Algarve · 2025/26**  
> Group D

---

## Team

| Name | Role | Areas |
|------|------|--------|
| [Tomás](#tomás--lead--frontend--backend) | **Lead · Frontend + Backend** | Architecture, DevOps, Backend, Dashboard |
| [Lucas](#lucas--frontend--backend) | **Frontend + Backend** | UI Pages, Events API, Docs, QA |

---

## Tomás · Lead · Frontend + Backend

**Project lead and primary decision-maker across architecture and backend.**

### Project Management & Architecture
- Overall project coordination and phase deliverables oversight
- System architecture design and major technical decisions
- Repository setup, Git workflow, and branch protection strategy
- Lead presenter — pitch and concept section of the final presentation

### Infrastructure & DevOps
- Docker and Docker Compose configuration
- Nginx configuration — static file serving and `/api/*` proxy
- `.env.example` and environment variable documentation
- GitHub Actions CI pipeline

### Backend
- Express.js application setup and configuration
- Database schema design (Prisma)
- Authentication — login, JWT issuance and middleware
- Intersections API — CRUD endpoints scoped to municipality
- Unit tests — auth and intersections modules (lead)

### Frontend
- Dashboard page — live Leaflet map with intersection status
- Intersection manager page — admin CRUD interface

### Design & Documentation
- Visual identity and design tokens (Figma)
- Architecture diagram and data model diagram
- Technical documentation — architecture and API reference (lead)

---

## Lucas · Frontend + Backend

**Frontend lead for user-facing pages and owner of written documentation.**

### Project Planning
- Scope document and roles & responsibilities matrix
- Low-fidelity wireframes for all pages (Figma)
- Presentation outline skeleton

### Backend
- Events API — detection trigger, event list and resolve endpoints
- Input validation and error handling for events endpoints
- Unit tests — events module (lead)

### Frontend
- Landing page — public-facing SmartFlow pitch
- Login page — municipality dropdown and authentication flow
- Events log page — detection history with filters
- Client-side validation and error messages across all pages

### Quality Assurance
- Responsive testing across desktop, tablet and mobile viewports
- Accessibility checks — contrast, labels, keyboard navigation

### Documentation
- `README.md` — project overview and getting started (lead)
- User-facing guide — install and operator walkthrough (lead)
- Product demo video (lead)
- Final presentation deck (lead)

---

## Contribution Legend

| Label | Meaning |
|-------|---------|
| **Lead** | Primary contributor — makes final decisions on this item |
| **Contributor** | Active development and implementation |
| **Reviewer** | Code review and quality assurance |

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 (CDN) · Babel Standalone |
| Maps | Leaflet 1.9.4 · OSRM (external) |
| Styling | Custom CSS · design tokens · dark / light themes |
| i18n | Vanilla JS — PT / EN |
| Backend | Node.js 20 · Express.js |
| Auth | JWT · bcryptjs |
| ORM | Prisma |
| Database | PostgreSQL 16 |
| Web Server | Nginx (static files + API proxy) |
| Containerisation | Docker · Docker Compose |
| CI | GitHub Actions |
| Version Control | Git · GitHub |

---

*SmartFlow · Group D · ETIC_Algarve · 2025/26*