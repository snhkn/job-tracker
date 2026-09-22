import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect, vi } from "vitest";
import JobForm from "../src/JobForm";

const job = {
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
};

test("renders create job form", () => {
    render(
        <JobForm
            editingJob={null}
            onJobCreated={() => {}}
            onJobUpdated={() => {}}
            onCancelEdit={() => {}}
        />
    );

    expect(
        screen.getByRole("button", { name: "Add Job" })
    ).toBeInTheDocument();

    expect(
        screen.getByRole("textbox", { name: "Company" })
    ).toBeInTheDocument();

    expect(
        screen.getByRole("textbox", { name: "Position" })
    ).toBeInTheDocument();
});

test("populates form fields when editing a job", () => {
    render(
        <JobForm
            editingJob={job}
            onJobCreated={() => {}}
            onJobUpdated={() => {}}
            onCancelEdit={() => {}}
        />
    );

    expect(
        screen.getByRole("button", { name: "Edit Job" })
    ).toBeInTheDocument();

    expect(
        screen.getByRole("textbox", { name: "Company" })
    ).toHaveValue("Google");

    expect(
        screen.getByRole("textbox", { name: "Position" })
    ).toHaveValue("Backend Developer");

    expect(
        screen.getByRole("combobox")
    ).toHaveValue("Saved");
});

test("submits a new job", async () => {
    const user = userEvent.setup();

    const createdJob = {
        id: 10,
        company: "Google",
        position: "Backend Engineer",
        status: "Saved",
        date_applied: null,
        job_url: null,
        location: null,
        salary: null,
        job_description: null,
        notes: null
    };

    const onJobCreated = vi.fn();

    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(createdJob)
    });

    render(
        <JobForm
            editingJob={null}
            onJobCreated={onJobCreated}
            onJobUpdated={() => {}}
            onCancelEdit={() => {}}
        />
    );

    await user.type(
        screen.getByRole("textbox", { name: "Company" }),
        "Google"
    );

    await user.type(
        screen.getByRole("textbox", { name: "Position" }),
        "Backend Engineer"
    );

    await user.click(
        screen.getByRole("button", { name: "Add Job" })
    );

    expect(fetchMock).toHaveBeenCalledWith(
        "http://localhost:8000/jobs",
        expect.objectContaining({
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
    );

    const requestBody = JSON.parse(
        fetchMock.mock.calls[0][1].body
    );

    expect(requestBody.company).toBe("Google");
    expect(requestBody.position).toBe("Backend Engineer");

    expect(onJobCreated).toHaveBeenCalledWith(createdJob);
});

test("submits an updated job", async () => {
    const user = userEvent.setup();

    const updatedJob = {
        ...job,
        position: "Senior Backend Developer",
        status: "Applied"
    };

    const onJobUpdated = vi.fn();

    const fetchMock = vi
        .spyOn(globalThis, "fetch")
        .mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(updatedJob)
        });

    render(
        <JobForm
            editingJob={job}
            onJobCreated={() => {}}
            onJobUpdated={onJobUpdated}
            onCancelEdit={() => {}}
        />
    );

    const positionInput = screen.getByRole("textbox", {
        name: "Position"
    });

    await user.clear(positionInput);
    await user.type(
        positionInput,
        "Senior Backend Developer"
    );

    await user.selectOptions(
        screen.getByRole("combobox"),
        "Applied"
    );

    await user.click(
        screen.getByRole("button", { name: "Edit Job" })
    );

    expect(fetchMock).toHaveBeenCalledWith(
        "http://localhost:8000/jobs/1",
        expect.objectContaining({
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        })
    );

    const requestBody = JSON.parse(
        fetchMock.mock.calls[0][1].body
    );

    expect(requestBody.position).toBe(
        "Senior Backend Developer"
    );

    expect(requestBody.status).toBe("Applied");

    expect(onJobUpdated).toHaveBeenCalledWith(updatedJob);
});

test("shows an error when creating a job fails", async () => {
    const user = userEvent.setup();

    const onJobCreated = vi.fn();

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: false
    });

    render(
        <JobForm
            editingJob={null}
            onJobCreated={onJobCreated}
            onJobUpdated={() => {}}
            onCancelEdit={() => {}}
        />
    );

    await user.type(
        screen.getByRole("textbox", { name: "Company" }),
        "Google"
    );

    await user.type(
        screen.getByRole("textbox", { name: "Position" }),
        "Backend Engineer"
    );

    await user.click(
        screen.getByRole("button", { name: "Add Job" })
    );

    expect(
        await screen.findByText(
            "Something went wrong while creating the job."
        )
    ).toBeInTheDocument();

    expect(onJobCreated).not.toHaveBeenCalled();
});

test("shows an error when editing a job fails", async () => {
    const user = userEvent.setup();

    const onJobUpdated = vi.fn();

    const fetchMock = vi
            .spyOn(globalThis, "fetch")
            .mockResolvedValue({
                ok: false
    });

    render(
        <JobForm
            editingJob={job}
            onJobCreated={() => {}}
            onJobUpdated={onJobUpdated}
            onCancelEdit={() => {}}
        />
    );

    const positionInput = screen.getByRole("textbox", {
        name: "Position"
    });

    await user.clear(positionInput);
    await user.type(
        positionInput,
        "Senior Backend Developer"
    );

    await user.click(
        screen.getByRole("button", { name: "Edit Job" })
    );

    expect(
        await screen.findByText(
            "Something went wrong while editing the job."
        )
    ).toBeInTheDocument();

    expect(onJobUpdated).not.toHaveBeenCalled();

    expect(fetchMock).toHaveBeenCalledWith(
        "http://localhost:8000/jobs/1",
        expect.objectContaining({
            method: "PUT"
        })
    );
});

test("cancels editing a job", async () => {
    const user = userEvent.setup();
    const onCancelEdit = vi.fn();

    render(
        <JobForm
            editingJob={job}
            onJobCreated={() => {}}
            onJobUpdated={() => {}}
            onCancelEdit={onCancelEdit}
        />
    );

    await user.click(
        screen.getByRole("button", { name: "Cancel" })
    );

    expect(onCancelEdit).toHaveBeenCalled();
});