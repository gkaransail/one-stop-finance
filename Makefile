.PHONY: dev build stop restart logs migrate seed test lint clean

# ─── Development ─────────────────────────────────────────────────────────────

dev:
	docker-compose up --build

dev-d:
	docker-compose up --build -d

stop:
	docker-compose down

restart:
	docker-compose down && docker-compose up --build -d

logs:
	docker-compose logs -f

logs-api:
	docker-compose logs -f api

logs-worker:
	docker-compose logs -f worker

# ─── Database ─────────────────────────────────────────────────────────────────

migrate:
	docker-compose exec api alembic upgrade head

migrate-down:
	docker-compose exec api alembic downgrade -1

migrate-create:
	@read -p "Migration name: " name; \
	docker-compose exec api alembic revision --autogenerate -m "$$name"

seed:
	docker-compose exec api python -m app.scripts.seed

# ─── Testing ──────────────────────────────────────────────────────────────────

test:
	docker-compose exec api pytest tests/ -v

test-backend:
	docker-compose exec api pytest tests/ -v --tb=short

test-frontend:
	docker-compose exec frontend npm run test

# ─── Code Quality ─────────────────────────────────────────────────────────────

lint:
	docker-compose exec api ruff check app/
	docker-compose exec frontend npm run lint

format:
	docker-compose exec api ruff format app/

# ─── Utilities ────────────────────────────────────────────────────────────────

shell-api:
	docker-compose exec api bash

shell-db:
	docker-compose exec postgres psql -U osf_user -d osf

clean:
	docker-compose down -v --remove-orphans
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .next -exec rm -rf {} + 2>/dev/null || true

# ─── Production ───────────────────────────────────────────────────────────────

prod-up:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

prod-down:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
