"use client";

import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import "./page.css";
import { Send } from "lucide-react";
import StatusPopup, {
  type StatusPopupState,
} from "../../components/StatusPopup";
import { extractErrorMessage } from "../../../utils/errors";

export default function InternshipApplyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [statusPopup, setStatusPopup] = useState<StatusPopupState | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setIsLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/internship`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setStatusPopup({
        kind: "success",
        title: "Application Received",
        message: "Your application has been sent. Thank you!",
      });
      form.reset();
    } catch (error: unknown) {
      console.error("Submission error:", error);
      setStatusPopup({
        kind: "error",
        title: "Submission Failed",
        message: extractErrorMessage(error, "Submission failed. Please try again."),
      });
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
          <h1>Internship Application</h1>
          <p>
            Apply for an internship opportunity at Leaders International
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
              <li className="current">Internship Apply</li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="main">
        <section className="container my-5">
          <div className="row align-items-start">
            <div className="col-lg-8 offset-lg-2">
              <div className="impact-content">
                <h3>Internship Application</h3>
                <p>
                  Please fill out the internship form below and submit your CV.
                </p>

                <form
                  className="php-email-form mt-4"
                  onSubmit={handleSubmit}
                  encType="multipart/form-data"
                >
                  <div className="row">
                    {/* Full Name */}
                    <div className="col-md-6 mb-3">
                      <input
                        type="text"
                        name="full_name"
                        className="form-control"
                        placeholder="Full Name"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="col-md-6 mb-3">
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Email"
                        required
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="col-md-6 mb-3">
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        placeholder="Phone Number"
                        required
                      />
                    </div>

                    {/* University */}
                    <div className="col-md-6 mb-3">
                      <input
                        type="text"
                        name="university"
                        className="form-control"
                        placeholder="University Name"
                        required
                      />
                    </div>

                    {/* Degree */}
                    <div className="col-md-6 mb-3">
                      <input
                        type="text"
                        name="degree"
                        className="form-control"
                        placeholder="Degree / Program"
                        required
                      />
                    </div>

                    {/* Year of Study */}
                    <div className="col-md-6 mb-3">
                      <input
                        type="number"
                        name="year_of_study"
                        className="form-control"
                        placeholder="Year of Study"
                        required
                      />
                    </div>

                    {/* Start Date */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Preferred Start Date</label>
                      <input
                        type="date"
                        name="start_date"
                        className="form-control"
                        required
                      />
                    </div>

                    {/* Duration */}
                    <div className="col-md-6 mb-3">
                      <input
                        type="text"
                        name="duration"
                        className="form-control"
                        placeholder="Preferred Duration (e.g. 3 months)"
                        required
                      />
                    </div>

                    {/* Desired Position */}
                    <div className="col-md-12 mb-3">
                      <input
                        type="text"
                        name="desired_position"
                        className="form-control"
                        placeholder="Desired Position (e.g. Marketing Intern)"
                        required
                      />
                    </div>

                    {/* CV Upload */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Upload CV</label>
                      <input
                        type="file"
                        name="cv_file"
                        className="form-control"
                        required
                      />
                    </div>

                    {/* Cover Letter Upload */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label">
                        Upload Cover Letter (optional)
                      </label>
                      <input
                        type="file"
                        name="cover_letter"
                        className="form-control"
                      />
                    </div>

                    {/* Motivation */}
                    <div className="col-md-12 mb-3">
                      <textarea
                        name="motivation"
                        className="form-control"
                        placeholder="Why are you interested in this internship?"
                        rows={5}
                        required
                      ></textarea>
                    </div>
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
                    Thanks for your interest in an internship at Leaders
                    International College!
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <StatusPopup
        open={!!statusPopup}
        kind={statusPopup?.kind ?? "error"}
        title={statusPopup?.title ?? ""}
        message={statusPopup?.message ?? ""}
        onClose={() => setStatusPopup(null)}
        autoDismissMs={statusPopup?.kind === "success" ? 3500 : undefined}
      />
    </>
  );
}
