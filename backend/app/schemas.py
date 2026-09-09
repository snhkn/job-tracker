from pydantic import BaseModel, ConfigDict
from enum import Enum


class JobStatus(str, Enum):
    SAVED = "Saved"
    APPLIED = "Applied"
    WAITING = "Waiting"
    INTERVIEW = "Interview"

class JobCreate(BaseModel):
    company: str
    position: str
    job_url : str | None = None

class JobUpdate(BaseModel):
    company: str | None = None
    position: str | None = None
    job_url: str | None = None
    status: JobStatus | None = None

class JobResponse(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: int
    company: str
    position: str
    job_url: str | None
    status: str
