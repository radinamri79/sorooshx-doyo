from django.test import TestCase
from django.contrib.auth import get_user_model

from apps.notifications.models import Notification

User = get_user_model()


class NotificationModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="notify@example.com",
            username="notifyuser",
            password="testpass123",
        )

    def test_create_notification(self):
        notification = Notification.objects.create(
            recipient=self.user,
            type=Notification.Type.ORDER_CREATED,
            title="New Order",
            message="Your order has been created.",
        )
        self.assertEqual(notification.recipient, self.user)
        self.assertEqual(notification.type, "order_created")
        self.assertFalse(notification.is_read)

    def test_notification_str(self):
        notification = Notification.objects.create(
            recipient=self.user,
            type=Notification.Type.NEW_MESSAGE,
            title="New Message",
            message="You have a new message.",
        )
        self.assertIn("new_message", str(notification))
        self.assertIn("New Message", str(notification))

    def test_notification_ordering(self):
        n1 = Notification.objects.create(
            recipient=self.user,
            type=Notification.Type.SYSTEM,
            title="First",
            message="First notification",
        )
        n2 = Notification.objects.create(
            recipient=self.user,
            type=Notification.Type.SYSTEM,
            title="Second",
            message="Second notification",
        )
        notifications = list(Notification.objects.all())
        self.assertEqual(notifications[0].id, n2.id)

    def test_notification_data_default(self):
        notification = Notification.objects.create(
            recipient=self.user,
            type=Notification.Type.ORDER_ACCEPTED,
            title="Accepted",
            message="Order accepted",
        )
        self.assertEqual(notification.data, {})


class NotificationViewTest(TestCase):
    def setUp(self):
        from rest_framework.test import APIClient

        self.user = User.objects.create_user(
            email="viewtest@example.com",
            username="viewtestuser",
            password="testpass123",
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.notification = Notification.objects.create(
            recipient=self.user,
            type=Notification.Type.ORDER_CREATED,
            title="Test",
            message="Test notification",
        )

    def test_unread_count(self):
        response = self.client.get("/api/notifications/unread_count/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["count"], 1)

    def test_mark_all_read(self):
        response = self.client.post("/api/notifications/mark_all_read/")
        self.assertEqual(response.status_code, 200)
        self.notification.refresh_from_db()
        self.assertTrue(self.notification.is_read)
