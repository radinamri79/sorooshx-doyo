from django.db.models import Avg
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from .models import Review


def update_provider_rating(provider):
    stats = provider.reviews.aggregate(
        avg_rating=Avg("rating"),
        count=provider.reviews.count(),
    )
    provider.average_rating = round(stats["avg_rating"] or 0, 2)
    provider.total_reviews = provider.reviews.count()
    provider.save(update_fields=["average_rating", "total_reviews"])


@receiver(post_save, sender=Review)
def review_saved(sender, instance, **kwargs):
    update_provider_rating(instance.provider)


@receiver(post_delete, sender=Review)
def review_deleted(sender, instance, **kwargs):
    update_provider_rating(instance.provider)
