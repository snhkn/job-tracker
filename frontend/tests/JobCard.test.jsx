import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect, vi } from "vitest";
import JobCard from "../src/JobCard";

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

test("deletes a job", async () => {
    const user = userEvent.setup();
    const onJobDeleted = vi.fn();

    vi.spyOn(window, "confirm").mockReturnValue(true);

    const fetchMock = vi
        .spyOn(globalThis, "fetch")
        .mockResolvedValue({
            ok: true
        });

    render(
        <JobCard
            job={job}
            onJobDeleted={onJobDeleted}
            onJobEdit={() => {}}
        />
    );

    await user.click(
        screen.getByRole("button", { name: "Delete" })
    );

    expect(fetchMock).toHaveBeenCalledWith(
        "http://localhost:8000/jobs/1",
        {
            method: "DELETE"
        }
    );

    expect(onJobDeleted).toHaveBeenCalledWith(1);
});

test("shows an error when deleting a job fails", async () => {
    const user = userEvent.setup();
    const onJobDeleted = vi.fn();

    vi.spyOn(window, "confirm").mockReturnValue(true);

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: false
    });

    render(
        <JobCard
            job={job}
            onJobDeleted={onJobDeleted}
            onJobEdit={() => {}}
        />
    );

    await user.click(
        screen.getByRole("button", { name: "Delete" })
    );

    expect(
        await screen.findByText(
            "Something went wrong while deleting the job."
        )
    ).toBeInTheDocument();

    expect(onJobDeleted).not.toHaveBeenCalled();
});

test("calls onJobEdit with the selected job", async () => {
    const user = userEvent.setup();
    const onJobEdit = vi.fn();

    render(
        <JobCard
            job={job}
            onJobDeleted={() => {}}
            onJobEdit={onJobEdit}
        />
    );

    await user.click(
        screen.getByRole("button", { name: "Edit" })
    );

    expect(onJobEdit).toHaveBeenCalledWith(job);
});