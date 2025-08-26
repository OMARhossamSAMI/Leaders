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

export default function BookTourAdminPage() {
  const API = process.env.NEXT_PUBLIC_API_URL!;
  const router = useRouter();

  // ---- Auth ----
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  // ---- Slots state ----
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [msg, setMsg] = useState<string>("");
  const [err, setErr] = useState<string>("");

  // ---- Create modal state ----
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [date, setDate] = useState<string>(""); // yyyy-mm-dd
  const [time, setTime] = useState<string>(""); // hh:mm
  const [capacity, setCapacity] = useState<number>(1);
  const [active, setActive] = useState<boolean>(true);
  const [label, setLabel] = useState<string>("");

  // Build ISO (UTC) from picked local date & time
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

  // ---- Auth check (redirect if no token) ----
  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) {
      router.push("/lic-auth-v9v3tz");
    } else {
      setAuthenticated(true);
    }
  }, [router]);

  // ---- Load all slots ----
  const loadSlots = async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await axios.get<Slot[]>(`${API}/booktour/admin/slots`, {
        headers: { "Content-Type": "application/json" },
      });
      setSlots(res.data);
    } catch (e: any) {
      console.error(e);
      setErr(e?.response?.data?.message || e.message || "Failed to load slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authenticated) return;
    void loadSlots();
  }, [authenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Create slot ----
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
      // reset fields
      setDate("");
      setTime("");
      setCapacity(1);
      setActive(true);
      setLabel("");
      await loadSlots();
    } catch (e: any) {
      console.error(e);
      setErr(e?.response?.data?.message || e.message || "Create failed");
    }
  };

  // ---- Toggle active ----
  const handleToggle = async (id: string, newState: boolean) => {
    setMsg("");
    setErr("");
    try {
      await axios.patch<Slot>(
        `${API}/booktour/admin/slots/${id}`,
        { active: newState },
        { headers: { "Content-Type": "application/json" } }
      );
      setSlots((prev) => prev.map((s) => (s._id === id ? { ...s, active: newState } : s)));
      setMsg(`Slot ${newState ? "activated" : "deactivated"} ✔`);
    } catch (e: any) {
      console.error(e);
      setErr(e?.response?.data?.message || e.message || "Toggle failed");
    }
  };

  // ---- Delete slot ----
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this slot (and its bookings)?")) return;
    setMsg("");
    setErr("");
    try {
      await axios.delete(`${API}/booktour/admin/slots/${id}`);
      setSlots((prev) => prev.filter((s) => s._id !== id));
      setMsg("Deleted ✔");
    } catch (e: any) {
      console.error(e);
      setErr(e?.response?.data?.message || e.message || "Delete failed");
    }
  };

  // Placeholder/auto label suggestion
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

  // ---- Render (after all hooks are declared) ----
  // We still can short-circuit UI for unauthenticated, but AFTER hooks are set up:
  if (!authenticated) return null;

  return (
    <>
      <AdminHeader />

      <div
        style={{
          paddingTop: "130px", // push below fixed header
          backgroundColor: "#f5f9fa",
          minHeight: "100vh",
        }}
      >
        <section className="admin-section">
          {/* Header */}
          <div className="container section-title">
            <h2>Book a Tour — Slots</h2>
            <p>Create, activate, and manage campus tour slots.</p>
          </div>

          {/* Shadow container */}
          <div className="admin-shadow-box">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <button className="btn btn-outline-secondary" onClick={loadSlots} disabled={loading}>
                {loading ? "Refreshing…" : "Refresh"}
              </button>
              <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
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
            {loading ? (
              <>
                <div className="loader-container">
                  <div className="spinner" />
                  <p className="loading-text">Loading Slots...</p>
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
                      <th className="text-center">Capacity</th>
                      <th className="text-center">Booked</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map((s) => (
                      <tr key={s._id}>
                        <td>{s.label || new Date(s.iso).toLocaleString()}</td>
                        <td className="small text-muted">{s.iso}</td>
                        <td className="text-center">
                          <span
                            className={`badge ${s.active ? "bg-success" : "bg-secondary"}`}
                            style={{ fontWeight: 600 }}
                          >
                            {s.active ? "ON" : "OFF"}
                          </span>
                        </td>
                        <td className="text-center">{s.capacity}</td>
                        <td className="text-center">{s.bookedCount}</td>
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
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
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
                <div className="col-12 col-md-4">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    step={900}
                    className="form-control"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label">Capacity</label>
                  <input
                    type="number"
                    min={1}
                    className="form-control"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
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
