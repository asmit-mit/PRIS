import argparse

import joblib
import nltk
import numpy as np
import pandas as pd
from nltk.tokenize import sent_tokenize
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.feature_extraction.text import CountVectorizer
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from filter_dataset import preprocess_text

nltk.download("punkt_tab", quiet=True)


def load_reviews(args):
    df = pd.read_csv(args.csv_path)

    for column in (args.text_column, args.cleaned_column, args.product_column):
        if column not in df.columns:
            raise ValueError(f"Column '{column}' not found. Available: {list(df.columns)}")

    df = df.dropna(subset=[args.text_column, args.cleaned_column]).copy()
    df = df[df[args.cleaned_column].astype(str).str.strip() != ""]
    df = df.reset_index(drop=True)
    df["review_id"] = df.index
    return df


def fit_lda(df, args):
    """Fit LDA on whole reviews (the cleaned text)."""
    vectorizer = CountVectorizer(stop_words="english", min_df=args.min_df, max_df=args.max_df)
    X = vectorizer.fit_transform(df[args.cleaned_column].astype(str))
    print(f"Vocabulary size: {X.shape[1]}")

    lda_model = LatentDirichletAllocation(
        n_components=args.topics,
        max_iter=args.max_iter,
        learning_method="batch",
        random_state=42,
        n_jobs=-1,
    )
    lda_model.fit(X)
    return lda_model, vectorizer


def get_top_words(lda_model, vectorizer, no_top_words):
    feature_names = vectorizer.get_feature_names_out()
    return [
        [feature_names[i] for i in topic.argsort()[: -no_top_words - 1 : -1]]
        for topic in lda_model.components_
    ]


def ask_topic_names(topic_words, preset_names):
    """Show each topic's top words and ask the user to name it, one by one."""
    names = []
    for idx, words in enumerate(topic_words):
        if preset_names:
            name = preset_names[idx]
        else:
            print(f"\nTopic {idx}: {' '.join(words)}")
            try:
                name = input(f"Name for topic {idx} (press Enter to keep 'topic_{idx}'): ").strip()
            except EOFError:
                name = ""

        name = name or f"topic_{idx}"
        if name in names:  # column names must be unique
            name = f"{name}_{idx}"
        names.append(name)

    print("\nTopic names:", ", ".join(f"{i}={n}" for i, n in enumerate(names)))
    return names


def split_into_sentences(df, text_column, min_words):
    """Split the original review text into sentences, keeping the review id."""
    sent_df = df[["review_id", text_column]].copy()
    sent_df["sentence"] = sent_df[text_column].astype(str).apply(sent_tokenize)
    sent_df = sent_df.explode("sentence").dropna(subset=["sentence"])
    sent_df = sent_df[sent_df["sentence"].str.split().str.len() >= min_words]
    return sent_df[["review_id", "sentence"]].reset_index(drop=True)


def assign_topics(sent_df, lda_model, vectorizer, min_prob):
    """Give every sentence its dominant topic (same cleaning as training)."""
    cleaned = sent_df["sentence"].apply(preprocess_text)
    X = vectorizer.transform(cleaned)

    # Sentences with no word from the vocabulary cannot be assigned a topic
    has_words = np.asarray(X.sum(axis=1)).ravel() > 0
    sent_df = sent_df[has_words].copy()
    if sent_df.empty:
        raise ValueError("No sentence contains words from the vocabulary. Try a lower --min-df.")

    probs = lda_model.transform(X[has_words])
    sent_df["topic"] = probs.argmax(axis=1)
    sent_df["topic_prob"] = probs.max(axis=1)

    sent_df = sent_df[sent_df["topic_prob"] >= min_prob]
    return sent_df.reset_index(drop=True)


def label_from_compound(compound):
    if compound >= 0.05:
        return "positive"
    if compound <= -0.05:
        return "negative"
    return "neutral"


def score_sentiment(sent_df):
    """VADER on the original sentence (it needs punctuation, caps and negations)."""
    analyzer = SentimentIntensityAnalyzer()
    sent_df = sent_df.copy()
    sent_df["compound"] = [analyzer.polarity_scores(s)["compound"] for s in sent_df["sentence"]]
    sent_df["label"] = [label_from_compound(c) for c in sent_df["compound"]]
    return sent_df


def build_output(df, sent_df, topic_names, product_column, agg):
    num_topics = len(topic_names)
    review_ids = df["review_id"]

    by_review_topic = sent_df.groupby(["review_id", "topic"])["compound"]
    scores = by_review_topic.agg(agg).unstack("topic").reindex(columns=range(num_topics))
    counts = by_review_topic.size().unstack("topic").reindex(columns=range(num_topics))

    scores = scores.reindex(review_ids).round(4)
    counts = counts.reindex(review_ids)

    # One-hot: 1 if the review has at least one sentence in the topic
    flags = counts.fillna(0).gt(0).astype(int)

    flags.columns = topic_names
    scores.columns = [f"{name}_sentiment" for name in topic_names]

    by_review = sent_df.groupby("review_id")["compound"]
    total = by_review.agg(agg).reindex(review_ids).round(4)
    mean = by_review.mean().reindex(review_ids)

    out = pd.DataFrame({"review_id": review_ids.values, "product_name": df[product_column].values})
    out = pd.concat([out, flags.reset_index(drop=True), scores.reset_index(drop=True)], axis=1)
    out["total_sentiment"] = total.values
    out["total_label"] = [label_from_compound(m) if pd.notna(m) else "NA" for m in mean.values]
    return out


def run_pipeline(args):
    df = load_reviews(args)
    print(f"Loaded {len(df)} reviews from {args.csv_path}")

    # 1. Topic modelling
    lda_model, vectorizer = fit_lda(df, args)

    # 2. Ask the user to name each topic
    topic_words = get_top_words(lda_model, vectorizer, args.top_words)
    topic_names = ask_topic_names(topic_words, args.topic_names)

    # 3. Sentences -> topic
    sent_df = split_into_sentences(df, args.text_column, args.min_words)
    print(f"\nSplit into {len(sent_df)} sentences")
    sent_df = assign_topics(sent_df, lda_model, vectorizer, args.min_prob)
    print(f"{len(sent_df)} sentences were assigned a topic")

    # 4. Sentiment per sentence
    sent_df = score_sentiment(sent_df)
    sent_df["topic_name"] = sent_df["topic"].map(dict(enumerate(topic_names)))

    sentence_path = args.output.replace(".csv", "_sentences.csv")
    sent_df.to_csv(sentence_path, index=False)
    print(f"Saved sentence-level results to {sentence_path}")
    print(sent_df.groupby("topic_name")["label"].value_counts().unstack(fill_value=0))

    # 5. Final review-level table
    out = build_output(df, sent_df, topic_names, args.product_column, args.agg)
    out.to_csv(args.output, index=False, na_rep="NA")
    print(f"\nSaved review-level table ({len(out)} rows) to {args.output}")

    if args.save_model:
        joblib.dump(
            {"vectorizer": vectorizer, "lda": lda_model, "topic_names": topic_names},
            args.save_model,
        )
        print(f"Saved model to {args.save_model}")

    return out


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Topics -> sentence topics -> VADER sentiment per topic")
    parser.add_argument("csv_path", help="CSV produced by preprocess.py")
    parser.add_argument("--topics", type=int, required=True, help="number of topics")
    parser.add_argument("--topic-names", nargs="+", default=None,
                        help="skip the prompts and give all topic names in order")
    parser.add_argument("--product-column", default="itemName")
    parser.add_argument("--text-column", default="reviewText")
    parser.add_argument("--cleaned-column", default="cleaned_text")
    parser.add_argument("--min-df", type=int, default=5, help="drop words in fewer than this many reviews")
    parser.add_argument("--max-df", type=float, default=0.5, help="drop words in more than this fraction of reviews")
    parser.add_argument("--max-iter", type=int, default=50)
    parser.add_argument("--top-words", type=int, default=15)
    parser.add_argument("--min-words", type=int, default=3, help="drop sentences shorter than this")
    parser.add_argument("--min-prob", type=float, default=0.0,
                        help="only keep sentences whose top topic probability is at least this")
    parser.add_argument("--agg", choices=["mean", "sum"], default="mean",
                        help="how to combine several sentences of one topic in a review")
    parser.add_argument("--output", default="topic_sentiment.csv")
    parser.add_argument("--save-model", default=None, help="optional path, e.g. model.joblib")

    arguments = parser.parse_args()
    if arguments.topic_names and len(arguments.topic_names) != arguments.topics:
        parser.error("--topic-names must have exactly as many names as --topics")

    run_pipeline(arguments)
