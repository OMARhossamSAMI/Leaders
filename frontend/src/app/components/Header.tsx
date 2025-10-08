"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTabs } from "./TabsContext";
import { useCurriculum } from "./CurriculumContext";
import { useHiringTabs } from "./HiringTabsContext";
import { useStudentsLifeTabs } from "./StudentsLifeTabsContext";
import { useAboutTabs } from "./AboutTabsContext";
import { useCampusTabs } from "./CampusTabsContext";
import Link from "next/link";
import Image from "next/image";

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
        <Link href="/" className="logo d-flex align-items-center">
          <Image
            src="/assets/img/lic_logo.png"
            alt="School Logo"
            width={55} // You can adjust this if the image isn't square
            height={40}
            style={{ marginRight: 10 }}
            priority // Optional: use if this logo is in your header or shown above the fold
          />
          <h1 className="sitename">Leaders International College</h1>
        </Link>
        <nav id="navmenu" className="navmenu">
          <ul>
            <li>
              <Link href="/" className={pathname === "/" ? "active" : ""}>
                Home
              </Link>
            </li>
            <li className="dropdown">
              <Link href="/about">
                <span>About Us</span>
                <i className="bi bi-chevron-down toggle-dropdown" />
              </Link>
              <ul>
                <li>
                  <Link href="/about" onClick={() => handleAboutTab("who")}>
                    Who We Are
                  </Link>
                </li>
                <li>
                  <Link href="/about" onClick={() => handleAboutTab("mission")}>
                    Mission & Vision
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    onClick={() => handleAboutTab("strategies")}
                  >
                    Strategies
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    onClick={() => handleAboutTab("governance")}
                  >
                    Governance
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    onClick={() => handleAboutTab("accreditation")}
                  >
                    Accreditation
                  </Link>
                </li>
                <li>
                  <Link href="/about" onClick={() => handleAboutTab("learner")}>
                    IB Learner Profile
                  </Link>
                </li>
                <li>
                  <Link href="/about" onClick={() => handleAboutTab("campus")}>
                    Campus
                  </Link>
                </li>
                <li>
                  <Link href="/about" onClick={() => handleAboutTab("culture")}>
                    Culture & Values
                  </Link>
                </li>
              </ul>
            </li>

            <li className="dropdown">
              <Link href="/campus-facilities">
                <span>Campus</span>
                <i className="bi bi-chevron-down toggle-dropdown" />
              </Link>
              <ul>
                <li>
                  <Link
                    href="/campus-facilities"
                    onClick={() => handleCampusTab("academic")}
                  >
                    Academic Environment
                  </Link>
                </li>
                <li>
                  <Link
                    href="/campus-facilities"
                    onClick={() => handleCampusTab("athletic")}
                  >
                    Sports Facilities
                  </Link>
                </li>
                <li>
                  <Link
                    href="/campus-facilities"
                    onClick={() => handleCampusTab("technology")}
                  >
                    Technology Integration
                  </Link>
                </li>
                <li>
                  <Link
                    href="/campus-facilities"
                    onClick={() => handleCampusTab("arts")}
                  >
                    Arts & Innovation
                  </Link>
                </li>
              </ul>
            </li>

            <li className="dropdown">
              <Link href="/admissions">
                <span>Admissions</span>
                <i className="bi bi-chevron-down toggle-dropdown" />
              </Link>
              <ul>
                <li>
                  <Link
                    href="/admissions"
                    onClick={() => handleAdmissionTab("apply")}
                  >
                    How to Apply
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admissions"
                    onClick={() => handleAdmissionTab("form")}
                  >
                    Apply Now
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admissions"
                    onClick={() => handleAdmissionTab("requirements")}
                  >
                    Age Acceptance Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admissions"
                    onClick={() => handleAdmissionTab("deadlines")}
                  >
                   Tour
                  </Link>
                </li>
                <li>
                  <Link 
                  href="/admissions"
                  onClick={() => handleAdmissionTab("reserve")}
                  >
                    Reserve Assessment Date
                  </Link>
                </li>

              </ul>
            </li>
            <li className="dropdown">
              <Link href="/curriculum">
                <span>Curriculum</span>
                <i className="bi bi-chevron-down toggle-dropdown" />
              </Link>
              <ul>
                <li>
                  <Link
                    href="/curriculum"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCurriculumTab("pyp");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    PYP
                  </Link>
                </li>
                <li>
                  <Link
                    href="/curriculum"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCurriculumTab("myp");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    MYP
                  </Link>
                </li>
                <li>
                  <Link
                    href="/curriculum"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCurriculumTab("dp");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    DP
                  </Link>
                </li>
                <li>
                  <Link
                    href="/curriculum"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCurriculumTab("american");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    American Diploma
                  </Link>
                </li>
                <li>
                  <Link
                    href="/curriculum"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCurriculumTab("igcse");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    IGCSE
                  </Link>
                </li>
                <li>
                  <Link
                    href="/curriculum"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCurriculumTab("character");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Character Building
                  </Link>
                </li>
                <li>
                  <Link
                    href="/curriculum"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCurriculumTab("academic");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Academic Support
                  </Link>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <Link href="/students-life">
                <span>Students Life</span>
                <i className="bi bi-chevron-down toggle-dropdown" />
              </Link>
              <ul>
                <li>
                  <Link
                    href="/students-life"
                    onClick={() => handleStudentsLifeTab("athletics")}
                  >
                    Athletics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/students-life"
                    onClick={() => handleStudentsLifeTab("extracurricular")}
                  >
                    Extracurricular Activities
                  </Link>
                </li>
                <li>
                  <Link
                    href="/students-life"
                    onClick={() => handleStudentsLifeTab("dayinlic")}
                  >
                    Day in LIC
                  </Link>
                </li>
                <li>
                  <Link
                    href="/students-life"
                    onClick={() => handleStudentsLifeTab("health")}
                  >
                    Health &amp; Wellness
                  </Link>
                </li>
                <li>
                  <Link
                    href="/students-life"
                    onClick={() => handleStudentsLifeTab("clubs")}
                  >
                    Clubs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/students-life"
                    onClick={() => handleStudentsLifeTab("trips")}
                  >
                    Trips
                  </Link>
                </li>
                <li>
                  <Link
                    href="/students-life"
                    onClick={() => handleStudentsLifeTab("council")}
                  >
                    Student Council
                  </Link>
                </li>
                <li>
                  <Link
                    href="/students-life"
                    onClick={() => handleStudentsLifeTab("art")}
                  >
                    Art Programs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/students-life"
                    onClick={() => handleStudentsLifeTab("events")}
                  >
                    School Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/students-life"
                    onClick={() => handleStudentsLifeTab("dining")}
                  >
                    Dining Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/students-life"
                    onClick={() => handleStudentsLifeTab("transport")}
                  >
                    Transportations
                  </Link>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <Link
                href="/hiring"
                className={pathname.startsWith("/hiring") ? "active" : ""}
              >
                <span>We are Hiring</span>
                <i className="bi bi-chevron-down toggle-dropdown" />
              </Link>
              <ul>
                <li>
                  <Link
                    href="/hiring"
                    onClick={() => handleHiringTab("opening")}
                  >
                    Openings
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hiring"
                    onClick={() => handleHiringTab("development")}
                  >
                    Professional Development
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hiring"
                    onClick={() => handleHiringTab("working")}
                  >
                    Working at LIC
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hiring"
                    onClick={() => handleHiringTab("internship")}
                  >
                    Internship Program
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hiring"
                    onClick={() => handleHiringTab("vacancies")}
                  >
                    Current Vacancies
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hiring"
                    onClick={() => handleHiringTab("other")}
                  >
                    Other Vacancies
                  </Link>
                </li>
              </ul>
            </li>

            {/* <li>
              <Link
                href="/contact"
                className={pathname.startsWith("/contact") ? "active" : ""}
              >
                Contact Us
              </Link>
            </li> */}
          </ul>
          <i className="mobile-nav-toggle d-xl-none bi bi-list" />
        </nav>
      </div>
    </header>
  );
}
