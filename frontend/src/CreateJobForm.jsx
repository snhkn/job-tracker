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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
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
            <button type="submit">Add Job</button>
        </form>
    );
}
export default CreateJobForm;