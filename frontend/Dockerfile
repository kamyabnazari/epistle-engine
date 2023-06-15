# Dockerfile for EE Application

# Build Stage
FROM node:18-alpine

WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD [ "node", "./build" ]