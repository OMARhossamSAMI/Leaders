"use client";

import './page.css'; // Import the CSS file for styling
import React from "react";

export default function ApplyPage() {
  return (
    <>
      {/* HEADER */}
      <header
        id="header"
        className="header d-flex align-items-center fixed-top"
      >
        <div className="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
          <a href="/" className="logo d-flex align-items-center">
            <img
              src="/assets/img/lic_logo.png"
              alt="School Logo"
              style={{ height: "40px", marginRight: "10px" }}
            />
            <h1 className="sitename">Leaders International College</h1>
          </a>
          <nav id="navmenu" className="navmenu">
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/admissions">Admissions</a>
              </li>
              <li>
                <a href="/curriculum">Curriculum</a>
              </li>
              <li>
                <a href="/students-life">Students Life</a>
              </li>
              <li>
                <a href="/we-are-hiring" className="active">
                  We Are Hiring
                </a>
              </li>
              <li>
                <a href="/contact">Contact Us</a>
              </li>
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>
        </div>
      </header>

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

      {/* FOOTER */}
      <footer id="footer" className="footer position-relative dark-background">
        <div className="container footer-top">
          <div className="row gy-4">
            <div className="col-lg-4 col-md-6 footer-about">
              <a href="/" className="logo d-flex align-items-center">
                <span className="sitename">Leaders International College</span>
              </a>
              <div className="footer-contact pt-3">
                <p>off 90th road</p>
                <p>fifth settlement</p>
                <p className="mt-3">
                  <strong>Phone:</strong> <span>012 7292 4777 </span>
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  <span>admission@leadersintcollege.com</span>
                </p>
              </div>
              <div className="social-links d-flex mt-4">
                <a href="#">
                  <i className="bi bi-twitter-x" />
                </a>
                <a href="#">
                  <i className="bi bi-facebook" />
                </a>
                <a href="#">
                  <i className="bi bi-instagram" />
                </a>
                <a href="#">
                  <i className="bi bi-linkedin" />
                </a>
              </div>
            </div>
            <div className="col-lg-2 col-md-3 footer-links">
              <h4>Useful Links</h4>
              <ul>
                <li>
                  <a href="/">Home</a>
                </li>
                <li>
                  <a href="/about">About us</a>
                </li>
                <li>
                  <a href="/our-staff">Our Staff</a>
                </li>
                <li>
                  <a href="/campus-facilities">Campus and Facilities</a>
                </li>
                <li>
                  <a href="#">Privacy policy</a>
                </li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-3 footer-links">
              <h4>Our Services</h4>
              <ul>
                <li>
                  <a href="#">Web Design</a>
                </li>
                <li>
                  <a href="#">Web Development</a>
                </li>
                <li>
                  <a href="#">Product Management</a>
                </li>
                <li>
                  <a href="#">Marketing</a>
                </li>
                <li>
                  <a href="#">Graphic Design</a>
                </li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-3 footer-links">
              <h4>Hic solutasetp</h4>
              <ul>
                <li>
                  <a href="#">Molestiae accusamus iure</a>
                </li>
                <li>
                  <a href="#">Excepturi dignissimos</a>
                </li>
                <li>
                  <a href="#">Suscipit distinctio</a>
                </li>
                <li>
                  <a href="#">Dilecta</a>
                </li>
                <li>
                  <a href="#">Sit quas consectetur</a>
                </li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-3 footer-links">
              <h4>Nobis illum</h4>
              <ul>
                <li>
                  <a href="#">Ipsam</a>
                </li>
                <li>
                  <a href="#">Laudantium dolorum</a>
                </li>
                <li>
                  <a href="#">Dinera</a>
                </li>
                <li>
                  <a href="#">Trodelas</a>
                </li>
                <li>
                  <a href="#">Flexo</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container copyright text-center mt-4">
          <p>
            © <span>Copyright</span>{" "}
            <strong className="px-1 sitename">MyWebsite</strong>{" "}
            <span>All Rights Reserved</span>
          </p>
          <div className="credits">
            Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
          </div>
        </div>
      </footer>
    </>
  );

}

