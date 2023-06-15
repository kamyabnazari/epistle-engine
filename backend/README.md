# Backend

## Setup

### Environment variables

Create a `.env` file in the root of the backend directory with the following variables:

```
OPENAI_API_KEY={your openai api key}
POCKETBASE_ADMIN_EMAIL=test@example.com
POCKETBASE_ADMIN_PASSWORD=1234567890
PUBLIC_POCKETBASE_URL=http://localhost:8090
PUBLIC_FRONTEND_URL=http://localhost:5173
```

### Running the backend

To install the required packages for this plugin and run the service locally, run the following commands:

```bash
pip install -r requirements.txt

uvicorn main:app --reload --port 5003
```
