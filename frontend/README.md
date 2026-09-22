# Job Tracker Frontend

React frontend for the Job Tracker application.

## Tech Stack

* React
* Vite
* Vitest
* React Testing Library
* JavaScript
* CSS

## Features

* View job applications
* Create, edit, and delete jobs
* Update application status
* Search jobs by company or position
* Filter jobs by status
* Client-side form validation and error handling
* Loading, empty, and error states
* Automated component tests

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run linting:

```bash
npm run lint
```

Run tests:

```bash
npm run test -- --run
```

Create a production build:

```bash
npm run build
```

## API

The frontend communicates with the FastAPI backend through the Job Tracker REST API.

During local development, the backend runs on:

```text
http://localhost:8000
```

The frontend currently communicates with the following main endpoints:

```text
GET    /jobs
POST   /jobs
PUT    /jobs/{job_id}
DELETE /jobs/{job_id}
```
