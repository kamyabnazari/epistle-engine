# Dockerfile for EE Application

# Build Stage
FROM node:18-alpine

#ENV PUBLIC_POCKETBASE_URL="http://localhost:8090"

WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD [ "node", "./build" ]
