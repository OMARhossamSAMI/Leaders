"use client";
import { useEffect, useState } from "react";
import { Trash2, ArrowUp, ArrowDown, Save, Plus, X } from "lucide-react";
import axios from "axios";
import "./page.css";
import { useRouter } from "next/navigation";

interface Field {
  field_name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[]; // For select and checkbox types
}
interface FieldResponse {
  fields: Field[];
}

export default function EditFormStructure() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");

    if (!token) {
      router.push("/lic-auth-v9v3tz");
    } else {
      setAuthenticated(true);
    }
  }, [router]);
  useEffect(() => {
    axios
      .get<Field[] | FieldResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/employment-form-fields`
      )
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray((res.data as FieldResponse).fields)
          ? (res.data as FieldResponse).fields
          : [];

        setFields(data);
      })
      .catch((err) => {
        console.error("Error loading fields:", err);
        setFields([]);
      })
      .then(() => setLoading(false));
  }, []);
  if (!authenticated) return null; // prevent flashing
  const handleFieldChange = <K extends keyof Field>(
    index: number,
    key: K,
    value: Field[K]
  ) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
  };

  const handleOptionChange = (
    fieldIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updated = [...fields];
    updated[fieldIndex].options![optionIndex] = value;
    setFields(updated);
  };

  const addOption = (fieldIndex: number) => {
    const updated = [...fields];
    if (!updated[fieldIndex].options) updated[fieldIndex].options = [];
    updated[fieldIndex].options!.push("");
    setFields(updated);
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const updated = [...fields];
    updated[fieldIndex].options!.splice(optionIndex, 1);
    setFields(updated);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...fields];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setFields(updated);
  };

  const moveDown = (index: number) => {
    if (index === fields.length - 1) return;
    const updated = [...fields];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setFields(updated);
  };

  const removeField = (index: number) => {
    const updated = fields.filter((_, i) => i !== index);
    setFields(updated);
  };

  const addNewField = () => {
    const existingNames = new Set(fields.map((f) => f.field_name));
    let counter = 1;
    let newName = `field_${counter}`;
    while (existingNames.has(newName)) {
      counter++;
      newName = `field_${counter}`;
    }

    setFields([
      ...fields,
      {
        field_name: newName,
        label: "",
        type: "text",
        required: false,
      },
    ]);
  };

  const saveChanges = () => {
    axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/employment-form-fields`, {
        fields,
      })
      .then(() => alert("Changes saved successfully!"))
      .catch((err) => alert("Failed to save changes: " + err.message));
  };

  if (loading)
    return (
      <div className="container my-5">
        <h4>Loading form structure...</h4>
      </div>
    );

  return (
    <div className="container my-5">
      <h3 className="mb-4">Edit Form Structure</h3>

      <div className="text-end mb-3">
        <button
          className="btn btn-outline-success btn-sm"
          onClick={addNewField}
        >
          <Plus size={16} className="me-1" /> Add New Field
        </button>
      </div>

      {fields.map((field, index) => (
        <div key={index} className="mb-4 p-3 border rounded bg-white shadow-sm">
          <input
            className="form-control mb-2"
            value={field.field_name}
            onChange={(e) =>
              handleFieldChange(index, "field_name", e.target.value)
            }
            placeholder="Field Name"
          />
          <input
            className="form-control mb-2"
            value={field.label}
            onChange={(e) => handleFieldChange(index, "label", e.target.value)}
            placeholder="Label"
          />
          <select
            className="form-select mb-2"
            value={field.type}
            onChange={(e) => handleFieldChange(index, "type", e.target.value)}
          >
            <option value="text">Text</option>
            <option value="date">Date</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="checkbox">Checkbox Group</option>
            <option value="select">Multiple Select</option>
            <option value="file">File Upload</option>
          </select>

          {(field.type === "checkbox" || field.type === "select") && (
            <div className="mb-3">
              <label className="form-label">
                {field.type === "checkbox"
                  ? "Checkbox Options:"
                  : "Select Options:"}
              </label>
              {field.options?.map((option, i) => (
                <div key={i} className="d-flex mb-1">
                  <input
                    className="form-control me-2"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(index, i, e.target.value)
                    }
                    placeholder={`Option ${i + 1}`}
                  />
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeOption(index, i)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                className="btn btn-outline-secondary btn-sm mt-2"
                onClick={() => addOption(index)}
              >
                <Plus size={14} className="me-1" /> Add Option
              </button>
            </div>
          )}

          <div className="mb-2">
            <label>
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={field.required}
                onChange={(e) =>
                  handleFieldChange(index, "required", e.target.checked)
                }
              />
              Required
            </label>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => moveUp(index)}
              disabled={index === 0}
            >
              <ArrowUp size={16} /> Move Up
            </button>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => moveDown(index)}
              disabled={index === fields.length - 1}
            >
              <ArrowDown size={16} /> Move Down
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => removeField(index)}
            >
              <Trash2 size={16} /> Remove
            </button>
          </div>
        </div>
      ))}

      <div className="text-center">
        <button
          className="btn btn-success px-4 py-2 mt-3"
          onClick={saveChanges}
        >
          <Save size={18} className="me-2" /> Save Changes
        </button>
      </div>
    </div>
  );
}
