"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import '../update/[id]/form.css';

export default function CreateTestimonial() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    role: "",
    description: "",
    profilePhoto: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      await axios.post("http://localhost:3000/testimonials", form);
      router.push("/login/Admin/testimonials");
    } catch (err) {
      console.error("Failed to create testimonial", err);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ textAlign: "center" }}>Add Testimonial</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="role" placeholder="Role" value={form.role} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input type="file" accept="image/*" onChange={handleFile} required />
        <div className="buttons-row">
          <button type="submit" className="submit-btn">Submit</button>
          <button type="button" className="cancel-btn" onClick={() => router.back()}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
