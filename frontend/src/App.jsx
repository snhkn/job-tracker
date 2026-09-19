import { useState, useEffect } from "react"
import CreateJobForm from "./CreateJobForm"
import JobList from "./JobList"
import "./App.css"

function App() {

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

  return (
    <>
      <CreateJobForm
        onJobCreated={(createdJob)=>{
          setJobs(currentJobs => [...currentJobs, createdJob]);
        }}
      />

      <JobList jobs={jobs} loading={loading} error={error}/>
    </>
  )
}

export default App
