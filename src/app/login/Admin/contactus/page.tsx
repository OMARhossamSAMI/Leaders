"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import "./page.css";

interface ContactUsEntry {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  grade?: string;
  subject: string;
  contactMethod: string;
  bestTime?: string;
  message: string;
  createdAt: string;
  reviewed?: boolean;
}

export default function ContactUsAdminPage() {
  const [messages, setMessages] = useState<ContactUsEntry[]>([]);

  const fetchMessages = () => {
    axios
      .get<ContactUsEntry[]>("http://localhost:3000/contactus")
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReviewToggle = async (id: string, reviewed: boolean) => {
    try {
      await axios.patch(`http://localhost:3000/contactus/${id}/reviewed`, {
        reviewed: !reviewed,
      });
      fetchMessages();
    } catch (err) {
      console.error("Failed to update review status", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      try {
        await axios.delete(`http://localhost:3000/contactus/${id}`);
        fetchMessages();
      } catch (err) {
        console.error("Failed to delete message", err);
      }
    }
  };

  return (
    <div className="contactus-page-wrapper">
      <div className="contactus-page-container">
        <h1 className="page-title">
          <i className="bi bi-envelope-paper-fill"></i> Contact Submissions
        </h1>
        <div className="cards-grid">
          {messages.map((msg) => (
            <div key={msg._id} className="contact-card">
              <div className="card-header">
                <div>
                  <h3 className="card-name">
                    <i className="bi bi-person-circle"></i> {msg.fullName}
                  </h3>
                  <span className="role-tag">
                    <i className="bi bi-person-badge-fill"></i> {msg.role}
                  </span>
                </div>
                <div className="timestamp">
                  <i className="bi bi-clock"></i>{" "}
                  {new Date(msg.createdAt).toLocaleString(undefined, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
              </div>

              <hr />
              <div className="card-content">
                <p className="highlight-email">
                  <i className="bi bi-envelope-fill"></i>{" "}
                  <strong>Email:</strong> {msg.email}
                </p>
                <p className="highlight-phone">
                  <i className="bi bi-telephone-fill"></i>{" "}
                  <strong>Phone:</strong> {msg.phone}
                </p>
                <p className="highlight-subject">
                  <i className="bi bi-tag-fill"></i> <strong>Subject:</strong>{" "}
                  {msg.subject}
                </p>
                {msg.grade && (
                  <p>
                    <i className="bi bi-book-fill"></i>{" "}
                    <strong>Grade of Interest:</strong> {msg.grade}
                  </p>
                )}
                <p className="highlight-contact">
                  <i className="bi bi-chat-left-text-fill"></i>{" "}
                  <strong>Preferred Contact:</strong> {msg.contactMethod}
                </p>
                {msg.bestTime && (
                  <p>
                    <i className="bi bi-alarm-fill"></i>{" "}
                    <strong>Best Time to Reach:</strong> {msg.bestTime}
                  </p>
                )}
                <div className="message-box">
                  <i className="bi bi-chat-dots-fill"></i>{" "}
                  <strong>Message:</strong>
                  <p>{msg.message}</p>
                </div>
              </div>

              <div className="card-footer d-flex justify-content-between align-items-center">
                <div className="review-status-container">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      checked={msg.reviewed || false}
                      onChange={() =>
                        handleReviewToggle(msg._id, msg.reviewed || false)
                      }
                    />
                    <span
                      className={`status-badge ${
                        msg.reviewed ? "reviewed" : "not-reviewed"
                      }`}
                    >
                      {msg.reviewed ? "✅ Reviewed" : "❌ Not Reviewed"}
                    </span>
                  </label>
                </div>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(msg._id)}
                >
                  <i className="bi bi-trash"></i> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
