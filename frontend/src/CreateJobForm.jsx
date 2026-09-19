import { useState } from "react"

function CreateJobForm({onJobCreated}){

    const[formData, setFormData] = useState({
        company:"",
        position:"",
        job_url:"",
        location:"",
        salary:"",
        job_description:"",
        notes:""
    });

    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const payload = {
            ...formData,
            job_url : formData.job_url.trim() === "" ? null : formData.job_url
        }


        try {
            const response = await fetch("http://localhost:8000/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Failed to create job");
            }

            const data = await response.json();
            onJobCreated(data);
            console.log(data);

            setFormData({
                company: "",
                position: "",
                job_url: "",
                location: "",
                salary: "",
                job_description: "",
                notes: ""
            });

        } catch (e) {
            console.log(e);
            setError("Something went wrong while creating the job.");
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name] : value
        });
    };

    return(
        <form onSubmit={handleSubmit}>
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
                Job description
                <textarea
                    name="job_description"
                    value={formData.job_description}
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
            {error && <p>{error}</p>}
            <button type="submit">Add Job</button>
        </form>
    );
}
export default CreateJobForm;