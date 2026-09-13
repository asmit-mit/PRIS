# topic_modeling.py

from __future__ import annotations
import warnings
from dataclasses import dataclass

import numpy as np
import pandas as pd
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.feature_extraction.text import CountVectorizer
from sentence_transformers import SentenceTransformer
from bertopic import BERTopic
from umap import UMAP
from hdbscan import HDBSCAN

from preprocess import preprocess, ProcessedReview, ProcessedSentence

warnings.filterwarnings("ignore")


# ──────────────────────────────────────────────
# Data containers
# ──────────────────────────────────────────────

@dataclass
class SentenceRecord:
    review_idx: int
    sent_idx:   int
    original:   str        # → BERTopic
    words:      list[str]  # → LDA


@dataclass
class TopicResult:
    sentence:         SentenceRecord
    bert_topic_id:    int
    bert_topic_label: str
    lda_topic_id:     int
    lda_topic_label:  str


# ──────────────────────────────────────────────
# Step 1 – flatten reviews → sentences
# ──────────────────────────────────────────────

def flatten_to_sentences(reviews: list[ProcessedReview]) -> list[SentenceRecord]:
    records = []
    for r_idx, review in enumerate(reviews):
        for s_idx, sent in enumerate(review.sentences):
            if not sent.words:
                continue
            records.append(SentenceRecord(
                review_idx=r_idx,
                sent_idx=s_idx,
                original=sent.original,
                words=sent.words,
            ))
    print(f"✓ Extracted {len(records)} non-empty sentences from {len(reviews)} reviews")
    return records


# ──────────────────────────────────────────────
# Step 2a – BERTopic
# ──────────────────────────────────────────────

def run_bertopic(
    records: list[SentenceRecord],
    embedding_model: str = "all-MiniLM-L6-v2",
    nr_topics: int | str = "auto",
    min_cluster_size: int = 5,
) -> tuple[BERTopic, list[int], list[float], np.ndarray]:
    docs = [r.original for r in records]

    print(f"  → Encoding {len(docs)} sentences with '{embedding_model}' …")
    encoder = SentenceTransformer(embedding_model)
    embeddings = encoder.encode(docs, show_progress_bar=True, batch_size=64)

    umap_model = UMAP(
        n_neighbors=15,
        n_components=5,
        min_dist=0.0,
        metric="cosine",
        random_state=42,
    )
    hdbscan_model = HDBSCAN(
        min_cluster_size=min_cluster_size,
        metric="euclidean",
        cluster_selection_method="eom",
        prediction_data=True,
    )

    topic_model = BERTopic(
        umap_model=umap_model,
        hdbscan_model=hdbscan_model,
        nr_topics=nr_topics,
        verbose=True,
    )

    topics, probs = topic_model.fit_transform(docs, embeddings)

    n_topics = len(set(topics)) - (1 if -1 in topics else 0)
    n_outliers = list(topics).count(-1)
    print(f"✓ BERTopic found {n_topics} topics ({n_outliers} outliers)")
    return topic_model, topics, probs, embeddings


# ──────────────────────────────────────────────
# Step 2b – LDA
# ──────────────────────────────────────────────

def run_lda(
    records: list[SentenceRecord],
    n_topics: int = 10,
    max_features: int = 5_000,
    random_state: int = 42,
) -> tuple[LatentDirichletAllocation, CountVectorizer, np.ndarray, list[int]]:
    # Join already-cleaned words (lemmatized, no stopwords)
    corpus = [" ".join(r.words) for r in records]

    vectorizer = CountVectorizer(max_features=max_features)
    dtm = vectorizer.fit_transform(corpus)

    lda_model = LatentDirichletAllocation(
        n_components=n_topics,
        random_state=random_state,
        n_jobs=-1,
    )
    doc_topic = lda_model.fit_transform(dtm)
    assignments = doc_topic.argmax(axis=1).tolist()

    print(f"✓ LDA fitted with {n_topics} topics over {len(corpus)} sentences")
    return lda_model, vectorizer, doc_topic, assignments


# ──────────────────────────────────────────────
# Helpers – human-readable topic labels
# ──────────────────────────────────────────────

def get_bert_label(topic_model: BERTopic, topic_id: int, top_n: int = 3) -> str:
    if topic_id == -1:
        return "outlier"
    words = [w for w, _ in topic_model.get_topic(topic_id)[:top_n]]
    return "_".join(words)


def get_lda_label(
    lda_model: LatentDirichletAllocation,
    vectorizer: CountVectorizer,
    topic_id: int,
    top_n: int = 3,
) -> str:
    feature_names = vectorizer.get_feature_names_out()
    top_idx = lda_model.components_[topic_id].argsort()[-top_n:][::-1]
    return "_".join(feature_names[i] for i in top_idx)


# ──────────────────────────────────────────────
# Step 3 – combine results
# ──────────────────────────────────────────────

def combine_results(
    records: list[SentenceRecord],
    bert_topics: list[int],
    bert_model: BERTopic,
    lda_assignments: list[int],
    lda_model: LatentDirichletAllocation,
    vectorizer: CountVectorizer,
) -> list[TopicResult]:
    results = []
    for rec, bt, lt in zip(records, bert_topics, lda_assignments):
        results.append(TopicResult(
            sentence=rec,
            bert_topic_id=bt,
            bert_topic_label=get_bert_label(bert_model, bt),
            lda_topic_id=lt,
            lda_topic_label=get_lda_label(lda_model, vectorizer, lt),
        ))
    return results


# ──────────────────────────────────────────────
# Display & export
# ──────────────────────────────────────────────

def print_topic_summary(
    bert_model: BERTopic,
    lda_model: LatentDirichletAllocation,
    vectorizer: CountVectorizer,
    n_words: int = 8,
) -> None:
    print("\n── BERTopic topic summary ──")
    print(bert_model.get_topic_info().to_string(index=False))

    print("\n── LDA topic summary ──")
    feature_names = vectorizer.get_feature_names_out()
    rows = []
    for tid, comp in enumerate(lda_model.components_):
        top_idx = comp.argsort()[-n_words:][::-1]
        rows.append({
            "topic":     tid,
            "top_words": " | ".join(feature_names[top_idx]),
        })
    print(pd.DataFrame(rows).to_string(index=False))


def results_to_dataframe(results: list[TopicResult]) -> pd.DataFrame:
    return pd.DataFrame([{
        "review_idx":       r.sentence.review_idx,
        "sent_idx":         r.sentence.sent_idx,
        "original":         r.sentence.original,
        "bert_topic_id":    r.bert_topic_id,
        "bert_topic_label": r.bert_topic_label,
        "lda_topic_id":     r.lda_topic_id,
        "lda_topic_label":  r.lda_topic_label,
    } for r in results])


# ──────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────

if __name__ == "__main__":
    import sys

    csv_path = sys.argv[1] if len(sys.argv) > 1 else None

    # ── 1. Preprocess ──
    if csv_path:
        reviews = preprocess(csv_path)
    else:
        from preprocess import _process_review_text
        samples = [
            "This product is AMAZING!! I've been using it for 2 months &amp; it still works great. <b>Highly recommended!</b>",
            "Terrible quality... broke after 3 days. The packaging was nice though; wouldn't buy again.",
            "Battery life is outstanding. Charges quickly and lasts all day easily.",
            "Screen resolution is poor. Colors look washed out compared to competitors.",
            "Customer service was helpful and resolved my issue within 24 hours.",
        ]
        reviews = [_process_review_text(s) for s in samples]

    # ── 2. Flatten ──
    records = flatten_to_sentences(reviews)

    if len(records) < 10:
        print("⚠ Very few sentences — results won't be meaningful. Supply a real CSV.")

    # ── 3. BERTopic ──
    print("\n── Running BERTopic ──")
    bert_model, bert_topics, bert_probs, embeddings = run_bertopic(
        records,
        embedding_model="all-MiniLM-L6-v2",
        min_cluster_size=max(2, len(records) // 20),
    )

    # ── 4. LDA ──
    print("\n── Running LDA ──")
    lda_model, vectorizer, doc_topic_matrix, lda_assignments = run_lda(
        records,
        n_topics=10,
    )

    # ── 5. Combine & display ──
    results = combine_results(
        records, bert_topics, bert_model,
        lda_assignments, lda_model, vectorizer,
    )

    print_topic_summary(bert_model, lda_model, vectorizer)

    df = results_to_dataframe(results)
    print("\n── Sample output ──")
    print(df[["original", "bert_topic_label", "lda_topic_label"]].head(10).to_string(index=False))

    df.to_csv("topic_results.csv", index=False)
    print("\n✓ Saved → topic_results.csv")
