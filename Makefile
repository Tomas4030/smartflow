.PHONY: backend-install backend-dev backend-seed backend-migrate backend-generate docker-up docker-down

include .env
export

backend-install:
	cd backend && npm install

backend-dev:
	cd backend && npm run dev

backend-generate:
	cd backend && npx prisma generate

backend-migrate:
	cd backend && npx prisma migrate dev

backend-seed:
	cd backend && npm run seed

backend-studio:
	cd backend && npx prisma studio
	
docker-up:
	docker compose up --build

docker-down:
	docker compose down