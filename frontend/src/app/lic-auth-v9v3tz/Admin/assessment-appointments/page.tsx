"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "../../../components/AdminHeader";
import AdminFooter from "../../../components/AdminFooter";

// 1) add server field to the type
type Appt = {
  _id: string;
  parentEmail: string;
  slotISO: string;
  applicationId?: string;
  createdAt?: string;
  studentName?: string;
  studentGrade?: string;
  waSentAt?: string | null;            // <— NEW
};

// 2) bump LS key so old appId-based entries don’t poison UI
const SENT_LS_KEY = "wa_sent_appts_v2"; // <— was v1
const CUSTOM_SENT_LS_KEY = "wa_custom_sent_v1";

const API = process.env.NEXT_PUBLIC_API_URL as string;

type FilterMode = "upcoming" | "past" | "all";

export default function AssessmentAppointmentsPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [readyToRender, setReadyToRender] = useState(false);

  const [items, setItems] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [q, setQ] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("upcoming");

  // send-status for confirmation template
  const [sendingIds, setSendingIds] = useState<Set<string>>(new Set());
  const [sendOk, setSendOk] = useState<Record<string, string[]>>({});
  const [sendErr, setSendErr] = useState<Record<string, string>>({});

  // bulk-select state (NEW)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // persistent “already sent” (confirmation template)
  const [sentKeys, setSentKeys] = useState<Set<string>>(new Set());
  // persistent “custom message sent” (NEW)
  const [customSent, setCustomSent] = useState<Set<string>>(new Set());

  // modal for custom message (NEW)
  const [customOpen, setCustomOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState("");
  const [customSending, setCustomSending] = useState(false);
  const [customError, setCustomError] = useState("");

  // delete state
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [showAppointments, setShowAppointments] = useState<boolean>(true);
  const [savingToggle, setSavingToggle] = useState(false);
  const [amount, setAmount] = useState<number>(0); // stored in cents from backend
  const [amountMajor, setAmountMajor] = useState<string>("0"); // before decimal
  const [amountMinor, setAmountMinor] = useState<string>("00"); // after decimal
  const [savingAmount, setSavingAmount] = useState(false);

  // ---------- auth gate ----------
  useEffect(() => {
    const shouldRefresh = sessionStorage.getItem("force_admin_refresh");
    if (shouldRefresh === "true") {
      sessionStorage.removeItem("force_admin_refresh");
      location.reload();
      return;
    }
    const token = sessionStorage.getItem("admin_token");
    if (!token) router.push("/lic-auth-v9v3tz");
    else setAuthenticated(true);
    setLoadingAuth(false);
  }, [router]);
  useEffect(() => {
    if (!authenticated) return;
    (async () => {
      try {
        const res = await fetch(`http://localhost:3000/settings/show-events`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          // backend returns { showAppointments: true/false }
          setShowAppointments(Boolean(data.showAppointments));
        }
      } catch (err) {
        console.error("Failed to load showAppointments setting", err);
      }
    })();
  }, [authenticated, API]);

  // preloader
  useEffect(() => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      const t = setTimeout(() => {
        preloader.style.display = "none";
        setReadyToRender(true);
      }, 200);
      return () => clearTimeout(t);
    } else {
      setReadyToRender(true);
    }
  }, []);

  // restore local persisted flags
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SENT_LS_KEY);
      if (raw) setSentKeys(new Set(JSON.parse(raw)));
    } catch {}
    try {
      const raw2 = localStorage.getItem(CUSTOM_SENT_LS_KEY);
      if (raw2) setCustomSent(new Set(JSON.parse(raw2)));
    } catch {}
  }, []);
  function persist(set: Set<string>, key: string) {
    try {
      localStorage.setItem(key, JSON.stringify(Array.from(set)));
    } catch {}
  }
  const keyFor = (a: Appt) => a._id;
  function markSent(a: Appt) {
    setSentKeys((prev) => {
      const next = new Set(prev);
      next.add(a._id); // <-- appointment id
      localStorage.setItem(SENT_LS_KEY, JSON.stringify([...next]));
      return next;
    });
  }
  function markCustomSent(apptIds: string[]) {
    setCustomSent((prev) => {
      const next = new Set(prev);
      for (const id of apptIds) next.add(id);
      persist(next, CUSTOM_SENT_LS_KEY);
      return next;
    });
  }
  function unmarkAllFor(apptId: string) {
    setSentKeys((prev) => {
      const next = new Set(prev);
      next.delete(apptId);
      localStorage.setItem(SENT_LS_KEY, JSON.stringify([...next]));
      return next;
    });
    setCustomSent((prev) => {
      const next = new Set(prev);
      next.delete(apptId);
      localStorage.setItem(CUSTOM_SENT_LS_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  // ---------- fetch appointments ----------
  type UnknownRecord = Record<string, unknown>;
  const isRecord = (v: unknown): v is UnknownRecord =>
    typeof v === "object" && v !== null;

  const extractArray = (payload: unknown): unknown[] | null => {
    if (Array.isArray(payload)) return payload;
    if (isRecord(payload)) {
      const maybe = (payload as any).items ?? (payload as any).data;
      if (Array.isArray(maybe)) return maybe;
    }
    return null;
  };

  const pickStr = (
    obj: UnknownRecord,
    ...keys: string[]
  ): string | undefined => {
    for (const k of keys) {
      const v = obj[k];
      if (typeof v === "string" && v.trim() !== "") return v;
    }
    return undefined;
  };

  const normalizeAppt = (v: unknown): Appt | null => {
    if (!isRecord(v)) return null;
    const _id = pickStr(v, "_id", "id");
    const parentEmail = pickStr(v, "parentEmail", "email", "parent_email");
    const slotISO = pickStr(v, "slotISO", "slot", "date");
    if (!_id || !parentEmail || !slotISO) return null;

    let studentName =
      pickStr(
        v,
        "studentName",
        "student_name",
        "studentFullName",
        "fullName"
      ) ?? undefined;
    if (!studentName) {
      const app = (v as any)?.application;
      const data =
        app && typeof app === "object" ? (app as any).data : undefined;
      const sn =
        data && typeof data === "object"
          ? (data as any).student_name
          : undefined;
      if (typeof sn === "string" && sn.trim()) studentName = sn.trim();
    }


    let studentGrade =
      pickStr(v as any, "studentGrade", "grade", "grade_applying_for", "gradeApplyingFor") ?? undefined;

    if (!studentGrade) {
      const app = (v as any)?.application;
      const data = app && typeof app === "object" ? (app as any).data : undefined;
      if (data && typeof data === "object") {
        studentGrade =
          pickStr(data as any,
            "grade_applying_for",
            "gradeApplyingFor",
            "applied_grade",
            "target_grade",
            "desired_grade",
            "entry_grade",
            "grade"
          ) ?? undefined;
      }
    }




    const applicationId = pickStr(v, "applicationId");
    const createdAt = pickStr(v, "createdAt");

    let waSentAt: string | null = null;
    const ws = (v as any)?.waSentAt;
    if (typeof ws === "string" && ws.trim()) waSentAt = ws;

    return { _id, parentEmail, slotISO, applicationId, createdAt, studentName, studentGrade, waSentAt };
  };

  useEffect(() => {
    if (!authenticated) return;

    let ignore = false;
    setLoading(true);
    setLoadError("");

    (async () => {
      try {
        const tryUrls = [
          `${API}/appointments`,
          `${API}/appointments/all`,
          `${API}/appointments/admin-list`,
        ];
        let payload: unknown = null;
        let ok = false;
        for (const url of tryUrls) {
          try {
            const r = await fetch(url, { cache: "no-store" });
            if (r.ok) {
              payload = await r.json();
              ok = true;
              break;
            }
          } catch {}
        }
        if (!ok)
          throw new Error("No appointment list endpoint responded with data.");
        const rawList = extractArray(payload);
        if (!rawList)
          throw new Error("No appointment list endpoint responded with data.");
        const normalized: Appt[] = rawList
          .map(normalizeAppt)
          .filter((a): a is Appt => a !== null)
          .sort(
            (a, b) =>
              new Date(a.slotISO).getTime() - new Date(b.slotISO).getTime()
          );
        if (!ignore) setItems(normalized);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load appointments.";
        if (!ignore) setLoadError(message);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [authenticated, API]);
  useEffect(() => {
    if (!authenticated) return;
    (async () => {
      try {
        const res = await fetch(`${API}/settings/amount`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          const amt = Number(data.amount || 0); // backend gives amount in cents
          setAmount(amt);
          const major = Math.floor(amt / 100);
          const minor = amt % 100;
          setAmountMajor(String(major));
          setAmountMinor(minor.toString().padStart(2, "0"));
        }
      } catch (err) {
        console.error("Failed to load amount setting", err);
      }
    })();
  }, [authenticated, API]);

  // ---------- helpers ----------
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    const fmtDateTimePretty = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }); // e.g., "Sun, Aug 31, 2025, 03:04 PM"


  const toYMD = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  const toHM = (d: Date) =>
    `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(
      2,
      "0"
    )}`;

  const now = new Date();

  const filtered = useMemo(() => {
    let list = items;
    if (filterMode === "upcoming")
      list = list.filter((a) => new Date(a.slotISO) >= now);
    else if (filterMode === "past")
      list = list.filter((a) => new Date(a.slotISO) < now);

    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.parentEmail.toLowerCase().includes(needle) ||
          (a.studentName ? a.studentName.toLowerCase().includes(needle) : false) ||
          (a.studentGrade ? a.studentGrade.toLowerCase().includes(needle) : false)   // ← NEW
      );

    }

    if (filterMode === "past") {
      return [...list].sort(
        (a, b) => new Date(b.slotISO).getTime() - new Date(a.slotISO).getTime()
      );
    }
    return list;
  }, [items, q, filterMode, now]);

  // export
  function autosizeCols(rows: Array<Record<string, unknown>>) {
    const keys = rows.length ? Object.keys(rows[0]) : [];
    return keys.map((k) => {
      const maxLen = rows.reduce((acc, r) => {
        const v = r[k];
        const s =
          v == null
            ? ""
            : typeof v === "string"
            ? v
            : typeof v === "number"
            ? String(v)
            : JSON.stringify(v);
        return Math.max(acc, s.length);
      }, k.length);
      return { wch: Math.min(Math.max(maxLen + 2, 10), 60) };
    });
  }
  async function handleExportExcel() {
    try {
      const xlsx = await import("xlsx");
      const { utils, writeFile } = xlsx.default ?? xlsx;
      const rows = filtered.map((a) => {
        const d = new Date(a.slotISO);
        return {
          ID: a._id,
          "Parent Email": a.parentEmail,
          "Student Name": a.studentName ?? "",
          "Student Grade": a.studentGrade ?? "",
          "Local Date": toYMD(d),
          "Local Time": toHM(d),
          Status: d < now ? "Past" : "Upcoming",
          "Application ID": a.applicationId ?? "",
          "Created At": a.createdAt ? fmtDateTimePretty(a.createdAt) : "",
        };
      });
      if (rows.length === 0) {
        alert("No rows to export.");
        return;
      }
      const ws = utils.json_to_sheet(rows);
      (ws as any)["!cols"] = autosizeCols(rows);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Assessments");
      const stamp = toYMD(new Date()).replaceAll("-", "");
      writeFile(wb, `assessment_appointments_${stamp}.xlsx`, {
        compression: true,
      });
    } catch (e) {
      console.error(e);
      alert(
        e instanceof Error ? `Export failed: ${e.message}` : "Export failed."
      );
    }
  }

  // confirm-send (existing)
  async function sendWa(a: Appt) {
    setSendErr((prev) => {
      const { [a._id]: _, ...rest } = prev;
      return rest;
    });
    setSendOk((prev) => {
      const { [a._id]: _, ...rest } = prev;
      return rest;
    });

    setSendingIds((prev) => new Set(prev).add(a._id));
    try {
      const body = {
        appointmentId: a._id,
        parentEmail: a.parentEmail,
        slotISO: a.slotISO,
        applicationId: a.applicationId,
      };
      const res = await fetch(`${API}/wa/assessment-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const ct = res.headers.get("content-type") || "";
      const raw = await res.text();
      let data: any = raw;
      try {
        if (ct.includes("application/json")) data = JSON.parse(raw);
      } catch {}

      if (!res.ok) {
        const msg =
          typeof data === "object" && data !== null && "message" in data
            ? String(data.message)
            : raw || `HTTP ${res.status}`;
        setSendErr((prev) => ({ ...prev, [a._id]: msg }));
        return;
      }
      // success
      markSent(a);
      if (data && Array.isArray(data.sent))
        setSendOk((prev) => ({ ...prev, [a._id]: data.sent as string[] }));
      else setSendOk((prev) => ({ ...prev, [a._id]: [] }));
    } catch (e) {
      setSendErr((prev) => ({
        ...prev,
        [a._id]: e instanceof Error ? e.message : "Network error.",
      }));
    } finally {
      setSendingIds((prev) => {
        const next = new Set(prev);
        next.delete(a._id);
        return next;
      });
    }
  }

  // delete
  async function handleDelete(a: Appt) {
    if (
      !confirm(
        `Delete this appointment?\n\nStudent: ${
          a.studentName || "Unknown"
        }\nEmail: ${a.parentEmail}\nDate: ${fmtDate(a.slotISO)} ${fmtTime(
          a.slotISO
        )}`
      )
    ) {
      return;
    }
    const challenge = prompt("Type DELETE to confirm permanent deletion:");
    if (!challenge || challenge.toUpperCase() !== "DELETE") return;

    setDeletingIds((prev) => new Set(prev).add(a._id));
    try {
      const res = await fetch(
        `${API}/appointments/${encodeURIComponent(a._id)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const text = await res.text();
        alert(text || `Delete failed (HTTP ${res.status})`);
        return;
      }
      setItems((prev) => prev.filter((x) => x._id !== a._id));
      unmarkAllFor(a._id);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(a._id);
        return next;
      });
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(a._id);
        return next;
      });
    }
  }

  // --- BULK SELECT HELPERS (NEW)
  function toggleSelected(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function selectAllFiltered() {
    setSelectedIds(new Set(filtered.map((a) => a._id)));
  }
  function clearSelection() {
    setSelectedIds(new Set());
  }

  // --- SEND CUSTOM (NEW)
  async function openCustomModal() {
    if (selectedIds.size === 0) return;
    setCustomError("");
    setCustomMsg("");
    setCustomOpen(true);
  }
  async function sendCustom() {
    if (!customMsg.trim()) {
      setCustomError("Please type a message.");
      return;
    }
    setCustomSending(true);
    setCustomError("");
    try {
      const ids = Array.from(selectedIds);
      const res = await fetch(`${API}/wa/custom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentIds: ids,
          message: customMsg.trim(),
        }),
      });
      const text = await res.text();
      if (!res.ok) {
        setCustomError(text || `Send failed (HTTP ${res.status})`);
        setCustomSending(false);
        return;
      }
      // Success -> mark every selected card as custom-sent
      markCustomSent(ids);
      setCustomSending(false);
      setCustomOpen(false);
    } catch (e) {
      setCustomError(e instanceof Error ? e.message : "Network error.");
      setCustomSending(false);
    }
  }
  async function handleToggleAppointments(value: boolean) {
    setSavingToggle(true);
    try {
      const res = await fetch(
        `http://localhost:3000/settings/show-appointments`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ showAppointments: value }),
        }
      );
      if (!res.ok) {
        alert("Failed to update setting");
        return;
      }
      setShowAppointments(value);
    } catch (err) {
      console.error(err);
      alert("Network error while updating setting");
    } finally {
      setSavingToggle(false);
    }
  }
  async function handleSaveAmount() {
    setSavingAmount(true);
    try {
      const major = parseInt(amountMajor, 10) || 0;
      const minor = parseInt(amountMinor, 10) || 0;
      const newAmount = major * 100 + minor;

      const res = await fetch(`${API}/settings/amount`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: newAmount }),
      });

      if (!res.ok) {
        alert("Failed to update amount");
        return;
      }
      const updated = await res.json();
      setAmount(updated.amount);
      alert("✅ Appointment fee updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Network error while updating amount");
    } finally {
      setSavingAmount(false);
    }
  }

  // ---------- gates ----------
  if (!readyToRender || loadingAuth) return <div id="preloader"></div>;
  if (!authenticated) return null;

  return (
    <>
      <AdminHeader />
      <main className="main" style={{ paddingTop: "130px" }}>
        <div className="container-xxl py-5">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
            <h1 className="mb-0" style={{ color: "#003a63", fontWeight: 800 }}>
              <i className="bi bi-calendar-check me-2"></i>
              Assessment Appointments
            </h1>
            <Link
              href="/lic-auth-v9v3tz/Admin"
              className="btn btn-outline-secondary"
            >
              ← Back to Dashboard
            </Link>
          </div>
          <div className="mb-4 d-flex flex-wrap align-items-center gap-4">
            {/* Toggle */}
            <div className="d-flex align-items-center gap-2">
              <label className="form-check-label fw-bold" htmlFor="apptSwitch">
                Show Appointments to Users
              </label>
              <div className="form-check form-switch">
                <input
                  id="apptSwitch"
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  checked={showAppointments}
                  disabled={savingToggle}
                  onChange={(e) => handleToggleAppointments(e.target.checked)}
                  style={{
                    backgroundColor: showAppointments ? "var(--accent-color)" : "",
                    borderColor: showAppointments ? "var(--accent-color)" : "",
                  }}
                />
              </div>
            </div>


            {/* Amount Editor */}
            <div className="d-flex flex-column gap-2">
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <label className="fw-bold mb-0">Appointment Fee:</label>
                <div className="input-group" style={{ maxWidth: "220px" }}>
                  <input
                    type="number"
                    className="form-control text-end"
                    value={amountMajor}
                    onChange={(e) => setAmountMajor(e.target.value)}
                    min="0"
                    step="1"
                    style={{ borderRadius: "8px 0 0 8px", fontWeight: 600 }}
                  />
                  <span className="input-group-text">EGP</span>
                </div>
                <button
                  type="button"
                  className="btn"
                  onClick={handleSaveAmount}
                  disabled={savingAmount}
                  style={{
                    backgroundColor: "var(--accent-color)",
                    borderColor: "var(--accent-color)",
                    color: "#fff",
                  }}
                >
                  {savingAmount ? "Saving…" : "Save"}
                </button>
              </div>

              {/* Helper message */}
              <small className="text-muted ms-1">
                💡 Example: To set <strong>4000 EGP</strong>, type{" "}
                <code>4000</code>.
              </small>
            </div>
          </div>

          {/* Controls */}
          <div className="row g-3 mb-3 align-items-center">
            <div className="col-12 col-xl-6">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Filter by email, grade or student name…"
                className="form-control form-control-lg"
              />
            </div>
            <div className="col-12 col-xl-6 d-flex align-items-center justify-content-xl-end gap-2 flex-wrap">
              <div className="filters d-flex gap-2">
                {(["upcoming", "past", "all"] as const).map((m) => {
                  const isActive = filterMode === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      className="filter-tab"
                      aria-pressed={isActive}
                      onClick={() => setFilterMode(m)}
                      style={{
                        backgroundColor: isActive ? "var(--accent-color)" : "#fff",
                        border: `1px solid ${isActive ? "var(--accent-color)" : "#e5e7eb"}`,
                        color: isActive ? "#fff" : "#000",
                        borderRadius: "6px",
                        padding: "6px 14px",
                        fontWeight: isActive ? 600 : 500,
                      }}
                    >
                      {m === "upcoming"
                        ? "Upcoming"
                        : m === "past"
                        ? "Past"
                        : "All"}
                    </button>
                  );
                })}
              </div>


              <button
                type="button"
                className="btn btn-success"
                onClick={handleExportExcel}
                disabled={loading || loadError !== "" || filtered.length === 0}
                title="Export the currently displayed assessments to an Excel file"
              >
                <i className="bi bi-download me-2"></i>
                Export Excel (.xlsx)
              </button>
            </div>
          </div>

          {/* Bulk action bar (NEW) */}
          {selectedIds.size > 0 && (
            <div className="alert alert-primary d-flex align-items-center justify-content-between">
              <div>
                <strong>{selectedIds.size}</strong> selected
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary"
                  onClick={selectAllFiltered}
                >
                  Select all in view
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={clearSelection}
                >
                  Clear
                </button>
                <button
                  className="btn btn-primary"
                  onClick={openCustomModal}
                  title="Send a custom WhatsApp message to selected parents"
                >
                  <i className="bi bi-chat-dots me-1" />
                  Send custom WhatsApp
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="alert alert-info">Loading appointments…</div>
          ) : loadError ? (
            <div className="alert alert-danger">
              {loadError}
              <div className="small mt-2">
                Ensure <code>GET /appointments</code> returns an array of{" "}
                <code>{`{ _id, parentEmail, slotISO }`}</code>.
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="alert alert-warning">No appointments found.</div>
          ) : (
            <div className="row gy-4 gx-4">
              {filtered.map((a) => {
                const d = new Date(a.slotISO);
                const past = d < now;
                const sending = sendingIds.has(a._id);
                const deleting = deletingIds.has(a._id);
                const okPhones = sendOk[a._id];
                const errMsg = sendErr[a._id];
                // 5) compute alreadySent from server + local optimistic flag
                const alreadySent = Boolean(a.waSentAt) || sentKeys.has(a._id);

                const isSelected = selectedIds.has(a._id);
                const alreadyCustom = customSent.has(a._id);

                const initials =
                  (a.studentName ?? "")
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((s) => s.charAt(0).toUpperCase())
                    .join("") || "U";

                return (
                  <div key={a._id} className="col-12 col-lg-6 col-xxl-4 d-flex">
                    <div
                      className={`card appt-card shadow-sm border-0 h-100 mx-auto ${
                        past ? "is-past" : "is-upcoming"
                      } ${isSelected ? "selected" : ""}`}
                      style={{ maxWidth: 560, width: "100%" }}
                    >
                      {/* Select checkbox */}
                      <div className="select-box">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={isSelected}
                          onChange={() => toggleSelected(a._id)}
                          aria-label="Select appointment"
                        />
                      </div>

                      {/* Header */}
                      <div className="appt-head">
                        <div className="identity">
                          <div className="avatar">{initials}</div>
                          <div className="identity-text">
                            <div
                              className="student-name"
                              title={a.studentName || ""}
                            >
                              {a.studentName || "Student name unavailable"}
                            </div>
                            <div className="email-wrap">
                              <i className="bi bi-envelope-fill me-2"></i>
                              {a.parentEmail}
                            </div>
                            {a.studentGrade && (
                              <div className="small text-muted">
                                <i className="bi bi-mortarboard-fill me-2" />
                                Grade: {a.studentGrade}
                              </div>
                            )}

                          </div>
                        </div>
                        <div className="date-stack text-end">
                          <div className="pill">
                            <i className="bi bi-calendar-event me-1"></i>
                            {fmtDate(a.slotISO)}
                          </div>
                          <div className="pill">
                            <i className="bi bi-clock me-1"></i>
                            {fmtTime(a.slotISO)}
                          </div>
                        </div>
                      </div>

                      <div className="card-body p-4">
                        {/* Status badges */}
                        {(alreadyCustom || alreadySent) && (
                          <div className="mb-3 d-flex flex-wrap gap-2">
                            {alreadySent && (
                              <span className="badge bg-success d-inline-flex align-items-center gap-1">
                                <i className="bi bi-check-circle-fill" />
                                Assessment message sent
                              </span>
                            )}
                            {alreadyCustom && (
                              <span className="badge bg-info d-inline-flex align-items-center gap-1">
                                <i className="bi bi-chat-left-quote-fill" />
                                Custom message sent
                              </span>
                            )}
                          </div>
                        )}

                        {/* Local-session success (before refresh) */}
                        {!!okPhones?.length && !alreadySent && (
                          <div className="mb-3">
                            <span className="badge bg-success-subtle text-success-emphasis border border-success-subtle">
                              Sent to {okPhones.length} recipient
                              {okPhones.length === 1 ? "" : "s"}
                            </span>
                            <div className="small text-muted mt-1">
                              {okPhones.join(", ")}
                            </div>
                          </div>
                        )}

                        {/* Error */}
                        {errMsg && (
                          <div className="alert alert-danger py-2 px-3 mb-3">
                            <strong>Send failed:</strong> {errMsg}
                          </div>
                        )}

                        <div className="d-flex gap-2">
                          {/* Assessment send button (once per appointment) */}
                          <button
                            type="button"
                            className={`btn ${
                              alreadySent
                                ? "btn-outline-secondary"
                                : "btn-success"
                            } btn-lg whatsapp-btn flex-fill d-flex align-items-center justify-content-center gap-2`}
                            onClick={() =>
                              !alreadySent &&
                              sendWa({ ...(a as any), appointmentId: a._id })
                            }
                            title={
                              alreadySent
                                ? "Message already sent for this appointment"
                                : "Send WhatsApp confirmation"
                            }
                            disabled={sending || alreadySent}
                            aria-disabled={sending || alreadySent}
                          >
                            {sending ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                />
                                Sending…
                              </>
                            ) : alreadySent ? (
                              <>
                                <i className="bi bi-check-circle-fill fs-5"></i>
                                Sent
                              </>
                            ) : (
                              <>
                                <i className="bi bi-whatsapp fs-5"></i>
                                Send WhatsApp
                              </>
                            )}
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-lg flex-fill d-flex align-items-center justify-content-center gap-2"
                            onClick={() => handleDelete(a)}
                            disabled={deleting}
                            title="Delete this appointment"
                          >
                            {deleting ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                />
                                Deleting…
                              </>
                            ) : (
                              <>
                                <i className="bi bi-trash3"></i>
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Custom message modal (very small, bootstrap-like) */}
          {customOpen && (
            <div className="modal-backdrop">
              <div className="modal-card">
                <h5 className="mb-3">
                  <i className="bi bi-chat-dots me-2" />
                  Send custom WhatsApp message
                </h5>
                <div className="mb-2 text-muted small">
                  To <strong>{selectedIds.size}</strong> selected appointment
                  {selectedIds.size === 1 ? "" : "s"}.
                </div>
                <textarea
                  className="form-control mb-2"
                  rows={6}
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  placeholder="Type your message…"
                />
                {customError && (
                  <div className="alert alert-danger py-2 px-3">
                    {customError}
                  </div>
                )}
                <div className="d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setCustomOpen(false)}
                    disabled={customSending}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={sendCustom}
                    disabled={customSending || !customMsg.trim()}
                  >
                    {customSending ? "Sending…" : "Send"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        .container-xxl {
          max-width: 1320px;
        }

        .filters .filter-tab {
          border: 1px solid #cfe2ff;
          background: #fff;
          color: #0d6efd;
          font-weight: 700;
          border-radius: 12px;
          padding: 10px 16px;
          line-height: 1;
          transition: all 0.15s ease;
        }
        .filters .filter-tab:hover {
          background: #e7f1ff;
        }
        .filters .filter-tab.active {
          background: #0d6efd;
          color: #fff;
          border-color: #0d6efd;
          box-shadow: 0 2px 10px rgba(13, 110, 253, 0.25);
        }

        .appt-card {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          transition: transform 0.12s, box-shadow 0.12s, outline 0.12s;
        }
        .appt-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.08);
        }
        .appt-card.selected {
          outline: 2px solid #0d6efd;
        }

        .select-box {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 2;
        }
        .appt-head {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 16px;
          padding: 18px 22px;
          background: #f7fbff;
          border-bottom: 1px solid #e8eef6;
        }
        .appt-card.is-upcoming .appt-head {
          background: #f5fff9;
        }
        .appt-card.is-past .appt-head {
          background: #fafbfc;
        }
        .identity {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }
        .identity-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .avatar {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: #003a63;
          color: #fff;
          display: grid;
          place-items: center;
          font-weight: 800;
          letter-spacing: 0.4px;
          flex: 0 0 46px;
        }
        .student-name {
          display: block;
          font-weight: 800;
          font-size: 1.06rem;
          color: #0a3b5c;
          line-height: 1.2;
          white-space: normal;
          word-break: break-word;
          margin: 0 0 2px;
        }
        .email-wrap {
          font-size: 0.96rem;
          color: #4f6072;
          line-height: 1.25;
          word-break: break-word;
          white-space: normal;
        }
        .date-stack {
          display: grid;
          gap: 8px;
        }
        .pill {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 0.92rem;
          border: 1px solid #e6eef5;
          background: #fff;
          color: #2b3948;
          white-space: nowrap;
        }
        .pill i {
          opacity: 0.7;
        }
        .whatsapp-btn {
          border-radius: 12px;
          padding-block: 12px;
        }

        /* modal */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          display: grid;
          place-items: center;
          z-index: 1050;
        }
        .modal-card {
          width: min(720px, calc(100% - 32px));
          background: #fff;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }
      `}</style>

      <AdminFooter />
    </>
  );
}
