function JobList({jobs, loading, error}){


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
                        <article key={job.id}>
                            <h2>{job.position} </h2>
                            <p>Company: {job.company}</p>
                            <p>Status: {job.status}</p>
                        </article>
                    ))}
                    </>
                )

            )}

        </div>
    );

};
export default JobList;
