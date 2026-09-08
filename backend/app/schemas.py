from pydantic import BaseModel

class JobCreate(BaseModel):
    company: str
    position: str
    job_url : str | None = None

class JobUpdate(BaseModel):
    company: str | None = None
    position: str | None = None
    job_url: str | None = None
    status: str | None = None