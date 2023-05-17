# Dockerfile for ASA Application

FROM postgres:15.3-alpine AS deploy-db
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_USER=postgres
ENV POSTGRES_DB=asa-local-db

FROM dpage/pgadmin4:7.1 AS deploy-db-pgadmin
ENV PGADMIN_DEFAULT_EMAIL="admin@admin.com"
ENV PGADMIN_DEFAULT_PASSWORD="root"

# Build Stage
FROM node:20.1.0-alpine AS deploy-node
WORKDIR /asa-application
RUN rm -rf ./*
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm ci --omit dev
#CMD ["node", "build"]
