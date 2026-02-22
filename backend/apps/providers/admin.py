from django.contrib import admin
from .models import ServiceCategory, Provider, ProviderService, PortfolioItem, WorkSchedule


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "parent", "is_active"]
    list_filter = ["is_active"]
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ["name"]


class ProviderServiceInline(admin.TabularInline):
    model = ProviderService
    extra = 0


class WorkScheduleInline(admin.TabularInline):
    model = WorkSchedule
    extra = 0


@admin.register(Provider)
class ProviderAdmin(admin.ModelAdmin):
    inlines = [ProviderServiceInline, WorkScheduleInline]
    list_display = [
        "business_name", "user", "city", "average_rating",
        "total_reviews", "is_verified", "is_available",
    ]
    list_filter = ["is_verified", "is_available", "categories"]
    search_fields = ["business_name", "user__email", "city"]


@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    list_display = ["title", "provider", "created_at"]
    search_fields = ["title", "provider__business_name"]
