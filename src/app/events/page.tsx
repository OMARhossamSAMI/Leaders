"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

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
          axios.get<EventType[]>("http://localhost:3000/events/visible"),
          axios.get<{ showEvents: boolean }>(
            "http://localhost:3000/settings/show-events"
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

  return (
    <>
      <main className="main">
        {/* Page Title */}
        <div
          className="page-title dark-background"
          style={{
            backgroundImage: "url(assets/img/education/showcase-1.webp)",
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
                  <a href="/">Home</a>
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
                          <a href="#" className="btn-event">
                            Learn More <i className="bi bi-arrow-right" />
                          </a>
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
                    data-aos-delay={100}
                  >
                    <h3 className="sidebar-title">Event Categories</h3>
                    <ul className="categories">
                      <li>
                        <a href="#">Academic</a>
                      </li>
                      <li>
                        <a href="#">Sports</a>
                      </li>
                      <li>
                        <a href="#">Workshops</a>
                      </li>
                      <li>
                        <a href="#">Cultural</a>
                      </li>
                      <li>
                        <a href="#">Trips</a>
                      </li>
                    </ul>
                  </div>
                  <div
                    className="sidebar-item featured-event"
                    data-aos="fade-up"
                    data-aos-delay={200}
                  >
                    <h3 className="sidebar-title">Featured Event</h3>
                    <div className="featured-event-content">
                      <img
                        src="/assets/img/education/events-5.webp"
                        alt="Featured Event"
                        className="img-fluid"
                      />
                      <h4>Leadership Conference 2025</h4>
                      <p>
                        <i className="bi bi-calendar-event" /> August 12, 2025
                      </p>
                      <p>
                        Empowering students through engaging talks, workshops,
                        and team-building sessions.
                      </p>
                      <a href="#" className="btn-register">
                        Register Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Scroll Top */}
      <a
        href="#"
        id="scroll-top"
        className="scroll-top d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-arrow-up-short" />
      </a>

      {/* Preloader */}
      <div id="preloader" />
    </>
  );
}
