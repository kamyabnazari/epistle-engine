#!/bin/bash
# This is a script that will be run at the start of the container.

# Download transformers model
python -c "from transformers import AutoModel; AutoModel.from_pretrained('distilbert-base-uncased')"

# Start the application
uvicorn main:app --host 0.0.0.0 --port 5003