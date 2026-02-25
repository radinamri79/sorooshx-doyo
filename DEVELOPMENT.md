# Development Setup Guide

This guide covers setting up the Doyo project for local development without Docker.

## Prerequisites

- **Python 3.11+**
- **Node.js 20+**
- **PostgreSQL 14+**
- **Redis 7+**
- **Git**

## Quick Setup (5 minutes)

### 1. Clone & Navigate
```bash
cd ~/startup-projects/sorooshx-doyo/sorooshx-doyo
```

### 2. Backend Setup
```bash
# Create Python virtual environment
python3.11 -m venv ../.venv
source ../.venv/bin/activate

# Install dependencies
cd backend
pip install -r requirements/base.txt
cd ..

# Configure environment
cp .env.example .env.local
```

Edit `.env.local` with your local settings:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=doyo
DB_USER=doyo
DB_PASSWORD=doyo
REDIS_URL=redis://localhost:6379/0
DJANGO_DEBUG=True
```

### 3. Database Setup
```bash
# Create PostgreSQL user and database
psql -U postgres << EOF
CREATE USER doyo WITH PASSWORD 'doyo';
CREATE DATABASE doyo OWNER doyo;
EOF

# Run migrations
cd backend
export $(grep -v '^#' ../.env.local | xargs)
python manage.py migrate
python manage.py createsuperuser
cd ..
```

### 4. Frontend Setup
```bash
cd frontend
cp .env.example .env.local
npm install
cd ..
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
source ../.venv/bin/activate
export $(grep -v '^#' ../.env.local | xargs)
python manage.py runserver 0.0.0.0:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Access the App
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api
- **Admin Panel:** http://localhost:8000/admin
- **API Docs:** http://localhost:8000/api/docs (if Swagger is configured)

---

## Project Structure

```
sorooshx-doyo/
├── backend/                    # Django 5 REST API
│   ├── config/                # Settings and configuration
│   │   ├── settings/
│   │   │   ├── base.py       # Shared settings
│   │   │   ├── dev.py        # Development settings
│   │   │   ├── prod.py       # Production settings
│   │   │   └── test.py       # Test settings
│   │   ├── urls.py            # URL routing
│   │   ├── asgi.py            # ASGI config
│   │   └── wsgi.py            # WSGI config
│   ├── apps/                  # Django applications
│   │   ├── users/            # User management
│   │   ├── providers/        # Service providers
│   │   ├── orders/           # Order management
│   │   ├── conversations/    # Chat/messaging
│   │   ├── reviews/          # Reviews & ratings
│   │   └── notifications/    # Notifications
│   ├── utils/                # Shared utilities
│   ├── requirements/         # Dependencies
│   │   ├── base.txt
│   │   ├── dev.txt
│   │   ├── prod.txt
│   │   └── test.txt
│   ├── manage.py
│   └── pytest.ini            # Pytest configuration
│
├── frontend/                   # Next.js 15 React app
│   ├── src/
│   │   ├── app/              # Next.js app directory
│   │   ├── components/       # Reusable React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities and API clients
│   │   ├── stores/           # Zustand state management
│   │   ├── types/            # TypeScript types
│   │   └── styles/           # Global styles
│   ├── public/               # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   └── tailwind.config.js
│
├── service-rag/               # FastAPI AI service (optional)
│   ├── main.py
│   ├── routers/
│   ├── rag/
│   └── requirements.txt
│
├── nginx/                     # Reverse proxy (production)
├── scripts/                   # Setup and utility scripts
├── docs/                      # Documentation
│   ├── PROJECT_PLAN.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   └── TEST_RESULTS.md
│
├── .env.example              # Environment template
├── .env.local                # Local development (gitignored)
├── .gitignore
├── docker-compose.yml        # Docker services
├── Makefile                  # Development commands
├── README.md                 # Project overview
├── DEVELOPMENT.md            # This file
├── CONTRIBUTING.md           # Contribution guidelines
└── CODE_OF_CONDUCT.md       # Community guidelines
```

---

## Common Development Tasks

### Run Migrations
```bash
cd backend
python manage.py migrate
```

### Create New Migration
```bash
cd backend
python manage.py makemigrations [app_name]
python manage.py migrate
```

### Run Tests
```bash
# All tests
cd backend
pytest

# Specific app
pytest apps/users/tests/

# With coverage
pytest --cov=apps
```

### Create Superuser
```bash
cd backend
python manage.py createsuperuser
```

### Django Shell
```bash
cd backend
python manage.py shell
```

### Frontend Build
```bash
cd frontend
npm run build
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Format Code

**Backend:**
```bash
cd backend
black .
```

**Frontend:**
```bash
cd frontend
npm run format
```

### Lint Code

**Backend:**
```bash
cd backend
flake8 .
```

**Frontend:**
```bash
cd frontend
npm run lint
```

---

## Environment Variables

### Backend (`.env.local`)
```env
# Database
DB_NAME=doyo
DB_USER=doyo
DB_PASSWORD=doyo
DB_HOST=localhost
DB_PORT=5432

# Redis
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/1

# Django
DJANGO_SECRET_KEY=dev-secret-key-change-in-production
DJANGO_DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret

# OpenAI (optional)
OPENAI_API_KEY=sk-your-api-key
OPENAI_MODEL=gpt-4o
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXT_PUBLIC_RAG_URL=http://localhost:8001/rag
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

---

## Debugging

### Django Debug Toolbar
The debug toolbar is enabled in development. Visit any page to see database queries, templates, etc.

### Frontend Hot Reload
Changes to frontend code automatically reload in the browser.

### Backend Hot Reload
Install `django-extensions` and use:
```bash
python manage.py runserver_plus
```

### View Backend Logs
```bash
make logs-backend
```

### View Frontend Logs
```bash
make logs-frontend
```

---

## Database

### Reset Database
```bash
cd backend
# Drop and recreate
python manage.py migrate zero
python manage.py migrate  
```

### Backup Database
```bash
pg_dump -U doyo doyo > backup.sql
```

### Restore Database
```bash
psql -U doyo doyo < backup.sql
```

### Database Shell
```bash
psql -U doyo -d doyo
```

---

## Redis

### Connect to Redis CLI
```bash
redis-cli
```

### Clear Cache
```bash
redis-cli FLUSHDB
```

### Monitor Activity
```bash
redis-cli MONITOR
```

---

## Common Issues

### PostgreSQL Connection Refused
- Ensure PostgreSQL is running: `brew services start postgresql@14`
- Check credentials in `.env.local`
- Verify database exists: `psql -U postgres -l | grep doyo`

### Redis Connection Refused
- Ensure Redis is running: `brew services start redis`
- Check REDIS_URL in `.env.local`
- Test connection: `redis-cli ping` (should return PONG)

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Module Import Errors
```bash
# Reinstall dependencies
cd backend
pip install --upgrade -r requirements/base.txt
```

### Frontend Build Errors
```bash
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

---

## Git Workflow

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make changes and test

3. Commit with clear messages:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

4. Push and create a Pull Request:
   ```bash
   git push origin feature/your-feature-name
   ```

---

## Performance Tips

- Use GitHub's `.env.local` for secrets (never commit)
- Clear `.next` cache if experiencing issues: `rm -rf frontend/.next`
- Clear Python cache: `find . -type d -name __pycache__ -exec rm -rf {} +`
- Use `pytest-xdist` for parallel testing: `pytest -n auto`

---

## Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/docs/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Last Updated:** February 25, 2026
