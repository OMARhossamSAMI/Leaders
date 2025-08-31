"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import AdminHeader from "../../../components/AdminHeader";
import AdminFooter from "../../../components/AdminFooter";
import "./page.css";

// ---- Types ----
type Slot = {
  _id: string;
  iso: string; // ISO (UTC)
  label?: string;
  active: boolean;
  capacity: number;
  bookedCount: number;
  createdAt?: string;
  updatedAt?: string;
};

type Booking = {
  _id: string;
  slotId: string; // ObjectId as string in payload
  studentName: string;
  parentEmail: string;
  parentPhone: string;
  selectedLabel?: string;
  createdAt?: string;
};

export default function BookTourAdminPage() {
  const API = process.env.NEXT_PUBLIC_API_URL!;
  const router = useRouter();

  // ---- Auth ----
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  // ---- Tabs ----
  const [activeTab, setActiveTab] = useState<"slots" | "bookings">("slots");

  // ---- Slots state ----
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(true);
  const [msg, setMsg] = useState<string>("");
  const [err, setErr] = useState<string>("");

  // ---- Create modal state ----
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [date, setDate] = useState<string>(""); // yyyy-mm-dd
  const [time, setTime] = useState<string>(""); // hh:mm
  const [capacity, setCapacity] = useState<number>(1);
  const [active, setActive] = useState<boolean>(true);
  const [label, setLabel] = useState<string>("");

  // ---- Bookings tab state ----
  const [selectedSlotForBookings, setSelectedSlotForBookings] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(false);
  const [bookingsErr, setBookingsErr] = useState<string>("");

  // ---- Derived values ----

  const isoPreview = useMemo(() => {
    if (!date || !time) return "";
    const local = new Date(`${date}T${time}:00`);
    if (isNaN(local.getTime())) return "";
    return new Date(
      Date.UTC(
        local.getFullYear(),
        local.getMonth(),
        local.getDate(),
        local.getHours(),
        local.getMinutes(),
        0,
        0
      )
    ).toISOString();
  }, [date, time]);

  const slotDisplayLabel = (s: Slot) =>
    s.label?.trim() ||
    `${new Date(s.iso).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    })} • ${new Date(s.iso).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

  const sortedSlotsDesc = useMemo(
    () =>
      (slots || [])
        .slice()
        .sort((a, b) => new Date(b.iso).getTime() - new Date(a.iso).getTime()),
    [slots]
  );

  // Treat slots whose ISO is in the past as OFF in the UI (effective active flag)
  const effectiveActive = (s: Slot) =>
    s.active && new Date(s.iso).getTime() >= Date.now();

  // ---- Data loaders ----

  const loadSlots = async () => {
    try {
      setLoadingSlots(true);
      setErr("");
      const res = await axios.get<Slot[]>(`${API}/booktour/admin/slots`, {
        headers: { "Content-Type": "application/json" },
      });
      setSlots(res.data || []);
    } catch (e: any) {
      console.error("[Slots] load error:", e?.response?.status, e?.response?.data || e);
      setErr(e?.response?.data?.message || e.message || "Failed to load slots");
    } finally {
      setLoadingSlots(false);
    }
  };

  const loadBookingsForSlot = async (slotId: string) => {
    try {
      setLoadingBookings(true);
      setBookingsErr("");
      const url = `${API}/booktour/admin/slots/${encodeURIComponent(slotId)}/bookings`;
      console.log("[Bookings] fetching:", url);
      const res = await axios.get<Booking[]>(url, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("[Bookings] response:", res.status, res.data);
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (e: any) {
      console.error("[Bookings] load error:", e?.response?.status, e?.response?.data || e);
      setBookingsErr(e?.response?.data?.message || e.message || "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleFilterClick = async (slot: Slot) => {
    console.log("[Bookings] chip clicked:", {
      slotId: slot._id,
      label: slot.label,
      iso: slot.iso,
    });
    setSelectedSlotForBookings(slot._id);
    await loadBookingsForSlot(slot._id);
  };

  // ---- Auth check ----
  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) {
      router.push("/lic-auth-v9v3tz");
    } else {
      setAuthenticated(true);
    }
  }, [router]);

  // ---- Initial load ----
  useEffect(() => {
    if (!authenticated) return;
    void loadSlots();
  }, [authenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Actions ----

  const handleCreate = async () => {
    setMsg("");
    setErr("");

    if (!date || !time) {
      setErr("Please pick both date and time.");
      return;
    }
    if (!isoPreview) {
      setErr("Invalid date/time.");
      return;
    }

    try {
      const payload = {
        iso: isoPreview,
        label: label?.trim() || undefined,
        active,
        capacity: Number(capacity) || 1,
      };
      const res = await axios.post<Slot>(`${API}/booktour/admin/slots`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      setMsg(`Created ✔ (${res.data?._id || ""})`);
      setShowCreate(false);
      setDate("");
      setTime("");
      setCapacity(1);
      setActive(true);
      setLabel("");
      await loadSlots();
    } catch (e: any) {
      console.error("[Slot] create error:", e?.response?.status, e?.response?.data || e);
      setErr(e?.response?.data?.message || e.message || "Create failed");
    }
  };

  const handleToggle = async (id: string, newState: boolean) => {
    setMsg("");
    setErr("");

    const slot = slots.find((x) => x._id === id);
    if (!slot) {
      setErr("Slot not found");
      return;
    }

    // Block activating a past slot
    if (newState && new Date(slot.iso).getTime() < Date.now()) {
      setErr("Cannot activate a past slot.");
      return;
    }

    try {
      await axios.patch<Slot>(
        `${API}/booktour/admin/slots/${id}`,
        { active: newState },
        { headers: { "Content-Type": "application/json" } }
      );
      setSlots((prev) => prev.map((s) => (s._id === id ? { ...s, active: newState } : s)));
      setMsg(`Slot ${newState ? "activated" : "deactivated"} ✔`);
    } catch (e: any) {
      console.error("[Slot] toggle error:", e?.response?.status, e?.response?.data || e);
      setErr(e?.response?.data?.message || e.message || "Toggle failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this slot (and its bookings)?")) return;
    setMsg("");
    setErr("");
    try {
      await axios.delete(`${API}/booktour/admin/slots/${id}`);
      setSlots((prev) => prev.filter((s) => s._id !== id));
      setMsg("Deleted ✔");
      if (selectedSlotForBookings === id) {
        setSelectedSlotForBookings(null);
        setBookings([]);
      }
    } catch (e: any) {
      console.error("[Slot] delete error:", e?.response?.status, e?.response?.data || e);
      setErr(e?.response?.data?.message || e.message || "Delete failed");
    }
  };

  const handleDeleteBooking = async (bookingId: string, slotId: string) => {
  if (!confirm("Delete this booking?")) return;
  setBookingsErr("");

  try {
    await axios.delete(`${API}/booktour/admin/bookings/${bookingId}`, {
      headers: { "Content-Type": "application/json" },
    });

    // Remove booking from table
    setBookings((prev) => prev.filter((b) => b._id !== bookingId));

    // Optimistically decrement bookedCount for that slot in the slots list
    setSlots((prev) =>
      prev.map((s) =>
        s._id === (slotId as unknown as string)
          ? { ...s, bookedCount: Math.max(0, (s.bookedCount ?? 0) - 1) }
          : s
      )
    );
  } catch (e: any) {
    console.error("[Booking] delete error:", e?.response?.status, e?.response?.data || e);
    setBookingsErr(e?.response?.data?.message || e.message || "Failed to delete booking");
  }
};

  const autoLabel = () => {
    if (!date || !time) return "";
    const local = new Date(`${date}T${time}:00`);
    if (isNaN(local.getTime())) return "";
    return (
      local.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }) +
      " • " +
      local.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      })
    );
  };

  // ---- Render ----
  if (!authenticated) return null;

  return (
    <>
      <AdminHeader />

      <div style={{ paddingTop: "130px", backgroundColor: "#f5f9fa", minHeight: "100vh" }}>
        <section className="admin-section">
          {/* Header */}
          <div className="container section-title">
            <h2>Book a Tour</h2>
            <p>Create, activate, and manage campus tour slots — and view bookings.</p>
            <br />

            {/* Tabs */}
            <div className="tabs-container" role="tablist" aria-label="Book a Tour Tabs">
              <button
                role="tab"
                aria-selected={activeTab === "slots"}
                className={`tab-btn ${activeTab === "slots" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("slots")}
              >
                Slots
              </button>
              <button
                role="tab"
                aria-selected={activeTab === "bookings"}
                className={`tab-btn ${activeTab === "bookings" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("bookings")}
              >
                Bookings
              </button>
            </div>
          </div>

          {/* ---- SLOTS TAB ---- */}
          {activeTab === "slots" && (
            <div className="testimonial-box admin-shadow-box">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-accent" onClick={loadSlots} disabled={loadingSlots}>
                  {loadingSlots ? "Refreshing…" : "Refresh"}
                </button>
                <button
                  className="btn btn-primary"
                  style={{ backgroundColor: "var(--accent-color)", color: "#fff" }}
                  onClick={() => setShowCreate(true)}
                >
                  + Add Slot
                </button>
              </div>

              {/* Alerts */}
              {msg && <div className="alert alert-success" role="alert">{msg}</div>}
              {err && <div className="alert alert-danger" role="alert">{err}</div>}

              {/* Content */}
              {loadingSlots ? (
                <div className="loader-container">
                  <div className="spinner" />
                  <p className="loading-text">Loading Slots...</p>
                </div>
              ) : slots.length === 0 ? (
                <p style={{ color: "#888", fontStyle: "italic", padding: "1rem" }}>
                  No slots yet — click “+ Add Slot”.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Label</th>
                        <th>ISO (UTC)</th>
                        <th className="text-center">Active</th>
                        <th className="text-center">Booked</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedSlotsDesc.map((s) => {
                        const booked = s.bookedCount ?? 0;
                        const isPast = new Date(s.iso).getTime() < Date.now();

                        return (
                          <tr key={s._id} className={isPast ? "table-light" : ""}>
                            <td>{s.label || new Date(s.iso).toLocaleString()}</td>
                            <td className="small text-muted">
                              {new Date(s.iso).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}{" "}
                              –{" "}
                              {new Date(s.iso).toLocaleTimeString(undefined, {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="text-center">
                              <span
                                className={`badge ${effectiveActive(s) ? "bg-success" : "bg-secondary"}`}
                                style={{ fontWeight: 600 }}
                              >
                                {effectiveActive(s) ? "ON" : "OFF"}
                              </span>
                              {isPast && <div className="small text-muted">Past</div>}
                            </td>
                            <td className="text-center">{booked}</td>
                            <td className="text-end">
                              <div className="d-inline-flex gap-2">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleToggle(s._id, !s.active)}
                                >
                                  {s.active ? "Deactivate" : "Activate"}
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(s._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ---- BOOKINGS TAB ---- */}
          {activeTab === "bookings" && (
            <div className="testimonial-box admin-shadow-box">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span className="me-2 fw-semibold">Filter by date/label:</span>

                  <div className="filter-chips">
                    {/* Optional "All" chip to show every booking */}
                    <button
                      type="button"
                      className={`filter-btn ${selectedSlotForBookings === null ? "active-filter" : ""}`}
                      onClick={async () => {
                        setSelectedSlotForBookings(null);
                        setBookingsErr("");
                        try {
                          setLoadingBookings(true);
                          const res = await axios.get<Booking[]>(`${API}/booktour/admin/bookings`);
                          setBookings(Array.isArray(res.data) ? res.data : []);
                          console.log("[Bookings] ALL response:", res.status, res.data);
                        } catch (e: any) {
                          console.error("[Bookings] ALL error:", e?.response?.status, e?.response?.data || e);
                          setBookingsErr(e?.response?.data?.message || e.message || "Failed to load bookings");
                          setBookings([]);
                        } finally {
                          setLoadingBookings(false);
                        }
                      }}
                    >
                      All
                    </button>

                    {sortedSlotsDesc.map((s) => {
                      const isActiveChip = selectedSlotForBookings === s._id;
                      const label = slotDisplayLabel(s);
                      return (
                        <button
                          key={s._id}
                          type="button"
                          className={`filter-btn ${isActiveChip ? "active-filter" : ""}`}
                          aria-pressed={isActiveChip}
                          onClick={() => handleFilterClick(s)}
                          title={label}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-accent"
                    onClick={() => {
                      if (selectedSlotForBookings) {
                        void loadBookingsForSlot(selectedSlotForBookings);
                      } else {
                        // refresh "All"
                        (async () => {
                          try {
                            setLoadingBookings(true);
                            setBookingsErr("");
                            const res = await axios.get<Booking[]>(`${API}/booktour/admin/bookings`);
                            setBookings(Array.isArray(res.data) ? res.data : []);
                          } catch (e: any) {
                            setBookingsErr(e?.response?.data?.message || e.message || "Failed to load bookings");
                          } finally {
                            setLoadingBookings(false);
                          }
                        })();
                      }
                    }}
                    disabled={loadingBookings}
                  >
                    {loadingBookings ? "Refreshing…" : "Refresh"}
                  </button>
                </div>
              </div>

              {/* Info / alerts */}
              {bookingsErr && <div className="alert alert-danger">{bookingsErr}</div>}

              {loadingBookings ? (
                  <div className="loader-container">
                    <div className="spinner" />
                    <p className="loading-text">Loading Bookings...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <p className="text-muted" style={{ padding: "0.5rem" }}>
                    No bookings found{selectedSlotForBookings ? " for this slot." : "."}
                  </p>
                ) : (
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Parent Email</th>
                          <th>Parent Phone</th>
                          <th>Selected Label</th>
                          <th>Booked At</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b) => {
                          const slot = slots.find((s) => s._id === (b.slotId as unknown as string));
                          return (
                            <tr key={b._id}>
                              <td>{b.studentName}</td>
                              <td>
                                <a href={`mailto:${b.parentEmail}`}>{b.parentEmail}</a>
                              </td>
                              <td>
                                <a href={`tel:${b.parentPhone}`}>{b.parentPhone}</a>
                              </td>
                              <td>{b.selectedLabel || (slot ? slotDisplayLabel(slot) : "—")}</td>
                              <td className="small text-muted">
                                {b.createdAt ? new Date(b.createdAt).toLocaleString() : "—"}
                              </td>
                              <td className="text-end">
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteBooking(b._id, b.slotId as unknown as string)}
                                  title="Delete booking"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}


            </div>
          )}
        </section>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div
          className="modal-backdrop"
          onClick={() => setShowCreate(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 1050,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 12,
              width: "min(820px, 100%)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
          >
            <div
              className="d-flex align-items-center justify-content-between"
              style={{ padding: "16px 20px", borderBottom: "1px solid #eee" }}
            >
              <h5 className="m-0">Create Slot</h5>
              <button className="btn btn-sm btn-light" onClick={() => setShowCreate(false)}>
                ✕
              </button>
            </div>

            <div style={{ padding: 20 }}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    step={900}
                    className="form-control"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Label (optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={autoLabel() || "e.g. Wed, 3 Sep • 11:00 AM"}
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                  />
                  <div className="form-text">If left empty, your typed date/time will be shown to parents.</div>
                </div>

                <div className="col-12 d-flex align-items-center gap-3">
                  <div className="form-check form-switch">
                    <input
                      id="activeSwitch"
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="activeSwitch">
                      Active (visible to parents)
                    </label>
                  </div>

                  <div className="ms-auto small text-muted">
                    {isoPreview ? (
                      <>
                        <strong>ISO (UTC):</strong> {isoPreview}
                      </>
                    ) : (
                      "Pick date & time to see ISO"
                    )}
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button className="btn btn-light" onClick={() => setShowCreate(false)}>
                  Cancel
                </button>
                <button
                  className="btn"
                  style={{ backgroundColor: "var(--accent-color)", color: "#fff" }}
                  onClick={handleCreate}
                >
                  Create Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AdminFooter />
    </>
  );
}
