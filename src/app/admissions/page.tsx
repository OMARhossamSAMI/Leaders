"use client";

import { useEffect, useState } from "react";

export default function AdmissionsPage() {
  const [activeSection, setActiveSection] = useState("apply");

  useEffect(() => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      const timer = setTimeout(() => {
        preloader.style.display = "none";
      }, 15);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <div>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>Admissions - LeadersIntCollege</title>
        <meta name="description" content="" />
        <meta name="keywords" content="" />
        {/* Favicons */}
        <link href="assets/img/lic_logo.png" rel="icon" />
        <link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon" />
        {/* Fonts */}
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          href="https://fonts.gstatic.com"
          rel="preconnect"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        {/* Vendor CSS Files */}
        <link
          href="assets/vendor/bootstrap/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          href="assets/vendor/bootstrap-icons/bootstrap-icons.css"
          rel="stylesheet"
        />
        <link href="assets/vendor/aos/aos.css" rel="stylesheet" />
        <link
          href="assets/vendor/swiper/swiper-bundle.min.css"
          rel="stylesheet"
        />
        <link
          href="assets/vendor/glightbox/css/glightbox.min.css"
          rel="stylesheet"
        />
        {/* Main CSS File */}
        <link href="assets/css/main.css" rel="stylesheet" />
        {/* =======================================================
  * Template Name: NiceSchool
  * Template URL: https://bootstrapmade.com/nice-school-bootstrap-education-template/
  * Updated: May 10 2025 with Bootstrap v5.3.6
  * Author: BootstrapMade.com
  * License: https://bootstrapmade.com/license/
  ======================================================== */}
        <header
          id="header"
          className="header d-flex align-items-center fixed-top"
        >
          <div className="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
            <a href="/" className="logo d-flex align-items-center">
              <img
                src="assets/img/lic_logo.png"
                alt="School Logo"
                style={{ height: "40px", marginRight: "10px" }}
              />
              <h1 className="sitename">Leaders International College</h1>
            </a>
            <nav id="navmenu" className="navmenu">
              <ul>
                <li>
                  <a href="/">
                    Home
                  </a>
                </li>
                <li className="dropdown">
                  <a href="about">
                    <span>About Us</span>{" "}
                    <i className="bi bi-chevron-down toggle-dropdown" />
                  </a>
                  <ul>
                    <li>
                      <a href="about">About Us</a>
                    </li>
                    <li>
                      <a href="campus-facilities">Campus &amp; Facilities</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#" className="active">Admissions</a>
                </li>
                <li>
                  <a href="curriculum">Curriculum</a>
                </li>
                <li>
                  <a href="students-life">Students Life</a>
                </li>
                <li>
                  <a href="hiring">We Are Hiring</a>
                </li>
                <li>
                  <a href="contact">Contact Us</a>
                </li>
              </ul>
              <i className="mobile-nav-toggle d-xl-none bi bi-list" />
            </nav>
          </div>
        </header>

        <main className="main">
          {/* Page Title */}
          <div
            className="page-title dark-background"
            style={{ backgroundImage: "url(assets/img/education/Background_school.JPG)" }}
          >
            <div className="container position-relative">
              <h1>Admissions</h1>
              <p>Start your journey at LIC—apply now to join a community that nurtures excellence, character, and global citizenship.</p>
              <nav className="breadcrumbs">
                <ol>
                  <li><a href="/">Home</a></li>
                  <li className="current">Admissions</li>
                </ol>
              </nav>
            </div>
          </div>

          {/* Buttons Styled Like Example */}
          <div className="container mt-5 text-center">
            <div className="btn-group">
              <button
                className={`btn custom-tab ${activeSection === "apply" ? "active" : ""}`}
                onClick={() => setActiveSection("apply")}
              >
                <i className="bi bi-pencil-square me-2"></i> How to Apply
              </button>
              <button
                className={`btn custom-tab ${activeSection === "requirements" ? "active" : ""}`}
                onClick={() => setActiveSection("requirements")}
              >
                <i className="bi bi-journal-check me-2"></i> Admission Requirements
              </button>
              <button
                className={`btn custom-tab ${activeSection === "deadlines" ? "active" : ""}`}
                onClick={() => setActiveSection("deadlines")}
              >
                <i className="bi bi-calendar-event me-2"></i> Key Admission Deadlines
              </button>
              <button
                className={`btn custom-tab ${activeSection === "form" ? "active" : ""}`}
                onClick={() => setActiveSection("form")}
              >
                <i className="bi bi-file-earmark-text me-2"></i> Application Form
              </button>
            </div>
          </div>

          <section id="admissions" className="admissions section">
            <div className="container" data-aos="fade-up" data-aos-delay={100}>
              <div className="row gy-5 g-lg-5">
                {activeSection === "apply" && (
                  <div className="col-lg-12">
                    <div className="admissions-info">
                      <h2>Begin Your Academic Journey Today</h2>
                      <p>
Please carefully provide the information requested below.
                      Once submitted, our admissions team will review your
                      application and contact you to arrange interviews for both
                      the student and parents. We are here to answer all your
                      questions and guide you through each step of the
                      admissions process. We look forward to getting to know
                      your family and exploring how LIC can support your child's
                      educational journey.                      </p>
                      <div className="admissions-steps mt-5">
                        <h3>How to Apply</h3>
                        <p>Applying at LIC is an exciting journey for your family,
                        and we strive to make the admissions process as smooth
                        as possible. Here are the steps you’ll need to follow to
                        apply to our school:</p>
                        <div className="steps-wrapper mt-4">
                          <div className="step-item">
                            <div className="step-number">1</div>
                            <div className="step-content">
                              <h4>Online Application</h4>
                              <p>Start your application by clicking the Apply Now
                              button. You will need to fill out the application
                              form. This is your first step toward becoming a
                              part of our vibrant learning community.</p>
                            </div>
                          </div>
                          <div className="step-item">
                            <div className="step-number">2</div>
                            <div className="step-content">
                              <h4>Child Assessment</h4>
                              <p>Once your application is received, the admission
                              team will schedule an assessment for your child to
                              better understand their educational needs and
                              abilities. This is a great opportunity for us to
                              get to know each other and ensure that our school
                              is a good fit for your child's learning style and
                              goals.</p>
                              <h6>Parents’ Interview</h6>
                              <p> On the day of the assessment or at a time
                              convenient for you, we will conduct a parents'
                              interview. This discussion is crucial as it allows
                              us to learn more about your expectations and how
                              we can best support your child’s educational
                              journey.</p>
                            </div>
                          </div>
                          <div className="step-item">
                            <div className="step-number">3</div>
                            <div className="step-content">
                              <h4>Enrollment</h4>
                              <p>Upon acceptance, you will receive an offer for
                              your child to join LIC. To finalize the
                              enrollment, you will need to complete the
                              registration process and fulfill any necessary
                              conditions or paperwork. We will guide you through
                              every step to ensure your child is ready to start
                              their educational journey with us.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "requirements" && (
                  <div className="col-lg-12">
                    <div className="admissions-requirements">
                      <h3>Admission Requirements</h3>
                      <div className="requirements-list mt-4">
                        <div className="requirement-item">
                          <div className="icon-box"><i className="bi bi-mortarboard-fill" /></div>
                          <div>
                            <h4>Personal Statement</h4>
                            <p>Tell us about your goals, values, and what makes you
                            a great fit for our community.</p>
                          </div>
                        </div>
                        <div className="requirement-item">
                          <div className="icon-box"><i className="bi bi-file-earmark-text" /></div>
                          <div>
                            <h4>Age &amp; Grade Eligibility</h4>
                            <p>Students must meet age and grade placement criteria
                            based on our academic framework.</p>
                          </div>
                        </div>
                        <div className="requirement-item">
                          <div className="icon-box"><i className="bi bi-journal-richtext" /></div>
                          <div>
                            <h4>Health &amp; Immunization Records</h4>
                            <p>Submit up-to-date health documents to ensure student
                            safety and well-being.</p>
                          </div>
                        </div>
                        <div className="requirement-item">
                          <div className="icon-box"><i className="bi bi-graph-up" /></div>
                          <div>
                            <h4>Standardized Tests</h4>
                            <p>Include results from any relevant standardized
                            assessments, if applicable to your program of
                            interest.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "deadlines" && (
                  <div className="col-lg-12">
                    <div className="deadlines">
                      <h3>Key Admission Deadlines</h3>
                      <div className="deadline-grid mt-4">
                        <div className="deadline-item">
                          <h4>Fall Semester</h4>
                          <div className="date">March 15, 2023</div>
                        </div>
                        <div className="deadline-item">
                          <h4>Spring Semester</h4>
                          <div className="date">October 1, 2023</div>
                        </div>
                        <div className="deadline-item">
                          <h4>Summer Session</h4>
                          <div className="date">January 30, 2024</div>
                        </div>
                        <div className="deadline-item">
                          <h4>Early Decision</h4>
                          <div className="date">November 15, 2023</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "form" && (
                  <div className="col-lg-12">
                    <div className="cta-wrapper mt-5">
                      <div className="row g-4">
                        <div className="col-12">
                          <div className="cta-item tour p-4 border rounded shadow-sm bg-light">
                            <i className="bi bi-building" />
                            <h3>Visit Our Campus</h3>
                            <p>Schedule your personalized campus tour today.</p>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="cta-item apply p-4 border rounded shadow-sm bg-light">
                            <i className="bi bi-file-earmark-check" />
                            <h3>Ready to Apply?</h3>
                            <p>Start your application now.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="request-info mt-5">
                      <div className="card">
                        <div className="card-body">
                          <h3 className="card-title">Admission Application Form</h3>
                          <p>Please complete the form below to apply for admission at Leaders International College.</p>
                          {/* KEEP your full form here unchanged */}
                           <form
                          className="php-email-form mt-4"
                          action="forms/contact.php"
                        >
                          <h5>Applicant Details</h5>
                          <div className="mb-3">
                            <input
                              type="text"
                              name="student_name"
                              className="form-control"
                              placeholder="Student Full Name"
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <input
                              type="date"
                              name="student_birthdate"
                              className="form-control"
                              placeholder="Date of Birth"
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
                              type="text"
                              name="current_school"
                              className="form-control"
                              placeholder="Current School/Nursery"
                            />
                          </div>
                          <div className="mb-3">
                            <select
                              name="second_language"
                              className="form-select"
                              required
                            >
                              <option value="" disabled selected>
                                Student Second Language
                              </option>
                              <option value="French">French</option>
                              <option value="German">German</option>
                              <option value="No 2nd language">
                                No 2nd Language
                              </option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="mb-3">
                            <select
                              name="grade_applying_for"
                              className="form-select"
                              required
                            >
                              <option value="" disabled selected>
                                Grade Applying For
                              </option>
                              <option>Pre school - PYP1</option>
                              <option>KG1 - PYP2</option>
                              <option>KG2 - PYP3</option>
                              <option>Grade1 - PYP4</option>
                              <option>Grade2 - PYP5</option>
                              <option>Grade3 - PYP6</option>
                              <option>Grade4 - PYP7</option>
                              <option>Grade5 - PYP8</option>
                              <option>Grade6 - MYP1</option>
                              <option>Grade7 - MYP2</option>
                              <option>Grade8 - MYP3</option>
                              <option>Grade9 - MYP4</option>
                              <option>Grade10 - MYP5</option>
                              <option>IG - Year10</option>
                              <option>Grade11 - DP1</option>
                              <option>IG - Year11</option>
                              <option>Grade12 - DP2</option>
                            </select>
                          </div>
                          <div className="mb-3">
                            <select
                              name="gender"
                              className="form-select"
                              required
                            >
                              <option value="" disabled selected>
                                Gender
                              </option>
                              <option>Male</option>
                              <option>Female</option>
                            </select>
                          </div>
                          <div className="mb-3">
                            <label className="form-label d-block">
                              Does the student have siblings in Leaders
                              International College?
                            </label>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="siblings"
                                defaultValue="Yes"
                                required
                              />
                              <label className="form-check-label">Yes</label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="siblings"
                                defaultValue="No"
                              />
                              <label className="form-check-label">No</label>
                            </div>
                          </div>
                          <h5 className="mt-4">Father’s Data</h5>
                          <div className="mb-3">
                            <input
                              type="text"
                              name="father_name"
                              className="form-control"
                              placeholder="Father’s Name"
                            />
                          </div>
                          <div className="mb-3">
                            <input
                              type="tel"
                              name="father_phone"
                              className="form-control"
                              placeholder="Father’s Mobile Number"
                            />
                          </div>
                          <div className="mb-3">
                            <input
                              type="email"
                              name="father_email"
                              className="form-control"
                              placeholder="Father’s Email"
                            />
                          </div>
                          <div className="mb-3">
                            <input
                              type="text"
                              name="father_occupation"
                              className="form-control"
                              placeholder="Father’s Occupation"
                            />
                          </div>
                          <h5 className="mt-4">Mother’s Data</h5>
                          <div className="mb-3">
                            <input
                              type="text"
                              name="mother_name"
                              className="form-control"
                              placeholder="Mother’s Name"
                            />
                          </div>
                          <div className="mb-3">
                            <input
                              type="tel"
                              name="mother_phone"
                              className="form-control"
                              placeholder="Mother’s Mobile Number"
                            />
                          </div>
                          <div className="mb-3">
                            <input
                              type="email"
                              name="mother_email"
                              className="form-control"
                              placeholder="Mother’s Email"
                            />
                          </div>
                          <div className="mb-3">
                            <input
                              type="text"
                              name="mother_occupation"
                              className="form-control"
                              placeholder="Mother’s Occupation"
                            />
                          </div>
                          <div className="mb-3">
                            <select
                              name="marital_status"
                              className="form-select"
                            >
                              <option value="" disabled selected>
                                Marital Status
                              </option>
                              <option>Married</option>
                              <option>Divorced</option>
                            </select>
                          </div>
                          <h5 className="mt-4">How Did You Hear About Us?</h5>
                          <div className="mb-3">
                            <select
                              name="referral_source"
                              className="form-select"
                            >
                              <option value="" disabled selected>
                                Select an Option
                              </option>
                              <option>Website</option>
                              <option>Social Media</option>
                              <option>Word of Mouth</option>
                              <option>Current Students or Alumni</option>
                              <option>School Events</option>
                              <option>Community Outreach</option>
                            </select>
                          </div>
                          <div className="loading">Loading</div>
                          <div className="error-message" />
                          <div className="sent-message">
                            Your application has been submitted. Thank you!
                          </div>
                          <div className="text-center">
                            <button type="submit" className="btn btn-primary">
                              Submit Application
                            </button>
                          </div>
                        </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>

        <footer
          id="footer"
          className="footer position-relative dark-background"
        >
          <div className="container footer-top">
            <div className="row gy-4">
              <div className="col-lg-4 col-md-6 footer-about">
                <a href="/" className="logo d-flex align-items-center">
                  <span className="sitename">
                    Leaders International College
                  </span>
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
              {/* All the links in the footer should remain intact. */}
              {/* You can delete the links only if you've purchased the pro version. */}
              {/* Licensing information: https://bootstrapmade.com/license/ */}
              {/* Purchase the pro version with working PHP/AJAX contact form: [buy-url] */}
              Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .custom-tab {
          border-radius: 50px;
          padding: 10px 20px;
          margin: 5px;
          background: #fff;
          border: 1px solid #ddd;
          font-weight: 600;
        }
        .custom-tab.active {
          background: #00b4e6;
          color: #fff;
          border: 1px solid #00b4e6;
        }
      `}</style>
    </>
  );
}
