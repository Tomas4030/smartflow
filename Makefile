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


db-wait:
	until docker compose exec db pg_isready -U $(POSTGRES_USER) -d $(POSTGRES_DB); do sleep 1; done

db-reset:
	docker compose down -v
	docker compose up -d db
	$(MAKE) db-wait
	$(MAKE) backend-migrate
	$(MAKE) backend-seed

db-count:
	docker compose exec db psql -P pager=off -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c "SELECT 'municipalities' AS table, COUNT(*) FROM municipalities UNION ALL SELECT 'users', COUNT(*) FROM users UNION ALL SELECT 'intersections', COUNT(*) FROM intersections UNION ALL SELECT 'detection_events', COUNT(*) FROM detection_events;"

db-show:
	docker compose exec db psql -P pager=off -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c "SELECT id, name, district FROM municipalities ORDER BY name;"
	docker compose exec db psql -P pager=off -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c "SELECT u.name, u.email, u.role, m.name AS municipality FROM users u JOIN municipalities m ON u.municipality_id = m.id ORDER BY m.name;"
	docker compose exec db psql -P pager=off -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c "SELECT m.name AS municipality, i.name AS intersection, i.address, ROUND(i.lat::numeric, 6) AS lat, ROUND(i.lng::numeric, 6) AS lng, i.status FROM intersections i JOIN municipalities m ON i.municipality_id = m.id ORDER BY m.name, i.name;"
	docker compose exec db psql -P pager=off -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c "SELECT e.id, i.name AS intersection, e.triggered_by, e.green_duration_s, e.detected_at, e.resolved_at FROM detection_events e JOIN intersections i ON e.intersection_id = i.id ORDER BY e.detected_at DESC;"