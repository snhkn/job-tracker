from pydantic import BaseModel, ConfigDict, Field, StringConstraints, HttpUrl
from typing import Annotated
from enum import Enum
from datetime import date

JobCompany = Annotated[
    str,
    StringConstraints(strip_whitespace=True, min_length=1)
]

JobPosition = Annotated[
    str,
    StringConstraints(strip_whitespace=True, min_length=1)
]

JobDescription = Annotated[
    str,
    Field(max_length=20_000)
]

JobNotes = Annotated[
    str,
    Field(max_length=5_000)
]


class JobStatus(str, Enum):
    SAVED = "Saved"
    APPLIED = "Applied"
    WAITING = "Waiting"
    INTERVIEW = "Interview"

class JobCreate(BaseModel):
    company: JobCompany
    position: JobPosition
    job_url : HttpUrl | None = None
    job_description: JobDescription | None = None
    location: str | None = None
    salary: str | None = None
    notes: JobNotes | None = None

class JobUpdate(BaseModel):
    company: JobCompany | None = None
    position: JobPosition | None = None
    job_url: HttpUrl | None = None
    status: JobStatus | None = None
    job_description: JobDescription | None = None
    location: str | None = None
    salary: str | None = None
    notes: JobNotes | None = None

class JobResponse(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: int
    company: str
    position: str
    job_url: HttpUrl | None
    status: str
    date_applied: date | None
    job_description: JobDescription | None
    location: str | None
    salary: str | None
    notes: JobNotes | None

class JobExtractionRequest(BaseModel):
    job_description: JobDescription

class JobExtractionResponse(BaseModel):
    company: str | None = None
    position: str | None = None
    location: str | None = None
    salary: str | None = None

    summary: str
    key_skills: list[str] = Field(default_factory=list)



