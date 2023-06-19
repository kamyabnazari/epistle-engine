# Dockerfile for the backend service testing
FROM python:3.8-slim-buster
WORKDIR /app
ADD . /app
RUN pip install -r requirements.txt --no-cache-dir
EXPOSE 5003
CMD ["uvicorn", "main:app", "--host", "::", "--port", "5003"]