# Dockerfile for EE Application

# Build Stage
FROM node:18-alpine AS deploy-app-builder

#ENV PUBLIC_POCKETBASE_URL="http://localhost:8090"

WORKDIR /app
COPY . .
RUN npm install && npm run build

# Production Stage
FROM node:18-alpine

WORKDIR /app
RUN rm -rf ./*
COPY --from=deploy-app-builder /app/build .
COPY --from=deploy-app-builder /app/package.json .
COPY --from=deploy-app-builder /app/package-lock.json .
RUN npm install --production
CMD [ "node", "index.js" ]