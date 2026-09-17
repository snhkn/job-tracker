from fastapi.testclient import TestClient

from app.main import app
from datetime import date

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

def test_create_job_with_missing_required_field():

    response = client.post("/jobs", json={
        "position": "Backend Developer"
    })

    assert response.status_code == 422

def test_create_job_with_too_long_job_description():
    response = client.post("/jobs", json={
        "company": "Google",
        "position": "Backend Developer",
        "job_description": "a" * 20_001
    })

    assert response.status_code == 422

def test_create_job_with_too_long_notes():
    response = client.post("/jobs", json={
         "company": "Google",
        "position": "Backend Developer",
        "notes": "a" * 5_001
    })

    assert response.status_code == 422

def test_invalid_status():
    response = client.put(
        "/jobs/1",
        json = {
            "status": "Banana"
        }
    )

    assert response.status_code == 422

def test_get_jobs_empty(test_db):
    response = client.get("/jobs")

    assert response.status_code == 200
    assert response.json() == []


def test_get_job(test_db):
    create_response = client.post("/jobs", json={
        "company": "Google",
        "position": "Backend Developer"
    })

    assert create_response.status_code == 201

    job_id = create_response.json()["id"]

    response = client.get(f"/jobs/{job_id}")

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == job_id
    assert data["company"] == "Google"
    assert data["position"] == "Backend Developer"

def test_get_job_not_found(test_db):
    response = client.get("/jobs/999")

    assert response.status_code == 404
    assert response.json() == { "detail" : "Job not found" }

def test_get_jobs(test_db):
    client.post("/jobs", json={
        "company": "Google",
        "position": "Backend Developer"
    })

    client.post("/jobs", json={
        "company": "Microsoft",
        "position": "Python Developer"
    })

    response = client.get("/jobs")

    assert response.status_code == 200
    data = response.json()

    assert len(data) == 2
    assert data[0]["company"] == "Google"
    assert data[1]["company"] == "Microsoft"

def test_update_job(test_db):
    create_response = client.post("/jobs", json={
        "company": "Google",
        "position": "Backend Developer"
    })

    assert create_response.status_code == 201

    job_id = create_response.json()["id"]

    response = client.put(f"/jobs/{job_id}", json={
        "company": "Microsoft",
        "position": "Python Developer"
    })

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == job_id
    assert data["company"] == "Microsoft"
    assert data["position"] == "Python Developer"
    assert data["status"] == "Saved"
    assert data["date_applied"] is None

    get_response = client.get(f"/jobs/{job_id}")

    assert get_response.status_code == 200

    saved_data = get_response.json()

    assert saved_data["company"] == "Microsoft"
    assert saved_data["position"] == "Python Developer"


def test_status_from_saved_to_applied_update(test_db):

    create_response = client.post("/jobs", json={
        "company": "Google",
        "position": "Backend Developer"
    })

    assert create_response.status_code == 201

    job_id = create_response.json()["id"]

    edit_response = client.put(f"/jobs/{job_id}", json={
        "status": "Applied"
    })

    assert edit_response.status_code == 200

    data = edit_response.json()

    assert data["id"] == job_id
    assert data["status"] == "Applied"
    assert data["date_applied"] == date.today().isoformat()

def test_status_from_applied_to_saved_update(test_db):

    create_response = client.post("/jobs", json={
            "company": "Google",
            "position": "Backend Developer"
        })

    assert create_response.status_code == 201

    job_id = create_response.json()["id"]

    edit_to_applied_response = client.put(f"/jobs/{job_id}", json={
        "status": "Applied"
    })

    assert edit_to_applied_response.status_code == 200

    edit_to_saved_response = client.put(f"/jobs/{job_id}", json={
        "status": "Saved"
    })

    assert edit_to_saved_response.status_code == 200

    data = edit_to_saved_response.json()

    assert data["id"] == job_id
    assert data["status"] == "Saved"
    assert data["date_applied"] is None



def test_status_from_applied_to_interview_update(test_db):

    create_response = client.post("/jobs", json={
            "company": "Google",
            "position": "Backend Developer"
    })

    assert create_response.status_code == 201

    job_id = create_response.json()["id"]

    edit_to_applied_response = client.put(f"/jobs/{job_id}", json={
        "status": "Applied"
    })

    assert edit_to_applied_response.status_code == 200

    edit_to_interview_response = client.put(f"/jobs/{job_id}", json={
        "status": "Interview"
    })

    assert edit_to_interview_response.status_code == 200

    data = edit_to_interview_response.json()

    assert data["id"] == job_id
    assert data["status"] == "Interview"
    assert data["date_applied"] == date.today().isoformat()

def test_edit_job_with_nonexistent_id(test_db):

    response = client.put("/jobs/9999", json={})

    assert response.status_code == 404

def test_delete_job(test_db):

    create_response = client.post("/jobs", json={
        "company": "Google",
        "position": "Backend Developer"
    })

    assert create_response.status_code == 201

    job_id = create_response.json()["id"]

    delete_response = client.delete(f"/jobs/{job_id}")

    assert delete_response.status_code == 204

    response = client.get(f"/jobs/{job_id}")

    assert response.status_code == 404

def test_delete_nonexistent_job(test_db):
    response = client.delete("/jobs/9999")

    assert response.status_code == 404

def test_clear_notes(test_db):
    create_response = client.post("/jobs", json={
        "company": "Google",
        "position": "Backend Developer",
        "notes" : "Favorite job "
    })

    assert create_response.status_code == 201

    job_id = create_response.json()["id"]

    update_response = client.put(f"/jobs/{job_id}", json={
        "notes": None
    })

    assert update_response.status_code == 200

    data = update_response.json()

    assert data["notes"] is None

    response = client.get(f"/jobs/{job_id}")

    assert response.status_code == 200

    persisted_data = response.json()

    assert persisted_data["notes"] is None

def test_cors_allows_frontend_origin(test_db):
    response = client.get(
        "/jobs",
        headers={"Origin": "http://localhost:5173"}
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"

def test_cors_rejects_unknown_origin(test_db):
    response = client.get(
            "/jobs",
            headers={"Origin": "http://localhost:9999"}
        )

    assert response.status_code == 200
    assert "access-control-allow-origin" not in response.headers

