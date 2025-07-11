// src/app/our-staff/page.tsx

"use client"; // ✅ Required to use useEffect in App Router

import { useEffect } from "react";

export default function OurStaffPage() {
  useEffect(() => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      const timer = setTimeout(() => {
        preloader.style.display = "none";
      }, 150); // 1.5 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <div>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>Our Staff - LeadersIntCollege</title>
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
              <h1>Meet Our Leadership</h1>
              <p>
                At LIC, our leadership team is composed of visionary educators
                and strategic minds committed to guiding our school toward
                excellence and innovation.
              </p>
              <nav className="breadcrumbs">
                <ol>
                  <li>
                    <a href="/">Home</a>
                  </li>
                  <li className="current">Faculty Staff</li>
                </ol>
              </nav>
            </div>
          </div>
          {/* End Page Title */}
          {/* Faculty  Staff Section */}
          <section id="faculty--staff" className="faculty--staff section">
            <div className="container" data-aos="fade-up" data-aos-delay={100}>
              <div className="row">
                <div
                  className="col-lg-3"
                  data-aos="fade-up"
                  data-aos-delay={300}
                >
                  <div className="departments-nav">
                    <h4 className="departments-title">Departments</h4>
                    <ul className="nav nav-tabs flex-column">
                      <li className="nav-item">
                        <button
                          className="nav-link active"
                          data-bs-toggle="tab"
                          data-bs-target="#faculty--staff-tab-1"
                        >
                          Board Of Directors
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className="nav-link"
                          data-bs-toggle="tab"
                          data-bs-target="#faculty--staff-tab-2"
                        >
                          Corporate Managers
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <div
                  className="col-lg-9"
                  data-aos="fade-up"
                  data-aos-delay={400}
                >
                  <div className="tab-content">
                    <div
                      className="tab-pane fade show active"
                      id="faculty--staff-tab-1"
                    >
                      <div className="department-info mb-4">
                        <h3>Board Of Directors</h3>
                        <p>
                          The Board of Directors provides strategic leadership
                          and governance, guiding the organization’s vision and
                          ensuring long-term success.
                        </p>
                      </div>
                      <div className="row g-4">
                        <div className="col-md-6 col-lg-3">
                          <div className="faculty-card">
                            <div className="faculty-image">
                              <img
                                src="assets/img/person/Mrraafat.png"
                                className="img-fluid"
                                alt="Faculty Member"
                              />
                            </div>
                            <div className="faculty-info">
                              <h4>Mr. Raafat El Hawary</h4>
                              <p className="faculty-title">
                                President &amp; Legal Representative
                              </p>
                              <div className="faculty-specialties">
                                <span>Board Member</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="faculty-card">
                            <div className="faculty-image">
                              <img
                                src="assets/img/person/DrAlaa.png"
                                className="img-fluid"
                                alt="Faculty Member"
                              />
                            </div>
                            <div className="faculty-info">
                              <h4>Dr. Alaa Ghazy</h4>
                              <p className="faculty-title">CEO</p>
                              <div className="faculty-specialties">
                                <span>Board Member</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="faculty-card">
                            <div className="faculty-image">
                              <img
                                src="assets/img/person/Engmoh.png"
                                className="img-fluid"
                                alt="Faculty Member"
                              />
                            </div>
                            <div className="faculty-info">
                              <h4>Eng. Mohamed El Hawary</h4>
                              <p className="faculty-title">
                                Quality Assurance Dean
                              </p>
                              <div className="faculty-specialties">
                                <span>Board Member</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="faculty-card">
                            <div className="faculty-image">
                              <img
                                src="assets/img/person/DrMohamed.png"
                                className="img-fluid"
                                alt="Faculty Member"
                              />
                            </div>
                            <div className="faculty-info">
                              <h4>Dr. Mohamed Alaa</h4>
                              <p className="faculty-title">
                                Operations Manager
                              </p>
                              <div className="faculty-specialties">
                                <span>Board Member</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="faculty--staff-tab-2">
                      <div className="department-info mb-4">
                        <h3>Corporate Managers</h3>
                        <p>
                          Corporate Managers oversee daily operations and
                          implement strategic plans to ensure organizational
                          efficiency and growth.
                        </p>
                      </div>
                      <div className="row g-4">
                        <div className="col-md-6 col-lg-3">
                          <div className="faculty-card">
                            <div className="faculty-image">
                              <img
                                src="assets/img/person/Mrraafat.png"
                                className="img-fluid"
                                alt="Faculty Member"
                              />
                            </div>
                            <div className="faculty-info">
                              <h4>Mr. Raafat El Hawary</h4>
                              <p className="faculty-title">
                                President &amp; Legal Representative
                              </p>
                              <div className="faculty-specialties">
                                <span>Board Member</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="faculty-card">
                            <div className="faculty-image">
                              <img
                                src="assets/img/person/DrAlaa.png"
                                className="img-fluid"
                                alt="Faculty Member"
                              />
                            </div>
                            <div className="faculty-info">
                              <h4>Dr. Alaa Ghazy</h4>
                              <p className="faculty-title">CEO</p>
                              <div className="faculty-specialties">
                                <span>Board Member</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="faculty-card">
                            <div className="faculty-image">
                              <img
                                src="assets/img/person/maha.png"
                                className="img-fluid"
                                alt="Faculty Member"
                              />
                            </div>
                            <div className="faculty-info">
                              <h4>Mrs Maha El Mahy</h4>
                              <p className="faculty-title">Vice CEO</p>
                              <div className="faculty-specialties">
                                <span>Corporate Manager</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="faculty-card">
                            <div className="faculty-image">
                              <img
                                src="assets/img/person/Engmoh.png"
                                className="img-fluid"
                                alt="Faculty Member"
                              />
                            </div>
                            <div className="faculty-info">
                              <h4>Eng. Mohamed El Hawary</h4>
                              <p className="faculty-title">
                                Quality Assurance Dean
                              </p>
                              <div className="faculty-specialties">
                                <span>Board Member</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="faculty-card">
                            <div className="faculty-image">
                              <img
                                src="assets/img/person/DrMohamed.png"
                                className="img-fluid"
                                alt="Faculty Member"
                              />
                            </div>
                            <div className="faculty-info">
                              <h4>Dr. Mohamed Alaa</h4>
                              <p className="faculty-title">
                                Operations Manager
                              </p>
                              <div className="faculty-specialties">
                                <span>Board Member</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="faculty-card">
                            <div className="faculty-image">
                              <img
                                src="assets/img/person/MsNer.png"
                                className="img-fluid"
                                alt="Faculty Member"
                              />
                            </div>
                            <div className="faculty-info">
                              <h4>Ms Nermeen Alaa</h4>
                              <p className="faculty-title">
                                Business Support Manager
                              </p>
                              <div className="faculty-specialties">
                                <span>Corporate Manager</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="faculty-card">
                            <div className="faculty-image">
                              <img
                                src="assets/img/person/Mrgeaorge.png"
                                className="img-fluid"
                                alt="Faculty Member"
                              />
                            </div>
                            <div className="faculty-info">
                              <h4>Mr George Maurice</h4>
                              <p className="faculty-title">Finance Manager</p>
                              <div className="faculty-specialties">
                                <span>Corporate Manager</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* /Faculty  Staff Section */}
        </main>

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
