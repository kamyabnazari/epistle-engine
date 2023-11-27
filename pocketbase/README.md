# Pocektbase

## Setup

### Environment variables

Create a `.env` file in the root of the backend directory with the following variables:

```
POCKETBASE_ADMIN_EMAIL=test@example.com
POCKETBASE_ADMIN_PASSWORD=1234567890
```

### Running pocketbase

Use docker compose to create Pocketbase Service:

```
docker-compose up
```

### Create Backend admin user

Navigate to http://localhost:8090/_/ or the Deployed URL and create an admin user if not already created.

Also import pb_schema.json in the admin settings!

It should match your backend admin user credentials in your .env file.

```
POCKETBASE_ADMIN_EMAIL
POCKETBASE_ADMIN_PASSWORD
```
