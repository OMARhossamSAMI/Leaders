"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import AdminHeader from "../../../components/AdminHeader";
import AdminFooter from "../../../components/AdminFooter";
import "./page.css";
import * as XLSX from "xlsx"; // ← NEW
import axios from "axios";

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
  gradeApplyingFor?: string; // ✅ NEW
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
  const [selectedSlotForBookings, setSelectedSlotForBookings] = useState<
    string | null
  >(null);
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

  const loadSlots = async (): Promise<void> => {
    try {
      setLoadingSlots(true);
      setErr("");

      const res = await axios.get<Slot[]>(`${API}/booktour/admin/slots`, {
        headers: { "Content-Type": "application/json" },
      });
      setSlots(res.data || []);
    } catch (e: unknown) {
      let message = "Failed to load slots";

      if (e instanceof Error) {
        message = e.message;
      } else if (typeof e === "object" && e !== null && "message" in e) {
        message = String((e as { message?: string }).message);
      }

      console.error("[Slots] load error:", e);
      setErr(message);
    } finally {
      setLoadingSlots(false);
    }
  };

  const loadBookingsForSlot = async (slotId: string): Promise<void> => {
    try {
      setLoadingBookings(true);
      setBookingsErr("");

      const url = `${API}/booktour/admin/slots/${encodeURIComponent(
        slotId
      )}/bookings`;
      console.log("[Bookings] fetching:", url);

      const res = await axios.get<Booking[]>(url, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("[Bookings] response:", res.status, res.data);
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (e: unknown) {
      let message = "Failed to load bookings";

      if (
        typeof e === "object" &&
        e !== null &&
        "response" in e &&
        typeof (e as Record<string, unknown>).response === "object"
      ) {
        const errObj = e as {
          response?: {
            status?: number;
            data?: { message?: string; [key: string]: unknown };
          };
        };

        console.error(
          "[Bookings] load error:",
          errObj.response?.status,
          errObj.response?.data || e
        );

        message = errObj.response?.data?.message ?? message;
      }

      // ✅ 2. Handle normal JS Error
      else if (e instanceof Error) {
        console.error("[Bookings] load error:", e.message);
        message = e.message;
      }

      // ✅ 3. Handle non-object (string, number, etc.)
      else {
        console.error("[Bookings] load error:", e);
      }

      setBookingsErr(message);
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

  const handleCreate = async (): Promise<void> => {
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

      const res = await axios.post<Slot>(
        `${API}/booktour/admin/slots`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setMsg(`Created ✔ (${res.data?._id || ""})`);
      setShowCreate(false);
      setDate("");
      setTime("");
      setCapacity(1);
      setActive(true);
      setLabel("");
      await loadSlots();
    } catch (e: unknown) {
      let message = "Create failed";

      // ✅ Type-safe Axios-like error detection (no 'a')
      if (
        typeof e === "object" &&
        e !== null &&
        "response" in e &&
        typeof (e as Record<string, unknown>).response === "object"
      ) {
        const errObj = e as {
          response?: {
            status?: number;
            data?: { message?: string; [key: string]: unknown };
          };
        };

        console.error(
          "[Slot] create error:",
          errObj.response?.status,
          errObj.response?.data || e
        );
        message = errObj.response?.data?.message ?? message;
      }

      // ✅ Standard JavaScript Error
      else if (e instanceof Error) {
        console.error("[Slot] create error:", e.message);
        message = e.message;
      }

      // ✅ Other unknown errors (e.g. string)
      else {
        console.error("[Slot] create error:", e);
      }

      setErr(message);
    }
  };

  const handleToggle = async (id: string, newState: boolean): Promise<void> => {
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

      setSlots((prev) =>
        prev.map((s) => (s._id === id ? { ...s, active: newState } : s))
      );

      setMsg(`Slot ${newState ? "activated" : "deactivated"} ✔`);
    } catch (e: unknown) {
      let message = "Toggle failed";

      // ✅ Type-safe handling for Axios-style errors
      if (
        typeof e === "object" &&
        e !== null &&
        "response" in e &&
        typeof (e as Record<string, unknown>).response === "object"
      ) {
        const errObj = e as {
          response?: {
            status?: number;
            data?: { message?: string; [key: string]: unknown };
          };
        };

        console.error(
          "[Slot] toggle error:",
          errObj.response?.status,
          errObj.response?.data || e
        );

        message = errObj.response?.data?.message ?? message;
      }

      // ✅ Standard JS Error
      else if (e instanceof Error) {
        console.error("[Slot] toggle error:", e.message);
        message = e.message;
      }

      // ✅ Fallback for unknown error shapes
      else {
        console.error("[Slot] toggle error:", e);
      }

      setErr(message);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
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
    } catch (e: unknown) {
      let message = "Delete failed";

      // ✅ Handle Axios-style errors safely (no a)
      if (
        typeof e === "object" &&
        e !== null &&
        "response" in e &&
        typeof (e as Record<string, unknown>).response === "object"
      ) {
        const errObj = e as {
          response?: {
            status?: number;
            data?: { message?: string; [key: string]: unknown };
          };
        };

        console.error(
          "[Slot] delete error:",
          errObj.response?.status,
          errObj.response?.data || e
        );

        message = errObj.response?.data?.message ?? message;
      }

      // ✅ Normal JS error
      else if (e instanceof Error) {
        console.error("[Slot] delete error:", e.message);
        message = e.message;
      }

      // ✅ Other unknown types (string, number, etc.)
      else {
        console.error("[Slot] delete error:", e);
      }

      setErr(message);
    }
  };

  const handleDeleteBooking = async (
    bookingId: string,
    slotId: string
  ): Promise<void> => {
    if (!confirm("Delete this booking?")) return;

    setBookingsErr("");

    try {
      await axios.delete(`${API}/booktour/admin/bookings/${bookingId}`, {
        headers: { "Content-Type": "application/json" },
      });

      // ✅ Remove booking from table
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));

      // ✅ Decrement bookedCount safely
      setSlots((prev) =>
        prev.map((s) =>
          s._id === slotId
            ? { ...s, bookedCount: Math.max(0, (s.bookedCount ?? 0) - 1) }
            : s
        )
      );
    } catch (e: unknown) {
      let message = "Failed to delete booking";

      // ✅ Handle Axios-style error safely (no a)
      if (
        typeof e === "object" &&
        e !== null &&
        "response" in e &&
        typeof (e as Record<string, unknown>).response === "object"
      ) {
        const errObj = e as {
          response?: {
            status?: number;
            data?: { message?: string; [key: string]: unknown };
          };
        };

        console.error(
          "[Booking] delete error:",
          errObj.response?.status,
          errObj.response?.data || e
        );

        message = errObj.response?.data?.message ?? message;
      }

      // ✅ Standard JS error
      else if (e instanceof Error) {
        console.error("[Booking] delete error:", e.message);
        message = e.message;
      }

      // ✅ Unknown non-object (string, etc.)
      else {
        console.error("[Booking] delete error:", e);
      }

      setBookingsErr(message);
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

  // ---- Export current view (Bookings tab) to Excel ----
  const exportCurrentBookingsToExcel = (): void => {
    if (bookings.length === 0) return;

    // Map slotId → Slot for quick lookup
    const slotMap = new Map(slots.map((s) => [s._id, s]));

    const rows = bookings.map((b) => {
      const s = slotMap.get(String(b.slotId));
      const label = b.selectedLabel || (s ? slotDisplayLabel(s) : "");

      // ✅ Safely read "gradeApplyingFor" even if not declared in Booking type
      const grade = b.gradeApplyingFor?.trim() ?? "";
      return {
        Student: b.studentName,
        "Parent Email": b.parentEmail,
        "Parent Phone": b.parentPhone,
        "Selected Label": label,
        "Grade Applying For": grade,
        "Booked At": b.createdAt ? new Date(b.createdAt).toLocaleString() : "",
      };
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);

    // ✅ Type-safe column widths
    type SheetWithCols = XLSX.WorkSheet & { ["!cols"]?: { wch: number }[] };
    (ws as SheetWithCols)["!cols"] = [
      { wch: 24 }, // Student
      { wch: 32 }, // Parent Email
      { wch: 18 }, // Parent Phone
      { wch: 32 }, // Selected Label
      { wch: 22 }, // Grade Applying For
      { wch: 24 }, // Booked At
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Bookings");

    // Filename reflects current filter (All vs. specific slot)
    const pageName = (() => {
      if (!selectedSlotForBookings) return "All";
      const s = slotMap.get(selectedSlotForBookings);
      if (!s) return "All";
      const label = slotDisplayLabel(s);
      return label || "Slot";
    })();

    const safe = pageName.replace(/[^\w\-]+/g, "_");
    const stamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `bookings_${safe}_${stamp}.xlsx`);
  };

  // ---- Render ----
  if (!authenticated) return null;

  return (
    <>
      <AdminHeader />

      <div
        style={{
          paddingTop: "130px",
          backgroundColor: "#f5f9fa",
          minHeight: "100vh",
        }}
      >
        <section className="admin-section">
          {/* Header */}
          <div className="container section-title">
            <h2>Book a Tour</h2>
            <p>
              Create, activate, and manage campus tour slots — and view
              bookings.
            </p>
            <br />

            {/* Tabs */}
            <div
              className="tabs-container"
              role="tablist"
              aria-label="Book a Tour Tabs"
            >
              <button
                role="tab"
                aria-selected={activeTab === "slots"}
                className={`tab-btn ${
                  activeTab === "slots" ? "active-tab" : ""
                }`}
                onClick={() => setActiveTab("slots")}
              >
                Slots
              </button>
              <button
                role="tab"
                aria-selected={activeTab === "bookings"}
                className={`tab-btn ${
                  activeTab === "bookings" ? "active-tab" : ""
                }`}
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
                <button
                  className="btn btn-accent"
                  onClick={loadSlots}
                  disabled={loadingSlots}
                >
                  {loadingSlots ? "Refreshing…" : "Refresh"}
                </button>
                <button
                  className="btn btn-primary"
                  style={{
                    backgroundColor: "var(--accent-color)",
                    color: "#fff",
                  }}
                  onClick={() => setShowCreate(true)}
                >
                  + Add Slot
                </button>
              </div>

              {/* Alerts */}
              {msg && (
                <div className="alert alert-success" role="alert">
                  {msg}
                </div>
              )}
              {err && (
                <div className="alert alert-danger" role="alert">
                  {err}
                </div>
              )}

              {/* Content */}
              {loadingSlots ? (
                <div className="loader-container">
                  <div className="spinner" />
                  <p className="loading-text">Loading Slots...</p>
                </div>
              ) : slots.length === 0 ? (
                <p
                  style={{
                    color: "#888",
                    fontStyle: "italic",
                    padding: "1rem",
                  }}
                >
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
                          <tr
                            key={s._id}
                            className={isPast ? "table-light" : ""}
                          >
                            <td>
                              {s.label || new Date(s.iso).toLocaleString()}
                            </td>
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
                                className={`badge ${
                                  effectiveActive(s)
                                    ? "bg-success"
                                    : "bg-secondary"
                                }`}
                                style={{ fontWeight: 600 }}
                              >
                                {effectiveActive(s) ? "ON" : "OFF"}
                              </span>
                              {isPast && (
                                <div className="small text-muted">Past</div>
                              )}
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
                  <span className="me-2 fw-semibold">
                    Filter by date/label:
                  </span>

                  <div className="filter-chips">
                    {/* Optional "All" chip to show every booking */}
                    <button
                      type="button"
                      className={`filter-btn ${
                        selectedSlotForBookings === null ? "active-filter" : ""
                      }`}
                      onClick={async (): Promise<void> => {
                        setSelectedSlotForBookings(null);
                        setBookingsErr("");

                        try {
                          setLoadingBookings(true);

                          const res = await axios.get<Booking[]>(
                            `${API}/booktour/admin/bookings`
                          );
                          setBookings(Array.isArray(res.data) ? res.data : []);

                          console.log(
                            "[Bookings] ALL response:",
                            res.status,
                            res.data
                          );
                        } catch (e: unknown) {
                          let message = "Failed to load bookings";

                          // ✅ Type-safe Axios error guard
                          if (
                            typeof e === "object" &&
                            e !== null &&
                            "response" in e &&
                            typeof (e as Record<string, unknown>).response ===
                              "object"
                          ) {
                            const errObj = e as {
                              response?: {
                                status?: number;
                                data?: {
                                  message?: string;
                                  [key: string]: unknown;
                                };
                              };
                            };

                            console.error(
                              "[Bookings] ALL error:",
                              errObj.response?.status,
                              errObj.response?.data || e
                            );

                            message = errObj.response?.data?.message ?? message;
                          }

                          // ✅ Standard JS error
                          else if (e instanceof Error) {
                            console.error("[Bookings] ALL error:", e.message);
                            message = e.message;
                          }

                          // ✅ Unknown type (string, etc.)
                          else {
                            console.error("[Bookings] ALL error:", e);
                          }

                          setBookingsErr(message);
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
                          className={`filter-btn ${
                            isActiveChip ? "active-filter" : ""
                          }`}
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
                    className="btn-export"
                    onClick={exportCurrentBookingsToExcel}
                    disabled={loadingBookings || bookings.length === 0}
                    title="Export the currently visible bookings to CSV"
                  >
                    <span className="export-icon" aria-hidden="true">
                      {/* inline SVG icon */}
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="currentColor"
                      >
                        <path d="M5 20h14a1 1 0 0 0 1-1v-4h-2v3H6v-3H4v4a1 1 0 0 0 1 1z"></path>
                        <path d="M12 3a1 1 0 0 1 1 1v8.586l2.293-2.293 1.414 1.414L12 16.414l-4.707-4.707 1.414-1.414L11 12.586V4a1 1 0 0 1 1-1z"></path>
                      </svg>
                    </span>
                    {selectedSlotForBookings
                      ? "Export to excel"
                      : "Export All to excel"}
                  </button>

                  <button
                    className="btn btn-accent"
                    onClick={() => {
                      if (selectedSlotForBookings) {
                        void loadBookingsForSlot(selectedSlotForBookings);
                      } else {
                        (async (): Promise<void> => {
                          try {
                            setLoadingBookings(true);
                            setBookingsErr("");

                            const res = await axios.get<Booking[]>(
                              `${API}/booktour/admin/bookings`
                            );
                            setBookings(
                              Array.isArray(res.data) ? res.data : []
                            );
                          } catch (e: unknown) {
                            let message = "Failed to load bookings";

                            // ✅ Axios-style error narrowing
                            if (
                              typeof e === "object" &&
                              e !== null &&
                              "response" in e &&
                              typeof (e as Record<string, unknown>).response ===
                                "object"
                            ) {
                              const errObj = e as {
                                response?: {
                                  status?: number;
                                  data?: {
                                    message?: string;
                                    [key: string]: unknown;
                                  };
                                };
                              };

                              console.error(
                                "[Bookings] load error:",
                                errObj.response?.status,
                                errObj.response?.data || e
                              );

                              message =
                                errObj.response?.data?.message ?? message;
                            } else if (e instanceof Error) {
                              // ✅ Standard JavaScript error
                              console.error(
                                "[Bookings] load error:",
                                e.message
                              );
                              message = e.message;
                            } else {
                              // ✅ Unknown fallback
                              console.error("[Bookings] load error:", e);
                            }

                            setBookingsErr(message);
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
              {bookingsErr && (
                <div className="alert alert-danger">{bookingsErr}</div>
              )}

              {loadingBookings ? (
                <div className="loader-container">
                  <div className="spinner" />
                  <p className="loading-text">Loading Bookings...</p>
                </div>
              ) : bookings.length === 0 ? (
                <p className="text-muted" style={{ padding: "0.5rem" }}>
                  No bookings found
                  {selectedSlotForBookings ? " for this slot." : "."}
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
                        <th>Grade Applying For</th> {/* ✅ NEW */}
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => {
                        const slot = slots.find(
                          (s) => s._id === (b.slotId as unknown as string)
                        );
                        return (
                          <tr key={b._id}>
                            <td>{b.studentName}</td>
                            <td>
                              <a href={`mailto:${b.parentEmail}`}>
                                {b.parentEmail}
                              </a>
                            </td>
                            <td>
                              <a href={`tel:${b.parentPhone}`}>
                                {b.parentPhone}
                              </a>
                            </td>
                            <td>
                              {b.selectedLabel ||
                                (slot ? slotDisplayLabel(slot) : "—")}
                            </td>
                            <td>{b.gradeApplyingFor?.trim() || "—"}</td>{" "}
                            {/* ✅ NEW */}
                            <td className="text-end">
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  handleDeleteBooking(
                                    b._id,
                                    b.slotId as unknown as string
                                  )
                                }
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
              <button
                className="btn btn-sm btn-light"
                onClick={() => setShowCreate(false)}
              >
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
                  <div className="form-text">
                    If left empty, your typed date/time will be shown to
                    parents.
                  </div>
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
                <button
                  className="btn btn-light"
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn"
                  style={{
                    backgroundColor: "var(--accent-color)",
                    color: "#fff",
                  }}
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
