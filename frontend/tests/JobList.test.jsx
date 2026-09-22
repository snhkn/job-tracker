import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import JobList from "../src/JobList";

test("renders a job", () => {
    const jobs = [
        {
            id: 1,
            company: "Google",
            position: "Backend Developer",
            status: "Saved",
            date_applied: null,
            job_url: null,
            location: "Istanbul",
            salary: null,
            job_description: null,
            notes: null
        }
    ];

    render(
        <JobList
            jobs={jobs}
            loading={false}
            error={null}
            onJobDeleted={() => {}}
            onJobEdit={() => {}}
        />
    );

    expect(screen.getByText("Company: Google")).toBeInTheDocument();
    expect(
        screen.getByRole("heading", { name: "Backend Developer" })
    ).toBeInTheDocument();
});

test("shows empty state when there are no jobs", ()=>{
    render(
        <JobList
            jobs={[]}
            loading={false}
            error={null}
            onJobDeleted={() => {}}
            onJobEdit={() => {}}
        />
    );

    expect(screen.getByText("No job applications yet.")).toBeInTheDocument();
});

test("shows loading state", () => {
    render(
        <JobList
            jobs={[]}
            loading={true}
            error={null}
            onJobDeleted={() => {}}
            onJobEdit={() => {}}
        />
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
});

test("shows error state", () => {
    render(
        <JobList
            jobs={[]}
            loading={false}
            error="Something went wrong while loading jobs."
            onJobDeleted={() => {}}
            onJobEdit={() => {}}
        />
    );

    expect(
        screen.getByText("Something went wrong while loading jobs.")
    ).toBeInTheDocument();
});

test("filters jobs by status", async () => {
    const user = userEvent.setup();

    const jobs = [
        {
            id: 1,
            company: "Google",
            position: "Backend Developer",
            status: "Saved",
            date_applied: null,
            job_url: null,
            location: null,
            salary: null,
            job_description: null,
            notes: null
        },
        {
            id: 2,
            company: "Microsoft",
            position: "Python Developer",
            status: "Applied",
            date_applied: "2026-09-22",
            job_url: null,
            location: null,
            salary: null,
            job_description: null,
            notes: null
        }
    ];

    render(
        <JobList
            jobs={jobs}
            loading={false}
            error={null}
            onJobDeleted={() => {}}
            onJobEdit={() => {}}
        />
    );

    const statusSelect = screen.getByRole("combobox");

    await user.selectOptions(statusSelect, "Applied");

    expect(
        screen.getByText(/Company:\s*Microsoft/)
    ).toBeInTheDocument();

    expect(
        screen.queryByText(/Company:\s*Google/)
    ).not.toBeInTheDocument();
});

test("searches jobs by company or position", async () => {
    const user = userEvent.setup();

    const jobs = [
        {
            id: 1,
            company: "Google",
            position: "Backend Developer",
            status: "Saved",
            date_applied: null,
            job_url: null,
            location: null,
            salary: null,
            job_description: null,
            notes: null
        },
        {
            id: 2,
            company: "Microsoft",
            position: "Python Developer",
            status: "Applied",
            date_applied: "2026-09-22",
            job_url: null,
            location: null,
            salary: null,
            job_description: null,
            notes: null
        }
    ];

    render(
        <JobList
            jobs={jobs}
            loading={false}
            error={null}
            onJobDeleted={() => {}}
            onJobEdit={() => {}}
        />
    );

    const searchInput = screen.getByPlaceholderText(
        "Search by company or position"
    );

    await user.type(searchInput, "python");

    expect(
        screen.getByText(/Company:\s*Microsoft/)
    ).toBeInTheDocument();

    expect(
        screen.queryByText(/Company:\s*Google/)
    ).not.toBeInTheDocument();
});

test("combines search and status filters", async () => {
    const user = userEvent.setup();

    const jobs = [
        {
            id: 1,
            company: "Google",
            position: "Backend Developer",
            status: "Applied",
            date_applied: "2026-09-22",
            job_url: null,
            location: null,
            salary: null,
            job_description: null,
            notes: null
        },
        {
            id: 2,
            company: "Microsoft",
            position: "Python Developer",
            status: "Applied",
            date_applied: "2026-09-22",
            job_url: null,
            location: null,
            salary: null,
            job_description: null,
            notes: null
        },
        {
            id: 3,
            company: "Amazon",
            position: "Python Developer",
            status: "Saved",
            date_applied: null,
            job_url: null,
            location: null,
            salary: null,
            job_description: null,
            notes: null
        }
    ];

    render(
        <JobList
            jobs={jobs}
            loading={false}
            error={null}
            onJobDeleted={() => {}}
            onJobEdit={() => {}}
        />
    );

    await user.type(
        screen.getByPlaceholderText("Search by company or position"),
        "python"
    );

    await user.selectOptions(
        screen.getByRole("combobox"),
        "Applied"
    );

    expect(
        screen.getByText(/Company:\s*Microsoft/)
    ).toBeInTheDocument();

    expect(
        screen.queryByText(/Company:\s*Google/)
    ).not.toBeInTheDocument();

    expect(
        screen.queryByText(/Company:\s*Amazon/)
    ).not.toBeInTheDocument();
});
