"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "./admin.css";
import Image from "next/image";

export default function AdminHeader() {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = sessionStorage.getItem("admin_role");
    setRole(storedRole);
  }, []);

  const links = [
    {
      href: "/login/Admin",
      label: "Dashboard",
      roles: ["it", "hr", "Admission"],
    },
    {
      href: "/login/Admin/school_app",
      label: "Student App",
      roles: ["it", "Admission"],
    },
    {
      href: "/login/Admin/Internship",
      label: "Internships",
      roles: ["it", "hr"],
    },
    {
      href: "/login/Admin/Vacancy",
      label: "Vacancies",
      roles: ["it", "hr"],
    },
    {
      href: "/login/Admin/events",
      label: "Events",
      roles: ["it"],
    },
    {
      href: "/login/Admin/testimonials",
      label: "Testimonials",
      roles: ["it"],
    },
    {
      href: "/login/Admin/popup",
      label: "Pop Up Messages",
      roles: ["it"],
    },
    {
      href: "/login/Admin/contactus",
      label: "Contact Us",
      roles: ["it"],
    },
  ];

  const visibleLinks = links.filter((link) => link.roles.includes(role || ""));

  return (
    <header id="header" className="header d-flex align-items-center fixed-top">
      <div className="container-fluid container-xl d-flex align-items-center justify-content-start">
        {/* Logo + Title */}
        <Link
          href="/login/Admin"
          className="logo d-flex align-items-center me-4"
        >
          <Image
            src="/assets/img/lic_logo.png"
            alt="Leaders Logo"
            width={40} // Specify actual width if known; use same height ratio if needed
            height={40}
            style={{ marginRight: 10 }}
          />
          <h1 className="sitename mb-0">Leaders International College</h1>
        </Link>

        {/* Navigation */}
        <nav id="navmenu" className="navmenu">
          <ul>
            {visibleLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (pathname.startsWith(link.href) &&
                  link.href !== "/login/Admin");

              const finalLabel =
                role === "Admission" && link.href === "/login/Admin/school_app"
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
          <i className="mobile-nav-toggle d-xl-none bi bi-list" />
        </nav>
      </div>
    </header>
  );
}
