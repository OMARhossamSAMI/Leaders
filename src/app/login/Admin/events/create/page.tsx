"use client";
import "./page.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CreateEventPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "ACADEMIC",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/events", form);
      router.push("/login/Admin/events");
    } catch (err) {
      alert("Failed to create event.");
    }
  };

  return (
    <div className="create-form-wrapper">
      <form className="create-form" onSubmit={handleSubmit}>
        <h2>Create New Event</h2>

        <input
          name="title"
          placeholder="Event Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="Event Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="ACADEMIC">Academic</option>
          <option value="SPORTS">Sports</option>
          <option value="OTHER">Other</option>
        </select>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <input
          name="startTime"
          placeholder="Start Time (e.g. 09:00 AM)"
          value={form.startTime}
          onChange={handleChange}
          required
        />
        <input
          name="endTime"
          placeholder="End Time (e.g. 03:00 PM)"
          value={form.endTime}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}
