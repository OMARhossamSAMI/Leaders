"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "../../../components/AdminHeader";
import AdminFooter from "../../../components/AdminFooter";

type Appt = {
  _id: string;
  parentEmail: string;
  slotISO: string; // ISO datetime
  applicationId?: string;
  createdAt?: string;
};

const API = process.env.NEXT_PUBLIC_API_URL as string;
const SURVEY_URL =
  process.env.NEXT_PUBLIC_SURVEY_URL || "https://example.com/survey";

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

  // per-appointment send status
  const [sendingIds, setSendingIds] = useState<Set<string>>(new Set());
  const [sendOk, setSendOk] = useState<Record<string, string[]>>({});
  const [sendErr, setSendErr] = useState<Record<string, string>>({});

  // ---------- auth gate ----------
  useEffect(() => {
    const shouldRefresh = sessionStorage.getItem("force_admin_refresh");
    if (shouldRefresh === "true") {
      sessionStorage.removeItem("force_admin_refresh");
      location.reload();
      return;
    }
    const token = sessionStorage.getItem("admin_token");
    if (!token) {
      router.push("/lic-auth-v9v3tz");
    } else {
      setAuthenticated(true);
    }
    setLoadingAuth(false);
  }, [router]);

  // preloader behavior
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

  // ---------- fetch appointments ----------
  type UnknownRecord = Record<string, unknown>;
  const isRecord = (v: unknown): v is UnknownRecord =>
    typeof v === "object" && v !== null;

  const extractArray = (payload: unknown): unknown[] | null => {
    if (Array.isArray(payload)) return payload;
    if (isRecord(payload)) {
      const maybe = (payload.items ?? payload.data) as unknown;
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
    const applicationId = pickStr(v, "applicationId");
    const createdAt = pickStr(v, "createdAt");
    return { _id, parentEmail, slotISO, applicationId, createdAt };
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
          } catch {
            // try next
          }
        }

        if (!ok) throw new Error("No appointment list endpoint responded with data.");

        const rawList = extractArray(payload);
        if (!rawList)
          throw new Error("No appointment list endpoint responded with data.");

        const normalized: Appt[] = rawList
          .map(normalizeAppt)
          .filter((a): a is Appt => a !== null)
          .sort(
            (a, b) => new Date(a.slotISO).getTime() - new Date(b.slotISO).getTime()
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
  }, [authenticated]);

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

  const now = new Date();

  const filtered = useMemo(() => {
    let list = items;

    if (filterMode === "upcoming") {
      list = list.filter((a) => new Date(a.slotISO) >= now);
    } else if (filterMode === "past") {
      list = list.filter((a) => new Date(a.slotISO) < now);
    }

    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter((a) => a.parentEmail.toLowerCase().includes(needle));
    }

    // Sort: past -> newest first; others -> chronological
    if (filterMode === "past") {
      return [...list].sort(
        (a, b) => new Date(b.slotISO).getTime() - new Date(a.slotISO).getTime()
      );
    }
    return list;
  }, [items, q, filterMode, now]);

  // ---- WhatsApp sending via backend ----
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
        parentEmail: a.parentEmail,
        slotISO: a.slotISO,
        applicationId: a.applicationId,
        surveyUrl: SURVEY_URL,
      };

      const res = await fetch(`${API}/wa/assessment-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const ct = res.headers.get("content-type") || "";
      const raw = await res.text();

      let data: unknown = raw;
      try {
        if (ct.includes("application/json")) data = JSON.parse(raw);
      } catch {
        // ignore parse errors
      }

      if (!res.ok) {
        const msg =
          typeof data === "object" && data !== null && "message" in data
            ? String((data as Record<string, unknown>).message)
            : raw || `HTTP ${res.status}`;
        setSendErr((prev) => ({ ...prev, [a._id]: msg }));
        return;
      }

      if (
        typeof data === "object" &&
        data !== null &&
        "ok" in data &&
        "sent" in data &&
        Array.isArray((data as Record<string, unknown>).sent)
      ) {
        setSendOk((prev) => ({
          ...prev,
          [a._id]: (data as Record<string, unknown>).sent as string[],
        }));
      } else {
        setSendOk((prev) => ({ ...prev, [a._id]: [] }));
      }
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

  // ---------- gates ----------
  if (!readyToRender || loadingAuth) {
    return <div id="preloader"></div>;
  }
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
            <Link href="/lic-auth-v9v3tz/Admin" className="btn btn-outline-secondary">
              ← Back to Dashboard
            </Link>
          </div>

          {/* Controls */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-lg-6">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Filter by parent email…"
                className="form-control form-control-lg"
              />
            </div>

            <div className="col-12 col-lg-6 d-flex align-items-center justify-content-lg-end">
              <div className="btn-group" role="group" aria-label="Filter appointments">
                <button
                  type="button"
                  className={`btn btn-outline-primary ${filterMode === "upcoming" ? "active" : ""}`}
                  onClick={() => setFilterMode("upcoming")}
                  title="Show only upcoming assessments"
                >
                  Upcoming
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-primary ${filterMode === "past" ? "active" : ""}`}
                  onClick={() => setFilterMode("past")}
                  title="Show only past assessments"
                >
                  Past
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-primary ${filterMode === "all" ? "active" : ""}`}
                  onClick={() => setFilterMode("all")}
                  title="Show all assessments"
                >
                  All
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="alert alert-info">Loading appointments…</div>
          ) : loadError ? (
            <div className="alert alert-danger">
              {loadError}
              <div className="small mt-2">
                Make sure your backend exposes <code>GET /appointments</code> returning an
                array of <code>{`{ _id, parentEmail, slotISO }`}</code>.
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="alert alert-warning">No appointments found.</div>
          ) : (
            <div className="row g-4">
              {filtered.map((a) => {
                const d = new Date(a.slotISO);
                const past = d < now;
                const sending = sendingIds.has(a._id);
                const okPhones = sendOk[a._id];
                const errMsg = sendErr[a._id];

                return (
                  <div key={a._id} className="col-12 col-xl-6">
                    <div className="card appt-card shadow-sm border-0 h-100">
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <span className="badge rounded-pill bg-info text-dark fs-6 px-3 py-2">
                            {fmtDate(a.slotISO)}
                          </span>
                          <span
                            className={`badge rounded-pill ${
                              past ? "bg-secondary" : "bg-success"
                            } fs-6 px-3 py-2`}
                          >
                            {fmtTime(a.slotISO)}
                          </span>
                        </div>

                        <div className="mb-2 fw-bold email-wrap">{a.parentEmail}</div>

                        {a.applicationId && (
                          <div className="text-muted mb-3 small">
                            Application: <code>{a.applicationId}</code>
                          </div>
                        )}

                        {/* Status line */}
                        {okPhones && (
                          <div className="mb-3">
                            <span className="badge bg-success">
                              Sent to {okPhones.length || 0} recipient
                              {okPhones.length === 1 ? "" : "s"}
                            </span>
                            {okPhones.length > 0 && (
                              <div className="small text-muted mt-1">
                                {okPhones.join(", ")}
                              </div>
                            )}
                          </div>
                        )}
                        {errMsg && (
                          <div className="alert alert-danger py-2 px-3 mb-3">
                            <strong>Send failed:</strong> {errMsg}
                          </div>
                        )}

                        <div className="d-flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="btn btn-success btn-lg d-flex align-items-center gap-2"
                            onClick={() => sendWa(a)}
                            title="Send WhatsApp to father & mother (based on the application)"
                            disabled={sending}
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
                            ) : (
                              <>
                                <i className="bi bi-whatsapp fs-5"></i>
                                Send WhatsApp message
                              </>
                            )}
                          </button>
                        </div>

                        <div className="small text-muted mt-3">
                          Survey link used:{" "}
                          <a href={SURVEY_URL} target="_blank" rel="noreferrer">
                            {SURVEY_URL}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        .container-xxl {
          max-width: 1320px;
        }
        .appt-card .email-wrap {
          font-size: 1.15rem;
          word-break: break-word;
          line-height: 1.3;
        }
        .btn-group .btn.active {
          color: #fff;
          background-color: #0d6efd;
          border-color: #0d6efd;
        }
      `}</style>

      <AdminFooter />
    </>
  );
}
