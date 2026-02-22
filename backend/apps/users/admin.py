from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, UserProfile, UserAddress


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    inlines = [UserProfileInline]
    list_display = ["email", "username", "is_provider", "auth_provider", "is_active", "created_at"]
    list_filter = ["is_provider", "auth_provider", "is_active"]
    search_fields = ["email", "username", "first_name", "last_name"]
    ordering = ["-created_at"]


@admin.register(UserAddress)
class UserAddressAdmin(admin.ModelAdmin):
    list_display = ["title", "user", "city", "country", "is_default"]
    list_filter = ["country", "is_default"]
    search_fields = ["title", "user__email"]
