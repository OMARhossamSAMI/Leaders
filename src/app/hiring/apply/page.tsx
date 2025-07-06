"use client";

import React from "react";

export default function ApplyPage() {
  return (
    <main className="container my-5">
      <div className="row align-items-center">
        <div className="col-lg-7">
          <div className="impact-content">
            <h3>Employment Application</h3>
            <p>
              Interested in becoming a part of our vibrant community at Leaders
              International College? We are always eager to connect with
              talented individuals who are passionate about education and
              innovation. Please fill out the application form below and submit
              your CV. We look forward to exploring potential opportunities with
              you and possibly welcoming you to our team.
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
                  placeholder="Current Address (Include number, street, building)"
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
                  <option value="Colleagues Working at the school">
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
                    defaultValue="Full Time"
                  />
                  <label className="form-check-label">Full Time</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="employment_type[]"
                    defaultValue="Part Time"
                  />
                  <label className="form-check-label">Part Time</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="employment_type[]"
                    defaultValue="Internship"
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
                professors who have first-hand knowledge of your professional
                competence and personal qualifications.
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
    </main>
  );
}
