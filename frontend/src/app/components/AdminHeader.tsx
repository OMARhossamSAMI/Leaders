"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import "./admin.css";

type Role = "it" | "hr" | "Admission" | "";

type NavItem = {
  href: string;
  label: string;
  roles: Role[];
};

type NavGroup = {
  key: string;
  title: string; // group title shown in the navbar
  items: NavItem[];
};

export default function AdminHeader() {
  const pathname = usePathname();

  // --- State (top-level only) ---
  const [role, setRole] = useState<Role>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showToggle, setShowToggle] = useState(false);

  // desktop dropdown state (which group is open)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // sidebar accordion state
  const [sidebarOpenGroups, setSidebarOpenGroups] = useState<Record<string, boolean>>({});
  const toggleSidebarGroup = (key: string) =>
    setSidebarOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  // --- Effects ---
  useEffect(() => {
    const storedRole = (typeof window !== "undefined"
      ? sessionStorage.getItem("admin_role")
      : "") as Role | null;
    setRole((storedRole as Role) || "");
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const nav = document.querySelector(".navmenu");
      if (nav) {
        const navRect = nav.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        setShowToggle(navRect.right > windowWidth - 40);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Data ---
  const dashboard: NavItem = {
    href: "/lic-auth-v9v3tz/Admin",
    label: "Dashboard",
    roles: ["it", "hr", "Admission"],
  };

  const groups: NavGroup[] = [
    {
      key: "applications",
      title: "Applications",
      items: [
        {
          href: "/lic-auth-v9v3tz/Admin/school_app",
          label: role === "Admission" ? "Student Application" : "Student App",
          roles: ["it", "Admission"],
        },
        {
          href: "/lic-auth-v9v3tz/Admin/assessment-appointments",
          label: "Assessment appointments",
          roles: ["it", "Admission"],
        },
        {
          href: "/lic-auth-v9v3tz/Admin/booktour",
          label: "Book a tour slots",
          roles: ["it", "Admission"],
        },
      ],
    },
    {
      key: "jobs",
      title: "Jobs",
      items: [
        { href: "/lic-auth-v9v3tz/Admin/Internship", label: "Internships", roles: ["it", "hr"] },
        { href: "/lic-auth-v9v3tz/Admin/Vacancy", label: "Vacancies", roles: ["it", "hr"] },
      ],
    },
    {
      key: "content",
      title: "Content",
      items: [
        { href: "/lic-auth-v9v3tz/Admin/events", label: "Events", roles: ["it"] },
        { href: "/lic-auth-v9v3tz/Admin/testimonials", label: "Testimonials", roles: ["it"] },
        { href: "/lic-auth-v9v3tz/Admin/popup", label: "Pop Up Messages", roles: ["it"] },
        { href: "/lic-auth-v9v3tz/Admin/contactus", label: "Contact Us", roles: ["it"] },
      ],
    },
  ];

  // --- Helpers ---
  const isActiveHref = (href: string) =>
    pathname === href || (pathname.startsWith(href) && href !== "/lic-auth-v9v3tz/Admin");

  const isGroupActive = (g: NavGroup) => g.items.some((i) => isActiveHref(i.href));

  // Visible (role-filtered)
  const visibleDashboard = dashboard.roles.includes(role);
  const visibleGroups = useMemo(
    () =>
      groups
        .map((g) => ({ ...g, items: g.items.filter((i) => i.roles.includes(role)) }))
        .filter((g) => g.items.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [role] // groups is static; only role changes filtering
  );

  return (
    <>
      <header className="header d-flex align-items-center fixed-top">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          {/* Logo */}
          <Link href="/lic-auth-v9v3tz/Admin" className="logo d-flex align-items-center">
            <Image src="/assets/img/lic_logo.png" alt="Logo" width={40} height={40} />
          </Link>

          {/* Desktop nav (dropdowns) */}
          <nav className="navmenu d-none d-md-flex">
            <ul style={{ display: "flex", alignItems: "center", gap: "1.5rem", margin: 0 }}>
              {visibleDashboard && (
                <li>
                  <Link
                    href={dashboard.href}
                    className={isActiveHref(dashboard.href) ? "active" : ""}
                  >
                    {dashboard.label}
                  </Link>
                </li>
              )}

              {visibleGroups.map((group) => {
                const active = isGroupActive(group);
                const open = openDropdown === group.key;

                return (
                  <li
                    key={group.key}
                    className={`dropdown ${active ? "active" : ""} ${open ? "show" : ""}`}
                    style={{ position: "relative" }}
                    onMouseEnter={() => setOpenDropdown(group.key)}
                    onMouseLeave={() =>
                      setOpenDropdown((prev) => (prev === group.key ? null : prev))
                    }
                  >
                    <button
                      type="button"
                      className={`dropdown-toggle-btn ${active ? "active" : ""}`}
                      onClick={() => setOpenDropdown(open ? null : group.key)}
                      aria-expanded={open}
                      aria-haspopup="true"
                      style={{
                        background: "transparent",
                        border: "none",
                        fontWeight: active ? 700 : 600,
                        cursor: "pointer",
                        padding: "8px 10px",
                      }}
                    >
                      {group.title}{" "}
                      <i className={`bi ${open ? "bi-chevron-up" : "bi-chevron-down"}`} />
                    </button>

                    <div
                      className={`dropdown-menu ${open ? "show" : ""}`}
                      role="menu"
                    >
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={isActiveHref(item.href) ? "active" : ""}
                          onClick={() => setOpenDropdown(null)}
                          role="menuitem"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Toggle Sidebar if space is limited */}
          {showToggle && (
            <i className="sidebar-toggle bi bi-list" onClick={() => setSidebarOpen(true)} />
          )}
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar (accordion) */}
      <aside className={`sidebar sidebar-right ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <Image src="/assets/img/lic_logo.png" alt="Logo" width={40} height={40} />
          <i className="bi bi-x close-btn" onClick={() => setSidebarOpen(false)} />
        </div>

        <ul className="sidebar-links">
          {visibleDashboard && (
            <li>
              <Link
                href={dashboard.href}
                className={isActiveHref(dashboard.href) ? "active" : ""}
                onClick={() => setSidebarOpen(false)}
              >
                {dashboard.label}
              </Link>
            </li>
          )}

          {visibleGroups.map((group) => {
            const active = isGroupActive(group);
            const expanded = !!sidebarOpenGroups[group.key];

            return (
              <li key={group.key} className="sidebar-group">
                <button
                  className={`sidebar-accordion ${active ? "active" : ""}`}
                  onClick={() => toggleSidebarGroup(group.key)}
                  aria-expanded={expanded}
                >
                  {group.title}
                  <i className={`bi ${expanded ? "bi-chevron-up" : "bi-chevron-down"}`} />
                </button>

                {expanded && (
                  <ul className="sidebar-sub-links">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={isActiveHref(item.href) ? "active" : ""}
                          onClick={() => setSidebarOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
}
