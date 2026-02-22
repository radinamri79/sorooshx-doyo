# Doyo — Service Marketplace Platform

A modern, AI-powered service marketplace connecting users with professional service providers through an intelligent chat assistant. Built as a scalable, full-stack application with Next.js PWA frontend, Django REST API backend, and a dedicated Python Service-RAG microservice for AI conversations.

**Project Status**: Phase 1 (Planning & Architecture) | **Version**: 1.0.0-plan

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Implementation Roadmap](#implementation-roadmap)
- [API Endpoints](#api-endpoints)
- [Environment Setup](#environment-setup)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Verification & Testing](#verification--testing)
- [Design Decisions](#design-decisions)
- [Roadmap (Future)](#roadmap-future)

---

## Overview

**Doyo** is a two-flow marketplace platform designed with users first:

### Flow 1: Users (v1 Priority)
1. **User Registration & Auth**: Email/password or Google OAuth
2. **AI Chat Assistant**: User describes their service need in natural language (text + images)
3. **Intelligent Service Matching**: AI gathers requirements, searches provider database, presents top matches
4. **Provider Selection & Ordering**: User selects provider, confirms order details
5. **Order Fulfillment**: Direct messaging with provider, real-time status updates
6. **Review & Feedback**: Post-completion review and rating system

### Flow 2: Providers (Future)
Service providers will register their credentials, services, availability, location, rates, and portfolio. This flow is deferred to Phase 2.

**Core Innovation**: Instead of browsing category lists and filters, users simply chat with an intelligent assistant that understands context, gathers information naturally, and recommends providers—making the experience as easy as messaging a friend.

---

## Key Features

### For Users (v1)
- ✅ **Two Authentication Methods**: Email/password (username-based) + Google OAuth
- ✅ **AI-Powered Chat Interface**: Chat with a smart assistant that understands service requests
- ✅ **Image Upload in Chat**: Upload photos of problems (e.g., broken pipe, electrical issue) for AI analysis
- ✅ **Intelligent Provider Discovery**: pgvector semantic search + rule-based filtering
- ✅ **Rich Conversation UI**: Inline provider cards, order summary cards, streaming responses
- ✅ **User Profile Management**: Save personal info (name, phone, addresses) for quick reuse
- ✅ **Multiple Service Addresses**: Home, work, or custom locations
- ✅ **Order Lifecycle Management**: Request → Accepted → In Progress → Completed → Reviewed
- ✅ **Real-Time Direct Messaging**: WebSocket-based chat with matched provider
- ✅ **Phone Number Visibility**: Phone numbers revealed after provider acceptance
- ✅ **Star Rating & Reviews**: Rate providers and leave feedback post-completion
- ✅ **PWA Support**: Install as mobile app, offline basic shell
- ✅ **Mobile-First Design**: Responsive UI optimized for mobile-first UX
- ✅ **Conversation History**: Access past conversations and orders anytime

### For Service Providers (v2)
- Self-registration and onboarding
- Profile & portfolio management
- Service category and pricing setup
- Availability calendar and working hours
- Order acceptance/rejection workflow
- Service completion and customer communication
- Earnings dashboard and reviews management

### Admin Features
- Django Admin interface for managing users, providers, categories, orders
- Seed data management and category administration
- User and provider verification workflows

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   USERS / BROWSERS / MOBILE              │
└────────────────┬─────────────────────────────────────────┘
                 │
                 │ HTTP + WebSocket
                 ▼
┌─────────────────────────────────────────────────────────┐
│              NGINX (Reverse Proxy)                       │
│  Routing: /api/* → Django, /rag/* → Service-RAG        │
│           /* → Next.js, /ws/* → WebSocket handler       │
└────────────────┬─────────────────────────────────────────┘
                 │
        ┌────────┼────────┐
        │        │        │
        ▼        ▼        ▼
    ┌───────┐ ┌────────┐ ┌──────────────┐
    │  Next │ │ Django │ │ Service-RAG  │
    │  .js  │ │ (REST) │ │ (FastAPI)    │
    │  PWA  │ │        │ │              │
    └───────┘ └───┬────┘ └──────┬───────┘
                  │             │
                  │   ┌─────────┘
                  │   │
        ┌─────────┼───┼───────────┐
        │         │   │           │
        ▼         ▼   ▼           ▼
    ┌──────────────────┐      ┌──────────┐
    │   PostgreSQL     │      │  Redis   │
    │   + pgvector     │      │ (Channels│
    └──────────────────┘      │  Cache)  │
                              └──────────┘
                                   ▲
                                   │
                              ┌────┴────┐
                              │         │
                          ┌────────┐ ┌──────────┐
                          │ Celery │ │ Websocket│
                          │Worker  │ │Layer     │
                          └────────┘ └──────────┘

                          ┌──────────────────┐
                          │   OpenAI API     │
                          │   (GPT-4o+)      │
                          └──────────────────┘
```

### Service Responsibilities

- **Next.js Frontend**: User interface, real-time messaging UI, PWA shell, authentication flow
- **Django Backend**: REST API, user/provider management, order lifecycle, WebSocket handling, database ORM
- **Service-RAG**: AI conversation logic, OpenAI integration, function calling handlers, provider search orchestration
- **PostgreSQL**: Primary data store with pgvector for semantic search
- **Redis**: Channels layer (WebSocket broadcast), cache, Celery message broker
- **Celery**: Async tasks (notifications, email, bulk operations)
- **Nginx**: Request routing, SSL termination, static file serving

---

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios or native Fetch
- **Real-time**: WebSocket (native) or Socket.io-client
- **PWA**: next-pwa, manifest.json, service worker
- **Testing**: Jest, React Testing Library
- **Build**: Vercel's next build, optimized for static/server components

### Backend
- **Framework**: Django 5.x, Django REST Framework (DRF)
- **Real-time**: Django Channels (WebSocket), Redis as channel layer
- **Authentication**: dj-rest-auth, django-allauth (Google OAuth)
- **ORM**: Django ORM with PostgreSQL
- **Task Queue**: Celery + Redis broker
- **Notifications**: django-notifications, websocket broadcast
- **Admin**: Django Admin (customized)
- **API Documentation**: DRF browsable API, OpenAPI schema
- **Testing**: pytest-django, factory-boy
- **Server**: Gunicorn (HTTP), Daphne (ASGI for Channels)

### Service-RAG (AI Microservice)
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **LLM Integration**: OpenAI SDK (function calling, vision API)
- **Data**: pgvector-python for embedding queries, SQLAlchemy ORM
- **Async**: asyncio, httpx
- **Validation**: Pydantic v2
- **Server**: Uvicorn
- **Testing**: pytest, httpx TestClient

### Database
- **DBMS**: PostgreSQL 16
- **Extensions**: pgvector (semantic search)
- **Migrations**: Django Migrations
- **ORM**: Django ORM (Python), SQLAlchemy (Service-RAG)

### Infrastructure
- **Containerization**: Docker, Docker Compose
- **Orchestration**: Docker Compose (local), ECS (AWS prod)
- **Reverse Proxy**: Nginx
- **Cache/Broker**: Redis
- **Object Storage**: AWS S3
- **Deployment**: AWS (ECS, RDS, ElastiCache, S3, CloudFront)

### Development Tools
- **Version Control**: Git
- **IDE**: VS Code (recommended)
- **Package Managers**: npm/pnpm (frontend), pip (backend/RAG)
- **Code Quality**: ESLint, Prettier (frontend), Black, flake8 (backend)
- **Testing**: Jest/RTL, pytest, k6 (load testing)
- **API Testing**: Postman, Thunder Client

---

## Project Structure

```
doyo/
├── .gitignore
├── .env.example                    # Template environment variables
├── docker-compose.yml              # Local development services
├── docker-compose.prod.yml         # Production configuration (optional)
├── Makefile                        # Development convenience commands
├── README.md                       # This file
│
├── frontend/                       # Next.js PWA Application
│   ├── .gitignore
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   │
│   ├── public/
│   │   ├── manifest.json           # PWA manifest
│   │   ├── robots.txt
│   │   ├── icons/                  # App icons (192x192, 512x512, favicon)
│   │   └── sw.js                   # Service worker (next-pwa)
│   │
│   └── src/
│       ├── app/
│       │   ├── layout.tsx          # Root layout with providers, navbar
│       │   ├── page.tsx            # Landing/redirect to /chat
│       │   ├── not-found.tsx
│       │   │
│       │   ├── (auth)/             # Route group: no navbar
│       │   │   ├── layout.tsx
│       │   │   ├── login/page.tsx  # Email + password or Google login
│       │   │   ├── register/page.tsx # Email + password registration
│       │   │   └── callback/page.tsx # Google OAuth callback handler
│       │   │
│       │   ├── chat/               # Main AI chat feature
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx        # Chat list + new conversation
│       │   │   └── [conversationId]/page.tsx # Chat detail (streaming)
│       │   │
│       │   ├── providers/          # Browse/search service providers
│       │   │   ├── page.tsx        # Provider list (search, filter)
│       │   │   └── [id]/page.tsx   # Provider profile (portfolio, reviews, rates)
│       │   │
│       │   ├── orders/             # User's service requests
│       │   │   ├── page.tsx        # Orders list with status
│       │   │   └── [id]/page.tsx   # Order detail (timeline, messaging, actions)
│       │   │
│       │   ├── profile/            # User account & settings
│       │   │   └── page.tsx        # Edit profile, manage addresses
│       │   │
│       │   └── messages/           # Direct messaging (user-provider)
│       │       ├── page.tsx        # Conversations list
│       │       └── [conversationId]/page.tsx # Direct message thread
│       │
│       ├── components/
│       │   ├── ui/                 # Reusable UI components
│       │   │   ├── Button.tsx
│       │   │   ├── Card.tsx
│       │   │   ├── Input.tsx
│       │   │   ├── Modal.tsx
│       │   │   ├── Skeleton.tsx     # Loading placeholder
│       │   │   ├── Badge.tsx
│       │   │   ├── Select.tsx
│       │   │   ├── Tabs.tsx
│       │   │   └── ...
│       │   │
│       │   ├── chat/               # Chat-specific components
│       │   │   ├── MessageBubble.tsx      # Text/image/system message
│       │   │   ├── ProviderCard.tsx       # Inline provider recommendation card
│       │   │   ├── OrderSummaryCard.tsx   # Order preview + confirm button
│       │   │   ├── ChatInput.tsx          # Message input with image upload
│       │   │   ├── TypingIndicator.tsx
│       │   │   └── ChatSidebar.tsx        # Conversation history
│       │   │
│       │   ├── providers/          # Provider-related components
│       │   │   ├── ProviderCard.tsx       # Provider card for lists
│       │   │   ├── ProviderHeader.tsx
│       │   │   ├── PortfolioGallery.tsx
│       │   │   ├── ReviewsList.tsx
│       │   │   ├── RatingStars.tsx
│       │   │   └── ...
│       │   │
│       │   ├── orders/             # Order-related components
│       │   │   ├── OrderStatus.tsx        # Visual status badge
│       │   │   ├── OrderTimeline.tsx      # Status timeline
│       │   │   ├── OrderActions.tsx       # Cancel/confirm buttons
│       │   │   └── ...
│       │   │
│       │   └── layout/             # Layout components
│       │       ├── Navbar.tsx       # Top navigation
│       │       ├── Sidebar.tsx      # Desktop sidebar (if applicable)
│       │       ├── BottomNav.tsx    # Mobile bottom navigation
│       │       └── Footer.tsx
│       │
│       ├── hooks/                  # Custom React hooks
│       │   ├── useAuth.ts          # Auth context & user state
│       │   ├── useChat.ts          # Chat conversation logic
│       │   ├── useWebSocket.ts     # WebSocket management
│       │   ├── useApi.ts           # API client wrapper
│       │   ├── useLocalStorage.ts  # Persist user preferences
│       │   └── ...
│       │
│       ├── lib/
│       │   ├── apiClient.ts        # Axios instance with interceptors
│       │   ├── wsManager.ts        # WebSocket connection manager
│       │   ├── deviceDetection.ts  # Mobile/desktop detection
│       │   ├── imageCompression.ts # Compress images before upload
│       │   ├── validators.ts       # Form validation schemas
│       │   └── utils.ts            # General utilities
│       │
│       ├── stores/                 # Zustand state stores
│       │   ├── authStore.ts        # User auth state
│       │   ├── chatStore.ts        # Chat conversations & messages
│       │   ├── uiStore.ts          # UI state (modals, toasts, theme)
│       │   ├── notificationStore.ts # Real-time notifications
│       │   └── ...
│       │
│       ├── types/
│       │   ├── index.ts            # Global types
│       │   ├── auth.ts
│       │   ├── conversation.ts
│       │   ├── provider.ts
│       │   ├── order.ts
│       │   └── api.ts              # API response types
│       │
│       ├── styles/
│       │   ├── globals.css         # Global tailwind imports
│       │   └── theme.css           # Custom theme variables
│       │
│       └── config/
│           └── constants.ts        # API URLs, feature flags, etc.
│
├── backend/                        # Django REST API
│   ├── .gitignore
│   ├── Dockerfile
│   ├── requirements/
│   │   ├── base.txt               # Common dependencies
│   │   ├── dev.txt                # Development extras
│   │   └── prod.txt               # Production extras
│   │
│   ├── manage.py
│   │
│   ├── config/                    # Django project configuration
│   │   ├── __init__.py
│   │   ├── settings/
│   │   │   ├── __init__.py
│   │   │   ├── base.py            # Common settings
│   │   │   ├── dev.py             # Development overrides
│   │   │   └── prod.py            # Production overrides
│   │   ├── urls.py                # Root URL config
│   │   ├── asgi.py                # Channels ASGI config
│   │   ├── wsgi.py
│   │   ├── celery.py
│   │   └── routing.py             # WebSocket routing
│   │
│   ├── apps/
│   │   ├── users/                 # User management
│   │   │   ├── __init__.py
│   │   │   ├── models.py          # CustomUser, UserProfile, UserAddress
│   │   │   ├── serializers.py
│   │   │   ├── views.py           # CRUD views
│   │   │   ├── urls.py
│   │   │   ├── admin.py           # Django Admin customization
│   │   │   ├── signals.py         # Post-save signals
│   │   │   ├── permissions.py
│   │   │   ├── tests/
│   │   │   └── management/commands/
│   │   │
│   │   ├── providers/             # Service provider profiles
│   │   │   ├── __init__.py
│   │   │   ├── models.py          # Provider, ServiceCategory, ProviderService, PortfolioItem, WorkSchedule
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   ├── filters.py         # DRF filters for search
│   │   │   ├── admin.py
│   │   │   ├── tests/
│   │   │   └── tasks.py
│   │   │
│   │   ├── orders/                # Service requests & order lifecycle
│   │   │   ├── __init__.py
│   │   │   ├── models.py          # ServiceRequest, OrderStatus choices
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   ├── admin.py
│   │   │   ├── signals.py         # Status change handling
│   │   │   ├── tests/
│   │   │   └── tasks.py           # Celery: notifications, reminders
│   │   │
│   │   ├── conversations/         # Chat & direct messaging
│   │   │   ├── __init__.py
│   │   │   ├── models.py          # Conversation, Message, MessageAttachment
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   ├── consumers.py       # Channels WebSocket handlers
│   │   │   ├── routing.py         # URL route → consumer mapping
│   │   │   ├── admin.py
│   │   │   ├── tests/
│   │   │   └── tasks.py
│   │   │
│   │   ├── reviews/               # Ratings & reviews
│   │   │   ├── __init__.py
│   │   │   ├── models.py          # Review, ReviewResponse
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   ├── admin.py
│   │   │   └── tests/
│   │   │
│   │   └── notifications/         # Push & in-app notifications
│   │       ├── __init__.py
│   │       ├── models.py          # Notification
│   │       ├── consumers.py
│   │       ├── tasks.py           # Celery task to broadcast
│   │       └── ...
│   │
│   └── utils/
│       ├── __init__.py
│       ├── pagination.py
│       ├── permissions.py         # Custom DRF permission classes
│       ├── mixins.py              # ViewSet mixins
│       └── decorators.py
│
├── service-rag/                   # FastAPI Service (AI Microservice)
│   ├── .gitignore
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env.example
│   │
│   └── app/
│       ├── __init__.py
│       ├── main.py                # FastAPI application factory
│       │
│       ├── config.py              # Settings & environment
│       │
│       ├── routes/
│       │   ├── __init__.py
│       │   ├── health.py          # GET /health
│       │   ├── chat.py            # POST /chat, POST /chat/stream
│       │   └── debug.py           # Dev-only debug endpoints
│       │
│       ├── services/
│       │   ├── __init__.py
│       │   ├── chat_service.py          # Conversation orchestration
│       │   ├── openai_service.py        # OpenAI API wrapper
│       │   ├── provider_search.py       # pgvector + SQL filter search
│       │   ├── intent_classifier.py     # Classify user intent
│       │   ├── conversation_state.py    # Maintain conversation context
│       │   └── image_processor.py       # GPT Vision image analysis
│       │
│       ├── models/
│       │   ├── __init__.py
│       │   ├── conversation.py         # Pydantic models for conversation
│       │   ├── provider.py
│       │   └── order.py
│       │
│       ├── schemas/
│       │   ├── __init__.py
│       │   ├── chat.py            # ChatRequest, ChatResponse, Message
│       │   ├── provider.py
│       │   └── errors.py
│       │
│       ├── prompts/
│       │   ├── __init__.py
│       │   ├── system_prompt.py        # Doyo assistant persona
│       │   ├── information_extraction.py
│       │   └── provider_recommendation.py
│       │
│       ├── dataset/
│       │   ├── service_categories.json # Category taxonomy
│       │   └── seed_providers.json     # Sample provider data (seeded to DB)
│       │
│       ├── scripts/
│       │   ├── seed_db.py         # Populate PostgreSQL from seed data
│       │   ├── generate_embeddings.py # Create provider embeddings -> pgvector
│       │   └── cleanup.py         # Utility scripts
│       │
│       ├── utils/
│       │   ├── __init__.py
│       │   ├── embeddings.py      # OpenAI embeddings wrapper
│       │   ├── validators.py
│       │   └── logger.py
│       │
│       └── tests/
│           ├── __init__.py
│           ├── test_chat_service.py
│           ├── test_provider_search.py
│           └── ...
│
├── nginx/
│   ├── Dockerfile
│   └── nginx.conf               # Routing config
│
└── scripts/
    ├── setup.sh                 # One-time setup script
    ├── seed_database.sh         # Seed initial data
    └── deploy.sh                # Deployment helper (optional)
```

### Directory Naming Conventions
- **App folders** (users, providers, orders): Plural noun (business domain, Django convention)
- **Component folders**: Descriptive, feature-focused (chat, providers, orders, layout)
- **Hook/utility files**: camelCase with `use` prefix (hooks) or descriptive names (lib)
- **Type/interface files**: camelCase with `.ts` extension

---

## Database Schema

### Users App

#### CustomUser (extends Django AbstractUser)
```
- id: UUID (primary key)
- username: CharField(unique=True)
- email: EmailField(unique=True)
- phone_number: CharField(blank=True)
- first_name: CharField (from superclass)
- last_name: CharField (from superclass)
- password: (hashed)
- auth_provider: ChoiceField(local / google)
- is_provider: BooleanField(default=False)
- avatar: ImageField(upload_to='avatars/', blank=True)
- is_active: BooleanField(default=True)
- is_staff: BooleanField(default=False)
- is_superuser: BooleanField(default=False)
- date_joined: DateTimeField(auto_now_add=True)
- updated_at: DateTimeField(auto_now=True)
```

#### UserProfile (1:1 with CustomUser)
```
- id: UUID
- user: OneToOneField(CustomUser)
- bio: TextField(blank=True)
- preferred_language: CharField(default='en')
- updated_at: DateTimeField(auto_now=True)
```

#### UserAddress
```
- id: UUID
- user: ForeignKey(CustomUser)
- label: ChoiceField(home / work / other)
- street: CharField
- city: CharField
- state: CharField
- zip_code: CharField
- country: CharField(default='US')
- latitude: FloatField(blank=True, null=True)
- longitude: FloatField(blank=True, null=True)
- is_default: BooleanField(default=False)
- created_at: DateTimeField(auto_now_add=True)
- updated_at: DateTimeField(auto_now=True)
```

### Providers App

#### ServiceCategory (Hierarchical Taxonomy)
```
- id: UUID
- name: CharField
- slug: SlugField(unique=True)
- description: TextField
- icon: URLField or ImageField
- parent: ForeignKey(ServiceCategory, null=True, blank=True)  # For subcategories
- is_active: BooleanField(default=True)
- display_order: IntegerField
- created_at: DateTimeField(auto_now_add=True)
```

#### Provider
```
- id: UUID
- user: OneToOneField(CustomUser)
- business_name: CharField
- description: TextField
- years_of_experience: IntegerField
- phone_number: CharField
- is_verified: BooleanField(default=False)
- verification_date: DateTimeField(blank=True, null=True)
- rating_avg: FloatField(default=0.0)  # Aggregated star rating
- review_count: IntegerField(default=0)
- total_jobs_completed: IntegerField(default=0)
- hourly_rate: DecimalField(blank=True, null=True)
- fixed_rate_min: DecimalField(blank=True, null=True)
- fixed_rate_max: DecimalField(blank=True, null=True)
- service_radius_km: IntegerField(default=25)  # Service coverage area
- created_at: DateTimeField(auto_now_add=True)
- updated_at: DateTimeField(auto_now=True)
```

#### ProviderService
```
- id: UUID
- provider: ForeignKey(Provider)
- category: ForeignKey(ServiceCategory)
- description: TextField
- pricing_type: ChoiceField(hourly / fixed / quote)
- price: DecimalField(null=True, blank=True)
- preparation_time_hours: IntegerField(default=1)
- created_at: DateTimeField(auto_now_add=True)
```

#### PortfolioItem
```
- id: UUID
- provider: ForeignKey(Provider)
- title: CharField
- description: TextField
- image: ImageField(upload_to='portfolio/')
- created_at: DateTimeField(auto_now_add=True)
```

#### WorkSchedule
```
- id: UUID
- provider: ForeignKey(Provider)
- day_of_week: IntegerField(0=Monday, 6=Sunday)
- start_time: TimeField
- end_time: TimeField
- is_available: BooleanField(default=True)
- created_at: DateTimeField(auto_now_add=True)
```

### Orders App

#### ServiceRequest
```
- id: UUID
- user: ForeignKey(CustomUser)
- provider: ForeignKey(Provider, null=True, blank=True)  # Null until accepted
- category: ForeignKey(ServiceCategory)
- conversation: ForeignKey(Conversation)  # AI conversation that created this order
- title: CharField
- description: TextField
- address: ForeignKey(UserAddress)
- scheduled_date: DateField(null=True, blank=True)
- scheduled_time: TimeField(null=True, blank=True)
- status: ChoiceField(pending / accepted / in_progress / completed / reviewed / cancelled)
- notes: TextField(blank=True)
- created_at: DateTimeField(auto_now_add=True)
- updated_at: DateTimeField(auto_now=True)
- accepted_at: DateTimeField(null=True)
- completed_at: DateTimeField(null=True)
```

**Status Flow**:
```
pending (awaiting provider response)
  ↓
accepted (provider accepts)
  ↓
in_progress (work started)
  ↓
completed (work done, awaiting review)
  ↓
reviewed (user reviewed)

Anytime before 'completed': → cancelled
```

### Conversations App

#### Conversation
```
- id: UUID
- type: ChoiceField(ai_assistant / direct_message)
- participants: ManyToManyField(CustomUser)
- service_request: ForeignKey(ServiceRequest, blank=True, null=True)
- title: CharField(blank=True)  # For user's reference
- created_at: DateTimeField(auto_now_add=True)
- updated_at: DateTimeField(auto_now=True)
- is_archived: BooleanField(default=False)
```

#### Message
```
- id: UUID
- conversation: ForeignKey(Conversation)
- sender: ForeignKey(CustomUser, null=True, blank=True)  # Null for AI messages
- sender_role: ChoiceField(user / provider / ai_assistant / system, dynamic)
- content: TextField
- message_type: ChoiceField(text / image / system / provider_card / order_card)
- metadata: JSONField(blank=True, default=dict)  # Flexible data structure
  - For provider_card: {provider_id, name, rating, rate_range}
  - For order_card: {order_id, title, provider_name, address, total_price}
  - For system: {action, status_from, status_to}
- created_at: DateTimeField(auto_now_add=True)
```

#### MessageAttachment
```
- id: UUID
- message: ForeignKey(Message)
- file: FileField(upload_to='attachments/')
- file_type: ChoiceField(image / document / other)
- file_size: IntegerField
- uploaded_at: DateTimeField(auto_now_add=True)
```

### Reviews App

#### Review
```
- id: UUID
- service_request: OneToOneField(ServiceRequest)
- reviewer: ForeignKey(CustomUser, related_name='reviews_given')
- provider: ForeignKey(Provider, related_name='reviews_received')
- rating: IntegerField(choices=1-5)
- title: CharField
- comment: TextField
- response: OneToOneField('ReviewResponse', blank=True, null=True)  # Provider can respond
- created_at: DateTimeField(auto_now_add=True)
- updated_at: DateTimeField(auto_now=True)
```

#### ReviewResponse
```
- id: UUID
- review: OneToOneField(Review)
- provider: ForeignKey(Provider)
- response_text: TextField
- created_at: DateTimeField(auto_now_add=True)
```

---

## Implementation Roadmap

### Phase 1: Foundation & Infrastructure (Week 1)
**Goal**: Establish development environment and project skeleton.

1. **Project Initialization**
   - [ ] Create monorepo structure
   - [ ] Initialize git repository
   - [ ] Create `.env.example`
   - [ ] Write root README with quick start

2. **Docker & Database**
   - [ ] Write `docker-compose.yml` with 8 services: postgres, redis, backend, celery-worker, celery-beat, frontend, service-rag, nginx
   - [ ] PostgreSQL Dockerfile with pgvector extension
   - [ ] Verify local startup and connectivity

3. **Backend Scaffolding**
   - [ ] Django project setup (`django-admin startproject config`)
   - [ ] Custom `CustomUser` model and initial migration
   - [ ] Dev/prod settings split
   - [ ] ASGI config for Channels
   - [ ] Django Channels setup with Redis layer

4. **Frontend Scaffolding**
   - [ ] `create-next-app` with TypeScript, Tailwind, App Router
   - [ ] PWA config (manifest.json, service worker stub)
   - [ ] Zustand store setup
   - [ ] Axios API client with interceptors
   - [ ] TypeScript interfaces for core models

5. **Service-RAG Scaffolding**
   - [ ] FastAPI project with Pydantic v2
   - [ ] Basic health check endpoint
   - [ ] Config management (settings from env)

6. **Nginx Config**
   - [ ] Reverse proxy routing: `/api/*` → port 8000, `/rag/*` → port 8001, `/*` → port 3000

**Deliverables**: Full app stack runs locally with `docker-compose up`, endpoint routing verified, can hit healthchecks

---

### Phase 2: Authentication (Week 2-3)
**Goal**: Implement secure user registration and login.

7. **Backend Auth Setup**
   - [ ] Install `dj-rest-auth`, `django-allauth`, `djangorestframework`
   - [ ] Create auth app or extend users app
   - [ ] Implement JWT token generation and refresh
   - [ ] API endpoints:
     - `POST /api/auth/register/` (username, email, password)
     - `POST /api/auth/login/` (username/email, password)
     - `POST /api/auth/token/refresh/`
     - `GET /api/auth/user/` (current user, requires auth)
     - `POST /api/auth/logout/`
   - [ ] Google OAuth setup (allauth social adapter)

8. **Frontend Auth UI**
   - [ ] Login page (`/login`) — email & password form
   - [ ] Register page (`/register`) — form with validation
   - [ ] Google OAuth integration (button, callback handler)
   - [ ] JWT token storage (httpOnly cookie or secure localStorage)
   - [ ] Auth context hook (`useAuth`)
   - [ ] Middleware to protect routes (redirect to login if not authed)
   - [ ] Landing page (`/`) redirects to `/chat`

9. **Auth Middleware & Guards**
   - [ ] Axios interceptor to add Authorization header
   - [ ] Token refresh logic on 401 response
   - [ ] Logout functionality

**Deliverables**: User can register with email/password OR Google, login, access protected routes, logout. JWT tokens valid and refreshed.

---

### Phase 3: User Profiles & Addresses (Week 3)
**Goal**: Allow users to save personal information.

10. **Backend Profile Models**
    - [ ] `UserProfile` model (1:1 with CustomUser)
    - [ ] `UserAddress` model (FK to CustomUser)
    - [ ] Signals to auto-create UserProfile on user creation
    - [ ] API serializers for profile and addresses
    - [ ] CRUD endpoints:
      - `GET /api/users/profile/` (current user's profile)
      - `PUT /api/users/profile/` (update profile)
      - `GET /api/users/addresses/` (list user's addresses)
      - `POST /api/users/addresses/` (create address)
      - `GET/PUT/DELETE /api/users/addresses/{id}/`

11. **Frontend Profile UI**
    - [ ] Profile page (`/profile`)
    - [ ] Edit profile form (first name, last name, bio)
    - [ ] Manage addresses section (add, edit, delete, set default)
    - [ ] Form validation (city/state/zip)
    - [ ] Profile completion prompt after first login

**Deliverables**: Users can create and update profile, manage multiple addresses, set default address.

---

### Phase 4: Service Categories & Provider Models (Week 4)
**Goal**: Establish service taxonomy and provider profiles.

12. **Backend Provider Models**
    - [ ] `ServiceCategory` model (hierarchical)
    - [ ] `Provider` model (1:1 with CustomUser)
    - [ ] `ProviderService` model (many categories per provider)
    - [ ] `PortfolioItem` model (provider's work samples)
    - [ ] `WorkSchedule` model (availability per day)
    - [ ] `Review` and `ReviewResponse` models (ratings)

13. **Seed Data**
    - [ ] Create `service_categories.json` (20 top categories)
    - [ ] Create management command to seed categories
    - [ ] Create 10-15 sample providers in database (mock data)

14. **Backend Provider APIs**
    - [ ] `GET /api/categories/` (list all categories)
    - [ ] `GET /api/providers/` (list with filters)
      - Query params: `category`, `rating__gte`, `is_available`, search
    - [ ] `GET /api/providers/{id}/` (detail, include portfolio & reviews)
    - [ ] `GET /api/providers/{id}/reviews/` (paginated)
    - [ ] `GET /api/providers/{id}/schedule/` (availability)

15. **Frontend Provider Components**
    - [ ] Provider card component (listing view)
    - [ ] Provider profile page (`/providers/{id}`)
      - Portfolio gallery
      - Star rating + review count
      - Work schedule / availability
      - Rate range
      - "View Profile" / "Select" buttons
    - [ ] Provider list page (`/providers`) with search/filter

**Deliverables**: Full category and provider data model, sample data seeded, providers searchable and viewable by users.

---

### Phase 5: AI Chat Assistant (Core) (Week 5-7)
**Goal**: Implement the intelligent chat assistant.

16. **Service-RAG: OpenAI Integration**
    - [ ] OpenAI SDK setup with function calling
    - [ ] `OpenAIService` class wrapping API calls
    - [ ] Configurable model via `OPENAI_MODEL` env (default gpt-4o)
    - [ ] Function definitions (schemas):
      - `get_service_categories()`
      - `get_user_profile(user_id)`
      - `search_providers(category, location, budget_range, availability)`
      - `get_provider_details(provider_id)`
      - `create_service_request(user_id, provider_id, category_id, ...)`
      - `update_user_address(user_id, address_data)`

17. **Service-RAG: Conversation Logic**
    - [ ] System prompt (Doyo assistant persona)
    - [ ] Conversation state management (message history, summary)
    - [ ] Intent classifier (extract service category, requirements)
    - [ ] Information extraction prompts (location, timing, budget, images)
    - [ ] Image analysis (GPT Vision when user uploads photo)

18. **Service-RAG: Provider Search**
    - [ ] pgvector integration for semantic search
    - [ ] Embed provider descriptions and services
    - [ ] `ProviderSearchService`: query by similarity + filter by category, location, availability
    - [ ] Return top 3-5 matches ranked by relevance

19. **Service-RAG: API Endpoints**
    - [ ] `POST /rag/chat/` (single request/response)
    - [ ] `POST /rag/chat/stream/` (server-sent events for streaming)
    - [ ] Request schema: `user_id`, `conversation_id`, `message`, `attachments`
    - [ ] Response schema: streamed text chunks, function calls, metadata

20. **Backend Conversation Models**
    - [ ] `Conversation` model (type: ai_assistant / direct_message)
    - [ ] `Message` model (sender, content, message_type, metadata)
    - [ ] `MessageAttachment` model (file storage)
    - [ ] REST endpoints:
      - `GET /api/conversations/` (list conversations)
      - `GET /api/conversations/{id}/messages/` (paginated history)
      - `POST /api/conversations/{id}/messages/` (fallback REST send, if WebSocket unavailable)

21. **Frontend Chat UI**
    - [ ] Chat page (`/chat`) route structure
    - [ ] Chat list sidebar (conversations history)
    - [ ] Individual conversation view (`/chat/{conversationId}`)
    - [ ] Message components:
      - `MessageBubble` (text, images, system)
      - `ProviderCard` (inline, clickable to select)
      - `OrderSummaryCard` (confirmation)
    - [ ] Chat input:
      - Text input field
      - Image upload button
      - Attachment preview
    - [ ] Streaming display:
      - Typing indicator
      - Progressive text rendering
    - [ ] WebSocket connection to receive real-time messages
    - [ ] Conversation history persistence (localStorage fallback)

**Deliverables**: Users chat with AI, receive provider recommendations as cards, can select providers, see order previews. All through conversational UI.

---

### Phase 6: Order Lifecycle (Week 7-8)
**Goal**: Enable users to create service requests and manage orders.

22. **Backend Order Model & API**
    - [ ] `ServiceRequest` model with status transitions
    - [ ] API endpoints:
      - `POST /api/orders/` (create order)
      - `GET /api/orders/` (user's orders list)
      - `GET /api/orders/{id}/` (detail)
      - `PUT /api/orders/{id}/status/` (update status by provider)
      - `POST /api/orders/{id}/cancel/` (cancel order)
    - [ ] Order signals for status changes (trigger notifications)

23. **Service-RAG: Order Creation Function**
    - [ ] `create_service_request()` handler
    - [ ] Validates provider availability, creates order in backend via API call
    - [ ] Returns order confirmation with ID and summary

24. **Frontend Order UI**
    - [ ] Orders page (`/orders`) — list all user's orders
      - Status badges (pending, accepted, in progress, completed, reviewed)
      - Sortable / filterable
    - [ ] Order detail page (`/orders/{id}`)
      - Visual status timeline
      - Service details, provider info, address
      - Direct messaging section (if accepted)
      - Review form (if completed)
      - Cancel button (if pending/in_progress)
    - [ ] Confirmation flow in chat: show `OrderSummaryCard` → user confirms → order created

**Deliverables**: Users can create orders through AI chat, view order status, cancel orders. Providers can accept/reject orders (admin portal for now).

---

### Phase 7: Real-Time Messaging & Notifications (Week 8-9)
**Goal**: Enable direct communication and real-time updates.

25. **Backend WebSocket (Channels)**
    - [ ] WebSocket consumer for direct messaging (`/ws/chat/{conversation_id}/`)
    - [ ] WebSocket consumer for notifications (`/ws/notifications/`)
    - [ ] Message dispatching via Redis channel layer
    - [ ] Broadcasting to relevant users
    - [ ] Reconnection logic

26. **Backend Notification Model**
    - [ ] `Notification` model (type, recipient, related_object, read_status)
    - [ ] Celery task to create notifications on order status changes
    - [ ] Notification serializer for WebSocket broadcast

27. **Frontend WebSocket Communication**
    - [ ] `useWebSocket` hook for connection management
    - [ ] Real-time message display in chat
    - [ ] Notification listener and display (notification bell, toast)
    - [ ] Online/offline status indicator

28. **Direct Messaging (Post-Matching)**
    - [ ] UI for messaging once order accepted
    - [ ] Phone number visibility in order detail
    - [ ] Direct message thread between user and provider

**Deliverables**: Users and providers message in real-time, receive notifications on order updates, phone numbers visible after matching.

---

### Phase 8: Reviews, Polish & Security (Week 9-10)
**Goal**: Enable reviews, optimize UX, harden security.

29. **Review System**
    - [ ] Review creation form (post-completion)
    - [ ] Star rating picker (1-5)
    - [ ] Text comment
    - [ ] Provider can respond to reviews
    - [ ] Rating aggregation (update provider `rating_avg`)

30. **PWA Optimization**
    - [ ] Service worker for offline shell
    - [ ] Caching strategy (Cache-first for assets, Network-first for API)
    - [ ] Install prompt (add to home screen)
    - [ ] Manifest update

31. **UX Enhancements**
    - [ ] Loading skeletons
    - [ ] Empty states (no conversations, no orders)
    - [ ] Error boundaries
    - [ ] Toast notifications
    - [ ] Form validation feedback
    - [ ] Mobile responsiveness polish

32. **Security & Performance**
    - [ ] Rate limiting (DRF Throttle on auth, /chat)
    - [ ] CORS configuration (frontend origin)
    - [ ] File upload validation (image size, type)
    - [ ] SQL injection prevention (ORM + parameterized queries)
    - [ ] CSRF protection (Django middleware)
    - [ ] Sensitive data redaction (phone numbers until matched)

33. **Django Admin Customization**
    - [ ] User admin (bulk provider flag set)
    - [ ] Provider admin (verify, featured, disable)
    - [ ] Category admin (order, disable)
    - [ ] Order admin (status view, action buttons)
    - [ ] Custom filters and search

**Deliverables**: Full-featured, secure, polished application ready for testing.

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register/` | Register new user (email+password) | No |
| POST | `/api/auth/login/` | Login (email/username+password) | No |
| POST | `/api/auth/google/` | Google OAuth login | No |
| POST | `/api/auth/token/refresh/` | Refresh JWT token | Yes |
| POST | `/api/auth/logout/` | Logout / invalidate token | Yes |
| GET | `/api/auth/user/` | Get current user info | Yes |

### User Profile

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/profile/` | Get current user's profile | Yes |
| PUT | `/api/users/profile/` | Update current user's profile | Yes |
| GET | `/api/users/addresses/` | List user's addresses | Yes |
| POST | `/api/users/addresses/` | Create new address | Yes |
| GET | `/api/users/addresses/{id}/` | Get address detail | Yes |
| PUT | `/api/users/addresses/{id}/` | Update address | Yes |
| DELETE | `/api/users/addresses/{id}/` | Delete address | Yes |

### Categories & Providers

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/categories/` | List all service categories | No |
| GET | `/api/providers/` | List providers (filterable) | No |
| GET | `/api/providers/{id}/` | Get provider detail | No |
| GET | `/api/providers/{id}/portfolio/` | Get provider's portfolio items | No |
| GET | `/api/providers/{id}/reviews/` | Get provider's reviews (paginated) | No |
| GET | `/api/providers/{id}/schedule/` | Get provider's availability | No |

#### Provider List Filters (query params)
- `category`: Category slug
- `rating__gte`: Minimum rating (0-5)
- `is_available`: Boolean
- `search`: Search by name/business
- `page`: Pagination

### Orders

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders/` | Create service request | Yes |
| GET | `/api/orders/` | List user's orders | Yes |
| GET | `/api/orders/{id}/` | Get order detail | Yes |
| PUT | `/api/orders/{id}/` | Update order (user-editable fields) | Yes |
| PUT | `/api/orders/{id}/status/` | Update order status | Yes (provider) |
| POST | `/api/orders/{id}/cancel/` | Cancel order | Yes |
| POST | `/api/orders/{id}/complete/` | Mark as completed | Yes (provider) |

### Conversations & Messages

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/conversations/` | List user's conversations | Yes |
| GET | `/api/conversations/{id}/` | Get conversation detail | Yes |
| GET | `/api/conversations/{id}/messages/` | Get messages (paginated) | Yes |
| POST | `/api/conversations/{id}/messages/` | Send message (fallback REST) | Yes |
| DELETE | `/api/conversations/{id}/` | Archive conversation | Yes |

#### WebSocket Endpoints
- `ws://host/ws/chat/{conversation_id}/` — Real-time chat messages
- `ws://host/ws/notifications/` — Real-time notifications

### Reviews

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders/{order_id}/review/` | Create review | Yes |
| GET | `/api/orders/{order_id}/review/` | Get review for order | Yes |
| PUT | `/api/orders/{order_id}/review/` | Update review | Yes |
| POST | `/api/orders/{order_id}/review/response/` | Provider responds to review | Yes (provider) |

### Service-RAG

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/rag/chat/` | Send message to AI assistant | Yes |
| GET | `/rag/chat/stream/` | Stream AI response (SSE) | Yes |
| GET | `/rag/health/` | Health check | No |

---

## Environment Setup

### Prerequisites
- Docker & Docker Compose (or local Python 3.11+, Node.js 20+, PostgreSQL 16)
- Git
- OpenAI API key (https://platform.openai.com/api-keys)
- Google OAuth credentials (https://console.cloud.google.com)

### Quick Start (Docker Compose)

#### 1. Clone & Setup
```bash
git clone <repo-url> doyo
cd doyo
cp .env.example .env
```

#### 2. Configure Environment Variables
Edit `.env`:
```bash
# Database
DATABASE_URL=postgresql://doyo:doyo@db:5432/doyo
REDIS_URL=redis://redis:6379/0

# Django
DJANGO_SECRET_KEY=your-insecure-secret-key-change-in-prod
DJANGO_DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,host.docker.internal

# Auth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o

# Frontend URLs
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_RAG_URL=http://localhost:8001/rag
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

#### 3. Start Services
```bash
docker-compose up -d
```

Services will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Django Admin**: http://localhost:8000/admin
- **Service-RAG**: http://localhost:8001/rag
- **API Docs**: http://localhost:8000/api/docs (Swagger)

#### 4. Initialize Database
```bash
# Run migrations
docker exec doyo-backend python manage.py migrate

# Create superuser
docker exec doyo-backend python manage.py createsuperuser

# Seed categories and sample providers
docker exec doyo-service-rag python -m app.scripts.seed_db
```

#### 5. Verify Setup
```bash
# Backend health
curl http://localhost:8000/api/health

# Service-RAG health
curl http://localhost:8001/rag/health

# Get categories
curl http://localhost:8000/api/categories
```

### Local Development (Without Docker)

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements/dev.txt
python manage.py migrate
python manage.py runserver
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
# http://localhost:3000
```

#### Service-RAG
```bash
cd service-rag
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

---

## Development Workflow

### Common Commands

#### Docker Commands
```bash
# Start all services
docker-compose up

# Stop all services
docker-compose down

# Rebuild images
docker-compose build

# View logs
docker-compose logs -f backend  # or frontend, service-rag, etc.

# Get shell in container
docker-compose exec backend bash
docker-compose exec frontend sh
docker-compose exec service-rag bash

# Run Django migrations
docker-compose exec backend python manage.py migrate

# Create Django superuser
docker-compose exec backend python manage.py createsuperuser

# Run tests
docker-compose exec backend pytest
docker-compose exec frontend npm test
docker-compose exec service-rag pytest
```

#### Frontend Commands
```bash
cd frontend
npm run dev        # Start dev server
npm run build      # Build for production
npm run lint       # Run ESLint
npm test           # Run tests
npm run format     # Format with Prettier
```

#### Backend Commands
```bash
cd backend
python manage.py runserver
python manage.py migrate
python manage.py makemigrations
python manage.py createsuperuser
python manage.py shell
python manage.py collectstatic
pytest                          # Run all tests
pytest apps/users/tests/        # Run specific app tests
pytest -v                       # Verbose
pytest -k test_login           # Run tests by name
```

#### Service-RAG Commands
```bash
cd service-rag
uvicorn app.main:app --reload
pytest
python -m app.scripts.seed_db
python -m app.scripts.generate_embeddings
```

### Code Quality

#### Frontend
```bash
cd frontend
npm run lint      # ESLint check
npm run lint:fix  # Auto-fix
npm run format    # Prettier
```

#### Backend
```bash
cd backend
black .           # Format code
flake8 apps/      # Lint
isort .           # Sort imports
```

### Git Workflow
```bash
git checkout -b feature/description
# Make changes
git add .
git commit -m "feat: description"
git push origin feature/description
# Create Pull Request
```

---

## Verification & Testing

### Manual Testing Checklist

#### Authentication
- [ ] Register with email + password → email validation email sent → account created
- [ ] Login with email → JWT token received → access protected routes
- [ ] Login with Google → OAuth flow → account created/linked → JWT token
- [ ] Token refresh → new token issued
- [ ] Logout → token invalidated → redirect to login on protected page

#### User Profile
- [ ] Create user → UserProfile auto-created
- [ ] Update profile (name, bio) → persisted
- [ ] Add address (home/work) → saved with full details
- [ ] Set default address → prioritized in order forms
- [ ] Edit/delete addresses → works correctly

#### Provider Discovery
- [ ] List categories → 20 categories returned
- [ ] Search providers by category → results filtered
- [ ] Filter by rating → only providers meeting threshold shown
- [ ] View provider profile → portfolio, reviews, schedule visible
- [ ] Provider ratings aggregated from reviews → accurate

#### AI Chat (Core Flow)
- [ ] Start new conversation → chat initiated
- [ ] Type service request → AI responds conversationally
- [ ] Upload image → AI analyzes via GPT Vision → acknowledges in response
- [ ] AI asks clarification questions → captures requirements
- [ ] AI searches providers → generates provider cards in chat
- [ ] Click provider card → shows detail
- [ ] Select provider → AI shows order summary card
- [ ] Confirm order → ServiceRequest created, status = pending

#### Order Lifecycle
- [ ] Create order through chat → order appears in /orders
- [ ] Order status timeline → request → accepted → in progress → completed → reviewed
- [ ] Cancel order (before completed) → status = cancelled, reason saved
- [ ] Complete order → unlocks review form

#### Direct Messaging
- [ ] After order accepted → direct message option available
- [ ] Send message to provider → appears in real-time (WebSocket)
- [ ] Receive message from provider → real-time notification
- [ ] Phone number visible in order detail after acceptance

#### Reviews
- [ ] Completed order → review form shown
- [ ] Submit review (1-5 stars, comment) → saved
- [ ] Provider rating recalculated → reflects new review
- [ ] Provider can respond to review → response displayed

#### PWA
- [ ] Install app prompt → appears on mobile
- [ ] Web app opens fullscreen → no address bar
- [ ] Offline shell → basic navigation works offline
- [ ] Service worker auto-updates → cache busting works

### Automated Testing

#### Frontend (Jest + React Testing Library)
```bash
cd frontend
npm test

# Tests should cover:
# - Auth forms (register, login, Google OAuth)
# - Chat message rendering and input
# - Provider card component
# - Order list and detail pages
# - Form validation
# - WebSocket integration
# - API error handling
```

#### Backend (pytest-django)
```bash
cd backend
pytest

# Tests should cover:
# - User model and auth
# - Provider model and search
# - Order lifecycle (status transitions)
# - API views (CRUD, filters)
# - Permissions and authentication
# - Serializer validation
# - Signal handlers
```

#### Service-RAG (pytest)
```bash
cd service-rag
pytest

# Tests should cover:
# - Chat service conversation flow
# - Function calling logic
# - Provider search (pgvector + filters)
# - OpenAI integration (mocked)
# - Image processing
# - Conversation state management
```

### Integration Tests

#### Auth Flow
```bash
1. Register → verify email → login → create profile → add address
2. Google OAuth → auto-create profile → login → add address
```

#### Chat to Order Flow
```bash
1. Login
2. Start chat
3. Describe requirement + upload image
4. AI asks questions and searches
5. Select provider
6. Confirm order
7. Verify order created in backend
8. Verify order appears in /orders
```

#### Provider Matching
```bash
1. User has category preference in message
2. AI searches: pgvector → [Provider1, Provider2, Provider3]
3. Filter by location/availability
4. Return top 3 as cards
5. Verify provider details correct
```

### Load Testing (k6)

```javascript
// k6/chat-load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 100,          // 100 virtual users
  duration: '5m',    // 5 minutes
};

export default function () {
  // Test /api/providers
  let res = http.get(__ENV.BASE_URL + '/api/providers/?category=electrician');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response < 500ms': (r) => r.timings.duration < 500,
  });

  // Test /rag/chat (single message)
  res = http.post(__ENV.BASE_URL + '/rag/chat/', JSON.stringify({
    user_id: 1,
    conversation_id: 'test-conv',
    message: 'I need an electrician',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, { 'chat status 200': (r) => r.status === 200 });

  sleep(1);
}
```

Run:
```bash
k6 run --vus 100 --duration 5m k6/chat-load-test.js
```

### Security Checklist

- [ ] CSRF protection enabled (Django middleware)
- [ ] CORS configured (only frontend origin)
- [ ] Rate limiting on auth endpoints (prevent brute force)
- [ ] JWT token has reasonable expiry (15 min access, 7 days refresh)
- [ ] Passwords hashed (Django default)
- [ ] File uploads validated (type, size)
- [ ] No sensitive data in logs
- [ ] SQL injection prevented (ORM + parameterized)
- [ ] XSS prevented (React auto-escapes, CSP headers)
- [ ] Input sanitization (DRF serializer validation)

---

## Design Decisions

### 1. **AI Assistant Over Browsing**
**Decision**: Users chat with an AI assistant instead of browsing category lists.

**Rationale**:
- Conversational UX is more intuitive for service requests.
- AI can understand context, ask clarifying questions, and surface relevant providers naturally.
- Reduces friction: no learning curve to navigate menus.
- Accessibility: voice-like interaction familiar to users.

**Alternative Considered**: Traditional category browsing + filters. **Rejected** because it's generic and doesn't scale with personalization.

---

### 2. **pgvector for Semantic Search**
**Decision**: Use pgvector (PostgreSQL vector extension) for provider matching.

**Rationale**:
- Embeddings capture semantic meaning (e.g., "wiring issue" → electrician).
- Combined with rule-based filters (category, location, rating) → intelligent matching.
- Keeps all data in one database (no separate search service).
- Scales well for thousands of providers.

**Alternative Considered**: Full-text search on PostgreSQL. **Rejected** because it doesn't capture semantic intent.

---

### 3. **Image Analysis via GPT Vision**
**Decision**: Users can upload photos; AI analyzes them in context.

**Rationale**:
- Photos provide critical context (e.g., electrical problem photo).
- GPT Vision can identify the issue type and suggest categories.
- Improves matching accuracy.
- Better UX than describing in text alone.

---

### 4. **Function Calling for AI-Database Interaction**
**Decision**: AI uses OpenAI function calling to search providers, create orders, update profile.

**Rationale**:
- Structured, deterministic interaction (AI can't "hallucinate" a database call).
- Tight coupling between AI and backend ensures consistency.
- Clear audit trail of AI actions.
- Easier to debug and test.

**Alternative Considered**: AI generates SQL. **Rejected** because it's unsafe and unpredictable.

---

### 5. **Two Flows (Users v1, Providers v2)**
**Decision**: v1 focuses on user registration and ordering; provider self-registration deferred.

**Rationale**:
- Faster time-to-market: one flow to perfect.
- Risk reduction: provider data initially seeded/admin-managed.
- Can launch with hand-curated provider network.
- Provider portal adds complexity (verification, onboarding) that can wait.

---

### 6. **Real-Time Messaging via WebSocket**
**Decision**: Use Django Channels + WebSocket for direct messaging and notifications.

**Rationale**:
- WebSocket enables low-latency, bidirectional communication.
- Native browser support (no external libraries required).
- Django Channels integrates seamlessly.
- Redis channel layer scales horizontally.

**Alternative Considered**: Polling or email notifications. **Rejected** because they're not real-time or too intrusive.

---

### 7. **Monorepo with Docker Compose**
**Decision**: Single repository with frontend, backend, service-rag, and orchestration.

**Rationale**:
- Easier local development: `docker-compose up` starts the entire stack.
- Atomic commits if all services updated together.
- Shared domain models (types/schemas) easier to sync.
- Single CI/CD pipeline for all services.

**Alternative Considered**: Microrepos. **Rejected** because it adds complexity early.

---

### 8. **Service-RAG as Separate FastAPI Service**
**Decision**: AI logic in a dedicated Python microservice, not embedded in Django.

**Rationale**:
- Separation of concerns: Django handles data/users, FastAPI handles AI logic.
- Easier to scale AI service independently (different workloads).
- Python ecosystem for AI/LLM is mature (LangChain, OpenAI SDK).
- Decoupling enables parallel development.

---

### 9. **No Payments in v1**
**Decision**: Rates shown in provider profiles; no payment processing yet.

**Rationale**:
- Users contact providers directly and negotiate offline.
- Reduces legal/financial complexity for MVP.
- Enables faster launch.
- Payment gateway (Stripe, Zarinpal) can be added in v1.5 without major refactoring.

---

### 10. **Order Status Machine (Linear Flow)**
**Decision**: Status progression is linear: pending → accepted → in_progress → completed → reviewed (+ cancel escape hatch).

**Rationale**:
- Simple, predictable state transitions.
- Reduces ambiguity (no "pending" + "in_progress" simultaneously).
- Easy to enforce permissions (only provider can accept, only user can review).
- Matches real-world service request lifecycle.

---

### 11. **Profile Pre-Fill for Orders**
**Decision**: Show user's saved profile info in order confirmation; user can edit before submitting.

**Rationale**:
- Reduces friction: no re-entering address every time.
- Still allows customization (different address for this order).
- Privacy: user always reviews what's shared with provider.

---

### 12. **PWA Over Native Apps**
**Decision**: Progressive Web App (installable, offline-capable) instead of native iOS/Android apps.

**Rationale**:
- Code-once, deploy everywhere (web + "app").
- No app store review process.
- Users don't need to download → lower adoption friction.
- Still feels native: fullscreen, home screen icon, offline support.

---

## Roadmap (Future)

### Phase 2: Provider Self-Registration (v1.5)
- [ ] Provider sign-up flow
- [ ] Profile & service setup
- [ ] Document verification (license, insurance)
- [ ] Availability calendar
- [ ] Earnings dashboard

### Phase 3: Payment Processing (v1.5-v2)
- [ ] Stripe integration for payments
- [ ] Iranian payment gateway (Zarinpal/ZarinPal) for Iran market
- [ ] Escrow-like model (payment held until completion)
- [ ] Invoicing & receipts

### Phase 4: Enhancement Features (v2+)
- [ ] OTP / SMS verification
- [ ] Multi-language i18n support
- [ ] Map integration (provider location, service area)
- [ ] Advanced matching (ML-based recommendation)
- [ ] Native iOS/Android apps (React Native)
- [ ] Push notifications (Firebase Cloud Messaging)
- [ ] Provider analytics dashboard
- [ ] Rate negotiation
- [ ] Appointment calendar integration

### Phase 5: Marketplace Evolution (v2.5+)
- [ ] Subscription plans (VIP tiers)
- [ ] Seasonal campaigns
- [ ] Marketing automation
- [ ] Affiliate program
- [ ] B2B corporate accounts
- [ ] AI-powered rate suggestions (based on market, demand)

---

## Contributing

### Code Style
- **Frontend**: Prettier (formatting), ESLint (linting), TypeScript strict mode
- **Backend**: Black (formatting), flake8 (linting), pytest style
- **Service-RAG**: Black, flake8, pytest

### Branch Naming
- `feature/<description>` — new feature
- `fix/<description>` — bug fix
- `doc/<description>` — documentation
- `refactor/<description>` — refactoring

### Commit Messages
Use Conventional Commits:
- `feat: add provider search`
- `fix: resolve WebSocket reconnection`
- `docs: update README`
- `test: add order lifecycle tests`

### Pull Request Process
1. Create feature branch
2. Make changes with tests
3. Run linters and formatters
4. Submit PR with description
5. Request review
6. Address feedback
7. Squash and merge

---

## FAQ

**Q: Can I run this locally without Docker?**
A: Yes. See "Local Development" section above.

**Q: How do I add new service categories?**
A: Edit `service-rag/app/dataset/service_categories.json` and run the seed script, or use Django Admin.

**Q: Where do initial providers come from?**
A: Seeded in database during setup. Provider self-registration comes in v2.

**Q: Can I change the OpenAI model?**
A: Yes. Set `OPENAI_MODEL=gpt-4o-mini` (or any valid model) in `.env`.

**Q: Is this GDPR/privacy-compliant?**
A: Basic measures are in place (password hashing, HTTPS in prod). A full privacy audit and legal review is recommended before launch.

**Q: How do I deploy to production?**
A: See AWS deployment guide (separate document). Use ECS + RDS + S3 + CloudFront.

**Q: Can I integrate my own payment processor?**
A: Yes. Add a payment app to Django, implement webhook handlers, and update the Order model.

---

## Support & Resources

- **OpenAI API Docs**: https://developers.openai.com/api
- **Django Docs**: https://docs.djangoproject.com
- **Django REST Framework**: https://www.django-rest-framework.org
- **Next.js Docs**: https://nextjs.org/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **Docker Docs**: https://docs.docker.com

---

## License

[Specify: MIT, Apache 2.0, GPL, etc.] *(to be determined)*

---

## Contact

- **Email**: contact@doyo.app *(placeholder)*
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

---

**Last Updated**: February 21, 2026  
**Version**: 1.0.0 (Plan)

### Document Revisions

| Date | Author | Changes |
|------|--------|---------|
| Feb 21, 2026 | Project Lead | Initial comprehensive plan |
