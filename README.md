# Job Tracker

A full-stack job application tracker built with **FastAPI and React**. The application allows users to record, manage, search, and track job applications throughout the hiring process.

The project is being developed as a portfolio application with an emphasis on REST API design, frontend state management, validation, automated testing, and eventually AI-assisted job analysis.

## Features

* Create, edit, and delete job applications
* Track application status
* Automatically manage the application date based on status changes
* Search jobs by company or position
* Filter jobs by application status
* Validate user input on both frontend and backend
* Display loading, empty, and error states
* Automated backend API tests
* Automated frontend component tests

## Tech Stack

### Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* SQLite
* pytest
* Uvicorn

### Frontend

* React
* Vite
* JavaScript
* Vitest
* React Testing Library
* `@testing-library/user-event`
* CSS

## Project Structure

```text
job-tracker/
├── backend/
│   ├── app/
│   └── tests/
├── frontend/
│   ├── src/
│   ├── tests/
│   └── ...
├── .gitignore
└── README.md
```

## Backend

The backend provides a REST API for managing job applications.

FastAPI handles HTTP requests and Pydantic models validate incoming request data. SQLAlchemy is used for database access, with SQLite providing the database for the current version of the application.

The backend contains the application's business rules as well as API validation. For example, company and position fields cannot be empty, URLs are validated, and application dates are updated according to status transitions.

The API is tested with pytest to verify successful requests, validation failures, CRUD operations, and status-related business logic.

## Frontend

The frontend is a React application built with Vite.

React state is used to coordinate job data between the main application, the job list, individual job cards, and the reusable job form. The form is used for both creating and editing jobs.

The frontend currently supports:

* Creating and editing applications
* Deleting applications with confirmation
* Updating application status
* Searching by company or position
* Filtering by status
* Handling loading, empty, and error states

The frontend also includes automated component tests using Vitest and React Testing Library. The test suite covers important user-facing behaviors such as rendering, filtering, searching, form submission, editing, deletion, and error handling.

## API

The backend exposes the following main endpoints:

| Method   | Endpoint         | Description                        |
| -------- | ---------------- | ---------------------------------- |
| `GET`    | `/jobs`          | Return all job applications        |
| `POST`   | `/jobs`          | Create a new job application       |
| `PUT`    | `/jobs/{job_id}` | Update an existing job application |
| `DELETE` | `/jobs/{job_id}` | Delete a job application           |

### Example Job

```json
{
  "company": "Google",
  "position": "Backend Developer",
  "job_url": "https://www.google.com/jobs",
  "location": "Istanbul",
  "salary": "€60,000",
  "status": "Applied",
  "date_applied": "2026-09-22",
  "job_description": "Backend development role...",
  "notes": "Applied through company website"
}
```

### Status and Application Date

A newly created job starts with the `Saved` status.

When a job moves from `Saved` to an application-stage status such as `Applied`, `Waiting`, or `Interview`, the backend records the application date.

The application date is preserved when moving between application-stage statuses and cleared when the job is moved back to `Saved`.

This business logic is implemented and tested on the backend rather than being duplicated in the frontend.

## Running Locally

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be available at:

```text
http://localhost:8000
```

Run backend tests with:

```bash
pytest
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Run frontend tests with:

```bash
npm run test -- --run
```

Run linting:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## Development

The project is developed incrementally with automated tests added alongside new functionality.

Current focus areas include improving the application architecture, deployment configuration, and adding AI-assisted features for analyzing job descriptions.

## Roadmap

* Improve production configuration and deployment
* Add AI-powered job description analysis
* Extract structured skills and requirements from job descriptions
* Explore CV-to-job matching
* Improve dashboard and reporting features

## License

This project is currently intended as a personal portfolio project.
