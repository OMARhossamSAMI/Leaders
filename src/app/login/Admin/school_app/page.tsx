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

interface Application {
  _id: string;
  [key: string]: any;
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
  const [expandedData, setExpandedData] = useState<Record<string, Application>>({});
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [formFields, setFormFields] = useState<FormField[]>([]);

  // Form structure editing
  const [editingFormStructure, setEditingFormStructure] = useState(false);
  const [formStructureDraft, setFormStructureDraft] = useState<FormField[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/form-fields")
      .then((res) => res.json())
      .then((data) => setFormFields(data))
      .catch((err) => console.error("Failed to fetch form fields", err));

    fetch("http://localhost:3000/applications")
      .then((res) => res.json())
      .then((data) => setApplications(data))
      .catch((err) => console.error("Failed to fetch applications", err));
  }, []);

  const handleExpand = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }

    if (!expandedData[id]) {
      try {
        const res = await fetch(`http://localhost:3000/applications/${id}`);
        const data = await res.json();
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

  const handleEditChange = (key: string, value: any) => {
    if (editingApp) {
      setEditingApp({ ...editingApp, [key]: value });
    }
  };

  const handleUpdate = async () => {
    if (!editingApp) return;

    const today = new Date().toISOString().split("T")[0];
    if (editingApp.student_birthdate && editingApp.student_birthdate > today) {
      alert("Date of birth cannot be in the future.");
      return;
    }

    const response = await fetch(
      `http://localhost:3000/applications/${editingApp._id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingApp),
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

  // ==== Admin Form Structure Editing ====
  const handleFormStructureEdit = () => {
    setFormStructureDraft([...formFields]);
    setEditingFormStructure(true);
  };

  const handleFieldChange = (index: number, key: keyof FormField, value: any) => {
    const updated = [...formStructureDraft];
    if (key === "options" && updated[index].type === "select") {
      updated[index].options = value as string[];
    } else if (key !== "options") {
      (updated[index] as any)[key] = value;
    }
    setFormStructureDraft(updated);
  };

  const handleAddField = () => {
    setFormStructureDraft([
      ...formStructureDraft,
      {
        field_name: "",
        label: "",
        type: "text",
        required: false,
        options: [],
      },
    ]);
  };

  const handleRemoveField = (index: number) => {
    const updated = [...formStructureDraft];
    updated.splice(index, 1);
    setFormStructureDraft(updated);
  };

  const saveFormStructure = async () => {
    await fetch("http://localhost:3000/form-fields", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formStructureDraft),
    });
    setFormFields(formStructureDraft);
    setEditingFormStructure(false);
  };
  const handleSaveForm = async () => {
  console.log("Saving form..."); // Confirm click works
  try {
    const response = await fetch("http://localhost:3000/form-fields", {
      method: "PUT", // ✅ overwrite full structure
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formStructureDraft), // ✅ this is your form!
    });

    const result = await response.json();
    console.log("Saved:", result);
    alert("Form structure saved successfully!");

    setFormFields(formStructureDraft);
    setEditingFormStructure(false);
  } catch (error) {
    console.error("Failed to save form field:", error);
    alert("Failed to save form structure");
  }
};



  return (
    <div style={{ backgroundColor: "#f5f9f9", minHeight: "100vh", padding: "2rem" }}>
      <h2 className="text-2xl font-semibold mb-4">Submitted Applications</h2>

      <button onClick={handleFormStructureEdit} className="btn-primary mb-6">
        ✏️ Edit Form Structure
      </button>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
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
              <h3 className="text-lg font-semibold">{app.student_name}</h3>
              <div className="flex gap-2">
                <button onClick={() => handleExpand(app._id)} className="icon-button">
                  {expandedId === app._id ? <EyeOff /> : <Eye />}
                </button>
                <button onClick={() => handleDelete(app._id)} className="icon-button text-red-600">
                  <Trash2 />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-2">
              <strong>Grade:</strong> {app.grade_applying_for}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Submitted:</strong>{" "}
              {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A"}
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
                        {expandedData[app._id]?.[field.field_name] !== undefined &&
                        expandedData[app._id]?.[field.field_name] !== ""
                          ? expandedData[app._id]?.[field.field_name]?.toString()
                          : <em>Not provided</em>}
                      </p>
                    ))}
                    <button
                      onClick={() => setEditingApp(expandedData[app._id])}
                      className="btn-secondary mt-3"
                    >
                      <PencilLine className="inline mr-1" size={18} /> Edit
                    </button>
                  </>
                ) : (
                  <div className="mt-4 space-y-3">
                    {formFields.map((field) => (
                      <div key={field.field_name}>
                        {field.type === "select" ? (
                          <select
                            value={editingApp[field.field_name] || ""}
                            onChange={(e) => handleEditChange(field.field_name, e.target.value)}
                            className="form-input"
                          >
                            <option value="" disabled>Select {field.label}</option>
                            {field.options?.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            value={editingApp[field.field_name] || ""}
                            onChange={(e) => handleEditChange(field.field_name, e.target.value)}
                            className="form-input"
                            placeholder={field.label}
                            max={field.type === "date" ? new Date().toISOString().split("T")[0] : undefined}
                          />
                        )}
                      </div>
                    ))}
                    <div className="flex gap-2 mt-3">
                      <button onClick={handleUpdate} className="btn-success">
                        <Save className="inline mr-1" size={16} /> Save
                      </button>
                      <button onClick={() => setEditingApp(null)} className="btn-danger">
                        <XCircle className="inline mr-1" size={16} /> Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {editingFormStructure && (
        <div style={{ background: "#fff", padding: "2rem", marginTop: "2rem", borderRadius: "10px" }}>
          <h3>Edit Form Structure</h3>
          {formStructureDraft.map((field, index) => (
            <div key={index} style={{ marginBottom: "1rem", borderBottom: "1px solid #ddd", paddingBottom: "1rem" }}>
              <input
                className="form-input mb-1"
                placeholder="Field Name"
                value={field.field_name}
                onChange={(e) => handleFieldChange(index, "field_name", e.target.value)}
              />
              <input
                className="form-input mb-1"
                placeholder="Label"
                value={field.label}
                onChange={(e) => handleFieldChange(index, "label", e.target.value)}
              />
              <select
                className="form-input mb-1"
                value={field.type}
                onChange={(e) => handleFieldChange(index, "type", e.target.value)}
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
                  onChange={(e) => handleFieldChange(index, "required", e.target.checked)}
                />{" "}
                Required
              </label>
              {field.type === "select" && (
                <input
                  className="form-input mt-1"
                  placeholder="Comma-separated options"
                  value={field.options?.join(",") || ""}
                  onChange={(e) =>
                    handleFieldChange(index, "options", e.target.value.split(",").map((opt) => opt.trim()))
                  }
                />
              )}
              <button className="btn-danger mt-2" onClick={() => handleRemoveField(index)}>🗑️ Remove</button>
            </div>
          ))}
          <button onClick={handleAddField} className="btn-secondary mt-2">➕ Add Field</button>
          <div className="mt-4 flex gap-3">
            <button onClick={handleSaveForm} className="btn-success">💾 Save Form</button>
            <button onClick={() => setEditingFormStructure(false)} className="btn-danger">❌ Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
