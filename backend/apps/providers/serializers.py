from rest_framework import serializers
from apps.users.serializers import UserSerializer
from .models import ServiceCategory, Provider, ProviderService, PortfolioItem, WorkSchedule


class ServiceCategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = ServiceCategory
        fields = ["id", "name", "slug", "description", "icon", "parent", "children", "is_active"]

    def get_children(self, obj):
        children = obj.children.filter(is_active=True)
        return ServiceCategorySerializer(children, many=True).data


class ProviderServiceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = ProviderService
        fields = [
            "id", "category", "category_name", "title", "description",
            "price", "duration_minutes", "is_active", "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class PortfolioItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioItem
        fields = ["id", "title", "description", "image", "created_at"]
        read_only_fields = ["id", "created_at"]


class WorkScheduleSerializer(serializers.ModelSerializer):
    day_name = serializers.CharField(source="get_day_of_week_display", read_only=True)

    class Meta:
        model = WorkSchedule
        fields = ["id", "day_of_week", "day_name", "start_time", "end_time", "is_available"]
        read_only_fields = ["id"]


class ProviderListSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    categories = ServiceCategorySerializer(many=True, read_only=True)

    class Meta:
        model = Provider
        fields = [
            "id", "user", "business_name", "description", "categories",
            "city", "average_rating", "total_reviews", "total_orders",
            "is_verified", "is_available",
        ]


class ProviderDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    categories = ServiceCategorySerializer(many=True, read_only=True)
    services = ProviderServiceSerializer(many=True, read_only=True)
    portfolio = PortfolioItemSerializer(many=True, read_only=True)
    schedules = WorkScheduleSerializer(many=True, read_only=True)

    class Meta:
        model = Provider
        fields = [
            "id", "user", "business_name", "description", "categories",
            "city", "address", "average_rating", "total_reviews",
            "total_orders", "is_verified", "is_available",
            "services", "portfolio", "schedules", "created_at",
        ]
