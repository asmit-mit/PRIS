from django.db import models

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('Electronics', 'Electronics'),
        ('Audio', 'Audio'),
        ('Computers', 'Computers'),
        ('Wearables', 'Wearables'),
        ('Home Appliances', 'Home Appliances'),
    ]

    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, default='Electronics')
    star_rating = models.DecimalField(max_digits=3, decimal_places=2, help_text="Average Amazon star rating (1.00 - 5.00)")
    pris_score = models.DecimalField(max_digits=3, decimal_places=2, help_text="VADER mean compound score normalized (-1.00 to +1.00)")
    ai_summary = models.TextField(help_text="Aggregated thematic summary derived from extracted review topics")
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.name

class AspectSentiment(models.Model):
    product = models.ForeignKey(Product, related_name='aspects', on_delete=models.CASCADE)
    topic_name = models.CharField(max_length=100, help_text="Extracted aspect / topic cluster name")
    vader_compound = models.FloatField(help_text="VADER compound polarity (-1.0 to 1.0)")
    positive_pct = models.PositiveSmallIntegerField(default=0, help_text="Percentage of positive opinions")
    neutral_pct = models.PositiveSmallIntegerField(default=0, help_text="Percentage of neutral opinions")
    negative_pct = models.PositiveSmallIntegerField(default=0, help_text="Percentage of negative opinions")
    sample_sentence = models.TextField(blank=True, null=True, help_text="Representative review sentence for aspect drill-down")

    def __str__(self):
        return f"{self.product.name} - {self.topic_name} ({self.vader_compound})"

# Create your models here.
