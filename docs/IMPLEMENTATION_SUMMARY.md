# Implementation Summary

## Overview

**Doyo** is a fully implemented AI-powered service marketplace platform connecting users with professional service providers through an intelligent chat assistant. The codebase consists of three main services running in a Docker Compose stack with Nginx reverse proxy.

| Service | Framework | Port | Role |
|---------|-----------|------|------|
| Backend | Django 5 + DRF | 8000 | REST API, WebSocket, Celery |
| Frontend | Next.js 15 | 3000 | PWA, responsive UI |
| Service-RAG | FastAPI | 8001 | AI chat with OpenAI GPT-4o |

**Infrastructure**: PostgreSQL 16 + pgvector, Redis 7 (3 databases), Celery worker, Nginx reverse proxy, Docker Compose (8 services).

---

## Architecture

```
Users → Nginx → ┌─ Next.js (port 3000)
                 ├─ Django (port 8000) ←→ PostgreSQL + Redis
                 └─ FastAPI/RAG (port 8001) → OpenAI API
```

- **WebSocket**: Django Channels via Daphne ASGI server
  - `ws://host/ws/chat/{conversation_id}/` → Real-time chat
  - `ws://host/ws/notifications/` → Push notifications
- **Task Queue**: Celery with Redis broker (db/1)
- **Cache**: Django Redis cache (db/2)
- **Channel Layer**: Redis (db/0)

---

## Backend (Django 5)

### Authentication
- **dj-rest-auth + django-allauth**: Email/password + Google OAuth
- **JWT**: SimpleJWT — 60min access token, 7-day refresh, auto-rotation
- **Cookie auth**: `doyo-auth` / `doyo-refresh` HttpOnly cookies

### Apps

#### Users (`backend/apps/users/`)
| Model | Key Fields |
|-------|------------|
| CustomUser | UUID pk, email (unique), username, phone, is_provider, auth_provider (email/google), avatar |
| UserProfile | 1:1 with user, bio, preferred_language (auto-created via signal) |
| UserAddress | FK to user, label (home/work/other), full address fields, lat/lng, is_default |

**API**: `GET/PUT /api/users/me/`, CRUD `/api/users/addresses/`

#### Providers (`backend/apps/providers/`)
| Model | Key Fields |
|-------|------------|
| ServiceCategory | UUID pk, name, slug (unique), description, icon, parent (self-FK for hierarchy), display_order |
| Provider | 1:1 with user, business_name, description, city, years_experience, is_verified, average_rating, total_reviews, total_orders |
| ProviderService | FK to provider + category, title, description, price, duration_minutes, pricing_type |
| PortfolioItem | FK to provider, title, description, image |
| WorkSchedule | FK to provider, day_of_week (0-6), start/end time, is_available |

**API**: List/Detail for categories, providers, services, portfolio, schedules  
**Filtering**: By category, city, rating range, price range, search text  
**Management Commands**: `seed_categories` (20 categories × 3 subcategories = 80 total), `seed_providers` (12 providers × 3 services each)

#### Orders (`backend/apps/orders/`)
| Model | Key Fields |
|-------|------------|
| Order | UUID pk, FK to user, provider, service, category; price, description, address, scheduled_date; status with state machine |
| OrderStatusLog | FK to order, from_status, to_status, changed_by, notes, timestamp |

**Status Machine**:
```
pending → accepted, rejected, cancelled
accepted → in_progress, cancelled
in_progress → completed, cancelled
completed → reviewed
```

**Signals**: Auto-updates provider `total_orders` count on order status changes

#### Conversations (`backend/apps/conversations/`)
| Model | Key Fields |
|-------|------------|
| Conversation | UUID pk, type (ai_chat/direct/order), participants (M2M), title, is_archived |
| Message | UUID pk, FK to conversation, sender (nullable for AI), role (user/ai/system), content, message_type |
| MessageAttachment | FK to message, file, file_type, file_size |

**WebSocket Consumer**: `ChatConsumer` — handles real-time messaging, broadcasts to group  
**Actions**: `start_ai_chat` creates new AI conversation, `messages` returns paginated history

#### Reviews (`backend/apps/reviews/`)
| Model | Key Fields |
|-------|------------|
| Review | UUID pk, 1:1 with order, FK to reviewer + provider, rating (1-5), title, comment |
| ReviewResponse | UUID pk, 1:1 with review, FK to provider, response_text |

**Signals**: Auto-updates provider `average_rating` and `total_reviews` via `post_save`/`post_delete`  
**Action**: `respond` endpoint for provider to reply to reviews

#### Notifications (`backend/apps/notifications/`)
| Model | Key Fields |
|-------|------------|
| Notification | UUID pk, FK to recipient, type (9 choices), title, message, data (JSON), is_read |

**9 Types**: order_created, order_accepted, order_rejected, order_completed, order_cancelled, new_message, new_review, review_response, system  
**Celery Task**: `send_notification_task` creates notification + broadcasts via channel layer  
**WebSocket Consumer**: `NotificationConsumer` — pushes real-time notifications  
**Actions**: `mark_read`, `mark_all_read`, `unread_count`

### Settings
- **base.py**: Core config (DB, Redis, JWT, CORS, REST Framework, Celery, Channels)
- **dev.py**: Debug=True, debug_toolbar, wildcard ALLOWED_HOSTS
- **test.py**: SQLite in-memory, InMemoryChannelLayer, eager Celery, MD5 password hasher
- **prod.py**: (to be created for production deployment)

### URL Structure
```
/admin/                         → Django Admin
/api/auth/                      → dj-rest-auth (login, logout, refresh)
/api/auth/registration/         → dj-rest-auth registration
/api/auth/social/               → allauth social (Google OAuth)
/api/users/                     → User profile, addresses
/api/providers/                 → Providers, categories, services
/api/orders/                    → Orders CRUD + status updates
/api/conversations/             → Conversations, messages, AI chat
/api/reviews/                   → Reviews + provider responses
/api/notifications/             → Notifications, mark read, unread count
```

---

## Frontend (Next.js 15)

### Tech Stack
- **Next.js 15** with App Router, React 19
- **TypeScript** in strict mode
- **Tailwind CSS** 3.4 with custom primary color palette
- **Zustand** 5 for state management (auth + notifications stores)
- **lucide-react** for icons

### Pages (11 routes)

| Route | Page | Key Features |
|-------|------|-------------|
| `/` | Landing | Hero section, feature cards, CTA buttons |
| `/auth/login` | Login | Email/password form, Google OAuth link |
| `/auth/register` | Register | Account creation form |
| `/chat` | AI Chat | Real-time AI chat via RAG API, message bubbles |
| `/providers` | Providers List | Grid with search, category filter, rating |
| `/providers/[id]` | Provider Detail | Services, schedule, portfolio, reviews |
| `/orders` | Orders List | Status badges, provider info |
| `/orders/[id]` | Order Detail | Status timeline, action buttons, history |
| `/messages` | Conversations | Conversation list, AI chat starter |
| `/profile` | Profile | Edit name, phone, account info |

### Components
- **UI**: Button (5 variants × 3 sizes), Input (with label + error), Spinner
- **Layout**: AppShell (header + desktop sidebar + mobile bottom nav + notification badge)

### State Management
- **Auth Store** (`stores/auth.ts`): Persisted to localStorage via Zustand middleware — tokens, user, login/logout/fetchUser
- **Notification Store** (`stores/notifications.ts`): notifications list, unreadCount, fetch/mark/add actions

### API Client (`lib/api.ts`)
Single `apiFetch` helper with JWT auto-attach from `localStorage`. Modules:
- `authApi`: login, register, getMe, updateMe
- `providersApi`: list (with filters), get, categories
- `ordersApi`: list, get, create, updateStatus
- `conversationsApi`: list, get, messages, sendMessage, startAiChat
- `reviewsApi`: list, create, respond
- `notificationsApi`: list, unreadCount, markRead, markAllRead
- `ragApi`: chat

### Responsive Design
- **Mobile-first** approach with Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- **Desktop**: Sidebar navigation (hidden on mobile)
- **Mobile**: Bottom navigation bar (hidden on desktop, `md:hidden`)
- **Adaptive grids**: 1-col → 2-col → 3/4-col responsive grids
- **Flex wrapping**: Status badges, buttons, metadata rows all wrap on small screens

### Vercel Deployment
- `vercel.json`: Framework config, security headers, API rewrites to backend
- `next.config.js`: Conditional `standalone` output (Docker only), remote image patterns
- Environment variables: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WS_URL`, `NEXT_PUBLIC_RAG_URL`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

---

## Service-RAG (FastAPI)

### Architecture
```
POST /rag/chat → ChatService → OpenAI (GPT-4o with function calling)
                                ├── search_providers → Backend API
                                └── get_categories → Backend API
```

### Components
| File | Purpose |
|------|---------|
| `app/main.py` | FastAPI app with lifespan, CORS, health + chat routers at `/rag` |
| `app/config.py` | Pydantic Settings — OPENAI_API_KEY, OPENAI_MODEL, BACKEND_URL |
| `app/schemas.py` | Pydantic models: ChatMessage, ChatRequest, ChatResponse, HealthResponse |
| `app/prompts.py` | System prompt (Doyo assistant persona) + tool definitions |
| `app/services/openai_service.py` | AsyncOpenAI client, tool call loop/handler |
| `app/services/intent_classifier.py` | 7 intents via OpenAI JSON response format |
| `app/services/provider_search.py` | httpx calls to backend `/api/providers/` |
| `app/services/chat_service.py` | Top-level orchestrator combining all services |

### Intents (7)
find_provider, browse_categories, ask_question, place_order, check_order_status, general_chat, other

### Tools (Function Calling)
- `search_providers(category, city, min_rating)` → Calls backend API
- `get_categories()` → Returns available service categories

---

## Infrastructure

### Docker Compose (8 Services)
| Service | Image | Healthcheck |
|---------|-------|-------------|
| db | postgres:16-alpine | `pg_isready` |
| redis | redis:7-alpine | `redis-cli ping` |
| backend | ./backend (Dockerfile) | `curl /api/health/` |
| celery-worker | same as backend | Celery inspect |
| celery-beat | same as backend | — |
| frontend | ./frontend (Dockerfile) | `curl :3000` |
| service-rag | ./service-rag (Dockerfile) | `curl /rag/health` |
| nginx | ./nginx (Dockerfile) | `curl :80` |

### Makefile Commands
```
make up          → docker-compose up -d
make down        → docker-compose down
make build       → docker-compose build
make logs        → docker-compose logs -f
make migrate     → Run Django migrations
make seed        → Seed categories + providers
make test        → Run all tests
make lint        → Run linters (flake8, eslint)
make format      → Run formatters (black, prettier)
make clean       → Remove containers + volumes
make ps          → Show running services
```

### Nginx Routing
```
/api/*   → backend:8000
/ws/*    → backend:8000 (WebSocket upgrade)
/rag/*   → service-rag:8001
/*       → frontend:3000
```

---

## Seed Data

### Categories (20 parent categories)
Cleaning, Plumbing, Electrical, Painting, HVAC, Carpentry, Landscaping, Moving, Pest Control, Appliance Repair, Tutoring, Photography, Personal Training, Pet Care, Auto Repair, Roofing, Interior Design, Catering, Legal Services, Accounting

Each parent has 3 sub-categories → **80 total categories**

### Providers (12 seeded)
Each provider has 3 services, business info, work schedules, and category assignments.

---

## Testing

### Backend (18 tests — all passing)
| App | Tests | Coverage |
|-----|-------|----------|
| Users | 3 | User creation, profile signal, str method |
| Providers | 3 | Category creation, hierarchy, provider creation |
| Orders | 3 | Status transitions (pending, accepted, completed) |
| Conversations | 2 | AI conversation creation, message creation |
| Reviews | 1 | Rating signal auto-update on review |
| Notifications | 6 | Model CRUD, ordering, defaults, view auth (unread_count, mark_all_read) |

### Service-RAG (1 test — passing)
- Health endpoint returns 200 with status "healthy"

### Frontend (build verified)
- **11 pages** compiled successfully
- **0 TypeScript errors**
- Static generation for 9 pages, dynamic rendering for 2 (`/orders/[id]`, `/providers/[id]`)

---

## Environment Variables

```bash
# Database (individual vars used by Django settings)
DB_NAME=doyo
DB_USER=doyo
DB_PASSWORD=doyo
DB_HOST=db
DB_PORT=5432

# Redis
REDIS_URL=redis://redis:6379/0
CELERY_BROKER_URL=redis://redis:6379/1
CELERY_RESULT_BACKEND=redis://redis:6379/1

# Django
DJANGO_SECRET_KEY=<change-in-production>
DJANGO_DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Auth
GOOGLE_CLIENT_ID=<google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<google-oauth-secret>

# OpenAI
OPENAI_API_KEY=<openai-api-key>
OPENAI_MODEL=gpt-4o

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXT_PUBLIC_RAG_URL=http://localhost:8001/rag
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<google-client-id>

# Service-RAG
BACKEND_URL=http://backend:8000/api
```

---

## Project Structure

```
sorooshx-doyo/
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Makefile
├── README.md
├── docs/
│   ├── PROJECT_PLAN.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   └── TEST_RESULTS.md
├── backend/
│   ├── Dockerfile
│   ├── manage.py
│   ├── requirements/{base,dev,prod,test}.txt
│   ├── config/{settings/,urls.py,asgi.py,wsgi.py,celery.py,routing.py}
│   ├── apps/
│   │   ├── users/{models,views,serializers,signals,admin,permissions,urls,tests,management}/
│   │   ├── providers/{models,views,serializers,filters,admin,urls,tests,management}/
│   │   ├── orders/{models,views,serializers,signals,admin,urls,tests}/
│   │   ├── conversations/{models,views,serializers,consumers,routing,admin,urls,tests}/
│   │   ├── reviews/{models,views,serializers,signals,admin,urls,tests}/
│   │   └── notifications/{models,views,serializers,consumers,routing,tasks,admin,urls,tests}/
│   └── utils/{pagination,permissions,mixins,decorators}.py
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.js
│   ├── vercel.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── app/{page,layout,auth,chat,providers,orders,messages,profile}/
│       ├── components/{ui/,layout/}
│       ├── stores/{auth,notifications}.ts
│       ├── hooks/useWebSocket.ts
│       ├── lib/{api,utils}.ts
│       ├── types/index.ts
│       └── styles/globals.css
├── service-rag/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/{main,config,schemas,prompts}.py
│       └── services/{openai,intent_classifier,provider_search,chat_service}.py
├── nginx/{Dockerfile,nginx.conf}
└── scripts/{setup,seed_database}.sh
```

---

## Key Design Decisions

1. **AI-first UX**: Users chat with AI assistant instead of browsing categories
2. **Microservice RAG**: Separated AI logic from Django for independent scaling
3. **Function calling**: Structured OpenAI tool calls (no SQL generation, no hallucination risk)
4. **JWT + Cookies**: HttpOnly cookies for security, localStorage fallback for SPA
5. **State machine orders**: Linear status flow with transition validation
6. **Real-time via Channels**: Redis-backed WebSocket for chat + notifications
7. **Monorepo + Docker Compose**: Single repo, one-command dev environment
8. **Mobile-first PWA**: Installable web app, responsive design, offline shell

---

## What's Next (v1.5 / v2)

- [ ] Provider self-registration portal
- [ ] Payment integration (Stripe / Zarinpal)
- [ ] Image upload in chat (GPT Vision)
- [ ] pgvector semantic search for providers
- [ ] PWA manifest + service worker
- [ ] Push notifications (FCM)
- [ ] Map integration for provider coverage
- [ ] Rate limiting on auth endpoints
- [ ] Production deployment guide (AWS ECS / Vercel)
