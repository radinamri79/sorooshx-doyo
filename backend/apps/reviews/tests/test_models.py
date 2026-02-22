from django.test import TestCase
from apps.reviews.models import Review
from apps.users.models import CustomUser
from apps.providers.models import Provider, ServiceCategory
from apps.orders.models import Order
from decimal import Decimal


class TestReviewSignal(TestCase):
    def setUp(self):
        self.customer = CustomUser.objects.create_user(
            email="customer@example.com", username="customer", password="testpass123"
        )
        self.provider_user = CustomUser.objects.create_user(
            email="provrev@example.com", username="provrev", password="testpass123", is_provider=True
        )
        self.provider = Provider.objects.create(
            user=self.provider_user, business_name="Test Provider", city="NYC"
        )
        self.order = Order.objects.create(
            customer=self.customer,
            provider=self.provider,
            status="completed",
            price=Decimal("100.00"),
        )

    def test_rating_updates_on_review(self):
        Review.objects.create(
            order=self.order, reviewer=self.customer,
            provider=self.provider, rating=5
        )
        self.provider.refresh_from_db()
        assert self.provider.average_rating == Decimal("5.00")
        assert self.provider.total_reviews == 1
