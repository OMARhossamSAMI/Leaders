"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import { Briefcase, User, Clock, Trash2, FileEdit, Eye } from "lucide-react";
import AdminHeader from "@/app/components/AdminHeader";
import AdminFooter from "@/app/components/AdminFooter";
import "./page.css";
import { EmploymentFormField } from "../../../../../server/src/Schemas/employment-form-field.schema";

interface Job {
  _id: string;
  title: string;
  careerLevel: string;
  employmentType: string;
}

interface Vacancy {
  _id: string;
  data: { [key: string]: any };
  createdAt: string;
  expanded?: boolean;
}

interface FormField {
  id: string;
  field_name: string;
  label: string;
  type: string;
  required: boolean;
}

export default function JobManagementPage() {
  const [activeTab, setActiveTab] = useState<"create" | "view" | "applications" | "edit-structure">("create");

  const [title, setTitle] = useState("");
  const [careerLevel, setCareerLevel] = useState("Experienced (Non-Manager)");
  const [employmentType, setEmploymentType] = useState("Full Time");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Vacancy[]>([]);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const pathname = usePathname();
  const isInternshipPage = pathname.includes("/Internship");

  useEffect(() => {
    setEmploymentType(isInternshipPage ? "Internship" : "Full Time");
    fetchJobs();
    fetchApplications();
    fetchFormStructure();
  }, [isInternshipPage]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get<Job[]>("http://localhost:3000/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get("http://localhost:3000/vacancy");

      const appsWithExpand = (res.data as Vacancy[]).map((app) => {
        const rawData = app.data || {};
        const formattedData: Record<string, any> = {};

        // Loop through each field in the data
        for (const key in rawData) {
          const value = rawData[key];

          // Convert resume file URLs to clickable links
          if (key.toLowerCase().includes("resume") && Array.isArray(value)) {
            formattedData[key] = value.map((link: string) => (
              `<a href="${link}" target="_blank" rel="noopener noreferrer">View Resume</a>`
            )).join(', ');
          } else {
            formattedData[key] = value;
          }
        }

        return {
          ...app,
          formattedData,
          expanded: false,
        };
      });

      setApplications(appsWithExpand);
    } catch (err) {
      console.error("❌ Failed to fetch applications:", err);
    }
  };




  const fetchFormStructure = async () => {
    try {
      const res = await axios.get<FormField[]>("http://localhost:3000/employment-form-fields");
      setFormFields(res.data);
    } catch (err) {
      console.error("Failed to fetch form structure", err);
    }
  };

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

  const handleDeleteJob = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      await axios.delete(`http://localhost:3000/jobs/${id}`);
      setJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (err) {
      alert("Failed to delete job");
      console.error(err);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    try {
      await axios.delete(`http://localhost:3000/vacancy/${id}`);
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (err) {
      alert("Failed to delete application");
      console.error(err);
    }
  };

  const toggleView = (id: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app._id === id ? { ...app, expanded: !app.expanded } : app
      )
    );
  };

  const updateField = (index: number, key: keyof FormField, value: FormField[keyof FormField]) => {
    const updated = [...formFields];
    updated[index] = { ...updated[index], [key]: value };
    setFormFields(updated);
  };


  const moveFieldUp = (index: number) => {
    if (index === 0) return;
    const updated = [...formFields];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setFormFields(updated);
  };

  const moveFieldDown = (index: number) => {
    if (index === formFields.length - 1) return;
    const updated = [...formFields];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setFormFields(updated);
  };

  const removeField = (index: number) => {
    const updated = [...formFields];
    updated.splice(index, 1);
    setFormFields(updated);
  };

  const addField = () => {
    setFormFields((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        field_name: "",
        label: "",
        type: "Text",
        required: false,
      },
    ]);
  };



  const saveFields = async () => {
    // Validate fields before submitting
    const errors: string[] = [];

    formFields.forEach((field, index) => {
      if (!field.field_name?.trim()) {
        errors.push(`Field ${index + 1} is missing 'field_name'.`);
      }
      if (!field.label?.trim()) {
        errors.push(`Field ${index + 1} is missing 'label'.`);
      }
      if (!field.type?.trim()) {
        errors.push(`Field ${index + 1} is missing 'type'.`);
      }
    });

    if (errors.length > 0) {
      alert("Validation errors:\n" + errors.join("\n"));
      return;
    }

    try {
      // Send as raw array (not wrapped in { fields: ... })
      await axios.put("http://localhost:3000/employment-form-fields", formFields);

      alert("✅ Form structure saved successfully!");
      console.log("✅ Submitted formFields:", formFields);
    } catch (err) {
      console.error("❌ Failed to save form structure", err);
      alert("❌ Error saving form structure. Check console for details.");
    }
  };



  const handleExportCSV = () => {
    const csvRows: string[] = [];

    // Headers
    const headers = formFields.map(field => field.label);
    headers.push("Submitted At");
    csvRows.push(headers.join(","));

    // Rows
    applications.forEach(app => {
      const row = formFields.map(field => {
        const val = app.data?.[field.field_name];

        let formatted = "";
        if (Array.isArray(val)) {
          formatted = val.map(v => {
            return typeof v === "string" && v.startsWith("http")
              ? v
              : v.toString();
          }).join(", ");
        } else if (typeof val === "string" && val.startsWith("http")) {
          formatted = val;
        } else {
          formatted = val?.toString() || "";
        }

        return `"${formatted.replace(/"/g, '""')}"`;
      });

      row.push(`"${new Date(app.createdAt).toLocaleString()}"`);
      csvRows.push(row.join(","));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Vac_applications.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log("✅ CSV Exported with file links");
  };





  return (
    <>
      <AdminHeader />

      <div className="job-page-wrapper">
        <div className="container section-title">
          <h2>Vacancies</h2>
          <p>Manage and view vacancies below.</p>
        </div>

        <div className="tabs-container">
          <button className={`tab-btn ${activeTab === "create" ? "active-tab" : ""}`} onClick={() => setActiveTab("create")}>
            Create Vacancy
          </button>
          <button className={`tab-btn ${activeTab === "view" ? "active-tab" : ""}`} onClick={() => setActiveTab("view")}>
            View Vacancies
          </button>
          <button className={`tab-btn ${activeTab === "applications" ? "active-tab" : ""}`} onClick={() => setActiveTab("applications")}>
            View Applications
          </button>
          <button className={`tab-btn ${activeTab === "edit-structure" ? "active-tab" : ""}`} onClick={() => setActiveTab("edit-structure")}>
            Edit Form Structure
          </button>
        </div>

        <div className="job-box">
          {activeTab === "create" && (
            <form onSubmit={handleSubmit}>
              <h2 className="section-heading"><Briefcase size={28} className="me-2" />Create New Vacancy</h2>
              <div className="form-group">
                <label><User size={16} className="me-2" /> Job Title</label>
                <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label><User size={16} className="me-2" /> Career Level</label>
                <input className="form-input" value={careerLevel} onChange={(e) => setCareerLevel(e.target.value)} required />
              </div>
              <div className="form-group">
                <label><Clock size={16} className="me-2" /> Employment Type</label>
                <select className="form-input" value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} required>
                  {!isInternshipPage && (
                    <>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                    </>
                  )}
                  {isInternshipPage && <option value="Internship">Internship</option>}
                </select>
              </div>
              <button type="submit" className="btn-primary mt-3">Save Job</button>
            </form>
          )}

          {activeTab === "view" && (
            <>
              <h2 className="section-heading"><Briefcase size={28} className="me-2" />Available Vacancies</h2>
              <div className="scroll-grid mt-4">
                {jobs.map((job) => (
                  <div key={job._id} className="card">
                    <h5>{job.title}</h5>
                    <p><strong>Career Level:</strong> {job.careerLevel}<br /><strong>Type:</strong> {job.employmentType}</p>
                    <button className="btn-danger btn-sm" onClick={() => handleDeleteJob(job._id)}>
                      <Trash2 size={16} className="me-1" /> Delete
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "applications" && (
            <>
              <h2 className="section-heading">
                <Eye size={24} className="me-2" />Vacancy Applications
              </h2>

              <button className="btn-primary mb-3" onClick={handleExportCSV}>
                📥 Export as CSV
              </button>

              <div className="scroll-grid mt-4">
                {applications.map((app) => (
                  <div key={app._id} className="card">
                    <h5>{app.data?.full_name || "Untitled Applicant"}</h5>
                    <p>
                      <strong>Email:</strong> {app.data?.email || "N/A"}
                      <br />
                      <strong>Submitted:</strong> {new Date(app.createdAt).toLocaleString()}
                    </p>

                    <div className="btn-group mt-2">
                      <button className="btn-primary btn-sm" onClick={() => toggleView(app._id)}>
                        <Eye size={16} className="me-1" /> {app.expanded ? "Hide" : "View"}
                      </button>
                      <button className="btn-danger btn-sm" onClick={() => handleDeleteApplication(app._id)}>
                        <Trash2 size={16} className="me-1" /> Delete
                      </button>
                    </div>
                    {app.expanded && (
                      <div className="application-details mt-3">
                        {Object.entries(app.data).map(([key, value]) => (
                          <p key={key}>
                            <strong>{key}:</strong>{" "}
                            {Array.isArray(value) ? (
                              value.every((v) => typeof v === "string" && /\.(pdf|docx?|png|jpe?g)$/i.test(v)) ? (
                                value.map((fileUrl, idx) => (
                                  <span key={idx}>
                                    <a
                                      href={fileUrl.startsWith("http") ? fileUrl : `http://localhost:3000/uploads/vacancy/${fileUrl}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      download
                                    >
                                      📎 View File {idx + 1}
                                    </a>
                                    {idx < value.length - 1 && ", "}
                                  </span>
                                ))
                              ) : (
                                value.join(", ")
                              )
                            ) : typeof value === "string" && /\.(pdf|docx?|png|jpe?g)$/i.test(value) ? (
                              <a
                                href={value.startsWith("http") ? value : `http://localhost:3000/uploads/vacancy/${value}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                              >
                                📎 View File
                              </a>
                            ) : (
                              value?.toString()
                            )}

                          </p>
                        ))}


                      </div>
                    )}

                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "edit-structure" && (
            <>
              <h2 className="section-heading">
                <FileEdit size={24} className="me-2" />Edit Form Structure
              </h2>

              {formFields.length === 0 ? (
                <p className="text-muted">No fields yet. Click <strong>Add New Field</strong> to begin.</p>
              ) : (
                formFields.map((field, index) => (
                  <div key={field.id || index} className="form-structure-box">
                    <input
                      className="form-input"
                      value={field.field_name}
                      onChange={(e) => updateField(index, "field_name", e.target.value)}
                      placeholder="Field Name"
                    />
                    <input
                      className="form-input"
                      value={field.label}
                      onChange={(e) => updateField(index, "label", e.target.value)}
                      placeholder="Field Label"
                    />
                    <select
                      className="form-input"
                      value={field.type}
                      onChange={(e) => updateField(index, "type", e.target.value)}
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="phone">Phone</option>
                      <option value="email">Email</option>
                      <option value="select">Select</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="textarea">Textarea</option>
                      <option value="date">Date</option>
                      <option value="file">File</option> {/* ✅ Added file */}
                    </select>
                    <label className="ms-2">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(index, "required", e.target.checked)}
                      /> Required
                    </label>

                    {/* ✅ Optional: show message if file field */}
                    {field.type === "file" && (
                      <div className="mt-2 text-info small">
                        📎 File upload field will allow users to attach a file.
                      </div>
                    )}

                    <div className="btn-group mt-2">
                      <button className="btn-move" onClick={() => moveFieldUp(index)} disabled={index === 0}>🔼 Move Up</button>
                      <button className="btn-move" onClick={() => moveFieldDown(index)} disabled={index === formFields.length - 1}>🔽 Move Down</button>
                      <button className="btn-danger btn-sm" onClick={() => removeField(index)}>🗑️ Remove</button>
                    </div>
                    <hr />
                  </div>
                ))
              )}

              <button className="btn-primary mt-3" onClick={addField}>➕ Add New Field</button>
              <button className="btn-primary mt-3 ms-3" onClick={saveFields}>💾 Save Structure</button>
            </>
          )}


        </div>
      </div>

      <AdminFooter />
    </>
  );
}
