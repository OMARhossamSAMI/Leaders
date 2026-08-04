// src/app/contact/page.tsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

interface ContactUsForm {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  grade?: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      const timer = setTimeout(() => {
        preloader.style.display = "none";
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const data: ContactUsForm = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      role: formData.get("role") as string,
      grade: formData.get("grade") as string,
      subject: formData.get("subject") as string,

      message: formData.get("message") as string,
    };
    setLoading(true); // ⏳ Start loading
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/contactus`, data);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
      }, 4000);
      form.reset();
    } catch (error: unknown) {
      console.error("Submission failed:", error);

      let message = "Something went wrong. Please try again later.";
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as Record<string, unknown>).response === "object"
      ) {
        const response = (
          error as { response?: { data?: { message?: unknown } } }
        ).response;

        const rawMessage = response?.data?.message;
        if (typeof rawMessage === "string") {
          message = rawMessage;
        } else if (Array.isArray(rawMessage)) {
          message = rawMessage.join(" \n ");
        }
      }

      alert(message);
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };
  return (
    <>
      <div>
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
              <h1>Contact Us</h1>
              <p>
                We’d love to hear from you—reach out with any questions,
                feedback, or inquiries, and our team will be happy to assist
                you.
              </p>
              <nav className="breadcrumbs">
                <ol>
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li className="current">Contact Us</li>
                </ol>
              </nav>
            </div>
          </div>
          {/* End Page Title */}
          {/* Contact Section */}
          <section id="contact" className="contact section">
            <div className="container" data-aos="fade-up" data-aos-delay={100}>
              {/* Contact Info Boxes */}

              {/* Google Maps (Full Width) */}
              <div
                className="map-section"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2508.1373530784062!2d31.462300996830244!3d30.016339563956866!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145822df2dd8f289%3A0xffe559c98f96503e!2sLeaders%20International%20College!5e0!3m2!1sen!2seg!4v1752150399611!5m2!1sen!2seg"
                  width="100%"
                  height={500}
                  style={{ border: "0" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              {/* Contact Form Section (Overlapping) */}
              <div className="container form-container-overlap">
                <div
                  className="row justify-content-center"
                  data-aos="fade-up"
                  data-aos-delay={300}
                >
                  <div className="col-lg-10">
                    <div className="contact-form-wrapper">
                      <h2 className="text-center mb-4">Get in Touch</h2>

                      <form
                        onSubmit={handleSubmit}
                        action="forms/contact.php"
                        method="post"
                        className="php-email-form"
                      >
                        <div className="row g-3">
                          <div className="col-md-6">
                            <div className="form-group input-with-icon">
                              <i className="bi bi-person" />
                              <input
                                type="text"
                                className="form-control"
                                name="fullName"
                                placeholder="Full Name"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group input-with-icon">
                              <i className="bi bi-envelope" />
                              <input
                                type="email"
                                className="form-control"
                                name="email"
                                placeholder="Email Address"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group input-with-icon">
                              <i className="bi bi-telephone" />
                              <input
                                type="tel"
                                className="form-control"
                                name="phone"
                                placeholder="Phone Number"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group input-with-icon">
                              <i className="bi bi-person-badge" />
                              <select
                                className="form-control"
                                name="role"
                                required
                              >
                                <option value="">Are you a...</option>
                                <option value="student">
                                  Prospective Student
                                </option>
                                <option value="parent">Parent</option>
                                <option value="alumni">Alumni</option>
                                <option value="staff">Teacher/Staff</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group input-with-icon">
                              <i className="bi bi-book" />
                              <input
                                type="text"
                                className="form-control"
                                name="grade"
                                placeholder="Grade of Interest (optional)"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group input-with-icon">
                              <i className="bi bi-tag" />
                              <select
                                className="form-control"
                                name="subject"
                                required
                              >
                                <option value="">Select Subject</option>
                                <option value="inquiry">General Inquiry</option>
                                <option value="admissions">Admissions</option>
                                <option value="feedback">Feedback</option>
                                <option value="complaint">Complaint</option>
                                <option value="Carrers">Carrers</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="form-group input-with-icon">
                              <i className="bi bi-chat-dots message-icon" />
                              <textarea
                                className="form-control"
                                name="message"
                                placeholder="Write Message..."
                                style={{ height: "180px" }}
                                minLength={10}
                                required
                              />
                            </div>
                          </div>
                          {submitted && (
                            <div
                              className="alert alert-success text-center"
                              role="alert"
                            >
                              ✅ Your message has been sent successfully!
                            </div>
                          )}
                          <div className="col-12 text-center">
                            <button
                              type="submit"
                              className="btn btn-primary btn-submit"
                              disabled={loading}
                              style={{
                                position: "relative",
                                minWidth: "160px",
                                height: "48px",
                              }}
                            >
                              {loading ? (
                                <>
                                  <span className="custom-spinner"></span>
                                  <span className="loading-text">
                                    Sending...
                                  </span>
                                </>
                              ) : (
                                "SEND MESSAGE"
                              )}

                              <style jsx>{`
                                .custom-spinner {
                                  display: inline-block;
                                  width: 18px;
                                  height: 18px;
                                  border: 2.5px solid rgba(255, 255, 255, 0.3);
                                  border-top-color: #fff;
                                  border-radius: 50%;
                                  animation: spin 0.8s ease-in-out infinite;
                                  vertical-align: middle;
                                  margin-right: 10px;
                                }

                                .loading-text {
                                  vertical-align: middle;
                                  font-weight: 500;
                                  color: #fff;
                                }

                                @keyframes spin {
                                  to {
                                    transform: rotate(360deg);
                                  }
                                }
                              `}</style>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row gy-4 mb-5">
                <div
                  className="col-lg-6"
                  data-aos="fade-up"
                  data-aos-delay={100}
                >
                  <div className="contact-info-box">
                    <div className="icon-box">
                      <i className="bi bi-geo-alt" />
                    </div>
                    <div className="info-content">
                      <h4>Our Address</h4>

                      <li>
                        <i className="bi bi-geo-fill me-1" /> Leaders
                        International College Campus: off 90th road, fifth
                        settlement.
                      </li>
                    </div>
                  </div>
                </div>
                <div
                  className="col-lg-6"
                  data-aos="fade-up"
                  data-aos-delay={200}
                >
                  <div className="contact-info-box">
                    <div className="icon-box">
                      <i className="bi bi-envelope" />
                    </div>
                    <div className="info-content">
                      <h4>HR Department:</h4>
                      <li>
                        <i className="bi bi-envelope-fill me-1" />{" "}
                        careers@leadersintcollege.com
                      </li>
                      <li>
                        <i className="bi bi-telephone-fill me-1" /> 02 26410050
                      </li>
                    </div>
                  </div>
                </div>
                <div
                  className="col-lg-6"
                  data-aos="fade-up"
                  data-aos-delay={200}
                >
                  <div className="contact-info-box">
                    <div className="icon-box">
                      <i className="bi bi-envelope" />
                    </div>
                    <div className="info-content">
                      <h4>Admission Department:</h4>
                      <li>
                        <i className="bi bi-envelope-fill me-1" />{" "}
                        admission@leadersintcollege.com
                      </li>
                      <li>
                        <i className="bi bi-telephone-fill me-1" /> 02 26410641
                      </li>
                    </div>
                  </div>
                </div>
                <div
                  className="col-lg-6"
                  data-aos="fade-up"
                  data-aos-delay={200}
                >
                  <div className="contact-info-box">
                    <div className="icon-box">
                      <i className="bi bi-envelope" />
                    </div>
                    <div className="info-content">
                      <h4>School Counselor Department:</h4>
                      <li>
                        <i className="bi bi-envelope-fill me-1" />
                        <span style={{ wordBreak: "break-word" }}>
                          schoolcounselorpyp1_pyp8@leadersintcollege.com
                        </span>
                      </li>
                      <li>
                        <i className="bi bi-envelope-fill me-1" />
                        <span style={{ wordBreak: "break-word" }}>
                          schoolcounselormyp_dp@leadersintcollege.com
                        </span>
                      </li>
                      {/* <p>02 26410003</p> */}
                    </div>
                  </div>
                </div>
                {/* <div
                  className="col-lg-6"
                  data-aos="fade-up"
                  data-aos-delay={200}
                >
                  <div className="contact-info-box">
                    <div className="icon-box">
                      <i className="bi bi-envelope" />
                    </div>
                    <div className="info-content">
                      <h4>Principal of School Department:</h4>
                      <p>Principal@leadersintcollege.com</p>
                    </div>
                  </div>
                </div> */}
                {/* <div
                  className="col-lg-6"
                  data-aos="fade-up"
                  data-aos-delay={200}
                >
                  <div className="contact-info-box">
                    <div className="icon-box">
                      <i className="bi bi-envelope" />
                    </div>
                    <div className="info-content">
                      <h4>Accounting &amp; Finance Department:</h4>
                      <p>accountingOffice@leadersintcollege.com</p>
                    </div>
                  </div>
                </div> */}
                <div
                  className="col-lg-6"
                  data-aos="fade-up"
                  data-aos-delay={200}
                >
                  <div className="contact-info-box">
                    <div className="icon-box">
                      <i className="bi bi-envelope" />
                    </div>
                    <div className="info-content">
                      <h4>For other inquiries:</h4>
                      <li>
                        <i className="bi bi-envelope-fill me-1" />{" "}
                        info@leadersintcollege.com
                      </li>
                    </div>
                  </div>
                </div>
                <div
                  className="col-lg-6"
                  data-aos="fade-up"
                  data-aos-delay={300}
                >
                  <div className="contact-info-box">
                    <div className="icon-box">
                      <i className="bi bi-headset" />
                    </div>
                    <div className="info-content">
                      <h4>Hours of Operation</h4>

                      <li>
                        <i className="bi bi-clock-fill me-1" /> Sunday–Thursday:
                        8 AM – 3 PM
                      </li>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* /Contact Section */}
        </main>

        {/* Scroll Top */}
        <Link
          href="#"
          id="scroll-top"
          className="scroll-top d-flex align-items-center justify-content-center"
        >
          <i className="bi bi-arrow-up-short" />
        </Link>
        {/* Preloader */}
        <div id="preloader" />
        {/* Vendor JS Files */}
        {/* Main JS File */}
      </div>
    </>
  );
}
