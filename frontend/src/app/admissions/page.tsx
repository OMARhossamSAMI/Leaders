"use client";

import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";               // ⬅️ NEW
import { useTabs } from "../components/TabsContext";
import Link from "next/link";
import "./page.css";
import Image from "next/image";
import { createPortal } from "react-dom";

interface FormField {
  field_name: string;
  order: number;
  name: string;
  label?: string;
  type: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

type Slot = {
  _id: string;
  iso: string;        // ISO in UTC
  label?: string;
  active: boolean;
  bookedCount: number;
};

export default function AdmissionsPage() {
  const { activeSection, setActiveSection } = useTabs();
  const router = useRouter();                               // ⬅️ NEW
const [showBookedPopup, setShowBookedPopup] = useState(false);
const [bookedTimer, setBookedTimer] = useState<number | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [successMessage, setSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);

  // ---- Your existing selectedSlot (kept for UI text). We’ll also track slotId internally.
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null); // display text
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null); // actual id

  // ⬅️ NEW: popup + redirect handling
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState<number | null>(null);
  const [reserveHref, setReserveHref] = useState("/admissions/appointments");

  // Booking form state
  const [studentName, setStudentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentPhone, setParentPhone] = useState("");

  // UX state
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<{
  bookingId: string;
  parentEmail?: string;
  slotLabel: string;
  slotIso: string;
} | null>(null);

  const [bookingErr, setBookingErr] = useState<string | null>(null);
  const [bookingOk, setBookingOk] = useState<string | null>(null);


  const [bookedPopup, setBookedPopup] = useState<{ title: string; message: string; kind: 'success' | 'error' } | null>(null);


  
useEffect(() => {
  return () => { if (bookedTimer !== null) window.clearTimeout(bookedTimer); };
}, [bookedTimer]);

const handleBookingSubmit = async () => {
  setBookingErr(null);
  setBookingOk(null);

  // collect missing fields to show a single popup
  const missing: string[] = [];
  if (!selectedSlotId) missing.push("date & time");
  if (!studentName.trim()) missing.push("student name");
  if (!parentEmail.trim()) missing.push("parent email");
  if (!parentPhone.trim()) missing.push("parent phone");

  const list = (arr: string[]) =>
    arr.length === 1 ? arr[0]
      : arr.length === 2 ? `${arr[0]} and ${arr[1]}`
      : `${arr.slice(0, -1).join(", ")}, and ${arr[arr.length - 1]}`;

  if (missing.length) {
    const msg = `Please fill ${list(missing)}.`;
    setBookingErr(msg);
    setBookedPopup({ title: "Missing information", message: msg, kind: "error" });
    setShowBookedPopup(true);
    const t = window.setTimeout(() => setShowBookedPopup(false), 3000);
    setBookedTimer(t);
    return; // don't call the API
  }

  try {
    setBookingLoading(true);

    const res = await fetch(`${API}/booktour/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slotId: selectedSlotId,
        studentName: studentName.trim(),
        parentEmail: parentEmail.trim(),
        parentPhone: parentPhone.trim(),
        selectedLabel: selectedSlot ?? undefined,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      const msg = Array.isArray(data?.message) ? data.message.join(" • ") : (data?.message || "Booking failed");
      throw new Error(msg);
    }

    // SUCCESS — backend returns { ok: true, bookingId }
    const bookingId = data?.bookingId ? String(data.bookingId) : "";
    const successMsg = [
      "We’ve received your request.",
      "You will receive the booking details on your email shortly.",
    ].join(" ");

    setBookingOk("Successfully booked! " + (bookingId ? `Code: ${bookingId}` : ""));
    setOpen(false); // close big modal

    setBookedPopup({
      title: "Successfully booked!",
      message: successMsg,
      kind: "success",
    });
    setShowBookedPopup(true);
    const t = window.setTimeout(() => setShowBookedPopup(false), 3500);
    setBookedTimer(t);

    // clear fields
    setStudentName(""); setParentEmail(""); setParentPhone("");
    setSelectedSlot(null); setSelectedSlotId(null);

    // refresh slots so "spots left" updates
    try {
      const refresh = await fetch(`${API}/booktour/admin/slots?active=true`, {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      const refreshed = await refresh.json();
      if (Array.isArray(refreshed)) setSlots(refreshed);
    } catch { /* ignore */ }
  } catch (err: any) {
    const msg = err?.message || "Booking failed";
    setBookingErr(msg);
    setBookedPopup({ title: "Booking failed", message: msg, kind: "error" });
    setShowBookedPopup(true);
    const t = window.setTimeout(() => setShowBookedPopup(false), 3000);
    setBookedTimer(t);
  } finally {
    setBookingLoading(false);
  }
};




  useEffect(() => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      const timer = setTimeout(() => {
        preloader.style.display = "none";
      }, 15);
      return () => clearTimeout(timer);
    }
    const fetchFields = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/form-fields`);
        const data = await res.json();
        setFields(data);
      } catch (error) {
        console.error("Failed to fetch form fields", error);
      }
    };
    fetchFields();
  }, []);

  useEffect(() => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      const timer = setTimeout(() => {
        preloader.style.display = "none";
      }, 15);
      return () => clearTimeout(timer);
    }
  }, []);

  // ⬅️ NEW: clear redirect timer on unmount or when modal closes
  useEffect(() => {
    return () => {
      if (redirectTimer !== null) window.clearTimeout(redirectTimer);
    };
  }, [redirectTimer]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      setIsSubmitting(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications`, {
        method: "POST",
        body: formData, // keep FormData
      });

      const result = await response.json();

      if (response.ok) {
        // Try to extract a parent email to prefill the appointments page
        const father = (formData.get("father_email") || "") as string;
        const mother = (formData.get("mother_email") || "") as string;
        const emailToPass = (father || mother || "").trim();
        const href = emailToPass
          ? `/admissions/appointments?email=${encodeURIComponent(emailToPass)}`
          : `/admissions/appointments`;

        setReserveHref(href);

        form.reset();
        setSuccessMessage(true);
        setIsSubmitting(false);

        // ⬅️ Show popup and auto-redirect after 2.5s
        setShowReserveModal(true);
        const t = window.setTimeout(() => router.push(href), 2500);
        setRedirectTimer(t);
      } else {
        setIsSubmitting(false);
        setErrorMessage("❌ " + (result.message || "Submission failed."));
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setIsSubmitting(false);
      alert("❌ An error occurred while submitting the form.");
    }
  };

  // ================= SLOTS FROM BACKEND (replace dummy useMemo) =================
  const API = process.env.NEXT_PUBLIC_API_URL!;
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(true);
  const [slotsErr, setSlotsErr] = useState<string>("");

// "Wed 14 Aug 2025 – 11:30"
const fmtDateTime = (iso: string) => {
  const d = new Date(iso);
  const weekday = d.toLocaleDateString(undefined, { weekday: "short" }); // "Mon", "Tue", ...
  const dateStr = d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
  const timeStr = d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${weekday} ${dateStr} – ${timeStr}`;
};


  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingSlots(true);
        setSlotsErr("");
        const res = await fetch(`${API}/booktour/admin/slots?active=true`, {
          headers: { "Content-Type": "application/json" },
          cache: "no-store",                 // avoid stale caching in browsers
        });
        const data = await res.json();
        if (!alive) return;
        setSlots(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (!alive) return;
        setSlotsErr(e?.message || "Failed to load tour slots");
      } finally {
        if (alive) setLoadingSlots(false);
      }
    })();
    return () => { alive = false; };
  }, [API]);

  // Only show bookable; sort ascending (backend already active+future)
// show exactly what the API returns (already active + future), just sort by time
const visibleSlots = useMemo(
  () =>
    (slots || [])
      .map(s => ({
        ...s,
        bookedCount: s.bookedCount ?? 0,   // keep default safeguard
      }))
      .sort((a, b) => new Date(a.iso).getTime() - new Date(b.iso).getTime()),
  [slots]
);

const selectedSlotObj = useMemo(
  () => visibleSlots.find((s) => s._id === selectedSlotId) || null,
  [visibleSlots, selectedSlotId]
);

  // ============================================================================

  // Keep your preview submit util if needed
  const submit = () => {
    if (!selectedSlot) {
      alert("Please choose a date & time first.");
      return;
    }
    alert(`Frontend-only preview:\nBooked campus tour for ${selectedSlot}`);
    setOpen(false);
    setSelectedSlot(null);
    setSelectedSlotId(null);
  };

  return (
    <>
      <div>
        <main className="main">
          {/* Page Title */}
          <div
            className="page-title dark-background"
            style={{ backgroundImage: "url(assets/img/education/Background_school.JPG)" }}
          >
            <div className="container position-relative">
              <h1>Admissions</h1>
              <p>
                Start your journey at LIC—apply now to join a community that nurtures excellence,
                character, and global citizenship.
              </p>
              <nav className="breadcrumbs">
                <ol>
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li className="current">Admissions</li>
                </ol>
              </nav>
            </div>
          </div>

          {/* Tabs */}
          <div className="container mt-5 text-center">
            <style>{`
    .admission-tab-wrapper{display:inline-flex;flex-wrap:wrap;justify-content:center;gap:14px;padding:18px 25px;background:#def2f6;border-radius:60px;margin:0 auto}
    .admission-tab-btn{background:transparent;border:none;padding:10px 20px;border-radius:999px;font-size:15px;font-weight:500;color:#1a1a1a;display:flex;align-items:center;gap:8px;white-space:nowrap;transition:all .3s}
    .admission-tab-btn:hover{background:#b6e5f3}
    .admission-tab-btn.active{background:#25c6f2;color:#fff;font-weight:600}
    .admission-tab-btn i{font-size:1rem}
  `}</style>

            <div className="admission-tab-wrapper">
              <button
                type="button"
                className={`admission-tab-btn ${activeSection === "apply" ? "active" : ""}`}
                onClick={() => setActiveSection("apply")}
              >
                <i className="bi bi-pencil-square"></i> How to Apply
              </button>

              <button
                type="button"
                className={`admission-tab-btn ${activeSection === "form" ? "active" : ""}`}
                onClick={() => setActiveSection("form")}
              >
                <i className="bi bi-file-earmark-text"></i> Apply Now
              </button>

              <button
                type="button"
                className={`admission-tab-btn ${activeSection === "requirements" ? "active" : ""}`}
                onClick={() => setActiveSection("requirements")}
              >
                <i className="bi bi-people"></i> Age Acceptance Guide
              </button>

              <button
                type="button"
                className={`admission-tab-btn ${activeSection === "deadlines" ? "active" : ""}`}
                onClick={() => setActiveSection("deadlines")}
              >
                <i className="bi bi-camera-video"></i> Tour
              </button>

              <button
                type="button"
                className={`admission-tab-btn ${activeSection === "reserve" ? "active" : ""}`}
                onClick={() => setActiveSection("reserve")}
              >
                <i className="bi bi-calendar-check"></i> Reserve Assessment Date
              </button>              
            </div>
          </div>


          <section id="admissions" className="admissions section">
            <div className="container" data-aos="fade-up" data-aos-delay={100}>
              <div className="row gy-5 g-lg-5">
                {activeSection === "apply" && (
                  <>
                    <div className="col-lg-8">
                      <div className="admissions-info">
                        <h2>Begin Your Academic Journey Today</h2>
                        <p>
                          Please carefully provide the information requested
                          below. Once submitted, our admissions team will review
                          your application and contact you to arrange interviews
                          for both the student and parents. We are here to
                          answer all your questions and guide you through each
                          step of the admissions process. We look forward to
                          getting to know your family and exploring how LIC can
                          support your child&apos;s educational journey.
                        </p>
                        <div className="admissions-steps mt-5">
                          <h3>How to Apply</h3>
                          <p>
                            Applying at LIC is an exciting journey for your
                            family, and we strive to make the admissions process
                            as smooth as possible. Here are the steps
                            you&apos;ll need to follow to apply to our school:
                          </p>
                          <div className="steps-wrapper mt-4">
                            <div className="step-item">
                              <div className="step-number">1</div>
                              <div className="step-content">
                                <h4>Online Application</h4>
                                <p>
                                  Start your application by clicking the Apply
                                  Now button. You will need to fill out the
                                  application form. This is your first step
                                  toward becoming a part of our vibrant learning
                                  community.
                                </p>
                              </div>
                            </div>
                            <div className="step-item">
                              <div className="step-number">2</div>
                              <div className="step-content">
                                <h4>Child Assessment</h4>
                                <p>
                                  Once your application is received, the
                                  admission team will schedule an assessment for
                                  your child to better understand their
                                  educational needs and abilities. This is a
                                  great opportunity for us to get to know each
                                  other and ensure that our school is a good fit
                                  for your child&apos;s learning style and
                                  goals.
                                </p>
                                <h6>Parents&apos; Interview</h6>
                                <p>
                                  On the day of the assessment or at a time
                                  convenient for you, we will conduct a
                                  parents&apos; interview. This discussion is
                                  crucial as it allows us to learn more about
                                  your expectations and how we can best support
                                  your child&apos;s educational journey.
                                </p>
                              </div>
                            </div>
                            <div className="step-item">
                              <div className="step-number">3</div>
                              <div className="step-content">
                                <h4>Enrollment</h4>
                                <p>
                                  Upon acceptance, you will receive an offer for
                                  your child to join LIC. To finalize the
                                  enrollment, you will need to complete the
                                  registration process and fulfill any necessary
                                  conditions or paperwork. We will guide you
                                  through every step to ensure your child is
                                  ready to start their educational journey with
                                  us.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT IMAGE COLUMN */}
                    <div className="col-lg-4 d-flex align-items-center">
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "500px",
                        }}
                      >
                        <Image
                          src="/assets/img/education/ApplyNowFINAL.JPG"
                          alt="How to Apply"
                          layout="fill"
                          objectFit="cover"
                          className="img-fluid"
                        />
                      </div>
                    </div>
                  </>
                )}

                {activeSection === "requirements" && (
                  <div className="col-lg-12">
                    <div className="admissions-requirements">
                      <h2>Age Acceptance Guide</h2>

                      <div className="requirements-list mt-4">
                        <div className="requirement-item">
                          <div className="icon-box">
                            <i className="bi bi-people" />
                          </div>
                          <div>
                            <p>
                              Our Age Guide Chart shows the typical age ranges
                              for each grade level at Leaders International
                              College, from Primary Years Program (PYP) through
                              Middle Years Program (MYP) and Diploma Program
                              (DP), helping parents understand how students
                              progress through each stage of their academic
                              journey.
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Full-width image */}
                      <div className="requirements-image mb-4">
                        <Image
                          src="/assets/img/education/AgeGuide.JPG"
                          alt="Age Acceptance Guide"
                          width={1200} // Replace with actual image width
                          height={800} // Replace with actual image height
                          style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "8px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "deadlines" && (
                  <div className="col-lg-12">
                    <div className="deadlines">
                      <div className="row mt-4">
                        {/* COLUMN 1: Fall Semester */}
                        <div className="col-lg-6">
                          <div className="deadline-item mb-4">
                            <h2>Virtual Tour</h2>
                            <p>
                              Explore Leaders International College from the
                              comfort of your home! Our virtual tour provides
                              you with a unique opportunity to experience our
                              campus as if you were here in person. Navigate
                              through our state-of-the-art facilities, including
                              classrooms, labs, sports complexes, and more, to
                              see where our students learn, play, and grow. If
                              you have any questions or would like more
                              information about specific areas of our campus,
                              please do not hesitate to contact our team.
                            </p>
                            <p>
                                  Take a step into our world from the comfort of
                                  your home. Our virtual tour offers a detailed
                                  look at the vibrant learning spaces,
                                  cutting-edge technology, and welcoming
                                  community that define Leaders International
                                  College. Explore classrooms, labs, sports
                                  facilities, and more — all in just a few
                                  clicks
                                </p>
                                <a
                                  href="http://vrtour.leadersintcollege.com/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-accent"
                                  style={{
                                    backgroundColor: "var(--accent-color)",
                                    color: "#fff",
                                    padding: "12px 24px",
                                    borderRadius: "8px",
                                    fontWeight: 600,
                                    display: "inline-block",
                                    textDecoration: "none",
                                  }}
                                >
                                  Explore Virtual Tour
                                </a>
                          </div>
                        </div>

                        {/* COLUMN 2: Spring Semester */}
                         <div className="col-lg-6">
                        <div className="deadline-item mb-4">
                          <div className="intro-image-container">
                            <div className="intro-image main-image">
                              <h2>Campus Tour</h2>

                              <p className="mt-3">
                                Discover Leaders International College in person! Our campus tour invites you to step into the heart of our school, explore our modern classrooms, science and computer labs, libraries, and sports facilities, and experience the lively atmosphere that makes our community unique. During the tour, you’ll have the chance to meet our dedicated staff, ask questions about academics and student life, and see first-hand how we support every child’s growth.
                              </p>
                              <p className="mt-3">
                                Booking a tour is simple — just select a convenient day and provide your details. Our Admissions team will confirm your visit and guide you through everything you need to know. We look forward to welcoming you and showing you why Leaders International College is the perfect place for your child’s educational journey.            
                              </p>

                              <button
                                onClick={() => setOpen(true)}
                                className="btn btn-accent"
                                style={{
                                  backgroundColor: "var(--accent-color)",
                                  color: "#fff",
                                  padding: "12px 24px",
                                  borderRadius: "8px",
                                  fontWeight: 600,
                                  display: "inline-block",
                                  textDecoration: "none",
                                }}
                              >
                                Book a Tour
                              </button>
                            </div>
                          </div>
                        </div>

                        {open && (
  <div
    className="tour-modal-backdrop"
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      zIndex: 1050,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
    }}
    onClick={() => setOpen(false)}
  >
    <div
      className="tour-modal"
      style={{
        width: "min(900px, 100%)",
        maxHeight: "90vh",
        overflow: "auto",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="tour-modal-header"
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ margin: 0 }}>
          {bookingSuccess ? "Booking Confirmed" : "Book a Campus Tour"}
        </h2>
        <button
          aria-label="Close"
          onClick={() => setOpen(false)}
          style={{
            border: "none",
            background: "transparent",
            fontSize: "24px",
            lineHeight: 1,
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>

      <div className="tour-modal-body" style={{ padding: "24px" }}>
        {!bookingSuccess ? (
          <>
            <p style={{ marginTop: 0 }}>
              Please enter your details, then choose one of the available dates & times below.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              {/* Left column: fields */}
              <div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="tourStudentName">Student Name</label>
                  <input
                    id="tourStudentName"
                    name="studentName"
                    className="form-control"
                    type="text"
                    placeholder="e.g. Sarah Ahmed"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    style={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                    onFocus={(e) => (e.currentTarget.style.border = "2px solid var(--accent-color)")}
                    onBlur={(e) => (e.currentTarget.style.border = "1px solid #e5e7eb")}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="tourParentEmail">Parent Email</label>
                  <input
                    id="tourParentEmail"
                    name="parentEmail"
                    className="form-control"
                    type="email"
                    placeholder="name@example.com"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    style={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                    onFocus={(e) => (e.currentTarget.style.border = "2px solid var(--accent-color)")}
                    onBlur={(e) => (e.currentTarget.style.border = "1px solid #e5e7eb")}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="tourParentPhone">Parent Phone</label>
                  <input
                    id="tourParentPhone"
                    name="parentPhone"
                    className="form-control"
                    type="tel"
                    placeholder="+20 1X XXX XXXX"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    style={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                    onFocus={(e) => (e.currentTarget.style.border = "2px solid var(--accent-color)")}
                    onBlur={(e) => (e.currentTarget.style.border = "1px solid #e5e7eb")}
                  />
                </div>
              </div>

              {/* Right column: slots */}
              <div>
                <label className="form-label">Choose a Date & Time</label>

                {loadingSlots ? (
                  <div className="small text-muted">Loading available slots…</div>
                ) : slotsErr ? (
                  <div className="alert alert-danger">{slotsErr}</div>
                ) : visibleSlots.length === 0 ? (
                  <div className="small text-muted">No available slots at the moment.</div>
                ) : (
                  <>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gap: "10px",
                      }}
                    >
                      {visibleSlots.map((opt) => {
                        const displayLabel = opt.label?.trim() || fmtDateTime(opt.iso);
                        const isSelected = selectedSlotId === opt._id;
                        return (
                          <button
                            key={opt._id}
                            type="button"
                            onClick={() => {
                              setSelectedSlot(displayLabel);
                              setSelectedSlotId(opt._id);
                            }}
                            className="btn"
                            aria-pressed={isSelected}
                            style={{
                              padding: "12px 16px",
                              borderRadius: "8px",
                              textAlign: "left",
                              border: isSelected
                                ? "2px solid var(--accent-color)"
                                : "1px solid #e5e7eb",
                              background: isSelected ? "rgba(0,0,0,0.03)" : "#fff",
                              fontWeight: isSelected ? 700 : 600,
                              cursor: "pointer",
                            }}
                          >
                            {displayLabel}
                          </button>
                        );
                      })}
                    </div>

                    {selectedSlotId && selectedSlotObj && (
                      <div
                        style={{
                          marginTop: 12,
                          padding: "10px 12px",
                          borderRadius: 8,
                          background: "rgba(0,0,0,0.03)",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                        aria-live="polite"
                      >
                        <span className="small text-muted" style={{ fontWeight: 600 }}>
                          Selected:
                        </span>
                        <span
                          className="badge"
                          style={{
                            background: "var(--accent-color)",
                            color: "#fff",
                            padding: "6px 10px",
                            borderRadius: 999,
                            fontWeight: 700,
                          }}
                        >
                          {selectedSlotObj.label?.trim() || fmtDateTime(selectedSlotObj.iso)}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          // ===== Success view =====
          <div role="status" aria-live="polite">
            <div
              className="alert alert-success"
              style={{ fontSize: 16, fontWeight: 600 }}
            >
              ✅ Booking submitted successfully!
            </div>

            <div className="mb-3">
              <p style={{ marginBottom: 8 }}>
                Your booking code is <strong>{bookingSuccess.bookingId}</strong>.
              </p>
              <p style={{ marginBottom: 8 }}>
                We’ve sent <strong>two emails</strong>:
              </p>
              <ul style={{ marginTop: 0 }}>
                <li>
                  <strong>Admissions</strong>: A summary email was sent to{" "}
                  <code>Admission@leadersintcollege.com</code>.
                </li>
                <li>
                  <strong>Parent confirmation</strong>
                  {bookingSuccess.parentEmail
                    ? <>: sent to <code>{bookingSuccess.parentEmail}</code>.</>
                    : <>: (no parent email provided).</>}
                </li>
              </ul>
            </div>

            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: "rgba(0,0,0,0.03)",
                marginBottom: 12,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Visit Details</div>
              <div>Slot: {bookingSuccess.slotLabel || "—"}</div>
              {bookingSuccess.slotIso && (
                <div>
                  ISO (UTC):{" "}
                  <code>{new Date(bookingSuccess.slotIso).toISOString()}</code>
                </div>
              )}
            </div>

            <p className="small text-muted">
              Please keep your booking code safe. You’ll need it when contacting the admissions team.
            </p>
          </div>
        )}
      </div>

      <div
        className="tour-modal-footer"
        style={{
          padding: "16px 24px",
          borderTop: "1px solid #eee",
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        {!bookingSuccess ? (
          <>
            <button
              className="btn"
              style={{
                backgroundColor: "#f1f1f1",
                padding: "10px 22px",
                borderRadius: "8px",
                fontWeight: 500,
              }}
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn"
              style={{
                backgroundColor: "var(--accent-color)",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: "8px",
                fontWeight: 600,
              }}
              onClick={handleBookingSubmit}
              disabled={bookingLoading}
            >
              {bookingLoading ? "Submitting…" : "Submit Request"}
            </button>
          </>
        ) : (
          <button
            className="btn"
            style={{
              backgroundColor: "var(--accent-color)",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: 600,
            }}
            onClick={() => {
              setOpen(false);
              setBookingSuccess(null);
            }}
          >
            Done
          </button>
        )}
      </div>
    </div>
  </div>
)}


                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "form" && (
                  <div className="col-lg-12">
                    <div className="cta-wrapper mt-5">
                      <div className="cta-item apply p-4 border rounded shadow-sm bg-light w-100">
                        <i className="bi bi-file-earmark-check" />
                        <h3>Ready to Apply?</h3>
                        <p>
                          Please carefully provide the information requested below. Once submitted, our admissions team
                          will review your application and contact you to arrange interviews for both the student and
                          parents.
                        </p>
                      </div>
                    </div>

                    <div className="form-wrapper mt-5">
                      <div className="card w-100">
                        <div className="card-body">
                          <h2 className="card-title">Admission Application Form</h2>
                          <p>Please complete the form below to apply for admission at Leaders International College.</p>

                          <form id="applicationForm" className="php-email-form mt-4" onSubmit={handleSubmit}>
                            <h5>Applicant Details</h5>

                            <div className="row">
                              {[...fields]
                                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                                .map((field, index) => {
                                  const label =
                                    field.label ||
                                    (field.field_name ? field.field_name.replace(/_/g, " ") : "");
                                  const required = field.required ?? false;

                                  if (field.type === "radio" && field.options?.length) {
                                    return (
                                      <div className="col-md-6 mb-3" key={index}>
                                        <label className="form-label d-block">{label}</label>
                                        {field.options.map((opt, i) => (
                                          <div className="form-check form-check-inline" key={i}>
                                            <input
                                              className="form-check-input"
                                              type="radio"
                                              name={field.field_name}
                                              value={opt}
                                              required={required}
                                            />
                                            <label className="form-check-label">{opt}</label>
                                          </div>
                                        ))}
                                      </div>
                                    );
                                  }

                                  if (field.type === "select" && field.options?.length) {
                                    return (
                                      <div className="col-md-6 mb-3" key={index}>
                                        <label className="form-label">{label}</label>
                                        <select name={field.field_name} className="form-select" required={required} defaultValue="">
                                          <option value="" disabled>
                                            {label}
                                          </option>
                                          {field.options.map((opt, i) => (
                                            <option key={i} value={opt}>
                                              {opt}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    );
                                  }

                                  if (field.type === "date") {
                                    return (
                                      <div className="col-md-6 mb-3" key={index}>
                                        <label className="form-label">{label}</label>
                                        <input
                                          type="date"
                                          name={field.field_name}
                                          className="form-control"
                                          max={new Date().toISOString().split("T")[0]}
                                          required={required}
                                        />
                                      </div>
                                    );
                                  }

                                  if (field.type === "file") {
                                    return (
                                      <div className="col-md-6 mb-3" key={index}>
                                        <label className="form-label">{label}</label>
                                        <input type="file" name="files" className="form-control" required={required} />
                                      </div>
                                    );
                                  }

                                  return (
                                    <div className="col-md-6 mb-3" key={index}>
                                      <label className="form-label">{label}</label>
                                      <input
                                        type={field.type}
                                        name={field.field_name}
                                        className="form-control"
                                        placeholder={field.placeholder || label}
                                        required={required}
                                      />
                                    </div>
                                  );
                                })}
                            </div>

                            {successMessage && (
                              <div className="alert alert-success text-center" role="alert">
                                ✅ Application submitted successfully!
                              </div>
                            )}
                            {errorMessage && (
                              <div className="alert alert-danger text-center" role="alert">
                                {errorMessage}
                              </div>
                            )}

                            <div className="text-center mt-4">
                              <button
                                type="submit"
                                className="btn-submit-application"
                                disabled={isSubmitting}
                                style={{
                                  backgroundColor: isSubmitting ? "#7cc7de" : "#00a6d9",
                                  opacity: isSubmitting ? 0.7 : 1,
                                  cursor: isSubmitting ? "not-allowed" : "pointer",
                                }}
                              >
                                <i className="bi bi-file-earmark-text"></i>{" "}
                                {isSubmitting ? "Submitting..." : "Submit Application"}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeSection === "reserve" && (
                  <div className="col-lg-12">
                    <div className="admissions-requirements">
                      <h2>Reserve Assessment Date</h2>

                      <div className="requirements-list mt-4">
                        <div className="requirement-item shadow-sm p-3 rounded">
                          <div className="row align-items-center">
                            {/* Left (Text + Button on desktop) / First on mobile */}
                            <div className="col-12 col-lg-6 order-1 order-lg-1 mb-4 mb-lg-0">
                              <p className="mb-3">
                                Parents can now easily reserve their child’s assessment appointment online without the need for phone calls or in-person visits. Simply select a suitable date and time within two weeks of submitting your application. Once your reservation is complete, our admissions team will promptly confirm the booking and provide you with all the necessary details to prepare for the assessment day.
                              </p>

                              <Link
                                href="/admissions/appointments"
                                className="btn mt-2"
                                style={{
                                  backgroundColor: "var(--accent-color)",
                                  color: "#fff",
                                  fontWeight: 600,
                                  borderRadius: "6px",
                                  padding: "10px 20px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                              >
                                <i className="bi bi-calendar-check" />
                                Go to Reservation Page
                              </Link>
                            </div>

                            {/* Right (Image on desktop) / Second on mobile */}
                            <div className="col-12 col-lg-6 order-2 order-lg-2">
                              <div className="requirements-image">
                                <Image
                                  src="/assets/img/education/Reserve.JPG" 
                                  alt="Reserve Assessment Date"
                                  width={400}
                                  height={200}
                                  style={{
                                    width: "100%",
                                    height: "auto",
                                    borderRadius: "8px",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* ⬅️ NEW: lightweight popup/modal */}
      {showReserveModal && (
        <div className="reserve-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="reserveTitle">
          <div className="reserve-modal">
            <h3 id="reserveTitle" className="mb-2">Next step: Reserve assessment</h3>
            <p className="mb-3">
              Your application was received. Please book an assessment appointment now to complete the process.
            </p>
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (redirectTimer !== null) window.clearTimeout(redirectTimer);
                  router.push(reserveHref);
                }}
              >
                Go to reservation
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  if (redirectTimer !== null) window.clearTimeout(redirectTimer);
                  setShowReserveModal(false);
                }}
              >
                Not now
              </button>
            </div>
            <div className="small text-muted mt-2">You’ll be redirected automatically in a moment…</div>
          </div>
        </div>
      )}

{showBookedPopup && bookedPopup && createPortal(
  <div className="booked-popup-backdrop" role="dialog" aria-modal="true" aria-labelledby="bookedTitle">
    <div className="booked-popup-card">
      <div
        className="booked-popup-icon"
        aria-hidden
        style={{
          background: bookedPopup.kind === "success" ? "#e8f8ff" : "#ffeaea",
          color:       bookedPopup.kind === "success" ? "#0aa2d1" : "#c32626",
        }}
      >
        {bookedPopup.kind === "success" ? "✓" : "!"}
      </div>
      <h4 id="bookedTitle" style={{ margin: 0 }}>{bookedPopup.title}</h4>
      <p className="mb-3" style={{ textAlign: "center" }}>{bookedPopup.message}</p>
      <button
        className="btn"
        style={{
          backgroundColor: bookedPopup.kind === "success" ? "var(--accent-color)" : "#c32626",
          color: "#fff",
          borderRadius: 8,
          padding: "10px 18px",
          fontWeight: 600
        }}
        onClick={() => {
          if (bookedTimer !== null) window.clearTimeout(bookedTimer);
          setShowBookedPopup(false);
        }}
      >
        OK
      </button>
    </div>
  </div>,
  document.body
)}



      <style jsx>{`
        .custom-tab { border-radius: 50px; padding: 10px 20px; margin: 5px; background: #fff; border: 1px solid #ddd; font-weight: 600; }
        .custom-tab.active { background: #00b4e6; color: #fff; border: 1px solid #00b4e6; }

        /* ⬅️ Modal styles */
        .reserve-modal-backdrop{
          position: fixed; inset: 0; background: rgba(0,0,0,.45);
          display: flex; align-items: center; justify-content: center;
          z-index: 1050;
        }
        .reserve-modal{
          background: #fff; width: min(560px, 92vw);
          border-radius: 14px; padding: 22px;
          box-shadow: 0 12px 40px rgba(0,0,0,.2);
        }
        .reserve-modal h3{ font-weight: 800; color: #003a63; }
        .reserve-modal .btn{ border-radius: 10px; font-weight: 600; }
      `}</style>
    </>
  );
}
