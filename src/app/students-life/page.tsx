// src/app/students-life/page.tsx

"use client"; // ✅ Needed for useEffect

import { useEffect } from "react";
import "./page.css"; // Import the CSS file for this page

export default function StudentsLifePage() {
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
        <title>Students Life - LeadersIntCollege</title>
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
                  <a href="/">Home</a>
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
                  <a href="#" className="active">
                    Students Life
                  </a>
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
            className="page-title dark-background position-relative"
            style={{
              backgroundImage:
                "url(assets/img/education/Background_school.JPG)",
            }}
          >
            <div className="container position-relative">
              <h1>Student Life</h1>
              <p>
                Student life at LIC is a dynamic blend of academic exploration,
                creative expression, and meaningful community engagement that
                empowers learners beyond the classroom.
              </p>
              <nav className="breadcrumbs">
                <ol>
                  <li>
                    <a href="/">Home</a>
                  </li>
                  <li className="current">Students Life</li>
                </ol>
              </nav>
            </div>
          </div>
          {/* End Page Title */}
          {/* Students Life Section */}
          <section id="students-life" className="students-life section">
            <div className="container" data-aos="fade-up" data-aos-delay={100}>
              {/* Hero Banner */}
              <div
                className="students-life-banner"
                data-aos="zoom-in"
                data-aos-delay={200}
              >
                <div
                  className="banner-content"
                  data-aos="fade-right"
                  data-aos-delay={300}
                >
                  <h2>Experience Campus Life</h2>
                  <p>
                    Experience campus life at LIC, where vibrant learning
                    spaces, diverse activities, and a supportive community come
                    together to inspire growth, friendship, and discovery.
                  </p>
                </div>
                <img
                  src="assets/img/education/LIFE.JPG"
                  alt="Campus Life"
                  className="img-fluid"
                />
              </div>
              {/* Tabs Section */}
              <div
                className="students-life-tabs mt-5 text-center"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                <ul
                  className="nav nav-pills mb-4 justify-content-center"
                  id="studentLifeTabs"
                  role="tablist"
                >
                  {/* Athletics */}
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="athletics-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#students-life-athletics"
                      type="button"
                      role="tab"
                      aria-controls="students-life-athletics"
                      aria-selected="true"
                    >
                      <i className="bi bi-trophy" /> Athletics
                    </button>
                  </li>
                  {/* Extracurricular Activities */}
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="extracurricular-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#students-life-extracurricular"
                      type="button"
                      role="tab"
                      aria-controls="students-life-extracurricular"
                      aria-selected="false"
                    >
                      <i className="bi bi-building" /> Extracurricular
                      Activities
                    </button>
                  </li>
                  {/* Day In LIC */}
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="dayinlic-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#students-life-dayinlic"
                      type="button"
                      role="tab"
                      aria-controls="students-life-dayinlic"
                      aria-selected="false"
                    >
                      <i className="bi bi-calendar-event" /> Day In LIC
                    </button>
                  </li>
                  {/* Health & Wellness */}
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="health-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#students-life-health"
                      type="button"
                      role="tab"
                      aria-controls="students-life-health"
                      aria-selected="false"
                    >
                      <i className="bi bi-heart-pulse" /> Health &amp; Wellness
                    </button>
                  </li>
                  {/* Clubs */}
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="clubs-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#students-life-clubs"
                      type="button"
                      role="tab"
                      aria-controls="students-life-clubs"
                      aria-selected="false"
                    >
                      <i className="bi bi-people" /> Clubs
                    </button>
                  </li>
                  {/* Trips */}
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="trips-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#students-life-trips"
                      type="button"
                      role="tab"
                      aria-controls="students-life-trips"
                      aria-selected="false"
                    >
                      <i className="bi bi-bus-front" /> Trips
                    </button>
                  </li>
                  {/* Student Council */}
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="council-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#students-life-council"
                      type="button"
                      role="tab"
                      aria-controls="students-life-council"
                      aria-selected="false"
                    >
                      <i className="bi bi-people-fill" /> Student Council
                    </button>
                  </li>
                  {/* Art Programs */}
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="art-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#students-life-art"
                      type="button"
                      role="tab"
                      aria-controls="students-life-art"
                      aria-selected="false"
                    >
                      <i className="bi bi-palette" /> Art Programs
                    </button>
                  </li>
                  {/* School Events */}
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="events-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#students-life-events"
                      type="button"
                      role="tab"
                      aria-controls="students-life-events"
                      aria-selected="false"
                    >
                      <i className="bi bi-calendar-week" /> School Events
                    </button>
                  </li>
                  {/* Dining Services */}
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="dining-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#students-life-dining"
                      type="button"
                      role="tab"
                      aria-controls="students-life-dining"
                      aria-selected="false"
                    >
                      <i className="bi bi-cup-straw" /> Dining Services
                    </button>
                  </li>
                  {/* Transportations */}
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="transport-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#students-life-transport"
                      type="button"
                      role="tab"
                      aria-controls="students-life-transport"
                      aria-selected="false"
                    >
                      <i className="bi bi-bus-front-fill" /> Transportations
                    </button>
                  </li>
                </ul>
                {/* Tab Content */}
                <div className="tab-content" id="studentLifeTabsContent">
                  {/* Athletics Tab (ACTIVE BY DEFAULT) */}
                  <div
                    className="tab-pane fade show active"
                    id="students-life-athletics"
                    role="tabpanel"
                    aria-labelledby="athletics-tab"
                  >
                    <div className="row g-4 mb-4 align-items-center">
                      <div
                        className="col-lg-6"
                        data-aos="fade-right"
                        data-aos-delay={200}
                      >
                        <h3>Athletics &amp; Recreation Programs</h3>
                        <p>
                          Explore a wide range of Athletics &amp; Recreation
                          Programs that promote teamwork, fitness, and school
                          spirit through competitive and recreational
                          activities.
                        </p>
                      </div>
                      <div
                        className="col-lg-6"
                        data-aos="fade-left"
                        data-aos-delay={300}
                      >
                        <div className="stats-container">
                          <div className="stat-item">
                            <span className="number">10+</span>
                            <span className="label">Sports Teams</span>
                          </div>
                          <div className="stat-item">
                            <span className="number">20+</span>
                            <span className="label">Championships</span>
                          </div>
                          <div className="stat-item">
                            <span className="number">150+</span>
                            <span className="label">Athletes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="athletic-programs-slider swiper init-swiper"
                      data-aos="fade-up"
                      data-aos-delay={400}
                    >
                      <div className="sport-cards-grid">
                        <div className="sport-card">
                          <img
                            src="assets/img/education/SWIMMING.JPG"
                            className="img-fluid"
                            alt="Swimming"
                          />
                          <div className="sport-info">
                            <h5>Swimming</h5>
                            <div className="badge">Varsity</div>
                          </div>
                        </div>

                        <div className="sport-card">
                          <img
                            src="assets/img/education/FOOTBALL.png"
                            className="img-fluid"
                            alt="Football"
                          />
                          <div className="sport-info">
                            <h5>Football</h5>
                            <div className="badge">Varsity</div>
                          </div>
                        </div>

                        <div className="sport-card">
                          <img
                            src="assets/img/education/BASKETBALL.JPG"
                            className="img-fluid"
                            alt="Basketball"
                          />
                          <div className="sport-info">
                            <h5>Basketball</h5>
                            <div className="badge">Varsity</div>
                          </div>
                        </div>

                        <div className="sport-card">
                          <img
                            src="assets/img/education/Volleyball.png"
                            className="img-fluid"
                            alt="Volleyball"
                          />
                          <div className="sport-info">
                            <h5>Volleyball</h5>
                            <div className="badge">Varsity</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Facilities Tab */}
                  <div
                    className="tab-pane fade"
                    id="students-life-extracurricular"
                    role="tabpanel"
                    aria-labelledby="extracurricular-tab"
                  >
                    <div className="row justify-content-center g-4">
                      {/* LEFT: Text Content */}
                      <div
                        className="col-lg-7"
                        data-aos="fade-left"
                        data-aos-delay={50}
                      >
                        <div
                          className="extracurricular-content"
                          style={{
                            background: "#fff",
                            borderRadius: "12px",
                            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                            padding: "40px",
                            height: "100%",
                            textAlign: "left",
                          }}
                        >
                          <h4>Introduction</h4>
                          <p>
                            We believe in the power of extracurricular activities to enhance student life
                            and foster holistic development. Our diverse range of activities is designed
                            to complement academic learning by promoting social, cultural, and physical
                            development.
                          </p>

                          <h4>Leadership and Skills Development</h4>
                          <p>
                            Extracurricular activities at Leaders International College are more than just
                            hobbies; they are a critical part of our educational approach. Participating in
                            these activities helps students develop leadership skills, build resilience, and
                            learn the value of teamwork and cooperation.
                          </p>

                          <h4>Engaging Environment</h4>
                          <p>
                            Our school fosters an environment where students are encouraged to try new
                            things and explore their interests. This dynamic setting enhances their
                            educational experience and contributes to a well-rounded personality.
                            The extracurricular programs at Leaders International College are designed to
                            challenge and inspire our students. By engaging in these activities, students
                            gain confidence and abilities that support their academic achievements and
                            prepare them for a variety of life’s challenges.
                          </p>

                          {/* Image below Engaging Environment */}
                          <img
                            src="assets/img/education/Engage.png"
                            alt="Engaging Environment"
                            className="img-fluid rounded mt-3"
                          />
                        </div>
                      </div>

                      {/* RIGHT: Facilities Info */}
                      <div
                        className="col-lg-5"
                        data-aos="fade-left"
                        data-aos-delay={300}
                      >
                        <div
                          className="facilities-info"
                          style={{
                            background: "#fff",
                            borderRadius: "12px",
                            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                            padding: "40px",
                          }}
                        >
                          <h3>Wide Range of Options</h3>
                          <p>
                            Students at Leaders International College can choose from a wide array of extracurricular options, including:
                          </p>
                          <div className="facilities-list">
                            <div className="facility-item mb-3">
                              <i
                                className="bi bi-trophy me-2"
                                style={{ color: "hsl(193, 75%, 54%)" }}
                              />
                              <h5>Sports</h5>
                              <p>
                                Team sports such as soccer, basketball, and volleyball, providing opportunities for students to develop teamwork and physical fitness.
                              </p>
                            </div>
                            <div className="facility-item mb-3">
                              <i
                                className="bi bi-brush me-2"
                                style={{ color: "hsl(193, 75%, 54%)" }}
                              />
                              <h5>Arts</h5>
                              <p>
                                Music, drama, and visual arts programs that encourage creative expression and cultural appreciation.
                              </p>
                            </div>
                            <div className="facility-item mb-3">
                              <i
                                className="bi bi-people me-2"
                                style={{ color: "hsl(193, 75%, 54%)" }}
                              />
                              <h5>Clubs and Societies</h5>
                              <p>
                                Engage in a variety of clubs such as the Science Club, Reading Club, Model United Nations (MUN), and more, each offering unique opportunities to pursue interests and develop new skills.
                              </p>
                            </div>
                            <div className="facility-item mb-3">
                              <i
                                className="bi bi-globe me-2"
                                style={{ color: "hsl(193, 75%, 54%)" }}
                              />
                              <h5>Community Service</h5>
                              <p>
                                Opportunities that instill a sense of responsibility and a commitment to making a positive impact in the community.
                              </p>
                            </div>
                          </div>
                          <a
                            href="#"
                            className="btn btn-explore mt-3"
                            style={{
                              display: "inline-block",
                              backgroundColor: "hsl(193, 75%, 54%)",
                              color: "#fff",
                              padding: "12px 24px",
                              borderRadius: "6px",
                              textDecoration: "none",
                              fontWeight: 600,
                            }}
                          >
                            Virtual Campus Tour{" "}
                            <i className="bi bi-arrow-right ms-1" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>



                  {/* Day In LIC */}
                  <div
                    className="tab-pane fade"
                    id="students-life-dayinlic"
                    role="tabpanel"
                    aria-labelledby="dayinlic-tab"
                  >
                    <section
                      className="dayinlic-content"
                      style={{
                        background: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                        padding: "40px",
                      }}
                    >
                      <header className="dayinlic-header">
                        <h1>Day in the Life of an LIC Student</h1>
                        <p>
                          At Leaders International College, each day is
                          thoughtfully planned to balance academics, activities,
                          and personal growth.
                        </p>
                      </header>
                      <div className="dayinlic-cards">
                        {/* Morning Arrival */}
                        <article className="dayinlic-card shift-image-down">
                          <div className="card-image">
                            <img
                              src="assets/img/education/morning-arrival.png"
                              alt="Morning Arrival"
                            />
                          </div>
                          <div className="card-body">
                            <h4>Morning Arrival</h4>
                            <p>
                              Students arrive early and gather for the morning
                              line-up at 7:40 AM — announcements and a focused
                              start.
                            </p>
                          </div>
                        </article>
                        {/* Academic Sessions */}
                        <article className="dayinlic-card">
                          <div className="card-image">
                            <img
                              src="assets/img/education/Students.jpg"
                              alt="Academic Sessions"
                            />
                          </div>
                          <div className="card-body">
                            <h4>Academic Sessions</h4>
                            <p>
                              By 8:00 AM, classes are in full swing. Students
                              explore core subjects, using interactive panels
                              that make learning engaging and dynamic.
                            </p>
                          </div>
                        </article>
                        {/* Lunch */}
                        <article className="dayinlic-card">
                          <div className="card-image">
                            <img
                              src="assets/img/education/Break.jpeg"
                              alt="Midday Break and Lunch"
                            />
                          </div>
                          <div className="card-body">
                            <h4>Midday Break and Lunch</h4>
                            <p>
                              At noon, students enjoy a lunch break. Our dining
                              services provide nutritious meals for diverse
                              tastes, with indoor and outdoor seating for
                              relaxing and socializing.
                            </p>
                          </div>
                        </article>
                        {/* Afternoon Classes */}
                        <article className="dayinlic-card">
                          <div className="card-image">
                            <img
                              src="assets/img/education/dismissal.jpg"
                              alt="Afternoon Classes"
                            />
                          </div>
                          <div className="card-body">
                            <h4>Afternoon Classes</h4>
                            <p>
                              After lunch, students continue with afternoon
                              sessions — hands-on labs, creative projects, and
                              group work build practical skills and
                              collaboration.
                            </p>
                          </div>
                        </article>
                        {/* Dismissal */}
                        <article className="dayinlic-card">
                          <div className="card-image">
                            <img
                              src="assets/img/education/Dimiss.JPG"
                              alt="Dismissal"
                            />
                          </div>
                          <div className="card-body">
                            <h4>Dismissal</h4>
                            <p>
                              The school day ends at 2:55 PM. Students pack up
                              and head home or stay for additional activities
                              and homework catch-up.
                            </p>
                          </div>
                        </article>
                        {/* Clubs & Extracurriculars */}
                        <article className="dayinlic-card">
                          <div className="card-image">
                            <img
                              src="assets/img/education/EXTR.png"
                              alt="Clubs and Extracurricular Activities"
                            />
                          </div>
                          <div className="card-body">
                            <h4>Clubs &amp; Extracurricular Activities</h4>
                            <p>
                              On special days after dismissal, clubs and
                              activities help students develop interests in
                              arts, sports, robotics, debate, and more, building
                              teamwork and leadership skills.
                            </p>
                          </div>
                        </article>
                      </div>
                    </section>
                  </div>
                  {/* Health & Wellness */}
                  <div
                    className="tab-pane fade"
                    id="students-life-health"
                    role="tabpanel"
                    aria-labelledby="health-tab"
                  >
                    <section
                      className="healthwellness-content"
                      style={{
                        background: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                        padding: "40px",
                      }}
                    >
                      <header className="healthwellness-header">
                        <h1>Commitment to Student Well-being</h1>
                        <p>
                          At Leaders International College, student well-being
                          is at the heart of our mission — blending healthcare,
                          mental support, fitness, nutrition, and wellness
                          education.
                        </p>
                      </header>
                      <div className="healthwellness-cards">
                        {/* Health Center */}
                        <article className="healthwellness-card">
                          <div className="card-image">
                            <img
                              src="assets/img/education/aaaaaa.JPG"
                              alt="Health Center"
                            />
                          </div>
                          <div className="card-body">
                            <h4>Comprehensive Health Services</h4>
                            <p>
                              Our well-staffed health center provides medical
                              services, emergency care, and support for chronic
                              issues. Regular health education promotes healthy
                              habits campus-wide.
                            </p>
                          </div>
                        </article>
                        {/* Counseling Services */}
                        <article className="healthwellness-card">
                          <div className="card-image">
                            <img
                              src="assets/img/education/counseling.jpg"
                              alt="Counseling Services"
                            />
                          </div>
                          <div className="card-body">
                            <h4>Counseling Services</h4>
                            <p>
                              Our dedicated counselor helps students with
                              academic, social, or personal challenges, ensuring
                              they navigate school life with confidence and
                              resilience.
                            </p>
                          </div>
                        </article>
                        {/* Psychological Support */}
                        <article className="healthwellness-card">
                          <div className="card-image">
                            <img
                              src="assets/img/education/psychology.jpg"
                              alt="Psychological Support"
                            />
                          </div>
                          <div className="card-body">
                            <h4>Psychological Support</h4>
                            <p>
                              A qualified psychologist supports students with
                              emotional or psychological challenges, providing
                              them with tools to manage mental well-being
                              effectively.
                            </p>
                          </div>
                        </article>
                        {/* Physical Fitness */}
                        <article className="healthwellness-card">
                          <div className="card-image">
                            <img
                              src="assets/img/education/fitness.jpg"
                              alt="Physical Fitness"
                            />
                          </div>
                          <div className="card-body">
                            <h4>Physical Fitness</h4>
                            <p>
                              Physical education is integral to our curriculum.
                              Students use our gym, courts, and shaded pool to
                              stay active, build teamwork, and boost leadership
                              skills.
                            </p>
                          </div>
                        </article>
                        {/* Nutritional Services */}
                        <article className="healthwellness-card">
                          <div className="card-image">
                            <img
                              src="assets/img/education/nutrition.jpg"
                              alt="Nutritional Services"
                            />
                          </div>
                          <div className="card-body">
                            <h4>Nutritional Services</h4>
                            <p>
                              Our dining team serves balanced meals designed by
                              nutrition experts. We teach students how to make
                              healthy food choices every day.
                            </p>
                          </div>
                        </article>
                        {/* Wellness Programs */}
                        <article className="healthwellness-card">
                          <div className="card-image">
                            <img
                              src="assets/img/education/wellness-programs.jpg"
                              alt="Wellness Programs"
                            />
                          </div>
                          <div className="card-body">
                            <h4>Wellness Programs</h4>
                            <p>
                              Year-round wellness programs cover stress
                              management, mental resilience, and physical health
                              — empowering students to build lifelong healthy
                              habits.
                            </p>
                          </div>
                        </article>
                      </div>
                      <footer className="healthwellness-conclusion">
                        <h4>Conclusion</h4>
                        <p>
                          Health and wellness are woven into the fabric of
                          student life at LIC. With medical care, counseling,
                          fitness, nutrition, and wellness initiatives, we help
                          students thrive in all areas of life.
                        </p>
                      </footer>
                    </section>
                  </div>
                  {/* Clubs */}
                  <div
                    className="tab-pane fade"
                    id="students-life-clubs"
                    role="tabpanel"
                    aria-labelledby="clubs-tab"
                  >
                    <section
                      className="clubs-content"
                      style={{
                        background: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                        padding: "40px",
                      }}
                    >
                      <div className="row justify-content-center align-items-start">
                        {/* COLUMN 1 */}
                        <div className="col-lg-5 mb-4 mb-lg-0">
                          <header
                            className="clubs-header text-center"
                            style={{ background: "#f5f8f7", padding: "50px", borderRadius: "8px" }}
                          >
                            <h3>Clubs at Leaders International College</h3>
                            <p>
                              At Leaders International College, clubs play a vital role in the holistic development of our students during the Primary Years Programme (PYP). Engaging in clubs helps students develop new skills, discover passions, and build meaningful friendships. Through a variety of club activities, our students explore their interests, work together, and enjoy learning beyond the classroom, helping them grow in confidence and creativity.                            </p>
                          </header>
                        </div>

                        {/* COLUMN 2 */}
                        <div className="col-lg-5">
                          <section
                            className="clubs-dynamic text-center"
                            style={{ background: "#f5f8f7", padding: "50px", borderRadius: "8px" }}
                          >
                            <h4>Dynamic Club Offerings</h4>
                            <p>
                              Our selection of clubs is specially designed to cater to the diverse interests
                              of our young learners in the PYP stage. Recognizing that interests can vary
                              significantly from year to year, the range of clubs offered at Leaders International
                              College is dynamic and responsive. Each academic year, we assess the interests and
                              preferences of our students and adapt our club offerings accordingly. This approach
                              ensures that our clubs remain engaging, relevant, and exciting for students.
                            </p>
                          </section>
                        </div>
                      </div>


                      <div className="clubs-grid">
                        <div className="club-card">
                          <img
                            src="assets/img/education/art-club.jpg"
                            alt="Art Club"
                          />
                          <h5>Art Club</h5>
                          <p>
                            Encourages creativity through drawing, painting, and crafting.
                          </p>
                        </div>
                        <div className="club-card">
                          <img
                            src="assets/img/education/science-club.jpg"
                            alt="Science Club"
                          />
                          <h5>Science Club</h5>
                          <p>
                            Engage in fun and educational scientific experiments.
                          </p>
                        </div>
                        <div className="club-card">
                          <img
                            src="assets/img/education/drama-club.jpg"
                            alt="Drama Club"
                          />
                          <h5>Drama Club</h5>
                          <p>
                            Gain confidence and express creativity through performance.
                          </p>
                        </div>

                        <div className="clubs-bottom">
                          <div className="club-card">
                            <img
                              src="assets/img/education/shagarha.png"
                              alt="Eco Club"
                               className="img-fluid rounded-top"
                              style={{
                                width: '400px',
                                height: '200px',
                                objectFit: 'cover',
                                objectPosition: 'center',
                              }}
                            />
                            <h5>Eco Club</h5>
                            <p>
                              Focuses on sustainability and environmental awareness.
                            </p>
                          </div>
                          <div className="club-card">
                            <img

                              src="assets/img/education/CHESS2.png"
                              alt="Chess Club"
                              className="img-fluid rounded-top"
                              style={{
                                width: '400px',
                                height: '200px',
                                objectFit: 'cover',
                                objectPosition: 'center',
                              }}

                            />
                            <h5>Chess Club</h5>
                            <p>
                              Build strategic thinking and problem-solving skills.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* ✅ Benefits + Conclusion row stays the same */}
                      <div className="clubs-info-row">
                        <section className="clubs-benefits">
                          <h4>Benefits of Participation</h4>
                            <div className="text-start">
                              <ul style={{ listStyle: "none", padding: 0 }}>
                                <li className="mb-2">
                                  <i
                                    className="bi bi-check-circle-fill me-2"
                                    style={{ color: "hsl(193, 75%, 54%)" }}
                                  ></i>
                                  Explore interests in a structured, fun environment.
                                </li>
                                <li className="mb-2">
                                  <i
                                    className="bi bi-people-fill me-2"
                                    style={{ color: "hsl(193, 75%, 54%)" }}
                                  ></i>
                                  Build social skills by engaging with peers.
                                </li>
                                <li className="mb-2">
                                  <i
                                    className="bi bi-award-fill me-2"
                                    style={{ color: "hsl(193, 75%, 54%)" }}
                                  ></i>
                                  Gain a sense of belonging and achievement.
                                </li>
                                <li className="mb-2">
                                  <i
                                    className="bi bi-person-check-fill me-2"
                                    style={{ color: "hsl(193, 75%, 54%)" }}
                                  ></i>
                                  Strengthen teamwork and leadership abilities.
                                </li>
                              </ul>
                            </div>


                        </section>

                        <section className="clubs-conclusion">
                          <h4>Conclusion</h4>
                          <p>
                            Clubs at Leaders International College are a key part of our educational mission. By offering dynamic, interest-based clubs, we help students grow both personally and academically.
                          </p>
                        </section>
                      </div>
                    </section>
                  </div>

                  {/* Trips */}
                  <div
                    className="tab-pane fade"
                    id="students-life-trips"
                    role="tabpanel"
                    aria-labelledby="trips-tab"
                  >
                    <section
                      className="trips-content"
                      style={{
                        background: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                        padding: "40px",
                      }}
                    >
                      <header className="trips-header text-center mb-4">
                        <h3>Trips</h3>
                      </header>

                      <div className="trips-grid">
                        <div className="trip-card">
                          <img
                            src="assets/img/education/Trip1.jpeg"
                            alt="Curriculum-Integrated Daily Trips"
                          />
                          <h4>Curriculum-Integrated Daily Trips</h4>
                          <p>
                            Throughout the academic year, we organize daily
                            trips that are directly linked to our curriculum.
                            These excursions are designed to complement
                            classroom learning, providing students with hands-on
                            experiences that enrich their understanding of
                            specific subjects. Whether it’s a visit to a local
                            museum, a scientific center, or a historical site,
                            these trips are tailored to reinforce the curriculum
                            and ignite students' curiosity.
                          </p>
                        </div>

                        <div className="trip-card">
                          <img
                            src="assets/img/education/Egypt.png"
                            alt="Exploring Egypt"
                          />
                          <h4>Exploring Egypt</h4>
                          <p>
                            In addition to daily educational trips, we offer
                            travel opportunities within Egypt that allow
                            students to discover and appreciate the rich
                            cultural heritage and natural beauty of their
                            country. These trips vary each year, depending on
                            the curriculum and student interests, ensuring that
                            learning remains dynamic and engaging. By exploring
                            different regions of Egypt, students gain a deeper
                            understanding of their national identity and the
                            diverse communities and ecosystems within their
                            country.
                          </p>
                        </div>
                      </div>

                      <footer className="trips-conclusion mt-4">
                        <p>
                          Trips at Leaders International College are more than
                          just educational outings; they are pivotal experiences
                          that contribute significantly to the intellectual and
                          personal development of our students. Each trip is an
                          opportunity for discovery, learning, and growth,
                          reflecting our commitment to providing a well-rounded
                          education that prepares students for a globalized
                          world.
                        </p>
                      </footer>
                    </section>
                  </div>

                  {/* Student Council */}
                  <div
                    className="tab-pane fade"
                    id="students-life-council"
                    role="tabpanel"
                    aria-labelledby="council-tab"
                  >
                    <section
                      className="council-content"
                      style={{
                        background: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                        padding: "40px",
                      }}
                    >
                      <header className="council-header text-center mb-5">
                        <h3>Student Council</h3>
                        <p>
                          The Student Council at Leaders International College
                          plays a crucial role in our school community,
                          representing the student body and enhancing school
                          life through leadership and initiative.
                        </p>
                      </header>

                     <section className="council-functions mb-5">
                      <h4>Key Functions</h4>
                      <div
                        className="council-cards"
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "center",
                          gap: "30px",
                        }}
                      >
                        <div
                          className="council-card"
                          style={{
                            maxWidth: "300px",
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          <img
                            src="assets/img/education/Voice.png"
                            alt="Voice of the Students"
                          />
                          <h5>Voice of the Students</h5>
                          <p>
                            The council acts as a liaison between the students and the school
                            administration, ensuring that student opinions and ideas are heard.
                          </p>
                        </div>

                        <div
                          className="council-card"
                          style={{
                            maxWidth: "300px",
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          <img
                            src="assets/img/education/EventP.png"
                            alt="Event Planning"
                          />
                          <h5>Event Planning</h5>
                          <p>
                            They organize and manage school events and social activities, which
                            boost engagement and foster a sense of community.
                          </p>
                        </div>

                        <div
                          className="council-card"
                          style={{
                            maxWidth: "300px",
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          <img
                            src="assets/img/education/Comm.jpeg"
                            alt="Community Engagement"
                          />
                          <h5>Community Engagement</h5>
                          <p>
                            Council members lead community service projects, promoting a culture
                            of giving back and responsibility among students.
                          </p>
                        </div>
                      </div>
                    </section>


                      <section className="council-participation mb-5">
                        <h4>Participation and Elections</h4>
                        <p>
                          Participation in the Student Council is open to all
                          students through an annual democratic election
                          process. This opportunity allows students to develop
                          essential leadership skills, engage in school
                          governance, and influence key aspects of their
                          educational environment.
                        </p>
                      </section>

                      <section className="council-impact mb-5">
                        <h4>Impact</h4>
                        <p>
                          Serving on the Student Council helps students develop
                          crucial skills like leadership, decision-making, and
                          communication, preparing them for active participation
                          in their communities and future careers.
                        </p>
                        <p>
                          The Student Council is integral to student life at
                          Leaders International College, empowering students to
                          take on leadership roles and make a positive impact
                          within and beyond the school.
                        </p>
                      </section>
                    </section>
                  </div>

                  {/* Art Programs */}
                  <div
                    className="tab-pane fade"
                    id="students-life-art"
                    role="tabpanel"
                    aria-labelledby="art-tab"
                  >
                    <section
                      className="arts-content"
                      style={{
                        background: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                        padding: "40px",
                      }}
                    >
                      <header className="arts-header text-center mb-5">
                        <h3>Arts Programs</h3>
                        <p>
                          Our arts programs are dedicated to nurturing
                          creativity and artistic expression among students. We
                          offer a wide range of opportunities in the visual and
                          performing arts, allowing students to explore and
                          develop their talents in music, drama, painting, and
                          more.
                        </p>
                      </header>

                      <div className="arts-grid">
                        <div className="arts-card">
                          <img
                            src="assets/img/education/annual.jpeg"
                            alt="Comprehensive Arts Education"
                          />
                          <h4>Comprehensive Arts Education</h4>
                          <p>
                            Our curriculum includes structured arts education
                            that encourages students to explore various artistic
                            disciplines. From drawing and sculpture to music
                            composition and theater production, students receive
                            comprehensive instruction that enhances their
                            understanding and appreciation of the arts.
                          </p>
                        </div>

                        <div className="arts-card">
                          <img
                            src="assets/img/education/EX2.png"
                            alt="Annual Art Competition"
                          />
                          <h4>Annual Art Competition</h4>
                          <p>
                            A highlight of our arts calendar is the annual art
                            competition, which invites students from all grades
                            to showcase their artistic talents. This event is
                            not only a competition but also a celebration of
                            creativity within our school community. Students get
                            the opportunity to present their work, receive
                            feedback from experienced judges, and enjoy
                            recognition for their artistic endeavors.
                          </p>
                        </div>

                        <div className="arts-card">
                          <img
                            src="assets/img/education/show.jpeg"
                            alt="Showcasing Talent"
                          />
                          <h4>Showcasing Talent</h4>
                          <p>
                            The art competition culminates in an exhibition
                            where the works of our students are displayed. This
                            event brings together the entire school
                            community—students, parents, and staff—to appreciate
                            the diverse artistic talents at Leaders
                            International College. It is a testament to the
                            vibrancy of our arts programs and the creativity of
                            our students.
                          </p>
                        </div>
                      </div>

                      <footer className="arts-conclusion">
                        <p>
                          The arts programs at Leaders International College are
                          a cornerstone of our educational philosophy, providing
                          students with the tools and opportunities to express
                          themselves and explore their creativity. Through
                          events like our annual art competition, we celebrate
                          and cultivate the artistic potential of every student,
                          preparing them for a future where they can continue to
                          innovate and inspire.
                        </p>
                      </footer>
                    </section>
                  </div>

                  {/* School Events */}
                  <div
                    className="tab-pane fade"
                    id="students-life-events"
                    role="tabpanel"
                    aria-labelledby="events-tab"
                  >
                    <section
                      className="events-content"
                      style={{
                        background: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                        padding: "40px",
                      }}
                    >
                      {/* Header */}
                      <header className="events-header text-center mb-5">
                        <h3>School Events</h3>
                        <p>
                          At Leaders International College, our vibrant school calendar is filled
                          with a diverse array of events that cater to specific grades and the whole
                          school community. These events are designed to foster school spirit,
                          celebrate achievements, and bring together students, staff, and families
                          in meaningful ways.
                        </p>
                      </header>

                      {/* Highlight Events: Top 3 (PYP, MYP, DP) */}
                      <section className="events-highlights mb-5">
                        <h4 className="text-center mb-4">Highlight Events</h4>
                        <div
                          className="event-grid"
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            gap: "30px",
                          }}
                        >
                          {/* PYP Exhibition */}
                          <div
                            className="event-card"
                            style={{
                              maxWidth: "300px",
                              width: "100%",
                              textAlign: "center",
                              background: "#f5f8f7",
                              padding: "20px",
                              borderRadius: "8px",
                            }}
                          >
                            <img
                              src="assets/img/education/pypex.jpeg"
                              alt="PYP Exhibition"
                              className="img-fluid rounded mb-3"
                            />
                            <h5>PYP Exhibition</h5>
                            <p>
                              PYP 8 students present their year-long projects, demonstrating their
                              learning outcomes and personal growth.
                            </p>
                          </div>

                          {/* MYP Personal Project Exhibition */}
                          <div
                            className="event-card"
                            style={{
                              maxWidth: "300px",
                              width: "100%",
                              textAlign: "center",
                              background: "#f5f8f7",
                              padding: "20px",
                              borderRadius: "8px",
                            }}
                          >
                            <img
                              src="assets/img/education/MYPEX.jpeg"
                              alt="MYP Personal Project Exhibition"
                              className="img-fluid rounded mb-3"
                            />
                            <h5>MYP Personal Project Exhibition</h5>
                            <p>
                              MYP 5 students display their independent projects, highlighting their
                              creativity and innovation.
                            </p>
                          </div>

                          {/* CAS Exhibition */}
                          <div
                            className="event-card"
                            style={{
                              maxWidth: "300px",
                              width: "100%",
                              textAlign: "center",
                              background: "#f5f8f7",
                              padding: "20px",
                              borderRadius: "8px",
                            }}
                          >
                            <img
                              src="assets/img/education/CAS.png"
                              alt="CAS Exhibition"
                              className="img-fluid rounded mb-3"
                            />
                            <h5>CAS Exhibition</h5>
                            <p>
                              This event showcases the creativity, activity, and service projects
                              of our Diploma Programme students.
                            </p>
                          </div>
                        </div>
                      </section>

                      {/* Bottom 2 Cards: Other Events */}
                      <div
                        className="event-bottom"
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "center",
                          gap: "30px",
                        }}
                      >
                        {/* School Carnival */}
                        <div
                          className="event-card"
                          style={{
                            maxWidth: "300px",
                            width: "100%",
                            textAlign: "center",
                            background: "#f5f8f7",
                            padding: "20px",
                            borderRadius: "8px",
                          }}
                        >
                          <img
                            src="assets/img/education/CARN.jpeg"
                            alt="School Carnival"
                            className="img-fluid rounded mb-3"
                          />
                          <h5>School Carnival</h5>
                          <p>
                            Our annual school carnival is a highlight, bringing the entire
                            school community together for a day of fun, games, and entertainment.
                          </p>
                        </div>

                        {/* School Sohour */}
                        <div
                          className="event-card"
                          style={{
                            maxWidth: "300px",
                            width: "100%",
                            textAlign: "center",
                            background: "#f5f8f7",
                            padding: "20px",
                            borderRadius: "8px",
                          }}
                        >
                          <img
                            src="assets/img/education/sehour.jpeg"
                            alt="School Sohour"
                            className="img-fluid rounded mb-3"
                          />
                          <h5>School Sohour</h5>
                          <p>
                            During Ramadan, the school sohour event fosters a sense of community
                            and shared heritage, featuring good food and cultural performances.
                          </p>
                        </div>
                      </div>

                      {/* Community Engagement */}
                      <section className="events-community my-5">
                        <h4>Community Engagement</h4>
                        <p>
                          We ensure our school calendar is packed with events that invite and bring
                          together our entire school community. These occasions enrich the educational
                          experience and strengthen bonds among students, teachers, and families.
                        </p>
                      </section>

                      {/* Access Calendar */}
                      <section className="events-community my-5">
                        <h4>Access the School Calendar</h4>
                        <p>
                          To keep our community informed and engaged, a detailed school calendar is
                          available for download. This calendar outlines all our scheduled events,
                          allowing students and parents to plan ahead and participate fully. Check out
                          the upcoming events and mark your calendars!
                        </p>
                        <p className="mt-4">
                        Our school events play a crucial role in creating an enriching and inclusive
                        atmosphere at Leaders International College. They are integral to our educational
                        mission, providing dynamic learning experiences and fostering a strong, supportive
                        community. Join us in celebrating and building lasting memories throughout the
                        school year!
                      </p>
                      <a
                        href="#"
                        className="btn-school-calendar"
                        style={{
                          display: "inline-block",
                          backgroundColor: "hsl(193, 75%, 54%)",
                          color: "#fff",
                          padding: "12px 24px",
                          borderRadius: "6px",
                          textDecoration: "none",
                          fontWeight: 600,
                        }}
                      >
                        Download School Calendar
                      </a>
                      </section>
                    </section>
                  </div>




                  {/* Dining Services */}
                  <div
                    className="tab-pane fade"
                    id="students-life-dining"
                    role="tabpanel"
                    aria-labelledby="dining-tab"
                  >
                    <section
                      className="dining-content"
                      style={{
                        background: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                        padding: "40px",
                      }}
                    >
                      <header className="dining-header text-center mb-5">
                        <h3>On-Campus Dining Services</h3>
                        <p>
                          At Leaders International College, our on-campus dining
                          services provide nutritious and delicious meal options
                          for our students and staff. We are committed to
                          offering a variety of healthy choices that cater to
                          different dietary needs and preferences. Our dining
                          facilities are designed to be welcoming spaces where
                          students can enjoy meals and socialize with their
                          peers, ensuring they have the energy to learn and
                          participate in school activities effectively.
                        </p>
                      </header>

                      <div className="dining-card">
                        <img
                          src="assets/img/education/Dining.png"
                          alt="On-Campus Dining"
                          className="img-fluid rounded"
                          style={{
                            width: "100%",
                            height: "600px",
                            borderRadius: "8px",
                          }}
                        />
                      </div>
                    </section>
                  </div>

                  {/* Transportations */}
                  <div
                    className="tab-pane fade"
                    id="students-life-transport"
                    role="tabpanel"
                    aria-labelledby="transport-tab"
                  >
                    <section
                      className="transport-content"
                      style={{
                        background: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                        padding: "40px",
                      }}
                    >
                      <header className="transport-header text-center mb-5">
                        <h3>Transportation</h3>
                        <p>
                          Leaders International College offers a comprehensive
                          transportation service to ensure safe and convenient
                          travel to and from school for our students. Our fleet
                          of buses is well-maintained and equipped with safety
                          features, and all routes are monitored to adhere to
                          the highest standards of safety and efficiency. We aim
                          to provide a reliable service that contributes to the
                          overall well-being and daily convenience of our
                          students and their families.
                        </p>
                      </header>

                      <div className="transport-card">
                        <img
                          src="assets/img/education/Trans.png"
                          alt="School Transportation"
                          className="img-fluid rounded"
                          style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "8px",
                          }}
                        />
                      </div>
                    </section>
                  </div>
                </div>
              </div>
              {/* Student Life Gallery */}
              <div
                className="students-life-gallery mt-5"
                data-aos="fade-up"
                data-aos-delay={50}
              >
                <div className="section-header text-center">
                  <h3>Life on Campus</h3>
                  <p>Take a glimpse into our vibrant student community</p>
                </div>
                <div className="row g-3">
                  <div
                    className="col-md-4"
                    data-aos="zoom-in"
                    data-aos-delay={50}
                  >
                    <a
                      href="assets/img/education/SL5.JPG"
                      className="gallery-item glightbox"
                    >
                      <img
                        src="assets/img/education/SL5.JPG"
                        className="img-fluid"
                        alt="Student Life"
                      />
                    </a>
                  </div>
                  <div
                    className="col-md-4"
                    data-aos="zoom-in"
                    data-aos-delay={50}
                  >
                    <a href="" className="gallery-item glightbox">
                      <img
                        src="assets/img/education/SL1.JPG"
                        className="img-fluid"
                        alt="Student Life"
                      />
                    </a>
                  </div>
                  <div
                    className="col-md-4"
                    data-aos="zoom-in"
                    data-aos-delay={50}
                  >
                    <a
                      href="assets/img/education/SL4.JPG"
                      className="gallery-item glightbox"
                    >
                      <img
                        src="assets/img/education/SL4.JPG"
                        className="img-fluid"
                        alt="Student Life"
                      />
                    </a>
                  </div>
                  <div
                    className="col-md-6"
                    data-aos="zoom-in"
                    data-aos-delay={50}
                  >
                    <a
                      href="assets/img/education/SL2.JPG"
                      className="gallery-item glightbox"
                    >
                      <img
                        src="assets/img/education/SL2.JPG"
                        className="img-fluid"
                        alt="Student Life"
                      />
                    </a>
                  </div>
                  <div
                    className="col-md-6"
                    data-aos="zoom-in"
                    data-aos-delay={50}
                  >
                    <a
                      href="assets/img/education/SL3.JPG"
                      className="gallery-item glightbox"
                    >
                      <img
                        src="assets/img/education/SL3.JPG"
                        className="img-fluid"
                        alt="Student Life"
                      />
                    </a>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div
                className="cta-wrapper mt-5"
                data-aos="fade-up"
                data-aos-delay={500}
              >
                <div className="cta-content">
                  <div className="row align-items-center">
                    <div
                      className="col-lg-8"
                      data-aos="fade-right"
                      data-aos-delay={300}
                    >
                      <h3>Ready to Join Our Community?</h3>
                      <p>
                        Take the first step toward an inspiring educational
                        journey—become part of the Leaders International College
                        family today.
                      </p>
                    </div>
                    <div
                      className="col-lg-4"
                      data-aos="fade-left"
                      data-aos-delay={400}
                    >
                      <div className="cta-buttons">
                        <a href="#" className="btn btn-primary">
                          Apply Now
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* /Students Life Section */}
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
                  <a href="">
                    <i className="bi bi-twitter-x" />
                  </a>
                  <a href="">
                    <i className="bi bi-facebook" />
                  </a>
                  <a href="">
                    <i className="bi bi-instagram" />
                  </a>
                  <a href="">
                    <i className="bi bi-linkedin" />
                  </a>
                </div>
              </div>
              <div className="col-lg-2 col-md-3 footer-links">
                <h4>Useful Links</h4>
                <ul>
                  <li>
                    <a href="#">Home</a>
                  </li>
                  <li>
                    <a href="#">About us</a>
                  </li>
                  <li>
                    <a href="#">Services</a>
                  </li>
                  <li>
                    <a href="#">Terms of service</a>
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
