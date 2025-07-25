"use client";
import "./page.css";
import { useState, useEffect } from "react";
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

  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await axios.post("http://localhost:3000/events", form);
      router.push("/login/Admin/events");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to create event.";
      setError(typeof message === "string" ? message : message.join(", "));
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Generate 12-hour formatted time slots with AM/PM (e.g., 09:00 AM)
  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 7; hour <= 24; hour++) {
      for (let min of [0, 30]) {
        const date = new Date();
        date.setHours(hour, min);
        const options: Intl.DateTimeFormatOptions = {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        };
        const formatted = date.toLocaleTimeString("en-US", options);
        slots.push(formatted);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");

    if (!token) {
      router.push("/login");
    } else {
      setAuthenticated(true);
    }
  }, [router]);
  if (!authenticated) return null; // prevent flashing
  return (
    <div className="create-form-wrapper">
      <form className="create-form" onSubmit={handleSubmit}>
        <h2>Create New Event</h2>

        {error && <div className="error-message">{error}</div>}

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
          value={showCustomCategory ? "OTHER" : form.category}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "OTHER") {
              setShowCustomCategory(true);
              setForm({ ...form, category: "" }); // reset for user input
            } else {
              setShowCustomCategory(false);
              setForm({ ...form, category: value });
            }
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
            name="customCategory"
            placeholder="Enter your custom category"
            className="custom-category-input"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value.toUpperCase() })
            }
            required
          />
        )}

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <label htmlFor="startTime">Start Time:</label>
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

        <label htmlFor="endTime">End Time:</label>
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

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
