# backend/api/serializers.py

from rest_framework import serializers
from .models import Product, AspectSentiment

class AspectSentimentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AspectSentiment
        fields = [
            'id',
            'topic_name',
            'vader_compound',
            'positive_pct',
            'neutral_pct',
            'negative_pct',
            'sample_sentence',
        ]

class ProductSerializer(serializers.ModelSerializer):
    aspects = AspectSentimentSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'category',
            'star_rating',
            'pris_score',
            'ai_summary',
            'aspects',
            'created_at',
        ]