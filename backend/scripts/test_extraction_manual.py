from app.services.job_extraction_service import extract_job_details

sample_description = """
We are looking for a Junior Python Developer.

Company: Acme Technologies
Location: Istanbul, Turkey
Salary: 40,000 - 50,000 TRY

Requirements:
- Python
- FastAPI
- PostgreSQL
- Git
- REST APIs

The candidate will develop and maintain backend applications.
"""

result = extract_job_details(sample_description)

print(result.model_dump_json(indent=2))