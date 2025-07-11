// src/app/curriculum/page.tsx

"use client"; // ✅ Needed for useEffect in App Router

import { useEffect } from "react";
import { useCurriculum } from "../components/CurriculumContext";

export default function CurriculumPage() {
  const { curriculumTab, setCurriculumTab } = useCurriculum();
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
        <title>Curriculum - LeadersIntCollege</title>
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
              <h1>Curriculum</h1>
              <p>
                Our curriculum inspires students to explore, inquire, and
                connect learning to real-world experiences.
              </p>
              <nav className="breadcrumbs">
                <ol>
                  <li>
                    <a href="index">Home</a>
                  </li>
                  <li className="current">Curriculum</li>
                </ol>
              </nav>
            </div>
          </div>
          {/* End Page Title */}
          {/* Academics Section */}
          <section id="academics" className="academics section">
            <div className="container" data-aos="fade-up" data-aos-delay={100}>
              <div
                className="programs-navigation"
                data-aos="fade-up"
                data-aos-delay={100}
              >
                <div className="row">
                  <div className="col-12">
                    <div className="program-tabs">
                      <ul
                        className="nav nav-tabs justify-content-center"
                        role="tablist"
                      >
                        <li className="nav-item" role="presentation">
                          <button
                            className={`nav-link ${
                              curriculumTab === "pyp" ? "active" : ""
                            }`}
                            onClick={() => setCurriculumTab("pyp")}
                            type="button"
                            role="tab"
                          >
                            <span className="icon">
                              <i className="bi bi-book" />
                            </span>
                            <span className="text">PYP</span>
                          </button>
                        </li>

                        <li className="nav-item" role="presentation">
                          <button
                            className={`nav-link ${
                              curriculumTab === "myp" ? "active" : ""
                            }`}
                            onClick={() => setCurriculumTab("myp")}
                            type="button"
                            role="tab"
                          >
                            <span className="icon">
                              <i className="bi bi-award" />
                            </span>
                            <span className="text">MYP</span>
                          </button>
                        </li>

                        <li className="nav-item" role="presentation">
                          <button
                            className={`nav-link ${
                              curriculumTab === "dp" ? "active" : ""
                            }`}
                            onClick={() => setCurriculumTab("dp")}
                            type="button"
                            role="tab"
                          >
                            <span className="icon">
                              <i className="bi bi-mortarboard" />
                            </span>
                            <span className="text">DP</span>
                          </button>
                        </li>

                        <li className="nav-item" role="presentation">
                          <button
                            className={`nav-link ${
                              curriculumTab === "american" ? "active" : ""
                            }`}
                            onClick={() => setCurriculumTab("american")}
                            type="button"
                            role="tab"
                          >
                            <span className="icon">
                              <i className="bi bi-globe-americas" />
                            </span>
                            <span className="text">American Diploma</span>
                          </button>
                        </li>

                        <li className="nav-item" role="presentation">
                          <button
                            className={`nav-link ${
                              curriculumTab === "igcse" ? "active" : ""
                            }`}
                            onClick={() => setCurriculumTab("igcse")}
                            type="button"
                            role="tab"
                          >
                            <span className="icon">
                              <i className="bi bi-journal-bookmark" />
                            </span>
                            <span className="text">IGCSE</span>
                          </button>
                        </li>

                        <li className="nav-item" role="presentation">
                          <button
                            className={`nav-link ${
                              curriculumTab === "character" ? "active" : ""
                            }`}
                            onClick={() => setCurriculumTab("character")}
                            type="button"
                            role="tab"
                          >
                            <span className="icon">
                              <i className="bi bi-grid-3x3-gap" />
                            </span>
                            <span className="text">Character Building</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="tab-content programs-content"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                {/* CHARACTER BUILDING */}
                <div
                  className={`tab-pane fade ${
                    curriculumTab === "character" ? "show active" : ""
                  }`}
                  id="academics-all"
                  role="tabpanel"
                >
                  <div className="bg-light p-4 rounded shadow-sm my-4">
                    <div className="section-header text-center">
                      <h3>Character Building</h3>
                      <p>
                        At Leaders International College, character building is
                        not just an element of education—it is central to our
                        mission and a fundamental part of our school's values.
                        We believe that true education extends beyond academic
                        excellence to include the development of moral integrity
                        and strong character.
                      </p>
                      <p>
                        LIC places a strong emphasis on character education as a
                        distinct part of our curriculum. This program is
                        designed to foster respect, responsibility, integrity,
                        and empathy, preparing our students to be principled and
                        ethical leaders in whatever fields they choose to
                        pursue.
                      </p>
                    </div>

                    <div className="row g-4">
                      {/* Program Item 1 */}
                      <div className="col-lg-4 col-md-6" data-aos="zoom-in">
                        <div className="program-item graduate">
                          <div className="program-header">
                            <div className="program-icon">
                              <i className="bi bi-globe2"></i>
                            </div>
                            <span className="program-type">Character</span>
                          </div>
                          <div className="program-body">
                            <h3>Integrated Curriculum</h3>
                            <p>
                              Our character-building program is seamlessly
                              integrated into every aspect of school life. From
                              the classroom to extracurricular activities, we
                              incorporate lessons and projects that challenge
                              students to develop personal virtues and social
                              skills. These activities are tailored to reinforce
                              the values of honesty, courage, perseverance, and
                              public service.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Program Item 2 */}
                      <div className="col-lg-4 col-md-6" data-aos="zoom-in">
                        <div className="program-item graduate">
                          <div className="program-header">
                            <div className="program-icon">
                              <i className="bi bi-heart-fill"></i>
                            </div>
                            <span className="program-type">Character</span>
                          </div>
                          <div className="program-body">
                            <h3>Lifelong Impact</h3>
                            <p>
                              We are committed to nurturing not only
                              intellectually accomplished students but also
                              compassionate individuals who are ready to
                              contribute positively to their communities and the
                              world. The character building experiences at
                              Leaders International College equip students with
                              the moral compass necessary to navigate the
                              complexities of modern life with confidence and
                              integrity.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Program Item 3 */}
                      <div className="col-lg-4 col-md-6" data-aos="zoom-in">
                        <div className="program-item graduate">
                          <div className="program-header">
                            <div className="program-icon">
                              <i className="bi bi-check-circle-fill"></i>
                            </div>
                            <span className="program-type">Character</span>
                          </div>
                          <div className="program-body">
                            <h3>Character Building Conclusion</h3>
                            <p>
                              Character building at Leaders International
                              College represents our dedication to nurturing the
                              whole student. By prioritizing these values, we
                              ensure that our graduates emerge not only as
                              scholars but also as well-rounded individuals who
                              are respected for their character and leadership.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PYP Tab */}
                <div
                  className={`tab-pane fade ${
                    curriculumTab === "pyp" ? "show active" : ""
                  }`}
                  id="academics-undergraduate"
                  role="tabpanel"
                >
                  <div className="row g-4">
                    <div className="bg-light p-4 rounded shadow-sm my-4">
                      <div className="section-header text-center">
                        <h3>PYP - Primary Years Programme</h3>
                        <p>
                          At Leaders International College, our Primary Years
                          Programme (PYP) is tailored for young learners from
                          the preschool years through to elementary,
                          encompassing ages 3 to 12. This programme is dedicated
                          to nurturing active, caring, lifelong learners who
                          demonstrate respect for themselves and others, and it
                          emphasizes a multicultural understanding and a dynamic
                          educational approach.
                        </p>
                      </div>
                    </div>
                    {/* Program Item */}
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={200}
                    >
                      <div className="program-item graduate">
                        <div className="program-header">
                          <div className="program-icon">
                            <i className="bi bi-globe2" />
                          </div>
                          <span className="program-type">Curriculum</span>
                        </div>
                        <div className="program-body">
                          <h3>Curriculum Overview</h3>
                          <p>
                            Our curriculum is built around six transdisciplinary
                            themes that encourage students to explore and
                            understand the world around them:
                          </p>
                          <ul className="program-details">
                            <li>
                              <i className="bi bi-1-circle" /> Who We Are
                            </li>
                            <li>
                              <i className="bi bi-2-circle" /> Where We Are in
                              Place and Time
                            </li>
                            <li>
                              <i className="bi bi-3-circle" /> How We Express
                              Ourselves
                            </li>
                            <li>
                              <i className="bi bi-4-circle" /> How the World
                              Works
                            </li>
                            <li>
                              <i className="bi bi-5-circle" /> How We Organize
                              Ourselves
                            </li>
                            <li>
                              <i className="bi bi-6-circle" /> Sharing the
                              Planet
                            </li>
                          </ul>
                          <p>
                            These themes challenge students to think critically,
                            engage locally and globally, and connect learning to
                            real life.
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Program Item */}
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={200}
                    >
                      <div className="program-item graduate">
                        <div className="program-header">
                          <div className="program-icon">
                            <i className="bi bi-book" />
                          </div>
                          <span className="program-type">PYP Programme</span>
                        </div>
                        <div className="program-body">
                          <h3>Primary Years Programme (PYP)</h3>
                          <p>
                            The PYP Programme is structured from PYP1 through
                            PYP8, corresponding to the following grade levels:
                          </p>
                          <ul className="program-details">
                            <li>
                              <i className="bi bi-1-circle" /> PYP1 - Pre School
                            </li>
                            <li>
                              <i className="bi bi-2-circle" /> PYP2 -
                              Kindergarten 1 (KG1)
                            </li>
                            <li>
                              <i className="bi bi-3-circle" /> PYP3 -
                              Kindergarten 2 (KG2)
                            </li>
                            <li>
                              <i className="bi bi-4-circle" /> PYP4 to PYP8 -
                              Grades 1 to 5
                            </li>
                          </ul>
                          <p>
                            This progression ensures a cohesive and inclusive
                            educational journey from preschool through
                            elementary grades.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={200}
                    >
                      <div className="program-item graduate">
                        <div className="program-header">
                          <div className="program-icon">
                            <i className="bi bi-lightbulb" />
                          </div>
                          <span className="program-type">Methodology</span>
                        </div>
                        <div className="program-body">
                          <h3>Teaching Methodology</h3>
                          <p>
                            The teaching approach within the PYP emphasizes
                            collaborative learning, critical thinking, and
                            problem-solving.
                          </p>
                          <p>
                            Our classrooms are vibrant, interactive spaces where
                            curiosity is cultivated through structured inquiry.
                          </p>
                          <ul className="program-details">
                            <li>
                              <i className="bi bi-people" /> Collaborative
                              Learning
                            </li>
                            <li>
                              <i className="bi bi-chat-dots" /> Critical
                              Thinking &amp; Dialogue
                            </li>
                            <li>
                              <i className="bi bi-tools" /> Hands-on Projects
                              &amp; Activities
                            </li>
                            <li>
                              <i className="bi bi-easel2" /> Presentations &amp;
                              Creative Work
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={200}
                    >
                      <div className="program-item graduate">
                        <div className="program-header">
                          <div className="program-icon">
                            <i className="bi bi-clipboard-data" />
                          </div>
                          <span className="program-type">Assessment</span>
                        </div>
                        <div className="program-body">
                          <h3>Assessment</h3>
                          <p>
                            Assessment in the PYP is ongoing and diverse,
                            providing feedback on the learning process rather
                            than merely focusing on outcomes.
                          </p>
                          <ul className="program-details">
                            <li>
                              <i className="bi bi-person-lines-fill" />{" "}
                              Individual &amp; Group Assessments
                            </li>
                            <li>
                              <i className="bi bi-journal-text" /> Portfolio
                              Reviews
                            </li>
                            <li>
                              <i className="bi bi-chat-square-dots" /> Student
                              Reflections
                            </li>
                            <li>
                              <i className="bi bi-graph-up-arrow" />{" "}
                              Development-Focused Feedback
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={200}
                    >
                      <div className="program-item graduate">
                        <div className="program-header">
                          <div className="program-icon">
                            <i className="bi bi-building-check" />
                          </div>
                          <span className="program-type">
                            Learning Environment
                          </span>
                        </div>
                        <div className="program-body">
                          <h3>Learning Environment</h3>
                          <p>
                            Leaders International College offers a supportive
                            and enriched learning environment equipped with
                            advanced technologies and interactive learning
                            materials.
                          </p>
                          <ul className="program-details">
                            <li>
                              <i className="bi bi-easel2" /> Well-Resourced
                              Classrooms
                            </li>
                            <li>
                              <i className="bi bi-cpu" /> Advanced Educational
                              Technologies
                            </li>
                            <li>
                              <i className="bi bi-tree" /> Expansive Outdoor
                              Learning Areas
                            </li>
                            <li>
                              <i className="bi bi-person-heart" />{" "}
                              Development-Focused Design
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={200}
                    >
                      <div className="program-item graduate">
                        <div className="program-header">
                          <div className="program-icon">
                            <i className="bi bi-people" />
                          </div>
                          <span className="program-type">
                            Parental Involvement
                          </span>
                        </div>
                        <div className="program-body">
                          <h3>Parental Involvement</h3>
                          <p>
                            Recognizing the critical role of parental
                            involvement in children’s educational success, we
                            actively encourage parents to engage with the school
                            community, understand the curriculum, and support
                            their child’s learning journey at home.
                          </p>
                          <p>
                            The Primary Years Programme at Leaders International
                            College lays a strong foundation for lifelong
                            learning and success, focusing on academic
                            excellence and the development of strong personal
                            values and community responsibility.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-light p-4 rounded shadow-sm my-4">
                      <div className="section-header text-center">
                        <h3>PYP 8 Exhibition</h3>
                        <p>
                          The PYP 8 Exhibition represents a significant
                          milestone in the educational journey of students at
                          Leaders International College. This culminating event
                          of the Primary Years Programme (PYP) showcases the
                          skills, attitudes, and knowledge our students have
                          developed over their time in the PYP.
                        </p>
                      </div>
                    </div>
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={200}
                    >
                      <div className="program-item graduate">
                        <div className="program-header">
                          <div className="program-icon">
                            <i className="bi bi-lightbulb-fill" />
                          </div>
                          <span className="program-type">
                            Purpose of the Exhibition
                          </span>
                        </div>
                        <div className="program-body">
                          <h3>Purpose of the Exhibition</h3>
                          <p>
                            The PYP 8 Exhibition is a celebration and
                            demonstration of student learning, offering students
                            the chance to:
                          </p>
                          <ul
                            style={{
                              listStyle: "none",
                              paddingLeft: "0",
                            }}
                          >
                            <li>
                              <i className="bi bi-1-circle" /> Synthesize and
                              Apply Learning: Present their understanding of a
                              real-world issue by integrating their full PYP
                              experience.
                            </li>
                            <li>
                              <i className="bi bi-2-circle" /> Develop Inquiry
                              Skills: Engage in deep inquiry through meaningful
                              questions and thorough research.
                            </li>
                            <li>
                              <i className="bi bi-3-circle" /> Collaborate:
                              Strengthen interpersonal skills by working in
                              teams and managing responsibilities.
                            </li>
                            <li>
                              <i className="bi bi-4-circle" /> Reflect: Evaluate
                              their growth as learners and as members of a
                              global community.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={200}
                    >
                      <div className="program-item graduate">
                        <div className="program-header">
                          <div className="program-icon">
                            <i className="bi bi-globe-americas" />
                          </div>
                          <span className="program-type">
                            Impact and Significance
                          </span>
                        </div>
                        <div className="program-body">
                          <h3>Impact and Significance</h3>
                          <p>
                            The process begins with students selecting a topic
                            tied to a local or global issue of interest. Guided
                            by their teachers and mentors, they undertake a
                            detailed inquiry, exploring various perspectives and
                            compiling their findings. The project culminates in
                            a presentation where they share their insights and
                            solutions with the school community, including
                            peers, faculty, and parents.
                          </p>
                          <ul
                            style={{
                              listStyle: "none",
                              paddingLeft: "0",
                            }}
                          >
                            <li>
                              <i className="bi bi-1-circle" /> Select a topic
                              tied to a local or global issue of interest.
                            </li>
                            <li>
                              <i className="bi bi-2-circle" /> Work closely with
                              teachers and mentors for guidance.
                            </li>
                            <li>
                              <i className="bi bi-3-circle" /> Undertake
                              detailed inquiry and explore multiple
                              perspectives.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={200}
                    >
                      <div className="program-item graduate">
                        <div className="program-header">
                          <div className="program-icon">
                            <i className="bi bi-gear-fill" />
                          </div>
                          <span className="program-type">
                            Exhibition Process
                          </span>
                        </div>
                        <div className="program-body">
                          <h3>Exhibition Process</h3>
                          <p>
                            The process begins with students selecting a topic
                            tied to a local or global issue of interest. Guided
                            by their teachers and mentors, they undertake a
                            detailed inquiry, exploring various perspectives and
                            compiling their findings. The project culminates in
                            a presentation where they share their insights and
                            solutions with the school community, including
                            peers, faculty, and parents.
                          </p>
                          <ul
                            style={{
                              listStyle: "none",
                              paddingLeft: "0",
                            }}
                          >
                            <li>
                              <i className="bi bi-1-circle" /> Select Topic:
                              Choose a relevant local or global issue.
                            </li>
                            <li>
                              <i className="bi bi-2-circle" /> Research: Gather
                              information and explore multiple viewpoints.
                            </li>
                            <li>
                              <i className="bi bi-3-circle" /> Collaborate: Work
                              with peers and mentors for guidance.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* AMERICAN Tab */}
                <div
                  className={`tab-pane fade ${
                    curriculumTab === "american" ? "show active" : ""
                  }`}
                  id="academics-american"
                  role="tabpanel"
                >
                  <div className="bg-light p-4 rounded shadow-sm my-4">
                    <div className="section-header text-center">
                      <h3>American Diploma</h3>
                      <p>
                        At Leaders International College, we pride ourselves on
                        offering a distinctive educational pathway through our
                        American Diploma program. Unique among IB schools, our
                        American Diploma is integrated with the IB curriculum,
                        ensuring that all students, regardless of the program
                        they choose, receive a comprehensive, high-quality
                        education grounded in the IB philosophy.
                      </p>
                      <p>
                        The American Diploma program is specifically designed
                        for students in DP1 and DP2 (grades 11 and 12),
                        providing an alternative that is less rigorous than the
                        full Diploma Programme while still maintaining the high
                        standards of an IB education. This program is ideal for
                        students seeking flexibility in their secondary
                        education and for those who may benefit from a
                        curriculum tailored to their individual capabilities and
                        future goals.
                      </p>
                    </div>

                    <div className="row g-4">
                      <div className="col-lg-4 col-md-6" data-aos="zoom-in">
                        <div className="program-item graduate">
                          <div className="program-header">
                            <div className="program-icon">
                              <i className="bi bi-globe-americas"></i>
                            </div>
                            <span className="program-type">
                              American Diploma
                            </span>
                          </div>
                          <div className="program-body">
                            <h3>Integrated Pathway</h3>
                            <p>
                              Our American Diploma is integrated with the IB
                              curriculum, ensuring that students receive a
                              comprehensive, high-quality education grounded in
                              the IB philosophy while benefiting from the
                              flexibility of the American system.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-6" data-aos="zoom-in">
                        <div className="program-item graduate">
                          <div className="program-header">
                            <div className="program-icon">
                              <i className="bi bi-award-fill"></i>
                            </div>
                            <span className="program-type">
                              American Diploma
                            </span>
                          </div>
                          <div className="program-body">
                            <h3>Tailored for DP1 & DP2</h3>
                            <p>
                              The program is designed for students in DP1 and
                              DP2 (grades 11 and 12), offering an alternative
                              that is less rigorous than the full Diploma
                              Programme but upholds IB’s high educational
                              standards.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-6" data-aos="zoom-in">
                        <div className="program-item graduate">
                          <div className="program-header">
                            <div className="program-icon">
                              <i className="bi bi-person-check-fill"></i>
                            </div>
                            <span className="program-type">
                              American Diploma
                            </span>
                          </div>
                          <div className="program-body">
                            <h3>Flexibility & Future Focus</h3>
                            <p>
                              This pathway suits students seeking more
                              flexibility and a curriculum tailored to their
                              individual capabilities and future goals, while
                              staying true to our IB philosophy.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* IGCSE Tab */}
                <div
                  className={`tab-pane fade ${
                    curriculumTab === "igcse" ? "show active" : ""
                  }`}
                  id="academics-igcse"
                  role="tabpanel"
                >
                  <div className="row g-4">
                    {/* Intro block */}
                    <div className="bg-light p-4 rounded shadow-sm my-4">
                      <div className="section-header text-center">
                        <h3>IGCSE Program</h3>
                        <p>
                          Our IGCSE program is offered for students in Years 10
                          to 12, focusing on providing a broad and flexible
                          curriculum. At Leaders International College, we
                          ensure academic excellence by employing only highly
                          qualified teachers who are committed to nurturing
                          student success in a supportive environment. This
                          approach prepares our students well for higher
                          education and future careers.
                        </p>
                      </div>
                    </div>

                    {/* Program Item 1 */}
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={100}
                    >
                      <div className="program-item undergraduate">
                        <div className="program-header">
                          <div className="program-icon">
                            <i className="bi bi-journal-bookmark-fill" />
                          </div>
                          <span className="program-type">IGCSE</span>
                        </div>
                        <div className="program-body">
                          <h3>Broad & Flexible</h3>
                          <p>
                            The IGCSE program provides a broad and flexible
                            curriculum that prepares students for academic
                            success and life-long learning.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Program Item 2 */}
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={100}
                    >
                      <div className="program-item undergraduate">
                        <div className="program-header">
                          <div className="program-icon">
                            <i className="bi bi-people-fill" />
                          </div>
                          <span className="program-type">IGCSE</span>
                        </div>
                        <div className="program-body">
                          <h3>Qualified Teachers</h3>
                          <p>
                            At Leaders International College, we ensure academic
                            excellence by employing only highly qualified
                            teachers who are committed to nurturing student
                            success in a supportive environment.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Program Item 3 */}
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={100}
                    >
                      <div className="program-item undergraduate">
                        <div className="program-header">
                          <div className="program-icon">
                            <i className="bi bi-mortarboard-fill" />
                          </div>
                          <span className="program-type">IGCSE</span>
                        </div>
                        <div className="program-body">
                          <h3>Preparation for the Future</h3>
                          <p>
                            This approach prepares our students well for higher
                            education and future careers.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* MYP Tab */}
                <div
                  className={`tab-pane fade ${
                    curriculumTab === "myp" ? "show active" : ""
                  }`}
                  id="academics-graduate"
                  role="tabpanel"
                >
                  <div className="row g-4">
                    <div className="bg-light p-4 rounded shadow-sm my-4">
                      <div className="section-header text-center">
                        <h3>MYP – Middle Years Programme</h3>
                        <p>
                          The Middle Years Programme (MYP) at Leaders
                          International College is designed for students aged 11
                          to 16, covering grades 6 through 10. This program
                          challenges students to make practical connections
                          between their studies and the real world, preparing
                          them for success in further education, the workplace,
                          and life.
                        </p>
                      </div>
                    </div>
                    {/* Program Item */}
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={100}
                    >
                      <div className="program-item undergraduate">
                        <div className="program-header">
                          <div className="program-icon">
                            <i className="bi bi-diagram-3-fill" />
                          </div>
                          <span className="program-type">MYP Programme</span>
                        </div>
                        <div className="program-body">
                          <h3>Programme Structure</h3>
                          <p>
                            The MYP includes eight subject groups to provide a
                            broad and balanced education:
                          </p>
                          <ul className="program-details">
                            <li>
                              <i className="bi bi-1-circle" /> Language and
                              Literature
                            </li>
                            <li>
                              <i className="bi bi-2-circle" /> Language
                              Acquisition
                            </li>
                            <li>
                              <i className="bi bi-3-circle" /> Individuals and
                              Societies
                            </li>
                            <li>
                              <i className="bi bi-4-circle" /> Sciences
                            </li>
                            <li>
                              <i className="bi bi-5-circle" /> Mathematics
                            </li>
                            <li>
                              <i className="bi bi-6-circle" /> Arts
                            </li>
                            <li>
                              <i className="bi bi-7-circle" /> Physical and
                              Health Education
                            </li>
                            <li>
                              <i className="bi bi-8-circle" /> Design
                            </li>
                          </ul>
                          <p>
                            Students engage with these subjects through a global
                            lens, promoting critical and reflective thinking.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={100}
                    >
                      <div className="program-item undergraduate">
                        <div className="program-header">
                          <div className="program-icon">
                            <i className="bi bi-journal-bookmark-fill" />
                          </div>
                          <span className="program-type">MYP Programme</span>
                        </div>
                        <div className="program-body">
                          <h3>Curriculum Overview</h3>
                          <p>
                            The MYP curriculum fosters a holistic education that
                            emphasizes intellectual challenge and encourages
                            students to make connections between their studies
                            in traditional subjects and the real world.
                          </p>
                          <p>
                            It develops active learners and internationally
                            minded young people who can empathize with others
                            and pursue lives of purpose and meaning.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={100}
                    >
                      <div className="program-item undergraduate">
                        <div className="program-header">
                          <div className="program-icon">
                            <i className="bi bi-lightbulb-fill" />
                          </div>
                          <span className="program-type">MYP Programme</span>
                        </div>
                        <div className="program-body">
                          <h3>Teaching Approach</h3>
                          <p>
                            Our inquiry-based teaching methods encourage
                            students to understand global complexities and seek
                            solutions.
                          </p>
                          <p>
                            This supportive and challenging environment helps
                            build independence, confidence, and ownership of
                            learning.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={100}
                    >
                      <div className="program-item undergraduate">
                        <div className="program-header">
                          <div className="program-icon">
                            <i className="bi bi-clipboard-data" />
                          </div>
                          <span className="program-type">MYP Programme</span>
                        </div>
                        <div className="program-body">
                          <h3>Assessment Strategy</h3>
                          <p>
                            Assessment supports student learning and provides
                            ongoing feedback through various tools and
                            strategies.
                          </p>
                          <p>
                            It emphasizes criteria-based assessment to help
                            students understand their strengths and areas for
                            improvement.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={100}
                    >
                      <div className="program-item undergraduate">
                        <div className="program-header">
                          <div className="program-icon">
                            <i className="bi bi-award-fill" />
                          </div>
                          <span className="program-type">MYP Programme</span>
                        </div>
                        <div className="program-body">
                          <h3>Personal Project</h3>
                          <p>
                            In MYP 5, students undertake a Personal Project—a
                            long-term, self-directed piece of work that reflects
                            their creativity, skills, and knowledge.
                          </p>
                          <p>
                            This capstone project empowers students to explore a
                            personal interest and produce meaningful work.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={100}
                    >
                      <div className="program-item undergraduate">
                        <div className="program-header">
                          <div className="program-icon">
                            <i className="bi bi-person-arms-up" />
                          </div>
                          <span className="program-type">MYP Programme</span>
                        </div>
                        <div className="program-body">
                          <h3>Skills Development</h3>
                          <p>
                            The MYP helps students build academic,
                            interpersonal, self-management, research, and
                            communication skills.
                          </p>
                          <p>
                            These essential skills prepare learners for the
                            Diploma Programme and future educational pathways.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-light p-4 rounded shadow-sm my-4">
                      <div className="section-header text-center">
                        <h3>MYP Personal Project</h3>
                        <p>
                          The MYP Personal Project is a significant academic
                          endeavor and a highlight for students concluding the
                          Middle Years Programme (MYP) at Leaders International
                          College. This project is an opportunity for students
                          in their final year of the MYP (Year 5) to demonstrate
                          the skills, attitudes, and knowledge they have
                          developed throughout the programme.
                        </p>
                      </div>
                    </div>
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={100}
                    >
                      <div className="program-item undergraduate">
                        <div className="program-header">
                          <div className="program-icon">
                            <i className="bi bi-bullseye" />
                          </div>
                          <span className="program-type">MYP Programme</span>
                        </div>
                        <div className="program-body">
                          <h3>Purpose of the Personal Project</h3>
                          <p>
                            The Personal Project encourages students to pursue
                            personal interests and become self-directed
                            learners. Key objectives include:
                          </p>
                          <ul className="program-details">
                            <li>
                              <i className="bi bi-person-check" />{" "}
                              Self-Management: Students take full ownership of
                              their learning and decisions.
                            </li>
                            <li>
                              <i className="bi bi-search" /> Inquiry &amp;
                              Research: Clear goals, strong research, and
                              planning lead the way.
                            </li>
                            <li>
                              <i className="bi bi-palette-fill" /> Creative
                              Application: Students creatively produce essays,
                              artworks, research, or other personalized outputs.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={100}
                    >
                      <div className="program-item undergraduate">
                        <div className="program-header">
                          <div className="program-icon">
                            <i className="bi bi-gear-wide-connected" />
                          </div>
                          <span className="program-type">MYP Programme</span>
                        </div>
                        <div className="program-body">
                          <h3>Process</h3>
                          <p>
                            The Personal Project begins with a topic of deep
                            personal interest. Students work with a supervisor
                            and follow these phases:
                          </p>
                          <ul className="program-details">
                            <li>
                              <i className="bi bi-clipboard-check-fill" />{" "}
                              Planning: Define objectives and a clear timeline.
                            </li>
                            <li>
                              <i className="bi bi-journal-text" /> Research:
                              Collect resources and deepen topic understanding.
                            </li>
                            <li>
                              <i className="bi bi-tools" /> Creation: Develop
                              the product or outcome.
                            </li>
                            <li>
                              <i className="bi bi-chat-left-dots" /> Reflection:
                              Assess challenges, growth, and learning outcomes.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={100}
                    >
                      <div className="program-item undergraduate">
                        <div className="program-header">
                          <div className="program-icon">
                            <i className="bi bi-stars" />
                          </div>
                          <span className="program-type">MYP Programme</span>
                        </div>
                        <div className="program-body">
                          <h3>Impact and Significance</h3>
                          <p>
                            Completing the MYP Personal Project empowers
                            students to:
                          </p>
                          <ul className="program-details">
                            <li>
                              <i className="bi bi-book-half" /> Deepen
                              understanding of their chosen subject.
                            </li>
                            <li>
                              <i className="bi bi-lightning-charge-fill" />{" "}
                              Build critical thinking, problem-solving, and
                              communication skills.
                            </li>
                            <li>
                              <i className="bi bi-person-up" /> Become
                              confident, independent learners prepared for
                              future academic and personal success.
                            </li>
                          </ul>
                          <p>
                            At Leaders International College, the Personal
                            Project is a transformative experience that fosters
                            creativity, confidence, and lifelong learning.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DP Tab */}
                <div
                  className={`tab-pane fade ${
                    curriculumTab === "dp" ? "show active" : ""
                  }`}
                  id="academics-doctoral"
                  role="tabpanel"
                >
                  <div className="row g-4">
                    <div className="bg-light p-4 rounded shadow-sm my-4">
                      <div className="section-header text-center">
                        <h3>DP – Diploma Programme</h3>
                        <p>
                          The Diploma Programme (DP) at Leaders International
                          College is a challenging two-year education program
                          for students aged 16 to 19, encompassing grades 11 and
                          12. This program is internationally recognized and
                          prepares students for university and higher education
                          at the best institutions worldwide. It is renowned for
                          its rigorous assessment, giving students a strong
                          advantage in the competitive post-secondary
                          environment.
                        </p>
                      </div>
                    </div>
                    {/* Program Item */}
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={100}
                    >
                      <div className="program-item doctoral">
                        <div className="program-header">
                          <div className="program-icon">
                            <i className="bi bi-bullseye" />
                          </div>
                          <span className="program-type">MYP Programme</span>
                        </div>
                        <div className="program-body">
                          <h3>Purpose of the Personal Project</h3>
                          <p>
                            The Personal Project encourages students to pursue
                            personal interests and become self-directed
                            learners. Key objectives include:
                          </p>
                          <ul className="program-details">
                            <li>
                              <i className="bi bi-person-check" />{" "}
                              Self-Management: Students take full ownership of
                              their learning and decisions.
                            </li>
                            <li>
                              <i className="bi bi-search" /> Inquiry &amp;
                              Research: Clear goals, strong research, and
                              planning lead the way.
                            </li>
                            <li>
                              <i className="bi bi-palette-fill" /> Creative
                              Application: Students creatively produce essays,
                              artworks, research, or other personalized outputs.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={100}
                    >
                      <div className="program-item doctoral">
                        <div className="program-header">
                          <div className="program-icon">
                            <i className="bi bi-gear-wide-connected" />
                          </div>
                          <span className="program-type">MYP Programme</span>
                        </div>
                        <div className="program-body">
                          <h3>Process</h3>
                          <p>
                            The Personal Project begins with a topic of deep
                            personal interest. Students work with a supervisor
                            and follow these phases:
                          </p>
                          <ul className="program-details">
                            <li>
                              <i className="bi bi-clipboard-check-fill" />{" "}
                              Planning: Define objectives and a clear timeline.
                            </li>
                            <li>
                              <i className="bi bi-journal-text" /> Research:
                              Collect resources and deepen topic understanding.
                            </li>
                            <li>
                              <i className="bi bi-tools" /> Creation: Develop
                              the product or outcome.
                            </li>
                            <li>
                              <i className="bi bi-chat-left-dots" /> Reflection:
                              Assess challenges, growth, and learning outcomes.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-lg-4 col-md-6"
                      data-aos="zoom-in"
                      data-aos-delay={100}
                    >
                      <div className="program-item doctoral">
                        <div className="program-header">
                          <div className="program-icon">
                            <i className="bi bi-stars" />
                          </div>
                          <span className="program-type">MYP Programme</span>
                        </div>
                        <div className="program-body">
                          <h3>Impact and Significance</h3>
                          <p>
                            Completing the MYP Personal Project empowers
                            students to:
                          </p>
                          <ul className="program-details">
                            <li>
                              <i className="bi bi-book-half" /> Deepen
                              understanding of their chosen subject.
                            </li>
                            <li>
                              <i className="bi bi-lightning-charge-fill" />{" "}
                              Build critical thinking, problem-solving, and
                              communication skills.
                            </li>
                            <li>
                              <i className="bi bi-person-up" /> Become
                              confident, independent learners prepared for
                              future academic and personal success.
                            </li>
                          </ul>
                          <p>
                            At Leaders International College, the Personal
                            Project is a transformative experience that fosters
                            creativity, confidence, and lifelong learning.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-light p-4 rounded shadow-sm my-4">
                      <div className="section-header text-center">
                        <h3>DP Subject Offerings</h3>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6 col-md-6" data-aos="zoom-in">
                        <div className="program-item doctoral">
                          <div className="program-header">
                            <div className="program-icon">
                              <i className="bi bi-sliders2" />
                            </div>
                            <span className="program-type">
                              Diploma Programme
                            </span>
                          </div>
                          <div className="program-body">
                            <h3>Dynamic Curriculum</h3>
                            <p>
                              At Leaders International College, our Diploma
                              Programme (DP) is designed to adapt to the
                              evolving interests and aspirations of our
                              students. We offer a broad array of subjects
                              across the six groups mandated by the IB
                              curriculum, providing students the opportunity to
                              customize their education based on their passions
                              and career goals.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6" data-aos="zoom-in">
                        <div className="program-item doctoral">
                          <div className="program-header">
                            <div className="program-icon">
                              <i className="bi bi-arrow-repeat" />
                            </div>
                            <span className="program-type">
                              Diploma Programme
                            </span>
                          </div>
                          <div className="program-body">
                            <h3>Adaptable Offerings</h3>
                            <p>
                              Each year, our DP subject offerings are reviewed
                              and may vary to reflect the preferences and needs
                              of our incoming and current students. This
                              flexibility allows us to offer a curriculum that
                              is responsive and aligned with student interest,
                              ensuring that our educational offerings remain
                              fresh, relevant, and engaging.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-light p-4 rounded shadow-sm my-4">
                      <div className="section-header text-center">
                        <h3>CAS Exhibition </h3>
                        <p>
                          The Creativity, Activity, Service (CAS) Exhibition at
                          Leaders International College is a pivotal event in
                          our Diploma Programme (DP). This exhibition showcases
                          the diverse projects our DP students have undertaken
                          as part of the CAS requirement, reflecting their
                          engagement with creative pursuits, physical
                          activities, and community service.
                        </p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4 col-md-6" data-aos="zoom-in">
                        <div className="program-item doctoral">
                          <div className="program-header">
                            <div className="program-icon">
                              <i className="bi bi-stars" />
                            </div>
                            <span className="program-type">
                              Diploma Programme
                            </span>
                          </div>
                          <div className="program-body">
                            <h3>Purpose of the CAS Exhibition</h3>
                            <p>
                              The CAS Exhibition celebrates student achievements
                              in Creativity, Activity, and Service. Creativity
                              includes artistic and innovative projects.
                              Activity emphasizes physical engagement and
                              healthy lifestyles. Service highlights students’
                              impact on their communities through meaningful
                              projects.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6" data-aos="zoom-in">
                        <div className="program-item doctoral">
                          <div className="program-header">
                            <div className="program-icon">
                              <i className="bi bi-easel2" />
                            </div>
                            <span className="program-type">
                              Diploma Programme
                            </span>
                          </div>
                          <div className="program-body">
                            <h3>Exhibition Features</h3>
                            <p>
                              Students showcase their projects with visual and
                              interactive displays, share personal reflections
                              on growth through CAS, and participate in Q&amp;A
                              sessions. These features deepen understanding of
                              their learning journeys and the value of their
                              experiences.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6" data-aos="zoom-in">
                        <div className="program-item doctoral">
                          <div className="program-header">
                            <div className="program-icon">
                              <i className="bi bi-globe-americas" />
                            </div>
                            <span className="program-type">
                              Diploma Programme
                            </span>
                          </div>
                          <div className="program-body">
                            <h3>Impact and Significance</h3>
                            <p>
                              The CAS Exhibition is a reflective and celebratory
                              process that helps students connect their
                              activities to real-world outcomes. It promotes the
                              core IB values—holistic growth, social
                              responsibility, and global
                              citizenship—highlighting our students' readiness
                              for the future.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="stats-wrapper" data-aos="fade-up">
                <div className="row align-items-start">
                  {/* Left Column: Academic Support */}
                  <div
                    className="col-lg-6 mb-4 mb-lg-0"
                    data-aos="fade-right"
                    data-aos-delay={100}
                  >
                    <div className="stats-content">
                      <span className="subtitle">Academic Support</span>
                      <h2>Empowering Every Learner</h2>
                      <p>
                        At Leaders International College, we believe in
                        empowering all students to reach their full potential.
                        Our Learning and Teaching Center (LTC) and Special
                        Educational Needs (SEN) programs are designed to support
                        students who need extra help as well as those who are
                        excelling and require advanced challenges.
                      </p>
                      <h5>What are LTC and SEN?</h5>
                      <ul>
                        <li>
                          <strong>Learning and Teaching Center (LTC):</strong>{" "}
                          This center provides support to enhance learning
                          outcomes for all students. It offers personalized
                          academic assistance to students who are struggling
                          with their studies and also develops special programs
                          for students who excel academically and need more
                          advanced coursework to stay engaged and challenged.
                        </li>
                        <li>
                          <strong>Special Educational Needs (SEN):</strong> Our
                          SEN program caters to students who have different
                          learning needs that require specific educational
                          adjustments and resources. This includes students with
                          learning disabilities, physical disabilities, and
                          those who need modifications to access the curriculum
                          effectively.
                        </li>
                      </ul>
                      <h5>Role of Our Centers</h5>
                      <ul>
                        <li>
                          <strong>Support for Struggling Students:</strong> Both
                          LTC and SEN are crucial in identifying students who
                          face academic difficulties and providing them with the
                          necessary support to improve their learning
                          experiences. This includes tutoring, specialized
                          teaching strategies, and modifications to the learning
                          environment.
                        </li>
                        <li>
                          <strong>Enhancements for Advanced Learners:</strong>{" "}
                          For students who are ahead of their peers, these
                          centers offer enrichment programs that present more
                          complex material and opportunities for deeper
                          exploration of subjects that interest them.
                        </li>
                      </ul>
                      <p>
                        The LTC and SEN at Leaders International College play a
                        pivotal role in our educational approach, supporting a
                        diverse range of learning needs and ensuring that all
                        students have the opportunities they need to succeed
                        both academically and personally.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Digital Learning */}
                  <div
                    className="col-lg-6"
                    data-aos="fade-left"
                    data-aos-delay={200}
                  >
                    <div className="stats-content">
                      <span className="subtitle">Digital Learning</span>
                      <h2>Innovative & Interactive Education</h2>
                      <p>
                        At Leaders International College, we integrate advanced
                        technology into our learning environments to enhance
                        educational outcomes and prepare our students for a
                        digital future.
                      </p>
                      <h5>Interactive Learning Environments</h5>
                      <p>
                        Our classrooms are equipped with interactive smart
                        screens, which facilitate dynamic and engaging teaching
                        methods. These tools allow teachers to deliver lessons
                        in a visually enriched format that captures students'
                        attention and encourages interactive learning
                        experiences.
                      </p>
                      <h5>Guided Education System: ManageBac</h5>
                      <p>
                        To streamline our educational processes and enhance
                        communication, we utilize ManageBac, a leading learning
                        management system tailored for International
                        Baccalaureate (IB) schools. ManageBac supports our
                        teachers and students by providing an organized platform
                        for lesson planning, assignments, and assessments, and
                        it enables parents to keep track of their child’s
                        academic progress and school activities in real-time.
                      </p>
                      <p>
                        At Leaders International College, our commitment to
                        digital learning extends beyond interactive classrooms
                        and management systems. We employ a variety of digital
                        resources, software, and tools designed to enhance
                        educational delivery and accommodate the diverse
                        learning needs of our students. These technologies
                        support personalized learning experiences, enabling each
                        student to thrive in a nurturing, technologically
                        advanced environment. By integrating these resources, we
                        ensure our students are well-prepared to navigate and
                        succeed in a digital-centric world.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* /Academics Section */}
        </main>

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
