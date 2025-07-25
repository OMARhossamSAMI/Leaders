"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Trash2, Save, XCircle, Download } from "lucide-react";
import AdminHeader from "@/app/components/AdminHeader";
import AdminFooter from "@/app/components/AdminFooter";
import "./internship.css";

interface InternshipApplication {
  _id: string;
  full_name: string;
  email: string;
  phone: string;
  university: string;
  degree: string;
  year_of_study: number;
  start_date: string;
  duration: string;
  motivation?: string;
  cv_file_url?: string;
  cover_letter_url?: string;
  createdAt: string;
}

export default function InternshipApplicationsPage() {
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<InternshipApplication>>({});

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get<InternshipApplication[]>("http://localhost:3000/internship");
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to fetch internship applications", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/internship/${id}`);
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (err) {
      alert("Failed to delete application");
      console.error(err);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await axios.patch(`http://localhost:3000/internship/${id}`, editData);
      setEditingId(null);
      setExpandedId(null);
      await fetchApplications();
    } catch (err) {
      console.error("Failed to update application", err);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get<Blob>("http://localhost:3000/internship/export", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });


      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "internship_applications.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export Excel", err);
    }
  };


  return (
    <>
      <AdminHeader />

      <div className="internship-container">
        <div className="container section-title" style={{ marginTop: "30px", marginBottom: "2rem" }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Internship Applications</h2>
              <p>Review and manage all internship requests submitted by students.</p>
            </div>
            <button className="btn-success d-flex align-items-center gap-2" onClick={handleExport}>
              <Download size={16} /> Export to Excel
            </button>
          </div>
        </div>

        <div className="internship-box">
          {applications.length === 0 ? (
            <p>No internship applications submitted yet.</p>
          ) : (
            applications.map((app) => (
              <div key={app._id} className="card">
                <h5 className="accent-text">{app.full_name || "Unnamed"}</h5>
                <p>
                  <strong>University:</strong> {app.university}
                  <br />
                  <strong>Date:</strong> {new Date(app.createdAt).toLocaleDateString()}
                </p>

                <div className="flex gap-2 mt-2">
                  <button
                    className="btn-primary"
                    onClick={() =>
                      expandedId === app._id ? setExpandedId(null) : setExpandedId(app._id)
                    }
                  >
                    {expandedId === app._id ? <EyeOff size={16} /> : <Eye size={16} />}
                    {expandedId === app._id ? " Hide Details" : " View Details"}
                  </button>

                  <button className="btn-danger" onClick={() => handleDelete(app._id)}>
                    <Trash2 size={16} className="me-1" /> Delete
                  </button>
                </div>

                {expandedId === app._id && (
                  <div className="mt-3">
                    {editingId === app._id ? (
                      <>
                        {Object.entries(app).map(([key, value]) => {
                          if (key === "_id" || key === "createdAt") return null;

                          if (
                            (key === "cv_file_url" || key === "cover_letter_url") &&
                            typeof value === "string" &&
                            value.trim()
                          ) {
                            return (
                              <p key={key}>
                                <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                                <a href={`http://localhost:3000${value}`} target="_blank" rel="noopener noreferrer">
                                  Open PDF
                                </a>
                              </p>
                            );
                          }

                          return (
                            <p key={key}>
                              <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                              {String(value || "N/A")}
                            </p>
                          );
                        })}

                        <div className="flex gap-2 mt-2">
                          <button className="btn-success" onClick={() => handleUpdate(app._id)}>
                            <Save size={16} /> Save
                          </button>
                          <button className="btn-secondary" onClick={() => setEditingId(null)}>
                            <XCircle size={16} /> Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {Object.entries(app).map(([key, value]) => {
                          if (key === "_id" || key === "createdAt") return null;

                          if (
                            (key === "cv_file_url" || key === "cover_letter_url") &&
                            typeof value === "string" &&
                            value.trim()
                          ) {
                            const label = key === "cv_file_url" ? "Download CV" : "Download Cover Letter";
                            return (
                              <p key={key}>
                                <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                                <a
                                  href={`http://localhost:3000${value}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                >
                                  {label}
                                </a>
                              </p>
                            );
                          }

                          return (
                            <p key={key}>
                              <strong>{key.replace(/_/g, " ")}:</strong> {String(value || "N/A")}
                            </p>
                          );
                        })}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <AdminFooter />
    </>
  );
}
