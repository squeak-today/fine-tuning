# Squeak Fine-Tuning

```
fine-tuning/
├── .github/
│   └── workflows/
│       └── train.yml              # CI for training pipeline
├── data/
│   ├── tavily/                    # Tavily Response Data
│   │   ├── basketball/
│   │   ├── politics/
│   │   └── ...
│   └── datasets/
│       ├── french/                # Original data files
│       ├── spanish/               # Cleaned and formatted data
│       └── ...
├── src/
│   ├── data/
│   │   └── dataset.py             # Data validation
│   ├── training/
│   │   └── train.py               # Training script
│   └── pipeline.py                    # Upload datasets and train models
├── mouse/
│   └── ...                        # Local web app for fine-tuning.
└── README.md
```

## Setup
Install `cohere` and `python-dotenv`.

## Add Datasets
Place `.jsonl` in `data`.
Use format `Language_Type_XX_Topic.jsonl`.

CI workflow runs `pipeline.py`, which uploads all new datasets and trains a model on them.
If you just want to update a dataset and not run the CI/CD, then add `[skip ci]` to the commit message.

If desired, pipeline.py should be run from root directory.

## Mouse
A local react web app to create fine tune datasets.