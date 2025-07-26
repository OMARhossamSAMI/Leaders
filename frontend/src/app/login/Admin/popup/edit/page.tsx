"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import "../create/page.css";

interface Popup {
  title: string;
  category: string;
  message: string;
  status: "on" | "off";
  buttons?: string[];
  paths?: string[];
}

export default function EditPopupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const popupId = searchParams.get("id");

  const [customCategory, setCustomCategory] = useState("");
  const [buttons, setButtons] = useState<string[]>([]);
  const [paths, setPaths] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "",
    category: "",
    message: "",
    status: "off",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");

    if (!token) {
      router.push("/login");
    } else {
      setAuthenticated(true);
    }
  }, [router]);
  useEffect(() => {
    const fetchPopup = async () => {
      try {
        const res = await axios.get<Popup>(
          `${process.env.NEXT_PUBLIC_API_URL}/popup/${popupId}`
        );
        const { title, category, message, status, buttons, paths } = res.data;
        setForm({ title, category, message, status });
        setButtons(buttons || []);
        setPaths(paths || []);
      } catch {
        setError("Failed to fetch popup data.");
      }
    };

    fetchPopup();
  }, [popupId]);
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

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/popup/${popupId}`, {
        ...form,
        category: form.category || customCategory,
        buttons,
        paths,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/login/Admin/popup");
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
    }
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

  return (
    <div className="page-wrapper">
      <div className="form-container slide-in">
        <h1 className="form-title">Edit Popup</h1>

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
            required
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
            <div className="success-toast">Popup updated successfully!</div>
          )}
          <button type="submit" className="form-button">
            Update Popup
          </button>
        </form>
      </div>
    </div>
  );
}
