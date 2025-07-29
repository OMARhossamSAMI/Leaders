"use client";
import { useEffect, useState } from "react";
import { useAboutTabs } from "../components/AboutTabsContext";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  const { aboutTab, setAboutTab } = useAboutTabs();
  const [, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const preloader = document.getElementById("preloader");
      if (preloader) {
        preloader.style.display = "none";
      }
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const carouselElement = document.getElementById("educationCarousel");
    if (!carouselElement) return;

    const onSlide = (e: Event) => {
      const customEvent = e as CustomEvent<{ to: number }>;
      setActiveIndex(customEvent.detail.to);
    };

    carouselElement.addEventListener("slide.bs.carousel", onSlide);

    return () => {
      carouselElement.removeEventListener("slide.bs.carousel", onSlide);
    };
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
              <h1>About Us</h1>
              <p>
                Empowering Future Leaders Through a Legacy of Innovation,
                Excellence, and Global Education.
              </p>
              <nav className="breadcrumbs">
                <ol>
                  <li>
                    <Link href="/">Home</Link>
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
                <div className="tab-scroll-wrapper">
                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${
                          aboutTab === "who" ? "active" : ""
                        }`}
                        onClick={() => setAboutTab("who")}
                      >
                        <i className="bi bi-people" /> Who We Are
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${
                          aboutTab === "mission" ? "active" : ""
                        }`}
                        onClick={() => setAboutTab("mission")}
                      >
                        <i className="bi bi-flag" /> Mission & Vision
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${
                          aboutTab === "strategies" ? "active" : ""
                        }`}
                        onClick={() => setAboutTab("strategies")}
                      >
                        <i className="bi bi-diagram-3" /> Strategies
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${
                          aboutTab === "governance" ? "active" : ""
                        }`}
                        onClick={() => setAboutTab("governance")}
                      >
                        <i className="bi bi-check2-circle" /> Governance
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${
                          aboutTab === "accreditation" ? "active" : ""
                        }`}
                        onClick={() => setAboutTab("accreditation")}
                      >
                        <i className="bi bi-bullseye" /> Accreditations
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${
                          aboutTab === "learner" ? "active" : ""
                        }`}
                        onClick={() => setAboutTab("learner")}
                      >
                        <i className="bi bi-eye" /> IB Learner Profile
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${
                          aboutTab === "campus" ? "active" : ""
                        }`}
                        onClick={() => setAboutTab("campus")}
                      >
                        <i className="bi bi-building" /> Campus
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="tab-content">
                  {/* === Who We Are === */}
                  <div
                    className={`tab-pane fade ${
                      aboutTab === "who" ? "show active" : ""
                    }`}
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
                          {/* Image Left (but shown last on mobile) */}
                          <div className="col-md-5 order-1 order-md-0">
                            <div
                              style={{
                                position: "relative",
                                width: "100%",
                                height: "700px",
                              }}
                            >
                              <Image
                                src="/assets/img/education/WHO1.JPG"
                                alt="Who We Are"
                                className="img-fluid rounded"
                                layout="fill"
                                objectFit="cover"
                              />
                            </div>
                          </div>
                          {/* Text Right */}
                          <div className="col-md-7 order-0 order-md-1">
                            <div
                              className="container section-title text-center mb-4"
                              data-aos="fade-up"
                            >
                              <h2>
                                <span className="d-block d-md-none">
                                  <br />
                                </span>{" "}
                                {/* Line break only on mobile */}
                                Who We Are
                                <span className="d-block d-md-none">
                                  <br />
                                </span>{" "}
                                {/* Line break only on mobile */}
                              </h2>
                              <p
                                style={{
                                  lineHeight: "1.8",
                                  textAlign: "justify",
                                }}
                              >
                                At Leaders International College, we are a
                                vibrant community of dedicated educators,
                                enthusiastic learners, and supportive families,
                                all committed to the pursuit of educational
                                excellence. As a proud member of Leaders for
                                Educational Services, our foundation is built on
                                over 15 years of pioneering experience in the
                                educational sector. Our school is a reflection
                                of a rich tradition of academic excellence
                                combined with innovative teaching methodologies.
                              </p>
                              <p
                                style={{
                                  lineHeight: "1.8",
                                  textAlign: "justify",
                                }}
                              >
                                We stand as a beacon of educational innovation
                                and excellence, with a rich history spanning
                                over a decade. Founded 10 years ago, LIC is
                                among the first schools to be fully accredited
                                for all stages of the International
                                Baccalaureate
                                <button
                                  style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    textDecoration: "underline",
                                    color: "var(--accent-color)",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    (window.location.href = "/curriculum")
                                  }
                                >
                                  _Primary Years Programme (PYP)
                                </button>
                                ,
                                <button
                                  style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    textDecoration: "underline",
                                    color: "var(--accent-color)",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    (window.location.href = "/curriculum?p=myp")
                                  }
                                >
                                  _Middle Years Programme (MYP)
                                </button>
                                , and
                                <button
                                  style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    textDecoration: "underline",
                                    color: "var(--accent-color)",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    (window.location.href = "/curriculum?p=dp")
                                  }
                                >
                                  _Diploma Programme (DP)
                                </button>
                                . This prestigious recognition places us at the
                                forefront of international education, as one of
                                the oldest and most experienced IB World
                                Schools.
                              </p>

                              <p
                                style={{
                                  lineHeight: "1.8",
                                  textAlign: "justify",
                                }}
                              >
                                Our commitment to the IB framework is
                                deep-rooted and evident in our approach to
                                education, which emphasizes intellectual,
                                personal, emotional, and social growth across
                                all grade levels. We are dedicated to fostering
                                a culture of academic rigor combined with a
                                holistic educational experience that prepares
                                students to thrive in a globalized world. Our
                                educators are not only experts in their fields
                                but also advocates of the IB philosophy,
                                promoting inquiry, reflection, and critical
                                thinking among our students.
                              </p>
                              <p
                                style={{
                                  lineHeight: "1.8",
                                  textAlign: "justify",
                                }}
                              >
                                As we celebrate over a decade of leadership in
                                IB education, our school continues to be a place
                                where tradition meets innovation. We pride
                                ourselves on creating an inclusive, supportive,
                                and dynamic learning environment where every
                                student is encouraged to explore their potential
                                and achieve their best. Through our
                                comprehensive IB curriculum, we prepare our
                                students not just for academic success, but for
                                lifelong learning and responsible citizenship in
                                the global community.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* === Governance === */}
                  <div
                    className={`tab-pane fade ${
                      aboutTab === "governance" ? "show active" : ""
                    }`}
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
                          {/* ===== Image Left on Desktop ===== */}
                          <div className="col-md-5 d-none d-md-block">
                            <Image
                              src="/assets/img/education/Governance.JPG"
                              alt="Governance"
                              className="img-fluid rounded"
                              width={1200}
                              height={800}
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "auto",
                              }}
                            />
                          </div>

                          {/* ===== Text Right / Full Width on Mobile ===== */}
                          <div className="col-md-7">
                            {/* === Title === */}
                            <div
                              className="container section-title text-center mb-4"
                              data-aos="fade-up"
                            >
                              <h2>
                                <span className="d-block d-md-none">
                                  <br />
                                </span>
                                Governance
                                <span className="d-block d-md-none">
                                  <br />
                                </span>
                              </h2>
                            </div>

                            {/* === Image on Mobile Only === */}
                            <div
                              className="mb-4 d-block d-md-none"
                              data-aos="fade-up"
                            >
                              <Image
                                src="/assets/img/education/Governance.JPG"
                                alt="Governance"
                                className="img-fluid rounded"
                                width={1200}
                                height={800}
                                style={{
                                  objectFit: "cover",
                                  width: "100%",
                                  height: "auto",
                                }}
                              />
                            </div>

                            {/* === Text === */}
                            <div data-aos="fade-up" data-aos-delay="100">
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
                                manufacturing, trading, tourism, hospitality,
                                and real estate, with their expertise spanning
                                across Egypt and extending into the dynamic
                                business landscapes of the UAE.
                              </p>
                              <p
                                style={{
                                  lineHeight: "1.8",
                                  textAlign: "justify",
                                }}
                              >
                                This diverse background enriches our school’s
                                strategic direction, as our governance body
                                draws upon a broad spectrum of industries to
                                innovate and excel in educational practices. The
                                board&apos;s collective vision focuses on
                                expanding our educational endeavors across the
                                MENA region, driven by a commitment to
                                excellence and innovation.
                              </p>
                              <p
                                style={{
                                  lineHeight: "1.8",
                                  textAlign: "justify",
                                }}
                              >
                                Together, they are dedicated to shaping the
                                future of education, ensuring that LIC continues
                                to offer outstanding educational experiences
                                that prepare our students to thrive in a vibrant
                                and ever-changing world.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* === Accreditation === */}
                  <div
                    className={`tab-pane fade ${
                      aboutTab === "accreditation" ? "show active" : ""
                    }`}
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
                          {/* ==== LEFT: Carousel (desktop), Middle on mobile ==== */}
                          <div className="col-md-5 mb-4 mb-md-0">
                            <div
                              id="educationCarousel"
                              className="carousel slide rounded"
                              data-bs-ride="carousel"
                              data-bs-interval="2000"
                            >
                              <div className="carousel-inner">
                                {[
                                  "A2.jpeg",
                                  "A1.jpeg",
                                  "A5.jpeg",
                                  "A3.jpeg",
                                  "A4.jpeg",
                                  "A6.jpeg",
                                ].map((file, idx) => {
                                  const isSmall = [
                                    "A1.jpeg",
                                    "A2.jpeg",
                                  ].includes(file);
                                  return (
                                    <div
                                      key={file}
                                      className={`carousel-item ${
                                        idx === 0 ? "active" : ""
                                      }`}
                                    >
                                      <div
                                        style={{
                                          position: "relative",
                                          height: "400px",
                                          transform: isSmall
                                            ? "scale(0.9)"
                                            : "none",
                                          transition:
                                            "transform 0.3s ease-in-out",
                                        }}
                                      >
                                        <Image
                                          src={`/assets/img/education/${file}`}
                                          alt={`Accreditation Slide ${idx + 1}`}
                                          className="d-block w-100 img-fluid rounded"
                                          layout="fill"
                                          objectFit="contain"
                                          priority={idx === 0}
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Controls */}
                              <button
                                className="carousel-control-prev"
                                type="button"
                                data-bs-target="#educationCarousel"
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
                                data-bs-target="#educationCarousel"
                                data-bs-slide="next"
                              >
                                <span
                                  className="carousel-control-next-icon"
                                  aria-hidden="true"
                                ></span>
                                <span className="visually-hidden">Next</span>
                              </button>

                              {/* Thumbnails */}
                              <div className="thumb-container d-flex justify-content-center gap-2 mt-3">
                                {[
                                  "A2.jpeg",
                                  "A1.jpeg",
                                  "A5.jpeg",
                                  "A3.jpeg",
                                  "A4.jpeg",
                                  "A6.jpeg",
                                ].map((file, idx) => (
                                  <button
                                    key={file}
                                    type="button"
                                    data-bs-target="#educationCarousel"
                                    data-bs-slide-to={idx}
                                    className={`thumb-btn border rounded ${
                                      idx === 0
                                        ? "active border-accent"
                                        : "border-secondary"
                                    }`}
                                    aria-current={
                                      idx === 0 ? "true" : undefined
                                    }
                                    aria-label={`Slide ${idx + 1}`}
                                    style={{ padding: 0 }}
                                  >
                                    <img
                                      src={`/assets/img/education/${file}`}
                                      alt={`Thumbnail ${idx + 1}`}
                                      style={{
                                        width: "55px",
                                        height: "auto",
                                        borderRadius: "4px",
                                      }}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* ==== RIGHT: Title + Text (desktop), Bottom on mobile ==== */}
                          <div className="col-md-7">
                            {/* Title */}
                            <div
                              className="container section-title text-center mb-4"
                              data-aos="fade-up"
                            >
                              <h2>
                                <span className="d-block d-md-none">
                                  <br />
                                </span>
                                Accreditations
                                <span className="d-block d-md-none">
                                  <br />
                                </span>
                              </h2>
                            </div>

                            {/* Text */}
                            <div
                              className="text-content px-2"
                              data-aos="fade-up"
                              data-aos-delay="100"
                            >
                              <p
                                style={{
                                  lineHeight: "1.8",
                                  textAlign: "justify",
                                }}
                              >
                                We are proud to be recognized as an IB World
                                School, fully accredited to deliver all stages
                                of the International Baccalaureate (IB)
                                programs: the Primary Years Programme (PYP),
                                Middle Years Programme (MYP), and the Diploma
                                Programme (DP). Our commitment to providing a
                                rigorous and internationally acknowledged
                                education is further demonstrated by our
                                accreditation from Cognia for the American
                                diploma.
                              </p>
                              <p
                                style={{
                                  lineHeight: "1.8",
                                  textAlign: "justify",
                                }}
                              >
                                Understanding the diverse educational needs of
                                our students, we have expanded our curriculum
                                offerings to include the International General
                                Certificate of Secondary Education (IGCSE). We
                                are accredited by the British Council and hold
                                certifications from prestigious educational
                                organizations including Cambridge, Pearson, and
                                Oxford for the IGCSE program.
                              </p>
                              <p
                                style={{
                                  lineHeight: "1.8",
                                  textAlign: "justify",
                                }}
                              >
                                These accreditations underscore our dedication
                                to excellence in global education standards and
                                affirm our commitment to providing top-tier
                                educational opportunities to our students. At
                                LIC, we ensure that every program we offer meets
                                the highest international standards, preparing
                                our students for success in an interconnected
                                world.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* === IB Learner === */}
                  <div
                    className={`tab-pane fade ${
                      aboutTab === "learner" ? "show active" : ""
                    }`}
                    id="learner"
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
                          {/* === Desktop Image Left === */}
                          <div className="col-md-5 d-none d-md-block">
                            <div
                              style={{ position: "relative", height: "900px" }}
                            >
                              <Image
                                src="/assets/img/education/LearnerProfile.JPG"
                                alt="IB Learner Profile"
                                className="img-fluid rounded"
                                layout="fill"
                                objectFit="cover"
                              />
                            </div>
                          </div>

                          {/* === Right Side Content === */}
                          <div className="col-md-7">
                            {/* === Title (Always on Top) === */}
                            <div
                              className="container section-title text-center mb-4"
                              data-aos="fade-up"
                            >
                              <h2>
                                <span className="d-block d-md-none">
                                  <br />
                                </span>
                                IB Learner Profile
                                <span className="d-block d-md-none">
                                  <br />
                                </span>
                              </h2>
                            </div>

                            {/* === Text === */}
                            <div data-aos="fade-up" data-aos-delay="100">
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
                                responsibilities that go beyond academic
                                success. These are the qualities that we nurture
                                in our students to prepare them for personal and
                                professional success in a global society.
                              </p>

                              <ul
                                style={{
                                  lineHeight: "1.8",
                                  paddingLeft: "20px",
                                }}
                              >
                                <li>
                                  <strong>Inquirers:</strong> Curious and
                                  enthusiastic about learning. They develop
                                  skills for inquiry and research, and learn
                                  with independence and joy.
                                </li>
                                <li>
                                  <strong>Knowledgeable:</strong> Students
                                  explore concepts, ideas, and issues that have
                                  local and global significance, acquiring
                                  in-depth knowledge across disciplines.
                                </li>
                                <li>
                                  <strong>Thinkers:</strong> We encourage
                                  critical and creative thinking to analyze
                                  problems and take initiative to make reasoned
                                  decisions.
                                </li>
                                <li>
                                  <strong>Communicators:</strong> Confidently
                                  express themselves and work effectively in
                                  collaboration, listening and speaking in more
                                  than one language.
                                </li>
                                <li>
                                  <strong>Principled:</strong> Act with
                                  integrity, honesty, and a strong sense of
                                  fairness and justice, taking responsibility
                                  for their actions.
                                </li>
                                <li>
                                  <strong>Open-minded:</strong> Appreciate their
                                  own cultures and the perspectives of others.
                                  They are open to growing from diverse
                                  experiences.
                                </li>
                                <li>
                                  <strong>Caring:</strong> Show empathy,
                                  compassion, and respect. Committed to service
                                  and making a positive difference in the lives
                                  of others and the world around them.
                                </li>
                                <li>
                                  <strong>Risk-takers:</strong> Approach
                                  uncertainty with courage and forethought. They
                                  are resourceful and resilient in the face of
                                  challenges.
                                </li>
                                <li>
                                  <strong>Balanced:</strong> Understand the
                                  importance of intellectual, physical, and
                                  emotional balance to achieve well-being for
                                  themselves and others.
                                </li>
                                <li>
                                  <strong>Reflective:</strong> Thoughtfully
                                  consider their own learning and experiences.
                                  They assess and understand their strengths and
                                  limitations for personal growth.
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
                                not only academic excellence but also a
                                thriving, holistic personal development. We are
                                committed to shaping global citizens who are
                                well-prepared to contribute to a more peaceful
                                and sustainable world.
                              </p>
                            </div>

                            {/* === Mobile Image at Bottom === */}
                            <div
                              className="mt-4 d-block d-md-none"
                              data-aos="fade-up"
                            >
                              <div
                                style={{
                                  position: "relative",
                                  height: "700px",
                                }}
                              >
                                <Image
                                  src="/assets/img/education/LearnerProfile.JPG"
                                  alt="IB Learner Profile"
                                  className="img-fluid rounded"
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* === Mission & Vision === */}
                  <div
                    className={`tab-pane fade ${
                      aboutTab === "mission" ? "show active" : ""
                    }`}
                    id="mission"
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
                        <div className="row align-items-center mb-5">
                          {/* Mission Image Left */}
                          <div className="col-md-5">
                            <Image
                              src="/assets/img/education/ac.JPG"
                              alt="Mission"
                              className="img-fluid rounded"
                              width={1200} // ⬅️ replace with actual image width
                              height={800} // ⬅️ replace with actual image height
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "auto",
                                marginBottom: "1rem",
                              }}
                            />
                          </div>
                          {/* Mission Text Right */}
                          <div className="col-md-7">
                            <div
                              className="container section-title"
                              data-aos="fade-up"
                            >
                              <h2>
                                <span className="d-block d-md-none">
                                  <br />
                                </span>{" "}
                                {/* Line break only on mobile */}
                                Mission
                                <span className="d-block d-md-none">
                                  <br />
                                </span>{" "}
                                {/* Line break only on mobile */}
                              </h2>
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
                                resources efficiently and provide a safe
                                nurturing learning environment where all
                                stakeholders are actively involved in students’
                                learning and embrace LIC prospective goals.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="row align-items-center">
                          {/* Vision Image Left */}
                          <div className="col-md-5">
                            <Image
                              src="/assets/img/education/Vis.JPG"
                              alt="Vision"
                              className="img-fluid rounded"
                              width={1200}
                              height={800}
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "auto",
                                marginBottom: "1rem",
                              }}
                            />
                          </div>
                          {/* Vision Text Right */}
                          <div className="col-md-7">
                            <div
                              className="container section-title text-center mb-4"
                              data-aos="fade-up"
                            >
                              <h2>
                                <span className="d-block d-md-none">
                                  <br />
                                </span>{" "}
                                {/* Line break only on mobile */}
                                Vision
                                <span className="d-block d-md-none">
                                  <br />
                                </span>{" "}
                                {/* Line break only on mobile */}
                              </h2>
                              <p
                                style={{
                                  lineHeight: "1.8",
                                  textAlign: "justify",
                                }}
                              >
                                Leaders International College envisions to
                                become an exemplary educational institution in
                                the Middle East through empowering its students
                                to become well-versed, confident and capable
                                global citizens of the 21st century.
                              </p>
                              <p
                                style={{
                                  lineHeight: "1.8",
                                  textAlign: "justify",
                                }}
                              >
                                LIC guides a new generation of leaders in all
                                paths of life by a strong sense of identity,
                                taking pride in their culture and maintaining
                                the courage to act upon their beliefs. We are
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
                                LIC aims to be a pioneering workplace in which
                                its collaborative community continually develops
                                curriculum, instructional strategies, and
                                approaches of assessment.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* === Campus === */}
                  <div
                    className={`tab-pane fade ${
                      aboutTab === "campus" ? "show active" : ""
                    }`}
                    id="campus"
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
                          {/* === Image Left on Desktop === */}
                          <div className="col-md-5 d-none d-md-block">
                            <div
                              style={{ position: "relative", height: "700px" }}
                            >
                              <Image
                                src="/assets/img/education/Rec.png"
                                alt="Campus & Location"
                                className="img-fluid rounded"
                                layout="fill"
                                objectFit="cover"
                              />
                            </div>
                          </div>

                          {/* === Right Content (Title + Text) === */}
                          <div className="col-md-7">
                            {/* === Title (Always on top) === */}
                            <div
                              className="container section-title text-center mb-4"
                              data-aos="fade-up"
                            >
                              <h2>
                                <span className="d-block d-md-none">
                                  <br />
                                </span>
                                Campus & Location
                                <span className="d-block d-md-none">
                                  <br />
                                </span>
                              </h2>
                            </div>
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

                            {/* === Text Details === */}
                            <div data-aos="fade-up" data-aos-delay="100">
                              <h4 style={{ color: "var(--accent-color)" }}>
                                Campus Features
                              </h4>
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
                                  with the latest educational technology.
                                </li>
                                <li>
                                  <i className="bi bi-flask text-primary me-2"></i>
                                  <strong>Science and IT Labs:</strong> Hands-on
                                  experiments and tech learning.
                                </li>
                                <li>
                                  <i className="bi bi-book text-primary me-2"></i>
                                  <strong>Library:</strong> Comprehensive
                                  research and learning resources.
                                </li>
                                <li>
                                  <i className="bi bi-brush text-primary me-2"></i>
                                  <strong>Art & Music Rooms:</strong> Explore
                                  creative talents in dedicated studios.
                                </li>
                                <li>
                                  <i className="bi bi-trophy text-primary me-2"></i>
                                  <strong>Sports Facilities:</strong> Pool,
                                  gymnasium, courts, and more.
                                </li>
                                <li>
                                  <i className="bi bi-tree text-primary me-2"></i>
                                  <strong>Outdoor Learning Areas:</strong>{" "}
                                  Nature-based and ecological education.
                                </li>
                                <li>
                                  <i className="bi bi-cup-straw text-primary me-2"></i>
                                  <strong>Cafeteria:</strong> Healthy and
                                  comfortable meal spaces.
                                </li>
                              </ul>

                              <h4 style={{ color: "var(--accent-color)" }}>
                                Access and Transportation
                              </h4>
                              <p
                                style={{
                                  lineHeight: "1.8",
                                  textAlign: "justify",
                                }}
                              >
                                Our campus is easily accessible via major
                                roadways and is supported by a network of bus
                                services. Ample parking is available for
                                families and visitors.
                              </p>

                              <h4 style={{ color: "var(--accent-color)" }}>
                                Safety and Security
                              </h4>
                              <p
                                style={{
                                  lineHeight: "1.8",
                                  textAlign: "justify",
                                }}
                              >
                                Our campus includes surveillance systems, gate
                                control, and a 24/7 on-site security team to
                                ensure student safety.
                              </p>

                              <h4 style={{ color: "var(--accent-color)" }}>
                                Virtual Tour
                              </h4>
                              <p
                                style={{
                                  lineHeight: "1.8",
                                  textAlign: "justify",
                                }}
                              >
                                Experience our campus virtually —
                                <a
                                  href="http://vrtour.leadersintcollege.com/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {" "}
                                  Take a Virtual Tour
                                </a>
                                — and explore our dynamic environment.
                              </p>
                            </div>

                            {/* === Mobile Image at Bottom === */}
                            <div
                              className="mt-4 d-block d-md-none"
                              data-aos="fade-up"
                            >
                              <div
                                style={{
                                  position: "relative",
                                  height: "700px",
                                }}
                              >
                                <Image
                                  src="/assets/img/education/Rec.png"
                                  alt="Campus & Location"
                                  className="img-fluid rounded"
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* === Strategies === */}
                  <div
                    className={`tab-pane fade ${
                      aboutTab === "strategies" ? "show active" : ""
                    }`}
                    id="strategies"
                    role="tabpanel"
                  >
                    <div className="row gy-4">
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
                          {/* Image Left (visible on md and up) */}
                          <div className="col-md-5 d-none d-md-block">
                            <Image
                              src="/assets/img/education/Accr.JPG"
                              alt="Strategies"
                              className="img-fluid rounded"
                              width={1200}
                              height={800}
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "auto",
                                marginBottom: "1rem",
                              }}
                            />
                          </div>

                          {/* Text Right (full width on mobile) */}
                          <div className="col-md-7">
                            {/* Title */}
                            <div
                              className="container section-title text-center mb-4"
                              data-aos="fade-up"
                            >
                              <h2>
                                <span className="d-block d-md-none">
                                  <br />
                                </span>
                                Strategies
                                <span className="d-block d-md-none">
                                  <br />
                                </span>
                              </h2>
                            </div>

                            {/* Text Content */}
                            <div className="col-12">
                              <h5
                                style={{
                                  color: "var(--accent-color)",
                                  fontWeight: "bold",
                                }}
                              >
                                Highly Selective Strategy
                              </h5>
                              <p
                                style={{
                                  lineHeight: "1.8",
                                  textAlign: "justify",
                                }}
                              >
                                At LIC, our first strategic pillar is the Highly
                                Selective Strategy. This approach focuses on the
                                meticulous selection of the finest aspects
                                within the educational sector. We choose only
                                the best learning programs and resources,
                                ensuring our school campus and facilities meet
                                the highest standards. Similarly, we carefully
                                select our employees, staff, students, families,
                                vendors, and suppliers to cultivate an elite
                                educational community that stands out for its
                                quality and commitment to excellence.{" "}
                              </p>

                              <h5
                                style={{
                                  color: "var(--accent-color)",
                                  fontWeight: "bold",
                                }}
                              >
                                High Achievers Support Strategy
                              </h5>
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
                                of our educational offerings and reinforce
                                Leaders International School’s position as a
                                benchmark within the educational services
                                sector.{" "}
                              </p>

                              <h5
                                style={{
                                  color: "var(--accent-color)",
                                  fontWeight: "bold",
                                }}
                              >
                                Blue Ocean Strategy
                              </h5>
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
                                Leaders International School distinguishes
                                itself as the sole institution in Egypt to offer
                                students a dual certification—the IB and
                                American Diploma—through a singular, accredited
                                curriculum. This innovative offering not only
                                sets our students apart but also reinforces our
                                school&apos;s unique status in the education
                                landscape.{" "}
                              </p>
                            </div>
                          </div>

                          {/* Image for mobile view only */}
                          <div className="col-12 d-block d-md-none mt-4">
                            <Image
                              src="/assets/img/education/Accr.JPG"
                              alt="Strategies"
                              className="img-fluid rounded"
                              width={1200}
                              height={800}
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "auto",
                                marginBottom: "1rem",
                              }}
                            />
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

        <div id="preloader" />
      </div>
    </>
  );
}
