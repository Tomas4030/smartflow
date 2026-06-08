.PHONY: help env up up-db down migrate seed dev test lint clean

.DEFAULT_GOAL := help

# ── Help ─────────────────────────────────────────────────────
help:
	@echo ""
	@echo "  SmartFlow — available commands"
	@echo ""
	@echo "  make env        Generate .env files in all locations"
	@echo "  make up         Start the full stack (docker compose)"
	@echo "  make up-db      Start the database only"
	@echo "  make down       Stop all containers"
	@echo "  make migrate    Run Prisma migrations"
	@echo "  make seed       Seed the database with mock data"
	@echo "  make dev        Start the backend in dev mode"
	@echo "  make test       Run backend tests"
	@echo "  make lint       Run the linter"
	@echo "  make clean      Remove generated .env files"
	@echo ""

# ── Env ──────────────────────────────────────────────────────
# Copies root .env from .env.example (if missing), then generates
# backend/.env with only the vars it needs — no DATABASE_URL stored anywhere.
env:
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "  ✓ Created root .env — edit it if you need custom values"; \
	else \
		echo "  · Root .env already exists, skipping"; \
	fi
	@grep -E "^(POSTGRES_USER|POSTGRES_PASSWORD|POSTGRES_DB|JWT_SECRET)" .env > backend/.env
	@echo "  ✓ Created backend/.env"

# ── Docker ───────────────────────────────────────────────────
up:
	docker compose up --build

up-db:
	docker compose up db -d

down:
	docker compose down

# ── Database ─────────────────────────────────────────────────
# DATABASE_URL is constructed at runtime from backend/.env — never stored in a file.
migrate:
	@cd backend && \
	set -a && . ./.env && set +a && \
	DATABASE_URL="postgresql://$$POSTGRES_USER:$$POSTGRES_PASSWORD@localhost:5432/$$POSTGRES_DB" \
	npx prisma migrate dev

seed:
	@cd backend && \
	set -a && . ./.env && set +a && \
	DATABASE_URL="postgresql://$$POSTGRES_USER:$$POSTGRES_PASSWORD@localhost:5432/$$POSTGRES_DB" \
	node prisma/seed.js

# ── Backend ──────────────────────────────────────────────────
dev:
	cd backend && npm run dev

test:
	cd backend && npm test

lint:
	cd backend && npm run lint

# ── Clean ────────────────────────────────────────────────────
clean:
	@rm -f .env backend/.env
	@echo "  ✓ Removed .env files"