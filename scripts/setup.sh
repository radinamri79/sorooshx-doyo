#!/usr/bin/env bash
set -euo pipefail

echo "=== Doyo Development Setup ==="

# Check Docker
if ! command -v docker &>/dev/null; then
    echo "Error: Docker is not installed. Please install Docker Desktop first."
    exit 1
fi

if ! command -v docker compose &>/dev/null; then
    echo "Error: Docker Compose is not available."
    exit 1
fi

# Copy .env
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "Please update .env with your actual values before starting."
fi

echo "Building containers..."
docker compose build

echo "Starting services..."
docker compose up -d

echo "Waiting for database..."
sleep 5

echo "Running migrations..."
docker compose exec backend python manage.py migrate

echo "Seeding data..."
docker compose exec backend python manage.py seed_categories
docker compose exec backend python manage.py seed_providers

echo ""
echo "=== Setup Complete ==="
echo "Frontend:  http://localhost"
echo "Backend:   http://localhost/api/"
echo "Admin:     http://localhost/admin/"
echo "RAG:       http://localhost/rag/health"
echo ""
echo "Create superuser: make createsuperuser"
