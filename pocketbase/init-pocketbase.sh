#!/bin/sh

# Start PocketBase in the background
/pb/pocketbase serve --http=0.0.0.0:8090 &
PB_PID=$!

# Waiting for PocketBase to be ready to accept connections
sleep 5

# Create an admin user using environment variables for email and password
/pb/pocketbase admin create "$POCKETBASE_ADMIN_EMAIL" "$POCKETBASE_ADMIN_PASSWORD"

# Run migrations
/pb/pocketbase migrate up

# Wait for the PocketBase process to finish
wait $PB_PID