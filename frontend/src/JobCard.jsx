import { useState } from "react";
import { useNavigate } from "react-router-dom";

function JobCard({job, onJobDeleted, onJobEdit}){

    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const formattedDate = job.date_applied
        ? new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }) .format(new Date(`${job.date_applied}T00:00:00`))
        :null;

    const handleDelete = async() => {
        setError(null);
        const confirmed = window.confirm(
            "Are you sure you want to delete this job?"
        );

        if (!confirmed) return;

        try{
            const response = await fetch(`http://localhost:8000/jobs/${job.id}`, {
                method: "DELETE"
            } );

            if(!response.ok){
                throw new Error("Failed to delete job");
            }

            onJobDeleted(job.id);


        }catch(e){
            console.log(e);
            setError("Something went wrong while deleting the job.");
        }
    };



    return (
    <article className="job-card">
        <div className="job-card-main">
        <div className="job-card-heading">
            <div>
            <h3>{job.position}</h3>
            <p className="job-company">{job.company}</p>
            </div>

            <span className={`status-badge status-${job.status.toLowerCase()}`}>
            {job.status}
            </span>
        </div>

        {formattedDate && (
            <p className="job-date">Applied {formattedDate}</p>
        )}

        {job.summary && (
            <p className="job-summary">{job.summary}</p>
        )}

        {job.key_skills?.length > 0 && (
            <div className="skill-list">
            {job.key_skills.map((skill, index) => (
                <span className="skill-tag" key={index}>
                {skill}
                </span>
            ))}
            </div>
        )}
        </div>

        <div className="job-card-footer">
        {error && <p className="error-message">{error}</p>}

        <div className="job-actions">
            <button
            className="btn btn-secondary"
            type="button"
            onClick={() => navigate(`/jobs/${job.id}`)}
            >
            View
            </button>

            <button
            className="btn btn-secondary"
            type="button"
            onClick={() => onJobEdit(job)}
            >
            Edit
            </button>

            <button
            className="btn btn-danger"
            type="button"
            onClick={handleDelete}
            >
            Delete
            </button>
        </div>
        </div>
    </article>
    );

}
export default JobCard;