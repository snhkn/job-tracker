from datetime import date

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from .database import get_db
from .models import JobApplication
from .schemas import JobCreate, JobResponse, JobStatus, JobUpdate


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


@app.post("/jobs", response_model=JobResponse, status_code=201)
def post_jobs(job: JobCreate, db: Session = Depends(get_db)):
    new_job = JobApplication(
        company = job.company,
        position = job.position,
        job_url = job.job_url,
        status = JobStatus.SAVED,
        job_description = job.job_description,
        location = job.location,
        salary = job.salary,
        notes = job.notes
    )
    db.add(new_job)

    try:
        db.commit()
        db.refresh(new_job)
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Database error"
        )

    return new_job

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

    if "job_url" in job.model_fields_set:
        updated_job.job_url = job.job_url


    current_status = updated_job.status
    new_status = job.status

    if current_status == JobStatus.SAVED and new_status == JobStatus.APPLIED:
        updated_job.date_applied = date.today()
    elif current_status == JobStatus.APPLIED and new_status == JobStatus.SAVED:
        updated_job.date_applied = None

    if job.status is not None:
        updated_job.status = new_status

    if "job_description" in job.model_fields_set:
        updated_job.job_description = job.job_description

    if "location" in job.model_fields_set:
        updated_job.location = job.location

    if "salary" in job.model_fields_set:
        updated_job.salary = job.salary

    if "notes" in job.model_fields_set:
        updated_job.notes = job.notes

    try:
        db.commit()
        db.refresh(updated_job)
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Database error"
        )

    return updated_job


@app.delete("/jobs/{job_id}", status_code=204)
def delete_job(job_id: int, db: Session = Depends(get_db)):
    deleted_job =  db.query(JobApplication).filter(
        JobApplication.id == job_id
    ).first()

    if deleted_job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    db.delete(deleted_job)
    try:
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Database error"
        )
    return


