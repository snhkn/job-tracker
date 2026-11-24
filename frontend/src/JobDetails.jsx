import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";


function JobDetails({onEdit}) {

    const { jobId } = useParams();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {

        setLoading(true);
        setError(null);
        setJob(null);

        async function getJob(){
            try{
                const response = await fetch(`http://localhost:8000/jobs/${jobId}`);
                if(!response.ok){
                throw new Error("Failed to load job.");
                }
                const data = await response.json();
                setJob(data);
            }catch(e){
                setError("Something went wrong while loading job.");
                console.log(e);
            }finally{
                setLoading(false);
            }
        }
        getJob();

    }, [jobId]);


    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!job) {
        return <p>Job not found.</p>;
    }

    return(
        <div>
            <h1>Job Details Page</h1>
            <h2>{job.position}</h2>
            <p>Company: {job.company}</p>
            <p>Status: {job.status}</p>
            <p>Job description: {job.job_description}</p>
            <p>Job url: {job.job_url}</p>
            <p>Location: {job.location}</p>
            <p>Salary: {job.salary}</p>
            <p>Notes: {job.notes}</p>
            <p>Summary: {job.summary}</p>
            <p>Key Skills: {job.key_skills.join(", ")}</p>
            <button onClick={() => navigate("/")}>
                Back to Job List
            </button>
            <button onClick={() => onEdit(job)}>
                Edit
            </button>

        </div>
    );

}

export default JobDetails;