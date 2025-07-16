"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "./page.css";

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

  useEffect(() => {
    axios
      .get<Testimonial[]>("http://localhost:3000/testimonials")
      .then((res) => setTestimonials(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleToggle = async (id: string, newState: boolean) => {
    try {
      await axios.patch(`http://localhost:3000/testimonials/id/${id}/toggle`, {
        on: newState,
      });
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
      await axios.delete(`http://localhost:3000/testimonials/${id}`);
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
      alert("Testimonial deleted successfully.");
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete testimonial.");
    }
  };

  return (
    <section className="testimonials-section">
      <div className="container section-title">
        <h2>Testimonials</h2>
        <p>Manage and moderate client testimonials below.</p>
        <div className="text-end">
          <button
            onClick={() => router.push("/login/testimonials/create")}
            className="btn btn-primary"
          >
            + Add Testimonial
          </button>
        </div>
      </div>

      <div className="container testimonial-grid">
        {testimonials.map((t) => (
          <div key={t._id} className={`testimonial-card ${t.on ? "active" : ""}`}>
            <div className="quote-icon">
              <i className="bi bi-quote" />
            </div>
            <p className="testimonial-text">{t.description}</p>
            <hr />
            <div className="client-info-row">
              <img
                src={t.profilePhoto}
                alt="Client"
                className="client-avatar"
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
                    onChange={(e) => handleToggle(t._id, e.target.checked)} // ✅ fixed here
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
                    `/login/testimonials/update/${encodeURIComponent(t._id)}`
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
        ))}
      </div>
    </section>
  );
}
