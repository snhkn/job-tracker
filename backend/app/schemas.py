from pydantic import BaseModel

class JobCreate(BaseModel):
    company: str
    position: str
    job_url : str | None = None
