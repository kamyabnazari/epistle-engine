# Dockerfile for the backend service testing
FROM python:3.8-slim-buster

# Install system dependencies
RUN apt-get update && \
    apt-get install -y libcairo2-dev pkg-config texlive-base texlive-latex-recommended wkhtmltopdf && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
ADD . /app
RUN pip install -r requirements.txt --no-cache-dir
EXPOSE 5003
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5003"]