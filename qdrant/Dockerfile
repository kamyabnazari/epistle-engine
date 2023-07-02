# Dockerfile for Qdrant

# Use the official Qdrant Docker image
FROM qdrant/qdrant:latest

# Create a directory for Qdrant storage inside the container
RUN mkdir -p /qdrant/storage

# Copy the Qdrant configuration file to the container
COPY qdrant_config.yaml /qdrant/config/

# Copy the SSL certificate and key to the container
# COPY cert.pem /qdrant/tls/
# COPY key.pem /qdrant/tls/

# Expose the default Qdrant port
EXPOSE 6333
EXPOSE 6334

# Set the storage directory as a volume
VOLUME /qdrant/storage

# Run Qdrant with the custom configuration file
CMD ["./qdrant", "--config-path", "/qdrant/config/qdrant_config.yaml"]