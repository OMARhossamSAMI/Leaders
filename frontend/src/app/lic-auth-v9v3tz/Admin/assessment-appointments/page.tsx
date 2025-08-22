"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "../../../components/AdminHeader";
import AdminFooter from "../../../components/AdminFooter";

type Appt = {
    _id: string;
    parentEmail: string;
    slotISO: string;
    applicationId?: string;
    createdAt?: string;
    parentPhone?: string; // ⬅️ optional
};


const API = process.env.NEXT_PUBLIC_API_URL;

export default function AssessmentAppointmentsPage() {
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [readyToRender, setReadyToRender] = useState(false);

    const [items, setItems] = useState<Appt[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const [q, setQ] = useState("");                 // search by email
    const [showOnlyUpcoming, setShowOnlyUpcoming] = useState(true);

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

    const pickStr = (obj: UnknownRecord, ...keys: string[]): string | undefined => {
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
        const parentPhone = pickStr(v, "parentPhone", "phone", "parent_phone");

        return { _id, parentEmail, slotISO, applicationId, createdAt, parentPhone };
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
                            // parse JSON as unknown (no `any`)
                            payload = await r.json();
                            ok = true;
                            break;
                        }
                    } catch {
                        // try next
                    }
                }

                if (!ok) {
                    throw new Error("No appointment list endpoint responded with data.");
                }

                const rawList = extractArray(payload);
                if (!rawList) {
                    throw new Error("No appointment list endpoint responded with data.");
                }

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

        if (showOnlyUpcoming) {
            list = list.filter((a) => new Date(a.slotISO) >= now);
        }
        if (q.trim()) {
            const needle = q.trim().toLowerCase();
            list = list.filter((a) => a.parentEmail.toLowerCase().includes(needle));
        }
        return list;
    }, [items, q, showOnlyUpcoming, now]);

    const toWaDigits = (s: string) => (s || "").replace(/[^\d]/g, "");
    const buildWaText = (a: Appt) =>
        `Hello! This is Leaders International College Admissions.%0A%0A` +
        `Your child's assessment is scheduled for *${fmtDate(a.slotISO)}* at *${fmtTime(a.slotISO)}*.%0A` +
        `If you need to reschedule, please reply to this message.%0A%0A` +
        `— Admissions Team`;

    const sendWhatsApp = (a: Appt) => {
        let phone = a.parentPhone?.trim() || "";

        // If we don't have a number from the API, ask once.
        if (!phone) {
            const input = prompt(
                "Enter WhatsApp number (international format, e.g., +201234567890). Leave empty to open WhatsApp without a number:"
            ) || "";
            phone = input.trim();
        }

        const digits = toWaDigits(phone);
        const url =
            digits
                ? `https://wa.me/${digits}?text=${buildWaText(a)}`
                : `https://wa.me/?text=${buildWaText(a)}`;

        window.open(url, "_blank", "noopener,noreferrer");
    };

    // ---------- gates ----------
    if (!readyToRender || loadingAuth) {
        return <div id="preloader"></div>;
    }
    if (!authenticated) return null;

    return (
        <>
            <AdminHeader />
            <main className="main" style={{ paddingTop: "130px" }}>
                <div className="container-xl py-5">
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
                        <div className="col-12 col-md-7">
                            <input
                                type="search"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Filter by parent email…"
                                className="form-control form-control-lg"
                            />
                        </div>
                        <div className="col-12 col-md-5 d-flex align-items-center justify-content-md-end">
                            <div className="form-check form-switch fs-5">
                                <input
                                    id="onlyUpcoming"
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={showOnlyUpcoming}
                                    onChange={(e) => setShowOnlyUpcoming(e.target.checked)}
                                />
                                <label htmlFor="onlyUpcoming" className="form-check-label ms-2">
                                    Show only upcoming
                                </label>
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
                                Make sure your backend exposes <code>GET /appointments</code> returning
                                an array of <code>{`{ _id, parentEmail, slotISO }`}</code>.
                            </div>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="alert alert-warning">No appointments found.</div>
                    ) : (
                        <div className="row g-4">
                            {filtered.map((a) => {
                                const d = new Date(a.slotISO);
                                const past = d < now;

                                return (
                                    <div key={a._id} className="col-12 col-lg-6">
                                        <div className="card appt-card shadow-sm border-0 h-100">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center justify-content-between mb-3">
                                                    <span className="badge rounded-pill bg-info text-dark fs-6 px-3 py-2">
                                                        {fmtDate(a.slotISO)}
                                                    </span>
                                                    <span
                                                        className={`badge rounded-pill ${past ? "bg-secondary" : "bg-success"
                                                            } fs-6 px-3 py-2`}
                                                    >
                                                        {fmtTime(a.slotISO)}
                                                    </span>
                                                </div>

                                                <div className="mb-2 fw-bold email-wrap">
                                                    {a.parentEmail}
                                                </div>

                                                {a.applicationId && (
                                                    <div className="text-muted mb-4 small">
                                                        Application: <code>{a.applicationId}</code>
                                                    </div>
                                                )}

                                                <div className="d-flex flex-wrap gap-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-success btn-lg d-flex align-items-center gap-2"
                                                        onClick={() => sendWhatsApp(a)}
                                                        title="Open WhatsApp with a prefilled message"
                                                    >
                                                        <i className="bi bi-whatsapp fs-5"></i>
                                                        Send WhatsApp message
                                                    </button>
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
        .appt-card .card-body {
          padding: 1.75rem 1.75rem;
        }
        .appt-card .email-wrap {
          font-size: 1.15rem;
          word-break: break-word;      /* long emails wrap nicely */
          line-height: 1.3;
        }
        .container-xl {
          max-width: 1240px;           /* roomier layout */
        }
      `}</style>

            <AdminFooter />
        </>
    );
}
