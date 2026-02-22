.PHONY: help up down build logs migrate seed createsuperuser shell test clean format lint

help:
	@echo "Doyo Development Commands"
	@echo "=========================="
	@echo "make up              - Start all services"
	@echo "make down            - Stop all services"
	@echo "make build           - Build Docker images"
	@echo "make logs            - View all logs"
	@echo "make migrate         - Run Django migrations"
	@echo "make seed            - Seed database with categories and providers"
	@echo "make createsuperuser - Create Django superuser"
	@echo "make shell           - Django shell"
	@echo "make test            - Run all tests"
	@echo "make clean           - Remove containers and volumes"

up:
	docker-compose up -d
	@echo "All services started. Frontend: http://localhost:3000"

down:
	docker-compose down

build:
	docker-compose build

logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-rag:
	docker-compose logs -f service-rag

migrate:
	docker-compose exec backend python manage.py migrate

seed:
	docker-compose exec backend python manage.py seed_categories
	docker-compose exec backend python manage.py seed_providers

createsuperuser:
	docker-compose exec backend python manage.py createsuperuser

shell:
	docker-compose exec backend python manage.py shell

test:
	docker-compose exec backend pytest
	docker-compose exec service-rag pytest

test-backend:
	docker-compose exec backend pytest

test-frontend:
	docker-compose exec frontend npm test

test-rag:
	docker-compose exec service-rag pytest

lint:
	docker-compose exec backend black --check .
	docker-compose exec backend flake8 .

format:
	docker-compose exec backend black .

clean:
	docker-compose down -v
	find . -type d -name __pycache__ -exec rm -rf {} +
	rm -rf .pytest_cache .coverage htmlcov

ps:
	docker-compose ps
