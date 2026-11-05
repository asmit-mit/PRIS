# Product Review Intelligence System (PRIS)

PRIS is a full-stack, decoupled aspect-based sentiment analysis (ABSA) platform designed to transform raw, unstructured e-commerce product reviews into actionable intelligence. By combining unsupervised topic modeling with lexicon-based sentiment quantification, PRIS extracts recurring thematic dimensions (e.g., *Controller Comfort*, *Working Condition*, *User Experience*) and visualizes aggregated product-level metrics inside a responsive React dashboard.

---

## Architecture Overview

```
                      ┌──────────────────────────────────────┐
                      │  Raw Review Datasets (Kaggle/Amazon) │
                      └──────────────────┬───────────────────┘
                                         │
                                         ▼
                           [ models/filter_dataset.py ]
                             • Category Slicing
                             • Text Normalization
                                         │
                                         ▼
                             [ models/pipeline.py ]
                             • Sentence Tokenization (NLTK)
                             • Unsupervised LDA Topic Modeling (scikit-learn)
                             • Polarity Quantification (VADER)
                                         │
                                         ▼
                     ┌───────────────────┴───────────────────┐
                     │ topic_sentiment.csv                   │
                     │ topic_sentiment_sentences.csv         │
                     └───────────────────┬───────────────────┘
                                         │
                                         ▼
                      [ backend/api/management/commands/ ]
                             ingest_pipeline.py
                             • Product Title Aggregation
                             • Frequency Ratio Calculation
                             • Top-2 Sentence Extraction
                                         │
                                         ▼
                             [ SQLite Database ]
                             • Product Model
                             • AspectSentiment Model
                                         │
                                         ▼
                        [ Django REST Framework API ]
                             • Server-Side Multi-Field Search
                             • Dynamic Category & Rating Filtering
                                         │
                                         ▼
                           [ React (Vite) + Tailwind ]
                             • Dynamic Category Select
                             • Aspect Drilldown Modals
                             • Floating Scroll-to-Top Navigation
```

---

## Project Structure

```
PRIS/
├── backend/
│   ├── api/
│   │   ├── management/commands/
│   │   │   └── ingest_pipeline.py   # Ingestion command with aggregation logic
│   │   ├── migrations/              # Database schema migrations
│   │   ├── models.py                # Product & AspectSentiment models
│   │   ├── serializers.py           # DRF model serializers
│   │   ├── views.py                 # ProductListView with multi-field search
│   │   └── urls.py                  # API routing
│   ├── backend/                     # Django project configuration
│   ├── manage.py
│   └── requirements.txt             # Backend dependencies (Django, DRF, etc.)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Global navigation
│   │   │   ├── ProductCard.jsx      # Product scorecard & aspect mini-bars
│   │   │   ├── TopicModal.jsx       # Modal dialog for aspect deep-dives
│   │   │   └── ScrollToTop.jsx      # Floating back-to-top button
│   │   ├── pages/
│   │   │   ├── Products.jsx         # Catalog feed with search and filters
│   │   │   ├── Pipeline.jsx         # System architecture flowchart
│   │   │   └── Statistics.jsx       # Aggregated metric analysis
│   │   ├── services/
│   │   │   └── api.js               # Axios instance & catalog endpoints
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── models/
    ├── filter_dataset.py            # Category extraction & cleaning script
    ├── pipeline.py                  # LDA modeling & VADER sentiment scoring
    └── requirements.txt             # ML dependencies (scikit-learn, nltk, etc.)
```

---

## Database Models

* **`Product`**: Stores catalog-level product records aggregated by unique title.
  * `name` (`CharField`): Unique product title.
  * `category` (`CharField`): Category slug matching `CATEGORY_CHOICES`.
  * `star_rating` (`DecimalField`): Mean star rating computed across all customer reviews.
  * `pris_score` (`DecimalField`): Mean compound sentiment score derived across all reviews.
  * `created_at` (`DateTimeField`): Initial review timestamp.
* **`AspectSentiment`**: Foreign-key linked to `Product` via `related_name="aspects"`.
  * `topic_name` (`CharField`): Formatted name of the extracted thematic dimension.
  * `vader_compound` (`DecimalField`): Mean compound polarity score (-1.0 to +1.0).
  * `positive_pct` (`IntegerField`): Percentage of topic sentences classified as positive (>= 0.05).
  * `neutral_pct` (`IntegerField`): Percentage of topic sentences classified as neutral.
  * `negative_pct` (`IntegerField`): Percentage of topic sentences classified as negative (<= -0.05).
  * `sample_sentence` (`TextField`): Up to two deduplicated, high-confidence quotes combined for inspection.

---

## Environment Setup & Installation

Due to platform-specific wheel dependencies, the project isolates data science/NLP packages from the web backend.

### 1. Data Science & Pipeline Environment (`models/`)

```bash
cd models
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
python3 -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('vader_lexicon')"
deactivate
cd ..
```

### 2. Django Backend Environment (`backend/`)

```bash
cd backend
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
python3 manage.py migrate
deactivate
cd ..
```

### 3. React Frontend (`frontend/`)

```bash
cd frontend
npm install
cd ..
```

---

## Data Pipeline Execution

> **Note on Raw Data**: Large raw CSV files (>= 100 MB) should remain in `models/` and must not be committed to GitHub.

### Step 1: Filter Raw Reviews by Category
Extract a targeted category subset (e.g., `Video_Games`) from the raw dataset:

```bash
cd models
source env/bin/activate

python3 filter_dataset.py amazon_reviews.csv Video_Games --output filtered_amazon_VG_reviews.csv
```

### Step 2: Run LDA Topic Modeling & VADER Sentiment
Segment review sentences, train an unsupervised Latent Dirichlet Allocation model, assign topic labels interactively, and calculate compound polarity:

```bash
python3 pipeline.py filtered_amazon_VG_reviews.csv --topics 5 --min-words 6 --output topic_sentiment.csv

deactivate
cd ..
```

This generates two output files in `models/`:
* `topic_sentiment.csv`: Review-level topic flags and aggregated compound scores.
* `topic_sentiment_sentences.csv`: Individual review sentences with assigned topic probabilities, compound scores, and discrete sentiment labels.

### Step 3: Ingest Processed Data into SQLite
Populate the relational database using the custom Django management command. By default, it aggregates the top 100 products by review volume if --limit argument is not mentioned; use `--limit 0` to ingest all records:

```bash
cd backend
source env/bin/activate

python3 manage.py ingest_pipeline \
  --filtered ../models/filtered_amazon_VG_reviews.csv \
  --sentiment ../models/topic_sentiment.csv \
  --sentences ../models/topic_sentiment_sentences.csv \
```

---

## Running the Application

### 1. Start the Django REST Backend
```bash
cd backend
source env/bin/activate
python3 manage.py runserver
```
* API Root: `http://127.0.0.1:8000/api/products/`
* Admin Interface: `http://127.0.0.1:8000/admin/`

### 2. Start the React Development Server
```bash
cd frontend
npm run dev
```
* Dashboard URL: `http://localhost:5173/`

---

## API Reference

### `GET /api/products/`

Retrieves a paginated list of catalog products along with their nested aspect-level sentiment metrics. Supports server-side multi-field search, category and rating filtering, ordering, and limit/offset pagination.

#### Query Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `search` | `string` | — | Case-insensitive lookup across product titles (`name`), category names, aspect topic names (`aspects__topic_name`), and sample review quotes (`aspects__sample_sentence`). |
| `category` | `string` | — | Exact category slug filter matching database choices (e.g., `Video_Games`). |
| `min_rating` | `float` | — | Filters products with an average star rating greater than or equal to the specified threshold (e.g., `4.0`). |
| `ordering` | `string` | `-created_at` | Sorts results by `star_rating`, `pris_score`, or `created_at`. Prefix with `-` for descending order (e.g., `-pris_score`). |
| `limit` | `integer` | — | Maximum number of product records to return in the current page (e.g., `?limit=20`). |
| `offset` | `integer` | `0` | The starting record index from which to return results (e.g., `?limit=20&offset=40`). |

#### Response Schema

Because `LimitOffsetPagination` is enabled, the endpoint wraps results in a paginated envelope containing navigation metadata alongside the records list:

* **`count`** (`integer`): Total number of products matching the current filter and search query.
* **`next`** (`string | null`): URL to retrieve the subsequent batch of records.
* **`previous`** (`string | null`): URL to retrieve the preceding batch of records.
* **`results`** (`array`): Array of product objects containing aggregated scores and nested `aspects`.

#### Sample Response

```json
{
    "count": 943,
    "next": "http://127.0.0.1:8000/api/products/?limit=1&offset=1",
    "previous": null,
    "results": [
        {
            "id": 4528,
            "name": "God of War 4 - PS4 [Digital Code]",
            "category": "Video_Games",
            "star_rating": "4.60",
            "pris_score": "0.31",
            "aspects": [
                {
                    "id": 2429,
                    "topic_name": "User Experience",
                    "vader_compound": 0.17,
                    "positive_pct": 57,
                    "neutral_pct": 12,
                    "negative_pct": 31,
                    "sample_sentence": "Its one of the most divisive games as far as gaming generations go, the true fans (you know the ones who have played all the GOW years ago multiple times) are now wrinkly old granpas and the new  fans aren't even really fans, you just like this one GOW game cause thats all you played and don't know better. This is most prevalent in the early segments of the game when your character isn't upgraded fully and you don't have access to dozens of powerful moves and while I absolutely love decimating my foes with those attacks, the beginning parts makes you take a step back and be cautious with your fights  the first true boss fight of the game is probably the most difficult part of the story because of this fact."
                },
                {
                    "id": 2430,
                    "topic_name": "Controller Comfort",
                    "vader_compound": 0.2952,
                    "positive_pct": 60,
                    "neutral_pct": 40,
                    "negative_pct": 0,
                    "sample_sentence": "Because they had to use visual ques just to make it work at all (yellow or red flahes). It all feels like filler and that's not a good thing."
                },
                {
                    "id": 2431,
                    "topic_name": "Price",
                    "vader_compound": 0.2399,
                    "positive_pct": 71,
                    "neutral_pct": 14,
                    "negative_pct": 14,
                    "sample_sentence": "Ive been playing Xbox for a long time now. Sets a new standard for video games."
                },
                {
                    "id": 2432,
                    "topic_name": "Family Experience",
                    "vader_compound": 0.2649,
                    "positive_pct": 60,
                    "neutral_pct": 25,
                    "negative_pct": 15,
                    "sample_sentence": "If you are a gamer, a fan of games, or have a pulse then you owe it to yourself to play this game. Boy oh boy... one of the greatest games ever made."
                },
                {
                    "id": 2433,
                    "topic_name": "Working Condition",
                    "vader_compound": -0.0338,
                    "positive_pct": 31,
                    "neutral_pct": 26,
                    "negative_pct": 43,
                    "sample_sentence": "In case you didn't know, a game is typically finished within a month before the release date, but that doesn't mean pre-order means \"early access\"... and both are bad practices anyway. I ended up buying my copy from a local store and let it sit for a few days."
                }
            ],
            "created_at": "2026-10-30"
        }
    ]
}
```