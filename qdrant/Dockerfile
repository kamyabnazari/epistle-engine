# Dockerfile for Qdrant

# Use the official Qdrant Docker image
FROM qdrant/qdrant:latest

# Create a directory for Qdrant storage inside the container
RUN mkdir -p /qdrant/storage

# Expose the default Qdrant port
EXPOSE 6333

# Set the storage directory as a volume
VOLUME /qdrant/storage