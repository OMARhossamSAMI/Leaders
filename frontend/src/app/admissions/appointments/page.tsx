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
  slotISO: string; // ISO datetime
};

const API = "https://leaders-bf42.onrender.com";

const ACCENT = "#25c6f2";
const ACCENT_LIGHT = "#def2f6";
const DARK = "#1a1a1a";

// ---- helpers/types for robust API handling ----



export default function AppointmentPage() {
  // Step 1 — lookup by parent email
  const [appId, setAppId] = useState(""); // <-- new Application ID field
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
  const [scheduleWindow, setScheduleWindow] = useState<{
    startISO: string;
    endISO: string;
  } | null>(null);
  const [showAppointments, setShowAppointments] = useState<boolean | null>(
    null
  );

  const [, setSettingsLoading] = useState(true);

  // ---- Helpers ----
  // Local YYYY-MM-DD (no timezone issues)
  const fmtLocalYYYYMMDD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Build the 2-week window from application submittedAt
  const windowStart = useMemo(
    () => (scheduleWindow ? new Date(scheduleWindow.startISO) : null),
    [scheduleWindow]
  );

  const windowEnd = useMemo(
    () => (scheduleWindow ? new Date(scheduleWindow.endISO) : null),
    [scheduleWindow]
  );

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

        const data: { times: string[] } = res.ok
          ? await res.json()
          : { times: [] };
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
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/settings/show-appointments`,
          {
            cache: "no-store",
          }
        );
        if (res.ok) {
          const data = await res.json();
          setShowAppointments(Boolean(data.showAppointments));
        } else {
          setShowAppointments(true); // fallback to true if API fails
        }
      } catch {
        setShowAppointments(true);
      } finally {
        setSettingsLoading(false);
      }
    })();
  }, []);

  // -------- Actions --------
  const onLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError("");
    setApp(null);
    setSelectedDate("");
    setSelectedTime("");
    setSavedId(null);

    if (!appId.trim()) {
      setLookupError("Please enter the Code for your apointment.");
      return;
    }

    try {
      setSearching(true);
      const res = await fetch(
        `${API}/applications/by-id/${encodeURIComponent(appId.trim())}`
      );

      const data = await res.json();

      if (!res.ok) {
        // 👇 Handle custom error message from backend
        const msg =
          data?.message ||
          "We couldn't find an application for this ID. Please check your code and try again.";
        setLookupError(msg);
        setApp(null);
        return;
      }

      if (!data?.application) {
        setLookupError(
          "We couldn't find an application for this ID. Please check your code and try again."
        );
        setApp(null);
        return;
      }

      // normalize
      const a = data.application || {};
      const normalized: Application = {
        _id: String(a?.appointmentCode ?? appId.trim()),
        submittedAt: String(
          a?.submittedAt ?? a?.createdAt ?? new Date().toISOString()
        ),
        father_email: a?.father_email ?? a?.data?.father_email,
        mother_email: a?.mother_email ?? a?.data?.mother_email,
        student_name: a?.student_name ?? a?.data?.student_name,
      };

      setApp(normalized);
      setScheduleWindow(data.window);
    } catch (err) {
      console.error(err);
      setLookupError("Something went wrong. Please try again.");
    } finally {
      setSearching(false);
    }
  };
  type PayResponse =
    | { checkout_url: string }
    | { message?: string; _id?: string; id?: string }
    | Record<string, unknown>;

  const onSave = async (): Promise<void> => {
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
      slotISO: local.toISOString(),
    };

    try {
      const res = await fetch(`${API}/appointments/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type") || "";
      let data: PayResponse | null = null;
      let rawText: string | null = null;

      try {
        if (contentType.includes("application/json")) {
          data = (await res.json()) as PayResponse;
        } else {
          rawText = await res.text();
        }
      } catch {
        // ignore parse errors
      }

      if (!res.ok) {
        let msg: string;
        if (data && "message" in data) {
          msg = Array.isArray((data as { message: string[] }).message)
            ? (data as { message: string[] }).message.join(" ")
            : (data as { message?: string }).message ??
              rawText ??
              `HTTP ${res.status}`;
        } else {
          msg = rawText ?? `HTTP ${res.status}`;
        }

        console.error("Payment initiation failed", {
          status: res.status,
          data,
          rawText,
        });
        setSaveError(msg || "Unable to start payment. Please try again.");
        return;
      }

      // 🔹 Step 2: Redirect user to Paymob Unified Checkout
      if (data && "checkout_url" in data && data.checkout_url) {
        window.location.href = (data as { checkout_url: string }).checkout_url;
        return;
      }

      const newId =
        data && ("_id" in data || "id" in data)
          ? String(
              (data as { _id?: string; id?: string })._id ??
                (data as { id?: string }).id
            )
          : null;
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

  // Fixed daily slots
  const dailySlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
  ];
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
        style={{
          backgroundImage: "url(assets/img/education/Background_school.JPG)",
        }}
      >
        <div className="container position-relative">
          <h1>Book Assessment Appointment</h1>
          <p>
            Schedule your child’s assessment appointment within the available
            window. Select a convenient date and time. You’ll then be redirected
            to our secure payment page.{" "}
            <strong>After successful payment</strong>, your reservation is
            confirmed and <strong>Admissions will receive an email</strong> with
            your parent email and the booked date &amp; time.
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
          <div className="row align-items-center">
            {/* Left side: Text */}
            <div className="col-lg-7">
              <h3>Reserve Your Child’s Assessment Appointment</h3>
              <p>
                After you submit your application, you will need to book an
                assessment date for your child. This is done fully online in
                just a few simple steps — no phone calls or visits are required.
              </p>

              <p>
                To <strong>confirm the booking</strong>, please note that both
                steps are required:
              </p>

              <ol>
                <li>
                  <strong>Book the assessment date</strong> using your
                  reservation code.
                </li>
                <li>
                  <strong>Pay the assessment fees</strong> during the booking
                  process.
                </li>
              </ol>

              <p>
                Once these steps are completed, your child’s assessment and the
                parents’ interview will be officially confirmed. Our admissions
                team will then promptly share all the necessary details to help
                you prepare for the assessment day.
              </p>
            </div>

            {/* Right side: Image */}
            <div className="col-lg-5 text-center mt-4 mt-lg-0">
              <img
                src="/assets/img/education/appointment.JPG"
                alt="Child assessment booking"
                className="img-fluid rounded shadow-sm"
                style={{ maxHeight: 300 }}
              />
            </div>
          </div>

          {/* Form below text + image */}
          <h4 className="card-title mb-3 mt-4" style={{ color: DARK }}>
            Find Your Application
          </h4>
          <form onSubmit={onLookup} className="row g-3 align-items-end">
            <div className="col-12 col-md-9 col-lg-10">
              <label className="form-label">Application ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter the code sent to your email (e.g. 6899a093b70c9c3f1564a7c5)"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
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
                <Link
                  href="/admissions"
                  className="fw-semibold"
                  style={{ color: ACCENT }}
                >
                  Submit an application first
                </Link>
                .
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Appointment Picker */}
      {app &&
        (showAppointments ? (
          <div className="card shadow-sm border-0 wide-card">
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <h4 className="card-title mb-0" style={{ color: DARK }}>
                  Select Appointment Slot
                </h4>
                <span
                  className="badge text-dark"
                  style={{ background: ACCENT_LIGHT }}
                >
                  Window:{" "}
                  <b>
                    {windowStart ? fmtLocalYYYYMMDD(windowStart) : "—"} →{" "}
                    {windowEnd ? fmtLocalYYYYMMDD(windowEnd) : "—"}
                  </b>
                </span>
              </div>

              {allowedDates.length === 0 ? (
                <div className="alert alert-warning mb-0">
                  We couldn’t find a valid scheduling window. Please contact
                  admissions.
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
                            }}
                            className={`btn btn-sm ${
                              active ? "text-white" : ""
                            }`}
                            disabled={isPast}
                            style={{
                              background: active
                                ? ACCENT
                                : isPast
                                ? "#e5e7eb"
                                : ACCENT_LIGHT,
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

                  {/* Time Grid */}
                  <div
                    className="p-3 rounded"
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #eef2f7",
                    }}
                  >
                    {availableTimes.length === 0 && !timesLoading ? (
                      <div className="alert alert-secondary mb-0">
                        No available times left for this day. Please choose
                        another date.
                      </div>
                    ) : (
                      <div className="row g-2">
                        {dailySlots.map((t) => {
                          const active = selectedTime === t;
                          const isAvailable = availableTimes.includes(t);
                          const disabled =
                            timesLoading || !selectedDate || !isAvailable;

                          return (
                            <div key={t} className="col-6 col-md-3 col-lg-2">
                              <button
                                type="button"
                                className={`btn w-100 d-flex flex-column justify-content-center align-items-center ${
                                  active ? "text-white" : ""
                                }`}
                                onClick={() => !disabled && setSelectedTime(t)}
                                disabled={disabled}
                                style={{
                                  background: active ? ACCENT : "#ffffff",
                                  color: isAvailable
                                    ? active
                                      ? "#fff"
                                      : DARK
                                    : "#999",
                                  border: "1px solid #e5e7eb",
                                  borderRadius: 12,
                                  fontWeight: 600,
                                  opacity: disabled ? 0.7 : 1,
                                  cursor: isAvailable
                                    ? "pointer"
                                    : "not-allowed",
                                  minHeight: 60, // ✅ makes all buttons equal height
                                }}
                                title={isAvailable ? "" : "Fully booked"}
                              >
                                <span>{t}</span>
                                {!isAvailable && (
                                  <small
                                    style={{
                                      fontSize: "0.75rem",
                                      color: "#c00",
                                    }}
                                  >
                                    Fully booked
                                  </small>
                                )}
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
                      <span className="text-danger fw-semibold">
                        ❌ {saveError}
                      </span>
                    )}
                  </div>

                  <p className="text-muted mt-2 mb-0" style={{ fontSize: 13 }}>
                    After successful payment,{" "}
                    <strong>
                      Admissions will automatically receive an email
                    </strong>{" "}
                    with your parent email and the reserved date &amp; time.
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="card shadow-sm border-0 wide-card">
            <div className="card-body text-center p-5">
              <h4 className="mb-3" style={{ color: DARK, fontWeight: 700 }}>
                Admission Appointments Unavailable
              </h4>
              <p className="mb-4" style={{ fontSize: "1.1rem", color: "#555" }}>
                Admission appointments are not open for booking at the moment.
                <br />
                Please contact our Admissions Office for more information.
              </p>
            </div>
          </div>
        ))}

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
