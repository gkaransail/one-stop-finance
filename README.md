# One Stop Finance

Real-time financial intelligence platform — theme intelligence, options chain analysis, insider trades, sentiment analysis, and trend reversal signals.

**Stack:** React + Vite (TypeScript) · FastAPI (Python 3.12) · PostgreSQL · Redis · Celery · Docker

---

## Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)
- That's it — no local Python or Node install needed.

### 1. Clone the repo
```bash
git clone git@github.com:rosshh-7/one-stop-finance.git
cd one-stop-finance
```

### 2. Set up environment files
```bash
# Backend
cp .env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

Edit `backend/.env` and fill in any real API keys you have (Stripe, NewsAPI). The defaults work for local Docker development as-is.

### 3. Start all services
```bash
docker-compose up --build
```

First build takes ~3–5 minutes. Subsequent starts take ~5 seconds.

### 4. Run database migrations + seed data
```bash
# In a second terminal
docker exec osf_api alembic upgrade head
docker exec osf_api bash -c "cd /app && PYTHONPATH=/app python scripts/seed_themes.py"
```

### 5. Open the app
| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API docs | http://localhost:8000/docs |
| Health check | http://localhost:8000/health |

---

## Project Structure
```
one-stop-finance/
├── backend/          # FastAPI + Celery workers
│   ├── app/
│   │   ├── features/ # Router → Service → Repository per feature
│   │   ├── models/   # SQLAlchemy models
│   │   ├── workers/  # Celery background tasks
│   │   └── integrations/ # yfinance, SEC EDGAR, news
│   └── scripts/      # Seed scripts
├── frontend/         # React + Vite
│   └── src/
│       ├── features/ # Feature modules
│       ├── pages/    # Route-level components
│       ├── components/ # Shared UI + layout
│       └── stores/   # Zustand state
└── docker-compose.yml
```

## Common Commands
```bash
make dev          # Start all services
make stop         # Stop all services
make logs         # Tail logs from all services
make migrate      # Run pending Alembic migrations
make test         # Run backend tests
make shell-api    # Open shell inside the API container
make shell-db     # Open psql inside the database container
```

---

## Environment Variables

Copy `.env.example` → `backend/.env`. Key variables:

| Variable | Description |
|---|---|
| `SECRET_KEY` | JWT signing key — generate with `openssl rand -hex 32` |
| `STRIPE_SECRET_KEY` | Stripe secret (get from dashboard) |
| `NEWS_API_KEY` | NewsAPI key (free tier at newsapi.org) |

All other defaults work for local Docker development without changes.
