"use client";

import { useEffect, useState } from "react";
import { useHiringTabs } from "../components/HiringTabsContext";

export default function WeAreHiringPage() {
  const { hiringSection, setHiringSection } = useHiringTabs();

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
        <main className="main">
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

          {/* ✅ Tabs */}
          <div className="container mt-5 text-center">
            <div className="btn-group">
              {[
                { id: "opening", label: "Opening", icon: "bi-door-open" },
                {
                  id: "development",
                  label: "Professional Development",
                  icon: "bi-award",
                },
                {
                  id: "working",
                  label: "Working at LIC",
                  icon: "bi-people-fill",
                },
                {
                  id: "internship",
                  label: "Internship Program",
                  icon: "bi-briefcase",
                },
                {
                  id: "vacancies",
                  label: "Current Vacancies",
                  icon: "bi-clipboard-check",
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`btn custom-tab ${
                    hiringSection === tab.id ? "active" : ""
                  }`}
                  onClick={() => setHiringSection(tab.id)}
                >
                  <i className={`bi ${tab.icon} me-2`}></i> {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ✅ Content Sections */}
          {/* Alumni Section */}
          <section id="alumni" className="alumni section">
            <div className="container" data-aos="fade-up" data-aos-delay={100}>
              {/* ✅ OPENINGS */}
              {hiringSection === "opening" && (
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
                          At Leaders International College, we are always
                          looking for dedicated and passionate individuals to
                          join our team. We offer a range of career
                          opportunities that allow professionals to contribute
                          to and grow within our dynamic educational
                          environment. Below, you will find a list of the
                          current vacancies available for the academic year
                          2024/2025. We encourage qualified candidates who share
                          our commitment to educational excellence and
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
              )}

              {/* ✅ DEVELOPMENT */}
              {hiringSection === "development" && (
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
                      that the growth of our teachers and staff is fundamental
                      to the success of our students and the overall educational
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
                            professional development programs, including local
                            and international workshops, seminars, and
                            conferences. These initiatives keep our staff at the
                            forefront of educational innovation, enhancing both
                            subject knowledge and teaching strategies. By
                            investing in our teachers, we uphold our commitment
                            to excellence and foster a culture of lifelong
                            learning and continuous improvement.
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
                            globally competitive and compliant with
                            international best practices.
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
                            Lifelong Learning in Education
                          </span>
                          <p>
                            We encourage our faculty to continually advance
                            their expertise and skills. Leaders International
                            College supports educators in pursuing higher
                            degrees such as master's and PhDs. It's part of our
                            school policy to actively encourage and provide
                            subjective support for teachers seeking to expand
                            their qualifications. This commitment to
                            professional growth not only enhances our teaching
                            capabilities but also enriches the learning
                            environment for our students.
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
              )}

              {/* ✅ WORKING AT LIC */}
              {hiringSection === "working" && (
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
                            committed to creating a workplace that fosters
                            growth, collaboration, and excellence. We invite
                            passionate, innovative, and dedicated individuals to
                            join our vibrant community.
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
                            improvement. Our environment is one where teachers
                            and staff are encouraged to be creative and
                            proactive in their roles, contributing to a dynamic
                            educational setting. We support our staff with
                            resources and opportunities to develop both
                            personally and professionally, ensuring that
                            everyone can contribute their best.
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
                            more about the current vacancies at our school,
                            please visit our Current Openings page. We look
                            forward to exploring how your talents and
                            aspirations might align with the goals of our school
                            community.
                          </p>
                          <a href="#" className="card-link">
                            Current Openings page
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ✅ INTERNSHIP */}
              {hiringSection === "internship" && (
                <div
                  className="impact-banner"
                  data-aos="fade-up"
                  data-aos-delay={200}
                >
                  <div className="row align-items-center">
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
                            30 years old) exploring a career change into
                            education and administration.
                          </li>
                        </ul>
                        <h4>Program Highlights</h4>
                        <ul>
                          <li>
                            Work alongside experienced professionals in
                            teaching, administration, curriculum design, or
                            school management.
                          </li>
                          <li>
                            Participate in workshops and training sessions to
                            enhance your skills and career readiness.
                          </li>
                          <li>
                            Engage in impactful projects that contribute
                            directly to our school community.
                          </li>
                        </ul>
                        <p>
                          This internship is more than work experience—it’s a
                          chance to make a real difference in students’ lives
                          while building your own professional toolkit. If you
                          are interested in applying, please fill in the form
                          below and submit your CV. We look forward to
                          discovering how your talents and aspirations might
                          align with the goals of our school community.
                        </p>
                        <div className="impact-buttons">
                          <a href="#" className="btn-donate">
                            Apply Now
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-5">
                      <div className="impact-image">
                        <img
                          src="assets/img/education/Intern.PNG"
                          alt="Internship Program"
                          className="img-fluid"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ✅ VACANCIES */}
              {hiringSection === "vacancies" && (
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

                  {/* ✅ Start merged event list */}
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
                      className="event"
                      data-aos="fade-up"
                      data-aos-delay={300}
                    >
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
                      className="event"
                      data-aos="fade-up"
                      data-aos-delay={300}
                    >
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
                  {/* ✅ End merged event list */}
                </div>
              )}
            </div>
          </section>
        </main>

        <a
          href="#"
          id="scroll-top"
          className="scroll-top d-flex align-items-center justify-content-center"
        >
          <i className="bi bi-arrow-up-short" />
        </a>

        <div id="preloader" />

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
      </div>
    </>
  );
}
