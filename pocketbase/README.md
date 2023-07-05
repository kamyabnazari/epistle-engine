# Pocektbase

## Setup

### Running pocketbase

Use docker compose to create Pocketbase Service:

```bash
docker-compose up
```

### Create Backend admin user

Navigate to http://localhost:8090/_/ or the Deployed URL and create an admin user if not already created.

It should match your backend admin user credentials in your .env file.

```bash
POCKETBASE_ADMIN_EMAIL
POCKETBASE_ADMIN_PASSWORD
```
