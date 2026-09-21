import JobCard from "./JobCard";

function JobList({jobs, loading, error, onJobDeleted}){


    return(
        <div>
            <h1>Job Applications</h1>
            {loading ? (
                <p>Loading...</p>
            ):(
                error ? (
                    <p>{error}</p>
                ): jobs.length===0 ? (
                    <p>No job applications yet.</p>
                    ):(
                    <>
                    {jobs.map(job => (
                        <JobCard key={job.id} job={job} onJobDeleted={onJobDeleted}/>
                    ))}
                    </>
                )

            )}

        </div>
    );

};
export default JobList;
