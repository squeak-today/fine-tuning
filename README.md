# Squeak Fine-Tuning

```
fine-tuning/
├── .github/
│   └── workflows/
│       └── train.yml              # CI for training pipeline
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
Place `.jsonl` in `data`.
Use format `Language_Type_XX_Topic.jsonl`.

CI workflow runs `pipeline.py`, which uploads all new datasets and trains a model on them.