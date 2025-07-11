"use client";

import "./page.css"; // Import the CSS file for styling
import React from "react";

export default function ApplyPage() {
  return (
    <>
      {/* PAGE TITLE SECTION */}
      <div
        className="page-title dark-background"
        style={{
          backgroundImage: "url(/assets/img/education/Background_school.JPG)",
          marginTop: "90px", // offset for fixed header
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
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/we-are-hiring">We Are Hiring</a>
              </li>
              <li className="current">Apply</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* MAIN FORM CONTENT */}
      <main className="main">
        <section className="container my-5">
          <div className="row align-items-start">
            <div className="col-lg-8 offset-lg-2">
              <div className="impact-content">
                <h3>Employment Application</h3>
                <p>
                  Interested in becoming a part of our community? Please fill
                  out the application form below and submit your CV.
                </p>

                <form
                  className="php-email-form mt-4"
                  method="post"
                  encType="multipart/form-data"
                >
                  <h5>PERSONAL INFORMATION</h5>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="full_name"
                      className="form-control"
                      placeholder="Full Name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="nationality"
                      className="form-control"
                      placeholder="Nationality"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="tel"
                      name="contact_number"
                      className="form-control"
                      placeholder="Contact Number"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="tel"
                      name="alt_contact_number"
                      className="form-control"
                      placeholder="Alternate Contact Number"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Email Address"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="current_address"
                      className="form-control"
                      placeholder="Current Address"
                      required
                    />
                  </div>

                  <h5 className="mt-4">How Did You Learn About Us?</h5>
                  <div className="mb-3">
                    <select name="source_info" className="form-select" required>
                      <option value="" disabled selected>
                        Select an option
                      </option>
                      <option value="Website">Website</option>
                      <option value="Social Media Platforms">
                        Social Media Platforms
                      </option>
                      <option value="Family/Friends">Family/Friends</option>
                      <option value="Colleagues">
                        Colleagues Working at the School
                      </option>
                      <option value="Community Outreach">
                        Community Outreach
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <h5 className="mt-4">Position Applying For</h5>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="position"
                      className="form-control"
                      placeholder="Desired Position"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Employment Type:</label>
                    <br />
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="employment_type[]"
                        value="Full Time"
                      />
                      <label className="form-check-label">Full Time</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="employment_type[]"
                        value="Part Time"
                      />
                      <label className="form-check-label">Part Time</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="employment_type[]"
                        value="Internship"
                      />
                      <label className="form-check-label">Internship</label>
                    </div>
                  </div>

                  <h5 className="mt-4">Educational Background</h5>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="high_school"
                      className="form-control"
                      placeholder="High School"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="university"
                      className="form-control"
                      placeholder="University"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="college"
                      className="form-control"
                      placeholder="College"
                    />
                  </div>

                  <h5 className="mt-4">Additional Studies</h5>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="diploma"
                      className="form-control"
                      placeholder="Diploma"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="masters"
                      className="form-control"
                      placeholder="Master's Degree"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="ib_certificate"
                      className="form-control"
                      placeholder="IB Certificate"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Upload Certificates</label>
                    <input
                      type="file"
                      name="certificates[]"
                      className="form-control"
                      multiple
                    />
                  </div>

                  <h5 className="mt-4">Work Experience</h5>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="prev_employer"
                      className="form-control"
                      placeholder="Previous Employer"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="prev_position"
                      className="form-control"
                      placeholder="Previous Position"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="prev_salary"
                      className="form-control"
                      placeholder="Previous Salary"
                    />
                  </div>

                  <h5 className="mt-4">References</h5>
                  <p className="text-muted">
                    References should include superintendents, principals, or
                    professors with knowledge of your competence.
                  </p>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="ref1_name"
                        className="form-control"
                        placeholder="Reference 1 - Name"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="ref2_name"
                        className="form-control"
                        placeholder="Reference 2 - Name"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="ref1_position"
                        className="form-control"
                        placeholder="Position"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="ref2_position"
                        className="form-control"
                        placeholder="Position"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="ref1_contact"
                        className="form-control"
                        placeholder="Contact"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="ref2_contact"
                        className="form-control"
                        placeholder="Contact"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="email"
                        name="ref1_email"
                        className="form-control"
                        placeholder="Email"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="email"
                        name="ref2_email"
                        className="form-control"
                        placeholder="Email"
                      />
                    </div>
                  </div>

                  <div className="mb-4 mt-4">
                    <label className="form-label">Upload Your CV</label>
                    <input
                      type="file"
                      name="cv_file"
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="loading">Loading</div>
                  <div className="error-message"></div>
                  <div className="sent-message">
                    Your application has been submitted. Thank you!
                  </div>

                  <div className="event-action">
                    <button type="submit" className="btn-register">
                      Submit Application
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
