from django.contrib import admin
from .models import Order, OrderStatusLog


class OrderStatusLogInline(admin.TabularInline):
    model = OrderStatusLog
    extra = 0
    readonly_fields = ["from_status", "to_status", "changed_by", "created_at"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderStatusLogInline]
    list_display = ["id", "customer", "provider", "status", "price", "scheduled_date", "created_at"]
    list_filter = ["status", "created_at"]
    search_fields = ["id", "customer__email", "provider__business_name"]
    readonly_fields = ["id", "created_at", "updated_at"]
