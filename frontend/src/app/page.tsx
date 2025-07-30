"use client";

import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import {
  X,
  GraduationCap,
  Megaphone,
  CalendarClock,
  Tag,
  Info,
  Star,
} from "lucide-react";

interface LivePopup {
  title: string;
  category: string;
  message: string;
  buttons?: string[];
  paths?: string[];
  imagePath?: string;
}
interface Testimonial {
  _id: string;
  name: string;
  role: string;
  description: string;
  profilePhoto: string;
  dateCreated: string;
}
type EventType = {
  title: string;
  description: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
};

export default function Home() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  // New state for the live popup
  const [livePopup, setLivePopup] = useState<LivePopup | null>(null);

  const [showPopup, setShowPopup] = useState(false); // Initially hidden
  const [, setImageLoaded] = useState(false);

  const router = useRouter();

  // First useEffect: Preloader
  useEffect(() => {
    const timer = setTimeout(() => {
      const preloader = document.getElementById("preloader");
      if (preloader) {
        preloader.style.display = "none";
      }
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  // Second useEffect: Fetch testimonials
  useEffect(() => {
    axios
      .get<Testimonial[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/testimonials/active`
      )
      .then((res) => setTestimonials(res.data))
      .catch((err) => console.error(err));
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, settingsRes] = await Promise.all([
          axios.get<EventType[]>(
            `${process.env.NEXT_PUBLIC_API_URL}/events/visible`
          ),
          axios.get<{ showEvents: boolean }>(
            `${process.env.NEXT_PUBLIC_API_URL}/settings/show-events`
          ),
        ]);

        if (settingsRes.data.showEvents) {
          setEvents(eventsRes.data);
        } else {
          setEvents([]); // Don't show any events if global setting is off
        }
      } catch (err) {
        console.error("Failed to fetch events or settings:", err);
      }
    };

    fetchData();
  }, []);
  // Fetch the live popup once
  useEffect(() => {
    axios
      .get<LivePopup>(`${process.env.NEXT_PUBLIC_API_URL}/popup/live/only`)
      .then((res) => {
        setLivePopup(res.data);

        // Start preloading image
        const img = new window.Image();
        img.src = `${process.env.NEXT_PUBLIC_API_URL}/${res.data.imagePath}`;
        img.onload = () => {
          setImageLoaded(true);
          setShowPopup(true); // Show popup only after image is ready
        };
      })
      .catch(() => console.error("No live popup found"));
  }, []);

  const getCategoryIcon = (category: string) => {
    const iconProps = {
      size: 48,
      color: "#26c3f0", // your theme blue
      strokeWidth: 2,
    };

    switch (category.toLowerCase()) {
      case "admission":
        return <GraduationCap {...iconProps} />;
      case "announcement":
        return <Megaphone {...iconProps} />;
      case "event":
        return <CalendarClock {...iconProps} />;
      case "discount":
        return <Tag {...iconProps} />;
      case "deadline":
        return <Info {...iconProps} />;
      default:
        return <Star {...iconProps} />;
    }
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Home - LeadersIntCollege</title>

        <meta name="description" content="" />
        <meta name="keywords" content="" />
      </Head>

      {/* =======================================================
  * Template Name: NiceSchool
  * Template URL: https://bootstrapmade.com/nice-school-bootstrap-education-template/
  * Updated: May 10 2025 with Bootstrap v5.3.6
  * Author: BootstrapMade.com
  * License: https://bootstrapmade.com/license/
  ======================================================== */}

      <main className="main">
        {livePopup && showPopup && (
          <div className="popup-overlay">
            <div className="notificationCard popup-modal">
              <div className="popup-top-bar">
                <button
                  className="icon-btn"
                  onClick={() => setShowPopup(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <p className="notificationHeading">{livePopup.title}</p>

              <div className="popupImageWrapper">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${livePopup.imagePath}`}
                  alt="Popup"
                  className="popupImage"
                />
              </div>

              <div className="popup-icon-wrapper">
                {getCategoryIcon(livePopup.category)}
              </div>

              <p className="notificationPara">{livePopup.message}</p>

              <div className="buttonContainer">
                {livePopup.buttons?.slice(0, 3).map((btnText, i) => (
                  <button
                    key={i}
                    className={i === 0 ? "AllowBtn" : "NotnowBtn"}
                    onClick={() => {
                      const path = livePopup.paths?.[i];
                      if (!path) return;
                      if (path === "/") {
                        window.location.href = "/";
                      } else {
                        router.push(path);
                      }
                    }}
                  >
                    {btnText}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section id="hero" className="hero section dark-background">
          <div className="hero-container">
            <video autoPlay muted loop playsInline className="video-background">
              <source src="assets/img/education/Video.mp4" type="video/mp4" />
            </video>
            <div className="overlay" />
            <div className="container">
              <div className="row align-items-center">
                <div
                  className="col-lg-7"
                  data-aos="zoom-out"
                  data-aos-delay={100}
                >
                  <div className="hero-content">
                    <h1>Empowering Futures Through Education</h1>
                    <p>
                      Discover Leaders International College, where education
                      meets excellence. Learn more about our mission, values,
                      and the vibrant community that shapes our future leaders.
                    </p>
                    <div className="cta-buttons">
                      <Link href="/admissions" className="btn-primary">
                        Start Your Journey
                      </Link>
                      <Link href="/curriculum" className="btn-secondary">
                        Discover Programs
                      </Link>
                    </div>
                  </div>
                </div>
                <div
                  className="col-lg-5"
                  data-aos="zoom-out"
                  data-aos-delay={200}
                >
                  <div className="stats-card">
                    <div className="stats-header">
                      <h3>Why Choose Us</h3>
                      <div className="decoration-line" />
                    </div>
                    <div className="stats-grid">
                      <div className="stat-item">
                        <div className="stat-icon">
                          <i className="bi bi-trophy-fill" />
                        </div>
                        <div className="stat-content">
                          <h4>100%</h4>
                          <p>University Enrollment Rate</p>
                        </div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-icon">
                          <i className="bi bi-globe" />
                        </div>
                        <div className="stat-content">
                          <h4>10+</h4>
                          <p>Years of Academic Excellence</p>
                        </div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-icon">
                          <i className="bi bi-mortarboard" />
                        </div>
                        <div className="stat-content">
                          <p>IB World School</p>
                        </div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-icon">
                          <i className="bi bi-building" />
                        </div>
                        <div className="stat-content">
                          <p>Personalized Learning Approach</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="event-ticker">
            <div className="container">
              <div className="row gy-4"></div>
            </div>
          </div>
        </section>
        {/* /Hero Section */}
        {/* About Section */}
        <section id="about" className="about section">
          <div className="container" data-aos="fade-up" data-aos-delay={100}>
            <div className="row mb-5">
              <div
                className="col-lg-6 pe-lg-5"
                data-aos="fade-right"
                data-aos-delay={200}
              >
                <h2 className="display-6 fw-bold mb-4">
                  Come & Join Us, <span>Leaders International Schools</span>
                </h2>
                <p className="lead mb-4">
                  Discover how our dedicated academic support and innovative
                  digital learning help every student thrive — start your
                  journey with us today.
                </p>
                <Link
                  href="/admissions"
                  className="btn"
                  style={{
                    backgroundColor: "hsl(193, 75%, 54%)",
                    border: "none",
                    color: "#fff",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "4px",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  Apply Now
                </Link>

                <div className="d-flex flex-wrap gap-4 mb-4">
                  <div className="stat-box">
                    <span className="stat-number">
                      <span
                        data-purecounter-start={0}
                        data-purecounter-end={10}
                        data-purecounter-duration={1}
                        className="purecounter"
                      />
                      +
                    </span>
                    <span className="stat-label">Years</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-number">
                      <span
                        data-purecounter-start={0}
                        data-purecounter-end={2300}
                        data-purecounter-duration={1}
                        className="purecounter"
                      />
                      +
                    </span>
                    <span className="stat-label">Students</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-number">
                      <span
                        data-purecounter-start={0}
                        data-purecounter-end={500}
                        data-purecounter-duration={1}
                        className="purecounter"
                      />
                      +
                    </span>
                    <span className="stat-label">GRADUATES</span>
                  </div>
                </div>
                <div className="d-flex align-items-center mt-4 signature-block"></div>
              </div>

              <div
                className="col-lg-6"
                data-aos="fade-left"
                data-aos-delay={300}
              >
                <div className="image-stack">
                  <div
                    className="image-stack-item image-stack-item-top"
                    data-aos="zoom-in"
                    data-aos-delay={200}
                  >
                    <Image
                      src="/assets/img/education/Wall_Logo.webp"
                      alt="Campus Life"
                      className="img-fluid rounded-4 shadow-lg"
                      width={600}
                      height={400}
                    />
                  </div>
                  <div
                    className="image-stack-item image-stack-item-bottom"
                    data-aos="zoom-in"
                    data-aos-delay={600}
                  >
                    <Image
                      src="/assets/img/education/ziad_t.JPG"
                      alt="Students"
                      className="img-fluid rounded-4 shadow-lg"
                      width={600}
                      height={400}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* /About Section */}
        {/* Featured Programs Section */}
        <section id="featured-programs" className="featured-programs section">
          {/* Section Title */}
          <div
            className="container section-title text-center mb-4"
            data-aos="fade-up"
          >
            <h2>
              <span className="d-block d-md-none">
                <br />
              </span>{" "}
              {/* Line break only on mobile */}
              Featured Programs
              <span className="d-block d-md-none">
                <br />
              </span>{" "}
              {/* Line break only on mobile */}
            </h2>
            <p>
              Explore our internationally recognized IB, American Diploma, and
              IGCSE programs designed to empower students through inquiry,
              innovation, and personalized learning.
            </p>
          </div>
          {/* End Section Title */}
          <div className="container" data-aos="fade-up" data-aos-delay={100}>
            <div
              className="isotope-layout"
              data-default-filter="*"
              data-layout="masonry"
              data-sort="original-order"
            >
              <ul
                className="program-filters isotope-filters"
                data-aos="fade-up"
                data-aos-delay={100}
              >
                <li data-filter="*" className="filter-active">
                  All Programs
                </li>
              </ul>
              <div className="row g-4 isotope-container">
                <div
                  className="col-lg-6 isotope-item filter-bachelor"
                  data-aos="zoom-in"
                  data-aos-delay={100}
                >
                  <div
                    className="program-item"
                    onClick={() => {
                      router.push("/curriculum?pyp");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="program-badge">PYP</div>
                    <div className="row g-0">
                      <div className="col-md-4">
                        <div
                          className="program-image-wrapper"
                          style={{
                            width: "100%",
                            height: "250px",
                            overflow: "hidden",
                          }}
                        >
                          <Image
                            src="/assets/img/education/PYP_New.jpeg"
                            alt="Program"
                            width={600}
                            height={400}
                            style={{
                              objectFit: "contain",
                              width: "100%",
                              height: "100%",
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="program-content">
                          <h3>Primary Years Programme</h3>
                          <p>
                            A nurturing, inquiry-based program for ages 3–12
                            that builds foundational skills, curiosity, and
                            global awareness.
                          </p>
                          <span className="program-btn">
                            Learn More <i className="bi bi-arrow-right" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Program Item */}
                <div
                  className="col-lg-6 isotope-item filter-bachelor"
                  data-aos="zoom-in"
                  data-aos-delay={200}
                  onClick={() => router.push("/curriculum?p=myp")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="program-item">
                    <div className="program-badge">MYP</div>
                    <div className="row g-0">
                      <div className="col-md-4">
                        <div
                          className="program-image-wrapper"
                          style={{
                            width: "100%",
                            height: "250px",
                            overflow: "hidden",
                          }}
                        >
                          <Image
                            src="/assets/img/education/MYP_NEW.jpeg"
                            alt="Program"
                            className="img-fluid"
                            width={600}
                            height={400}
                            style={{
                              objectFit: "contain",
                              width: "100%",
                              height: "100%",
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="program-content">
                          <h3>Middle Years Programme</h3>
                          <p>
                            A dynamic framework for students aged 11–16 that
                            connects academic learning with real-world
                            application and personal development.
                          </p>
                          <span className="program-btn">
                            Learn More <i className="bi bi-arrow-right" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Program Item */}
                <div
                  className="col-lg-6 isotope-item filter-bachelor"
                  data-aos="zoom-in"
                  data-aos-delay={300}
                  onClick={() => router.push("/curriculum?p=dp")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="program-item">
                    <div className="program-badge">DP</div>
                    <div className="row g-0">
                      <div className="col-md-4">
                        <div
                          className="program-image-wrapper"
                          style={{
                            width: "100%",
                            height: "250px",
                            overflow: "hidden",
                          }}
                        >
                          <Image
                            src="/assets/img/education/DP_NEW.jpeg"
                            alt="Program"
                            className="img-fluid"
                            width={600}
                            height={400}
                            style={{
                              objectFit: "contain",
                              width: "100%",
                              height: "100%",
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="program-content">
                          <h3>Diploma Programme</h3>
                          <p>
                            A rigorous, university-preparatory curriculum for
                            ages 16–19 that fosters critical thinking, research
                            skills, and global citizenship.
                          </p>
                          <span className="program-btn">
                            Learn More <i className="bi bi-arrow-right" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* End Program Item */}
                <div
                  className="col-lg-6 isotope-item filter-master"
                  data-aos="zoom-in"
                  data-aos-delay={100}
                  onClick={() => router.push("/curriculum?p=adp")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="program-item">
                    <div className="program-badge">ADP</div>
                    <div className="row g-0">
                      <div className="col-md-4">
                        <div
                          className="program-image-wrapper"
                          style={{
                            width: "100%",
                            height: "250px",
                            overflow: "hidden",
                          }}
                        >
                          <Image
                            src="/assets/img/education/AD_NEW.jpeg"
                            alt="Program"
                            className="img-fluid"
                            width={600}
                            height={400}
                            style={{
                              objectFit: "contain",
                              width: "100%",
                              height: "100%",
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="program-content">
                          <h3>American Diploma</h3>
                          <p>
                            A flexible, standards-based program for Grades 11–12
                            offering a well-rounded education tailored to
                            individual student goals.
                          </p>
                          <span className="program-btn">
                            Learn More <i className="bi bi-arrow-right" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* End Program Item */}
                <div
                  className="col-lg-6 isotope-item filter-certificate"
                  data-aos="zoom-in"
                  data-aos-delay={100}
                  onClick={() => router.push("/curriculum?p=igcse")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="program-item">
                    <div className="program-badge">IGCSE</div>
                    <div className="row g-0">
                      <div className="col-md-4">
                        <div className="program-image-wrapper">
                          <Image
                            src="/assets/img/education/british.jpg"
                            alt="Program"
                            className="img-fluid"
                            width={600}
                            height={400}
                          />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="program-content">
                          <h3>British Program</h3>
                          <p>
                            An internationally respected curriculum for Years
                            10–12 that emphasizes academic excellence and
                            readiness for higher education worldwide.
                          </p>
                          <span className="program-btn">
                            Learn More <i className="bi bi-arrow-right" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Program Item */}
                <div
                  className="col-lg-6 isotope-item filter-master"
                  data-aos="zoom-in"
                  data-aos-delay={200}
                  onClick={() => router.push("/curriculum?p=cb")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="program-item">
                    <div className="program-badge">CB</div>
                    <div className="row g-0">
                      <div className="col-md-4">
                        <div
                          className="program-image-wrapper"
                          style={{
                            width: "100%",
                            height: "210px",
                            overflow: "hidden",
                          }}
                        >
                          <Image
                            src="/assets/img/education/CB_NEW.jpeg"
                            alt="Program"
                            className="img-fluid"
                            width={600}
                            height={400}
                            style={{
                              objectFit: "contain",
                              width: "100%",
                              height: "100%",
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="program-content">
                          <h3>Character Building</h3>
                          <p>
                            A dedicated character education program that builds
                            moral integrity, respect, responsibility, and
                            empathy to shape principled, ethical future leaders.
                          </p>
                          <span className="program-btn">
                            Learn More <i className="bi bi-arrow-right" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Program Item */}
              </div>
            </div>
          </div>
        </section>
        {/* /Featured Programs Section */}
        {/* Students Life Block Section */}
        <section
          id="students-life-block"
          className="students-life-block section"
        >
          {/* Section Title */}
          <div
            className="container section-title text-center mb-4"
            data-aos="fade-up"
          >
            <h2>
              <span className="d-block d-md-none">
                <br />
              </span>{" "}
              {/* Line break only on mobile */}
              Students Life
              <span className="d-block d-md-none">
                <br />
              </span>{" "}
              {/* Line break only on mobile */}
            </h2>
            <p>
              Student Life at Leaders International College is vibrant,
              balanced, and designed to help every student thrive academically,
              socially, and personally.
            </p>
          </div>
          {/* End Section Title */}
          <div className="container" data-aos="fade-up" data-aos-delay={100}>
            <div className="row align-items-center gy-4">
              <div
                className="col-lg-6"
                data-aos="fade-right"
                data-aos-delay={200}
              >
                <div className="students-life-img position-relative">
                  <Image
                    src="/assets/img/education/SL3.png"
                    alt="Students Life"
                    className="img-fluid rounded-4 shadow-sm"
                    width={600}
                    height={400}
                  />
                  <div className="img-overlay">
                    <h3>Discover Campus Life</h3>
                    <Link href="/students-life" className="explore-btn">
                      Explore More <i className="bi bi-arrow-right" />
                    </Link>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-6"
                data-aos="fade-left"
                data-aos-delay={300}
              >
                <div className="students-life-content">
                  <div className="row g-4 mb-4">
                    <div
                      className="col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={200}
                    >
                      <div className="student-activity-item">
                        <div className="icon-box">
                          <i className="bi bi-people-fill" />
                        </div>
                        <h4 className="fw-bold activity-title">
                          Student Clubs
                        </h4>

                        <p>
                          Our dynamic club offerings in the PYP stage help
                          students discover new interests, build friendships,
                          and grow holistically.
                        </p>
                      </div>
                    </div>
                    <div
                      className="col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={300}
                    >
                      <div className="student-activity-item">
                        <div className="icon-box">
                          <i className="bi bi-easel-fill" />
                        </div>
                        <h4 className="fw-bold activity-title">
                          Academic & Learning Environments
                        </h4>
                        <p>
                          Our state-of-the-art classrooms and labs provide safe,
                          interactive spaces that foster curiosity,
                          collaboration, and innovation.
                        </p>
                      </div>
                    </div>
                    <div
                      className="col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={400}
                    >
                      <div className="student-activity-item">
                        <div className="icon-box">
                          <i className="bi bi-palette-fill" />
                        </div>
                        <h4 className="fw-bold activity-title">
                          Arts & Innovation
                        </h4>
                        <p>
                          We empower students to unlock their creative potential
                          through well-equipped arts rooms that encourage
                          artistic exploration and expression.
                        </p>
                      </div>
                    </div>
                    <div
                      className="col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={500}
                    >
                      <div className="student-activity-item">
                        <div className="icon-box">
                          <i className="bi bi-tree-fill" />
                        </div>
                        <h4 className="fw-bold activity-title">
                          Playgrounds and Green Spaces
                        </h4>
                        <p>
                          Safe, age-appropriate playgrounds and lush green areas
                          inspire our youngest learners to explore and grow
                          through play.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="students-life-cta"
                    data-aos="fade-up"
                    data-aos-delay={600}
                  >
                    <Link href="/students-life" className="btn btn-primary">
                      View All Student Activities
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* /Students Life Block Section */}
        {/* Stats Section */}
        <section id="stats" className="stats section">
          <div className="container" data-aos="fade-up" data-aos-delay={100}>
            <div className="row">
              <div className="col-lg-6">
                <div
                  className="stats-overview"
                  data-aos="fade-right"
                  data-aos-delay={200}
                >
                  <div
                    className="container section-title text-center mb-4"
                    data-aos="fade-up"
                  >
                    <h2>
                      <span className="d-block d-md-none">
                        <br />
                      </span>{" "}
                      {/* Line break only on mobile */}
                      Campus & Facilities
                      <span className="d-block d-md-none">
                        <br />
                      </span>{" "}
                      {/* Line break only on mobile */}
                    </h2>
                    <p className="stats-description">
                      Leaders International College’s New Cairo campus is
                      thoughtfully designed to inspire learning and personal
                      growth within a vibrant community. It features modern
                      classrooms, advanced science and IT labs, a well-stocked
                      library, art and music studios, extensive sports
                      facilities, outdoor learning spaces, and a healthy
                      cafeteria. The campus is easily accessible by road and
                      school bus services, with ample parking for visitors.
                      Safety is ensured through 24/7 security, surveillance
                      systems, and controlled access.
                    </p>
                    <div className="stats-cta">
                      <Link
                        href="/campus-facilities"
                        className="btn btn-primary"
                      >
                        Learn More
                      </Link>
                      <Link
                        href="http://vrtour.leadersintcollege.com/"
                        className="btn btn-outline"
                      >
                        Virtual Tour
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 d-flex justify-content-center align-items-center">
                <Image
                  src="/assets/img/education/CampusH.JPG"
                  alt="Our Campus"
                  width={500}
                  height={500}
                  className="img-fluid rounded-circle border shadow"
                  style={{ objectFit: "cover" }}
                  data-aos="zoom-in"
                  data-aos-delay="200"
                />
              </div>
            </div>

            {/* ✅ Campus Map directly after main row */}

            <div
              className="campus-map-section mt-5"
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
                    <div
                      className="container section-title text-center mb-4"
                      data-aos="fade-up"
                    >
                      <h2>
                        <span className="d-block d-md-none">
                          <br />
                        </span>{" "}
                        {/* Line break only on mobile */}
                        Campus Map
                        <span className="d-block d-md-none">
                          <br />
                        </span>{" "}
                        {/* Line break only on mobile */}
                      </h2>{" "}
                      <p>
                        Navigate our expansive campus with ease using our
                        interactive map. Locate buildings, facilities, and
                        services to find your way around.
                      </p>
                    </div>
                    <div className="text-center mt-4">
                      <a
                        href="https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=30.016339563956866,31.462300996830244"
                        className="custom-direction-btn"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="bi bi-geo-alt-fill"></i> Get Directions
                      </a>
                    </div>
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
                        width="600"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* /Stats Section */}
        <section id="testimonials" className="testimonials section">
          {/* Section Title */}
          <div
            className="container section-title text-center mb-4"
            data-aos="fade-up"
          >
            <h2>
              <span className="d-block d-md-none">
                <br />
              </span>{" "}
              {/* Line break only on mobile */}
              Testimonials
              <span className="d-block d-md-none">
                <br />
              </span>{" "}
              {/* Line break only on mobile */}
            </h2>
            <p>
              Hear directly from our students, parents, and staff about their
              experiences at Leaders International College.
            </p>
          </div>

          {/* End Section Title */}

          <div className="container">
            <div className="testimonial-masonry">
              {testimonials.map((t, index) => (
                <div
                  className="testimonial-item"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  key={t._id}
                >
                  <div className="testimonial-content">
                    <div className="quote-pattern">
                      <i className="bi bi-quote" />
                    </div>
                    <p>{t.description}</p>
                    <div className="client-info">
                      <div className="client-image">
                        {t.profilePhoto && (
                          <Image
                            src={t.profilePhoto}
                            alt="Client"
                            width={200} // You can adjust as needed
                            height={200}
                            className="img-fluid rounded"
                            style={{ objectFit: "cover" }}
                          />
                        )}
                      </div>
                      <div className="client-details">
                        <h3>{t.name}</h3>
                        <span className="position">{t.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section id="events" className="events section">
          <div
            className="container section-title text-center mb-4"
            data-aos="fade-up"
          >
            <h2>
              <span className="d-block d-md-none">
                <br />
              </span>{" "}
              {/* Line break only on mobile */}
              Upcoming School Events
              <span className="d-block d-md-none">
                <br />
              </span>{" "}
              {/* Line break only on mobile */}
            </h2>
            <p>
              Stay updated on the latest academic, sports, and community events
              happening soon!
            </p>
          </div>

          <div className="container" data-aos="fade-up" data-aos-delay={100}>
            {events.length > 0 ? (
              <>
                <div className="row g-4">
                  {events.map((event, index) => {
                    const start = new Date(event.date);
                    return (
                      <div className="col-lg-6" key={index}>
                        <div className="event-card">
                          <div className="event-date">
                            <span className="month">
                              {start
                                .toLocaleString("en-US", { month: "short" })
                                .toUpperCase()}
                            </span>
                            <span className="day">{start.getDate()}</span>
                            <span className="year">{start.getFullYear()}</span>
                          </div>
                          <div className="event-content">
                            <div
                              className={`event-tag ${event.category.toLowerCase()}`}
                            >
                              {event.category}
                            </div>
                            <h3>{event.title}</h3>
                            <p>{event.description}</p>
                            <div className="event-meta">
                              <div className="meta-item">
                                <i className="bi bi-clock" />
                                <span>
                                  {event.startTime} - {event.endTime}
                                </span>
                              </div>
                              <div className="meta-item">
                                <i className="bi bi-geo-alt" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                            <div className="event-actions">
                              <Link
                                href="/events"
                                className="btn-learn-more"
                                style={{
                                  display: "block",
                                  width: "44%",
                                  maxWidth: "320px",
                                  margin: "0 auto",
                                  textAlign: "center",
                                }}
                              >
                                Learn More
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="text-center mt-5">
                  <Link href="/events" className="btn-view-all">
                    View All Events
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center mt-5">
                <p style={{ fontSize: "1.2rem", color: "#999" }}>
                  No upcoming events at the moment.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* /Events Section */}
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
    </>
  );
}
