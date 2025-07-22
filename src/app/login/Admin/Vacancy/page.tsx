"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { Briefcase, User, Clock, Trash2 } from "lucide-react";
import AdminHeader from "@/app/components/AdminHeader";

interface Job {
  _id: string;
  title: string;
  careerLevel: string;
  employmentType: string;
}

export default function CreateJobPage() {
  const [title, setTitle] = useState("");
  const [careerLevel, setCareerLevel] = useState("Experienced (Non-Manager)");
  const [employmentType, setEmploymentType] = useState("Full Time");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showJobs, setShowJobs] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const isInternshipPage = pathname.includes("/Internship");

  useEffect(() => {
    setEmploymentType(isInternshipPage ? "Internship" : "Full Time");
  }, [isInternshipPage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/jobs", {
        title,
        careerLevel,
        employmentType,
      });
      alert("Job created successfully");
      router.push(isInternshipPage ? "/login/Admin/Internship" : "/login/Admin/Vacancy");
    } catch (err) {
      alert("Failed to create job");
      console.error(err);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await axios.get<Job[]>("http://localhost:3000/jobs");
      setJobs(res.data);
      setShowJobs(true);
    } catch (err) {
      alert("Failed to fetch jobs");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      await axios.delete(`http://localhost:3000/jobs/${id}`);
      setJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (err) {
      alert("Failed to delete job");
      console.error(err);
    }
  };

  return (
    <>
      <AdminHeader />

      {/* This wrapper pushes the whole content down below the fixed header */}
      <div
        style={{
          paddingTop: "130px", // adjust depending on your header height
          backgroundColor: "#f5f9fa",
          minHeight: "100vh",
        }}
      >
        <div className="container py-5">
          <div className="col-md-8 offset-md-2 bg-white p-5 rounded shadow-sm">
            <h2 className="mb-4 text-center" style={{ color: "#00a6d9" }}>
              <Briefcase size={28} className="me-2" />
              Create New Job
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label fw-bold">
                  <User size={16} className="me-2 text-primary" />
                  Job Title
                </label>
                <input
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Mathematics Teacher"
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">
                  <User size={16} className="me-2 text-primary" />
                  Career Level
                </label>
                <input
                  className="form-control"
                  value={careerLevel}
                  onChange={(e) => setCareerLevel(e.target.value)}
                  required
                  placeholder="e.g. Experienced (Non-Manager)"
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">
                  <Clock size={16} className="me-2 text-primary" />
                  Employment Type
                </label>
                <select
                  className="form-select"
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  required
                >
                  {!isInternshipPage && (
                    <>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                    </>
                  )}
                  {isInternshipPage && <option value="Internship">Internship</option>}
                </select>
              </div>

              <div className="text-center d-flex justify-content-between">
                <button
                  className="btn text-white px-4 py-2"
                  type="submit"
                  style={{
                    backgroundColor: "#00a6d9",
                    borderRadius: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Save Job
                </button>

                <button
                  type="button"
                  className="btn btn-outline-info"
                  onClick={fetchJobs}
                >
                  View Jobs
                </button>
              </div>
            </form>
          </div>

          {showJobs && (
            <div className="mt-5">
              <h3 className="mb-3">All Created Jobs</h3>
              {jobs.length === 0 ? (
                <p>No jobs created yet.</p>
              ) : (
                <div className="row">
                  {jobs.map((job) => (
                    <div key={job._id} className="col-md-6 mb-3">
                      <div className="card shadow-sm p-3">
                        <h5>{job.title}</h5>
                        <p>
                          <strong>Career Level:</strong> {job.careerLevel} <br />
                          <strong>Type:</strong> {job.employmentType}
                        </p>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(job._id)}
                        >
                          <Trash2 size={16} className="me-1" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
