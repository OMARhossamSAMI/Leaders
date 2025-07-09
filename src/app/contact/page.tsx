// src/app/contact/page.tsx

"use client"; // ✅ Required to run useEffect in App Router

import { useEffect } from "react";

export default function ContactPage() {
  useEffect(() => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      const timer = setTimeout(() => {
        preloader.style.display = "none";
      }, 1500); // 1.5 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <div>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>Contact - LeadersIntCollege</title>
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
          crossOrigin=""
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
                  <a href="admissions">Admissions</a>
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
                  <a href="#" className="active">Contact Us</a>
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
                    <a href="/">Home</a>
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
                      <p>
                        Leaders International College Campus: off 90th road,
                        fifth settlement.
                      </p>
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
                      <p>careers@leadersintcollege.com</p>
                      <p>02 26410050</p>
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
                      <p>admission@leadersintcollege.com</p>
                      <p>02 26410641</p>
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
                      <p>schoolcounselorpyp1_pyp8@leadersintcollege.com</p>
                      <p>cschoolcounselormyp_dp@leadersintcollege.com</p>
                      <p>02 26410003</p>
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
                      <h4>Principal of School Department:</h4>
                      <p>Principal@leadersintcollege.com</p>
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
                      <h4>Accounting &amp; Finance Department:</h4>
                      <p>accountingOffice@leadersintcollege.com</p>
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
                      <h4>Other Departments:</h4>
                      <p>info@leadersintcollege.com</p>
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
                      <p>Sunday-Thursday: 8 AM - 3 PM</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Google Maps (Full Width) */}
              <div
                className="map-section"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d48389.78314118045!2d-74.006138!3d40.710059!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a22a3bda30d%3A0xb89d1fe6bc499443!2sDowntown%20Conference%20Center!5e0!3m2!1sen!2sus!4v1676961268712!5m2!1sen!2sus"
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
                        action="forms/contact.php"
                        method="post"
                        className="php-email-form"
                      >
                        <div className="row g-3">
                          <div className="col-md-6">
                            <div className="form-group">
                              <div className="input-with-icon">
                                <i className="bi bi-person" />
                                <input
                                  type="text"
                                  className="form-control"
                                  name="name"
                                  placeholder="First Name"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <div className="input-with-icon">
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
                          </div>
                          <div className="col-md-12">
                            <div className="form-group">
                              <div className="input-with-icon">
                                <i className="bi bi-text-left" />
                                <input
                                  type="text"
                                  className="form-control"
                                  name="sbject"
                                  placeholder="Subject"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <div className="input-with-icon">
                                <i className="bi bi-chat-dots message-icon" />
                                <textarea
                                  className="form-control"
                                  name="message"
                                  placeholder="Write Message..."
                                  style={{ height: "180px" }}
                                  required
                                  defaultValue={""}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="loading">Loading</div>
                            <div className="error-message" />
                            <div className="sent-message">
                              Your message has been sent. Thank you!
                            </div>
                          </div>
                          <div className="col-12 text-center">
                            <button
                              type="submit"
                              className="btn btn-primary btn-submit"
                            >
                              SEND MESSAGE
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* /Contact Section */}
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
              Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
            </div>
          </div>
        </footer>
        {/* Scroll Top */}
        <a
          href="#"
          id="scroll-top"
          className="scroll-top d-flex align-items-center justify-content-center"
        >
          <i className="bi bi-arrow-up-short" />
        </a>
        {/* Preloader */}
        <div id="preloader" />
        {/* Vendor JS Files */}
        {/* Main JS File */}
      </div>
    </>
  );
}
