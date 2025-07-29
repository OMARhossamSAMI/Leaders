"use client";
export const dynamic = "force-dynamic";

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

export default function ApplyForm() {
  const [fields, setFields] = useState<EmploymentFormField[]>([]);
  const [positionFromURL, setPositionFromURL] = useState("");
  const [employmentTypeFromURL, setEmploymentTypeFromURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const [academicYearFromURL, setAcademicYearFromURL] = useState("");

  useEffect(() => {
    const job = searchParams.get("position");
    const type = searchParams.get("employmentType");
    const year = searchParams.get("academicYear");

    if (job) setPositionFromURL(decodeURIComponent(job));
    if (type) setEmploymentTypeFromURL(decodeURIComponent(type));
    if (year) setAcademicYearFromURL(decodeURIComponent(year));

    axios
      .get<EmploymentFormField[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/employment-form-fields`
      )
      .then((res) => setFields(res.data))
      .catch((err) => console.error("❌ Failed to fetch form fields:", err));
  }, [searchParams]);



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (academicYearFromURL) {
      formData.set("academic_year", academicYearFromURL);
    }

    if (positionFromURL && positionFromURL !== "Other") {
  formData.set("position", positionFromURL);

  // ✅ Set the employment_type if available from the previous card
  if (employmentTypeFromURL && employmentTypeFromURL !== "Other") {
    formData.set("employment_type", employmentTypeFromURL);
  } else {
    // If not provided, ensure it's removed to avoid stale data
    formData.delete("employment_type");
  }
}


    setIsLoading(true);
    try {
      form.querySelector(".loading")?.classList.add("d-block");
      form.querySelector(".error-message")?.classList.remove("d-block");
      form.querySelector(".sent-message")?.classList.remove("d-block");

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/vacancy`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      form.querySelector(".loading")?.classList.remove("d-block");
      form.querySelector(".sent-message")?.classList.add("d-block");
      form.reset();
    } catch (error: unknown) {
      console.error("Submission error:", error);
      form.querySelector(".loading")?.classList.remove("d-block");
      const errEl = form.querySelector(".error-message");
      if (errEl) {
        errEl.innerHTML = "Submission failed. Please try again.";
        errEl.classList.add("d-block");
      }
    } finally {
      setIsLoading(false);
    }
  };






  return (
    <>
      <div
        className="page-title dark-background"
        style={{
          backgroundImage: "url(/assets/img/education/Background_school.JPG)",
          marginTop: "90px",
        }}
      >
        <div className="container position-relative">
          <h1>Employment Application</h1>
          <p>
            Apply to join our vibrant community at Leaders International
            College.
          </p>
          <nav className="breadcrumbs">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/we-are-hiring">We Are Hiring</Link>
              </li>
              <li className="current">Apply</li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="main">
        <section className="container my-5">
          <div className="row align-items-start">
            <div className="col-lg-8 offset-lg-2">
              <div className="impact-content">
                <h3>Employment Application</h3>
                <p>
                  Please fill out the application form below and submit your CV.
                </p>

                <form
                  className="php-email-form mt-4"
                  onSubmit={handleSubmit}
                  encType="multipart/form-data"
                >
                  <div className="loading" style={{ display: "none" }}>
                    Loading
                  </div>
                  <div
                    className="error-message"
                    style={{ display: "none", color: "red" }}
                  ></div>
                  <div
                    className="sent-message"
                    style={{ display: "none", color: "green" }}
                  >
                    Your application has been sent. Thank you!
                  </div>

                  <div className="row">
                    {fields.map((field, index) => {
                      const label = field.label || field.field_name.replace(/_/g, " ");
                      const required = field.required ?? false;

                      // ✅ Skip "academic_year" if position is not "Other"
                      if (field.field_name === "academic_year" && positionFromURL !== "Other") {
                        return null;
                      }

                      // ✅ Handle "position" field: show only if "Other"
                      if (field.field_name === "position") {
                        if (positionFromURL === "Other") {
                          return (
                            <div className="col-md-6 mb-3" key={index}>
                              <label className="form-label">{label}</label>
                              <input
                                type="text"
                                name={field.field_name}
                                className="form-control"
                                placeholder="Enter your preferred position"
                                required={required}
                              />
                            </div>
                          );
                        } else {
                          return (
                            <input
                              key={index}
                              type="hidden"
                              name={field.field_name}
                              value={positionFromURL}
                            />
                          );
                        }
                      }

                      // ✅ Handle "employment_type" only if position is "Other"
                      if (field.field_name === "employment_type") {
                        if (positionFromURL === "Other" && field.options?.length) {
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
                        return null; // Hide otherwise
                      }

                      // ✅ Handle generic select
                      if (field.type === "select" && field.options?.length) {
                        return (
                          <div className="col-md-6 mb-3" key={index}>
                            <label className="form-label">{label}</label>
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

                      // ✅ Handle file uploads
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

                      // ✅ Handle date input
                      if (field.type === "date") {
                        return (
                          <div className="col-md-6 mb-3" key={index}>
                            <label className="form-label">{label}</label>
                            <input
                              type="date"
                              name={field.field_name}
                              className="form-control"
                              required={required}
                            />
                          </div>
                        );
                      }

                      // ✅ Fallback: text, email, number...
                      return (
                        <div className="col-md-6 mb-3" key={index}>
                          <label className="form-label">{label}</label>
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
                    <button
                      type="submit"
                      className="btn-register text-white d-flex align-items-center justify-content-center gap-2"
                      style={{
                        backgroundColor: "#00a6d9",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        opacity: isLoading ? 0.7 : 1,
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send size={18} /> Submit Application
                        </>
                      )}
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
