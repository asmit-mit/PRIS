import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics
from .models import Product
from .serializers import ProductSerializer
from rest_framework.pagination import LimitOffsetPagination


class ProductFilter(django_filters.FilterSet):
    # Maps the frontend ?min_rating= query param directly to star_rating >= value
    min_rating = django_filters.NumberFilter(
        field_name='star_rating', lookup_expr='gte'
    )
    category = django_filters.CharFilter(
        field_name='category', lookup_expr='exact'
    )

    class Meta:
        model = Product
        fields = ['category', 'min_rating', 'star_rating']


class ProductListView(generics.ListAPIView):
    """API endpoint that returns product list with nested aspects.

    Supports server-side search (?search=...) and filtering (?category=...&min_rating=...).
    """

    # prefetch_related optimizes query count when serializing nested aspects
    queryset = (
        Product.objects.prefetch_related('aspects')
        .all()
        .order_by('-created_at')
    )
    serializer_class = ProductSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = ProductFilter
    
    pagination_class = (
        LimitOffsetPagination
    )

    # Removed ai_summary; added relational aspect searches
    search_fields = [
        'name',
        'category',
        'aspects__topic_name',
        'aspects__sample_sentence',
    ]

    ordering_fields = ['star_rating', 'pris_score', 'created_at']

    def filter_queryset(self, queryset):
        # .distinct() ensures products aren't duplicated if multiple aspects match a search term
        return super().filter_queryset(queryset).distinct()