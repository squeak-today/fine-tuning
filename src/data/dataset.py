import cohere
from dotenv import load_dotenv
import os
from pathlib import Path

import json
import glob
import hashlib
from datetime import datetime

def get_file_hash(filepath):
    """Calculate MD5 hash of file to detect changes"""
    with open(filepath, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()

def load_upload_history():
    """Load history of uploaded datasets"""
    history_file = Path('Dataset_History.json')
    if history_file.exists():
        with open(history_file, 'r') as f:
            return json.load(f)
    return {}

def save_upload_history(history):
    """Save upload history to JSON file"""
    with open('Dataset_History.json', 'w') as f:
        json.dump(history, f, indent=2)

def upload_dataset(filepath, co_client, version=None):
    """Upload single dataset to Cohere with optional version number"""
    name = Path(filepath).stem
    if version is not None:
        name = f"{name}_v{version}"
    
    chat_dataset = co_client.datasets.create(
        name=name,
        data=open(filepath, "rb"),
        type="chat-finetune-input",
    )
    return chat_dataset.id

def get_next_version(history, filepath):
    """Get the next version number for a filepath"""
    if filepath not in history:
        return 1
    return history[filepath][-1]['version'] + 1

def main():
    load_dotenv()

    co = cohere.ClientV2(os.getenv("COHERE_API_KEY"))
    history = load_upload_history()
    jsonl_files = glob.glob("data/**/*.jsonl", recursive=True)
    new_uploads = False

    for filepath in jsonl_files:
        current_hash = get_file_hash(filepath)
        
        if filepath not in history:
            try:
                dataset_id = upload_dataset(filepath, co, version=1)
                history[filepath] = [{
                    'hash': current_hash,
                    'dataset_id': dataset_id,
                    'version': 1,
                    'last_upload': datetime.now().isoformat()
                }]
                new_uploads = True
                print(f"Successfully uploaded new file {filepath} as dataset {dataset_id} (v1)")
            except Exception as e:
                print(f"Error uploading {filepath}: {str(e)}")
        
        elif history[filepath][-1]['hash'] != current_hash:
            try:
                next_version = get_next_version(history, filepath)
                dataset_id = upload_dataset(filepath, co, version=next_version)
                
                history[filepath].append({
                    'hash': current_hash,
                    'dataset_id': dataset_id,
                    'version': next_version,
                    'last_upload': datetime.now().isoformat()
                })
                new_uploads = True
                print(f"Successfully uploaded modified {filepath} as dataset {dataset_id} (v{next_version})")
            except Exception as e:
                print(f"Error uploading {filepath}: {str(e)}")
    
    if new_uploads:
        save_upload_history(history)
        print("Upload history updated.")
    else:
        print("No new uploads found.")

if __name__ == "__main__":
    main()