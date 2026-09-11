from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from datetime import date

class Base(DeclarativeBase):
    pass

class JobApplication(Base):
    __tablename__ = "job_applications"

    id : Mapped[int] = mapped_column(primary_key = True)
    company : Mapped[str]
    position : Mapped[str]
    job_url: Mapped[str | None]
    status: Mapped[str]
    date_applied: Mapped[date | None]
    job_description: Mapped[str | None]
    location: Mapped[str | None]
    salary: Mapped[str | None]