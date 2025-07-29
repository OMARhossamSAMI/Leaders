"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { Briefcase, User, Clock, Trash2, FileEdit, Eye } from "lucide-react";
import AdminHeader from "../../../components/AdminHeader";
import AdminFooter from "../../../components/AdminFooter";
import "./page.css";

// Interfaces
interface Job {
  _id: string;
  title: string;
  careerLevel: string;
  employmentType: string;
  academicYear: string;
  startYear: number;
  endYear: number;
  createdAt: string;
}


interface FileMeta {
  path: string;
  originalname?: string;
}

interface Vacancy {
  _id: string;
  data: FormDataMap;
  createdAt: string;
  expanded?: boolean;
  files?: FileMeta[]; // ✅ Add this line
}


interface FormField {
  id: string;
  field_name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[]; // ✅ used for select, checkbox, radio
  order: number;      // ✅ to support field ordering
}

type FormDataMap = {
  [key: string]: string | number | boolean | File | string[] | undefined;
};

export default function JobManagementPage() {
  const [activeTab, setActiveTab] = useState<
    "create" | "view" | "applications" | "edit-structure"
  >("create");
  const [title, setTitle] = useState("");
  const [careerLevel, setCareerLevel] = useState("Experienced (Non-Manager)");
  const [employmentType, setEmploymentType] = useState("Full Time");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Vacancy[]>([]);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const pathname = usePathname();
  const isInternshipPage = pathname.includes("/Internship");
  const router = useRouter();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const baseYear = currentMonth >= 6 ? currentYear : currentYear - 1;

  const currentAcademic = `${String(baseYear).slice(2)}/${String(baseYear + 1).slice(2)}`;
  const nextAcademic = `${String(baseYear + 1).slice(2)}/${String(baseYear + 2).slice(2)}`;

  const academicYearOptions = [currentAcademic, nextAcademic];

  const [academicYear, setAcademicYear] = useState(currentAcademic);
  const [startYear, setStartYear] = useState(baseYear);
  const [endYear, setEndYear] = useState(baseYear + 1);




  // Auth
  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) {
      router.push("/login");
    } else {
      setAuthenticated(true);
    }
  }, [router]);

  // Init
  useEffect(() => {
    setEmploymentType(isInternshipPage ? "Internship" : "Full Time");
    fetchJobs();
    fetchApplications();
    fetchFormStructure();
  }, [isInternshipPage]);

  // Fetch
  const fetchJobs = async () => {
    try {
      const res = await axios.get<Job[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs`
      );
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/vacancy`);
      const appsWithExpand = (res.data as Vacancy[]).map((app) => ({
        ...app,
        expanded: false,
      }));
      setApplications(appsWithExpand);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    }
  };

  const fetchFormStructure = async () => {
    try {
      const res = await axios.get<FormField[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/employment-form-fields`
      );
      setFormFields(res.data);
    } catch (err) {
      console.error("Failed to fetch form structure", err);
    }
  };

  // Handlers (submit, delete, etc.)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
        title,
        careerLevel,
        employmentType,
        academicYear,
        startYear,
        endYear,
      });
      alert("Job created successfully");
      setTitle("");
      setCareerLevel("Experienced (Non-Manager)");
      setEmploymentType(isInternshipPage ? "Internship" : "Full Time");

      // Reset academic year selection (optional)
      const currentDate = new Date();
      const baseYear = currentDate.getMonth() + 1 >= 6 ? currentDate.getFullYear() : currentDate.getFullYear() - 1;
      setAcademicYear(`${String(baseYear).slice(2)}/${String(baseYear + 1).slice(2)}`);
      setStartYear(baseYear);
      setEndYear(baseYear + 1);

      fetchJobs();
      setActiveTab("view");
    } catch (err) {
      alert("Failed to create job");
      console.error(err);
    }
  };


  const handleDeleteJob = async (id: string) => {
    if (!confirm("Delete this job?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`);
      setJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (err) {
      alert("Failed to delete job");
      console.error(err);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!confirm("Delete this application?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/vacancy/${id}`);
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

  const updateField = (
    index: number,
    key: keyof FormField,
    value: FormField[keyof FormField]
  ) => {
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
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
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
        id: Math.random().toString(36).substring(2),
        field_name: "",
        label: "",
        type: "text",
        required: false,
        options: [], // optional, safe to default
        order: prev.length, // add new field to the end
      },
    ]);
  };


  const addOption = (fieldIndex: number) => {
    const updated = [...formFields];
    if (!updated[fieldIndex].options) updated[fieldIndex].options = [];
    updated[fieldIndex].options.push("");
    setFormFields(updated);
  };

  const updateOption = (fieldIndex: number, optionIndex: number, value: string) => {
    const updated = [...formFields];
    if (!updated[fieldIndex].options) return;
    updated[fieldIndex].options[optionIndex] = value;
    setFormFields(updated);
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const updated = [...formFields];
    if (!updated[fieldIndex].options) return;
    updated[fieldIndex].options.splice(optionIndex, 1);
    setFormFields(updated);
  };

  const saveFields = async () => {
    const errors = formFields.reduce<string[]>((errs, f, i) => {
      if (!f.field_name.trim())
        errs.push(`Missing 'field_name' in field ${i + 1}`);
      if (!f.label.trim()) errs.push(`Missing 'label' in field ${i + 1}`);
      if (!f.type.trim()) errs.push(`Missing 'type' in field ${i + 1}`);
      return errs;
    }, []);

    if (errors.length) {
      alert("Validation errors:\n" + errors.join("\n"));
      return;
    }

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/employment-form-fields`,
        formFields
      );
      alert("✅ Structure saved!");
    } catch (err) {
      console.error("Save failed", err);
      alert("❌ Error saving structure");
    }
  };

  const countApplicationsPerDay = (applications: Vacancy[]): Record<string, number> => {
  const counts: Record<string, number> = {};

  applications.forEach((app) => {
    const date = new Date(app.createdAt).toLocaleDateString(); // Format: MM/DD/YYYY
    counts[date] = (counts[date] || 0) + 1;
  });

  return counts;
};

const applicationCounts = countApplicationsPerDay(applications);



  const handleExportCSV = () => {
    const csvRows: string[] = [];

    // Add 'Uploaded Files' column manually
    const headers = [...formFields.map((f) => f.label), "Uploaded Files", "Submitted At"];
    csvRows.push(headers.join(","));

    applications.forEach((app) => {
      const row = formFields.map((f) => {
        // Prevent writing duplicate file info from form data
        const val = app.data[f.field_name];

        if (Array.isArray(val)) {
          return `"${val.join(",").replace(/"/g, '""')}"`;
        }
        return `"${String(val ?? "").replace(/"/g, '""')}"`;
      });

      // ✅ Append uploaded file links from app.files
      const fileLinks = Array.isArray(app.files)
        ? app.files
          .map((file) =>
            typeof file === "object" && file.path
              ? `${process.env.NEXT_PUBLIC_API_URL}/${file.path}`
              : ""
          )
          .filter((link) => link !== "")
          .join(" | ")
        : "";

      row.push(`"${fileLinks}"`);

      // Append submission timestamp
      row.push(`"${new Date(app.createdAt).toLocaleString()}"`);

      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Vac_applications.csv";
    link.click();
    URL.revokeObjectURL(url);
  };


  if (!authenticated) return null;

  return (
    <>
      <AdminHeader />

      <div className="job-page-wrapper">
        <div className="container section-title">
          <h2>Vacancies</h2>
          <p>Manage and view vacancies below.</p>
        </div>

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
          <button
            className={`tab-btn ${activeTab === "applications" ? "active-tab" : ""
              }`}
            onClick={() => setActiveTab("applications")}
          >
            View Applications
          </button>
          <button
            className={`tab-btn ${activeTab === "edit-structure" ? "active-tab" : ""
              }`}
            onClick={() => setActiveTab("edit-structure")}
          >
            Edit Form Structure
          </button>
        </div>

        <div className="job-box">
          {activeTab === "create" && (
            <form onSubmit={handleSubmit}>
              <h2 className="section-heading">
                <Briefcase size={28} className="me-2" />
                Create New Vacancy
              </h2>

              {/* Job Title */}
              <div className="form-group">
                <label>
                  <User size={16} className="me-2" /> Job Title
                </label>
                <input
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Career Level */}
              <div className="form-group">
                <label>
                  <User size={16} className="me-2" /> Career Level
                </label>
                <input
                  className="form-input"
                  value={careerLevel}
                  onChange={(e) => setCareerLevel(e.target.value)}
                  required
                />
              </div>

              {/* Employment Type */}
              <div className="form-group">
                <label>
                  <Clock size={16} className="me-2" /> Employment Type
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

              {/* Academic Year */}
              <div className="form-group">
                <label>
                  <Clock size={16} className="me-2" /> Academic Year
                </label>
                <select
                  className="form-input"
                  value={academicYear}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setAcademicYear(selected);

                    const [shortStart, shortEnd] = selected.split('/');
                    const start = 2000 + parseInt(shortStart);
                    const end = 2000 + parseInt(shortEnd);

                    setStartYear(start);
                    setEndYear(end);
                  }}
                  required
                >
                  {academicYearOptions.map((year) => {
                    const [start, end] = year.split('/');
                    return (
                      <option key={year} value={year}>
                        {`20${start} / 20${end}`}
                      </option>
                    );
                  })}
                </select>
              </div>



              <button type="submit" className="btn-primary mt-3">
                Save Job
              </button>
            </form>
          )}


          {activeTab === "view" && (
            <>
              <h2 className="section-heading">
                <Briefcase size={28} className="me-2" />
                Available Vacancies
              </h2>
              <div className="scroll-grid mt-4">
                {jobs.map((job) => (
                  <div key={job._id} className="card">
                    <h5>{job.title}</h5>
                    <p>
                      <strong>Career Level:</strong> {job.careerLevel}<br />
                      <strong>Type:</strong> {job.employmentType}<br />
                      <strong>Academic Year:</strong> {job.academicYear}<br />
                      <strong>Start Year:</strong> {job.startYear}<br />
                      <strong>End Year:</strong> {job.endYear}<br />
                      <strong>Created At:</strong> {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      className="btn-danger btn-sm"
                      onClick={() => handleDeleteJob(job._id)}
                    >
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
                <Eye size={24} className="me-2" />
                Vacancy Applications
              </h2>

              <button className="btn-primary mb-3" onClick={handleExportCSV}>
                📥 Export as CSV
              </button>
              <div className="application-stats mt-4">
                <h4>📊 Applications Submitted Per Day</h4>
                <ul>
                  {Object.entries(applicationCounts).map(([date, count]) => (
                    <li key={date}>
                      <strong>{date}:</strong> {count} application{count > 1 ? "s" : ""}
                    </li>
                  ))}
                </ul>
              </div>


              <div className="scroll-grid mt-4">
                {applications.map((app) => (
                  <div key={app._id} className="card">
                    <h5>
                      {app.data?.full_name
                        ? String(app.data?.full_name)
                        : "Untitled Applicant"}
                    </h5>
                    <p>
                      <strong>Email:</strong>{" "}
                      {app.data?.email instanceof File
                        ? app.data.email.name
                        : app.data?.email || "N/A"}
                      <br />
                      <strong>Submitted:</strong>{" "}
                      {new Date(app.createdAt).toLocaleString()}
                    </p>

                    <div className="btn-group mt-2">
                      <button
                        className="btn-primary btn-sm"
                        onClick={() => toggleView(app._id)}
                      >
                        <Eye size={16} className="me-1" />{" "}
                        {app.expanded ? "Hide" : "View"}
                      </button>
                      <button
                        className="btn-danger btn-sm"
                        onClick={() => handleDeleteApplication(app._id)}
                      >
                        <Trash2 size={16} className="me-1" /> Delete
                      </button>
                    </div>
                    {app.expanded && (
                      <div className="application-details mt-3">
                        {Object.entries(app.data).map(([key, value]) => (
                          <p key={key}>
                            <strong>{key}:</strong>{" "}
                            {Array.isArray(value) ? (
                              // Case 1: It's an array of file objects (with `path`)
                              value.every(v => typeof v === "object" && "path" in v) ? (
                                (value as { path: string; originalname?: string }[]).map((fileObj, idx) => (
                                  <span key={idx}>
                                    <a
                                      href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/vacancy/${fileObj.path}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      download
                                    >
                                      📎 {fileObj.originalname || `View File ${idx + 1}`}
                                    </a>
                                    {idx < value.length - 1 && ", "}
                                  </span>
                                ))
                              ) : (
                                // Case 2: It's a plain array of strings (URLs)
                                (value as string[]).every(v => typeof v === "string") &&
                                (value as string[]).map((fileUrl, idx) => (
                                  <span key={idx}>
                                    <a
                                      href={
                                        fileUrl.startsWith("http")
                                          ? fileUrl
                                          : `${process.env.NEXT_PUBLIC_API_URL}/uploads/vacancy/${fileUrl}`
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      download
                                    >
                                      📎 View File {idx + 1}
                                    </a>
                                    {idx < value.length - 1 && ", "}
                                  </span>
                                ))
                              )
                            ) : typeof value === "string" &&
                              /\.(pdf|docx?|png|jpe?g)$/i.test(value) ? (
                              <a
                                href={
                                  value.startsWith("http")
                                    ? value
                                    : `${process.env.NEXT_PUBLIC_API_URL}/uploads/vacancy/${value}`
                                }
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
                <FileEdit size={24} className="me-2" />
                Edit Form Structure
              </h2>

              {formFields.length === 0 ? (
                <p className="text-muted">
                  No fields yet. Click <strong>Add New Field</strong> to begin.
                </p>
              ) : (
                formFields.map((field, index) => (
                  <div key={field.id || index} className="form-structure-box">
                    {/* Field name and label */}
                    <input
                      className="form-input"
                      value={field.field_name}
                      onChange={(e) =>
                        updateField(index, "field_name", e.target.value)
                      }
                      placeholder="Field Name"
                    />
                    <input
                      className="form-input"
                      value={field.label}
                      onChange={(e) =>
                        updateField(index, "label", e.target.value)
                      }
                      placeholder="Field Label"
                    />

                    {/* Type select */}
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
                      <option value="checkbox">Checkbox Group</option>
                      <option value="textarea">Textarea</option>
                      <option value="date">Date</option>
                      <option value="file">File</option>
                    </select>

                    {/* Required checkbox */}
                    <label className="ms-2">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) =>
                          updateField(index, "required", e.target.checked)
                        }
                      />{" "}
                      Required
                    </label>

                    {/* Info for file */}
                    {field.type === "file" && (
                      <div className="mt-2 text-info small">
                        📎 File upload field will allow users to attach a file.
                      </div>
                    )}

                    {/* Options field for select, checkbox group */}
                    {(field.type === "select" || field.type === "checkbox") && (
                      <div className="mt-3">
                        <label className="fw-bold">Options</label>
                        {(field.options || []).map((option: string, optIdx: number) => (
                          <div key={optIdx} className="d-flex align-items-center mb-1">
                            <input
                              className="form-input me-2"
                              value={option}
                              onChange={(e) => updateOption(index, optIdx, e.target.value)}
                              placeholder={`Option ${optIdx + 1}`}
                            />
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => removeOption(index, optIdx)}
                            >
                              ✖
                            </button>
                          </div>
                        ))}
                        <button
                          className="btn btn-sm btn-secondary mt-1"
                          onClick={() => addOption(index)}
                        >
                          ➕ Add Option
                        </button>
                      </div>
                    )}

                    {/* Field controls */}
                    <div className="btn-group mt-3">
                      <button
                        className="btn-move"
                        onClick={() => moveFieldUp(index)}
                        disabled={index === 0}
                      >
                        🔼 Move Up
                      </button>
                      <button
                        className="btn-move"
                        onClick={() => moveFieldDown(index)}
                        disabled={index === formFields.length - 1}
                      >
                        🔽 Move Down
                      </button>
                      <button
                        className="btn-danger btn-sm"
                        onClick={() => removeField(index)}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                    <hr />
                  </div>
                ))
              )}

              <button className="btn-primary mt-3" onClick={addField}>
                ➕ Add New Field
              </button>
              <button className="btn-primary mt-3 ms-3" onClick={saveFields}>
                💾 Save Structure
              </button>
            </>
          )}

        </div>
      </div>

      <AdminFooter />
    </>
  );
}
