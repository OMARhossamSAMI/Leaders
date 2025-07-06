/// src/app/about/page.tsx
"use client";
import { Metadata } from "next";
import { useEffect } from "react";

export default function AboutPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const preloader = document.getElementById("preloader");
      if (preloader) {
        preloader.style.display = "none";
      }
    }, 150); // 1.5 seconds

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <div>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>About - LeadersIntCollege</title>
        <meta
          name="description"
          content="Learn more about Leaders International College, our vision, mission, and team."
        />
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
                  <a href="/" className="active">
                    Home
                  </a>
                </li>
                <li className="dropdown">
                  <a href="#">
                    <span>About Us</span>{" "}
                    <i className="bi bi-chevron-down toggle-dropdown" />
                  </a>
                  <ul>
                    <li>
                      <a href="#">About Us</a>
                    </li>
                    <li>
                      <a href="/our-staff">Our Staff</a>
                    </li>
                    <li>
                      <a href="/campus-facilities">Campus &amp; Facilities</a>
                    </li>
                  </ul>
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
                  <a href="/hiring">We Are Hiring</a>
                </li>
                <li>
                  <a href="/contact">Contact Us</a>
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
              <h1>About Us</h1>
              <p>
                "Empowering Future Leaders Through a Legacy of Innovation,
                Excellence, and Global Education."
              </p>
              <nav className="breadcrumbs">
                <ol>
                  <li>
                    <a href="/">Home</a>
                  </li>
                  <li className="current">About Us</li>
                </ol>
              </nav>
            </div>
          </div>
          {/* End Page Title */}
          {/* History Section */}
          <section id="history" className="history section">
            <div className="container" data-aos="fade-up" data-aos-delay={100}>
              <div className="row align-items-center g-5">
                <div className="col-lg-6">
                  <div
                    className="about-content"
                    data-aos="fade-up"
                    data-aos-delay={200}
                  >
                    <h3>Our Story</h3>
                    <h2>Who We Are</h2>
                    <p>
                      At Leaders International College, we are a vibrant
                      community of dedicated educators, enthusiastic learners,
                      and supportive families, all committed to the pursuit of
                      educational excellence. As a proud member of Leaders for
                      Educational Services, our foundation is built on over 15
                      years of pioneering experience in the educational sector.
                      Our school is a reflection of a rich tradition of academic
                      excellence combined with innovative teaching
                      methodologies. We stand as a beacon of educational
                      innovation and excellence, with a rich history spanning
                      over a decade. Founded 10 years ago, LIC is among the
                      first schools to be fully accredited for all stages of the
                      International Baccalaureate (IB) - Primary Years Programme
                      (PYP), Middle Years Programme (MYP), and Diploma Programme
                      (DP). This prestigious recognition places us at the
                      forefront of international education, as one of the oldest
                      and most experienced IB World Schools. Our commitment to
                      the IB framework is deep-rooted and evident in our
                      approach to education, which emphasizes intellectual,
                      personal, emotional, and social growth across all grade
                      levels. We are dedicated to fostering a culture of
                      academic rigor combined with a holistic educational
                      experience that prepares students to thrive in a
                      globalized world. Our educators are not only experts in
                      their fields but also advocates of the IB philosophy,
                      promoting inquiry, reflection, and critical thinking among
                      our students. As we celebrate over a decade of leadership
                      in IB education, our school continues to be a place where
                      tradition meets innovation. We pride ourselves on creating
                      an inclusive, supportive, and dynamic learning environment
                      where every student is encouraged to explore their
                      potential and achieve their best. Through our
                      comprehensive IB curriculum, we prepare our students not
                      just for academic success, but for lifelong learning and
                      responsible citizenship in the global community.
                    </p>
                    <h3>Why Leaders</h3>
                    <h2>Accreditation</h2>
                    <p>
                      At Leaders International College, we are a vibrant
                      community of dedicated educators, enthusiastic learners,
                      and supportive families, all committed to the pursuit of
                      educational excellence. As a proud member of Leaders for
                      Educational Services, our foundation is built on over 15
                      years of pioneering experience in the educational sector.
                      Our school is a reflection of a rich tradition of academic
                      excellence combined with innovative teaching
                      methodologies. We stand as a beacon of educational
                      innovation and excellence, with a rich history spanning
                      over a decade. Founded 10 years ago, LIC is among the
                      first schools to be fully accredited for all stages of the
                      International Baccalaureate (IB) - Primary Years Programme
                      (PYP), Middle Years Programme (MYP), and Diploma Programme
                      (DP). This prestigious recognition places us at the
                      forefront of international education, as one of the oldest
                      and most experienced IB World Schools. Our commitment to
                      the IB framework is deep-rooted and evident in our
                      approach to education, which emphasizes intellectual,
                      personal, emotional, and social growth across all grade
                      levels. We are dedicated to fostering a culture of
                      academic rigor combined with a holistic educational
                      experience that prepares students to thrive in a
                      globalized world. Our educators are not only experts in
                      their fields but also advocates of the IB philosophy,
                      promoting inquiry, reflection, and critical thinking among
                      our students. As we celebrate over a decade of leadership
                      in IB education, our school continues to be a place where
                      tradition meets innovation. We pride ourselves on creating
                      an inclusive, supportive, and dynamic learning environment
                      where every student is encouraged to explore their
                      potential and achieve their best. Through our
                      comprehensive IB curriculum, we prepare our students not
                      just for academic success, but for lifelong learning and
                      responsible citizenship in the global community.
                    </p>
                    <div className="timeline"></div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div
                    className="about-image"
                    data-aos="zoom-in"
                    data-aos-delay={300}
                  >
                    <img
                      src="assets/img/education/BUILDING.JPG"
                      alt="Campus"
                      className="img-fluid rounded"
                    />
                    <div
                      className="mission-vision"
                      data-aos="fade-up"
                      data-aos-delay={400}
                    >
                      <div className="mission">
                        <h3>Our Mission</h3>
                        <p>
                          Leaders International College will enable its students
                          to realize their full potential through providing a
                          distinguished and comprehensive educational experience
                          that implements a unique integrated international
                          curriculum allowing students to develop their skills,
                          abilities and attitudes. LIC students will develop as
                          life-long learners who respect and cherish their core
                          values and beliefs while demonstrating open-mindedness
                          and tolerance. We strive to exhibit high-standard
                          performance and meet expectations of all stakeholders.
                          We will ensure that we utilize LIC resources
                          efficiently and provide a safe nurturing learning
                          environment where all stakeholders are actively
                          involved in students’ learning and embrace LIC
                          prospective goals.
                        </p>
                      </div>
                      <div className="vision">
                        <h3>Our Vision</h3>
                        <p>
                          Leaders International College envisions to become an
                          exemplary educational institution in the Middle East
                          through empowering its students to become well-versed,
                          confident and capable global citizens of the 21st
                          century. LIC guides a new generation of leaders in all
                          paths of life by a strong sense of identity, taking
                          pride in their culture and maintaining the courage to
                          act upon their beliefs. We are dedicated to enable our
                          students to apply their talents to all aspects of life
                          and support sustainable development and innovation.
                          LIC aims to be a pioneering workplace in which its
                          collaborative community continually develops
                          curriculum, instructional strategies, and approaches
                          of assessment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-5">
                <div className="col-lg-12">
                  <div
                    className="core-values"
                    data-aos="fade-up"
                    data-aos-delay={500}
                  >
                    <h3 className="text-center mb-4">Strategies</h3>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                      <div className="col">
                        <div className="value-card">
                          <div className="value-icon">
                            <i className="bi bi-book" />
                          </div>
                          <h4>Highly Selective Strategy</h4>
                          <p>
                            At LIC, our first strategic pillar is the Highly
                            Selective Strategy. This approach focuses on the
                            meticulous selection of the finest aspects within
                            the educational sector. We choose only the best
                            learning programs and resources, ensuring our school
                            campus and facilities meet the highest standards.
                            Similarly, we carefully select our employees, staff,
                            students, families, vendors, and suppliers to
                            cultivate an elite educational community that stands
                            out for its quality and commitment to excellence.
                          </p>
                        </div>
                      </div>
                      <div className="col">
                        <div className="value-card">
                          <div className="value-icon">
                            <i className="bi bi-people" />
                          </div>
                          <h4>High Achievers Support Strategy</h4>
                          <p>
                            Our second strategic initiative is the High
                            Achievers Support Strategy. This strategy is
                            designed to inspire and empower our staff and
                            students, as well as all members of our team, to
                            attain exceptional levels of achievement. By
                            fostering an environment that encourages peak
                            performance, we continuously enhance the quality of
                            our educational offerings and reinforce Leaders
                            International School’s position as a benchmark
                            within the educational services sector.
                          </p>
                        </div>
                      </div>
                      <div className="col">
                        <div className="value-card">
                          <div className="value-icon">
                            <i className="bi bi-lightbulb" />
                          </div>
                          <h4>Blue Ocean Strategy</h4>
                          <p>
                            The third cornerstone of our strategic framework is
                            the Blue Ocean Strategy. This approach positions our
                            schools uniquely, focusing on collaboration over
                            competition within the educational market. By
                            adopting this strategy, Leaders International School
                            distinguishes itself as the sole institution in
                            Egypt to offer students a dual certification—the IB
                            and American Diploma—through a singular, accredited
                            curriculum. This innovative offering not only sets
                            our students apart but also reinforces our school's
                            unique status in the education landscape.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* /History Section */}
          {/* Leadership Section */}
          <section id="leadership" className="leadership section">
            <div className="container" data-aos="fade-up" data-aos-delay={100}>
              {/* Governance Block */}
              <div className="row mb-5">
                <div
                  className="col-lg-6"
                  data-aos="fade-right"
                  data-aos-delay={200}
                >
                  <h3 className="section-subtitle">Why Leaders</h3>
                  <h2 className="section-heading">Governance</h2>
                  <p className="section-description">
                    At LIC, our governance is underpinned by a board of trustees
                    and shareholders who bring a rich tapestry of experience and
                    success from various sectors. Our leaders have deep roots in
                    manufacturing, trading, tourism, hospitality, and real
                    estate, with their expertise spanning across Egypt and
                    extending into the dynamic business landscapes of the UAE.
                    This diverse background enriches our school’s strategic
                    direction, as our governance body draws upon a broad
                    spectrum of industries to innovate and excel in educational
                    practices. The board's collective vision focuses on
                    expanding our educational endeavors across the MENA region,
                    driven by a commitment to excellence and innovation.
                    Together, they are dedicated to shaping the future of
                    education, ensuring that LIC continues to offer outstanding
                    educational experiences that prepare our students to thrive
                    in a vibrant and ever-changing world.
                  </p>
                  <div className="stats-container mt-4">
                    <div className="row">
                      <div className="col-md-4 col-6">
                        <div className="stat-item">
                          <h3>10+</h3>
                          <p>Years of Excellence</p>
                        </div>
                      </div>
                      <div className="col-md-4 col-6">
                        <div className="stat-item">
                          <h3>60+</h3>
                          <p>Faculty Members</p>
                        </div>
                      </div>
                      <div className="col-md-4 col-6">
                        <div className="stat-item">
                          <h3>99%</h3>
                          <p>Student Success</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Governance Image */}
                <div
                  className="col-lg-6"
                  data-aos="fade-left"
                  data-aos-delay={300}
                >
                  <div className="about-image">
                    <img
                      src="assets/img/education/Governance.JPG"
                      alt="Our Leadership Team"
                      className="img-fluid rounded"
                    />
                  </div>
                </div>
              </div>
              {/* IB Learner Profile Block */}
              <div className="row align-items-center g-5 mt-5">
                <div
                  className="col-lg-6"
                  data-aos="fade-right"
                  data-aos-delay={200}
                >
                  <h3 className="section-subtitle">Why Leaders</h3>
                  <h2 className="section-heading">IB Learner Profile</h2>
                  <p className="section-description">
                    Our adoption of the International Baccalaureate (IB)
                    framework is central to our educational philosophy. The IB
                    Learner Profile represents a broad range of human capacities
                    and responsibilities that go beyond academic success. These
                    are the qualities that we nurture in our students to prepare
                    them for personal and professional success in a global
                    society.
                  </p>
                  <ul className="section-description ps-3">
                    <li>
                      <strong>Inquirers:</strong> Curious and enthusiastic about
                      learning, nurturing a love for discovery and inquiry
                      skills.
                    </li>
                    <li>
                      <strong>Knowledgeable:</strong> Gaining deep understanding
                      across important global and interdisciplinary concepts.
                    </li>
                    <li>
                      <strong>Thinkers:</strong> Applying critical and creative
                      thinking to solve complex problems ethically and
                      effectively.
                    </li>
                    <li>
                      <strong>Communicators:</strong> Expressing ideas clearly
                      and listening thoughtfully in multiple languages and
                      formats.
                    </li>
                    <li>
                      <strong>Principled:</strong> Acting with honesty,
                      fairness, and respect for individuals and communities.
                    </li>
                    <li>
                      <strong>Open-minded:</strong> Appreciating diverse
                      cultures, perspectives, and traditions while being open to
                      growth.
                    </li>
                    <li>
                      <strong>Caring:</strong> Demonstrating empathy,
                      compassion, and a commitment to service and making a
                      difference.
                    </li>
                    <li>
                      <strong>Risk-takers:</strong> Embracing new challenges
                      with confidence and resilience in unfamiliar situations.
                    </li>
                    <li>
                      <strong>Balanced:</strong> Valuing physical, emotional,
                      and intellectual well-being for a healthy, fulfilling
                      life.
                    </li>
                    <li>
                      <strong>Reflective:</strong> Thoughtfully considering
                      personal growth, experiences, strengths, and areas for
                      improvement.
                    </li>
                  </ul>
                  <p className="section-description">
                    Through the IB Learner Profile, LIC fosters an educational
                    environment that emphasizes both academic excellence and
                    holistic development. Our goal is to shape globally-minded
                    individuals who contribute to a more peaceful and
                    sustainable world.
                  </p>
                </div>
                {/* IB Profile Image */}
                <div
                  className="col-lg-6"
                  data-aos="zoom-in"
                  data-aos-delay={300}
                >
                  <div className="about-image">
                    <img
                      src="assets/img/education/LearnerProfile.JPG"
                      alt="IB Learner Profile"
                      className="img-fluid rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* /Leadership Section */}
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
                Designed by{" "}
                <a href="https://bootstrapmade.com/">BootstrapMade</a>
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
        </main>
      </div>
    </>
  );
}
