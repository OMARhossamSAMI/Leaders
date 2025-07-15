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
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [form, setForm] = useState<EventType>({
    title: "",
    description: "",
    category: "ACADEMIC",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    status: "off",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setShowCustomCategory(
          ![
            "ACADEMIC",
            "SPORTS",
            "ARTS",
            "MUSIC",
            "COMMUNITY",
            "SCIENCE",
            "FIELD_TRIP",
            "WORKSHOP",
            "OTHER",
          ].includes(fetched.category)
        );
      });
  }, [title]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateTimeSlots = () => {
    const slots: string[] = [];
    const start = new Date();
    start.setHours(7, 0, 0);
    for (let i = 0; i <= 17 * 2; i++) {
      const hour = new Date(start.getTime() + i * 30 * 60000);
      const time = hour.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      slots.push(time);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.put(`http://localhost:3000/events/${title}`, form);
      router.push("/login/Admin/events");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to update event.";
      setError(typeof msg === "string" ? msg : msg.join(" \n "));
    } finally {
      setLoading(false);
    }
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
          <select
            name="category"
            value={form.category}
            onChange={(e) => {
              const value = e.target.value;
              setShowCustomCategory(value === "OTHER");
              handleChange(e);
            }}
            required
          >
            <option value="">Select Category</option>
            <option value="ACADEMIC">Academic</option>
            <option value="SPORTS">Sports</option>
            <option value="ARTS">Arts</option>
            <option value="MUSIC">Music</option>
            <option value="COMMUNITY">Community</option>
            <option value="SCIENCE">Science</option>
            <option value="FIELD_TRIP">Field Trip</option>
            <option value="WORKSHOP">Workshop</option>
            <option value="OTHER">Other</option>
          </select>

          {showCustomCategory && (
            <input
              type="text"
              name="category"
              placeholder="Enter your custom category"
              className="custom-category-input"
              value={form.category !== "OTHER" ? form.category : ""}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value.toUpperCase() })
              }
              required
            />
          )}

          <label>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          <label>Start Time</label>
          <select
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
          >
            <option value="">Select Start Time</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>

          <label>End Time</label>
          <select
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
          >
            <option value="">Select End Time</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>

          <label>Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
          />
          {error && <p className="error-message">{error}</p>}
          {loading && <p className="loading-message">Updating event...</p>}

          <button type="submit" disabled={loading}>
            Update Event
          </button>
        </form>
      </div>
    </div>
  );
}
