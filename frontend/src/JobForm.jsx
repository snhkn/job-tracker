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
                const response = await fetch(`${import.meta.env.VITE_API_URL}/jobs`, {
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
                const response = await fetch(`${import.meta.env.VITE_API_URL}/jobs/${editingJob.id}`, {
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/jobs/extract` , {
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


    return (
        <section className="job-form-section">
            <div className="form-header">
            <div>
                <h2>{editingJob ? "Edit application" : "Add a new job"}</h2>
                <p>
                {editingJob
                    ? "Update your application details"
                    : "Save a job opportunity to your tracker"}
                </p>
            </div>
            </div>

            <form className="job-form" onSubmit={handleSubmit}>
            <label className="form-field full-width">
                Job description
                <textarea
                className="form-control description-input"
                name="job_description"
                value={formData.job_description}
                onChange={handleChange}
                placeholder="Paste the job description here..."
                />
            </label>

            {!editingJob && (
                <div className="extraction-row">
                <button
                    className="btn btn-ai"
                    type="button"
                    onClick={handleExtract}
                    disabled={extracting}
                >
                    {extracting ? "Extracting..." : "✦ Extract with AI"}
                </button>
                <span className="extraction-hint">
                    Automatically fill in job details
                </span>
                </div>
            )}

            {extractionError && (
                <p className="form-error">{extractionError}</p>
            )}

            <div className="form-grid">
                <label className="form-field">
                Company
                <input
                    className="form-control"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Company name"
                />
                </label>

                <label className="form-field">
                Position
                <input
                    className="form-control"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="Job title"
                />
                </label>

                <label className="form-field">
                Location
                <input
                    className="form-control"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Istanbul / Remote"
                />
                </label>

                <label className="form-field">
                Salary
                <input
                    className="form-control"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="Salary range"
                />
                </label>

                <label className="form-field full-width">
                Job URL
                <input
                    className="form-control"
                    type="url"
                    name="job_url"
                    value={formData.job_url}
                    onChange={handleChange}
                    placeholder="https://..."
                />
                </label>

                <label className="form-field full-width">
                Notes
                <textarea
                    className="form-control notes-input"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Add your personal notes..."
                />
                </label>

                {editingJob && (
                <label className="form-field">
                    Status
                    <select
                    className="form-control"
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
                )}
            </div>

            {error && <p className="form-error">{error}</p>}

            <div className="form-actions">
                <button className="btn btn-primary" type="submit">
                {editingJob ? "Save changes" : "Add job"}
                </button>

                {editingJob && (
                <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={onCancelEdit}
                >
                    Cancel
                </button>
                )}
            </div>
            </form>
        </section>
    );

}
export default JobForm;