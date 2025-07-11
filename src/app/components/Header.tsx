"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTabs } from "./TabsContext";
import { useCurriculum } from "../components/CurriculumContext";
import { useHiringTabs } from "./HiringTabsContext";
import { useStudentsLifeTabs } from "./StudentsLifeTabsContext";
import { useAboutTabs } from "../components/AboutTabsContext";
import { useCampusTabs } from "../components/CampusTabsContext";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { setActiveSection } = useTabs();
  const { setCurriculumTab } = useCurriculum();
  const { setHiringSection } = useHiringTabs();
  const { setStudentsLifeSection } = useStudentsLifeTabs();
  const { setAboutTab } = useAboutTabs();
  const { setCampusTab } = useCampusTabs();

  const handleAdmissionTab = (section: string) => {
    if (pathname !== "/admissions") {
      router.push("/admissions");
    }
    setActiveSection(section);
  };
  const handleCurriculumTab = (tab: string) => {
    if (pathname !== "/curriculum") {
      router.push("/curriculum");
    }
    setCurriculumTab(tab);
  };
  const handleHiringTab = (section: string) => {
    if (pathname !== "/hiring") {
      router.push("/hiring");
    }
    setHiringSection(section);
  };
  const handleStudentsLifeTab = (section: string) => {
    if (pathname !== "/students-life") {
      router.push(`/students-life#${section}`);
    } else {
      // If already on page, just set it:
      setStudentsLifeSection(section);
      window.location.hash = section; // Optional: sync hash
    }
  };
  const handleAboutTab = (tab: string) => {
    if (pathname !== "/about") {
      router.push("/about");
    }
    setAboutTab(tab);
  };
  const handleCampusTab = (tab: string) => {
    if (pathname !== "/campus-facilities") {
      router.push("/campus-facilities");
    }
    setCampusTab(tab);
  };

  return (
    <header id="header" className="header d-flex align-items-center fixed-top">
      <div className="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
        <a href="/" className="logo d-flex align-items-center">
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
              <a href="/" className={pathname === "/" ? "active" : ""}>
                Home
              </a>
            </li>
            <li className="dropdown">
              <a href="/about">
                <span>About Us</span>
                <i className="bi bi-chevron-down toggle-dropdown" />
              </a>
              <ul>
                <li>
                  <a href="#" onClick={() => handleAboutTab("who")}>
                    Who We Are
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleAboutTab("mission")}>
                    Mission & Vision
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleAboutTab("strategies")}>
                    Strategies
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleAboutTab("governance")}>
                    Governance
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleAboutTab("accreditation")}>
                    Accreditation
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleAboutTab("learner")}>
                    IB Learner Profile
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleAboutTab("campus")}>
                    Campus
                  </a>
                </li>
              </ul>
            </li>

            <li className="dropdown">
              <a href="/campus-facilities">
                <span>Campus</span>
                <i className="bi bi-chevron-down toggle-dropdown" />
              </a>
              <ul>
                <li>
                  <a href="#" onClick={() => handleCampusTab("academic")}>
                    Academic Environments
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleCampusTab("athletic")}>
                    Sports Facilities
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleCampusTab("technology")}>
                    Technology Integration
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleCampusTab("arts")}>
                    Arts & Innovation
                  </a>
                </li>
              </ul>
            </li>

            <li className="dropdown">
              <a href="/admissions">
                <span>Admissions</span>
                <i className="bi bi-chevron-down toggle-dropdown" />
              </a>
              <ul>
                <li>
                  <a href="#" onClick={() => handleAdmissionTab("apply")}>
                    How to Apply
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleAdmissionTab("form")}>
                    Apply Now
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={() => handleAdmissionTab("requirements")}
                  >
                    Age Acceptance Guide
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleAdmissionTab("deadlines")}>
                    Virtual Tour
                  </a>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="/curriculum">
                <span>Curriculum</span>
                <i className="bi bi-chevron-down toggle-dropdown" />
              </a>
              <ul>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCurriculumTab("pyp");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    PYP
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCurriculumTab("myp");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    MYP
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCurriculumTab("dp");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    DP
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCurriculumTab("american");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    American Diploma
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCurriculumTab("igcse");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    IGCSE
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCurriculumTab("character");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Character Building
                  </a>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="/students-life">
                <span>Students Life</span>
                <i className="bi bi-chevron-down toggle-dropdown" />
              </a>
              <ul>
                <li>
                  <a
                    href="#"
                    onClick={() => handleStudentsLifeTab("athletics")}
                  >
                    Athletics
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={() => handleStudentsLifeTab("extracurricular")}
                  >
                    Extracurricular Activities
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleStudentsLifeTab("dayinlic")}>
                    Day In LIC
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleStudentsLifeTab("health")}>
                    Health &amp; Wellness
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleStudentsLifeTab("clubs")}>
                    Clubs
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleStudentsLifeTab("trips")}>
                    Trips
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleStudentsLifeTab("council")}>
                    Student Council
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleStudentsLifeTab("art")}>
                    Art Programs
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleStudentsLifeTab("events")}>
                    School Events
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleStudentsLifeTab("dining")}>
                    Dining Services
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={() => handleStudentsLifeTab("transport")}
                  >
                    Transportations
                  </a>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a
                href="/hiring"
                className={pathname.startsWith("/hiring") ? "active" : ""}
              >
                <span>We Are Hiring</span>
                <i className="bi bi-chevron-down toggle-dropdown" />
              </a>
              <ul>
                <li>
                  <a href="#" onClick={() => handleHiringTab("opening")}>
                    Opening
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleHiringTab("development")}>
                    Professional Development
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleHiringTab("working")}>
                    Working at LIC
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleHiringTab("internship")}>
                    Internship Program
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleHiringTab("vacancies")}>
                    Current Vacancies
                  </a>
                </li>
              </ul>
            </li>

            {/* <li>
              <a
                href="/contact"
                className={pathname.startsWith("/contact") ? "active" : ""}
              >
                Contact Us
              </a>
            </li> */}
          </ul>
          <i className="mobile-nav-toggle d-xl-none bi bi-list" />
        </nav>
      </div>
    </header>
  );
}
