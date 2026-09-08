from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from.schemas import JobCreate
from .database import engine, get_db
from .models import JobApplication


app = FastAPI()


@app.get("/")
def home():
    return {"message": "this is awesome"}

@app.get("/jobs")
def get_jobs(db: Session = Depends(get_db)):
    return db.query(JobApplication).all()

@app.get("/jobs/{job_id}")
def get_job(job_id : int, db: Session = Depends(get_db)):
    job = db.query(JobApplication).filter(
            JobApplication.id == job_id
        ).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    return job





@app.post("/jobs")
def post_jobs(job: JobCreate, db: Session = Depends(get_db)):
    new_job = JobApplication(
        company = job.company,
        position = job.position,
        job_url = job.job_url,
        status = "Saved"
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job
