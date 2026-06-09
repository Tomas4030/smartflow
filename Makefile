.PHONY: setup backend-install backend-dev backend-seed backend-migrate backend-generate docker-up docker-down db-wait db-reset db-count db-show

-include .env
export

# ══════════════════════════════════════════════════════════════
#  SmartFlow — Makefile
#
#  Fresh clone quickstart:
#    make setup
#
#  Day-to-day development:
#    make docker-up       start the full stack
#    make backend-dev     run the backend locally (outside Docker)
#    make backend-migrate when you change schema.prisma
# ══════════════════════════════════════════════════════════════


# ── Setup ─────────────────────────────────────────────────────

# make setup
#   Run ONCE on a fresh clone. Does everything in order:
#   creates .env → installs npm deps → starts db → waits for it
#   → applies migrations → seeds data → starts the full stack.
#   Safe to re-run: .env and seed are skipped if already present.
setup:
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "  ✓ Created .env from .env.example (default credentials)"; \
	else \
		echo "  · .env already exists"; \
	fi
	@echo ""
	@echo "  ▸ Installing backend dependencies..."
	@cd backend && npm install --silent
	@echo "  ▸ Starting database..."
	@docker compose up -d db
	@echo "  ▸ Waiting for database to be ready..."
	@set -a && . ./.env && set +a && \
	 until docker compose exec -T db pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB 2>/dev/null; \
	 do printf "."; sleep 1; done && echo ""
	@echo "  ▸ Running migrations..."
	@set -a && . ./.env && set +a && cd backend && npx prisma migrate deploy
	@echo "  ▸ Seeding database..."
	@set -a && . ./.env && set +a && cd backend && npm run seed
	@echo "  ▸ Starting full stack..."
	@docker compose up --build -d
	@echo ""
	@echo "  ✓ SmartFlow is running at http://localhost"
	@echo "  ✓ API health: http://localhost/api/health"
	@echo "  ✓ Login: admin@albufeira.pt / password"
	@echo ""


# ── Backend ───────────────────────────────────────────────────

# make backend-install
#   Install npm dependencies inside backend/.
#   Run after cloning or after adding a new package to package.json.
backend-install:
	cd backend && npm install

# make backend-dev
#   Start the Express server locally with hot reload (--watch).
#   Use this when you want to work on the backend without Docker.
#   Requires the db container to be running: make docker-up (or docker compose up db -d).
backend-dev:
	cd backend && npm run dev

# make backend-generate
#   Regenerate the Prisma client after changing schema.prisma.
#   Run this before backend-migrate when you add/change a model.
backend-generate:
	cd backend && npx prisma generate

# make backend-migrate
#   Create a new migration from schema changes and apply it.
#   Use this during development when you edit schema.prisma.
#   Prompts for a migration name. Runs prisma migrate dev (not deploy).
#   Note: make setup uses migrate deploy (applies existing files, no prompt).
#         Use THIS command when you are the one changing the schema.
backend-migrate:
	cd backend && npx prisma migrate dev

# make backend-seed
#   Insert mock data into the database (municipalities, users,
#   intersections, detection events). Safe to re-run — skips
#   records that already exist and skips events if any are present.
backend-seed:
	cd backend && npm run seed

# make backend-studio
#   Open Prisma Studio in the browser — a visual DB editor.
#   Useful for inspecting or manually editing rows during development.
backend-studio:
	cd backend && npx prisma studio


# ── Docker ────────────────────────────────────────────────────

# make docker-up
#   Build images and start all three containers (frontend, backend, db).
#   Migrations run automatically on backend startup (prisma migrate deploy).
#   Use this for day-to-day development after initial setup.
docker-up:
	docker compose up --build

# make docker-down
#   Stop and remove all running containers.
#   Data is preserved in the pgdata volume — nothing is deleted.
docker-down:
	docker compose down


# ── Database ──────────────────────────────────────────────────

# make db-wait
#   Block until PostgreSQL is ready to accept connections.
#   Used internally by setup and db-reset. Rarely needed on its own.
db-wait:
	until docker compose exec -T db pg_isready -U $(POSTGRES_USER) -d $(POSTGRES_DB); do sleep 1; done

# make db-reset
#   ⚠️  DESTRUCTIVE — wipes the database volume and starts fresh.
#   Stops containers, removes the volume, restarts db, runs migrations
#   and seeds. Use when you want a clean slate (e.g. after schema changes
#   that can't be migrated, or to reproduce a clean-install scenario).
db-reset:
	docker compose down -v
	docker compose up -d db
	$(MAKE) db-wait
	$(MAKE) backend-migrate
	$(MAKE) backend-seed

# make db-count
#   Print a row count for each table — quick sanity check that
#   seed data is present and migrations ran correctly.
db-count:
	docker compose exec db psql -P pager=off -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c \
		"SELECT 'municipalities' AS table, COUNT(*) FROM municipalities \
		 UNION ALL SELECT 'users', COUNT(*) FROM users \
		 UNION ALL SELECT 'intersections', COUNT(*) FROM intersections \
		 UNION ALL SELECT 'detection_events', COUNT(*) FROM detection_events;"

# make db-show
#   Print all seeded data across all four tables in a readable format.
#   Useful for verifying seed output or debugging data issues.
db-show:
	docker compose exec db psql -P pager=off -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c \
		"SELECT id, name, district FROM municipalities ORDER BY name;"
	docker compose exec db psql -P pager=off -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c \
		"SELECT u.name, u.email, u.role, m.name AS municipality FROM users u \
		 JOIN municipalities m ON u.municipality_id = m.id ORDER BY m.name;"
	docker compose exec db psql -P pager=off -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c \
		"SELECT m.name AS municipality, i.name AS intersection, i.address, \
		 ROUND(i.lat::numeric, 6) AS lat, ROUND(i.lng::numeric, 6) AS lng, i.status \
		 FROM intersections i JOIN municipalities m ON i.municipality_id = m.id \
		 ORDER BY m.name, i.name;"
	docker compose exec db psql -P pager=off -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c \
		"SELECT e.id, i.name AS intersection, e.triggered_by, e.green_duration_s, \
		 e.detected_at, e.resolved_at FROM detection_events e \
		 JOIN intersections i ON e.intersection_id = i.id ORDER BY e.detected_at DESC;"