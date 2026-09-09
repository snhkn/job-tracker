from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from.schemas import JobCreate, JobUpdate, JobResponse, JobStatus
from .database import engine, get_db
from .models import JobApplication


app = FastAPI()


@app.get("/")
def home():
    return {"message": "this is awesome"}

@app.get("/jobs", response_model=list[JobResponse])
def get_jobs(db: Session = Depends(get_db)):
    return db.query(JobApplication).all()

@app.get("/jobs/{job_id}", response_model=JobResponse)
def get_job(job_id : int, db: Session = Depends(get_db)):
    job = db.query(JobApplication).filter(
            JobApplication.id == job_id
        ).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    return job


@app.put("/jobs/{job_id}", response_model=JobResponse)
def edit_job(job_id : int, job: JobUpdate, db: Session = Depends(get_db)):
    updated_job = db.query(JobApplication).filter(
                JobApplication.id == job_id
            ).first()
    if updated_job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.company is not None:
        updated_job.company = job.company

    if job.position is not None:
        updated_job.position = job.position

    if job.job_url is not None:
        updated_job.job_url = job.job_url

    if job.status is not None:
        updated_job.status = job.status

    db.commit()
    db.refresh(updated_job)
    return updated_job


@app.post("/jobs", response_model=JobResponse)
def post_jobs(job: JobCreate, db: Session = Depends(get_db)):
    new_job = JobApplication(
        company = job.company,
        position = job.position,
        job_url = job.job_url,
        status = JobStatus.SAVED
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

@app.delete("/jobs/{job_id}", status_code=204)
def delete_job(job_id: int, db: Session = Depends(get_db)):
    deleted_job =  db.query(JobApplication).filter(
        JobApplication.id == job_id
    ).first()

    if deleted_job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    db.delete(deleted_job)
    db.commit()
    return


