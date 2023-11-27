from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "This is the backend for EE Project!"}

def test_read_api_root():
    response = client.get("/api")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the EE API!"}

def test_read_health():
    response = client.get("/health")
    assert response.status_code == 200