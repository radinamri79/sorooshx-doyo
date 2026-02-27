from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework.permissions import AllowAny
from rest_framework.authentication import BaseAuthentication
from decouple import config


class NoAuthentication(BaseAuthentication):
    """Allow any access without authentication."""
    def authenticate(self, request):
        return None


class GoogleLogin(SocialLoginView):
    authentication_classes = [NoAuthentication]
    permission_classes = [AllowAny]
    adapter_class = GoogleOAuth2Adapter
    callback_url = config(
        "GOOGLE_CALLBACK_URL",
        default="http://localhost:3000/auth/google/callback",
    )
    client_class = OAuth2Client
