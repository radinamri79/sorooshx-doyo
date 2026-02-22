from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ServiceCategoryViewSet,
    ProviderViewSet,
    ProviderServiceViewSet,
    PortfolioItemViewSet,
    WorkScheduleViewSet,
)

router = DefaultRouter()
router.register(r"categories", ServiceCategoryViewSet, basename="category")
router.register(r"", ProviderViewSet, basename="provider")
router.register(r"my/services", ProviderServiceViewSet, basename="my-service")
router.register(r"my/portfolio", PortfolioItemViewSet, basename="my-portfolio")
router.register(r"my/schedule", WorkScheduleViewSet, basename="my-schedule")

urlpatterns = [
    path("", include(router.urls)),
]
