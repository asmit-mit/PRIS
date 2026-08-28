# backend/api/management/commands/seed_data.py

from django.core.management.base import BaseCommand
from api.models import Product, AspectSentiment

class Command(BaseCommand):
    help = 'Populates the database with realistic mock Amazon electronics reviews and ABSA metrics'

    def handle(self, *args, **kwargs):
        self.stdout.write("Flushing old product data...")
        Product.objects.all().delete()

        mock_data = [
            {
                "name": "Sony WH-1000XM5 Wireless Headphones",
                "category": "Audio",
                "star_rating": 4.40,
                "pris_score": 0.68,
                "ai_summary": "Exceptional active noise cancellation and industry-leading battery performance. Minor complaints focus on bulky non-folding hinges and microphone isolation in windy conditions.",
                "aspects": [
                    {"topic_name": "Active Noise Cancellation", "vader_compound": 0.84, "positive_pct": 88, "neutral_pct": 8, "negative_pct": 4, "sample_sentence": "The ANC completely isolates airplane engine drone without any perceptible cabin pressure."},
                    {"topic_name": "Battery Life", "vader_compound": 0.72, "positive_pct": 80, "neutral_pct": 14, "negative_pct": 6, "sample_sentence": "I easily get over 30 hours of continuous playback on a single charge with ANC enabled."},
                    {"topic_name": "Microphone Clarity", "vader_compound": -0.28, "positive_pct": 32, "neutral_pct": 28, "negative_pct": 40, "sample_sentence": "Microphone voice pickup sounds slightly muffled and struggles outdoors in windy weather."},
                    {"topic_name": "Comfort & Fit", "vader_compound": 0.54, "positive_pct": 74, "neutral_pct": 16, "negative_pct": 10, "sample_sentence": "The redesigned headband padding distributes weight evenly for all-day office wear."},
                    {"topic_name": "Hinge Durability", "vader_compound": -0.42, "positive_pct": 20, "neutral_pct": 30, "negative_pct": 50, "sample_sentence": "The new design no longer folds inwards, making the carrying case unnecessarily bulky."}
                ]
            },
            {
                "name": "Logitech MX Master 3S Wireless Mouse",
                "category": "Computers",
                "star_rating": 4.70,
                "pris_score": 0.81,
                "ai_summary": "Top-tier ergonomic workstation mouse praised for whisper-quiet clicks and electromagnetic MagSpeed scrolling. Occasional friction noted with Logi Options+ software syncing.",
                "aspects": [
                    {"topic_name": "Ergonomics", "vader_compound": 0.91, "positive_pct": 94, "neutral_pct": 4, "negative_pct": 2, "sample_sentence": "The thumb rest and sculpted shape cured my wrist fatigue during 8-hour programming shifts."},
                    {"topic_name": "MagSpeed Scroll Wheel", "vader_compound": 0.85, "positive_pct": 90, "neutral_pct": 7, "negative_pct": 3, "sample_sentence": "Scrolling through thousands of lines of code in freewheel mode is effortless and precise."},
                    {"topic_name": "Battery & USB-C", "vader_compound": 0.76, "positive_pct": 82, "neutral_pct": 12, "negative_pct": 6, "sample_sentence": "A 3-minute quick charge via USB-C easily powers through an entire workday."},
                    {"topic_name": "Software Configuration", "vader_compound": -0.15, "positive_pct": 42, "neutral_pct": 28, "negative_pct": 30, "sample_sentence": "Logi Options+ occasionally consumes excess background memory and drops custom profile bindings."}
                ]
            },
            {
                "name": "Kindle Paperwhite (11th Gen - 16 GB)",
                "category": "Electronics",
                "star_rating": 4.20,
                "pris_score": 0.55,
                "ai_summary": "Crisp 300 ppi glare-free e-ink display and adjustable warm lighting make it ideal for reading. Some users report minor sluggishness during home-screen store browsing.",
                "aspects": [
                    {"topic_name": "Display & Warm Light", "vader_compound": 0.88, "positive_pct": 91, "neutral_pct": 6, "negative_pct": 3, "sample_sentence": "The adjustable warm light color temperature is gentle on eyes during late-night reading sessions."},
                    {"topic_name": "Battery Longevity", "vader_compound": 0.80, "positive_pct": 85, "neutral_pct": 10, "negative_pct": 5, "sample_sentence": "Reading 45 minutes daily, I only need to recharge every 7 to 8 weeks."},
                    {"topic_name": "UI Responsiveness", "vader_compound": -0.38, "positive_pct": 25, "neutral_pct": 30, "negative_pct": 45, "sample_sentence": "Typing on the on-screen keyboard and browsing the bookstore library feels noticeably sluggish."},
                    {"topic_name": "Waterproofing", "vader_compound": 0.65, "positive_pct": 78, "neutral_pct": 18, "negative_pct": 4, "sample_sentence": "IPX8 rating provides complete peace of mind when reading by the pool or in the tub."}
                ]
            },
            {
                "name": "Fitbit Charge 6 Fitness Tracker",
                "category": "Wearables",
                "star_rating": 3.60,
                "pris_score": -0.12,
                "ai_summary": "Accurate biometric sensors and heart rate tracking undermined by mandatory Google account migration issues and fragile strap attachments.",
                "aspects": [
                    {"topic_name": "Heart Rate Accuracy", "vader_compound": 0.62, "positive_pct": 72, "neutral_pct": 18, "negative_pct": 10, "sample_sentence": "Heart rate tracking during HIIT sessions matches chest strap readings very closely."},
                    {"topic_name": "Sync & App Ecosystem", "vader_compound": -0.78, "positive_pct": 12, "neutral_pct": 16, "negative_pct": 72, "sample_sentence": "Bluetooth sync drops repeatedly and the Google account requirement stripped several community features."},
                    {"topic_name": "Strap & Build Quality", "vader_compound": -0.65, "positive_pct": 18, "neutral_pct": 20, "negative_pct": 62, "sample_sentence": "The proprietary silicone strap clip cracked after just three months of daily gym use."},
                    {"topic_name": "Display Brightness", "vader_compound": 0.45, "positive_pct": 64, "neutral_pct": 22, "negative_pct": 14, "sample_sentence": "AMOLED panel remains legible even in bright outdoor sunlight."}
                ]
            },
            {
                "name": "Logitech MX Master 3S Wireless Mouse",
                "category": "Computers",
                "star_rating": 3.9,
                "pris_score": 0.01,
                "ai_summary": "Users highlight precise tracking and quiet clicking mechanisms, but feedback is largely divided and indifferent regarding weight distribution and thumb wheel resistance for daily office tasks.",
                "aspects": [
                    {"topic_name": "Thumb Scroll Wheel", "vader_compound": 0.02, "positive_pct": 18, "neutral_pct": 68, "negative_pct": 14, "sample_sentence": "The side thumb wheel operates as specified for horizontal navigation with standard resistance."},
                    {"topic_name": "Ergonomic Weight & Form", "vader_compound": -0.01, "positive_pct": 20, "neutral_pct": 65, "negative_pct": 15, "sample_sentence": "The mouse chassis weighs around 141 grams which feels standard compared to previous revisions."},
                    {"topic_name": "Quiet Click Switches", "vader_compound": 0.58, "positive_pct": 82, "neutral_pct": 12, "negative_pct": 6, "sample_sentence": "The dampening on the primary left and right click buttons significantly reduces acoustic noise."},
                    {"topic_name": "Bluetooth Connection Latency", "vader_compound": -0.44, "positive_pct": 12, "neutral_pct": 28, "negative_pct": 60, "sample_sentence": "Occasional stutter and polling rate drops occur when connected via multi-device Bluetooth."},
                ],
            },
        ]

        for item in mock_data:
            aspects_data = item.pop("aspects")
            product = Product.objects.create(**item)
            for aspect in aspects_data:
                AspectSentiment.objects.create(product=product, **aspect)

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {len(mock_data)} products and their aspect sentiment metrics."))