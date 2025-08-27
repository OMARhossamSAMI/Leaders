// src/app/appointment/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Application = {
  _id: string;
  submittedAt: string; // ISO date
  father_email?: string;
  mother_email?: string;
  student_name?: string;
};

type Appointment = {
  _id?: string;
  applicationId: string;
  parentEmail: string;
  slotISO: string; // ISO datetime
};

const API = process.env.NEXT_PUBLIC_API_URL;

const ACCENT = "#25c6f2";
const ACCENT_LIGHT = "#def2f6";
const DARK = "#1a1a1a";

// ---- helpers/types for robust API handling ----
type CreateApptSuccess = { _id?: string; id?: string };
type ApiErrorBody = { message?: string | string[] };

const hasMessage = (v: unknown): v is ApiErrorBody =>
  typeof v === "object" && v !== null && "message" in v;

const hasNewId = (v: unknown): v is CreateApptSuccess =>
  typeof v === "object" && v !== null && (("_id" in v) || ("id" in v));

export default function AppointmentPage() {
  // Step 1 — lookup by parent email
  const [email, setEmail] = useState("");
  const [searching, setSearching] = useState(false);
  const [app, setApp] = useState<Application | null>(null);
  const [lookupError, setLookupError] = useState("");

  // Step 2 — choose date/time
  const [selectedDate, setSelectedDate] = useState<string>(""); // YYYY-MM-DD (local)
  const [selectedTime, setSelectedTime] = useState<string>(""); // "HH:mm"
  const [availableTimes, setAvailableTimes] = useState<string[]>([]); // "HH:mm" available for selectedDate
  const [timesLoading, setTimesLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState("");

  // ---- Helpers ----
  // Local YYYY-MM-DD (no timezone issues)
  const fmtLocalYYYYMMDD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Build the 2-week window from application submittedAt
  const windowStart = useMemo(() => {
    if (!app?.submittedAt) return null;
    const s = new Date(app.submittedAt);
    return new Date(s.getFullYear(), s.getMonth(), s.getDate()); // midnight local
  }, [app?.submittedAt]);

  const windowEnd = useMemo(() => {
    if (!windowStart) return null;
    const e = new Date(windowStart);
    e.setDate(e.getDate() + 14); // inclusive-ish two weeks window
    return e;
  }, [windowStart]);

  // Dates the user can pick (Sun–Thu only, within window)
  const allowedDates = useMemo(() => {
    if (!windowStart || !windowEnd) return [];
    const list: string[] = [];
    const d = new Date(windowStart);
    while (d <= windowEnd) {
      // Egypt weekend = Friday(5) & Saturday(6)
      const isFriOrSat = d.getDay() === 5 || d.getDay() === 6;
      if (!isFriOrSat) list.push(fmtLocalYYYYMMDD(d));
      d.setDate(d.getDate() + 1);
    }
    return list;
  }, [windowStart, windowEnd]);

  // Auto-select the first bookable date once app + allowedDates are ready.
  useEffect(() => {
    if (!app || !allowedDates.length || selectedDate) return;
    const todayStr = fmtLocalYYYYMMDD(new Date());
    const first = allowedDates.find((d) => d >= todayStr) ?? allowedDates[0];
    setSelectedDate(first);
  }, [app, allowedDates, selectedDate]);

  // When a date is picked (or auto-picked), fetch ONLY available times.
  useEffect(() => {
    if (!selectedDate || !app?._id) {
      setAvailableTimes([]);
      setTimesLoading(false);
      return;
    }

    let cancelled = false;
    setTimesLoading(true);
    setSelectedTime(""); // clear any previous selection when date changes

    const load = async () => {
      try {
        // IMPORTANT: JS getTimezoneOffset() already returns (UTC - local) in minutes
        const offsetMin = new Date().getTimezoneOffset(); // e.g., Cairo summer = -180
        // Use the new endpoint (alias /available-for-date still exists)
        const res = await fetch(
          `${API}/appointments/available?date=${selectedDate}&offset=${offsetMin}`
        );

        const data: { times: string[] } = res.ok ? await res.json() : { times: [] };
        if (!cancelled) {
          setAvailableTimes(Array.isArray(data?.times) ? data.times : []);
        }
      } catch {
        if (!cancelled) setAvailableTimes([]);
      } finally {
        if (!cancelled) setTimesLoading(false);
      }
    };

    load();

    // Optional: live refresh so UI reflects others' bookings every 15s
    const id = setInterval(load, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [selectedDate, app?._id]);

  // -------- Actions --------
  const onLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError("");
    setApp(null);
    setSelectedDate("");
    setSelectedTime("");
    setSavedId(null);

    if (!email.trim()) {
      setLookupError("Please enter a father or mother email.");
      return;
    }

    try {
      setSearching(true);
      const res = await fetch(
        `${API}/applications/by-parent-email?email=${encodeURIComponent(email.trim())}`
      );
      const data = await res.json();

      if (!res.ok || !data?.application) {
        setLookupError(
          "We couldn't find an application for this email. Please submit an application first."
        );
        setApp(null);
        return;
      }

      // normalize the application
      const a = data.application || {};
      const normalized: Application = {
        _id: String(a?._id ?? a?.id ?? a?.applicationId ?? ""),
        submittedAt: String(a?.submittedAt ?? a?.createdAt ?? new Date().toISOString()),
        father_email: a?.father_email ?? a?.data?.father_email,
        mother_email: a?.mother_email ?? a?.data?.mother_email,
        student_name: a?.student_name ?? a?.data?.student_name,
      };

      // sanity check: must be a 24-hex string
      if (!/^[0-9a-fA-F]{24}$/.test(normalized._id)) {
        setLookupError("Found your application but the id is invalid. Please try again.");
        setApp(null);
        return;
      }

      setApp(normalized);
    } catch {
      setLookupError("Something went wrong. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const onSave = async () => {
    if (!app?._id || !selectedDate || !selectedTime) return;

    setSaveError("");
    setSaving(true);
    setSavedId(null);

    // Build ISO datetime in local time, then convert to ISO
    const [hh, mm] = selectedTime.split(":").map((n) => parseInt(n, 10));
    const [y, m, d] = selectedDate.split("-").map((n) => parseInt(n, 10));
    const local = new Date(y, m - 1, d, hh, mm, 0, 0);

    const payload: Appointment = {
      applicationId: app._id,
      parentEmail: email.trim(),
      slotISO: local.toISOString(),
    };

    try {
      const res = await fetch(`${API}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type") || "";
      let data: unknown = null;
      let rawText: string | null = null;

      try {
        if (contentType.includes("application/json")) {
          data = await res.json();
        } else {
          rawText = await res.text();
        }
      } catch {
        // ignore parse errors
      }

      if (!res.ok) {
        // Build a friendly error message
        let msg: string;
        if (hasMessage(data)) {
          msg = Array.isArray(data.message)
            ? data.message.join(" ")
            : data.message ?? rawText ?? `HTTP ${res.status}`;
        } else {
          msg = rawText ?? `HTTP ${res.status}`;
        }

        const toLocal = (dt: Date) =>
          `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(
            dt.getDate()
          ).padStart(2, "0")}`;
        const winFrom = windowStart ? toLocal(windowStart) : null;
        const winTo = windowEnd ? toLocal(windowEnd) : null;

        if (/weekend|friday|saturday/i.test(msg)) {
          msg = "Appointments are not available on Friday or Saturday.";
        } else if (
          (/outside.*window|range/i.test(msg) || /outside/i.test(msg)) &&
          winFrom && winTo
        ) {
          msg = `Please pick a date within the allowed window (${winFrom} → ${winTo}).`;
        } else if (res.status === 409 || /conflict|taken|already.*booked|slot.*full/i.test(msg)) {
          msg = "That time is no longer available. Please choose another slot.";
          // reflect the conflict immediately (remove it if it somehow remained in the list)
          setAvailableTimes((prev) => prev.filter((t) => t !== selectedTime));
          setSelectedTime("");
        }

        console.error("Appointment booking failed", { status: res.status, data, rawText });
        setSaveError(msg || "Unable to book this slot. Please choose another.");
        return;
      }

      // success
      const newId = hasNewId(data) ? (data._id ?? data.id) : undefined;

      setSavedId(newId || "OK");
      // Optionally remove the time from this user's list to prevent double-submission
      setAvailableTimes((prev) => prev.filter((t) => t !== selectedTime));
      setSelectedTime("");
    } catch {
      setSaveError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // -------- UI --------
  const startOfToday = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  return (
    <>
      {/* ===== Header borrowed from Contact page ===== */}
      <div
        className="page-title dark-background"
        style={{ backgroundImage: "url(assets/img/education/Background_school.JPG)" }}
      >
        <div className="container position-relative">
          <h1>Book Assessment Appointment</h1>
          <p>
            Schedule your child’s assessment appointment within the available window.
            Select a convenient date and time, and our admissions team will confirm.
            Enter the <strong>father</strong> or <strong>mother</strong> email used in your
            application. If we find your application, you can select a <b>30-minute</b> slot between{" "}
            <b>09:00</b> and <b>12:00</b> (Sun–Thu). The window closes at <b>12:30</b>, so the last
            start time is <b>12:00</b>.
          </p>
          <nav className="breadcrumbs">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li className="current">Appointment</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* ===== End Header ===== */}
      {/* Lookup Card */}
      <div className="card shadow-sm border-0 mb-4 wide-card">
        <div className="card-body">
          <h4 className="card-title mb-3" style={{ color: DARK }}>
            Find Your Application
          </h4>
          <form onSubmit={onLookup} className="row g-3 align-items-end">
            <div className="col-12 col-md-9 col-lg-10">
              <label className="form-label">Parent Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="father@example.com or mother@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="col-12 col-md-3 col-lg-2 d-grid">
              <button
                type="submit"
                className="btn"
                style={{
                  background: ACCENT,
                  color: "white",
                  fontWeight: 700,
                  borderRadius: 12,
                  whiteSpace: "nowrap",
                }}
                disabled={searching}
              >
                {searching ? "Searching..." : "Continue"}
              </button>
            </div>

            {lookupError && (
              <div className="col-12">
                <div className="alert alert-danger mb-0">{lookupError}</div>
              </div>
            )}

            {!app && !searching && !lookupError && (
              <div className="col-12 text-muted" style={{ fontSize: 14 }}>
                Haven’t applied yet?{" "}
                <Link href="/admissions" className="fw-semibold" style={{ color: ACCENT }}>
                  Submit an application first
                </Link>
                .
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Appointment Picker */}
      {app && (
        <div className="card shadow-sm border-0 wide-card">
          <div className="card-body">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
              <h4 className="card-title mb-0" style={{ color: DARK }}>
                Select Appointment Slot
              </h4>
              <span className="badge text-dark" style={{ background: ACCENT_LIGHT }}>
                Window:{" "}
                <b>
                  {windowStart ? fmtLocalYYYYMMDD(windowStart) : "—"} →{" "}
                  {windowEnd ? fmtLocalYYYYMMDD(windowEnd) : "—"}
                </b>
              </span>
            </div>

            {allowedDates.length === 0 ? (
              <div className="alert alert-warning mb-0">
                We couldn’t find a valid scheduling window. Please contact admissions.
              </div>
            ) : (
              <>
                {/* Date Pills */}
                <div className="mb-3">
                  <div className="d-flex flex-wrap gap-2">
                    {allowedDates.map((d) => {
                      const dt = new Date(d + "T00:00:00");
                      const nice = dt.toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      });
                      const active = selectedDate === d;
                      const isPast = dt < startOfToday;

                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => {
                            if (isPast) return;
                            setSelectedDate(d);
                            // selectedTime cleared in the fetch effect
                          }}
                          className={`btn btn-sm ${active ? "text-white" : ""}`}
                          disabled={isPast}
                          style={{
                            background: active ? ACCENT : isPast ? "#e5e7eb" : ACCENT_LIGHT,
                            color: active ? "#fff" : DARK,
                            borderRadius: 999,
                            fontWeight: 600,
                            padding: "10px 16px",
                            border: "none",
                            opacity: isPast ? 0.6 : 1,
                            cursor: isPast ? "not-allowed" : "pointer",
                          }}
                          title={isPast ? "This date has already passed" : ""}
                        >
                          {nice}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Times loading note */}
                {timesLoading && (
                  <div className="text-muted mb-2" style={{ fontSize: 13 }}>
                    Loading available times…
                  </div>
                )}

                {/* Time Grid — shows ONLY available times */}
                <div
                  className="p-3 rounded"
                  style={{ background: "#f8fafc", border: "1px solid #eef2f7" }}
                >
                  {availableTimes.length === 0 && !timesLoading ? (
                    <div className="alert alert-secondary mb-0">
                      No available times left for this day. Please choose another date.
                    </div>
                  ) : (
                    <div className="row g-2">
                      {availableTimes.map((t) => {
                        const active = selectedTime === t;
                        const disabled = timesLoading || !selectedDate;

                        return (
                          <div key={t} className="col-6 col-md-3 col-lg-2">
                            <button
                              type="button"
                              className={`btn w-100 ${active ? "text-white" : ""}`}
                              onClick={() => !disabled && setSelectedTime(t)}
                              disabled={disabled}
                              style={{
                                background: active ? ACCENT : "#ffffff",
                                color: active ? "#fff" : DARK,
                                border: "1px solid #e5e7eb",
                                borderRadius: 12,
                                fontWeight: 600,
                                opacity: disabled ? 0.5 : 1,
                              }}
                            >
                              {t}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Save */}
                <div className="d-flex align-items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={onSave}
                    className="btn"
                    style={{
                      background: ACCENT,
                      color: "white",
                      fontWeight: 700,
                      borderRadius: 12,
                      padding: "10px 18px",
                    }}
                    disabled={!selectedDate || !selectedTime || saving}
                  >
                    {saving ? "Booking..." : "Submit Appointment"}
                  </button>

                  {savedId && (
                    <span className="text-success fw-semibold">
                      ✅ Appointment booked successfully.
                    </span>
                  )}
                  {saveError && (
                    <span className="text-danger fw-semibold">❌ {saveError}</span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Wider layout + small style touch for consistency */}
      <style jsx global>{`
        .wide-card {
          width: 100%;
          max-width: 100%;
        }
        .wide-card .btn {
          white-space: nowrap;
        }
        @media (min-width: 576px) {
          .wide-card .card-body {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }
      `}</style>
    </>
  );
}
