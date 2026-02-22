from django_filters import rest_framework as filters
from .models import Provider


class ProviderFilter(filters.FilterSet):
    category = filters.CharFilter(field_name="categories__slug", lookup_expr="exact")
    city = filters.CharFilter(lookup_expr="icontains")
    min_rating = filters.NumberFilter(field_name="average_rating", lookup_expr="gte")
    is_available = filters.BooleanFilter()

    class Meta:
        model = Provider
        fields = ["category", "city", "min_rating", "is_available"]
