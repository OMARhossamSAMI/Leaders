"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Trash2,
  PencilLine,
  Save,
  XCircle,
} from "lucide-react";
import "./page.css";
import AdminHeader from "../../../components/AdminHeader";
import AdminFooter from "../../../components/AdminFooter";
import { useRouter } from "next/navigation";
import { getPaginationRange } from "@/utils/pagination";

type FieldValue = string | number | boolean | string[] | File | null;

interface Application {
  _id: string;
  createdAt: string;
  updatedAt: string; // ✅ Add this to fix the error
  data: Record<string, FieldValue>; // all dynamic fields stored here
  files?: { originalname: string; path: string }[];
}

interface FormField {
  field_name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedData, setExpandedData] = useState<Record<string, Application>>(
    {}
  );
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [formFields, setFormFields] = useState<FormField[]>([]);

  const [editingFormStructure, setEditingFormStructure] = useState(false);
  const [formStructureDraft, setFormStructureDraft] = useState<FormField[]>([]);

  const [activeTab, setActiveTab] = useState<"applications" | "form">(
    "applications"
  );
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const [loadingApplications, setLoadingApplications] = useState(true);
  const renderFieldValue = (value: unknown): React.ReactNode => {
    if (value === null || value === undefined) return <em>Not provided</em>;
    if (typeof value === "string" || typeof value === "number") return value;
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) return value.join(", ");
    if (value instanceof File) return value.name;
    if (typeof value === "object") return JSON.stringify(value);
    return <em>Unsupported</em>;
  };
  const getSafeInputValue = (
    value: string | number | boolean | string[] | File | null | undefined
  ): string | number | readonly string[] | undefined => {
    if (typeof value === "string" || typeof value === "number") return value;
    if (Array.isArray(value)) return value;
    return ""; // fallback for null, undefined, boolean, File, etc.
  };
  // Calculate pagination
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 10;

  const totalPages = Math.ceil(applications.length / applicationsPerPage);
  const indexOfLastApp = currentPage * applicationsPerPage;
  const indexOfFirstApp = indexOfLastApp - applicationsPerPage;
  const currentApplications = applications.slice(
    indexOfFirstApp,
    indexOfLastApp
  );
  const [source, setSource] = useState<'all' | 'unbooked'>('all');



  useEffect(() => {
    setLoadingApplications(true);

    // load form fields (unchanged)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/form-fields`)
      .then((res) => res.json())
      .then((data: FormField[]) => setFormFields(data))
      .catch((err) => console.error("Failed to fetch form fields", err));

    // load applications depending on source
    const url =
      source === 'all'
        ? `${process.env.NEXT_PUBLIC_API_URL}/applications`
        : `${process.env.NEXT_PUBLIC_API_URL}/applications/unbooked?unpaid=1`;

    fetch(url)
      .then((res) => res.json())
      .then((apps: Application[]) => {
        const normalized = apps.map((app) => ({ ...app, files: app.files ?? [] }));
        setApplications(normalized);
      })
      .catch((err) => console.error("Failed to fetch applications", err))
      .finally(() => setLoadingApplications(false));
  }, [source]);


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");

    if (!token) {
      router.push("/lic-auth-v9v3tz");
    } else {
      setAuthenticated(true);
    }
  }, [router]);
  if (!authenticated) return null; // prevent flashing
  const handleExpand = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }

    if (!expandedData[id]) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/applications/${id}`
        );
        let data = await res.json();
        if (data.data) data = { ...data, ...data.data };
        setExpandedData((prev) => ({ ...prev, [id]: data }));
      } catch (error) {
        console.error("Failed to fetch full application", error);
      }
    }

    setExpandedId(id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${id}`, {
      method: "DELETE",
    });
    setApplications((prev) => prev.filter((app) => app._id !== id));
    setExpandedId(null);
  };

  const handleEditChange = (
    key: string,
    value: string | number | boolean | File | undefined
  ) => {
    if (editingApp) {
      const updatedData = { ...editingApp.data };
      if (value !== undefined) {
        updatedData[key] = value;
      }

      setEditingApp({
        ...editingApp,
        data: updatedData,
      });
    }
  };

  const handleUpdate = async () => {
    if (!editingApp) return;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/applications/${editingApp._id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: editingApp.data }),
      }
    );

    if (response.ok) {
      setApplications((prev) =>
        prev.map((a) => (a._id === editingApp._id ? editingApp : a))
      );
      setExpandedData((prev) => ({
        ...prev,
        [editingApp._id]: editingApp,
      }));
      alert("Updated!");
      setEditingApp(null);
    } else {
      alert("Update failed");
    }
  };

  const handleFormStructureEdit = () => {
    setFormStructureDraft([...formFields]);
    setEditingFormStructure(true);
    setActiveTab("form");
  };

  const handleFieldChange = (
    index: number,
    key: keyof FormField,
    value: FieldValue
  ) => {
    const updated = [...formStructureDraft];
    if (key === "options" && updated[index].type === "select") {
      updated[index].options = value as string[];
    } else if (key !== "options") {
      updated[index] = {
        ...updated[index],
        [key]: value,
      };
    }
    setFormStructureDraft(updated);
  };

  const handleAddField = () => {
    setFormStructureDraft([
      ...formStructureDraft,
      { field_name: "", label: "", type: "text", required: false, options: [] },
    ]);
  };

  const handleRemoveField = (index: number) => {
    const updated = [...formStructureDraft];
    updated.splice(index, 1);
    setFormStructureDraft(updated);
  };

  const handleSaveForm = async () => {
    const formWithOrder = formStructureDraft.map((field, index) => ({
      ...field,
      order: index,
    }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/form-fields`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formWithOrder),
        }
      );

      if (response.ok) {
        setFormFields(formWithOrder);
        setEditingFormStructure(false);
        setActiveTab("applications");
        alert("Form structure saved successfully!");
      } else {
        alert("Failed to save form structure");
      }
    } catch (error) {
      console.error("Failed to save form fields:", error);
      alert("Failed to save form structure");
    }
  };

  const handleMoveField = (index: number, direction: number) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= formStructureDraft.length) return;

    const updated = [...formStructureDraft];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(newIndex, 0, movedItem);
    setFormStructureDraft(updated);
  };

  const countApplicationsPerDay = (
    applications: Application[]
  ): Record<string, number> => {
    const counts: Record<string, number> = {};

    applications.forEach((app) => {
      const date = new Date(app.createdAt).toLocaleDateString(); // or .toISOString().split('T')[0]
      counts[date] = (counts[date] || 0) + 1;
    });

    return counts;
  };

  const applicationCounts = countApplicationsPerDay(applications);

  // ✅ Export to CSV function
  const exportToExcel = () => {
    const csvRows: string[] = [];

    const headers = [
      ...formFields.map((f) => f.label),
      "Submitted",
      "Last Updated",
      "Uploaded Files",
    ];
    csvRows.push(headers.join(","));

    console.log("📋 Exporting CSV...");
    console.log(
      "📂 Form field names:",
      formFields.map((f) => f.field_name)
    );

    applications.forEach((app, appIndex) => {
      const row: string[] = [];
      console.log(`📄 Processing Application #${appIndex} (ID: ${app._id})`);
      console.log("↳ app.data keys:", Object.keys(app.data || {}));

      formFields.forEach((field) => {
        const val = app?.data?.[field.field_name];
        console.log(`   🔎 Field "${field.field_name}" →`, val);

        if (
          field.type === "date" &&
          typeof val === "string" &&
          val.trim() !== ""
        ) {
          try {
            const formattedDate = new Date(val).toLocaleDateString("en-GB"); // → DD/MM/YYYY
            row.push(`"${formattedDate}"`);
          } catch {
            row.push(`"${val}"`); // fallback
          }
        } else if (Array.isArray(val)) {
          row.push(`"${val.join(",").replace(/"/g, '""')}"`);
        } else if (typeof val === "object" && val !== null) {
          row.push(`"${JSON.stringify(val).replace(/"/g, '""')}"`);
        } else {
          row.push(`"${String(val ?? "Not provided").replace(/"/g, '""')}"`);
        }
      });

      row.push(`"${new Date(app.createdAt).toISOString()}"`);
      row.push(`"${new Date(app.updatedAt).toISOString()}"`);

      if (Array.isArray(app.files) && app.files.length > 0) {
        const fileLinks = app.files
          .map((file) =>
            file?.path
              ? `${process.env.NEXT_PUBLIC_API_URL}/${file.path}`
              : "Invalid file"
          )
          .join(", ");
        row.push(`"${fileLinks.replace(/"/g, '""')}"`);
      } else {
        row.push(`"No files uploaded"`);
      }

      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "school_applications.csv";
    link.click();
    URL.revokeObjectURL(url);
  };




  return (
    <>
      <AdminHeader />

      <div
        style={{
          backgroundColor: "#f5f9f9",
          minHeight: "100vh",
          padding: "2rem",
          marginTop: "100px",
        }}
      >
        {/* Move it here so it's not hidden under header */}
        <div
          className="container section-title"
          style={{
            marginTop: "60px", // ✅ push it down from header
          }}
        >
          <h2>Student Applications</h2>
          <p>View applications and edit your form</p>
        </div>
        {/* Tabs (outside shadow box) */}
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === "applications" ? "active-tab" : ""
              }`}
            onClick={() => setActiveTab("applications")}
          >
            Submitted Applications
          </button>
          <button
            className={`tab-btn ${activeTab === "form" ? "active-tab" : ""}`}
            onClick={handleFormStructureEdit}
          >
            Edit Form Structure
          </button>
        </div>
        {/* Shadowed content box (starts below tabs) */}
        <div
          style={{
            background: "#ffffff",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
            maxWidth: "1300px",
            margin: "0 auto",
          }}
        >
          {/* === Applications Tab === */}
          {activeTab === "applications" && (
            <>
              {loadingApplications ? (
                <>
                  <button
                    onClick={exportToExcel}
                    className="btn-primary mb-4"
                    style={{ display: "block", marginLeft: "auto" }}
                  >
                    📥 Export All as CSV
                  </button>
                  <div className="loader-container">
                    <div className="spinner" />
                    <p className="loading-text">
                      Loading Students applications...
                    </p>
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
                      border-top: 6px solid #3999ddff;
                      border-radius: 50%;
                      animation: spin 0.9s linear infinite;
                    }

                    .loading-text {
                      margin-top: 1rem;
                      font-size: 1.1rem;
                      font-weight: 500;
                      color: #2a7db8ff;
                    }

                    @keyframes spin {
                      to {
                        transform: rotate(360deg);
                      }
                    }
                  `}</style>
                </>
              ) : (
                <>
                  {applications.length === 0 ? (
                    <p className="text-center text-muted mt-4">
                      No applications submitted yet.
                    </p>
                  ) : (
                    <>
                      <button
                        onClick={() => setSource("all")}
                        style={{
                          backgroundColor: source === "all" ? "var(--accent-color)" : "#fff",
                          border: `1px solid var(--accent-color)`,
                          color: source === "all" ? "#fff" : "var(--accent-color)",
                          borderRadius: "6px",
                          padding: "6px 14px",
                          fontWeight: 500,
                        }}
                      >
                        All applications
                      </button>

                      <button
                        onClick={() => setSource("unbooked")}
                        title="Show students who submitted but did not book/pay their assessment"
                        style={{
                          backgroundColor: source === "unbooked" ? "var(--accent-color)" : "#fff",
                          border: `1px solid var(--accent-color)`,
                          color: source === "unbooked" ? "#fff" : "var(--accent-color)",
                          borderRadius: "6px",
                          padding: "6px 14px",
                          fontWeight: 500,
                        }}
                      >
                        No assessment
                      </button>

                      <button
                        onClick={exportToExcel}
                        style={{
                          backgroundColor: "var(--accent-color)",
                          border: `1px solid var(--accent-color)`,
                          color: "#fff",
                          borderRadius: "6px",
                          padding: "6px 14px",
                          fontWeight: 500,
                          display: "block",
                          marginLeft: "auto",
                        }}
                      >
                        📥 Export All as CSV
                      </button>


                      <div className="application-stats mt-4">
                        <div className="stats-header">
                          <h4>📊 Applications Submitted Per Day</h4>
                          <span>{Object.keys(applicationCounts).length} days</span>
                        </div>

                        <div className="stats-scroll">
                          {Object.entries(applicationCounts).map(([date, count]) => (
                            <div key={date} className="stats-row">
                              <span className="stats-date">
                                {new Date(date).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>

                              <span className="stats-count">
                                {count} application{count > 1 ? "s" : ""}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "1.5rem",
                        }}
                      >
                        {Array.isArray(currentApplications) &&
                          currentApplications.map((app) => {
                            const displayName =
                              typeof app?.data?.student_name === "string" &&
                                app.data.student_name.trim() !== ""
                                ? app.data.student_name.trim()
                                : Object.entries(app?.data || {}).find(
                                  ([key, val]) =>
                                    key.toLowerCase().includes("name") &&
                                    typeof val === "string" &&
                                    val.trim() !== ""
                                )?.[1] || "Unnamed Applicant";

                            return (
                              <div
                                key={app._id}
                                style={{
                                  background: "#fff",
                                  borderRadius: "10px",
                                  padding: "1.5rem",
                                  width: "100%",
                                  maxWidth: "600px",
                                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                {/* Header */}
                                <div className="flex justify-between items-center">
                                  <h3 className="text-lg font-semibold text-blue-700">
                                    {renderFieldValue(displayName)}
                                  </h3>

                                  <div className="flex gap-2">
                                    {/* keep expand toggle */}
                                    <button
                                      onClick={() => handleExpand(app._id)}
                                      className="icon-button"
                                      aria-label={
                                        expandedId === app._id
                                          ? "Collapse"
                                          : "Expand"
                                      }
                                      title={
                                        expandedId === app._id
                                          ? "Collapse"
                                          : "Expand"
                                      }
                                    >
                                      {expandedId === app._id ? (
                                        <EyeOff />
                                      ) : (
                                        <Eye />
                                      )}
                                    </button>


                                    {/* keep delete */}
                                    <button
                                      onClick={() => handleDelete(app._id)}
                                      className="icon-button text-red-600"
                                      aria-label="Delete application"
                                      title="Delete application"
                                      type="button"
                                    >
                                      <Trash2 />
                                    </button>
                                  </div>
                                </div>

                                {/* Basic Info */}
                                <p className="text-sm text-gray-600 mb-2">
                                  <strong>Grade:</strong>{" "}
                                  {renderFieldValue(
                                    app.data?.grade_applying_for || "N/A"
                                  )}
                                </p>

                                <p className="text-sm text-gray-600 mb-2">
                                  <strong>Submitted:</strong>{" "}
                                  {app.createdAt
                                    ? new Date(
                                      String(app.createdAt)
                                    ).toLocaleDateString()
                                    : "N/A"}
                                </p>

                                {/* Files */}
                                {Array.isArray(app.files) &&
                                  app.files.length > 0 && (
                                    <div className="text-sm text-gray-600 mb-4">
                                      <strong>Files:</strong>
                                      <ul className="list-disc ml-5">
                                        {app.files.map((file, idx) =>
                                          file?.path ? (
                                            <li key={idx}>
                                              <a
                                                href={`${process.env.NEXT_PUBLIC_API_URL}/${file.path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline"
                                              >
                                                {file.originalname ||
                                                  "Download file"}
                                              </a>
                                            </li>
                                          ) : (
                                            <li
                                              key={idx}
                                              className="text-red-500"
                                            >
                                              Invalid file reference
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  )}

                                {/* Expanded View */}
                                {expandedId === app._id && (
                                  <>
                                    {!expandedData[app._id] ? (
                                      <p>Loading full data...</p>
                                    ) : !editingApp ||
                                      editingApp._id !== app._id ? (
                                      <>
                                        {formFields.map((field) => (
                                          <p key={field.field_name}>
                                            <strong>{field.label}:</strong>{" "}
                                            {renderFieldValue(
                                              expandedData[app._id]?.data?.[
                                              field.field_name
                                              ]
                                            )}
                                          </p>
                                        ))}
                                        <button
                                          onClick={() =>
                                            setEditingApp(expandedData[app._id])
                                          }
                                          className="btn-secondary mt-3"
                                        >
                                          <PencilLine
                                            className="inline mr-1"
                                            size={18}
                                          />{" "}
                                          Edit
                                        </button>
                                      </>
                                    ) : (
                                      <div className="mt-4 space-y-3">
                                        {formFields.map((field) => (
                                          <div key={field.field_name}>
                                            {field.type === "select" ? (
                                              <select
                                                value={
                                                  getSafeInputValue(
                                                    editingApp?.data?.[
                                                    field.field_name
                                                    ]
                                                  ) || ""
                                                }
                                                onChange={(e) =>
                                                  handleEditChange(
                                                    field.field_name,
                                                    e.target.value
                                                  )
                                                }
                                                className="form-input border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                              >
                                                <option value="" disabled>
                                                  Select {field.label}
                                                </option>
                                                {Array.isArray(field.options) &&
                                                  field.options.map((opt) => (
                                                    <option
                                                      key={opt}
                                                      value={opt}
                                                    >
                                                      {opt}
                                                    </option>
                                                  ))}
                                              </select>
                                            ) : (
                                              <input
                                                type={field.type}
                                                value={getSafeInputValue(
                                                  editingApp?.data?.[
                                                  field.field_name
                                                  ]
                                                )}
                                                onChange={(e) =>
                                                  handleEditChange(
                                                    field.field_name,
                                                    e.target.value
                                                  )
                                                }
                                                className="form-input"
                                                placeholder={field.label}
                                              />
                                            )}
                                          </div>
                                        ))}
                                        <div className="flex gap-2 mt-3">
                                          <button
                                            onClick={handleUpdate}
                                            className="btn-success"
                                          >
                                            <Save
                                              className="inline mr-1"
                                              size={16}
                                            />{" "}
                                            Save
                                          </button>
                                          <button
                                            onClick={() => setEditingApp(null)}
                                            className="btn-danger"
                                          >
                                            <XCircle
                                              className="inline mr-1"
                                              size={16}
                                            />{" "}
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })}
                      </div>

                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="pagination-wrapper">
                          <button
                              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                              style={{
                                backgroundColor: currentPage === 1 ? "#f5f5f5" : "#fff",
                                border: `1px solid var(--accent-color)`,
                                color: currentPage === 1 ? "#999" : "var(--accent-color)",
                                borderRadius: "6px",
                                padding: "4px 10px",
                                fontSize: "0.875rem",
                                fontWeight: 500,
                                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                              }}
                            >
                              ⬅ Prev
                            </button>

                            {getPaginationRange(currentPage, totalPages).map((item, index) => {
                              if (item === "ellipsis") {
                                return (
                                  <span
                                    key={`ellipsis-${index}`}
                                    style={{
                                      padding: "4px 10px",
                                      fontSize: "0.875rem",
                                      color: "#999",
                                    }}
                                  >
                                    …
                                  </span>
                                );
                              }
                              const page = item;
                              const isActive = currentPage === page;
                              return (
                                <button
                                  key={page}
                                  onClick={() => setCurrentPage(page)}
                                  style={{
                                    backgroundColor: isActive ? "var(--accent-color)" : "#fff",
                                    border: `1px solid var(--accent-color)`,
                                    color: isActive ? "#fff" : "var(--accent-color)",
                                    borderRadius: "6px",
                                    padding: "4px 10px",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                  }}
                                >
                                  {page}
                                </button>
                              );
                            })}

                            <button
                              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                              disabled={currentPage === totalPages}
                              style={{
                                backgroundColor: currentPage === totalPages ? "#f5f5f5" : "#fff",
                                border: `1px solid var(--accent-color)`,
                                color: currentPage === totalPages ? "#999" : "var(--accent-color)",
                                borderRadius: "6px",
                                padding: "4px 10px",
                                fontSize: "0.875rem",
                                fontWeight: 500,
                                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                              }}
                            >
                              Next ➡
                            </button>

                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}

          {/* === Form Structure Tab === */}
          {activeTab === "form" && editingFormStructure && (
            <div
              style={{
                background: "#fff",
                padding: "2rem",
                marginTop: "2rem",
                borderRadius: "10px",
              }}
            >
              <h3>Edit Form Structure</h3>
              {formStructureDraft.map((field, index) => {
                const isLocked =
                  field.field_name === "father_email" ||
                  field.field_name === "student_name";

                return (
                  <div
                    key={index}
                    style={{
                      marginBottom: "1rem",
                      borderBottom: "1px solid #ddd",
                      paddingBottom: "1rem",
                    }}
                  >
                    <input
                      className="form-input mb-1"
                      placeholder="Field Name"
                      value={field.field_name}
                      onChange={(e) =>
                        handleFieldChange(index, "field_name", e.target.value)
                      }
                      disabled={isLocked}
                    />
                    <input
                      className="form-input mb-1"
                      placeholder="Label"
                      value={field.label}
                      onChange={(e) =>
                        handleFieldChange(index, "label", e.target.value)
                      }
                      disabled={isLocked}
                    />
                    <select
                      className="form-input mb-1"
                      value={field.type}
                      onChange={(e) =>
                        handleFieldChange(index, "type", e.target.value)
                      }
                      disabled={isLocked}
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="email">Email</option>
                      <option value="tel">Phone</option>
                      <option value="date">Date</option>
                      <option value="select">Select</option>
                      <option value="file">File Upload</option>
                    </select>

                    <label className="form-check">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) =>
                          handleFieldChange(index, "required", e.target.checked)
                        }
                        disabled={isLocked}
                      />{" "}
                      Required
                    </label>

                    {field.type === "file" && (
                      <input
                        type="file"
                        onChange={(e) =>
                          handleEditChange(
                            field.field_name,
                            e.target.files?.[0]
                          )
                        }
                        className="form-input"
                        disabled={isLocked}
                      />
                    )}

                    {field.type === "select" && (
                      <input
                        className="form-input mt-1"
                        placeholder="Comma-separated options"
                        value={field.options?.join(",") || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            index,
                            "options",
                            e.target.value.split(",").map((opt) => opt.trim())
                          )
                        }
                        disabled={isLocked}
                      />
                    )}

                    <div className="flex gap-2 mt-2">
                      <button
                        className="btn-secondary"
                        onClick={() => handleMoveField(index, -1)}
                      >
                        🔼 Move Up
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => handleMoveField(index, 1)}
                      >
                        🔽 Move Down
                      </button>
                      <button
                        className="btn-danger"
                        disabled={isLocked}
                        onClick={() => handleRemoveField(index)}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                );
              })}

              <button onClick={handleAddField} className="btn-secondary mt-2">
                ➕ Add Field
              </button>
              <div className="mt-4 flex gap-3">
                <button onClick={handleSaveForm} className="btn-success">
                  💾 Save Form
                </button>
                <button
                  onClick={() => {
                    setEditingFormStructure(false);
                    setActiveTab("applications");
                  }}
                  className="btn-danger"
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          )}
        </div>{" "}
        {/* end of white shadow box */}
      </div>
      <AdminFooter />
    </>
  );
}
