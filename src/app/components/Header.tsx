"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTabs } from "./TabsContext";
import { useCurriculum } from "../components/CurriculumContext";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { setActiveSection } = useTabs();
  const { setCurriculumTab } = useCurriculum();

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
              <a
                href="/about"
                className={pathname.startsWith("/about") ? "active" : ""}
              >
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
            <li>
              <a
                href="/students-life"
                className={
                  pathname.startsWith("/students-life") ? "active" : ""
                }
              >
                Students Life
              </a>
            </li>
            <li>
              <a
                href="/hiring"
                className={pathname.startsWith("/hiring") ? "active" : ""}
              >
                We Are Hiring
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className={pathname.startsWith("/contact") ? "active" : ""}
              >
                Contact Us
              </a>
            </li>
          </ul>
          <i className="mobile-nav-toggle d-xl-none bi bi-list" />
        </nav>
      </div>
    </header>
  );
}
