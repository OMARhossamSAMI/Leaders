"use client";

import Link from "next/link";
import { useEffect } from "react";
import AdminHeader from "@/app/components/AdminHeader";
import AdminFooter from "@/app/components/AdminFooter";

export default function AdminPage() {
  useEffect(() => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      const timer = setTimeout(() => {
        preloader.style.display = "none";
      }, 15);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <AdminHeader />
      <main className="main admin-dashboard" style={{ paddingTop: "130px" }}>
        <div className="container py-5">
          <h1 className="text-center mb-5 admin-heading">
            <i className="bi bi-speedometer2 me-2"></i>
            Admin Dashboard
          </h1>
          <div className="row g-4">
            {[
              {
                icon: "bi-person-lines-fill",
                title: "School Applications",
                description:
                  "Manage all student applications submitted through the school’s admission forms.",
                href: "/login/Admin/school_app",
                color: "#007bff",
              },
              {
                icon: "bi-laptop",
                title: "Internship Applications",
                description:
                  "Review and manage internship application forms for external candidates.",
                href: "/login/Admin/Internship",
                color: "#17a2b8",
              },
              {
                icon: "bi-briefcase-fill",
                title: "Vacancy Applications",
                description:
                  "Track and process job applications for school vacancies.",
                href: "/login/Admin/Vacancy",
                color: "#ffc107",
              },
              {
                icon: "bi-calendar-event-fill",
                title: "Events",
                description:
                  "Add, update, or delete school events and activities.",
                href: "/login/Admin/events",
                color: "#28a745",
              },
              {
                icon: "bi-chat-left-quote-fill",
                title: "Testimonials",
                description:
                  "Manage testimonials from students, parents, and staff.",
                href: "/login/testimonials",
                color: "#6f42c1",
              },
              {
                icon: "bi-window-fullscreen",
                title: "Popup Message",
                description:
                  "Create or update the homepage popup that appears for first-time visitors.",
                href: "/login/Admin/popup",
                color: "#fd7e14",
              },
              {
                icon: "bi-envelope-paper-fill",
                title: "Contact Messages",
                description:
                  "View and respond to messages submitted via the Contact Us form.",
                href: "/login/Admin/contactus",
                color: "#dc3545",
              },
            ].map((card, index) => (
              <div
                key={index}
                className="col-lg-4 col-md-6"
                data-aos="fade-up"
                data-aos-delay={(index + 1) * 100}
              >
                <div className="admin-card text-center">
                  <div
                    className="admin-card-icon"
                    style={{ backgroundColor: card.color }}
                  >
                    <i className={`bi ${card.icon}`} />
                  </div>
                  <h4>{card.title}</h4>
                  <p>{card.description}</p>
                  <Link href={card.href} className="admin-card-link">
                    Go to {card.title}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div id="preloader"></div>
      </main>

      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          height: 100%;
          background: #c2c8ebff !important;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif !important;
        }

        .admin-dashboard {
          min-height: 100vh;
        }

        .admin-heading {
          font-size: 2.75rem;
          font-weight: 700;
          color: #003a63;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-card {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          padding: 2rem;
          transition: all 0.3s ease-in-out;
          height: 100%;
        }

        .admin-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        .admin-card-icon {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-size: 2.25rem;
          color: white;
          transition: transform 0.6s ease-in-out;
        }

        .admin-card-icon:hover {
          transform: rotateY(360deg) scale(1.1);
        }

        .admin-card h4 {
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: #003a63;
        }

        .admin-card p {
          color: #555;
          font-size: 0.96rem;
        }

        .admin-card-link {
          color: #007bff;
          font-weight: 600;
          display: inline-block;
          margin-top: 1rem;
          text-decoration: none;
        }

        .admin-card-link:hover {
          text-decoration: underline;
        }
      `}</style>
                <AdminFooter />
      
    </>
  );
}
