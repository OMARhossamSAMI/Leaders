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
                      <a href="#" className="btn-primary">
                        Start Your Journey
                      </a>
                      <a href="#" className="btn-secondary">
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
                  Empowering Minds, <span>Shaping Futures</span>
                </h2>
                <p className="lead mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                  elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus
                  leo.
                </p>
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
                  <img
                    src="/assets/img/misc/signature-1.webp"
                    alt="Principal's Signature"
                    width={120}
                  />
                  <div className="ms-3">
                    <p className="mb-0 fw-bold">Dr. Alaa Ghazy</p>
                    <p className="mb-0 text-muted">CEO</p>
                  </div>
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
                    data-aos-delay={400}
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
            <div className="row mission-vision-row g-4">
              <div className="col-md-4" data-aos="fade-up" data-aos-delay={100}>
                <div className="value-card h-100">
                  <div className="card-icon">
                    <i className="bi bi-rocket-takeoff" />
                  </div>
                  <h3>Our Mission</h3>
                  <p>
                    Leaders International College empowers students through a
                    distinctive international curriculum that nurtures skills
                    and character. LIC learners grow as lifelong learners,
                    grounded in values, open-mindedness, and respect. We ensure
                    excellence, efficient use of resources, and a safe,
                    supportive environment for all.
                  </p>
                </div>
              </div>
              <div className="col-md-4" data-aos="fade-up" data-aos-delay={200}>
                <div className="value-card h-100">
                  <div className="card-icon">
                    <i className="bi bi-eye" />
                  </div>
                  <h3>Our Vision</h3>
                  <p>
                    Leaders International College strives to be a model
                    institution in the Middle East, shaping confident, capable
                    global citizens. We guide future leaders with strong
                    identity, cultural pride, and the courage to act on their
                    values. LIC fosters innovation, sustainability, and
                    continuous growth in teaching, learning, and assessment.
                  </p>
                </div>
              </div>
              <div className="col-md-4" data-aos="fade-up" data-aos-delay={300}>
                <div className="value-card h-100">
                  <div className="card-icon">
                    <i className="bi bi-star" />
                  </div>
                  <h3>Our Strategies</h3>
                  <p>
                    LIC selects only the best programs, people, and resources to
                    ensure top-quality education. We empower high achievers to
                    excel and drive continuous improvement. Our unique dual
                    IB–American Diploma offering sets LIC apart in Egypt’s
                    education sector.
                  </p>
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
              Necessitatibus eius consequatur ex aliquid fuga eum quidem sint
              consectetur velit
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
                <li data-filter=".filter-bachelor">Bachelor's</li>
                <li data-filter=".filter-master">Master's</li>
                <li data-filter=".filter-certificate">Certificates</li>
              </ul>
              <div className="row g-4 isotope-container">
                <div
                  className="col-lg-6 isotope-item filter-bachelor"
                  data-aos="zoom-in"
                  data-aos-delay={100}
                >
                  <div className="program-item">
                    <div className="program-badge">Bachelor's Degree</div>
                    <div className="row g-0">
                      <div className="col-md-4">
                        <div className="program-image-wrapper">
                          <img
                            src="/assets/img/education/education-1.webp"
                            className="img-fluid"
                            alt="Program"
                          />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="program-content">
                          <h3>Computer Science</h3>
                          <div className="program-highlights">
                            <span>
                              <i className="bi bi-clock" /> 4 Years
                            </span>
                            <span>
                              <i className="bi bi-people-fill" /> 120 Credits
                            </span>
                            <span>
                              <i className="bi bi-calendar3" /> Fall &amp;
                              Spring
                            </span>
                          </div>
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Ut elit tellus, luctus nec ullamcorper mattis,
                            pulvinar dapibus leo.
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
                    <div className="program-badge">Bachelor's Degree</div>
                    <div className="row g-0">
                      <div className="col-md-4">
                        <div className="program-image-wrapper">
                          <img
                            src="/assets/img/education/education-3.webp"
                            className="img-fluid"
                            alt="Program"
                          />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="program-content">
                          <h3>Business Administration</h3>
                          <div className="program-highlights">
                            <span>
                              <i className="bi bi-clock" /> 3 Years
                            </span>
                            <span>
                              <i className="bi bi-people-fill" /> 90 Credits
                            </span>
                            <span>
                              <i className="bi bi-calendar3" /> Fall Only
                            </span>
                          </div>
                          <p>
                            Nullam sed augue a turpis bibendum cursus.
                            Suspendisse potenti. Praesent mi diam, feugiat a
                            tincidunt at.
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
                  data-aos-delay={300}
                >
                  <div className="program-item">
                    <div className="program-badge">Bachelor's Degree</div>
                    <div className="row g-0">
                      <div className="col-md-4">
                        <div className="program-image-wrapper">
                          <img
                            src="/assets/img/education/education-5.webp"
                            className="img-fluid"
                            alt="Program"
                          />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="program-content">
                          <h3>Medical Sciences</h3>
                          <div className="program-highlights">
                            <span>
                              <i className="bi bi-clock" /> 5 Years
                            </span>
                            <span>
                              <i className="bi bi-people-fill" /> 150 Credits
                            </span>
                            <span>
                              <i className="bi bi-calendar3" /> Fall Only
                            </span>
                          </div>
                          <p>
                            Vestibulum ante ipsum primis in faucibus orci luctus
                            et ultrices posuere cubilia curae.
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
                    <div className="program-badge">Master's Degree</div>
                    <div className="row g-0">
                      <div className="col-md-4">
                        <div className="program-image-wrapper">
                          <img
                            src="/assets/img/education/education-7.webp"
                            className="img-fluid"
                            alt="Program"
                          />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="program-content">
                          <h3>Environmental Studies</h3>
                          <div className="program-highlights">
                            <span>
                              <i className="bi bi-clock" /> 2 Years
                            </span>
                            <span>
                              <i className="bi bi-people-fill" /> 60 Credits
                            </span>
                            <span>
                              <i className="bi bi-calendar3" /> Spring Only
                            </span>
                          </div>
                          <p>
                            Aenean imperdiet, erat vel consequat mollis, nunc
                            risus aliquam nunc, eget condimentum urna dui et
                            metus.
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
                    <div className="program-badge">Master's Degree</div>
                    <div className="row g-0">
                      <div className="col-md-4">
                        <div className="program-image-wrapper">
                          <img
                            src="/assets/img/education/education-9.webp"
                            className="img-fluid"
                            alt="Program"
                          />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="program-content">
                          <h3>Mechanical Engineering</h3>
                          <div className="program-highlights">
                            <span>
                              <i className="bi bi-clock" /> 2 Years
                            </span>
                            <span>
                              <i className="bi bi-people-fill" /> 64 Credits
                            </span>
                            <span>
                              <i className="bi bi-calendar3" /> Fall &amp;
                              Spring
                            </span>
                          </div>
                          <p>
                            Praesent tincidunt, massa et porttitor imperdiet,
                            lorem ex ultricies ipsum, a tempus metus eros non
                            tortor.
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
                    <div className="program-badge">Certificate</div>
                    <div className="row g-0">
                      <div className="col-md-4">
                        <div className="program-image-wrapper">
                          <img
                            src="/assets/img/education/education-2.webp"
                            className="img-fluid"
                            alt="Program"
                          />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="program-content">
                          <h3>Data Science</h3>
                          <div className="program-highlights">
                            <span>
                              <i className="bi bi-clock" /> 6 Months
                            </span>
                            <span>
                              <i className="bi bi-people-fill" /> 24 Credits
                            </span>
                            <span>
                              <i className="bi bi-calendar3" /> Year-round
                            </span>
                          </div>
                          <p>
                            Mauris sed erat in mi vestibulum commodo. Donec a
                            purus at justo facilisis imperdiet tnteger pell
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
              Necessitatibus eius consequatur ex aliquid fuga eum quidem sint
              consectetur velit
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
                    src="/assets/img/education/education-square-11.webp"
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
                          <i className="bi bi-people" />
                        </div>
                        <h4>Student Clubs</h4>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit ut aliquam purus.
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
                          <i className="bi bi-trophy" />
                        </div>
                        <h4>Sports Events</h4>
                        <p>
                          Quis nostrud exercitation ullamco laboris nisi ut
                          aliquip ex ea commodo consequat.
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
                          <i className="bi bi-music-note-beamed" />
                        </div>
                        <h4>Arts &amp; Culture</h4>
                        <p>
                          Duis aute irure dolor in reprehenderit in voluptate
                          velit esse cillum dolore.
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
                          <i className="bi bi-globe-americas" />
                        </div>
                        <h4>Global Experiences</h4>
                        <p>
                          Excepteur sint occaecat cupidatat non proident, sunt
                          in culpa qui officia.
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
                  <h2 className="stats-title">
                    Excellence in Education for Over 50 Years
                  </h2>
                  <p className="stats-description">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Mauris vel ultricies magna. Maecenas finibus convallis
                    turpis, non facilisis justo egestas in. Nulla facilisi.
                    Fusce consectetur, enim eget aliquet volutpat, lacus nulla
                    semper velit.
                  </p>
                  <div className="stats-cta">
                    <a href="#" className="btn btn-primary">
                      Learn More
                    </a>
                    <a href="#" className="btn btn-outline">
                      Virtual Tour
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div
                      className="stats-card"
                      data-aos="zoom-in"
                      data-aos-delay={300}
                    >
                      <div className="stats-icon">
                        <i className="bi bi-people-fill" />
                      </div>
                      <div className="stats-number">
                        <span
                          data-purecounter-start={0}
                          data-purecounter-end={94}
                          data-purecounter-duration={1}
                          className="purecounter"
                        />
                        %
                      </div>
                      <div className="stats-label">Graduation Rate</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div
                      className="stats-card"
                      data-aos="zoom-in"
                      data-aos-delay={400}
                    >
                      <div className="stats-icon">
                        <i className="bi bi-person-workspace" />
                      </div>
                      <div className="stats-number">
                        <span
                          data-purecounter-start={0}
                          data-purecounter-end={15}
                          data-purecounter-duration={1}
                          className="purecounter"
                        />
                        :1
                      </div>
                      <div className="stats-label">Student-Faculty Ratio</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div
                      className="stats-card"
                      data-aos="zoom-in"
                      data-aos-delay={500}
                    >
                      <div className="stats-icon">
                        <i className="bi bi-award" />
                      </div>
                      <div className="stats-number">
                        <span
                          data-purecounter-start={0}
                          data-purecounter-end={125}
                          data-purecounter-duration={1}
                          className="purecounter"
                        />
                        +
                      </div>
                      <div className="stats-label">Academic Programs</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div
                      className="stats-card"
                      data-aos="zoom-in"
                      data-aos-delay={600}
                    >
                      <div className="stats-icon">
                        <i className="bi bi-cash-stack" />
                      </div>
                      <div className="stats-number">
                        $
                        <span
                          data-purecounter-start={0}
                          data-purecounter-end={42}
                          data-purecounter-duration={1}
                          className="purecounter"
                        />
                        M
                      </div>
                      <div className="stats-label">Research Funding</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-lg-12">
                <div
                  className="achievements-gallery"
                  data-aos="fade-up"
                  data-aos-delay={700}
                >
                  <div className="row g-4">
                    <div className="col-md-4">
                      <div className="achievement-item">
                        <img
                          src="/assets/img/education/education-1.webp"
                          alt="Achievement"
                          className="img-fluid"
                        />
                        <div className="achievement-content">
                          <h4>Top-Ranked Programs</h4>
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Mauris vel ultricies magna.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="achievement-item">
                        <img
                          src="/assets/img/education/education-2.webp"
                          alt="Achievement"
                          className="img-fluid"
                        />
                        <div className="achievement-content">
                          <h4>State-of-the-Art Facilities</h4>
                          <p>
                            Maecenas finibus convallis turpis, non facilisis
                            justo egestas in. Nulla facilisi.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="achievement-item">
                        <img
                          src="/assets/img/education/education-3.webp"
                          alt="Achievement"
                          className="img-fluid"
                        />
                        <div className="achievement-content">
                          <h4>Global Alumni Network</h4>
                          <p>
                            Fusce consectetur, enim eget aliquet volutpat, lacus
                            nulla semper velit, et luctus.
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
        {/* /Stats Section */}
        {/* Recent News Section */}
        <section id="recent-news" className="recent-news section">
          {/* Section Title */}
          <div className="container section-title" data-aos="fade-up">
            <h2>Recent News</h2>
            <p>
              Necessitatibus eius consequatur ex aliquid fuga eum quidem sint
              consectetur velit
            </p>
          </div>
          {/* End Section Title */}
          <div className="container">
            <div className="row gy-4">
              <div
                className="col-xl-4 col-md-6"
                data-aos="fade-up"
                data-aos-delay={100}
              >
                <article>
                  <div className="post-img">
                    <img
                      src="/assets/img/blog/blog-post-1.webp"
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  <p className="post-category">Politics</p>
                  <h2 className="title">
                    {/* <a href="blog-details">
                      Dolorum optio tempore voluptas dignissimos
                    </a> */}
                  </h2>
                  <div className="d-flex align-items-center">
                    <img
                      src="/assets/img/person/person-f-12.webp"
                      alt=""
                      className="img-fluid post-author-img flex-shrink-0"
                    />
                    <div className="post-meta">
                      <p className="post-author">Maria Doe</p>
                      <p className="post-date">
                        <time dateTime="2022-01-01">Jan 1, 2022</time>
                      </p>
                    </div>
                  </div>
                </article>
              </div>
              {/* End post list item */}
              <div
                className="col-xl-4 col-md-6"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                <article>
                  <div className="post-img">
                    <img
                      src="/assets/img/blog/blog-post-2.webp"
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  <p className="post-category">Sports</p>
                  <h2 className="title">
                    {/* <a href="blog-details.html">
                      Nisi magni odit consequatur autem nulla dolorem
                    </a> */}
                  </h2>
                  <div className="d-flex align-items-center">
                    <img
                      src="/assets/img/person/person-f-13.webp"
                      alt=""
                      className="img-fluid post-author-img flex-shrink-0"
                    />
                    <div className="post-meta">
                      <p className="post-author">Allisa Mayer</p>
                      <p className="post-date">
                        <time dateTime="2022-01-01">Jun 5, 2022</time>
                      </p>
                    </div>
                  </div>
                </article>
              </div>
              {/* End post list item */}
              <div
                className="col-xl-4 col-md-6"
                data-aos="fade-up"
                data-aos-delay={300}
              >
                <article>
                  <div className="post-img">
                    <img
                      src="/assets/img/blog/blog-post-3.webp"
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  <p className="post-category">Entertainment</p>
                  <h2 className="title">
                    {/* <a href="blog-details.html">
                      Possimus soluta ut id suscipit ea ut in quo quia et soluta
                    </a> */}
                  </h2>
                  <div className="d-flex align-items-center">
                    <img
                      src="/assets/img/person/person-m-10.webp"
                      alt=""
                      className="img-fluid post-author-img flex-shrink-0"
                    />
                    <div className="post-meta">
                      <p className="post-author">Mark Dower</p>
                      <p className="post-date">
                        <time dateTime="2022-01-01">Jun 22, 2022</time>
                      </p>
                    </div>
                  </div>
                </article>
              </div>
              {/* End post list item */}
            </div>
            {/* End recent posts list */}
          </div>
        </section>
        {/* /Recent News Section */}
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
