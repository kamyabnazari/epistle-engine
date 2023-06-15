# Dockerfile for EE Application

# Build Stage
FROM node:18-alpine

ARG PUBLIC_POCKETBASE_URL
ENV PUBLIC_POCKETBASE_URL=$PUBLIC_POCKETBASE_URL

WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD [ "node", "./build" ]