"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import EventsCard from "./EventsCard";
import AdminHeader from "@/app/components/AdminHeader";
import "./events.css";
import AdminFooter from "@/app/components/AdminFooter";

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
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const router = useRouter();

  const fetchEvents = async () => {
    setLoadingEvents(true); // Start loading
    try {
      const res = await axios.get<EventType[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/events`
      );
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoadingEvents(false); // Stop loading
    }
  };

  const fetchShowEventsSetting = async () => {
    try {
      const res = await axios.get<{ showEvents: boolean }>(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/show-events`
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
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/show-events`,
        {
          showEvents: updated,
        }
      );
    } catch (error) {
      console.error("Failed to update showEvents setting:", error);
    }
  };

  const handleDelete = async (title: string) => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/events/${title}`);
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
  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");

    if (!token) {
      router.push("/login");
    } else {
      setAuthenticated(true);
    }
    setLoading(false);
  }, [router]);
  if (loading || !authenticated) return null; // prevent flashing
  return (
    <>
      <AdminHeader />
      <div className="admin-events-wrapper">
        <div className="container section-title">
          <h2>Manage Events</h2>
          <p>View, edit, or delete upcoming events shown on the website.</p>
        </div>

        {/* Shadow Box */}
        <div className="event-shadow-box">
          <div className="event-controls">
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
            <button className="add-btn" onClick={handleCreate}>
              + Create Event
            </button>
          </div>

          {loadingEvents ? (
            <>
              <div className="loader-container">
                <div className="spinner" />
                <p className="loading-text">Loading Events...</p>
              </div>

              <style jsx>{`
                .loader-container {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  padding: 4rem 1rem;
                  width: 100%;
                }

                .spinner {
                  width: 50px;
                  height: 50px;
                  border: 6px solid #c2c8eb;
                  border-top: 6px solid #3d9bdeff;
                  border-radius: 50%;
                  animation: spin 0.9s linear infinite;
                }

                .loading-text {
                  margin-top: 1rem;
                  font-size: 1.1rem;
                  font-weight: 500;
                  color: #3f9adaff;
                }

                @keyframes spin {
                  to {
                    transform: rotate(360deg);
                  }
                }
              `}</style>
            </>
          ) : (
            <div className="event-grid">
              {events.length === 0 ? (
                <p
                  style={{
                    color: "#888",
                    fontStyle: "italic",
                    padding: "1rem",
                  }}
                >
                  No events created yet.
                </p>
              ) : (
                events.map((event) => (
                  <EventsCard
                    key={event.title}
                    event={event}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <AdminFooter />
    </>
  );
}
