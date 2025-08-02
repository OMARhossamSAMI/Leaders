"use client";
import React, { useState, useEffect } from "react";
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
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");

    if (!token) {
      router.push("/lic-auth-v9v3tz");
    } else {
      setAuthenticated(true);
    }
  }, [router]);

  if (!authenticated) return null; // prevent flashing

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true); // 👈 show loading state
    if (!image) {
      setError("Image is required.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("title", form.title);
      formData.append("category", form.category || customCategory);
      formData.append("message", form.message);
      formData.append("status", form.status);
      buttons.forEach((btn, index) => {
        formData.append(`buttons[${index}]`, btn);
      });
      paths.forEach((path, index) => {
        formData.append(`paths[${index}]`, path);
      });

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/popup`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/lic-auth-v9v3tz/Admin/popup");
      }, 2000);
    } catch (err: unknown) {
      let message = "Something went wrong.";
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as Record<string, unknown>).response === "object"
      ) {
        const response = (
          err as {
            response?: { data?: { message?: unknown } };
          }
        ).response;
        const rawMessage = response?.data?.message;
        if (typeof rawMessage === "string") {
          message = rawMessage;
        } else if (Array.isArray(rawMessage)) {
          message = rawMessage.join(" \n ");
        }
      }
      setError(message);
    } finally {
      setLoading(false); // ✅ reset loading after success or error
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

        <form
          className="popup-form"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="image-upload-wrapper">
            <label htmlFor="popup-image" className="image-upload-label">
              {preview ? (
                <img src={preview} alt="Preview" className="image-preview" />
              ) : (
                <div className="image-placeholder">
                  📷 Click to upload popup image
                </div>
              )}
            </label>
            <input
              id="popup-image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImage(file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
              required
              className="hidden-input"
            />
          </div>

          <input
            className="form-input"
            type="text"
            name="title"
            placeholder="Popup Title"
            value={form.title}
            onChange={handleChange}
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
            />
          )}

          <textarea
            className="form-textarea"
            name="message"
            placeholder="Popup Message"
            value={form.message}
            onChange={handleChange}
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

          <button
            type="submit"
            className="form-button"
            disabled={loading}
            style={{
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating..." : "Create Popup"}
          </button>
        </form>
      </div>
    </div>
  );
}
