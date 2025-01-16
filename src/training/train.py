import cohere
from cohere.finetuning import (
    Hyperparameters,
    Settings,
    FinetunedModel,
    BaseModel,
    WandbConfig,
)

def train(co_client, dataset_ids):
    for dataset_id in dataset_ids:
        chat_dataset_response = co_client.datasets.get(id=dataset_id)
        chat_dataset = chat_dataset_response.dataset
        model_name = chat_dataset.name

        create_response = co_client.finetuning.create_finetuned_model(
            request=FinetunedModel(
                name=model_name,
                settings=Settings(
                    base_model=BaseModel(
                        base_type="BASE_TYPE_CHAT",
                    ),
                    dataset_id=chat_dataset.id
                ),
            ),
        )