# Dockerfile for the backend service testing
FROM python:3

# Install system dependencies
RUN apt-get update && \
    apt-get install -y libcairo2-dev pkg-config texlive-base texlive-latex-recommended wkhtmltopdf && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
ADD . /app

# Install python dependencies
RUN pip install -r requirements.txt --no-cache-dir

# Make sure our start script is executable
RUN chmod +x /app/start.sh

EXPOSE 5003
CMD ["./start.sh"]
