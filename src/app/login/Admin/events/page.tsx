"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import EventsCard from "./EventsCard";
import "./events.css";

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

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const router = useRouter();

  const fetchEvents = async () => {
    const res = await axios.get<EventType[]>("http://localhost:3000/events");
    setEvents(res.data);
  };

  const handleDelete = async (title: string) => {
    await axios.delete(`http://localhost:3000/events/${title}`);
    fetchEvents();
  };

  const handleEdit = (title: string) => {
    router.push(`/login/Admin/events/edit/${encodeURIComponent(title)}`);
  };

  const handleCreate = () => {
    router.push("/login/Admin/events/create");
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="admin-events">
      <div className="header">
        <h1 className="page-title">Manage Events</h1>

        <button className="add-btn" onClick={handleCreate}>
          + Create Event
        </button>
      </div>

      <div className="event-grid">
        {events.map((event) => (
          <EventsCard
            key={event.title}
            event={event}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
