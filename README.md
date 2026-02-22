# Doyo — AI-Powered Service Marketplace

A modern service marketplace connecting customers with local service providers through an intelligent AI chat assistant. Built with Next.js 15, Django 5, and FastAPI.

## Architecture

```
┌─────────┐     ┌──────────┐     ┌───────────┐
│ Next.js  │────▶│  Nginx   │────▶│  Django   │
│  (PWA)   │     │ (Proxy)  │────▶│  (API)    │
└─────────┘     └──────────┘     └───────────┘
                     │                  │
                     │            ┌─────┴─────┐
                     ▼            │           │
                ┌──────────┐  ┌──────┐  ┌────────┐
                │ Service  │  │Redis │  │Postgres│
                │   RAG    │  │      │  │+pgvec  │
                └──────────┘  └──────┘  └────────┘
```

| Service      | Tech                         | Port |
|-------------|------------------------------|------|
| Frontend    | Next.js 15, React 19, Zustand | 3000 |
| Backend     | Django 5, DRF, Channels       | 8000 |
| Service-RAG | FastAPI, OpenAI GPT-4o        | 8001 |
| Database    | PostgreSQL 16 + pgvector       | 5432 |
| Cache       | Redis 7                        | 6379 |

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Git

### Setup

```bash
# Clone
git clone https://github.com/sorooshx/doyo.git
cd doyo

# One-command setup
chmod +x scripts/setup.sh
./scripts/setup.sh
```

Or manually:

```bash
cp .env.example .env
docker compose up --build -d
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py seed_categories
docker compose exec backend python manage.py seed_providers
```

### Access

- **App**: http://localhost
- **API**: http://localhost/api/
- **Admin**: http://localhost/admin/
- **AI Chat API**: http://localhost/rag/

## Development

```bash
# Start all services
make up

# View logs
make logs

# Run migrations
make migrate

# Seed data
make seed

# Run tests
make test

# Create superuser
make createsuperuser

# Stop
make down
```

## Project Structure

```
├── backend/          # Django 5 REST API
├── frontend/         # Next.js 15 PWA
├── service-rag/      # FastAPI AI service
├── nginx/            # Reverse proxy
├── scripts/          # Setup scripts
├── docs/             # Documentation
├── docker-compose.yml
├── Makefile
└── .env.example
```

## Documentation

- [Project Plan](docs/PROJECT_PLAN.md) — Full architecture, schema, and roadmap
- [Implementation Summary](docs/IMPLEMENTATION_SUMMARY.md) — What was built

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description |
|----------|-------------|
| `DJANGO_SECRET_KEY` | Django secret key |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `OPENAI_API_KEY` | OpenAI API key for AI chat |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret |

## License

Private — All rights reserved.
