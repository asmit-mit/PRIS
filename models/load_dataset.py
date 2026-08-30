import kagglehub
from kagglehub import KaggleDatasetAdapter

file_path = "amazon_reviews.csv"

df = kagglehub.load_dataset(
    KaggleDatasetAdapter.PANDAS,
    "rogate16/amazon-reviews-2018-full-dataset",
    file_path,
)

print("First 5 records:")
print(df.head())
