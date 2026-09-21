import JobCard from "./JobCard";
import { useState } from "react";

function JobList({jobs, loading, error, onJobDeleted, onJobEdit}){

    const [statusFilter, setStatusFilter] = useState("All");

    const filteredJobs = statusFilter === "All"
        ? jobs
        : jobs.filter(job => job.status === statusFilter);

    return(
        <div>
            <select
                value={statusFilter}
                onChange={(e)=>setStatusFilter(e.target.value)}>
                <option value="All">All</option>
                <option value="Saved">Saved</option>
                <option value="Applied">Applied</option>
                <option value="Waiting">Waiting</option>
                <option value="Interview">Interview</option>
            </select>
            <h1>Job Applications</h1>
            {loading ? (
                <p>Loading...</p>
            ):(
                error ? (
                    <p>{error}</p>
                ): jobs.length===0 ? (
                    <p>No job applications yet.</p>
                    ): filteredJobs.length === 0 ? (
                        <p>No jobs with this status.</p>
                    ):(
                    <>
                    {filteredJobs.map(job => (
                        <JobCard key={job.id} job={job} onJobDeleted={onJobDeleted} onJobEdit={onJobEdit}/>
                    ))}
                    </>
                )

            )}

        </div>
    );

};
export default JobList;
