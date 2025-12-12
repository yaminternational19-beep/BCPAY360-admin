import React, { useState } from "react";
import "../styles/RecruitmentModule.css";

export default function RecruitmentModule() {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Frontend Developer",
      dept: "Engineering",
      description: "React developer with 2+ years experience.",
      applicants: [
        {
          id: 101,
          name: "Asha Patel",
          email: "asha@example.com",
          resume: "#",
          status: "Pending",
          appliedAt: new Date().toISOString(),
        },
        {
          id: 102,
          name: "Rohit Kumar",
          email: "rohit@example.com",
          resume: "#",
          status: "Shortlisted",
          appliedAt: new Date().toISOString(),
        }
      ],
    },
  ]);

  const [form, setForm] = useState({
    title: "",
    dept: "",
    description: "",
  });

  const [selectedJob, setSelectedJob] = useState(null);

  // Add Job Opening
  const createJob = (e) => {
    e.preventDefault();
    if (!form.title || !form.dept || !form.description) return;

    const newJob = {
      id: Date.now(),
      title: form.title,
      dept: form.dept,
      description: form.description,
      applicants: [],
    };

    setJobs([newJob, ...jobs]);
    setForm({ title: "", dept: "", description: "" });
  };

  // Change Application Status
  const updateStatus = (jobId, applicantId, newStatus) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              applicants: job.applicants.map((a) =>
                a.id === applicantId ? { ...a, status: newStatus } : a
              ),
            }
          : job
      )
    );
  };

  return (
    <div className="rec-root">

      <h1 className="fade-in">Recruitment Management</h1>

      {/* JOB CREATION */}
      <section className="card slide-up">
        <h2>Post a Job Opening</h2>

        <form className="rec-form" onSubmit={createJob}>
          <input
            placeholder="Job Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            placeholder="Department"
            value={form.dept}
            onChange={(e) => setForm({ ...form, dept: e.target.value })}
          />

          <textarea
            placeholder="Job Description"
            rows="3"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          ></textarea>

          <button className="btn-primary">Post Job</button>
        </form>
      </section>

      {/* JOB LIST */}
      <section className="card fade-in">
        <h2>Job Openings</h2>

        <div className="job-list">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="job-card hover-zoom"
              onClick={() => setSelectedJob(job)}
            >
              <h3>{job.title}</h3>
              <p className="job-dept">{job.dept}</p>
              <p className="job-desc">{job.description}</p>

              <div className="job-footer">
                <span>{job.applicants.length} Applicants</span>
              </div>
            </div>
          ))}

          {jobs.length === 0 && (
            <div className="empty">No job openings posted.</div>
          )}
        </div>
      </section>

      {/* JOB DETAILS + APPLICANTS */}
      {selectedJob && (
        <section className="card slide-up">
          <div className="job-detail-header">
            <h2>{selectedJob.title}</h2>
            <button className="btn-sm ghost" onClick={() => setSelectedJob(null)}>
              Close
            </button>
          </div>

          <p><b>Department:</b> {selectedJob.dept}</p>
          <p className="job-desc">{selectedJob.description}</p>

          <h3>Applicants</h3>

          <div className="applicant-list">
            {selectedJob.applicants.map((a) => (
              <div key={a.id} className="applicant-card">
                <div>
                  <h4>{a.name}</h4>
                  <p className="app-email">{a.email}</p>
                  <p className="app-date">
                    Applied: {new Date(a.appliedAt).toLocaleString()}
                  </p>

                  <a href={a.resume} target="_blank" rel="noreferrer" className="resume-link">
                    View Resume
                  </a>
                </div>

                <div className="app-status">
                  <span className={`status-badge ${a.status.toLowerCase()}`}>
                    {a.status}
                  </span>

                  <button
                    className="btn-sm"
                    onClick={() => updateStatus(selectedJob.id, a.id, "Shortlisted")}
                  >
                    Shortlist
                  </button>

                  <button
                    className="btn-sm danger"
                    onClick={() => updateStatus(selectedJob.id, a.id, "Rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}

            {selectedJob.applicants.length === 0 && (
              <div className="empty">No applications yet.</div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
