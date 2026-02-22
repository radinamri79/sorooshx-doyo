from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    """Allow access only to the object's owner."""

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class IsProviderUser(BasePermission):
    """Allow access only to users who are providers."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_provider
