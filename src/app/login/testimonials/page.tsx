"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import "./page.css"; // optional for custom styling

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

  useEffect(() => {
    axios
  .get<Testimonial[]>("http://localhost:3000/testimonials")
  .then((res) => setTestimonials(res.data))
  .catch((err) => console.error(err));
}, []);

  const handleToggle = async (name: string, newState: boolean) => {
  try {
    await axios.patch(`http://localhost:3000/testimonials/name/${encodeURIComponent(name)}/toggle`, {
      on: newState,
    });
    setTestimonials((prev) =>
      prev.map((t) =>
        t.name === name ? { ...t, on: newState } : t
      )
    );
  } catch (error) {
    console.error("Failed to toggle state", error);
  }
};


  return (
    <section id="testimonials" className="testimonials section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Testimonials</h2>
        <p>
          Manage and moderate client testimonials below.
        </p>
      </div>

      <div className="container">
        <div className="testimonial-grid">
          {testimonials.map((t) => (
            <div key={t._id} className="testimonial-card">
              <div className="quote-icon">
                <i className="bi bi-quote" />
              </div>
              <p className="testimonial-text">{t.description}</p>
              <hr />
              <div className="client-row">
                <img
                  src={t.profilePhoto}
                  alt="Client"
                  className="client-avatar"
                />
                <div className="client-meta">
                  <strong>{t.name}</strong>
                  <div className="role">{t.role}</div>
                </div>
                <div className="toggle-switch">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={t.on}
                      onChange={(e) => handleToggle(t.name, e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
