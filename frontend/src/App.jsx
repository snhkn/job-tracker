import { useState, useEffect } from "react";
import {Routes, Route, useNavigate} from "react-router-dom";

import JobForm from "./JobForm"
import JobList from "./JobList"
import JobDetails from "./JobDetails"
import "./App.css"

function App() {

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingJob, setEditingJob] = useState(null);

  const navigate = useNavigate();

  useEffect(()=>{
    async function getJobs(){
      try{
        const response = await fetch(`${import.meta.env.VITE_API_URL}/jobs`);
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

  //Delete a job
  const handleDeleted = (jobId) => {
    setJobs((prevJobs) =>
        prevJobs.filter((job) => job.id !== jobId)
    );
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    navigate("/");
  };



  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-logo">JT</div>
            <div className="brand-text">
              <h1>Job Tracker</h1>
              <p>Keep your job search organized</p>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <>
              <JobForm
                key={editingJob?.id ?? "new"}
                editingJob={editingJob}
                onJobCreated={(createdJob)=>{
                  setJobs(currentJobs => [...currentJobs, createdJob]);
                }}
                onJobUpdated={(editedJob)=>{
                  setJobs(currentJobs=> currentJobs.map(
                    job => job.id === editedJob.id ? editedJob : job
                  ));
                  setEditingJob(null);
                }}
                onCancelEdit={() => setEditingJob(null)}
              />

              <JobList
                jobs={jobs}
                loading={loading}
                error={error}
                onJobDeleted={handleDeleted}
                onJobEdit={(job)=> setEditingJob(job)}
              />
            </>
          }/>

          <Route path="/jobs/:jobId" element={
            <JobDetails onEdit={handleEdit}/>
          }/>
        </Routes>
      </main>
    </div>
  );

};

export default App;
