"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Trash2, PencilLine, Save, XCircle } from "lucide-react";
import "./page.css";

interface Application {
  _id: string;
  data?: {
    data?: Record<string, any>; // Nested actual form data
  };
  createdAt: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, any>>({});

  useEffect(() => {
    axios
      .get<Application[]>("http://localhost:3000/vacancy")
      .then((res) => {
        const nonInternships = res.data.filter((app) => {
          const type = app.data?.data?.employment_type;
          if (!type) return true; // Include if undefined
          return Array.isArray(type)
            ? !type.map((t) => t.toLowerCase().trim()).includes("internship")
            : type.toLowerCase().trim() !== "internship";
        });

        setApplications(nonInternships);
      })
      .catch((err) => console.error("Failed to fetch applications", err));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    await axios.delete(`http://localhost:3000/vacancy/${id}`);
    setApplications(applications.filter((a) => a._id !== id));
  };

  const handleUpdate = async (id: string) => {
  await axios.patch(`http://localhost:3000/vacancy/${id}`, {
    data: { data: editData }, // Nesting the updated form data inside `data.data`
  });

  setEditingId(null);
  setExpandedId(null);

  const res = await axios.get<Application[]>("http://localhost:3000/vacancy");

  const filtered = res.data.filter((app) => {
    const type = app.data?.data?.employment_type;
    if (!type) return true;
    return Array.isArray(type)
      ? !type.map((t) => t.toLowerCase().trim()).includes("internship")
      : type.toLowerCase().trim() !== "internship";
  });

  setApplications(filtered);
};


  return (
    <div className="container my-5">
      <h2 className="mb-4">Submitted Applications</h2>

      <button
        className="btn btn-info"
        onClick={() =>
          (window.location.href = "/login/Admin/Vacancy/create-job")
        }
      >
        + Create Job
      </button>

      <button
        className="btn btn-outline-info d-flex align-items-center gap-2"
        onClick={() =>
          (window.location.href = "/login/Admin/Vacancy/form-fields")
        }
      >
        <PencilLine size={16} />
        Edit Form Structure
      </button>

      <div className="row">
        {applications.map((app) => {
          const formData = app.data?.data || {};
          return (
            <div className="col-md-6 mb-4" key={app._id}>
              <div className="card shadow-sm border-0 application-card">
                <div className="card-body">
                  <h5 className="card-title">
                    {formData.full_name || "Applicant"}
                  </h5>
                  <p className="card-text">
                    <strong>Position:</strong> {formData.position || "N/A"}
                    <br />
                    <strong>Date:</strong>{" "}
                    {new Date(app.createdAt).toLocaleDateString()}
                  </p>

                  <div className="d-flex gap-2 mb-3">
                    <button
                      className="btn btn-sm btn-primary"
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
                      )}{" "}
                      {expandedId === app._id ? "Hide Details" : "View Details"}
                    </button>

                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => {
                        setEditingId(app._id);
                        setEditData(formData);
                      }}
                    >
                      <PencilLine size={16} /> Edit
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(app._id)}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>

                  {expandedId === app._id && (
                    <div className="details-box">
                      {editingId === app._id ? (
                        <>
                          {Object.entries(formData).map(([key, value]) => (
                            <div key={key} className="mb-2">
                              <label className="form-label">
                                {key.replace(/_/g, " ")}
                              </label>
                              <input
                                className="form-control"
                                value={editData[key] || ""}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    [key]: e.target.value,
                                  })
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
                        <>
                          {Object.entries(formData).map(([key, value]) => (
                            <p key={key}>
                              <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                              {String(value)}
                            </p>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
