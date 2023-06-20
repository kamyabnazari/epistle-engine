# Dockerfile for the backend service testing
FROM python:3.8-slim-buster
WORKDIR /app
COPY . /app
RUN pip install -r requirements.txt --no-cache-dir
EXPOSE 5003
CMD ["hypercorn", "main:app", "--bind", "'fly-local-6pn:5003'"]