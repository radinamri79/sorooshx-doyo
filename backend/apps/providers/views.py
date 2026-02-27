from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import ServiceCategory, Provider, ProviderService, PortfolioItem, WorkSchedule
from .serializers import (
    ServiceCategorySerializer,
    ProviderListSerializer,
    ProviderDetailSerializer,
    ProviderServiceSerializer,
    PortfolioItemSerializer,
    WorkScheduleSerializer,
)
from .filters import ProviderFilter


class ServiceCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ServiceCategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None
    lookup_field = "slug"

    def get_queryset(self):
        return ServiceCategory.objects.filter(is_active=True, parent=None)

    @action(detail=False, methods=["get"], url_path="by-slug/(?P<slug>[^/.]+)")
    def by_slug(self, request, slug=None):
        """Get a category (parent or child) by slug, with its children."""
        category = ServiceCategory.objects.filter(slug=slug, is_active=True).first()
        if not category:
            return Response({"detail": "Not found."}, status=404)
        serializer = self.get_serializer(category)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="all-flat")
    def all_flat(self, request):
        """Return all categories (both parents and children) in a flat list."""
        categories = ServiceCategory.objects.filter(is_active=True)
        serializer = self.get_serializer(categories, many=True)
        return Response(serializer.data)


class ProviderViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Provider.objects.select_related("user").prefetch_related("categories")
    permission_classes = [permissions.AllowAny]
    filterset_class = ProviderFilter
    search_fields = ["business_name", "description", "city"]
    ordering_fields = ["average_rating", "total_reviews", "created_at"]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProviderDetailSerializer
        return ProviderListSerializer

    @action(detail=True, methods=["get"])
    def services(self, request, pk=None):
        provider = self.get_object()
        services = provider.services.filter(is_active=True)
        serializer = ProviderServiceSerializer(services, many=True)
        return Response(serializer.data)


class ProviderServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ProviderServiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProviderService.objects.filter(provider__user=self.request.user)

    def perform_create(self, serializer):
        provider = Provider.objects.get(user=self.request.user)
        serializer.save(provider=provider)


class PortfolioItemViewSet(viewsets.ModelViewSet):
    serializer_class = PortfolioItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PortfolioItem.objects.filter(provider__user=self.request.user)

    def perform_create(self, serializer):
        provider = Provider.objects.get(user=self.request.user)
        serializer.save(provider=provider)


class WorkScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = WorkScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WorkSchedule.objects.filter(provider__user=self.request.user)

    def perform_create(self, serializer):
        provider = Provider.objects.get(user=self.request.user)
        serializer.save(provider=provider)
