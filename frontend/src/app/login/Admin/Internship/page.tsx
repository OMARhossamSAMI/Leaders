"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Trash2, Save, XCircle, Download } from "lucide-react";
import AdminHeader from "../../../components/AdminHeader";
import AdminFooter from "../../../components/AdminFooter";
import { useRouter } from "next/navigation";
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
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");

    if (!token) {
      setLoading(false);
      const timer = setTimeout(() => {
        router.push("/login");
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setAuthenticated(true);
      fetchApplications();
    }
  }, [router]);

  const fetchApplications = async () => {
    setLoadingApplications(true);
    try {
      const res = await axios.get<InternshipApplication[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/internship`
      );
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to fetch internship applications", err);
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/internship/${id}`);
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (err) {
      alert("Failed to delete application");
      console.error(err);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/internship/${id}`,
        editData
      );
      setEditingId(null);
      setExpandedId(null);
      await fetchApplications();
    } catch (err) {
      console.error("Failed to update application", err);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/internship/export`,
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data as BlobPart], {
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

  if (!loading || !authenticated) {
    return (
      <div className="auth-redirect-screen">
        <div className="auth-box">
          <div className="warning-icon">⚠️</div>
          <h2>Authentication Required</h2>
          <p>Redirecting to login</p>
          <div className="dots-loading">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminHeader />

      <div className="internship-container">
        <div
          className="container section-title"
          style={{ marginTop: "30px", marginBottom: "2rem" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Internship Applications</h2>
              <p>
                Review and manage all internship requests submitted by students.
              </p>
            </div>
            <button
              className="btn-success d-flex align-items-center gap-2"
              onClick={handleExport}
            >
              <Download size={16} /> Export to Excel
            </button>
          </div>
        </div>

        <div className="internship-box">
          {loadingApplications ? (
            <div className="loader-container">
              <div className="spinner" />
              <p className="loading-text">Loading internship applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <p>No internship applications submitted yet.</p>
          ) : (
            applications.map((app) => (
              <div key={app._id} className="card">
                <h5 className="accent-text">{app.full_name || "Unnamed"}</h5>
                <p>
                  <strong>University:</strong> {app.university}
                  <br />
                  <strong>Date:</strong>{" "}
                  {new Date(app.createdAt).toLocaleDateString()}
                </p>

                <div className="flex gap-2 mt-2">
                  <button
                    className="btn-primary"
                    onClick={() =>
                      expandedId === app._id
                        ? setExpandedId(null)
                        : setExpandedId(app._id)
                    }
                  >
                    {expandedId === app._id ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                    {expandedId === app._id ? " Hide Details" : " View Details"}
                  </button>

                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(app._id)}
                  >
                    <Trash2 size={16} className="me-1" /> Delete
                  </button>
                </div>

                {expandedId === app._id && (
                  <div className="mt-3">
                    {editingId === app._id ? (
                      <>
                        {Object.entries(app).map(([key]) => {
                          if (key === "_id" || key === "createdAt") return null;
                          return (
                            <div key={key} className="mb-2">
                              <label className="form-label">
                                {key.replace(/_/g, " ")}
                              </label>
                              <input
                                className="form-input"
                                value={
                                  editData[
                                    key as keyof InternshipApplication
                                  ] || ""
                                }
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    [key]: e.target.value,
                                  })
                                }
                              />
                            </div>
                          );
                        })}
                        <div className="flex gap-2 mt-2">
                          <button
                            className="btn-success"
                            onClick={() => handleUpdate(app._id)}
                          >
                            <Save size={16} /> Save
                          </button>
                          <button
                            className="btn-secondary"
                            onClick={() => setEditingId(null)}
                          >
                            <XCircle size={16} /> Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      Object.entries(app).map(([key, value]) => {
                        if (key === "_id" || key === "createdAt") return null;
                        if (
                          (key === "cv_file_url" ||
                            key === "cover_letter_url") &&
                          typeof value === "string" &&
                          value.trim()
                        ) {
                          const label =
                            key === "cv_file_url"
                              ? "Download CV"
                              : "Download Cover Letter";
                          return (
                            <p key={key}>
                              <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                              <a
                                href={`${process.env.NEXT_PUBLIC_API_URL}${value}`}
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
                            <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                            {String(value || "N/A")}
                          </p>
                        );
                      })
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
