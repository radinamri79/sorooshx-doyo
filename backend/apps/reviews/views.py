from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Review, ReviewResponse
from .serializers import ReviewSerializer, ReviewCreateSerializer, ReviewResponseSerializer


class ReviewViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Review.objects.select_related("reviewer", "provider", "response")
        provider_id = self.request.query_params.get("provider")
        if provider_id:
            queryset = queryset.filter(provider_id=provider_id)
        return queryset

    def get_serializer_class(self):
        if self.action == "create":
            return ReviewCreateSerializer
        return ReviewSerializer

    @action(detail=True, methods=["post"])
    def respond(self, request, pk=None):
        review = self.get_object()
        if hasattr(review, "response"):
            return Response(
                {"detail": "Review already has a response."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        content = request.data.get("content", "")
        if not content:
            return Response(
                {"detail": "Content is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        response = ReviewResponse.objects.create(
            review=review, responder=request.user, content=content
        )
        return Response(
            ReviewResponseSerializer(response).data,
            status=status.HTTP_201_CREATED,
        )
