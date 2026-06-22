.PHONY: all dev setup stop prod seed reset logs test

# Default target
all: setup dev

# ══════════════════════════════════════════════════════════════
#  SmartFlow — Makefile
#
#  Development (hot reload):
#    make dev
#
#  First time setup:
#    make setup
#
#  Production (Docker):
#    make prod
# ══════════════════════════════════════════════════════════════


# ── One command to rule them all ──────────────────────────────

# make start
#   Does EVERYTHING: installs deps, builds, starts all containers,
#   runs migrations, seeds mock data. Open http://localhost when done.
start:
	cd frontend && npm install
	docker compose up --build -d
	docker compose exec backend npm run seed
	@echo ""
	@echo "  ✓ SmartFlow is running at http://localhost"
	@echo "  ✓ Login: admin@albufeira.pt / password"
	@echo ""

# ── Development (hot reload) ──────────────────────────────────

# make dev
#   Starts DB + backend in Docker, then runs Vite dev server
#   with hot reload on http://localhost:5173
dev:
	docker compose up --build -d db backend
	cd frontend && npm run dev

# ── Setup ─────────────────────────────────────────────────────

# make setup
#   Run ONCE on a fresh clone. Installs deps, starts DB,
#   runs migrations, seeds data, then starts dev server.
setup:
	cd frontend && npm install
	cd backend && npm install
	docker compose up -d db
	docker compose exec backend npx prisma migrate deploy
	docker compose exec backend npm run seed
	@echo ""
	@echo "  ✓ Setup complete! Run 'make dev' to start developing."
	@echo ""

# ── Production ────────────────────────────────────────────────

# make prod
#   Build and start the full stack in Docker (production mode).
prod:
	docker compose up --build -d

# ── Stop ──────────────────────────────────────────────────────

# make stop
#   Stop all containers.
stop:
	docker compose down

# ── Database ──────────────────────────────────────────────────

# make seed
#   Run the seed script inside the backend container.
seed:
	docker compose exec backend npm run seed

# make reset
#   ⚠️  DESTRUCTIVE — wipes DB volume and starts fresh.
reset:
	docker compose down -v
	docker compose up -d db backend
	docker compose exec backend npx prisma migrate deploy
	docker compose exec backend npm run seed

# make logs
#   Tail logs from all containers.
logs:
	docker compose logs -f

# ── Tests ─────────────────────────────────────────────────────

# make test
#   Run all backend unit tests.
test:
	cd backend && npm test
	@echo ""
	@echo "  Cobertura dos testes:"
	@echo "  ✓ Auth: login válido, password errada e utilizador inexistente"
	@echo "  ✓ Citizens: login, email duplicado, proteção JWT e passwordHash"
	@echo "  ✓ Admin: acesso superadmin e aprovação de cruzamentos pendentes"
	@echo "  ✓ Intersections: município, permissões, coordenadas e criação"
	@echo "  ✓ Events: trigger, isolamento por município, resolve e logs"
