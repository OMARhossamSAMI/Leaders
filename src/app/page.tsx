"use client";
import Image from "next/image";
import Script from "next/script";
import Head from "next/head";

import { useEffect } from "react";

export default function Home() {
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
      <header
        id="header"
        className="header d-flex align-items-center fixed-top"
      >
        <div className="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
          <a href="index.html" className="logo d-flex align-items-center">
            <img
              src="/assets/img/lic_logo.png"
              alt="School Logo"
              style={{ height: 40, marginRight: 10 }}
            />
            <h1 className="sitename">Leaders International College</h1>
          </a>
          <nav id="navmenu" className="navmenu">
            <ul>
              <li>
                <a href="#" className="active">
                  Home
                </a>
              </li>
              <li className="dropdown">
                <a href="/about">
                  <span>About Us</span>{" "}
                  <i className="bi bi-chevron-down toggle-dropdown" />
                </a>
                <ul>
                  <li>
                    <a href="/about">About Us</a>
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
        {/* Hero Section */}
        <section id="hero" className="hero section dark-background">
          <div className="hero-container">
            <video autoPlay muted loop playsInline className="video-background">
              <source
                src="/assets/img/education/video-2.mp4"
                type="video/mp4"
              />
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
                      <a href="/admissions" className="btn-primary">
                        Start Your Journey
                      </a>
                      <a href="/curriculum" className="btn-secondary">
                        Discover Programs
                      </a>
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
                          <h4>98%</h4>
                          <p>Graduate Employment</p>
                        </div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-icon">
                          <i className="bi bi-globe" />
                        </div>
                        <div className="stat-content">
                          <h4>45+</h4>
                          <p>International Partners</p>
                        </div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-icon">
                          <i className="bi bi-mortarboard" />
                        </div>
                        <div className="stat-content">
                          <h4>15:1</h4>
                          <p>Student-Faculty Ratio</p>
                        </div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-icon">
                          <i className="bi bi-building" />
                        </div>
                        <div className="stat-content">
                          <h4>120+</h4>
                          <p>Degree Programs</p>
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
                   Discover how our dedicated academic support and innovative digital learning help every student thrive — start your journey with us today.
                </p>
                <a
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
                  </a>
                <div className="d-flex flex-wrap gap-4 mb-4">
                  <div className="stat-box">
                    <span className="stat-number">
                      <span
                        data-purecounter-start={0}
                        data-purecounter-end={15}
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
                <div className="d-flex align-items-center mt-4 signature-block">
                </div>
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
                    <img
                      src="/assets/img/education/Wall_Logo.webp"
                      alt="Campus Life"
                      className="img-fluid rounded-4 shadow-lg"
                    />
                  </div>
                  <div
                    className="image-stack-item image-stack-item-bottom"
                    data-aos="zoom-in"
                    data-aos-delay={600}
                  >
                    <img
                      src="/assets/img/education/ziad_t.JPG"
                      alt="Students"
                      className="img-fluid rounded-4 shadow-lg"
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
          <div className="container section-title" data-aos="fade-up">
            <h2>Featured Programs</h2>
            <p>
              Explore our internationally recognized IB, American Diploma, and IGCSE programs designed to empower students through inquiry, innovation, and personalized learning.
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
                  <div className="program-item">
                    <div className="program-badge">PYP</div>
                    <div className="row g-0">
                      <div className="col-md-4">
                        <div className="program-image-wrapper">
                          <img
                            src="assets/img/education/pyp.jpg"
                            className="img-fluid"
                            alt="Program"
                          />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="program-content">
                          <h3>Primary Years Programme</h3>
                          <p>
                            A nurturing, inquiry-based program for ages 3–12 that builds foundational skills, curiosity, and global awareness.
                          </p>
                          <a href="#" className="program-btn">
                            <span>Learn More</span>{" "}
                            <i className="bi bi-arrow-right" />
                          </a>
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
                >
                  <div className="program-item">
                    <div className="program-badge">MYP</div>
                    <div className="row g-0">
                      <div className="col-md-4">
                        <div className="program-image-wrapper">
                          <img
                            src="assets/img/education/myp.JPG"
                            className="img-fluid"
                            alt="Program"
                          />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="program-content">
                          <h3>Middle Years Programme</h3>
                          <p>
                            A dynamic framework for students aged 11–16 that connects academic learning with real-world application and personal development.                          </p>
                          <a href="#" className="program-btn">
                            <span>Learn More</span>{" "}
                            <i className="bi bi-arrow-right" />
                          </a>
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
                >
                  <div className="program-item">
                    <div className="program-badge">DP</div>
                    <div className="row g-0">
                      <div className="col-md-4">
                        <div className="program-image-wrapper">
                          <img
                            src="assets/img/education/DP.jpeg"
                            className="img-fluid"
                            alt="Program"
                          />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="program-content">
                          <h3>Diploma Programme</h3>
                          <p>
                            A rigorous, university-preparatory curriculum for ages 16–19 that fosters critical thinking, research skills, and global citizenship.
                          </p>
                          <a href="#" className="program-btn">
                            <span>Learn More</span>{" "}
                            <i className="bi bi-arrow-right" />
                          </a>
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
                >
                  <div className="program-item">
                    <div className="program-badge">EF</div>
                    <div className="row g-0">
                      <div className="col-md-4">
                        <div className="program-image-wrapper">
                          <img
                            src="/assets/img/education/EF.png"
                            className="img-fluid"
                            alt="Program"
                          />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="program-content">
                          <h3>Empowered Futures</h3>
                          <p>
                            We equip students with the knowledge, skills, and values they need to thrive as confident, compassionate leaders in a rapidly changing world.
                          </p>
                          <a href="#" className="program-btn">
                            <span>Learn More</span>{" "}
                            <i className="bi bi-arrow-right" />
                          </a>
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
                >
                  <div className="program-item">
                    <div className="program-badge">ADP</div>
                    <div className="row g-0">
                      <div className="col-md-4">
                        <div className="program-image-wrapper">
                          <img
                            src="assets/img/education/Amer.webp"
                            className="img-fluid"
                            alt="Program"
                          />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="program-content">
                          <h3>American Diploma</h3>
                          <p>
                            A flexible, standards-based program for Grades 11–12 offering a well-rounded education tailored to individual student goals.
                          </p>
                          <a href="#" className="program-btn">
                            <span>Learn More</span>{" "}
                            <i className="bi bi-arrow-right" />
                          </a>
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
                >
                  <div className="program-item">
                    <div className="program-badge">IGCSE</div>
                    <div className="row g-0">
                      <div className="col-md-4">
                        <div className="program-image-wrapper">
                          <img
                            src="/assets/img/education/british.avif"
                            className="img-fluid"
                            alt="Program"
                          />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="program-content">
                          <h3>British Program</h3>
                          <p>
                            An internationally respected curriculum for Years 10–12 that emphasizes academic excellence and readiness for higher education worldwide.
                          </p>
                          <a href="#" className="program-btn">
                            <span>Learn More</span>{" "}
                            <i className="bi bi-arrow-right" />
                          </a>
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
          <div className="container section-title" data-aos="fade-up">
            <h2>Students Life</h2>
            <p>
              Student Life at Leaders International College is vibrant, balanced, and designed to help every student thrive academically, socially, and personally.
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
                  <img
                    src="/assets/img/education/SL3.PNG"
                    className="img-fluid rounded-4 shadow-sm"
                    alt="Students Life"
                  />
                  <div className="img-overlay">
                    <h3>Discover Campus Life</h3>
                    <a href="/students-life" className="explore-btn">
                      Explore More <i className="bi bi-arrow-right" />
                    </a>
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
                        <h4>Student Clubs</h4>
                        <p>
                          Our dynamic club offerings in the PYP stage help students discover new interests, build friendships, and grow holistically.
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
                        <h4>Academic & Learning Environments</h4>
                        <p>
                          Our state-of-the-art classrooms and labs provide safe, interactive spaces that foster curiosity, collaboration, and innovation.
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
                        <h4>Arts & Innovation</h4>
                        <p>
                          We empower students to unlock their creative potential through well-equipped arts rooms that encourage artistic exploration and expression.
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
                        <h4>Playgrounds and Green Spaces</h4>
                        <p>
                          Safe, age-appropriate playgrounds and lush green areas inspire our youngest learners to explore and grow through play.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="students-life-cta"
                    data-aos="fade-up"
                    data-aos-delay={600}
                  >
                    <a href="/students-life" className="btn btn-primary">
                      View All Student Activities
                    </a>
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
                  <div className="container section-title" data-aos="fade-up">
                    <h2>Campus & Facilities</h2>
                  </div>
                  <p className="stats-description">
                   Leaders International College’s New Cairo campus is thoughtfully designed to inspire learning and personal growth within a vibrant community. It features modern classrooms, advanced science and IT labs, a well-stocked library, art and music studios, extensive sports facilities, outdoor learning spaces, and a healthy cafeteria. The campus is easily accessible by road and school bus services, with ample parking for visitors. Safety is ensured through 24/7 security, surveillance systems, and controlled access.
                  </p>
                  <div className="stats-cta">
                    <a href="/campus-facilities" className="btn btn-primary">
                      Learn More
                    </a>
                    <a href="http://vrtour.leadersintcollege.com/" className="btn btn-outline">
                      Virtual Tour
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 d-flex justify-content-center align-items-center">
                <img
                  src="/assets/img/education/CampusH.JPG"
                  alt="Our Campus"
                  className="img-fluid rounded-circle border shadow"
                  style={{ width: '500px', height: '500px', objectFit: 'cover' }}
                  data-aos="zoom-in"
                  data-aos-delay={200}
                />
              </div>

            </div>
          </div>
        </section>
        {/* /Stats Section */}
        {/* Testimonials Section */}
        <section id="testimonials" className="testimonials section">
          {/* Section Title */}
          <div className="container section-title" data-aos="fade-up">
            <h2>Testimonials</h2>
            <p>
              Necessitatibus eius consequatur ex aliquid fuga eum quidem sint
              consectetur velit
            </p>
          </div>
          {/* End Section Title */}
          <div className="container">
            <div className="testimonial-masonry">
              <div className="testimonial-item" data-aos="fade-up">
                <div className="testimonial-content">
                  <div className="quote-pattern">
                    <i className="bi bi-quote" />
                  </div>
                  <p>
                    Implementing innovative strategies has revolutionized our
                    approach to market challenges and competitive positioning.
                  </p>
                  <div className="client-info">
                    <div className="client-image">
                      <img
                        src="/assets/img/person/person-f-7.webp"
                        alt="Client"
                      />
                    </div>
                    <div className="client-details">
                      <h3>Rachel Bennett</h3>
                      <span className="position">Strategy Director</span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="testimonial-item highlight"
                data-aos="fade-up"
                data-aos-delay={100}
              >
                <div className="testimonial-content">
                  <div className="quote-pattern">
                    <i className="bi bi-quote" />
                  </div>
                  <p>
                    Exceptional service delivery and innovative solutions have
                    transformed our business operations, leading to remarkable
                    growth and enhanced customer satisfaction across all
                    touchpoints.
                  </p>
                  <div className="client-info">
                    <div className="client-image">
                      <img
                        src="/assets/img/person/person-m-7.webp"
                        alt="Client"
                      />
                    </div>
                    <div className="client-details">
                      <h3>Daniel Morgan</h3>
                      <span className="position">Chief Innovation Officer</span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="testimonial-item"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                <div className="testimonial-content">
                  <div className="quote-pattern">
                    <i className="bi bi-quote" />
                  </div>
                  <p>
                    Strategic partnership has enabled seamless digital
                    transformation and operational excellence.
                  </p>
                  <div className="client-info">
                    <div className="client-image">
                      <img
                        src="/assets/img/person/person-f-8.webp"
                        alt="Client"
                      />
                    </div>
                    <div className="client-details">
                      <h3>Emma Thompson</h3>
                      <span className="position">Digital Lead</span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="testimonial-item"
                data-aos="fade-up"
                data-aos-delay={300}
              >
                <div className="testimonial-content">
                  <div className="quote-pattern">
                    <i className="bi bi-quote" />
                  </div>
                  <p>
                    Professional expertise and dedication have significantly
                    improved our project delivery timelines and quality metrics.
                  </p>
                  <div className="client-info">
                    <div className="client-image">
                      <img
                        src="/assets/img/person/person-m-8.webp"
                        alt="Client"
                      />
                    </div>
                    <div className="client-details">
                      <h3>Christopher Lee</h3>
                      <span className="position">Technical Director</span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="testimonial-item highlight"
                data-aos="fade-up"
                data-aos-delay={400}
              >
                <div className="testimonial-content">
                  <div className="quote-pattern">
                    <i className="bi bi-quote" />
                  </div>
                  <p>
                    Collaborative approach and industry expertise have
                    revolutionized our product development cycle, resulting in
                    faster time-to-market and increased customer engagement
                    levels.
                  </p>
                  <div className="client-info">
                    <div className="client-image">
                      <img
                        src="/assets/img/person/person-f-9.webp"
                        alt="Client"
                      />
                    </div>
                    <div className="client-details">
                      <h3>Olivia Carter</h3>
                      <span className="position">Product Manager</span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="testimonial-item"
                data-aos="fade-up"
                data-aos-delay={500}
              >
                <div className="testimonial-content">
                  <div className="quote-pattern">
                    <i className="bi bi-quote" />
                  </div>
                  <p>
                    Innovative approach to user experience design has
                    significantly enhanced our platform's engagement metrics and
                    customer retention rates.
                  </p>
                  <div className="client-info">
                    <div className="client-image">
                      <img
                        src="/assets/img/person/person-m-13.webp"
                        alt="Client"
                      />
                    </div>
                    <div className="client-details">
                      <h3>Nathan Brooks</h3>
                      <span className="position">UX Director</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* /Testimonials Section */}
        {/* Events Section */}
        <section id="events" className="events section">
          {/* Section Title */}
          <div className="container section-title" data-aos="fade-up">
            <h2>Events</h2>
            <p>
              Necessitatibus eius consequatur ex aliquid fuga eum quidem sint
              consectetur velit
            </p>
          </div>
          {/* End Section Title */}
          <div className="container" data-aos="fade-up" data-aos-delay={100}>
            <div className="event-filters mb-4">
              <div className="row justify-content-center g-3">
                <div className="col-md-4">
                  <select className="form-select">
                    <option value="all">All Months</option>
                    <option value="january">January</option>
                    <option value="february">February</option>
                    <option value="march">March</option>
                    <option value="april">April</option>
                    <option value="may">May</option>
                    <option value="june">June</option>
                    <option value="july">July</option>
                    <option value="august">August</option>
                    <option value="september">September</option>
                    <option value="october">October</option>
                    <option value="november">November</option>
                    <option value="december">December</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <select className="form-select">
                    <option value="all">All Categories</option>
                    <option value="academic">Academic</option>
                    <option value="arts">Arts</option>
                    <option value="sports">Sports</option>
                    <option value="community">Community</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="event-card">
                  <div className="event-date">
                    <span className="month">FEB</span>
                    <span className="day">15</span>
                    <span className="year">2025</span>
                  </div>
                  <div className="event-content">
                    <div className="event-tag academic">Academic</div>
                    <h3>Science Fair Exhibition</h3>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                    <div className="event-meta">
                      <div className="meta-item">
                        <i className="bi bi-clock" />
                        <span>09:00 AM - 03:00 PM</span>
                      </div>
                      <div className="meta-item">
                        <i className="bi bi-geo-alt" />
                        <span>Main Auditorium</span>
                      </div>
                    </div>
                    <div className="event-actions">
                      <a href="#" className="btn-learn-more">
                        Learn More
                      </a>
                      <a href="#" className="btn-calendar">
                        <i className="bi bi-calendar-plus" /> Add to Calendar
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="event-card">
                  <div className="event-date">
                    <span className="month">MAR</span>
                    <span className="day">10</span>
                    <span className="year">2025</span>
                  </div>
                  <div className="event-content">
                    <div className="event-tag sports">Sports</div>
                    <h3>Annual Sports Day</h3>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco
                      laboris nisi.
                    </p>
                    <div className="event-meta">
                      <div className="meta-item">
                        <i className="bi bi-clock" />
                        <span>08:30 AM - 05:00 PM</span>
                      </div>
                      <div className="meta-item">
                        <i className="bi bi-geo-alt" />
                        <span>School Playground</span>
                      </div>
                    </div>
                    <div className="event-actions">
                      <a href="#" className="btn-learn-more">
                        Learn More
                      </a>
                      <a href="#" className="btn-calendar">
                        <i className="bi bi-calendar-plus" /> Add to Calendar
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="event-card">
                  <div className="event-date">
                    <span className="month">APR</span>
                    <span className="day">22</span>
                    <span className="year">2025</span>
                  </div>
                  <div className="event-content">
                    <div className="event-tag arts">Arts</div>
                    <h3>Spring Music Concert</h3>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Excepteur sint occaecat cupidatat non proident, sunt in
                      culpa qui officia deserunt mollit.
                    </p>
                    <div className="event-meta">
                      <div className="meta-item">
                        <i className="bi bi-clock" />
                        <span>06:30 PM - 08:30 PM</span>
                      </div>
                      <div className="meta-item">
                        <i className="bi bi-geo-alt" />
                        <span>Performing Arts Center</span>
                      </div>
                    </div>
                    <div className="event-actions">
                      <a href="#" className="btn-learn-more">
                        Learn More
                      </a>
                      <a href="#" className="btn-calendar">
                        <i className="bi bi-calendar-plus" /> Add to Calendar
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="event-card">
                  <div className="event-date">
                    <span className="month">MAY</span>
                    <span className="day">8</span>
                    <span className="year">2025</span>
                  </div>
                  <div className="event-content">
                    <div className="event-tag community">Community</div>
                    <h3>Parent-Teacher Conference</h3>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla.
                    </p>
                    <div className="event-meta">
                      <div className="meta-item">
                        <i className="bi bi-clock" />
                        <span>01:00 PM - 07:00 PM</span>
                      </div>
                      <div className="meta-item">
                        <i className="bi bi-geo-alt" />
                        <span>Various Classrooms</span>
                      </div>
                    </div>
                    <div className="event-actions">
                      <a href="#" className="btn-learn-more">
                        Learn More
                      </a>
                      <a href="#" className="btn-calendar">
                        <i className="bi bi-calendar-plus" /> Add to Calendar
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-5">
              <a href="#" className="btn-view-all">
                View All Events
              </a>
            </div>
          </div>
        </section>
        {/* /Events Section */}
      </main>
      <footer id="footer" className="footer position-relative dark-background">
        <div className="container footer-top">
          <div className="row gy-4">
            <div className="col-lg-4 col-md-6 footer-about">
              <a href="#" className="logo d-flex align-items-center">
                <span className="sitename">Leaders International College</span>
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
                  <a href="/about">About us</a>
                </li>
                <li>
                  <a href="/our-staff">Our Staff</a>
                </li>
                <li>
                  <a href="/campus-facilities">Campus and facilities</a>
                </li>
                <li>
                  <a href="/admission">Admission</a>
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
    </>
  );
}
