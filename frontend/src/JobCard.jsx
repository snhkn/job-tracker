import { useState } from "react";

function JobCard({job, onJobDeleted, onJobEdit}){

    const [error, setError] = useState(null);

    const formattedDate = job.date_applied
        ? new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }) .format(new Date(`${job.date_applied}T00:00:00`))
        :null;

    const handleDelete = async(e) => {
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


    return(
        <article>
            <h2>{job.position}</h2>
            <p>Company: {job.company}</p>
            <p>Status: {job.status}</p>
            {formattedDate && <p>Applied: {formattedDate}</p>}
            {error && <p>{error}</p>}
            <button type="button" onClick={handleDelete}>Delete</button>
            <button type="button" onClick={()=>onJobEdit(job)}>Edit</button>
        </article>

    );
}
export default JobCard;