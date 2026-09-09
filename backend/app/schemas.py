from pydantic import BaseModel, ConfigDict

class JobCreate(BaseModel):
    company: str
    position: str
    job_url : str | None = None

class JobUpdate(BaseModel):
    company: str | None = None
    position: str | None = None
    job_url: str | None = None
    status: str | None = None

class JobResponse(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: int
    company: str
    position: str
    job_url: str | None
    status: str
