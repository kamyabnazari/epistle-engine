# Dockerfile for pocketbase

# Use the custom PocketBase image as a base
FROM ghcr.io/muchobien/pocketbase:latest AS download
FROM alpine:latest

# Define environment variables
ENV PKGS="git git-lfs npm build-base ca-certificates"
ENV CMD="/usr/local/bin/pocketbase serve --http=0.0.0.0:8090 --dir=/root/pocketbase"
ENV SG_DIR="/root/pocketbase"

# Define build arguments
ARG GITHUB_TOKEN

# Install necessary packages and Node.js tools
RUN apk update && apk add --update $PKGS && rm -rf /var/cache/apk/* && npm i -g npm@latest

# Copy the 'pocketbase' file from the 'download' stage into the '/usr/local/bin' directory
COPY --from=download /pocketbase /usr/local/bin/pocketbase

# Expose port 8090
EXPOSE 8090

# Set the default command for the container
CMD ["/usr/local/bin/pocketbase", "serve", "--http=0.0.0.0:8090"]