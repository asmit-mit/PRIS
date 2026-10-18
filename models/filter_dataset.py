import argparse
import re
from pathlib import Path

import nltk
import pandas as pd
from nltk.corpus import stopwords

nltk.download("stopwords", quiet=True)
STOP_WORDS = set(stopwords.words("english"))

TEXT_COLUMN = "reviewText"
CATEGORY_COLUMN = "category"


def preprocess_text(text):
    text = re.sub(r"[^\w\s]", "", str(text).lower())
    tokens = [word for word in text.split() if word not in STOP_WORDS]
    return " ".join(tokens)


def preprocess_category(dataset_path, category=None, output_path=None):
    df = pd.read_csv(dataset_path)

    if category is not None:
        available = set(df[CATEGORY_COLUMN].dropna().unique())
        if category not in available:
            raise ValueError(f"Unknown category '{category}'. Available: {sorted(available)}")
        df = df[df[CATEGORY_COLUMN] == category].copy()

    df = df.dropna(subset=[TEXT_COLUMN])
    df["cleaned_text"] = df[TEXT_COLUMN].apply(preprocess_text)

    df = df[df["cleaned_text"].str.strip() != ""]
    df = df.reset_index(drop=True)

    if output_path is None:
        output_path = f"cleaned_{category if category is not None else 'all'}.csv"
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_path, index=False)

    label = f"'{category}'" if category is not None else "all categories"
    print(f"Saved {len(df)} cleaned rows for {label} to {output_path}")
    return output_path


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Clean review text, optionally for one category")
    parser.add_argument("dataset_path")
    parser.add_argument("category", nargs="?", default=None, help="omit to keep all categories")
    parser.add_argument("--output", default=None, help="output CSV path")
    args = parser.parse_args()

    preprocess_category(args.dataset_path, args.category, args.output)
