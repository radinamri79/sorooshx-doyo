from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from decouple import config


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = config(
        "GOOGLE_CALLBACK_URL",
        default="http://localhost:3000/auth/google/callback",
    )
    client_class = OAuth2Client
