"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./admin.css";

export default function AdminHeader() {
  const pathname = usePathname();

  return (
    <header id="header" className="header d-flex align-items-center fixed-top">
      <div className="container-fluid container-xl d-flex align-items-center justify-content-start">
        {/* Logo + Title */}
        <Link href="/login/Admin" className="logo d-flex align-items-center me-4">
          <img
            src="/assets/img/lic_logo.png"
            alt="Leaders Logo"
            style={{ height: 40, marginRight: 10 }}
          />
          <h1 className="sitename mb-0">Leaders International College</h1>
        </Link>

        {/* Navigation */}
        <nav id="navmenu" className="navmenu">
          <ul>
            <li>
              <Link
                href="/login/Admin"
                className={pathname === "/login/Admin" ? "active" : ""}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/login/Admin/school_app"
                className={pathname.includes("/school_app") ? "active" : ""}
              >
                Student App
              </Link>
            </li>
            <li>
              <Link
                href="/login/Admin/Internship"
                className={pathname.includes("/Internship") ? "active" : ""}
              >
                Internships
              </Link>
            </li>
            <li>
              <Link
                href="/login/Admin/Vacancy"
                className={pathname.includes("/Vacancy") ? "active" : ""}
              >
                Vacancies
              </Link>
            </li>
            <li>
              <Link
                href="/login/Admin/events"
                className={pathname.includes("/events") ? "active" : ""}
              >
                Events
              </Link>
            </li>
            <li>
              <Link
                href="/login/Admin/testimonials"
                className={pathname.includes("/testimonials") ? "active" : ""}
              >
                Testimonials
              </Link>
            </li>
            <li>
              <Link
                href="/login/Admin/popup"
                className={pathname.includes("/popup") ? "active" : ""}
              >
                Pop Up Messages
              </Link>
            </li>
            <li>
              <Link
                href="/login/Admin/contactus"
                className={pathname.includes("/contactus") ? "active" : ""}
              >
                Contact Messages
              </Link>
            </li>
          </ul>
          <i className="mobile-nav-toggle d-xl-none bi bi-list" />
        </nav>
      </div>
    </header>
  );
}
