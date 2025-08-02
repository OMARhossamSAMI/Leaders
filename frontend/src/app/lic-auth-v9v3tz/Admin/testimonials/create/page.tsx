"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import "../update/form.css";

export default function CreateTestimonial() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    role: "",
    description: "",
    profilePhoto: "",
  });
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");

    if (!token) {
      router.push("/lic-auth-v9v3tz");
    } else {
      setAuthenticated(true);
    }
  }, [router]);
  if (!authenticated) return null; // prevent flashing
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, profilePhoto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/testimonials`, form);
      router.push("/lic-auth-v9v3tz/Admin/testimonials");
    } catch (err) {
      console.error("Failed to create testimonial", err);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ textAlign: "center" }}>Add Testimonial</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="role"
          placeholder="Role"
          value={form.role}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input type="file" accept="image/*" onChange={handleFile} required />
        <div className="buttons-row">
          <button type="submit" className="submit-btn">
            Submit
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
