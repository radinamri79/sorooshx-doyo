import logging
from io import BytesIO
from urllib.parse import urlparse

import requests
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.core.files.base import ContentFile

from .models import CustomUser

logger = logging.getLogger(__name__)


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    """Custom adapter for handling Google OAuth profile data and picture download."""

    def save_user(self, request, sociallogin):
        """
        Save user with extracted profile data from Google OAuth response.
        
        Extracts:
        - given_name → first_name
        - family_name → last_name
        - picture → downloaded and saved as avatar
        
        Sets:
        - auth_provider = "google"
        """
        user = super().save_user(request, sociallogin)

        # Extract profile data from Google OAuth response
        extra_data = sociallogin.account.extra_data
        
        # Extract and set first_name and last_name
        if "given_name" in extra_data:
            user.first_name = extra_data["given_name"]
        
        if "family_name" in extra_data:
            user.last_name = extra_data["family_name"]
        
        # Set auth provider
        user.auth_provider = CustomUser.AuthProvider.GOOGLE
        
        # Save user with basic data first
        user.save()
        
        # Download and save profile picture
        if "picture" in extra_data:
            self._save_google_profile_picture(user, extra_data["picture"])
        
        return user

    def _save_google_profile_picture(self, user: CustomUser, picture_url: str) -> None:
        """
        Download profile picture from Google and save to user's avatar field.
        
        Args:
            user: CustomUser instance
            picture_url: URL of the profile picture from Google OAuth response
        
        Handles:
        - Network timeouts (5 second timeout)
        - Missing or invalid picture URLs
        - HTTP errors (404, 403, etc.)
        - File download and storage
        """
        if not picture_url:
            logger.warning(f"No picture URL provided for user {user.id}")
            return
        
        try:
            # Download the picture with a 3-second timeout
            response = requests.get(picture_url, timeout=3)
            response.raise_for_status()
            
            # Extract filename from URL or use default
            parsed_url = urlparse(picture_url)
            filename = parsed_url.path.split("/")[-1] or f"{user.id}.jpg"
            
            # Ensure filename has proper extension
            if not filename.endswith((".jpg", ".png", ".jpeg", ".gif")):
                filename = f"{filename}.jpg"
            
            # Save picture to user's avatar field
            user.avatar.save(
                filename,
                ContentFile(response.content),
                save=True
            )
            logger.info(f"Successfully saved profile picture for user {user.id}")
            
        except requests.Timeout:
            logger.warning(f"Timeout downloading profile picture for user {user.id} from {picture_url}")
        except requests.RequestException as e:
            logger.warning(f"Failed to download profile picture for user {user.id}: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error saving profile picture for user {user.id}: {str(e)}")
