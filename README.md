# Doyo — AI-Powered Service Marketplace

A modern, full-stack service marketplace connecting customers with local service providers through an intelligent AI chat assistant. Built with **Next.js 15**, **Django 5**, **FastAPI**, and **PostgreSQL**.

![Status](https://img.shields.io/badge/status-active-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-private-red)

## 🌟 Features

### Core Functionality
- **AI-Powered Chat Assistant** - Intelligent service matching via OpenAI GPT-4
- **Service Marketplace** - Browse, filter, and book local service providers
- **User Authentication** - Email + Google OAuth integration
- **Real-time Messaging** - WebSocket-based provider-customer communication
- **Order Management** - Full order lifecycle (booking, payment, tracking)
- **Reviews & Ratings** - Community-driven quality assurance
- **Provider Directory** - Searchable provider profiles with portfolios
- **Notifications** - Real-time updates via email and in-app notifications

### Technical Highlights
- **Type-Safe** - Full TypeScript + Python type hints
- **Responsive Design** - Mobile-first UI with Tailwind CSS
- **Professional Color Scheme** - Yellow/Navy branding (Doyo.ca inspired)
- **Database Vectors** - PostgreSQL + pgvector for AI embeddings
- **Testing** - Comprehensive test coverage (pytest + Jest)
- **Docker Ready** - Easy deployment with Docker Compose
- **Vercel Optimized** - Frontend built for Vercel deployment

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────┐
│            User Browser (Web/Mobile)              │
└────────────────────┬─────────────────────────────┘
                     │ HTTP/WebSocket
                     │
        ┌────────────▼──────────────┐
        │   Nginx Reverse Proxy     │
        │     (Production Only)     │
        └────────────┬──────────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
┌───▼───────┐  ┌────▼─────┐  ┌──────▼──────┐
│  Next.js  │  │  Django  │  │   FastAPI   │
│ Frontend  │  │   REST   │  │    RAG      │
│ :3000     │  │   API    │  │  :8001      │
├───────────┤  │ :8000    │  └─────────────┘
│ React 19  │  ├──────────┤
│ TypeScript│  │ Django 5 │
│ Tailwind  │  │ DRF      │
│ Zustand   │  │ Channels │
└───────────┘  │ Celery   │
               └────┬─────┘
                    │
        ┌───────────┴──────────┐
        │                      │
    ┌───▼────────┐         ┌──▼────────┐
    │ PostgreSQL │         │   Redis   │
    │     16     │         │     7     │
    │ + pgvector │         │           │
    └────────────┘         └───────────┘
```

| Service | Tech | Port | Purpose |
|---------|------|------|---------|
| **Frontend** | Next.js 15, React 19, TypeScript | 3000 | Web UI & PWA |
| **Backend** | Django 5, DRF, Channels | 8000 | REST API, WebSockets |
| **AI Service** | FastAPI, OpenAI GPT-4o | 8001 | Chat & RAG |
| **Database** | PostgreSQL 16 + pgvector | 5432 | Data & Vectors |
| **Cache** | Redis 7 | 6379 | Sessions, Tasks |
| **Proxy** | Nginx | 80/443 | Request routing (prod) |

---

## 🚀 Quick Start

### Prerequisites
- **Docker Desktop** (recommended)
- **PostgreSQL 14+** & **Redis 7+** (for local development)
- **Python 3.11+** & **Node.js 20+**
- **Git**

### Option A: Docker (Recommended) 🐳

```bash
# Clone
git clone https://github.com/radinamri79/sorooshx-doyo.git
cd sorooshx-doyo

# Setup
cp .env.example .env
docker-compose up -d

# Initialize
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py seed_categories
docker-compose exec backend python manage.py seed_providers

# Access
# Frontend: http://localhost
# API: http://localhost/api
# Admin: http://localhost/admin
```

### Option B: Local Development 

See [DEVELOPMENT.md](DEVELOPMENT.md) for complete local setup instructions.

```bash
# Setup database
psql -U postgres << EOF
CREATE USER doyo WITH PASSWORD 'doyo';
CREATE DATABASE doyo OWNER doyo;
EOF

# Backend
cd backend
source ../.venv/bin/activate
pip install -r requirements/base.txt
export $(grep -v '^#' ../.env.local | xargs)
python manage.py migrate
python manage.py runserver

# Frontend (new terminal)
cd frontend
npm install
npm run dev

# Access
# Frontend: http://localhost:3000
# API: http://localhost:8000/api
```

---

## 📁 Project Structure

```
sorooshx-doyo/
├── backend/                    # Django 5 REST API
│   ├── config/                # Settings & configuration
│   │   └── settings/
│   │       ├── base.py       # Shared settings
│   │       ├── dev.py        # Development
│   │       ├── prod.py       # Production
│   │       └── test.py       # Testing
│   ├── apps/                  # Django applications
│   │   ├── users/            # User management & auth
│   │   ├── providers/        # Service providers
│   │   ├── orders/           # Order management
│   │   ├── conversations/    # Chat/messaging
│   │   ├── reviews/          # Reviews & ratings
│   │   └── notifications/    # Notifications
│   ├── utils/                # Shared utilities
│   ├── requirements/         # Python dependencies
│   └── manage.py
│
├── frontend/                   # Next.js 15 React app
│   ├── src/
│   │   ├── app/              # Pages & routing
│   │   ├── components/       # Reusable components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities & API client
│   │   ├── stores/           # Zustand state
│   │   ├── types/            # TypeScript types
│   │   └── styles/           # Global styles
│   ├── package.json
│   └── tsconfig.json
│
├── service-rag/               # FastAPI AI service
│   ├── main.py
│   ├── routers/
│   └── requirements.txt
│
├── nginx/                     # Reverse proxy config
├── scripts/                   # Setup scripts
├── docs/                      # Documentation
├── docker-compose.yml
├── .env.example              # Environment template
├── .editorconfig
├── Makefile
├── DEVELOPMENT.md            # Setup guide
├── CONTRIBUTING.md           # Contribution guide
└── README.md                 # This file
```

---

## 📚 Documentation

- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Local development setup & common tasks
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute to the project
- **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)** - Community guidelines
- **[docs/PROJECT_PLAN.md](docs/PROJECT_PLAN.md)** - Architecture & design
- **[docs/IMPLEMENTATION_SUMMARY.md](docs/IMPLEMENTATION_SUMMARY.md)** - What's built
- **[docs/TEST_RESULTS.md](docs/TEST_RESULTS.md)** - Test coverage & results

---

## 🛠️ Development Commands

### General
```bash
make help              # Show all commands
make up                # Start all services
make down              # Stop all services
make logs              # View all logs
make clean             # Remove containers & volumes
```

### Backend
```bash
make migrate           # Run Django migrations
make createsuperuser   # Create admin user
make seed              # Seed database with test data
make test              # Run pytest
make shell             # Django interactive shell
make format            # Format code (black)
make lint              # Check code style (flake8)
```

### Frontend
```bash
npm run dev            # Development server with hot reload
npm run build          # Build for production
npm run start          # Start production server
npm test               # Run Jest tests
npm run lint           # Check code style
```

---

## 🔑 Key API Endpoints

### Authentication
```
POST   /api/auth/register/          # User registration
POST   /api/auth/login/             # Login
POST   /api/auth/logout/            # Logout
POST   /api/auth/refresh/           # Refresh token
GET    /api/auth/user/              # Current user profile
```

### Providers
```
GET    /api/providers/              # List all providers
GET    /api/providers/{id}/         # Get provider detail
GET    /api/providers/search/       # Search providers
GET    /api/categories/             # Service categories
```

### Orders
```
POST   /api/orders/                 # Create order
GET    /api/orders/                 # List user's orders
GET    /api/orders/{id}/            # Order detail
PUT    /api/orders/{id}/            # Update order
DELETE /api/orders/{id}/            # Cancel order
```

### Chat
```
WS     /ws/chat/{conversation_id}/  # WebSocket chat
GET    /api/conversations/          # List conversations
POST   /api/conversations/          # Create conversation
POST   /api/messages/               # Send message
```

### AI Chat
```
POST   /rag/chat                    # AI chat endpoint
```

---

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
pytest

# Run specific test
pytest apps/users/tests/test_models.py::TestCustomUser

# With coverage report
pytest --cov=apps --cov-report=html
```

**Test Results:**
- ✅ 18 backend API tests passing
- ✅ 1 service-rag test passing
- ✅ 11 frontend pages building with 0 errors

### Frontend Tests
```bash
# Run Jest tests
npm test

# With coverage
npm test -- --coverage
```

---

## 🌐 Environment Variables

### Backend (`.env`)
```env
# Database
DB_NAME=doyo
DB_USER=doyo
DB_PASSWORD=doyo
DB_HOST=localhost
DB_PORT=5432

# Redis
REDIS_URL=redis://localhost:6379/0

# Django
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=False
ALLOWED_HOSTS=localhost,example.com

# Authentication
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret

# AI
OPENAI_API_KEY=sk-your-openai-key
OPENAI_MODEL=gpt-4o
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXT_PUBLIC_RAG_URL=http://localhost:8001/rag
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

---

## 🚢 Deployment

### Vercel (Frontend)
```bash
# Auto-deployed on push to main
git push origin main
# Visit: https://doyo.vercel.app
```

### AWS/Heroku/Railway (Backend)
```bash
# Use docker-compose.yml for deployment
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔐 Security

- **Passwords:** Never committed; use `.env.local` (gitignored)
- **Secrets:** All API keys in environment variables
- **CORS:** Configured for specific origins
- **HTTPS:** Required in production
- **Rate Limiting:** Implemented on API endpoints
- **JWT:** Secure token-based authentication
- **CSRF Protection:** Enabled on all POST endpoints

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for:
- How to set up development environment
- Code style guidelines
- Testing requirements
- Pull request process
- Reporting issues

---

## 📄 License

This project is private. All rights reserved. See individual files for details.

---

## 👥 Team

- **Radinatomy** - Project Lead & Full-Stack Developer

---

## 📞 Support

- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions
- **Email:** support@doyo.io

---

## 🙏 Acknowledgments

- Built with [Django](https://www.djangoproject.com/) & [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- State management with [Zustand](https://zustand.docs.pmnd.rs/)
- API docs with [DRF](https://www.django-rest-framework.org/)
- Deployment with [Docker](https://www.docker.com/) & [Vercel](https://vercel.com/)

---

## 📈 Status

- ✅ Core API: Fully functional
- ✅ Frontend: Production ready
- ✅ Authentication: Implemented
- ✅ Payments: Ready for integration
- ✅ AI Chat: Functional (requires API key)
- 🟡 Analytics: Planned
- 🟡 Mobile App: Planned

---

**Last Updated:** February 25, 2026  
**Version:** 1.0.0 (Ready for Release)

