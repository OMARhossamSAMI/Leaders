"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Trash2, PencilLine, Save, XCircle } from "lucide-react";
import "./page.css";
import AdminHeader from "@/app/components/AdminHeader";
import AdminFooter from "@/app/components/AdminFooter";
import { useRouter } from "next/navigation";

type FieldValue = string | number | boolean | string[] | File | null;

interface Application {
  _id: string;
  data?: Record<string, FieldValue>;
  [key: string]: FieldValue | Record<string, FieldValue> | undefined;
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

  useEffect(() => {
    setLoadingApplications(true);

    fetch("http://localhost:3000/form-fields")
      .then((res) => res.json())
      .then((data: FormField[]) => setFormFields(data))
      .catch((err: unknown) =>
        console.error("Failed to fetch form fields", err)
      );

    fetch("http://localhost:3000/applications")
      .then((res) => res.json())
      .then((apps: Application[]) => {
        const normalized = apps.map((app) =>
          app.data && typeof app.data === "object"
            ? { ...app, ...app.data }
            : app
        );
        setApplications(normalized);
      })
      .catch((err: unknown) =>
        console.error("Failed to fetch applications", err)
      )
      .finally(() => setLoadingApplications(false));
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");

    if (!token) {
      router.push("/login");
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
        const res = await fetch(`http://localhost:3000/applications/${id}`);
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
    await fetch(`http://localhost:3000/applications/${id}`, {
      method: "DELETE",
    });
    setApplications((prev) => prev.filter((app) => app._id !== id));
    setExpandedId(null);
  };

  const handleEditChange = (key: string, value: string | number | boolean) => {
    if (editingApp) {
      setEditingApp({
        ...editingApp,
        data: {
          ...editingApp.data,
          [key]: value,
        },
      });
    }
  };

  const handleUpdate = async () => {
    if (!editingApp) return;

    const response = await fetch(
      `http://localhost:3000/applications/${editingApp._id}`,
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
      const response = await fetch("http://localhost:3000/form-fields", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formWithOrder),
      });

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
            className={`tab-btn ${
              activeTab === "applications" ? "active-tab" : ""
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
                      No internship applications submitted yet.
                    </p>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "1.5rem",
                      }}
                    >
                      {applications.map((app) => (
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
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">
                              {renderFieldValue(
                                app.student_name ||
                                  app.data?.student_name ||
                                  "Unnamed Applicant"
                              )}
                            </h3>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleExpand(app._id)}
                                className="icon-button"
                              >
                                {expandedId === app._id ? <EyeOff /> : <Eye />}
                              </button>
                              <button
                                onClick={() => handleDelete(app._id)}
                                className="icon-button text-red-600"
                              >
                                <Trash2 />
                              </button>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Grade:</strong>{" "}
                            {renderFieldValue(
                              app.grade_applying_for ||
                                app.data?.grade_applying_for ||
                                "N/A"
                            )}
                          </p>
                          <p className="text-sm text-gray-600 mb-4">
                            <strong>Submitted:</strong>{" "}
                            {app.createdAt
                              ? new Date(
                                  String(app.createdAt)
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>

                          {expandedId === app._id && (
                            <>
                              {!expandedData[app._id] ? (
                                <p>Loading full data...</p>
                              ) : !editingApp || editingApp._id !== app._id ? (
                                <>
                                  {formFields.map((field) => (
                                    <p key={field.field_name}>
                                      <strong>{field.label}:</strong>{" "}
                                      {renderFieldValue(
                                        expandedData[app._id]?.[
                                          field.field_name
                                        ] ??
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
                                          value={getSafeInputValue(
                                            editingApp?.data?.[field.field_name]
                                          )}
                                          onChange={(e) =>
                                            handleEditChange(
                                              field.field_name,
                                              e.target.value
                                            )
                                          }
                                          className="form-input"
                                        >
                                          <option value="" disabled>
                                            Select {field.label}
                                          </option>
                                          {field.options?.map((opt) => (
                                            <option key={opt} value={opt}>
                                              {opt}
                                            </option>
                                          ))}
                                        </select>
                                      ) : (
                                        <input
                                          type={field.type}
                                          value={getSafeInputValue(
                                            editingApp?.data?.[field.field_name]
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
                                      <Save className="inline mr-1" size={16} />{" "}
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
                      ))}
                    </div>
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
              {formStructureDraft.map((field, index) => (
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
                  />
                  <input
                    className="form-input mb-1"
                    placeholder="Label"
                    value={field.label}
                    onChange={(e) =>
                      handleFieldChange(index, "label", e.target.value)
                    }
                  />
                  <select
                    className="form-input mb-1"
                    value={field.type}
                    onChange={(e) =>
                      handleFieldChange(index, "type", e.target.value)
                    }
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="email">Email</option>
                    <option value="tel">Phone</option>
                    <option value="date">Date</option>
                    <option value="select">Select</option>
                  </select>
                  <label className="form-check">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) =>
                        handleFieldChange(index, "required", e.target.checked)
                      }
                    />{" "}
                    Required
                  </label>

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
                    />
                  )}

                  <div className="flex gap-2 mt-2">
                    <button
                      className="btn-secondary"
                      disabled={index === 0}
                      onClick={() => handleMoveField(index, -1)}
                    >
                      🔼 Move Up
                    </button>
                    <button
                      className="btn-secondary"
                      disabled={index === formStructureDraft.length - 1}
                      onClick={() => handleMoveField(index, 1)}
                    >
                      🔽 Move Down
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleRemoveField(index)}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              ))}

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
