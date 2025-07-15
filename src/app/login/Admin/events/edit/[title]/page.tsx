"use client";

import "./page.css";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
type EventType = {
  title: string;
  description: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: string;
};

export default function EditEventPage() {
  const { title } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "ACADEMIC",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    status: "off",
  });

  useEffect(() => {
    axios
      .get<EventType>(`http://localhost:3000/events/${title}`)
      .then((res) => {
        const fetched = res.data;
        setForm({
          title: fetched.title,
          description: fetched.description,
          category: fetched.category,
          date: fetched.date.split("T")[0],
          startTime: fetched.startTime,
          endTime: fetched.endTime,
          location: fetched.location,
          status: fetched.status,
        });
      });
  }, [title]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await axios.put(`http://localhost:3000/events/${title}`, form);
    router.push("/login/Admin/events");
  };

  return (
    <div className="edit-form-wrapper">
      <div className="edit-page-container">
        <form onSubmit={handleSubmit} className="edit-form">
          <h2>Edit Event</h2>

          <label>Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <label>Category</label>
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="ACADEMIC">Academic</option>
            <option value="SPORTS">Sports</option>
            <option value="ARTS">Arts</option>
          </select>

          <label>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          <label>Start Time</label>
          <input
            type="text"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
          />

          <label>End Time</label>
          <input
            type="text"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
          />

          <label>Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
          />

          <button type="submit">Update Event</button>
        </form>
      </div>
    </div>
  );
}
