"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import EventsCard from "./EventsCard";
import AdminHeader from "@/app/components/AdminHeader";
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
  const [showEvents, setShowEvents] = useState(true);
  const router = useRouter();

  const fetchEvents = async () => {
    const res = await axios.get<EventType[]>("http://localhost:3000/events");
    setEvents(res.data);
  };

  const fetchShowEventsSetting = async () => {
    try {
      const res = await axios.get<{ showEvents: boolean }>(
        "http://localhost:3000/settings/show-events"
      );
      setShowEvents(res.data.showEvents);
    } catch (error) {
      console.error("Failed to fetch showEvents setting:", error);
    }
  };

  const handleToggleShowEvents = async () => {
    try {
      const updated = !showEvents;
      setShowEvents(updated);
      await axios.put("http://localhost:3000/settings/show-events", {
        showEvents: updated,
      });
    } catch (error) {
      console.error("Failed to update showEvents setting:", error);
    }
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
    fetchShowEventsSetting();
  }, []);

  return (
    <>
      <AdminHeader />
      <div className="admin-events-wrapper">
        <div className="admin-events">
          <div className="header-row">
            <div className="left-controls">
              <h1 className="page-title">Manage Events</h1>
              <label className="styled-switch">
                <input
                  type="checkbox"
                  checked={showEvents}
                  onChange={handleToggleShowEvents}
                />
                <span className="slider" />
                <span className="switch-label">
                  {showEvents ? "Showing on Website" : "Hidden from Website"}
                </span>
              </label>
            </div>
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
      </div>
    </>
  );
}
