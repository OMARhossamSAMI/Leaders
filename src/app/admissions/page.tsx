"use client";

import { useEffect, useState } from "react";
import { useTabs } from "../components/TabsContext";

export default function AdmissionsPage() {
  const { activeSection, setActiveSection } = useTabs();

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

        <main className="main">
          {/* Page Title */}
          <div
            className="page-title dark-background"
            style={{
              backgroundImage:
                "url(assets/img/education/Background_school.JPG)",
            }}
          >
            <div className="container position-relative">
              <h1>Admissions</h1>
              <p>
                Start your journey at LIC—apply now to join a community that
                nurtures excellence, character, and global citizenship.
              </p>
              <nav className="breadcrumbs">
                <ol>
                  <li>
                    <a href="/">Home</a>
                  </li>
                  <li className="current">Admissions</li>
                </ol>
              </nav>
            </div>
          </div>

          {/* Buttons Styled Like Example */}
          <div className="container mt-5 text-center">
            <div className="btn-group">
              <button
                className={`btn custom-tab ${
                  activeSection === "apply" ? "active" : ""
                }`}
                onClick={() => setActiveSection("apply")}
              >
                <i className="bi bi-pencil-square me-2"></i> How to Apply
              </button>
              <button
                className={`btn custom-tab ${
                  activeSection === "form" ? "active" : ""
                }`}
                onClick={() => setActiveSection("form")}
              >
                <i className="bi bi-file-earmark-text me-2"></i> Apply Now
              </button>
              <button
                className={`btn custom-tab ${
                  activeSection === "requirements" ? "active" : ""
                }`}
                onClick={() => setActiveSection("requirements")}
              >
                <i className="bi bi-people me-2"></i> Age Acceptance Guide
              </button>
              <button
                className={`btn custom-tab ${
                  activeSection === "deadlines" ? "active" : ""
                }`}
                onClick={() => setActiveSection("deadlines")}
              >
                <i className=" bi bi-camera-video me-2"></i> Virtual Tour
              </button>
            </div>
          </div>

          <section id="admissions" className="admissions section">
            <div className="container" data-aos="fade-up" data-aos-delay={100}>
              <div className="row gy-5 g-lg-5">
                {activeSection === "apply" && (
                  <>
                    <div className="col-lg-8">
                      <div className="admissions-info">
                        <h2>Begin Your Academic Journey Today</h2>
                        <p>
                          Please carefully provide the information requested
                          below. Once submitted, our admissions team will review
                          your application and contact you to arrange interviews
                          for both the student and parents. We are here to
                          answer all your questions and guide you through each
                          step of the admissions process. We look forward to
                          getting to know your family and exploring how LIC can
                          support your child's educational journey.
                        </p>
                        <div className="admissions-steps mt-5">
                          <h3>How to Apply</h3>
                          <p>
                            Applying at LIC is an exciting journey for your
                            family, and we strive to make the admissions process
                            as smooth as possible. Here are the steps you’ll
                            need to follow to apply to our school:
                          </p>
                          <div className="steps-wrapper mt-4">
                            <div className="step-item">
                              <div className="step-number">1</div>
                              <div className="step-content">
                                <h4>Online Application</h4>
                                <p>
                                  Start your application by clicking the Apply
                                  Now button. You will need to fill out the
                                  application form. This is your first step
                                  toward becoming a part of our vibrant learning
                                  community.
                                </p>
                              </div>
                            </div>
                            <div className="step-item">
                              <div className="step-number">2</div>
                              <div className="step-content">
                                <h4>Child Assessment</h4>
                                <p>
                                  Once your application is received, the
                                  admission team will schedule an assessment for
                                  your child to better understand their
                                  educational needs and abilities. This is a
                                  great opportunity for us to get to know each
                                  other and ensure that our school is a good fit
                                  for your child's learning style and goals.
                                </p>
                                <h6>Parents’ Interview</h6>
                                <p>
                                  On the day of the assessment or at a time
                                  convenient for you, we will conduct a parents'
                                  interview. This discussion is crucial as it
                                  allows us to learn more about your
                                  expectations and how we can best support your
                                  child’s educational journey.
                                </p>
                              </div>
                            </div>
                            <div className="step-item">
                              <div className="step-number">3</div>
                              <div className="step-content">
                                <h4>Enrollment</h4>
                                <p>
                                  Upon acceptance, you will receive an offer for
                                  your child to join LIC. To finalize the
                                  enrollment, you will need to complete the
                                  registration process and fulfill any necessary
                                  conditions or paperwork. We will guide you
                                  through every step to ensure your child is
                                  ready to start their educational journey with
                                  us.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT IMAGE COLUMN */}
                    <div className="col-lg-4 d-flex align-items-center">
                      <img
                        src="assets/img/education/ApplyNowFINAL.JPG"
                        alt="How to Apply"
                        className="img-fluid"
                        style={{ height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  </>
                )}

                {activeSection === "requirements" && (
                  <div className="col-lg-12">
                    <div className="admissions-requirements">
                      <h3>Age Acceptance Guide</h3>

                      <div className="requirements-list mt-4">
                        <div className="requirement-item">
                          <div className="icon-box">
                            <i className="bi bi-people" />
                          </div>
                          <div>
                            <p>
                              Our Age Guide Chart shows the typical age ranges
                              for each grade level at Leaders International
                              College, from Primary Years Program (PYP) through
                              Middle Years Program (MYP) and Diploma Program
                              (DP), helping parents understand how students
                              progress through each stage of their academic
                              journey.
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Full-width image */}
                      <div className="requirements-image mb-4">
                        <img
                          src="assets/img/education/AGE.jpg"
                          alt="Age Acceptance Guide"
                          style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "8px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "deadlines" && (
                  <div className="col-lg-12">
                    <div className="deadlines">
                      <div className="row mt-4">
                        {/* COLUMN 1: Fall Semester */}
                        <div className="col-lg-6">
                          <div className="deadline-item mb-4">
                            <h4>Virtual Tour</h4>
                            <p>
                              Explore Leaders International College from the
                              comfort of your home! Our virtual tour provides
                              you with a unique opportunity to experience our
                              campus as if you were here in person. Navigate
                              through our state-of-the-art facilities, including
                              classrooms, labs, sports complexes, and more, to
                              see where our students learn, play, and grow. If
                              you have any questions or would like more
                              information about specific areas of our campus,
                              please do not hesitate to contact our admissions
                              team.
                            </p>
                            <p>
                              Take this chance to discover every corner of
                              Leaders International College without leaving your
                              living room. Our immersive virtual tour lets you
                              walk through our vibrant learning spaces, modern
                              laboratories, creative studios, sports areas, and
                              welcoming common spaces. See for yourself how our
                              students thrive academically and socially in a
                              safe, inspiring environment. Should you need
                              further details or wish to explore particular
                              parts of our campus in more depth, our friendly
                              admissions team is ready to assist and guide you
                              every step of the way.
                            </p>
                            <p>
                              We invite you to embark on this virtual journey
                              and get a true feel for what makes Leaders
                              International College exceptional. Witness
                              firsthand how our carefully designed campus
                              supports academic achievement, personal growth,
                              and community spirit. Explore the innovative
                              classrooms where curiosity is sparked, the sports
                              areas where teamwork is strengthened, and the
                              communal spaces where friendships are built.
                              Whenever you’re ready to learn more or take the
                              next step, our dedicated admissions team is eager
                              to connect with you and make sure you have all the
                              information you need.
                            </p>
                          </div>
                        </div>

                        {/* COLUMN 2: Spring Semester */}
                        <div className="col-lg-6">
                          <div className="deadline-item mb-4">
                            <div className="intro-image-container">
                              <div className="intro-image main-image">
                                <h4>Press And Visit</h4>
                                <a
                                  href="http://vrtour.leadersintcollege.com/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    src="assets/img/education/VrtualFinal.png"
                                    alt="Main Campus"
                                    className="img-fluid rounded"
                                    style={{ width: "600px", height: "580px" }}
                                  />
                                </a>
                              </div>
                            </div>
                          </div>
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
                          <div className="cta-item apply p-4 border rounded shadow-sm bg-light">
                            <i className="bi bi-file-earmark-check" />
                            <h3>Ready to Apply?</h3>
                            <p>
                              Please carefully provide the information requested
                              below. Once submitted, our admissions team will
                              review your application and contact you to arrange
                              interviews for both the student and parents. We
                              are here to answer all your questions and guide
                              you through each step of the admissions process.
                              We look forward to getting to know your family and
                              exploring how LIC can support your child's
                              educational journey.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="request-info mt-5">
                      <div className="card">
                        <div className="card-body">
                          <h3 className="card-title">
                            Admission Application Form
                          </h3>
                          <p>
                            Please complete the form below to apply for
                            admission at Leaders International College.
                          </p>
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
