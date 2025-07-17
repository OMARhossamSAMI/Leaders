"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff, PencilLine, Trash2, Save, XCircle } from "lucide-react";

interface Application {
  _id: string;
  data?: Record<string, any>;
  createdAt: string;
}

export default function InternshipApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, any>>({});

  useEffect(() => {
    axios
      .get<Application[]>("http://localhost:3000/vacancy")
      .then((res) => {
        const internships = res.data.filter((app) => {
          const type = app.data?.data?.employment_type;
          if (!type) return false;
          return Array.isArray(type)
            ? type.map((t) => t.toLowerCase().trim()).includes("internship")
            : type.toLowerCase().trim() === "internship";
        });
        setApplications(internships);
      })
      .catch((err) => console.error("Failed to fetch applications", err));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/vacancy/${id}`);
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (err) {
      alert("Failed to delete application");
      console.error(err);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await axios.patch(`http://localhost:3000/vacancy/${id}`, {
        data: { data: editData },
      });
      setEditingId(null);
      setExpandedId(null);

      const res = await axios.get<Application[]>("http://localhost:3000/vacancy");
      const internships = res.data.filter((app) => {
        const type = app.data?.data?.employment_type;
        return Array.isArray(type)
          ? type.map((t) => t.toLowerCase().trim()).includes("internship")
          : type?.toLowerCase().trim() === "internship";
      });
      setApplications(internships);
    } catch (err) {
      console.error("Failed to update application", err);
    }
  };

  return (
    <div style={{ backgroundColor: "#f5f9fa", minHeight: "100vh", padding: "2rem" }}>
      <div className="container">
        <h2 className="mb-4" style={{ color: "#007bff" }}>
          Internship Applications
        </h2>

        {/* ✅ Create Job Button */}
        <div className="mb-4">
          <button
            className="btn btn-info"
            onClick={() => (window.location.href = "/login/Admin/Internship/create-job")}
          >
            + Create Job
          </button>
        </div>

        {applications.length === 0 ? (
          <p>No internship applications submitted yet.</p>
        ) : (
          applications.map((app) => {
            const info = app.data?.data || {};
            return (
              <div
                key={app._id}
                className="card p-3 mb-4 shadow-sm"
                style={{ borderLeft: "5px solid #00a6d9", backgroundColor: "white" }}
              >
                <h5 style={{ color: "#007bff" }}>
                  {info.student_name || info.full_name || "Unnamed"}
                </h5>
                <p>
                  <strong>Position:</strong> {info.position || "N/A"}<br />
                  <strong>Date:</strong> {new Date(app.createdAt).toLocaleDateString()}
                </p>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() =>
                      expandedId === app._id
                        ? setExpandedId(null)
                        : setExpandedId(app._id)
                    }
                  >
                    {expandedId === app._id ? <EyeOff size={16} /> : <Eye size={16} />}
                    {expandedId === app._id ? " Hide Details" : " View Details"}
                  </button>

                  <button
                    className="btn btn-sm btn-warning text-white"
                    onClick={() => {
                      setEditingId(app._id);
                      setEditData(info);
                      setExpandedId(app._id);
                    }}
                  >
                    <PencilLine size={16} className="me-1" />
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(app._id)}
                  >
                    <Trash2 size={16} className="me-1" />
                    Delete
                  </button>
                </div>

                {expandedId === app._id && (
                  <div className="mt-3">
                    {editingId === app._id ? (
                      <>
                        {Object.entries(info).map(([key, value]) => (
                          <div key={key} className="mb-2">
                            <label className="form-label">{key.replace(/_/g, " ")}</label>
                            <input
                              className="form-control"
                              value={editData[key] || ""}
                              onChange={(e) =>
                                setEditData({ ...editData, [key]: e.target.value })
                              }
                            />
                          </div>
                        ))}
                        <div className="d-flex gap-2 mt-2">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleUpdate(app._id)}
                          >
                            <Save size={16} /> Save
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setEditingId(null)}
                          >
                            <XCircle size={16} /> Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      Object.entries(info).map(([key, value]) => (
                        <p key={key}>
                          <strong>{key.replace(/_/g, " ")}:</strong> {String(value)}
                        </p>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
