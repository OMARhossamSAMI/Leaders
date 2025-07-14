"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import "./form.css";

export default function UpdateTestimonial() {
  const router = useRouter();
  const { name } = useParams(); // from the route `/update/[name]`

  const [form, setForm] = useState({
    name: "",
    role: "",
    description: "",
    profilePhoto: "",
  });

const safeName = typeof name === "string" ? name : name?.[0] || "";

useEffect(() => {
  if (safeName) {
    axios
      .get<{ name: string; role: string; description: string; profilePhoto: string }>(
        `http://localhost:3000/testimonials/name/${encodeURIComponent(safeName)}`
      )
      .then((res) => setForm(res.data))
      .catch((err) => console.error("Failed to load testimonial", err));
  }
}, [safeName]);


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
      await axios.put(
        `http://localhost:3000/testimonials/${encodeURIComponent(name as string)}`,
        form
      );
      router.push("/login/testimonials");
    } catch (err) {
      console.error("Failed to update testimonial", err);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ textAlign: "center" }}>Update Testimonial</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Role
          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Profile Photo
          <input type="file" accept="image/*" onChange={handleFile} />
        </label>

        <div className="buttons-row">
          <button type="submit" className="submit-btn">
            Update
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
