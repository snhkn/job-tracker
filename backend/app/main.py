from fastapi import FastAPI
from.schemas import JobCreate
from .database import engine


app = FastAPI()

jobs = []


@app.get("/")
def home():
    return {"message": "this is awesome"}

@app.get("/jobs")
def get_jobs():
    return jobs

@app.post("/jobs")
def post_jobs(job: JobCreate):
    jobs.append(job)
    return job
