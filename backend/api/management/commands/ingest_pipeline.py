import os
import pandas as pd
from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_datetime, parse_date
from api.models import Product, AspectSentiment


class Command(BaseCommand):
    help = "Ingest pipeline CSV outputs into Product and AspectSentiment models"

    def add_arguments(self, parser):
        parser.add_argument(
            "--filtered",
            default="filtered_amazon_VG_reviews.csv",
            help="Path to filtered reviews CSV",
        )
        parser.add_argument(
            "--sentiment",
            default="topic_sentiment.csv",
            help="Path to topic sentiment CSV",
        )
        parser.add_argument(
            "--sentences",
            default="topic_sentiment_sentences.csv",
            help="Path to topic sentiment sentences CSV",
        )
        parser.add_argument(
            "--limit",
            type=int,
            default=100,
            help="Limit number of unique products to ingest (0 for all)",
        )

    def clean_and_format_sentence(self, s):
        s = s.strip()
        if not s.endswith(('.', '!', '?')):
            return s + '.'
        return s

    def handle(self, *args, **options):
        self.stdout.write("Loading CSV datasets...")
        df_filtered = pd.read_csv(options["filtered"])
        df_ts = pd.read_csv(options["sentiment"])
        df_tss = pd.read_csv(options["sentences"])
        # df_filtered.dropna()
        # df_ts.dropna()
        # df_tss.dropna()

        # Identify dynamic topic columns
        topic_cols = [
            c
            for c in df_ts.columns
            if c.endswith("_sentiment") and c != "total_sentiment"
        ]
        topic_names = [c.replace("_sentiment", "") for c in topic_cols]
        self.stdout.write(f"Detected dynamic topics: {topic_names}")

        # Ensure review_id alignment
        if "review_id" not in df_filtered.columns:
            df_filtered["review_id"] = df_filtered.index

        # Group by product name for aggregated product-level metrics
        grouped = df_ts.groupby("product_name")
        product_counts = grouped.size().sort_values(ascending=False)
        
        target_products = (
            product_counts.index
            if options["limit"] == 0
            else product_counts.head(options["limit"]).index
        )
        # print(options["limit"])

        # Extract categories present in the incoming batch
        incoming_categories = list(df_filtered['category'].dropna().unique())

        self.stdout.write(
            f"Flushing existing database records for categories: {', '.join(incoming_categories)}..."
        )
        # Delete only aspects and products matching the incoming category/categories
        AspectSentiment.objects.filter(product__category__in=incoming_categories).delete()
        Product.objects.filter(category__in=incoming_categories).delete()

        aspects_to_create = []

        self.stdout.write(
            f"Processing {len(target_products)} target products..."
        )

        for prod_name in target_products:
            # 1. Product review records
            prod_ts = df_ts[df_ts["product_name"] == prod_name]
            review_ids = prod_ts["review_id"].tolist()
            prod_filtered = df_filtered[
                df_filtered["review_id"].isin(review_ids)
            ]

            # Extract dynamic category scalar from CSV
            category = "Any"
            if not prod_filtered.empty and "category" in prod_filtered.columns:
                cat_series = prod_filtered["category"].dropna()
                if not cat_series.empty:
                    category = str(cat_series.iloc[0]).strip()

            # Aggregate product-level star rating safely
            raw_rating = prod_filtered["rating"].mean() if not prod_filtered.empty else 0.0
            avg_rating = round(float(raw_rating), 2) if pd.notna(raw_rating) else 0.0

            # Aggregate product-level PRIS score safely against NaN
            raw_pris = prod_ts["total_sentiment"].mean() if not prod_ts.empty else 0.0
            if pd.isna(raw_pris):
                continue
            avg_pris = round(float(raw_pris), 4) if pd.notna(raw_pris) else 0.0

            # Date parsing
            created_at = None
            if (
                not prod_filtered.empty
                and "reviewTime" in prod_filtered.columns
            ):
                raw_time = str(prod_filtered["reviewTime"].dropna().iloc[0])
                created_at = parse_datetime(raw_time) or parse_date(raw_time)
            # print(prod_name, category, avg_rating, avg_pris, created_at)
            # Save Product
            product = Product.objects.create(
                name=prod_name,
                category=category,
                star_rating=avg_rating,
                pris_score=avg_pris,
                created_at=created_at,
            )

            # 2. AspectSentiment aggregation for this product
            prod_sentences = df_tss[df_tss["review_id"].isin(review_ids)]

            for topic in topic_names:
                topic_sents = prod_sentences[
                    prod_sentences["topic_name"] == topic
                ]
                if topic_sents.empty:
                    continue

                total_sents = len(topic_sents)
                pos_count = (topic_sents["label"] == "positive").sum()
                neu_count = (topic_sents["label"] == "neutral").sum()
                neg_count = (topic_sents["label"] == "negative").sum()

                pos_pct = round((pos_count / total_sents) * 100)
                neu_pct = round((neu_count / total_sents) * 100)
                neg_pct = round((neg_count / total_sents) * 100)

                vader_compound = round(float(topic_sents["compound"].mean()), 4)

                # Pick the 2 highest-confidence sentences as sample
                if not topic_sents.empty:
                    # Deduplicate in case identical review sentences exist, sort by confidence, take up to 2
                    top_sentences = (
                        topic_sents.sort_values(by="topic_prob", ascending=False)
                        .drop_duplicates(subset=["sentence"])
                        .head(2)["sentence"]
                        .tolist()
                    )

                    # Join the sentences with a clean space
                    sample_sentence = " ".join(self.clean_and_format_sentence(s) for s in top_sentences)

                aspects_to_create.append(
                    AspectSentiment(
                        product=product,
                        topic_name=topic.replace("_", " "),
                        vader_compound=vader_compound,
                        positive_pct=pos_pct,
                        neutral_pct=neu_pct,
                        negative_pct=neg_pct,
                        sample_sentence=sample_sentence,
                    )
                )

        AspectSentiment.objects.bulk_create(aspects_to_create)
        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully ingested {len(target_products)} products and {len(aspects_to_create)} aspects."
            )
        )