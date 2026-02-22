import pytest
from django.test import TestCase
from apps.users.models import CustomUser, UserProfile


class TestCustomUser(TestCase):
    def test_create_user(self):
        user = CustomUser.objects.create_user(
            email="test@example.com",
            username="testuser",
            password="testpass123",
        )
        assert user.email == "test@example.com"
        assert user.is_provider is False
        assert user.auth_provider == "email"

    def test_profile_created_on_user_create(self):
        user = CustomUser.objects.create_user(
            email="test2@example.com",
            username="testuser2",
            password="testpass123",
        )
        assert UserProfile.objects.filter(user=user).exists()

    def test_user_str(self):
        user = CustomUser.objects.create_user(
            email="str@example.com",
            username="struser",
            password="testpass123",
        )
        assert str(user) == "str@example.com"
