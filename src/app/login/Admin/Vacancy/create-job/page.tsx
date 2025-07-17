"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Briefcase, User, Clock } from "lucide-react";

export default function CreateJobPage() {
  const [title, setTitle] = useState("");
  const [careerLevel, setCareerLevel] = useState("Experienced (Non-Manager)");
  const [employmentType, setEmploymentType] = useState("Full-Time");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/jobs", {
        title,
        careerLevel,
        employmentType,
      });
      alert("Job created successfully");
      router.push("/login/Admin/Vacancy");
    } catch (err) {
      alert("Failed to create job");
      console.error(err);
    }
  };

  return (
    <div
      className="container py-5"
      style={{ backgroundColor: "#f5f9fa", minHeight: "100vh" }}
    >
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
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div className="text-center">
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
          </div>
        </form>
      </div>
    </div>
  );
}
