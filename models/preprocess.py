import re
import html
import pandas as pd
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

nltk.download("punkt", quiet=False)
nltk.download("punkt_tab", quiet=False)
nltk.download("stopwords", quiet=False)
nltk.download("wordnet", quiet=False)
nltk.download("omw-1.4", quiet=False)


class ProcessedSentence:
    """Holds one sentence and its cleaned word list."""

    def __init__(self, original: str, normalized: str, words: list[str]):
        self.original = original
        self.normalized = normalized
        self.words = words

    def __repr__(self):
        preview = self.normalized[:60] + "..." if len(self.normalized) > 60 else self.normalized
        return f"ProcessedSentence(normalized={preview!r}, " f"words={self.words})"


class ProcessedReview:
    """Holds one Amazon review and all its processed sentences."""

    def __init__(self, original_text: str, sentences: list[ProcessedSentence]):
        self.original_text = original_text
        self.sentences = sentences

    def __repr__(self):
        preview = (
            self.original_text[:80] + "..." if len(self.original_text) > 80 else self.original_text
        )
        return (
            f"ProcessedReview(\n"
            f"  original_text={preview!r},\n"
            f"  sentences=[{len(self.sentences)} sentences]\n"
            f")"
        )


_stop_words = set(stopwords.words("english"))
_lemmatizer = WordNetLemmatizer()


def _normalize(text: str) -> str:
    """
    Clean a single sentence:
      1. Decode HTML entities  (&amp; → &)
      2. Strip HTML tags        (<b>…</b> → …)
      3. Remove special chars / punctuation (keep letters, digits, spaces)
      4. Collapse whitespace
      5. Lowercase
    """
    text = html.unescape(text)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    text = text.lower()
    return text


def _tokenize_and_clean(normalized: str) -> list[str]:
    """
    Tokenize → remove stop words → lemmatize.
    Returns list of clean lemma strings.
    """
    tokens = word_tokenize(normalized)
    tokens = [t for t in tokens if t.isalpha()]
    tokens = [t for t in tokens if t not in _stop_words]
    tokens = [_lemmatizer.lemmatize(t) for t in tokens]
    return tokens


def _process_review_text(raw_text: str) -> ProcessedReview:
    """
    Full pipeline for one review string:
      raw text → sentence split → normalize → word tokenize → clean
    """
    if not isinstance(raw_text, str) or not raw_text.strip():
        return ProcessedReview(original_text=str(raw_text), sentences=[])

    raw_sentences = sent_tokenize(raw_text)

    processed_sentences = []
    for sent in raw_sentences:
        normalized = _normalize(sent)
        words = _tokenize_and_clean(normalized)
        processed_sentences.append(
            ProcessedSentence(
                original=sent,
                normalized=normalized,
                words=words,
            )
        )

    return ProcessedReview(
        original_text=raw_text,
        sentences=processed_sentences,
    )


def preprocess(csv_path: str, text_column: str = "reviewText") -> list[ProcessedReview]:
    """
    Load the CSV at *csv_path*, preprocess every review in *text_column*,
    and return a list of ProcessedReview objects.

    Parameters
    ----------
    csv_path    : path to the Amazon reviews CSV file
    text_column : name of the column that contains review text (default: 'reviewText')

    Returns
    -------
    List[ProcessedReview]
    """
    df = pd.read_csv(csv_path)

    if text_column not in df.columns:
        raise ValueError(
            f"Column '{text_column}' not found. " f"Available columns: {list(df.columns)}"
        )

    reviews: list[ProcessedReview] = []
    for raw in df[text_column]:
        reviews.append(_process_review_text(raw))

    print(f"✓ Preprocessed {len(reviews)} reviews from '{csv_path}'")
    return reviews


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        sample = [
            "This product is AMAZING!! I've been using it for 2 months &amp; it still works great. <b>Highly recommended!</b>",
            "Terrible quality... broke after 3 days. The packaging was nice though; wouldn't buy again.",
        ]

        print("── Demo mode (no CSV path supplied) ──\n")
        for raw in sample:
            review = _process_review_text(raw)
            print(review)
            for s in review.sentences:
                print("  ", s)
            print()
    else:
        path = sys.argv[1]
        col = sys.argv[2] if len(sys.argv) > 2 else "reviewText"
        results = preprocess(path, col)

        for i, r in enumerate(results[:3], 1):
            print(f"\n{'='*60}")
            print(f"Review #{i}")
            print(r)
            for s in r.sentences:
                print("  ", s)
