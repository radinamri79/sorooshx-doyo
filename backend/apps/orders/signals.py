from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order


@receiver(post_save, sender=Order)
def update_provider_order_count(sender, instance, created, **kwargs):
    if created:
        provider = instance.provider
        provider.total_orders = provider.provider_orders.count()
        provider.save(update_fields=["total_orders"])
