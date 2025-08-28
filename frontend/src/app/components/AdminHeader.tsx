"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "./admin.css";
import Image from "next/image";

export default function AdminHeader() {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showToggle, setShowToggle] = useState(false);

  useEffect(() => {
    const storedRole = sessionStorage.getItem("admin_role");
    setRole(storedRole);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const nav = document.querySelector(".navmenu");
      if (nav) {
        const navRect = nav.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        setShowToggle(navRect.right > windowWidth - 40); // account for margin
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const links = [
    {
      href: "/lic-auth-v9v3tz/Admin",
      label: "Dashboard",
      roles: ["it", "hr", "Admission"],
    },
    {
      href: "/lic-auth-v9v3tz/Admin/school_app",
      label: "Student App",
      roles: ["it", "Admission"],
    },
    {
      href: "/lic-auth-v9v3tz/Admin/assessment-appointments",
      label: "Assessment appointments",
      roles: ["it", "Admission"],
    },

    {
      href: "/lic-auth-v9v3tz/Admin/booktour",
      label: "book a tour slots",
      roles: ["it", "Admission"],
    },

    {
      href: "/lic-auth-v9v3tz/Admin/Internship",
      label: "Internships",
      roles: ["it", "hr"],
    },
    {
      href: "/lic-auth-v9v3tz/Admin/Vacancy",
      label: "Vacancies",
      roles: ["it", "hr"],
    },
    { href: "/lic-auth-v9v3tz/Admin/events", label: "Events", roles: ["it"] },
    {
      href: "/lic-auth-v9v3tz/Admin/testimonials",
      label: "Testimonials",
      roles: ["it"],
    },
    {
      href: "/lic-auth-v9v3tz/Admin/popup",
      label: "Pop Up Messages",
      roles: ["it"],
    },
    {
      href: "/lic-auth-v9v3tz/Admin/contactus",
      label: "Contact Us",
      roles: ["it"],
    },
  ];

  const visibleLinks = links.filter((link) => link.roles.includes(role || ""));

  return (
    <>
      <header className="header d-flex align-items-center fixed-top">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          {/* Logo only */}
          <Link
            href="/lic-auth-v9v3tz/Admin"
            className="logo d-flex align-items-center"
          >
            <Image
              src="/assets/img/lic_logo.png"
              alt="Logo"
              width={40}
              height={40}
            />
          </Link>
          {/* Navigation menu (hidden on small screens) */}
          <nav className="navmenu d-none d-md-flex">
            <ul>
              {visibleLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (pathname.startsWith(link.href) &&
                    link.href !== "/lic-auth-v9v3tz/Admin");

                const finalLabel =
                  role === "Admission" &&
                  link.href === "/lic-auth-v9v3tz/Admin/school_app"
                    ? "Student Application"
                    : link.label;

                return (
                  <li key={link.href}>
                    <Link href={link.href} className={isActive ? "active" : ""}>
                      {finalLabel}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Toggle Sidebar if space is limited */}
          {showToggle && (
            <i
              className="sidebar-toggle bi bi-list"
              onClick={() => setSidebarOpen(true)}
            />
          )}
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar - from right */}
      <aside className={`sidebar sidebar-right ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <Image
            src="/assets/img/lic_logo.png"
            alt="Logo"
            width={40}
            height={40}
          />
          <i
            className="bi bi-x close-btn"
            onClick={() => setSidebarOpen(false)}
          />
        </div>

        <ul className="sidebar-links">
          {visibleLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (pathname.startsWith(link.href) &&
                link.href !== "/lic-auth-v9v3tz/Admin");

            const finalLabel =
              role === "Admission" &&
              link.href === "/lic-auth-v9v3tz/Admin/school_app"
                ? "Student Application"
                : link.label;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={isActive ? "active" : ""}
                  onClick={() => setSidebarOpen(false)}
                >
                  {finalLabel}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
}
