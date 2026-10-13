# Importing libraries
import pandas as pd
import numpy as np
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.feature_extraction.text import CountVectorizer
import nltk
from nltk.corpus import stopwords
import re

# Downloading NLTK resources
nltk.download("punkt")
nltk.download("stopwords")
stop_words = set(stopwords.words("english"))

# Database
df = pd.read_csv("/kaggle/input/amazon-product-reviews-dataset/7817_1.csv")

# Assuming the texts are in the 'reviews.text' column
reviews = df["reviews.text"].values.tolist()


def preprocess_text(text):
    # Remove special characters
    text = re.sub(r"[^\w\s]", "", text.lower())
    # Remove stopwords
    tokens = [word for word in text.split() if word not in stop_words]
    return " ".join(tokens)


# Apply the preprocessing function to the 'reviews.text' column
df["cleaned_text"] = df["reviews.text"].apply(preprocess_text)

from sklearn.feature_extraction.text import CountVectorizer

# Text vectorization (Bag of Words)
vectorizer = CountVectorizer(stop_words="english")
X = vectorizer.fit_transform(reviews)

# Get the vocabulary (feature names) from the vectorizer
vocabulario = vectorizer.get_feature_names_out()


# Function to compute coherence and perplexity values for different numbers of topics
def compute_coherence_values(corpus, vectorizer, start, limit, step):
    coherence_values = []
    perplexity_values = []

    # Loop over the range of topics from start to limit, with the specified step
    for num_topics in range(start, limit, step):
        # Create an LDA model with the current number of topics
        lda_model = LatentDirichletAllocation(n_components=num_topics, random_state=42)
        lda_model.fit(corpus)

        # Compute perplexity for the current model
        perplexity = lda_model.perplexity(corpus)
        perplexity_values.append(perplexity)

        # Compute model score as an approximation for coherence
        coherence_values.append(lda_model.score(corpus))

    # Return both coherence and perplexity values
    return coherence_values, perplexity_values


# Define the range for the number of topics
start, limit, step = 2, 20, 1

# Compute coherence and perplexity values for different numbers of topics
coherence_values, perplexity_values = compute_coherence_values(X, vectorizer, start, limit, step)

# Define the number of topics
# Change this value to set the desired number of topics
# Selecting the model based on the coherence value
best_num_topics = np.argmin(perplexity_values) + start

# LDA Model
lda_model = LatentDirichletAllocation(n_components=best_num_topics, random_state=42)
lda_model.fit(X)


def display_topics(model, feature_names, no_top_words):
    # Loop through each topic in the model
    for topic_idx, topic in enumerate(model.components_):
        print(f"Topic {topic_idx}:")
        # Extract and print the top words for the current topic
        print(" ".join([feature_names[i] for i in topic.argsort()[: -no_top_words - 1 : -1]]))
        print()


# Display the topics and their top 20 words
display_topics(lda_model, vocabulario, 20)
