# Dockerfile for ADM Application

# Build Stage
FROM node:18-alpine AS deploy-app-builder
RUN mkdir /app
COPY . /app
RUN cd /app && npm install && npm run build

# Production Stage
FROM node:18-alpine
RUN mkdir /app
COPY --from=deploy-app-builder /app/build /app/build
COPY --from=deploy-app-builder /app/package.json /app/package.json
COPY --from=deploy-app-builder /app/package-lock.json /app/package-lock.json
RUN cd /app && npm install --production
WORKDIR /app
EXPOSE 3000
CMD [ "node", "./build" ]