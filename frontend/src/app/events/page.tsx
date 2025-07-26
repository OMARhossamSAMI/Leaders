"use client";

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
// Type definition for events
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

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);

  // Hide preloader after short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      const preloader = document.getElementById("preloader");
      if (preloader) preloader.style.display = "none";
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Fetch visible events only if global switch is on
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, settingsRes] = await Promise.all([
          axios.get<EventType[]>(
            `${process.env.NEXT_PUBLIC_API_URL}/events/visible`
          ),
          axios.get<{ showEvents: boolean }>(
            `${process.env.NEXT_PUBLIC_API_URL}/settings/show-events`
          ),
        ]);

        if (settingsRes.data.showEvents) {
          setEvents(eventsRes.data);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error("Failed to fetch events or settings:", err);
      }
    };

    fetchData();
  }, []);

  // Calendar logic
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const eventDaysInCurrentMonth = useMemo(() => {
    return events
      .map((e) => new Date(e.date))
      .filter(
        (d) => d.getMonth() === currentMonth && d.getFullYear() === currentYear
      )
      .map((d) => d.getDate());
  }, [events, currentMonth, currentYear]); // ✅ Add these

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarDays: (number | "")[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push("");
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);
  while (calendarDays.length < 42) calendarDays.push("");

  return (
    <>
      <main className="main">
        {/* Page Title */}
        <div
          className="page-title dark-background"
          style={{
            backgroundImage: "url(assets/img/Event-Photo.JPG)",
          }}
        >
          <div className="container position-relative">
            <h1>School Events</h1>
            <p>
              Explore upcoming activities and events happening at our school
              campus.
            </p>
            <nav className="breadcrumbs">
              <ol>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li className="current">Events</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Events Section */}
        <section id="events-2" className="events-2 section">
          <div className="container" data-aos="fade-up" data-aos-delay={100}>
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="events-list">
                  {events.map((event, index) => {
                    const eventDate = new Date(event.date);
                    const day = eventDate.getDate();
                    const month = eventDate
                      .toLocaleString("en-US", { month: "short" })
                      .toUpperCase();

                    return (
                      <div
                        className="event-item"
                        key={index}
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                      >
                        <div className="event-date">
                          <span className="day">{day}</span>
                          <span className="month">{month}</span>
                        </div>
                        <div className="event-content">
                          <h3>{event.title}</h3>
                          <div className="event-meta">
                            <p>
                              <i className="bi bi-clock" /> {event.startTime} -{" "}
                              {event.endTime}
                            </p>
                            <p>
                              <i className="bi bi-geo-alt" /> {event.location}
                            </p>
                          </div>
                          <p>{event.description}</p>
                        </div>
                      </div>
                    );
                  })}

                  {events.length === 0 && (
                    <div className="no-events">
                      <p>
                        No upcoming events at the moment. Please check back
                        later.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="sidebar">
                  <div
                    className="sidebar-item"
                    data-aos="fade-up"
                    data-aos-delay={300}
                  >
                    <h3 className="sidebar-title">Upcoming Events</h3>
                    <div className="event-calendar">
                      <div className="calendar-header">
                        <h4>
                          {now.toLocaleString("en-US", { month: "long" })}{" "}
                          {currentYear}
                        </h4>
                      </div>
                      <div className="calendar-body">
                        <div className="weekdays">
                          <div>Su</div>
                          <div>Mo</div>
                          <div>Tu</div>
                          <div>We</div>
                          <div>Th</div>
                          <div>Fr</div>
                          <div>Sa</div>
                        </div>
                        <div className="days">
                          {calendarDays.map((day, i) => (
                            <div
                              key={i}
                              className={`day ${
                                typeof day === "number" &&
                                eventDaysInCurrentMonth.includes(day)
                                  ? "has-event"
                                  : ""
                              }`}
                              style={
                                typeof day === "number" &&
                                eventDaysInCurrentMonth.includes(day)
                                  ? {
                                      backgroundColor: "#007bff",
                                      color: "#fff",
                                      fontWeight: "bold",
                                    }
                                  : {}
                              }
                            >
                              {day}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="sidebar-item"
                    data-aos="fade-up"
                    data-aos-delay={100}
                  >
                    <h3 className="sidebar-title">Event Categories</h3>
                    <ul className="categories">
                      {Object.entries(
                        events.reduce((acc: Record<string, number>, event) => {
                          const category = event.category || "Uncategorized";
                          acc[category] = (acc[category] || 0) + 1;
                          return acc;
                        }, {})
                      ).map(([category, count]) => (
                        <li key={category}>
                          <Link href={`#`}>
                            {category} <span>({count})</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    className="sidebar-item featured-event"
                    data-aos="fade-up"
                    data-aos-delay={200}
                  >
                    <h3 className="sidebar-title">Featured Event</h3>
                    <div className="featured-event-content">
                      <Image
                        src="/assets/img/Event-Featured.JPG"
                        alt="Featured Event"
                        className="img-fluid"
                        width={1200} // 🔁 Replace with actual width
                        height={800} // 🔁 Replace with actual height
                      />
                      <h4>Leadership Conference</h4>
                      {/* <p>
                        <i className="bi bi-calendar-event" /> August 12, 2025
                      </p> */}
                      <p>
                        Empowering students through engaging talks, workshops,
                        Trips and team-building sessions.
                      </p>
                      <div className="event-guidance mt-3">
                        <strong>Want to participate in an event?</strong>
                        <p className="mt-1 mb-1">Please reach out via email:</p>
                        <ul className="contact-emails">
                          <li>
                            <i className="bi bi-envelope" />{" "}
                            studentaffairs@leadersintcollege.com
                          </li>
                          <li>
                            <i className="bi bi-envelope" />{" "}
                            info@leadersintcollege.com
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Scroll Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        id="scroll-top"
        className="scroll-top d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-arrow-up-short" />
      </button>

      {/* Preloader */}
      <div id="preloader" />
    </>
  );
}
