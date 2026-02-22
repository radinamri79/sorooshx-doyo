from django.test import TestCase
from apps.providers.models import ServiceCategory, Provider
from apps.users.models import CustomUser


class TestServiceCategory(TestCase):
    def test_create_category(self):
        cat = ServiceCategory.objects.create(name="Test Cat", slug="test-cat")
        assert cat.name == "Test Cat"
        assert cat.is_active is True

    def test_hierarchical_categories(self):
        parent = ServiceCategory.objects.create(name="Parent", slug="parent")
        child = ServiceCategory.objects.create(name="Child", slug="child", parent=parent)
        assert child.parent == parent
        assert parent.children.count() == 1


class TestProvider(TestCase):
    def test_create_provider(self):
        user = CustomUser.objects.create_user(
            email="prov@example.com", username="provuser", password="testpass123"
        )
        user.is_provider = True
        user.save()
        provider = Provider.objects.create(
            user=user,
            business_name="Test Business",
            city="Test City",
        )
        assert provider.business_name == "Test Business"
        assert provider.average_rating == 0
