import JobCard from "./JobCard";
import { useState } from "react";

function JobList({jobs, loading, error, onJobDeleted, onJobEdit}){

    const [statusFilter, setStatusFilter] = useState("All");
    const [search, setSearch] = useState("");

    const searchTerm = search.trim().toLowerCase();

    const filteredJobs = jobs.filter(job => {
        const matchesStatus =
            statusFilter === "All" || job.status === statusFilter;

        const matchesSearch =
            job.company.toLowerCase().includes(searchTerm) ||
            job.position.toLowerCase().includes(searchTerm);

        return matchesStatus && matchesSearch;
    });


    return (
    <section className="job-list-section">
        <div className="job-list-header">
        <div>
            <h2>Job Applications</h2>
            <p className="section-description">
            Manage and track your applications
            </p>
        </div>
        <span className="job-count">
            {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"}
        </span>
        </div>

        <div className="job-toolbar">
        <input
            className="search-input"
            type="search"
            placeholder="Search by company or position"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

        <select
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
        >
            <option value="All">All statuses</option>
            <option value="Saved">Saved</option>
            <option value="Applied">Applied</option>
            <option value="Waiting">Waiting</option>
            <option value="Interview">Interview</option>
        </select>
        </div>

        {loading ? (
        <p className="list-message">Loading applications...</p>
        ) : error ? (
        <p className="list-message error-message">{error}</p>
        ) : jobs.length === 0 ? (
        <p className="list-message">No job applications yet.</p>
        ) : filteredJobs.length === 0 ? (
        <p className="list-message">No matching applications found.</p>
        ) : (
        <div className="job-list">
            {filteredJobs.map((job) => (
            <JobCard
                key={job.id}
                job={job}
                onJobDeleted={onJobDeleted}
                onJobEdit={onJobEdit}
            />
            ))}
        </div>
        )}
    </section>
    );


};
export default JobList;
