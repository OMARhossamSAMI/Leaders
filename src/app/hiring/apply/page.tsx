"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import "./page.css";
import { Send } from "lucide-react";

interface EmploymentFormField {
  _id: string;
  field_name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export default function ApplyPage() {
  const [fields, setFields] = useState<EmploymentFormField[]>([]);
  const [positionFromURL, setPositionFromURL] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const job = searchParams.get("position");
    if (job) setPositionFromURL(decodeURIComponent(job));

    axios
      .get<EmploymentFormField[]>("http://localhost:3000/employment-form-fields")
      .then((res) => setFields(res.data))
      .catch((err) => console.error("Failed to fetch fields", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const form = e.currentTarget;

  const formData = new FormData(form);
  const payload: Record<string, any> = {};

  for (const [key, value] of formData.entries()) {
    if (key.endsWith("[]")) {
      const baseKey = key.slice(0, -2);
      if (!payload[baseKey]) payload[baseKey] = [];
      payload[baseKey].push(value);
    } else {
      if (payload[key]) {
        // Handle multiple inputs with same name (e.g. radio fallbacks)
        if (!Array.isArray(payload[key])) payload[key] = [payload[key]];
        payload[key].push(value);
      } else {
        payload[key] = value;
      }
    }
  }

  // Ensure the `position` from URL is included (in case it's not captured)
  if (positionFromURL) {
    payload["position"] = positionFromURL;
  }

  try {
    form.querySelector(".loading")?.classList.add("d-block");
    form.querySelector(".error-message")?.classList.remove("d-block");
    form.querySelector(".sent-message")?.classList.remove("d-block");

    await axios.post("http://localhost:3000/vacancy", payload);

    form.querySelector(".loading")?.classList.remove("d-block");
    form.querySelector(".sent-message")?.classList.add("d-block");
    form.reset();
  } catch (error: any) {
    console.error("Submission error:", error);
    form.querySelector(".loading")?.classList.remove("d-block");
    const errEl = form.querySelector(".error-message");
    if (errEl) {
      errEl.innerHTML = "Submission failed. Please try again.";
      errEl.classList.add("d-block");
    }
  }
};

  return (
    <>
      {/* PAGE TITLE SECTION */}
      <div
        className="page-title dark-background"
        style={{
          backgroundImage: "url(/assets/img/education/Background_school.JPG)",
          marginTop: "90px",
        }}
      >
        <div className="container position-relative">
          <h1>Employment Application</h1>
          <p>Apply to join our vibrant community at Leaders International College.</p>
          <nav className="breadcrumbs">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/we-are-hiring">We Are Hiring</Link></li>
              <li className="current">Apply</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* FORM SECTION */}
      <main className="main">
        <section className="container my-5">
          <div className="row align-items-start">
            <div className="col-lg-8 offset-lg-2">
              <div className="impact-content">
                <h3>Employment Application</h3>
                <p>
                  Interested in becoming a part of our community? Please fill out the application form below and submit your CV.
                </p>

                <form className="php-email-form mt-4" onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="loading" style={{ display: "none" }}>Loading</div>
                  <div className="error-message" style={{ display: "none", color: "red" }}></div>
                  <div className="sent-message" style={{ display: "none", color: "green" }}>
                    Your application has been sent. Thank you!
                  </div>

                  <div className="row">
                    {fields.map((field, index) => {
                      const label = field.label || field.field_name.replace(/_/g, " ");
                      const required = field.required ?? false;

                      if (field.field_name === "position") {
                        return (
                          <div className="col-md-6 mb-3" key={index}>
                            <label className="form-label">{label}</label>
                            <input
                              type="text"
                              name={field.field_name}
                              className="form-control"
                              value={positionFromURL}
                              readOnly
                              required={required}
                            />
                          </div>
                        );
                      }

                      if (field.type === "radio" && field.options?.length) {
                        return (
                          <div className="col-md-6 mb-3" key={index}>
                            <label className="form-label d-block">{label}</label>
                            {field.options.map((opt, i) => (
                              <div className="form-check form-check-inline" key={i}>
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name={field.field_name}
                                  value={opt}
                                  required={required}
                                />
                                <label className="form-check-label">{opt}</label>
                              </div>
                            ))}
                          </div>
                        );
                      }

                      if (field.type === "checkbox" && field.options?.length) {
                        return (
                          <div className="col-md-6 mb-3" key={index}>
                            <label className="form-label d-block">{label}</label>
                            {field.options.map((opt, i) => (
                              <div className="form-check form-check-inline" key={i}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name={`${field.field_name}[]`}
                                  value={opt}
                                />
                                <label className="form-check-label">{opt}</label>
                              </div>
                            ))}
                          </div>
                        );
                      }

                      if (field.type === "select" && field.options?.length) {
                        return (
                          <div className="col-md-6 mb-3" key={index}>
                            <select
                              name={field.field_name}
                              className="form-select"
                              required={required}
                              defaultValue=""
                            >
                              <option value="" disabled>{label}</option>
                              {field.options.map((opt, i) => (
                                <option key={i} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                        );
                      }

                      if (field.type === "date") {
                        return (
                          <div className="col-md-6 mb-3" key={index}>
                            <input
                              type="date"
                              name={field.field_name}
                              className="form-control"
                              placeholder={label}
                              required={required}
                            />
                          </div>
                        );
                      }

                      if (field.type === "file") {
                        return (
                          <div className="col-md-12 mb-3" key={index}>
                            <label className="form-label">{label}</label>
                            <input
                              type="file"
                              name={field.field_name}
                              className="form-control"
                              multiple={field.field_name.includes("certificates")}
                              required={required}
                            />
                          </div>
                        );
                      }

                      return (
                        <div className="col-md-6 mb-3" key={index}>
                          <input
                            type={field.type}
                            name={field.field_name}
                            className="form-control"
                            placeholder={field.placeholder || label}
                            required={required}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="event-action mt-4 text-center">
  <button type="submit" className="btn-register text-white d-flex align-items-center justify-content-center gap-2" style={{ backgroundColor: "#00a6d9", border: "none", padding: "10px 20px", borderRadius: "5px" }}>
    <Send size={18} /> Submit Application
  </button>
</div>
                  <p className="mt-4 text-muted">
                    Thanks for your interest in Leaders International College!
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
