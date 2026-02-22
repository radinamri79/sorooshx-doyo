# Backend — Django 5 REST API

## Tech Stack

- Django 5, Django REST Framework
- Django Channels (WebSocket via Daphne)
- Celery + Redis (async tasks)
- dj-rest-auth + django-allauth (auth, Google OAuth)
- SimpleJWT (30min access / 7-day refresh)
- PostgreSQL 16 + pgvector

## Setup (without Docker)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements/dev.txt

# Set environment variables
export DATABASE_URL=postgres://doyo:doyo@localhost:5432/doyo
export REDIS_URL=redis://localhost:6379/0

python manage.py migrate
python manage.py seed_categories
python manage.py seed_providers
python manage.py createsuperuser
python manage.py runserver
```

## Apps

| App | Models | Description |
|-----|--------|-------------|
| users | CustomUser, UserProfile, UserAddress | Authentication & profiles |
| providers | ServiceCategory, Provider, ProviderService, PortfolioItem, WorkSchedule | Provider marketplace |
| orders | Order, OrderStatusLog | Order management with status machine |
| conversations | Conversation, Message, MessageAttachment | Chat & messaging |
| reviews | Review, ReviewResponse | Rating system |
| notifications | Notification | Real-time notifications |

## API Endpoints

- `/api/auth/` — Login, register, token refresh
- `/api/users/me/` — Current user profile
- `/api/providers/` — Provider listing & detail
- `/api/providers/categories/` — Service categories
- `/api/orders/` — Order CRUD & status updates
- `/api/conversations/` — Chat & messaging
- `/api/reviews/` — Reviews & responses
- `/api/notifications/` — Notification management

## WebSocket

- `ws/chat/<conversation_id>/` — Real-time chat
- `ws/notifications/` — Real-time notifications

## Testing

```bash
pytest
```
