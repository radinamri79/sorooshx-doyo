from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from apps.providers.views import ServiceCategoryViewSet
from rest_framework.routers import DefaultRouter

# Services router (for categories)
services_router = DefaultRouter()
services_router.register(r"categories", ServiceCategoryViewSet, basename="service-category")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("dj_rest_auth.urls")),
    path("api/auth/registration/", include("dj_rest_auth.registration.urls")),
    path("api/auth/social/", include("allauth.socialaccount.urls")),
    path("api/users/", include("apps.users.urls")),
    path("api/services/", include(services_router.urls)),
    path("api/providers/", include("apps.providers.urls")),
    path("api/orders/", include("apps.orders.urls")),
    path("api/conversations/", include("apps.conversations.urls")),
    path("api/reviews/", include("apps.reviews.urls")),
    path("api/notifications/", include("apps.notifications.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += [path("__debug__/", include("debug_toolbar.urls"))]
