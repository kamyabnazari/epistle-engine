# Dockerfile for EE Application

FROM node:20.8.1 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# This should be set to empty if it is not used!
ENV BASE_PATH=
RUN npm run build
RUN npm prune --production

FROM node:20.8.1
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
# This should be set to empty if it is not used!
ENV BASE_PATH=
CMD [ "node", "build" ]
