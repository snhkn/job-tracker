import { useState } from "react"

function JobForm({editingJob, onJobCreated, onJobUpdated, onCancelEdit}){

    const [formData, setFormData] = useState({
        company: editingJob?.company ?? "",
        position: editingJob?.position ?? "",
        job_url: editingJob?.job_url ?? "",
        location: editingJob?.location ?? "",
        salary: editingJob?.salary ?? "",
        job_description: editingJob?.job_description ?? "",
        notes: editingJob?.notes ?? "",
        status: editingJob?.status ?? "Saved"
    });

    const [error, setError] = useState(null);

    const [extracting, setExtracting] = useState(false);
    const [extractionError, setExtractionError] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const payload = {
            ...formData,
            job_url : formData.job_url.trim() === "" ? null : formData.job_url
        }


        if(!editingJob){
            try {
                const response = await fetch("http://localhost:8000/jobs", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.log(errorData);
                    throw new Error("Failed to create job");
                }

                const data = await response.json();
                onJobCreated(data);

                setFormData({
                    company: "",
                    position: "",
                    job_url: "",
                    location: "",
                    salary: "",
                    job_description: "",
                    notes: "",
                    status: "Saved"
                });

            } catch (e) {
                console.log(e);
                setError("Something went wrong while creating the job.");

            }
        }else{

            try{
                const response = await fetch(`http://localhost:8000/jobs/${editingJob.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });


                if (!response.ok) {
                    throw new Error("Failed to edit job");
                }

                const data = await response.json();
                onJobUpdated(data);


            }catch(e){
                console.log(e);
                setError("Something went wrong while editing the job.");
            }

        }



    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name] : value
        });

        if (name === "job_description") {
            setExtractionError(null);
        }
    };

    const handleExtract = async() => {
        if(!formData.job_description.trim()){
            setExtractionError("Please enter a job description first");
            return;
        }

        setExtracting(true);
        setExtractionError(null);

        try{
            const response = await fetch("http://localhost:8000/jobs/extract" , {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        job_description: formData.job_description
                    })
                }
            );

            if(!response.ok){
                throw new Error("Failed to extract job details.");
            }

            const extracted = await response.json();

            setFormData((prev) => ({
                ...prev,
                company: extracted.company ?? prev.company,
                position: extracted.position ?? prev.position,
                location: extracted.location ?? prev.location,
                salary: extracted.salary ?? prev.salary,
                summary: extracted.summary ?? prev.summary,
                key_skills: extracted.key_skills ?? prev.key_skills
            }));

        }catch(e){
            console.error(e);
            setExtractionError("Something went wrong during extraction.");
        }finally{
            setExtracting(false);
        }
    };

    return(

        <form onSubmit={handleSubmit}>
            <label>
                Job description
                <textarea
                    name="job_description"
                    value={formData.job_description}
                    onChange={handleChange}
                />
            </label>
            {!editingJob && (
                <button
                    type="button"
                    onClick={handleExtract}
                    disabled={extracting}
                >
                    {extracting ? "Extracting..." : "Extract with AI"}
                </button>
            )}
            {extractionError && <p>{extractionError}</p>}
            <label>
                Company
                <input
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                />
            </label>
            <label>
                Position
                <input
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                />
            </label>
            <label>
                Job url
                <input
                    type="url"
                    name="job_url"
                    value={formData.job_url}
                    onChange={handleChange}
                />
            </label>
            <label>
                Location
                <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                />
            </label>
            <label>
                Salary
                <input
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                />
            </label>
            <label>
                Notes
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                />
            </label>

            {editingJob ? (
                <label>
                    Status
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="Saved">Saved</option>
                        <option value="Applied">Applied</option>
                        <option value="Waiting">Waiting</option>
                        <option value="Interview">Interview</option>
                    </select>
                </label>
            ) : null}

            {error && <p>{error}</p>}
            <button type="submit">{editingJob ? "Edit Job" :"Add Job"}</button>

            {editingJob && (
                <button type="button" onClick={onCancelEdit}>
                    Cancel
                </button>
            )}
        </form>
    );
}
export default JobForm;