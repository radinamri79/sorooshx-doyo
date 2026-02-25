"""Pytest configuration and fixtures for backend tests."""

import os
from pathlib import Path

import pytest
from django.contrib.auth import get_user_model
from django.test import Client
from rest_framework.test import APIClient

# Add backend to path
BASE_DIR = Path(__file__).resolve().parent


@pytest.fixture(scope='session')
def django_db_setup(django_db_setup, django_db_blocker):
    """Set up test database."""
    with django_db_blocker.unblock():
        pass


@pytest.fixture
def api_client():
    """Provide API client for tests."""
    return APIClient()


@pytest.fixture
def client():
    """Provide Django test client."""
    return Client()


@pytest.fixture
def user(db):
    """Create a test user."""
    User = get_user_model()
    return User.objects.create_user(
        email='test@example.com',
        username='testuser',
        password='testpass123',
        first_name='Test',
        last_name='User',
    )


@pytest.fixture
def authenticated_client(db, user):
    """Provide authenticated API client."""
    client = APIClient()
    client.force_authenticate(user=user)
    return client


@pytest.fixture
def provider_user(db):
    """Create a test provider user."""
    User = get_user_model()
    return User.objects.create_user(
        email='provider@example.com',
        username='provider',
        password='testpass123',
        first_name='Provider',
        last_name='User',
        is_provider=True,
    )


@pytest.fixture(autouse=True)
def reset_sequences(db):
    """Reset database sequences between tests."""
    from django.db import connection
    connection.cursor()
    yield
