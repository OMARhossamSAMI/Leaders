// src/app/campus-facilities/page.tsx

"use client"; // ✅ Required for useEffect in App Router

import { useEffect } from "react";

export default function CampusFacilitiesPage() {
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
        <title>Campus &amp; Facilities - LeadersIntCollege</title>
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
              <h1>Campus &amp; Facilities</h1>
              <p>
                Our state-of-the-art campus offers modern facilities designed to
                support academic excellence, creativity, and student well-being.
              </p>
              <nav className="breadcrumbs">
                <ol>
                  <li>
                    <a href="/">Home</a>
                  </li>
                  <li className="current">Campus Facilities</li>
                </ol>
              </nav>
            </div>
          </div>
          {/* End Page Title */}
          {/* Campus Facilities Section */}
          <section id="campus-facilities" className="campus-facilities section">
            <div className="container" data-aos="fade-up" data-aos-delay={100}>
              {/* Introduction */}
              <div className="intro-row">
                <div className="row align-items-center">
                  <div
                    className="col-lg-6"
                    data-aos="fade-right"
                    data-aos-delay={200}
                  >
                    <div className="intro-content">
                      <h2 className="fw-bold">Campus Overview</h2>
                      <p>
                        Leaders International College is thoughtfully designed
                        to provide students with a dynamic and engaging learning
                        environment. Our focus is on maintaining ample open and
                        green spaces that enhance the educational experience,
                        creating a serene and conducive atmosphere for both
                        academic pursuits and recreational activities.
                      </p>
                      <div className="stats-container">
                        <div className="stat-item">
                          <span className="stat-number">80+</span>
                          <span className="stat-label">Classes</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-number">3+</span>
                          <span className="stat-label">Buildings</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-number">1.5K+</span>
                          <span className="stat-label">Students</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-lg-6"
                    data-aos="fade-left"
                    data-aos-delay={300}
                  >
                    <div className="intro-image-container">
                      <div className="intro-image main-image">
                        <img
                          src="assets/img/education/Campus.JPG"
                          alt="Main Campus"
                          className="img-fluid rounded"
                        />
                      </div>
                      <div className="tour-button">
                        <a
                          href="http://vrtour.leadersintcollege.com/"
                          className="btn-tour"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="bi bi-play-circle-fill" /> Virtual Tour
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Facilities Tabs */}
              <div
                className="facilities-tabs"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                <ul className="nav nav-tabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="academic-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#campus-facilities-academic"
                      type="button"
                      role="tab"
                    >
                      <i className="bi bi-book" /> Academic Environments
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="athletic-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#campus-facilities-athletic"
                      type="button"
                      role="tab"
                    >
                      <i className="bi bi-trophy" /> Sports Facilities
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="residential-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#campus-facilities-residential"
                      type="button"
                      role="tab"
                    >
                      <i className="bi bi-laptop" /> Technology Integration
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="community-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#campus-facilities-community"
                      type="button"
                      role="tab"
                    >
                      <i className="bi bi-people" /> Arts and Innovation
                    </button>
                  </li>
                </ul>
                <div className="tab-content">
                  {/* Academic Facilities Tab */}
                  <div
                    className="tab-pane fade show active"
                    id="campus-facilities-academic"
                    role="tabpanel"
                  >
                    <div className="row gy-4">
                      <div
                        className="col-md-7"
                        data-aos="fade-right"
                        data-aos-delay={100}
                      >
                        <div className="facility-highlight">
                          <div className="facility-slider">
                            <div className="facility-slide">
                              <img
                                src="assets/img/education/Class.JPG"
                                alt="Library"
                                className="img-fluid rounded"
                              />
                              <div className="slide-caption">Class Room</div>
                            </div>
                          </div>
                          <div className="facility-description">
                            <h3>Academic and Learning Environments</h3>
                            <p>
                              Our classrooms are equipped with the latest
                              interactive panels to foster a modern and
                              interactive learning experience. Each classroom is
                              designed to support student engagement and
                              facilitate innovative teaching methods.
                              Additionally, our campus features specialized
                              science labs that meet the highest safety
                              standards, equipped with essential safety
                              equipment to ensure a secure learning environment
                              for our students.
                            </p>
                            <ul className="feature-list">
                              <li>
                                <i className="bi bi-check-circle-fill" /> Modern
                                classrooms with smart technology
                              </li>
                              <li>
                                <i className="bi bi-check-circle-fill" />{" "}
                                Specialized research laboratories
                              </li>
                              <li>
                                <i className="bi bi-check-circle-fill" />{" "}
                                Collaborative study spaces
                              </li>
                              <li>
                                <i className="bi bi-check-circle-fill" />{" "}
                                Advanced technology centers
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-md-5"
                        data-aos="fade-left"
                        data-aos-delay={200}
                      >
                        <div className="facility-cards">
                          <div className="facility-card">
                            <div className="icon-container">
                              <i className="bi bi-book" />
                            </div>
                            <h4>Libraries</h4>
                            <img
                              src="assets/img/education/Lib.PNG"
                              alt="Library"
                              className="img-fluid rounded"
                              style={{
                                width: "100%",
                                height: "250px",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <div className="facility-card">
                            <div className="icon-container">
                              <i className="bi bi-flask" />
                            </div>
                            <h4>Science Labs</h4>
                            <img
                              src="assets/img/education/ziad_t.JPG"
                              alt="Library"
                              className="img-fluid rounded"
                              style={{
                                width: "100%",
                                height: "250px",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Playground Facilities Tab */}
                  <div
                    className="tab-pane fade"
                    id="campus-facilities-athletic"
                    role="tabpanel"
                  >
                    <div className="row gy-4">
                      <div
                        className="col-md-7"
                        data-aos="fade-right"
                        data-aos-delay={100}
                      >
                        <div className="facility-highlight">
                          <div className="facility-slider">
                            <div className="facility-slide">
                              <img
                                src="assets/img/education/Play.png"
                                alt="Athletic Center"
                                className="img-fluid rounded"
                              />
                              <div className="slide-caption">
                                Sports playground
                              </div>
                            </div>
                          </div>
                          <div className="facility-description">
                            <h3>Sports Facilities</h3>
                            <p>
                              At Leaders International College, we offer a
                              variety of sports facilities designed to promote
                              physical education and well-being among our
                              students. Our campus includes:
                            </p>
                            <ul className="feature-list">
                              <li>
                                <i className="bi bi-check-circle-fill" /> Shaded
                                Swimming Pool: A comfortable, shaded area that
                                allows for swimming activities in all weather
                                conditions, perfect for swim instruction and
                                leisure.
                              </li>
                              <li>
                                <i className="bi bi-check-circle-fill" /> Soccer
                                Playgrounds: Two spacious soccer fields where
                                students can practice and play, fostering
                                teamwork and physical fitness.
                              </li>
                              <li>
                                <i className="bi bi-check-circle-fill" />{" "}
                                Volleyball and Basketball Court: Well-maintained
                                courts that provide versatile spaces for both
                                volleyball and basketball, encouraging students
                                to engage in competitive and recreational
                                sports.
                              </li>
                              <li>
                                <i className="bi bi-check-circle-fill" />{" "}
                                Multipurpose Green Area: A flexible outdoor
                                space used for a variety of sports and
                                activities, adaptable for events and physical
                                education classes.
                              </li>
                              <li>
                                <i className="bi bi-check-circle-fill" />{" "}
                                Gymnastics and Gym Area: A dedicated area
                                equipped for gymnastics and general fitness,
                                supporting a wide range of physical activities
                                from strength training to flexibility exercises.
                              </li>
                            </ul>
                            <h3>Playgrounds and Green Spaces</h3>
                            <p>
                              Special attention is given to our youngest
                              learners with a playground dedicated exclusively
                              to the Early Years section. This playground is
                              equipped with age-appropriate play structures like
                              jungle gyms and sand pits, set in lush, green
                              surroundings that encourage play-based learning
                              and physical development.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-md-5"
                        data-aos="fade-left"
                        data-aos-delay={200}
                      >
                        <div className="facility-cards">
                          <div className="facility-card">
                            <div className="icon-container">
                              <i className="bi bi-water" />
                            </div>
                            <h4>Swimming Pool</h4>
                            <img
                              src="assets/img/education/Pool2.JPG"
                              alt="Library"
                              className="img-fluid rounded"
                              style={{
                                width: "100%",
                                height: "420px",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <div className="facility-card">
                            <div className="icon-container">
                              <i className="bi bi-stopwatch" />
                            </div>
                            <h4>Training Facilities</h4>
                            <img
                              src="assets/img/education/Bas.PNG"
                              alt="Library"
                              className="img-fluid rounded"
                              style={{
                                width: "100%",
                                height: "420px",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Techology Facilities Tab */}
                  <div
                    className="tab-pane fade"
                    id="campus-facilities-residential"
                    role="tabpanel"
                  >
                    <div className="row gy-4">
                      <div
                        className="col-md-7"
                        data-aos="fade-right"
                        data-aos-delay={100}
                      >
                        <div className="facility-highlight">
                          <div className="facility-slider">
                            <div className="facility-slide">
                              <img
                                src="assets/img/education/Tech1.JPG"
                                alt="Residence Hall"
                                className="img-fluid rounded"
                              />
                              <div className="slide-caption">Technology</div>
                            </div>
                          </div>
                          <div className="facility-description">
                            <h3>Technology Integration</h3>
                            <p>
                              Technology integration is central to our
                              educational approach. We operate multiple computer
                              labs that are integral to our curriculum,
                              enhancing students' learning experiences with
                              up-to-date software and hardware. Our open-source
                              software policy ensures that students can access
                              essential learning tools both on and off campus,
                              supporting continuous learning.
                            </p>
                            <ul className="feature-list">
                              <li>
                                <i className="bi bi-check-circle-fill" /> Fully
                                equipped computer labs with high-speed internet
                              </li>
                              <li>
                                <i className="bi bi-check-circle-fill" />{" "}
                                Interactive smart boards in every classroom
                              </li>
                              <li>
                                <i className="bi bi-check-circle-fill" /> Secure
                                digital platforms for student learning and
                                communication
                              </li>
                              <li>
                                <i className="bi bi-check-circle-fill" />{" "}
                                Student access to tablets and laptops for
                                digital learning
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-md-5"
                        data-aos="fade-left"
                        data-aos-delay={200}
                      >
                        <div className="facility-cards">
                          <div className="facility-card">
                            <div className="icon-container">
                              <i className="bi bi-laptop" />
                            </div>
                            <h4>ICT Lab</h4>
                            <img
                              src="assets/img/education/Tech3.png"
                              alt="Library"
                              className="img-fluid rounded"
                              style={{
                                width: "100%",
                                height: "250px",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <div className="facility-card">
                            <div className="icon-container">
                              <i className="bi bi-lightbulb" />
                            </div>
                            <h4>Visual Design Lab</h4>
                            <img
                              src="assets/img/education/Tech2.JPG"
                              alt="Library"
                              className="img-fluid rounded"
                              style={{
                                width: "100%",
                                height: "250px",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Art Inovation Facilities Tab */}
                  <div
                    className="tab-pane fade"
                    id="campus-facilities-community"
                    role="tabpanel"
                  >
                    <div className="row gy-4">
                      <div
                        className="col-md-7"
                        data-aos="fade-right"
                        data-aos-delay={100}
                      >
                        <div className="facility-highlight">
                          <div className="facility-slider">
                            <div className="facility-slide">
                              <img
                                src="assets/img/education/Art2.JPG"
                                alt="Student Center"
                                className="img-fluid rounded"
                              />
                              <div className="slide-caption">
                                Student Center
                              </div>
                            </div>
                          </div>
                          <div className="facility-description">
                            <h3>Arts and Innovation</h3>
                            <p>
                              The arts play a crucial role at Leaders
                              International College, with dedicated arts rooms
                              that provide students with the resources to
                              explore and develop their artistic skills. These
                              rooms are versatile and spacious, designed to
                              cater to a range of artistic activities, from
                              painting and sculpture to music and drama.
                            </p>
                            <ul className="feature-list">
                              <li>
                                <i className="bi bi-check-circle-fill" /> Visual
                                arts studios for painting, drawing, and
                                sculpture
                              </li>
                              <li>
                                <i className="bi bi-check-circle-fill" /> Music
                                and drama programs with performance
                                opportunities
                              </li>
                              <li>
                                <i className="bi bi-check-circle-fill" /> Design
                                and innovation labs for creative project
                                development
                              </li>
                              <li>
                                <i className="bi bi-check-circle-fill" /> Annual
                                exhibitions and showcases celebrating student
                                creativity
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-md-5"
                        data-aos="fade-left"
                        data-aos-delay={200}
                      >
                        <div className="facility-cards">
                          <div className="facility-card">
                            <div className="icon-container">
                              <i className="bi bi-brush" />
                            </div>
                            <h4>Art</h4>
                            <img
                              src="assets/img/education/Art.JPG"
                              alt="Library"
                              className="img-fluid rounded"
                              style={{
                                width: "100%",
                                height: "300px",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <div className="facility-card">
                            <div className="icon-container">
                              <i className="bi bi-lightbulb" />
                            </div>
                            <h4>Innovation</h4>
                            <img
                              src="assets/img/education/Inno.JPG"
                              alt="Library"
                              className="img-fluid rounded"
                              style={{
                                width: "100%",
                                height: "300px",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Campus Gallery */}
              <div
                className="campus-gallery-section"
                data-aos="fade-up"
                data-aos-delay={300}
              >
                <div className="gallery-grid">
                  <div
                    className="gallery-item large"
                    data-aos="zoom-in"
                    data-aos-delay={100}
                  >
                    <img
                      src="assets/img/education/Reception.JPG"
                      alt="Library"
                      className="img-fluid"
                      loading="lazy"
                    />
                    <div className="gallery-overlay">
                      <h4>Entrance</h4>
                    </div>
                  </div>
                  <div
                    className="gallery-item"
                    data-aos="zoom-in"
                    data-aos-delay={200}
                  >
                    <img
                      src="assets/img/education/bbbbb.JPG"
                      alt="Student Center"
                      className="img-fluid"
                      loading="lazy"
                    />
                    <div className="gallery-overlay">
                      <h4>Classroom</h4>
                    </div>
                  </div>
                  <div
                    className="gallery-item"
                    data-aos="zoom-in"
                    data-aos-delay={300}
                  >
                    <img
                      src="assets/img/education/Takleed.png"
                      alt="Dormitory"
                      className="img-fluid"
                      loading="lazy"
                    />
                    <div className="gallery-overlay">
                      <h4>Community</h4>
                    </div>
                  </div>
                  <div
                    className="gallery-item"
                    data-aos="zoom-in"
                    data-aos-delay={400}
                  >
                    <img
                      src="assets/img/education/Court.png"
                      alt="Study Areas"
                      className="img-fluid"
                      loading="lazy"
                    />
                    <div className="gallery-overlay">
                      <h4>Courts</h4>
                    </div>
                  </div>
                  <div
                    className="gallery-item"
                    data-aos="zoom-in"
                    data-aos-delay={500}
                  >
                    <img
                      src="assets/img/education/Stage.png"
                      alt="Sports Complex"
                      className="img-fluid"
                      loading="lazy"
                    />
                    <div className="gallery-overlay">
                      <h4>Theatre</h4>
                    </div>
                  </div>
                </div>
              </div>
              {/* Campus Map */}
              <div
                className="campus-map-section"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                <div className="row align-items-center">
                  <div
                    className="col-lg-5"
                    data-aos="fade-right"
                    data-aos-delay={100}
                  >
                    <div className="map-info">
                      <h2>Campus Map</h2>
                      <p>
                        Navigate our expansive campus with ease using our
                        interactive map. Locate buildings, facilities, and
                        services to find your way around.
                      </p>
                      <div className="map-legend">
                        <div className="legend-item">
                          <span className="marker academic" />
                          <span>
                            Main School Building – “teachers take perfect care
                            of students”
                          </span>
                        </div>
                        <div className="legend-item">
                          <span className="marker athletic" />
                          <span>
                            Playgrounds & Sports Areas – “great atmosphere”
                          </span>
                        </div>
                        <div className="legend-item">
                          <span className="marker dining" />
                          <span>
                            Cafeteria & Dining – facilities praised for growth
                            and learning
                          </span>
                        </div>
                        <div className="legend-item">
                          <span className="marker parking" />
                          <span>
                            Visitor Parking – convenient access for parents
                          </span>
                        </div>
                      </div>

                      <div className="map-highlights">
                        <p>
                          🌟{" "}
                          <em>
                            “This school is so nice … teachers take perfect care
                            of student – I totally recommend putting your child
                            in this school.”
                          </em>
                        </p>
                        <p>
                          🌟{" "}
                          <em>
                            “I love the facilities in the school! … there is a
                            lot of room to learn and grow in a great
                            atmosphere.”
                          </em>
                        </p>
                      </div>

                      <a
                        href="https://www.google.com/maps/dir/?api=1&destination=Leaders International College، 21 El Narges Services Region, Off 90th Road, Cairo Governorate 11835"
                        className="btn-map"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="bi bi-geo-alt" /> Get Directions
                      </a>
                    </div>
                  </div>
                  <div
                    className="col-lg-7"
                    data-aos="fade-left"
                    data-aos-delay={200}
                  >
                    <div className="map-container">
                      <div className="ratio ratio-16x9">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2508.1373530784062!2d31.462300996830244!3d30.016339563956866!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145822df2dd8f289%3A0xffe559c98f96503e!2sLeaders%20International%20College!5e0!3m2!1sen!2seg!4v1752150399611!5m2!1sen!2seg"
                          width={600}
                          height={450}
                          style={{ border: 0 }}
                          allowFullScreen={true}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* /Campus Facilities Section */}
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
