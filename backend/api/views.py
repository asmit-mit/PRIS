from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product
from .serializers import ProductSerializer

class ProductListView(generics.ListAPIView):
    """
    API endpoint that returns product list with nested aspects.
    Supports server-side search (?search=...) and filtering (?category=...&star_rating__gte=...).
    """
    queryset = Product.objects.prefetch_related('aspects').all().order_by('-created_at')
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    search_fields = ['name', 'ai_summary', 'category']
    filterset_fields = {
        'category': ['exact'],
        'star_rating': ['gte', 'lte'],
    }
    ordering_fields = ['star_rating', 'pris_score', 'created_at']