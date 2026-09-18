import { useEffect, useState } from "react";

function JobList(){

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        async function getJobs(){
            try{
                const response = await fetch(`http://localhost:8000/jobs`);
                if(!response.ok){
                    throw new Error("Failed to load jobs.");
                }
                const data = await response.json();
                setJobs(data);
            }catch(e){
                setError("Something went wrong while loading jobs.");
                console.log(e);
            }finally{
                setLoading(false);
            }

        }
        getJobs();
    }, []);


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
