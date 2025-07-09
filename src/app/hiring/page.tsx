// src/app/we-are-hiring/page.tsx

"use client"; // ✅ Makes useEffect run on client only

import { useEffect } from "react";

export default function WeAreHiringPage() {
  useEffect(() => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      const timer = setTimeout(() => {
        preloader.style.display = "none";
      }, 15); // 1.5 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <div>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>We Are Hiring - LeadersIntCollege</title>
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
                  <a href="#" className="active">We Are Hiring</a>
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
            style={{
              backgroundImage:
                "url(assets/img/education/Background_school.JPG)",
            }}
          >
            <div className="container position-relative">
              <h1>We Are Hiring</h1>
              <p>
                Join our passionate team of educators and help shape the
                future—now hiring talented teachers and staff!
              </p>
              <nav className="breadcrumbs">
                <ol>
                  <li>
                    <a href="/">Home</a>
                  </li>
                  <li className="current">We Are Hiring</li>
                </ol>
              </nav>
            </div>
          </div>
          {/* End Page Title */}
          {/* Alumni Section */}
          <section id="alumni" className="alumni section">
            <div className="container" data-aos="fade-up" data-aos-delay={100}>
              <div className="alumni-hero">
                <div className="row align-items-center">
                  <div
                    className="col-lg-7"
                    data-aos="fade-up"
                    data-aos-delay={200}
                  >
                    <div className="hero-content">
                      <span className="alumni-badge">Careers</span>
                      <h2>Current Openings</h2>
                      <p>
                        At Leaders International College, we are always looking
                        for dedicated and passionate individuals to join our
                        team. We offer a range of career opportunities that
                        allow professionals to contribute to and grow within our
                        dynamic educational environment. Below, you will find a
                        list of the current vacancies available for the academic
                        year 2024/2025. We encourage qualified candidates who
                        share our commitment to educational excellence and
                        innovation to apply.
                      </p>
                      <div className="alumni-metrics">
                        <div className="metric">
                          <div className="counter">60+</div>
                          <div className="label">Administratives</div>
                        </div>
                        <div className="metric">
                          <div className="counter">150+</div>
                          <div className="label">Teachers</div>
                        </div>
                        <div className="metric">
                          <div className="counter">60+</div>
                          <div className="label">Facility Members</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-lg-5"
                    data-aos="zoom-in"
                    data-aos-delay={300}
                  >
                    <div className="hero-image-wrapper">
                      <div className="hero-image">
                        <img
                          src="assets/img/education/Teacher.JPG"
                          alt="Alumni Network"
                          className="img-fluid"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="notable-alumni">
                <div
                  className="section-header text-center"
                  data-aos="fade-up"
                  data-aos-delay={200}
                >
                  <h3>Professional Development </h3>
                  <p>
                    At Leaders International College, professional development
                    is not just an option—it is a priority. We firmly believe
                    that the growth of our teachers and staff is fundamental to
                    the success of our students and the overall educational
                    experience we provide. As such, our board allocates a
                    significant budget annually to ensure that our educators
                    receive the best training and development opportunities
                    available.
                  </p>
                </div>
                <div className="row">
                  <div
                    className="col-lg-4 col-md-6"
                    data-aos="fade-up"
                    data-aos-delay={300}
                  >
                    <div className="alumni-profile">
                      <div className="profile-body">
                        <h4>Development Opportunities</h4>
                        <span className="profile-title">
                          Educational Innovator &amp; Lifelong Learner
                        </span>
                        <p>
                          Leaders International College offers a variety of
                          professional development programs, including local and
                          international workshops, seminars, and conferences.
                          These initiatives keep our staff at the forefront of
                          educational innovation, enhancing both subject
                          knowledge and teaching strategies. By investing in our
                          teachers, we uphold our commitment to excellence and
                          foster a culture of lifelong learning and continuous
                          improvement.
                        </p>
                      </div>
                      <div className="achievement-badge">
                        <i className="bi bi-award" />
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-lg-4 col-md-6"
                    data-aos="fade-up"
                    data-aos-delay={400}
                  >
                    <div className="alumni-profile">
                      <div className="profile-body">
                        <h4>IB Training Requirements</h4>
                        <span className="profile-title">
                          IB-Certified Educator &amp; Curriculum Leader
                        </span>
                        <p>
                          In alignment with the standards set by the
                          International Baccalaureate Organization (IBO),
                          Leaders International College ensures that all
                          teaching and administrative staff undergo regular
                          IB-specific training and certification. This is
                          crucial for maintaining the high standards of the IB
                          programmes and ensuring that our education remains
                          globally competitive and compliant with international
                          best practices.
                        </p>
                      </div>
                      <div className="achievement-badge">
                        <i className="bi bi-stars" />
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-lg-4 col-md-6"
                    data-aos="fade-up"
                    data-aos-delay={500}
                  >
                    <div className="alumni-profile">
                      <div className="profile-body">
                        <h4>Commitment to Continuous Learning</h4>
                        <span className="profile-title">
                          Lifelong Learning in Education{" "}
                        </span>
                        <p>
                          We encourage our faculty to continually advance their
                          expertise and skills. Leaders International College
                          supports educators in pursuing higher degrees such as
                          master's and PhDs. It's part of our school policy to
                          actively encourage and provide subjective support for
                          teachers seeking to expand their qualifications. This
                          commitment to professional growth not only enhances
                          our teaching capabilities but also enriches the
                          learning environment for our students.
                        </p>
                      </div>
                      <div className="achievement-badge">
                        <i className="bi bi-lightning" />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="text-center mt-5"
                  data-aos="fade-up"
                  data-aos-delay={600}
                ></div>
              </div>
              <div className="alumni-engagement">
                <div
                  className="section-header text-center"
                  data-aos="fade-up"
                  data-aos-delay={200}
                >
                  <h3>Working at LIC</h3>
                </div>
                <div className="engagement-cards">
                  <div className="row">
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="fade-up"
                      data-aos-delay={300}
                    >
                      <div className="engagement-card">
                        <div className="card-icon">
                          <i className="bi bi-people-fill" />
                        </div>
                        <h4>Join Our Team</h4>
                        <p>
                          At Leaders International College, we seek to enrich
                          the lives of our students through exceptional
                          education, and we recognize that our staff plays a
                          crucial role in achieving this mission. We are
                          committed to creating a workplace that fosters growth,
                          collaboration, and excellence. We invite passionate,
                          innovative, and dedicated individuals to join our
                          vibrant community.
                        </p>
                      </div>
                    </div>
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="fade-up"
                      data-aos-delay={400}
                    >
                      <div className="engagement-card">
                        <div className="card-icon">
                          <i className="bi bi-calendar-event" />
                        </div>
                        <h4>School Culture</h4>
                        <p>
                          Leaders International College prides itself on a
                          culture of respect, inclusivity, and continuous
                          improvement. Our environment is one where teachers and
                          staff are encouraged to be creative and proactive in
                          their roles, contributing to a dynamic educational
                          setting. We support our staff with resources and
                          opportunities to develop both personally and
                          professionally, ensuring that everyone can contribute
                          their best.
                        </p>
                      </div>
                    </div>
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="fade-up"
                      data-aos-delay={600}
                    >
                      <div className="engagement-card">
                        <div className="card-icon">
                          <i className="bi bi-briefcase" />
                        </div>
                        <h4>Current Vacancies</h4>
                        <p>
                          Interested in joining our dynamic team? At Leaders
                          International College, we value passion, innovation,
                          and commitment to educational excellence. To learn
                          more about the current vacancies at our school, please
                          visit our Current Openings page. We look forward to
                          exploring how your talents and aspirations might align
                          with the goals of our school community.
                        </p>
                        <a href="#" className="card-link">
                          Current Openings page
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="impact-banner"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                <div className="row align-items-center">
                  {/* Left Content */}
                  <div className="col-lg-7">
                    <div className="impact-content">
                      <h3>Internship Program</h3>
                      <p>
                        Leaders International College offers a dynamic
                        internship program designed to provide practical,
                        hands-on experience in the educational sector. Our
                        program is tailored for individuals who are eager to
                        apply their academic knowledge in a real-world setting
                        and gain invaluable insights into the workings of a
                        leading international school.
                      </p>
                      <h4>Eligibility Criteria</h4>
                      <ul>
                        <li>
                          <strong>Undergraduates:</strong> Final-year students
                          ready to apply their learning in a practical
                          environment.
                        </li>
                        <li>
                          <strong>Fresh Graduates:</strong> Recent graduates
                          seeking meaningful, supportive early-career
                          experience.
                        </li>
                        <li>
                          <strong>Career Shifters:</strong> Individuals (up to
                          30 years old) exploring a career change into education
                          and administration.
                        </li>
                      </ul>
                      <h4>Program Highlights</h4>
                      <ul>
                        <li>
                          Work alongside experienced professionals in teaching,
                          administration, curriculum design, or school
                          management.
                        </li>
                        <li>
                          Participate in workshops and training sessions to
                          enhance your skills and career readiness.
                        </li>
                        <li>
                          Engage in impactful projects that contribute directly
                          to our school community.
                        </li>
                      </ul>
                      <p>
                        This internship is more than work experience—it’s a
                        chance to make a real difference in students’ lives
                        while building your own professional toolkit. If you are
                        interested in applying, please fill in the form below
                        and submit your CV. We look forward to discovering how
                        your talents and aspirations might align with the goals
                        of our school community.
                      </p>
                      <div className="impact-buttons">
                        <a href="#" className="btn-donate">
                          Apply Now
                        </a>
                      </div>
                    </div>
                  </div>
                  {/* Right Image */}
                  <div className="col-lg-5">
                    <div className="impact-image">
                      <img
                        src="assets/img/education/Intern.PNG"
                        alt="Internship Program"
                        className="img-fluid"
                      />
                      {/* Optional stat block removed or repurposed */}
                      {/* <div class="impact-stat">
    <span class="stat-number">$2.4M</span>
    <span class="stat-text">in scholarships funded by alumni last year</span>
  </div> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="upcoming-events">
                <div
                  className="section-header text-center"
                  data-aos="fade-up"
                  data-aos-delay={200}
                >
                  <h3>Current Vacancies</h3>
                  <p>
                    Explore exciting career opportunities currently open at
                    Leaders International College.
                  </p>
                </div>
                <div
                  className="events-wrapper"
                  data-aos="fade-up"
                  data-aos-delay={300}
                >
                  <div className="event">
                    <div className="event-info">
                      <h4>Current Vacancies Co-teacher</h4>
                      <div className="event-meta">
                        <span>
                          <i className="bi bi-pin-map" />
                          Career Level: Experienced (Non-Manager)
                        </span>
                        <span>
                          <i className="bi bi-clock" /> Full-Time
                        </span>
                      </div>
                    </div>
                    <div className="event-action">
                      <a href="/hiring/apply" className="btn-register">
                        Apply Now
                      </a>
                    </div>
                  </div>
                  <div
                    className="events-wrapper"
                    data-aos="fade-up"
                    data-aos-delay={300}
                  >
                    <div className="event">
                      <div className="event-info">
                        <h4>Music Teacher</h4>
                        <div className="event-meta">
                          <span>
                            <i className="bi bi-pin-map" />
                            Career Level: Experienced (Non-Manager)
                          </span>
                          <span>
                            <i className="bi bi-clock" /> Full-Time
                          </span>
                        </div>
                      </div>
                      <div className="event-action">
                        <a href="/hiring/apply" className="btn-register">
                          Apply Now
                        </a>
                      </div>
                    </div>
                    <div
                      className="events-wrapper"
                      data-aos="fade-up"
                      data-aos-delay={300}
                    >
                      <div className="event">
                        <div className="event-info">
                          <h4>PR and Marketing Specialist</h4>
                          <div className="event-meta">
                            <span>
                              <i className="bi bi-pin-map" />
                              Career Level: Experienced (Non-Manager)
                            </span>
                            <span>
                              <i className="bi bi-clock" /> Full-Time
                            </span>
                          </div>
                        </div>
                        <div className="event-action">
                          <a href="/hiring/apply" className="btn-register">
                            Apply Now
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="impact-banner"
                  data-aos="fade-up"
                  data-aos-delay={200}
                >

                  {/* <div className="row align-items-center">
                    <div className="col-lg-7">
                      <div className="impact-content">
                        <h3>Employment Application</h3>
                        <p>
                          Interested in becoming a part of our vibrant community
                          at Leaders International College? We are always eager
                          to connect with talented individuals who are
                          passionate about education and innovation. Please fill
                          out the application form below and submit your CV. We
                          look forward to exploring potential opportunities with
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
                            <select
                              name="source_info"
                              className="form-select"
                              required
                            >
                              <option value="" disabled selected>
                                Select an option
                              </option>
                              <option value="Website">Website</option>
                              <option value="Social Media Platforms">
                                Social Media Platforms
                              </option>
                              <option value="Family/Friends">
                                Family/Friends
                              </option>
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
                            <label className="form-label">
                              Employment Type:
                            </label>
                            <br />
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="employment_type[]"
                                defaultValue="Full Time"
                              />
                              <label className="form-check-label">
                                Full Time
                              </label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="employment_type[]"
                                defaultValue="Part Time"
                              />
                              <label className="form-check-label">
                                Part Time
                              </label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="employment_type[]"
                                defaultValue="Internship"
                              />
                              <label className="form-check-label">
                                Internship
                              </label>
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
                            <label className="form-label">
                              Upload Certificates
                            </label>
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
                            References should include superintendents,
                            principals, or professors who have first-hand
                            knowledge of your professional competence and
                            personal qualifications.
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
                          <div className="error-message" />
                          <div className="sent-message">
                            Your application has been submitted. Thank you!
                          </div>
                          <div className="event-action">
                            <button type="submit" className="btn-register">
                              Submit Application
                            </button>
                          </div>
                          <p className="mt-4 text-muted">
                            Thanks for your interest in Leaders International
                            College!
                          </p>
                        </form>
                      </div>
                    </div>
                  </div>*/}

                </div>
              </div>
            </div>
          </section>
          {/* /Alumni Section */}
        </main>
        <footer
          id="footer"
          className="footer position-relative dark-background"
        >
          <div className="container footer-top">
            <div className="row gy-4">
              <div className="col-lg-4 col-md-6 footer-about">
                <a href="/" className="logo d-flex align-items-center">
                  <span className="sitename">NiceSchool</span>
                </a>
                <div className="footer-contact pt-3">
                  <p>A108 Adam Street</p>
                  <p>New York, NY 535022</p>
                  <p className="mt-3">
                    <strong>Phone:</strong> <span>+1 5589 55488 55</span>
                  </p>
                  <p>
                    <strong>Email:</strong> <span>info@example.com</span>
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
