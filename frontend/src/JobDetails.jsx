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
                const response = await fetch(`${import.meta.env.VITE_API_URL}/jobs/${jobId}`);
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


    return (
        <section className="job-details">
            <div className="details-header">
                <div>
                    <button
                        className="back-link"
                        onClick={() => navigate("/")}
                    >
                        ← Back to applications
                    </button>

                    <h1>{job.position}</h1>
                    <p className="details-company">{job.company}</p>
                </div>

                <span className={`status-badge status-${job.status.toLowerCase()}`}>
                    {job.status}
                </span>
            </div>

            <div className="details-grid">
                <section className="details-section">
                    <h3>Application information</h3>

                    <div className="detail-item">
                        <span>Location</span>
                        <p>{job.location || "Not specified"}</p>
                    </div>

                    <div className="detail-item">
                        <span>Salary</span>
                        <p>{job.salary || "Not specified"}</p>
                    </div>

                    <div className="detail-item">
                        <span>Job URL</span>
                        {job.job_url ? (
                            <a href={job.job_url} target="_blank" rel="noreferrer">
                                View job posting ↗
                            </a>
                        ) : (
                            <p>Not provided</p>
                        )}
                    </div>
                </section>

                <section className="details-section">
                    <h3>AI-generated insights</h3>

                    <div className="detail-item">
                        <span>Summary</span>
                        <p>{job.summary || "No summary available."}</p>
                    </div>

                    <div className="detail-item">
                        <span>Key skills</span>
                        {job.key_skills?.length > 0 ? (
                            <div className="skill-list">
                                {job.key_skills.map((skill, index) => (
                                    <span className="skill-tag" key={index}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p>No skills extracted.</p>
                        )}
                    </div>
                </section>

                <section className="details-section full-width">
                    <h3>Job description</h3>
                    <p className="long-text">
                        {job.job_description || "No job description provided."}
                    </p>
                </section>

                <section className="details-section full-width">
                    <h3>My notes</h3>
                    <p className="long-text">
                        {job.notes || "No notes added."}
                    </p>
                </section>
            </div>

            <div className="details-actions">
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/")}
                >
                    Back to job list
                </button>

                <button
                    className="btn btn-primary"
                    onClick={() => onEdit(job)}
                >
                    Edit application
                </button>
            </div>
        </section>
    );

}

export default JobDetails;