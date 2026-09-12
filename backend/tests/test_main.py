from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

def test_home():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() ==  {"message": "this is awesome"}

def test_create_job(test_db):

    response = client.post("/jobs", json={
        "company": "Google",
        "position": "Backend Developer",
        "location": "Istanbul",
        "salary": "€60,000",
        "job_description": "Build backend services",
        "notes": "Interesting position"
    })

    assert response.status_code == 201

    data = response.json()

    assert isinstance(data["id"], int)
    assert data["company"] == "Google"
    assert data["position"] == "Backend Developer"
    assert data["status"] == "Saved"
    assert data["date_applied"] is None
    assert data["location"] == "Istanbul"
    assert data["salary"] == "€60,000"
