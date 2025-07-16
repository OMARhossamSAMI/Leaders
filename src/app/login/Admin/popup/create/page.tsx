"use client";
import React, { useState } from "react";
import "./page.css";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CreatePopupPage() {
  const router = useRouter();
  const [customCategory, setCustomCategory] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: "",
    message: "",
    status: "off",
  });
  const [buttons, setButtons] = useState<string[]>([]);
  const [paths, setPaths] = useState<string[]>([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      await axios.post("http://localhost:3000/popup", {
        ...form,
        category: form.category || customCategory,
        buttons,
        paths, // ✅ This was missing
      });
      setSuccess(true);

      setTimeout(() => {
        router.push("/login/Admin/popup");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  const addButtonField = () => {
    if (buttons.length < 3) {
      setButtons([...buttons, ""]);
      setPaths([...paths, ""]);
    }
  };

  const removeButton = (index: number) => {
    setButtons(buttons.filter((_, i) => i !== index));
    setPaths(paths.filter((_, i) => i !== index));
  };

  const handleButtonChange = (index: number, value: string) => {
    const updated = [...buttons];
    updated[index] = value;
    setButtons(updated);
  };

  const handlePathChange = (index: number, value: string) => {
    const updated = [...paths];
    updated[index] = value;
    setPaths(updated);
  };

  return (
    <div className="page-wrapper">
      <div className="form-container slide-in">
        <h1 className="form-title">Create New Popup</h1>

        <form className="popup-form" onSubmit={handleSubmit}>
          <input
            className="form-input"
            type="text"
            name="title"
            placeholder="Popup Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <select
            className="form-select"
            name="category"
            value={form.category || "other"}
            onChange={(e) => {
              const val = e.target.value;
              setForm({ ...form, category: val === "other" ? "" : val });
              if (val !== "other") setCustomCategory("");
            }}
            required={form.category !== ""}
          >
            <option value="">-- Select Category --</option>
            <option value="admission">Admission</option>
            <option value="event">Event</option>
            <option value="announcement">Announcement</option>
            <option value="discount">Discount</option>
            <option value="deadline">Deadline</option>
            <option value="other">Other</option>
          </select>

          {form.category === "" && (
            <input
              className="form-input"
              type="text"
              name="customCategory"
              placeholder="Enter custom category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              required
            />
          )}

          <textarea
            className="form-textarea"
            name="message"
            placeholder="Popup Message"
            value={form.message}
            onChange={handleChange}
            required
          ></textarea>

          <div className="buttons-section">
            <label className="section-label">Custom Buttons</label>
            {buttons.map((btn, index) => (
              <div key={index} className="button-field">
                <input
                  className="form-input"
                  type="text"
                  placeholder={`Button ${index + 1}`}
                  value={btn}
                  onChange={(e) => handleButtonChange(index, e.target.value)}
                />
                <input
                  className="form-input"
                  type="text"
                  placeholder={`Path for Button ${index + 1}`}
                  value={paths[index]}
                  onChange={(e) => handlePathChange(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeButton(index)}
                  className="remove-btn"
                >
                  ×
                </button>
              </div>
            ))}

            {buttons.length < 3 && (
              <button
                type="button"
                onClick={addButtonField}
                className="add-btn"
              >
                + Add Button
              </button>
            )}
          </div>
          {error && <div className="error-box">{error}</div>}
          {success && (
            <div className="success-toast">Popup created successfully!</div>
          )}
          <button type="submit" className="form-button">
            Create Popup
          </button>
        </form>
      </div>
    </div>
  );
}
