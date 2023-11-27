# Backend

## Setup

### Environment variables

Create a `.env` file in the root of the backend directory with the following variables:

```
OPENAI_API_KEY={your openai api key}
POCKETBASE_ADMIN_EMAIL={your pocketbase admin email}
POCKETBASE_ADMIN_PASSWORD={your pocketbase admin password}
PUBLIC_POCKETBASE_URL=http://ee-pocketbase:8090
PUBLIC_FRONTEND_URL=http://ee-frontend:3000
PUBLIC_QDRANT_URL=http://ee-qdrant:6333
PUBLIC_PROMETHEUS_URL=http://ee-prometheus:9090
RUNNING_TESTS=false // if you want to run tests set to true
```

### Running the backend

To install the required packages for this plugin and run the service locally, run the following commands:

```
pip install -r requirements.txt

uvicorn main:app --reload --host 0.0.0.0 --port 5003 --timeout-keep-alive 360
```
