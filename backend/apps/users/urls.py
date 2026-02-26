from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MeView, UserAddressViewSet
from .social_auth import GoogleLogin

router = DefaultRouter()
router.register(r"addresses", UserAddressViewSet, basename="user-address")

urlpatterns = [
    path("me/", MeView.as_view(), name="user-me"),
    path("auth/google/", GoogleLogin.as_view(), name="google-login"),
    path("", include(router.urls)),
]
