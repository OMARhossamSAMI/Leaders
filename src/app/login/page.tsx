"use client";

import "./page.css";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const accounts = {
      hr: { email: "hr@example.com", password: "hr123" },
      it: { email: "it@example.com", password: "it123" },
    };

    const matchedRole = Object.entries(accounts).find(
      ([role, creds]) => creds.email === email && creds.password === password
    );

    if (matchedRole) {
      const [role] = matchedRole;
      router.push(`/login/Admin?role=${role}`);
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <form className="modern-form" onSubmit={handleSubmit}>
      <div className="form-logo-container">
        <img
          src="/assets/img/lic_logo.png"
          alt="School Logo"
          className="form-logo"
        />
        <h2 className="form-title">Admin Login</h2>
      </div>

      {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

      <div className="form-body">
        <div className="input-group">
          <div className="input-wrapper">
            <svg fill="none" viewBox="0 0 24 24" className="input-icon">
              <path
                strokeWidth="1.5"
                stroke="currentColor"
                d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z"
              />
            </svg>
            <input
              required
              placeholder="Email"
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="input-group">
          <div className="input-wrapper">
            <svg fill="none" viewBox="0 0 24 24" className="input-icon">
              <path
                strokeWidth="1.5"
                stroke="currentColor"
                d="M12 10V14M8 6H16C17.1046 6 18 6.89543 18 8V16C18 17.1046 17.1046 18 16 18H8C6.89543 18 6 17.1046 6 16V8C6 6.89543 6.89543 6 8 6Z"
              />
            </svg>
            <input
              required
              placeholder="Password"
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
      </div>

      <button className="submit-button" type="submit">
        <span className="button-text">Login</span>
        <div className="button-glow"></div>
      </button>
    </form>
  );
}
