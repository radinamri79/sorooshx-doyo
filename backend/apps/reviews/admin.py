from django.contrib import admin
from .models import Review, ReviewResponse


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ["id", "reviewer", "provider", "rating", "created_at"]
    list_filter = ["rating", "created_at"]
    search_fields = ["reviewer__email", "provider__business_name"]


@admin.register(ReviewResponse)
class ReviewResponseAdmin(admin.ModelAdmin):
    list_display = ["id", "review", "responder", "created_at"]
