from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MeView, UserAddressViewSet

router = DefaultRouter()
router.register(r"addresses", UserAddressViewSet, basename="user-address")

urlpatterns = [
    path("me/", MeView.as_view(), name="user-me"),
    path("", include(router.urls)),
]
