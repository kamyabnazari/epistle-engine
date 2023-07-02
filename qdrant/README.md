# Qdrant

## Setup

### Environment variables

Create a `.env` file in the root of the backend directory with the following variables:

```
QDRANT_API_KEY={your qdrant api key}
```

### Running Qdrant

Use docker compose to create Qdrant Service:

```bash
docker-compose up
```

### Accessing Qdrant

Navigate to http://localhost:6333/ or the Deployed URL.

Navigate to http://localhost:6333/dashboard to access the Qdrant Dashboard.
