"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import "./form.css";
import { useSearchParams } from "next/navigation";

export default function UpdateTestimonial() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const safeId = searchParams.get("id");

  const [form, setForm] = useState({
    name: "",
    role: "",
    description: "",
    profilePhoto: "",
  });

  useEffect(() => {
    if (safeId) {
      axios
        .get<{
          name: string;
          role: string;
          description: string;
          profilePhoto: string;
        }>(`http://localhost:3000/testimonials/${safeId}`)
        .then((res) => {
          setForm(res.data);
        })
        .catch((err) => {
          console.error(`Failed to load testimonial for id: "${safeId}"`, err);
        });
    }
  }, [safeId]);

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
      await axios.patch(`http://localhost:3000/testimonials/${safeId}`, form);
      router.push("/login/Admin/testimonials");
    } catch (err) {
      console.error("Failed to update testimonial", err);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this testimonial?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/testimonials/${safeId}`);
      alert("Testimonial deleted successfully.");
      router.push("/login/testimonials");
    } catch (err) {
      console.error("Failed to delete testimonial", err);
      alert("Failed to delete testimonial.");
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
          <button
            type="button"
            className="delete-btn"
            onClick={handleDelete}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#d9534f",
              color: "white",
              border: "none",
              padding: "10px 14px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </form>
    </div>
  );
}
