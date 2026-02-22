import uuid

from django.conf import settings
from django.db import models


class Notification(models.Model):
    class Type(models.TextChoices):
        ORDER_CREATED = "order_created", "Order Created"
        ORDER_ACCEPTED = "order_accepted", "Order Accepted"
        ORDER_REJECTED = "order_rejected", "Order Rejected"
        ORDER_COMPLETED = "order_completed", "Order Completed"
        ORDER_CANCELLED = "order_cancelled", "Order Cancelled"
        NEW_MESSAGE = "new_message", "New Message"
        NEW_REVIEW = "new_review", "New Review"
        REVIEW_RESPONSE = "review_response", "Review Response"
        SYSTEM = "system", "System"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications"
    )
    type = models.CharField(max_length=30, choices=Type.choices)
    title = models.CharField(max_length=200)
    message = models.TextField()
    data = models.JSONField(default=dict, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.type}: {self.title}"
