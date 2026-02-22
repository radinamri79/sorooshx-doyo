from rest_framework import serializers
from apps.users.serializers import UserSerializer
from .models import Review, ReviewResponse


class ReviewResponseSerializer(serializers.ModelSerializer):
    responder = UserSerializer(read_only=True)

    class Meta:
        model = ReviewResponse
        fields = ["id", "responder", "content", "created_at"]
        read_only_fields = ["id", "responder", "created_at"]


class ReviewSerializer(serializers.ModelSerializer):
    reviewer = UserSerializer(read_only=True)
    response = ReviewResponseSerializer(read_only=True)

    class Meta:
        model = Review
        fields = [
            "id", "order", "reviewer", "provider", "rating",
            "comment", "response", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "reviewer", "created_at", "updated_at"]


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["order", "rating", "comment"]

    def validate_order(self, value):
        if value.status != "completed":
            raise serializers.ValidationError("Can only review completed orders.")
        if hasattr(value, "review"):
            raise serializers.ValidationError("This order already has a review.")
        return value

    def create(self, validated_data):
        validated_data["reviewer"] = self.context["request"].user
        validated_data["provider"] = validated_data["order"].provider
        return super().create(validated_data)
