"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import { Briefcase, User, Clock, Trash2 } from "lucide-react";
import AdminHeader from "@/app/components/AdminHeader";
import "./page.css";
import AdminFooter from "@/app/components/AdminFooter";
import { useRouter } from "next/navigation";

interface Job {
  _id: string;
  title: string;
  careerLevel: string;
  employmentType: string;
}

export default function JobManagementPage() {
  const [activeTab, setActiveTab] = useState<"create" | "view">("create");
  const [title, setTitle] = useState("");
  const [careerLevel, setCareerLevel] = useState("Experienced (Non-Manager)");
  const [employmentType, setEmploymentType] = useState("Full Time");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const pathname = usePathname();
  const isInternshipPage = pathname.includes("/Internship");
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const res = await axios.get<Job[]>("http://localhost:3000/jobs");
      setJobs(res.data);
    } catch (err) {
      alert("Failed to fetch jobs");
      console.error(err);
    } finally {
      setLoadingJobs(false);
    }
  };
  useEffect(() => {
    setEmploymentType(isInternshipPage ? "Internship" : "Full Time");
    fetchJobs(); // Load jobs once on mount
  }, [isInternshipPage]);
  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");

    if (!token) {
      router.push("/login");
    } else {
      setAuthenticated(true);
    }
  }, [router]);
  if (!authenticated) return null; // prevent flashing
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/jobs", {
        title,
        careerLevel,
        employmentType,
      });
      alert("Job created successfully");
      setTitle("");
      setCareerLevel("Experienced (Non-Manager)");
      setEmploymentType(isInternshipPage ? "Internship" : "Full Time");
      fetchJobs();
      setActiveTab("view");
    } catch (err) {
      alert("Failed to create job");
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

      <div className="job-page-wrapper">
        <div className="container section-title">
          <h2>Vacancies</h2>
          <p>Manage and view vacancies below.</p>
        </div>
        {/* Tabs */}
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === "create" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("create")}
          >
            Create Vacancy
          </button>
          <button
            className={`tab-btn ${activeTab === "view" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("view")}
          >
            View Vacancies
          </button>
        </div>

        {/* Shadowed Content Box */}
        <div className="job-box">
          {activeTab === "create" ? (
            <form onSubmit={handleSubmit}>
              <h2 className="section-heading">
                <Briefcase size={28} className="me-2" />
                Create New Vacancy
              </h2>

              <div className="form-group">
                <label>
                  <User size={16} className="me-2" />
                  Job Title
                </label>
                <input
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Mathematics Teacher"
                />
              </div>

              <div className="form-group">
                <label>
                  <User size={16} className="me-2" />
                  Career Level
                </label>
                <input
                  className="form-input"
                  value={careerLevel}
                  onChange={(e) => setCareerLevel(e.target.value)}
                  required
                  placeholder="e.g. Experienced (Non-Manager)"
                />
              </div>

              <div className="form-group">
                <label>
                  <Clock size={16} className="me-2" />
                  Employment Type
                </label>
                <select
                  className="form-input"
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
                  {isInternshipPage && (
                    <option value="Internship">Internship</option>
                  )}
                </select>
              </div>

              <button type="submit" className="btn-primary mt-3">
                Save Job
              </button>
            </form>
          ) : (
            <>
              <h2 className="section-heading">
                <Briefcase size={28} className="me-2" />
                Available Vacancies
              </h2>

              {loadingJobs ? (
                <>
                  <div className="loader-container">
                    <div className="spinner" />
                    <p className="loading-text">Loading Jobs...</p>
                  </div>

                  <style jsx>{`
                    .loader-container {
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      justify-content: center;
                      padding: 4rem 1rem;
                      width: 100%;
                    }

                    .spinner {
                      width: 50px;
                      height: 50px;
                      border: 6px solid #c2c8eb;
                      border-top: 6px solid #3d9bdeff;
                      border-radius: 50%;
                      animation: spin 0.9s linear infinite;
                    }

                    .loading-text {
                      margin-top: 1rem;
                      font-size: 1.1rem;
                      font-weight: 500;
                      color: #3f9adaff;
                    }

                    @keyframes spin {
                      to {
                        transform: rotate(360deg);
                      }
                    }
                  `}</style>
                </>
              ) : jobs.length === 0 ? (
                <p>No jobs created yet.</p>
              ) : (
                <div className="scroll-grid mt-4">
                  {jobs.map((job) => (
                    <div key={job._id} className="card">
                      <h5>{job.title}</h5>
                      <p>
                        <strong>Career Level:</strong> {job.careerLevel}
                        <br />
                        <strong>Type:</strong> {job.employmentType}
                      </p>
                      <button
                        className="btn-danger btn-sm"
                        onClick={() => handleDelete(job._id)}
                      >
                        <Trash2 size={16} className="me-1" /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <AdminFooter />
    </>
  );
}
