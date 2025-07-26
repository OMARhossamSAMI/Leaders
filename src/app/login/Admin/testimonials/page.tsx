"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "./page.css";
import AdminHeader from "@/app/components/AdminHeader";
import AdminFooter from "@/app/components/AdminFooter";
import Image from "next/image";
interface Testimonial {
  _id: string;
  name: string;
  role: string;
  description: string;
  profilePhoto: string;
  on: boolean;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingTestimonials(true);
      try {
        const res = await axios.get<Testimonial[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/testimonials`
        );
        setTestimonials(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTestimonials(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");

    if (!token) {
      router.push("/login");
    } else {
      setAuthenticated(true);
    }
  }, [router]);
  if (!authenticated) return null; // prevent flashing

  const handleToggle = async (id: string, newState: boolean) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/testimonials/id/${id}/toggle`,
        {
          on: newState,
        }
      );
      setTestimonials((prev) =>
        prev.map((t) => (t._id === id ? { ...t, on: newState } : t))
      );
    } catch (error) {
      console.error("Toggle failed", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this testimonial?`)) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/testimonials/${id}`
      );
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
      alert("Testimonial deleted successfully.");
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete testimonial.");
    }
  };

  return (
    <>
      <AdminHeader />

      <div
        style={{
          paddingTop: "130px", // push below fixed header
          backgroundColor: "#f5f9fa",
          minHeight: "100vh",
        }}
      >
        <section className="testimonials-section">
          {/* Header OUTSIDE shadow */}
          <div className="container section-title">
            <h2>Testimonials</h2>
            <p>Manage and moderate client testimonials below.</p>
          </div>

          {/* Shadow Box with cards and Add button */}
          <div className="testimonial-box">
            <div className="text-end mb-4">
              <button
                onClick={() => router.push("/login/Admin/testimonials/create")}
                className="btn btn-primary"
              >
                + Add Testimonial
              </button>
            </div>
            {loadingTestimonials ? (
              <>
                <div className="loader-container">
                  <div className="spinner" />
                  <p className="loading-text">Loading Testimonials...</p>
                </div>

                <style jsx>{`
                  .loader-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem 1rem;
                    width: 100%;
                  }

                  .spinner {
                    width: 50px;
                    height: 50px;
                    border: 6px solid #c2c8eb;
                    border-top: 6px solid #3d9bdeff;
                    border-radius: 50%;
                    animation: spin 0.9s linear infinite;
                  }

                  .loading-text {
                    margin-top: 1rem;
                    font-size: 1.1rem;
                    font-weight: 500;
                    color: #3f9adaff;
                  }

                  @keyframes spin {
                    to {
                      transform: rotate(360deg);
                    }
                  }
                `}</style>
              </>
            ) : (
              <div className="container testimonial-grid">
                {testimonials.length === 0 ? (
                  <p
                    style={{
                      color: "#888",
                      fontStyle: "italic",
                      padding: "1rem",
                    }}
                  >
                    No testimonials added yet.
                  </p>
                ) : (
                  testimonials.map((t) => (
                    <div
                      key={t._id}
                      className={`testimonial-card ${t.on ? "active" : ""}`}
                    >
                      <div className="quote-icon">
                        <i className="bi bi-quote" />
                      </div>
                      <p className="testimonial-text">{t.description}</p>
                      <hr />
                      <div className="client-info-row">
                        <Image
                          src={t.profilePhoto ?? "/default-avatar.png"}
                          alt="Client"
                          className="client-avatar"
                          width={100} // ✅ required
                          height={100} // ✅ required
                          unoptimized // ⬅️ Optional: disable image optimization for local/static links
                        />
                        <div className="client-info">
                          <div className="client-name">{t.name}</div>
                          <div className="client-role">{t.role}</div>
                        </div>
                        <div className="toggle-switch">
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={t.on}
                              onChange={(e) =>
                                handleToggle(t._id, e.target.checked)
                              }
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </div>

                      <div className="testimonial-actions d-flex gap-2 mt-2">
                        <button
                          className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                          onClick={() =>
                            router.push(
                              `/login/Admin/testimonials/update?id=${encodeURIComponent(
                                t._id
                              )}`
                            )
                          }
                        >
                          <i className="bi bi-pencil-square"></i> Update
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                          onClick={() => handleDelete(t._id)}
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </section>
      </div>
      <AdminFooter />
    </>
  );
}
