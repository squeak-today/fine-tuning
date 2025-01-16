# Squeak Fine-Tuning

```
fine-tuning/
├── .github/
│   └── workflows/
│       └── dataset-upload.yml     # CI for training pipeline
├── data/
│   ├── french/                    # Original data files
│   ├── spanish/                   # Cleaned and formatted data
│   └── validation/                # Test sets for model evaluation
├── src/
│   ├── data/
│   │   └── dataset.py             # Data validation
│   └── training/
│       ├── train.py               # Training script
│       └── evaluate.py            # Evaluation metrics
└── README.md
```

## Setup
Install `cohere` and `python-dotenv`.

## Add Datasets
Place `.jsonl` in `data`. CI workflow will automatically upload and train the model on it.
Use format `Language_Type__XX_Topic.jsonl`.