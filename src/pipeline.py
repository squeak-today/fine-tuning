import cohere
from dotenv import load_dotenv
import os

from data.dataset import upload_datasets
from training.train import train

def main():
    load_dotenv()
    co = cohere.ClientV2(os.getenv("COHERE_API_KEY"))

    new_datasets = upload_datasets(co)
    train(co, new_datasets)

if __name__ == "__main__":
    main()