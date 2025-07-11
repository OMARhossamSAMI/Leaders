"use client";
import { useEffect } from "react";

export default function AboutPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const preloader = document.getElementById("preloader");
      if (preloader) {
        preloader.style.display = "none";
      }
    }, 150);
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
        <link href="assets/img/lic_logo.png" rel="icon" />
        <link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon" />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          href="https://fonts.gstatic.com"
          rel="preconnect"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto&family=Poppins&family=Raleway&display=swap"
          rel="stylesheet"
        />
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
        <link href="assets/css/main.css" rel="stylesheet" />

        <main className="main">
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

          <section id="campus-facilities" className="campus-facilities section">
            <div className="container" data-aos="fade-up" data-aos-delay={100}>
              <div
                className="facilities-tabs"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                <ul className="nav nav-tabs" role="tablist">
                  <li className="nav-item">
                    <button
                      className="nav-link active"
                      data-bs-toggle="tab"
                      data-bs-target="#who"
                    >
                      <i className="bi bi-people" /> Who We Are
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      data-bs-toggle="tab"
                      data-bs-target="#mission"
                    >
                      <i className="bi bi-flag" /> Mission & Vision
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      data-bs-toggle="tab"
                      data-bs-target="#strategies"
                    >
                      <i className="bi bi-diagram-3" /> Strategies
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      data-bs-toggle="tab"
                      data-bs-target="#governance"
                    >
                      <i className="bi bi-check2-circle" /> Governance
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      data-bs-toggle="tab"
                      data-bs-target="#accreditation"
                    >
                      <i className="bi bi-bullseye" /> Accreditation
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      data-bs-toggle="tab"
                      data-bs-target="#learner"
                    >
                      <i className="bi bi-eye" /> IB Learner Profile
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      data-bs-toggle="tab"
                      data-bs-target="#campus"
                    >
                      <i className="bi bi-building" /> Campus
                    </button>
                  </li>
                </ul>

                <div className="tab-content">
                  {/* === Who We Are === */}
                  <div
                    className="tab-pane fade show active"
                    id="who"
                    role="tabpanel"
                  >
                    <div className="row gy-4 align-items-center">
                      <div
                        className="col-lg-12"
                        data-aos="fade-up"
                        style={{
                          background: "#fff",
                          borderRadius: "12px",
                          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                          overflow: "hidden",
                          padding: "30px",
                        }}
                      >
                        <div className="row align-items-center">
                          {/* Image Left */}
                          <div className="col-md-5">
                            <img
                              src="assets/img/education/WHO1.JPG"
                              alt="Who We Are"
                              className="img-fluid rounded"
                              style={{
                                width: "100%",
                                height: "700px",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          {/* Text Right */}
                          <div className="col-md-7">
                            <h3 className="mb-3">Who We Are</h3>
                            <p
                              style={{
                                lineHeight: "1.8",
                                textAlign: "justify",
                              }}
                            >
                              At Leaders International College, we are a vibrant
                              community of dedicated educators, enthusiastic
                              learners, and supportive families, all committed
                              to the pursuit of educational excellence. As a
                              proud member of Leaders for Educational Services,
                              our foundation is built on over 15 years of
                              pioneering experience in the educational sector.
                              Our school is a reflection of a rich tradition of
                              academic excellence combined with innovative
                              teaching methodologies.
                            </p>
                            <p
                              style={{
                                lineHeight: "1.8",
                                textAlign: "justify",
                              }}
                            >
                              We stand as a beacon of educational innovation and
                              excellence, with a rich history spanning over a
                              decade. Founded 10 years ago, LIC is among the
                              first schools to be fully accredited for all
                              stages of the International Baccalaureate
                              <button
                                style={{
                                  background: "none",
                                  border: "none",
                                  padding: 0,
                                  textDecoration: "underline",
                                  color: "#007bff",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  (window.location.href = "/curriculum")
                                }
                              >
                                Primary Years Programme (PYP)
                              </button>
                              <button
                                style={{
                                  background: "none",
                                  border: "none",
                                  padding: 0,
                                  textDecoration: "underline",
                                  color: "#007bff",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  (window.location.href = "/curriculum")
                                }
                              >
                                ,Middle Years Programme (MYP)
                              </button>
                              , and
                              <button
                                style={{
                                  background: "none",
                                  border: "none",
                                  padding: 0,
                                  textDecoration: "underline",
                                  color: "#007bff",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  (window.location.href = "/curriculum")
                                }
                              >
                                Diploma Programme (DP)
                              </button>
                              . This prestigious recognition places us at the
                              forefront of international education, as one of
                              the oldest and most experienced IB World Schools.
                            </p>

                            <p
                              style={{
                                lineHeight: "1.8",
                                textAlign: "justify",
                              }}
                            >
                              Our commitment to the IB framework is deep-rooted
                              and evident in our approach to education, which
                              emphasizes intellectual, personal, emotional, and
                              social growth across all grade levels. We are
                              dedicated to fostering a culture of academic rigor
                              combined with a holistic educational experience
                              that prepares students to thrive in a globalized
                              world. Our educators are not only experts in their
                              fields but also advocates of the IB philosophy,
                              promoting inquiry, reflection, and critical
                              thinking among our students.
                            </p>
                            <p
                              style={{
                                lineHeight: "1.8",
                                textAlign: "justify",
                              }}
                            >
                              As we celebrate over a decade of leadership in IB
                              education, our school continues to be a place
                              where tradition meets innovation. We pride
                              ourselves on creating an inclusive, supportive,
                              and dynamic learning environment where every
                              student is encouraged to explore their potential
                              and achieve their best. Through our comprehensive
                              IB curriculum, we prepare our students not just
                              for academic success, but for lifelong learning
                              and responsible citizenship in the global
                              community.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* === Governance === */}
                  <div
                    className="tab-pane fade"
                    id="governance"
                    role="tabpanel"
                  >
                    <div className="row gy-4 align-items-center">
                      <div
                        className="col-lg-12"
                        data-aos="fade-up"
                        style={{
                          background: "#fff",
                          borderRadius: "12px",
                          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                          overflow: "hidden",
                          padding: "30px",
                        }}
                      >
                        <div className="row align-items-center">
                          {/* Image Left */}
                          <div className="col-md-5">
                            <img
                              src="assets/img/education/Governance.JPG"
                              alt="Governance"
                              className="img-fluid rounded"
                              style={{
                                width: "100%",
                                height: "auto",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          {/* Text Right */}
                          <div className="col-md-7">
                            <h3 className="mb-3">Governance</h3>
                            <p
                              style={{
                                lineHeight: "1.8",
                                textAlign: "justify",
                              }}
                            >
                              At LIC, our governance is underpinned by a board
                              of trustees and shareholders who bring a rich
                              tapestry of experience and success from various
                              sectors. Our leaders have deep roots in
                              manufacturing, trading, tourism, hospitality, and
                              real estate, with their expertise spanning across
                              Egypt and extending into the dynamic business
                              landscapes of the UAE.
                            </p>
                            <p
                              style={{
                                lineHeight: "1.8",
                                textAlign: "justify",
                              }}
                            >
                              This diverse background enriches our school’s
                              strategic direction, as our governance body draws
                              upon a broad spectrum of industries to innovate
                              and excel in educational practices. The board's
                              collective vision focuses on expanding our
                              educational endeavors across the MENA region,
                              driven by a commitment to excellence and
                              innovation.
                            </p>
                            <p
                              style={{
                                lineHeight: "1.8",
                                textAlign: "justify",
                              }}
                            >
                              Together, they are dedicated to shaping the future
                              of education, ensuring that LIC continues to offer
                              outstanding educational experiences that prepare
                              our students to thrive in a vibrant and
                              ever-changing world.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* === Accreditation === */}
                  <div
                    className="tab-pane fade"
                    id="accreditation"
                    role="tabpanel"
                  >
                    <div className="row gy-4 align-items-center">
                      <div
                        className="col-lg-12"
                        data-aos="fade-up"
                        style={{
                          background: "#fff",
                          borderRadius: "12px",
                          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                          overflow: "hidden",
                          padding: "30px",
                        }}
                      >
                        <div className="row align-items-center">
                          {/* Carousel Left */}
                          <div className="col-md-5">
                            <div
                              id="accreditationCarousel"
                              className="carousel slide rounded"
                              data-bs-ride="carousel"
                            >
                              <div className="carousel-inner">
                                <div className="carousel-item active">
                                  <img
                                    src="assets/img/education/A2.Jpeg"
                                    alt="Accreditation Slide 1"
                                    className="d-block w-100 img-fluid rounded"
                                    style={{
                                      height: "500px",
                                      objectFit: "cover",
                                    }}
                                  />
                                </div>
                                <div className="carousel-item">
                                  <img
                                    src="assets/img/education/A1.Jpeg"
                                    alt="Accreditation Slide 2"
                                    className="d-block w-100 img-fluid rounded"
                                    style={{
                                      height: "500px",
                                      objectFit: "cover",
                                    }}
                                  />
                                </div>
                                <div className="carousel-item">
                                  <img
                                    src="assets/img/education/A5.Jpeg"
                                    alt="Accreditation Slide 5"
                                    className="d-block w-100 img-fluid rounded"
                                    style={{
                                      height: "100px",
                                      objectFit: "cover",
                                    }}
                                  />
                                </div>
                                <div className="carousel-item">
                                  <img
                                    src="assets/img/education/A3.Jpeg"
                                    alt="Accreditation Slide 3"
                                    className="d-block w-100 img-fluid rounded"
                                    style={{
                                      height: "100px",
                                      objectFit: "cover",
                                    }}
                                  />
                                </div>
                                <div className="carousel-item">
                                  <img
                                    src="assets/img/education/A4.Jpeg"
                                    alt="Accreditation Slide 4"
                                    className="d-block w-100 img-fluid rounded"
                                    style={{
                                      height: "200px",
                                      objectFit: "cover",
                                    }}
                                  />
                                </div>
                                <div className="carousel-item">
                                  <img
                                    src="assets/img/education/A6.Jpeg"
                                    alt="Accreditation Slide 6"
                                    className="d-block w-100 img-fluid rounded"
                                    style={{
                                      height: "100px",
                                      objectFit: "cover",
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Optional Carousel Controls */}
                              <button
                                className="carousel-control-prev"
                                type="button"
                                data-bs-target="#accreditationCarousel"
                                data-bs-slide="prev"
                              >
                                <span
                                  className="carousel-control-prev-icon"
                                  aria-hidden="true"
                                ></span>
                                <span className="visually-hidden">
                                  Previous
                                </span>
                              </button>
                              <button
                                className="carousel-control-next"
                                type="button"
                                data-bs-target="#accreditationCarousel"
                                data-bs-slide="next"
                              >
                                <span
                                  className="carousel-control-next-icon"
                                  aria-hidden="true"
                                ></span>
                                <span className="visually-hidden">Next</span>
                              </button>
                            </div>
                          </div>

                          {/* Text Right */}
                          <div className="col-md-7">
                            <h3 className="mb-3">Accreditation</h3>
                            <p
                              style={{
                                lineHeight: "1.8",
                                textAlign: "justify",
                              }}
                            >
                              We are proud to be recognized as an IB World
                              School, fully accredited to deliver all stages of
                              the International Baccalaureate (IB) programs: the
                              Primary Years Programme (PYP), Middle Years
                              Programme (MYP), and the Diploma Programme (DP).
                              Our commitment to providing a rigorous and
                              internationally acknowledged education is further
                              demonstrated by our accreditation from Cognia for
                              the American diploma.
                            </p>
                            <p
                              style={{
                                lineHeight: "1.8",
                                textAlign: "justify",
                              }}
                            >
                              Understanding the diverse educational needs of our
                              students, we have expanded our curriculum
                              offerings to include the International General
                              Certificate of Secondary Education (IGCSE). We are
                              accredited by the British Council and hold
                              certifications from prestigious educational
                              organizations including Cambridge, Pearson, and
                              Oxford for the IGCSE program. This allows us to
                              offer a broad range of curricula, catering to
                              students seeking various academic pathways.
                            </p>
                            <p
                              style={{
                                lineHeight: "1.8",
                                textAlign: "justify",
                              }}
                            >
                              These accreditations underscore our dedication to
                              excellence in global education standards and
                              affirm our commitment to providing top-tier
                              educational opportunities to our students. At LIC,
                              we ensure that every program we offer meets the
                              highest international standards, preparing our
                              students for success in an interconnected world.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* === IB Learner === */}
                  <div className="tab-pane fade" id="learner" role="tabpanel">
                    <div className="row gy-4 align-items-center">
                      <div
                        className="col-lg-12"
                        data-aos="fade-up"
                        style={{
                          background: "#fff",
                          borderRadius: "12px",
                          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                          overflow: "hidden",
                          padding: "30px",
                        }}
                      >
                        <div className="row align-items-center">
                          {/* Image Left */}
                          <div className="col-md-5">
                            <img
                              src="assets/img/education/LearnerProfile.JPG"
                              alt="IB Learner Profile"
                              className="img-fluid rounded"
                              style={{
                                width: "10000px",
                                height: "1000px",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          {/* Text Right */}
                          <div className="col-md-7">
                            <h3 className="mb-3">IB Learner Profile</h3>
                            <p
                              style={{
                                lineHeight: "1.8",
                                textAlign: "justify",
                              }}
                            >
                              Our adoption of the International Baccalaureate
                              (IB) framework is central to our educational
                              philosophy. The IB Learner Profile represents a
                              broad range of human capacities and
                              responsibilities that go beyond academic success.
                              These are the qualities that we nurture in our
                              students to prepare them for personal and
                              professional success in a global society.
                            </p>
                            <ul
                              style={{ lineHeight: "1.8", paddingLeft: "20px" }}
                            >
                              <li>
                                <strong>Inquirers:</strong> Curious and
                                enthusiastic about learning, our students are
                                taught to nurture their love for discovery and
                                the skills needed to conduct inquiry and
                                research.
                              </li>
                              <li>
                                <strong>Knowledgeable:</strong> Students gain a
                                deep understanding of important concepts, ideas,
                                and issues that span traditional academic
                                boundaries and civilizations.
                              </li>
                              <li>
                                <strong>Thinkers:</strong> We encourage students
                                to apply thinking skills critically and
                                creatively to recognize and approach complex
                                problems, and to make reasoned, ethical
                                decisions.
                              </li>
                              <li>
                                <strong>Communicators:</strong> Students learn
                                to express themselves confidently and creatively
                                in multiple languages and forms. They also learn
                                to listen carefully to the perspectives of other
                                individuals and groups.
                              </li>
                              <li>
                                <strong>Principled:</strong> Our students act
                                with integrity and honesty, with a strong sense
                                of fairness and justice, and respect for the
                                dignity and rights of people everywhere.
                              </li>
                              <li>
                                <strong>Open-minded:</strong> Students
                                appreciate their own cultures and personal
                                histories, as well as the values and traditions
                                of others. They seek to evaluate a range of
                                points of view and are willing to grow from the
                                experience.
                              </li>
                              <li>
                                <strong>Caring:</strong> Our community
                                encourages students to show empathy, compassion,
                                and respect. They have a commitment to service
                                and act to make a positive difference in the
                                lives of others and in the world around them.
                              </li>
                              <li>
                                <strong>Risk-takers:</strong> Students approach
                                uncertainty with forethought and determination;
                                they work independently and cooperatively to
                                explore new ideas and innovative strategies.
                              </li>
                              <li>
                                <strong>Balanced:</strong> Students understand
                                the importance of balancing different aspects of
                                their lives—intellectual, physical, and
                                emotional—to achieve well-being for themselves
                                and others.
                              </li>
                              <li>
                                <strong>Reflective:</strong> They thoughtfully
                                consider the world and their own ideas and
                                experiences. Students work to understand their
                                strengths and weaknesses in order to support
                                their learning and personal development.
                              </li>
                            </ul>
                            <p
                              style={{
                                lineHeight: "1.8",
                                textAlign: "justify",
                              }}
                            >
                              Through the IB Learner Profile, LIC fosters a
                              dynamic educational environment that encourages
                              not only academic excellence but also a thriving,
                              holistic personal development. We are committed to
                              shaping global citizens who are well-prepared to
                              contribute to a more peaceful and sustainable
                              world.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* === Mission & Vision === */}
                  <div className="tab-pane fade" id="mission" role="tabpanel">
                    <div className="row gy-4 align-items-center">
                      <div
                        className="col-lg-12"
                        data-aos="fade-up"
                        style={{
                          background: "#fff",
                          borderRadius: "12px",
                          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                          overflow: "hidden",
                          padding: "30px",
                        }}
                      >
                        <div className="row align-items-center mb-5">
                          {/* Mission Image Left */}
                          <div className="col-md-5">
                            <img
                              src="assets/img/education/ac.JPG"
                              alt="Mission"
                              className="img-fluid rounded"
                              style={{
                                width: "100%",
                                height: "auto",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          {/* Mission Text Right */}
                          <div className="col-md-7">
                            <h3 className="mb-3">Mission</h3>
                            <p
                              style={{
                                lineHeight: "1.8",
                                textAlign: "justify",
                              }}
                            >
                              Leaders International College will enable its
                              students to realize their full potential through
                              providing a distinguished and comprehensive
                              educational experience that implements a unique
                              integrated international curriculum allowing
                              students to develop their skills, abilities and
                              attitudes.
                            </p>
                            <p
                              style={{
                                lineHeight: "1.8",
                                textAlign: "justify",
                              }}
                            >
                              LIC students will develop as life-long learners
                              who respect and cherish their core values and
                              beliefs while demonstrating open-mindedness and
                              tolerance. We strive to exhibit high-standard
                              performance and meet expectations of all
                              stakeholders. We will ensure that we utilize LIC
                              resources efficiently and provide a safe nurturing
                              learning environment where all stakeholders are
                              actively involved in students’ learning and
                              embrace LIC prospective goals.
                            </p>
                          </div>
                        </div>

                        <div className="row align-items-center">
                          {/* Vision Image Left */}
                          <div className="col-md-5">
                            <img
                              src="assets/img/education/Vis.JPG"
                              alt="Vision"
                              className="img-fluid rounded"
                              style={{
                                width: "100%",
                                height: "auto",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          {/* Vision Text Right */}
                          <div className="col-md-7">
                            <h3 className="mb-3">Vision</h3>
                            <p
                              style={{
                                lineHeight: "1.8",
                                textAlign: "justify",
                              }}
                            >
                              Leaders International College envisions to become
                              an exemplary educational institution in the Middle
                              East through empowering its students to become
                              well-versed, confident and capable global citizens
                              of the 21st century.
                            </p>
                            <p
                              style={{
                                lineHeight: "1.8",
                                textAlign: "justify",
                              }}
                            >
                              LIC guides a new generation of leaders in all
                              paths of life by a strong sense of identity,
                              taking pride in their culture and maintaining the
                              courage to act upon their beliefs. We are
                              dedicated to enable our students to apply their
                              talents to all aspects of life and support
                              sustainable development and innovation.
                            </p>
                            <p
                              style={{
                                lineHeight: "1.8",
                                textAlign: "justify",
                              }}
                            >
                              LIC aims to be a pioneering workplace in which its
                              collaborative community continually develops
                              curriculum, instructional strategies, and
                              approaches of assessment.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* === Campus === */}
                  <div className="tab-pane fade" id="campus" role="tabpanel">
                    <div className="row gy-4 align-items-center">
                      <div
                        className="col-lg-12"
                        data-aos="fade-up"
                        style={{
                          background: "#fff",
                          borderRadius: "12px",
                          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                          overflow: "hidden",
                          padding: "30px",
                        }}
                      >
                        <div className="row align-items-center">
                          {/* Image Left */}
                          <div className="col-md-5">
                            <img
                              src="assets/img/education/Rec.png"
                              alt="Who We Are"
                              className="img-fluid rounded"
                              style={{
                                width: "100%",
                                height: "1000px",
                                objectFit: "cover",
                              }}
                            />
                          </div>

                          {/* Text Right */}
                          <div className="col-md-7">
                            <h3 className="mb-3">Campus & Location</h3>
                            <p
                              style={{
                                lineHeight: "1.8",
                                textAlign: "justify",
                              }}
                            >
                              LIC campus is designed to foster an environment of
                              learning and personal growth. Located in the heart
                              of New Cairo, our school is situated in a vibrant
                              community that enriches the educational experience
                              of our students with a mix of cultural,
                              historical, and modern influences.
                              <a
                                href="https://yourlocationlink.com"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {" "}
                                View on Map
                              </a>
                              .
                            </p>

                            <h4 className="mt-4">Campus Features</h4>
                            <ul
                              style={{
                                lineHeight: "1.8",
                                paddingLeft: "0",
                                listStyle: "none",
                              }}
                            >
                              <li>
                                <i className="bi bi-building text-primary me-2"></i>
                                <strong>Modern Classrooms:</strong> Equipped
                                with the latest educational technology to
                                enhance learning and engagement.
                              </li>
                              <li>
                                <i className="bi bi-flask text-primary me-2"></i>
                                <strong>Science and IT Labs:</strong> Advanced
                                facilities for hands-on experiments and
                                technology integration.
                              </li>
                              <li>
                                <i className="bi bi-book text-primary me-2"></i>
                                <strong>Library:</strong> A comprehensive
                                resource center that supports research and
                                learning across all subjects and age groups.
                              </li>
                              <li>
                                <i className="bi bi-brush text-primary me-2"></i>
                                <strong>Art Studios and Music Rooms:</strong>{" "}
                                Dedicated spaces for students to explore their
                                creative talents in visual and performing arts.
                              </li>
                              <li>
                                <i className="bi bi-trophy text-primary me-2"></i>
                                <strong>Sports Facilities:</strong> Including a
                                swimming pool, gymnasium, sports fields, and
                                courts, accommodating a wide range of athletic
                                activities.
                              </li>
                              <li>
                                <i className="bi bi-tree text-primary me-2"></i>
                                <strong>Outdoor Learning Areas:</strong> Spaces
                                that encourage ecological learning and outdoor
                                activities.
                              </li>
                              <li>
                                <i className="bi bi-cup-straw text-primary me-2"></i>
                                <strong>Cafeteria:</strong> Offering healthy and
                                nutritious meal options in a comfortable dining
                                environment.
                              </li>
                            </ul>

                            <h4 className="mt-4">Access and Transportation</h4>
                            <p
                              style={{
                                lineHeight: "1.8",
                                textAlign: "justify",
                              }}
                            >
                              Our campus is easily accessible via major roadways
                              and is supported by a network of bus services that
                              ensure convenient commutes for our students and
                              staff from surrounding areas. Ample parking is
                              available for families and visitors.
                            </p>

                            <h4 className="mt-4">Safety and Security</h4>
                            <p
                              style={{
                                lineHeight: "1.8",
                                textAlign: "justify",
                              }}
                            >
                              Safety is paramount at LIC. Our campus is equipped
                              with comprehensive security measures, including
                              surveillance systems and controlled gate access.
                              Our dedicated security team is on-site 24/7 to
                              maintain a secure learning environment.
                            </p>

                            <h4 className="mt-4">Virtual Tour</h4>
                            <p
                              style={{
                                lineHeight: "1.8",
                                textAlign: "justify",
                              }}
                            >
                              We invite you to experience our campus virtually —
                              <a
                                href="http://vrtour.leadersintcollege.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {" "}
                                Take a Virtual Tour
                              </a>{" "}
                              — to explore the dynamic and supportive
                              environment that makes LIC a unique place to learn
                              and grow.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* === Strategies === */}
                  <div
                    className="tab-pane fade"
                    id="strategies"
                    role="tabpanel"
                  >
                    <div className="row gy-4 align-items-center">
                      <div
                        className="col-lg-12"
                        data-aos="fade-up"
                        style={{
                          background: "#fff",
                          borderRadius: "12px",
                          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                          overflow: "hidden",
                          padding: "30px",
                        }}
                      >
                        <div className="row align-items-center">
                          {/* Image Left */}
                          <div className="col-md-5">
                            <img
                              src="assets/img/education/Accr.JPG"
                              alt="Strategies"
                              className="img-fluid rounded"
                              style={{
                                width: "100%",
                                height: "auto",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          {/* Text Right */}
                          <div className="col-md-7">
                            <h3 className="mb-3">Strategies</h3>

                            <h5>Highly Selective Strategy</h5>
                            <p
                              style={{
                                lineHeight: "1.8",
                                textAlign: "justify",
                              }}
                            >
                              At LIC, our first strategic pillar is the Highly
                              Selective Strategy. This approach focuses on the
                              meticulous selection of the finest aspects within
                              the educational sector. We choose only the best
                              learning programs and resources, ensuring our
                              school campus and facilities meet the highest
                              standards. Similarly, we carefully select our
                              employees, staff, students, families, vendors, and
                              suppliers to cultivate an elite educational
                              community that stands out for its quality and
                              commitment to excellence.
                            </p>

                            <h5>High Achievers Support Strategy</h5>
                            <p
                              style={{
                                lineHeight: "1.8",
                                textAlign: "justify",
                              }}
                            >
                              Our second strategic initiative is the High
                              Achievers Support Strategy. This strategy is
                              designed to inspire and empower our staff and
                              students, as well as all members of our team, to
                              attain exceptional levels of achievement. By
                              fostering an environment that encourages peak
                              performance, we continuously enhance the quality
                              of our educational offerings and reinforce Leaders
                              International School’s position as a benchmark
                              within the educational services sector.
                            </p>

                            <h5>Blue Ocean Strategy</h5>
                            <p
                              style={{
                                lineHeight: "1.8",
                                textAlign: "justify",
                              }}
                            >
                              The third cornerstone of our strategic framework
                              is the Blue Ocean Strategy. This approach
                              positions our schools uniquely, focusing on
                              collaboration over competition within the
                              educational market. By adopting this strategy,
                              Leaders International School distinguishes itself
                              as the sole institution in Egypt to offer students
                              a dual certification—the IB and American
                              Diploma—through a singular, accredited curriculum.
                              This innovative offering not only sets our
                              students apart but also reinforces our school's
                              unique status in the education landscape.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
