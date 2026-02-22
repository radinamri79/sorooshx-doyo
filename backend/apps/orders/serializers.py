from rest_framework import serializers
from apps.users.serializers import UserSerializer
from apps.providers.serializers import ProviderListSerializer, ProviderServiceSerializer
from .models import Order, OrderStatusLog


class OrderStatusLogSerializer(serializers.ModelSerializer):
    changed_by_email = serializers.CharField(source="changed_by.email", read_only=True)

    class Meta:
        model = OrderStatusLog
        fields = ["id", "from_status", "to_status", "changed_by_email", "note", "created_at"]


class OrderListSerializer(serializers.ModelSerializer):
    customer = UserSerializer(read_only=True)
    provider_name = serializers.CharField(source="provider.business_name", read_only=True)
    service_title = serializers.CharField(source="service.title", read_only=True, default=None)

    class Meta:
        model = Order
        fields = [
            "id", "customer", "provider", "provider_name", "service",
            "service_title", "status", "price", "scheduled_date",
            "scheduled_time", "created_at",
        ]


class OrderDetailSerializer(serializers.ModelSerializer):
    customer = UserSerializer(read_only=True)
    provider = ProviderListSerializer(read_only=True)
    service = ProviderServiceSerializer(read_only=True)
    status_logs = OrderStatusLogSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "customer", "provider", "service", "status",
            "description", "price", "scheduled_date", "scheduled_time",
            "address", "notes", "status_logs", "created_at", "updated_at",
        ]


class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            "provider", "service", "description", "price",
            "scheduled_date", "scheduled_time", "address", "notes",
        ]

    def create(self, validated_data):
        validated_data["customer"] = self.context["request"].user
        return super().create(validated_data)


class OrderStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Order.Status.choices)
    note = serializers.CharField(required=False, default="")

    def validate_status(self, value):
        order = self.context["order"]
        if not order.can_transition_to(value):
            raise serializers.ValidationError(
                f"Cannot transition from '{order.status}' to '{value}'."
            )
        return value
