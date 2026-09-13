"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";
// ✅ Reuse the same CSS file from the Student Applications page
//    If your folder structure is different, just adjust the relative path.
import "../school_app/page.css";

import AdminHeader from "../../../components/AdminHeader";
import AdminFooter from "../../../components/AdminFooter";
import { useRouter } from "next/navigation";
import { getPaginationRange } from "@/utils/pagination";

type FieldValue = string | number | boolean | string[] | File | null;

interface AcceptedStudent {
  _id: string;
  createdAt: string;
  updatedAt: string;
  data: Record<string, FieldValue>;
  files?: { originalname: string; path: string }[];
  assessmentMessageSent?: boolean;
}
type WhatsAppAPIResponse = {
  success?: boolean;
  messageId?: string;
  error?: { message: string };
};
interface FormField {
  field_name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

export default function AcceptedStudentsPage() {
  // ===== State =====
  const [students, setStudents] = useState<AcceptedStudent[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedData, setExpandedData] = useState<
    Record<string, AcceptedStudent>
  >({});
  const [formFields, setFormFields] = useState<FormField[]>([]);

  // Keep same tabbed layout for visual parity

  const [activeTab, setActiveTab] = useState<"accepted" | "form">("accepted");

  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [selectedStudent, setSelectedStudent] =
    useState<AcceptedStudent | null>(null);

  // Pagination (reuse same pattern)
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const totalPages = Math.ceil(students.length / perPage);
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentStudents = students.slice(indexOfFirst, indexOfLast);
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const generateTimeSlots = () => {
    const times = [];
    for (let hour = 8; hour <= 17; hour++) {
      for (const minute of [0, 15, 30, 45]) {
        if (hour === 17 && minute > 0) break; // stop after 5:00 PM
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        times.push(
          `${displayHour}:${minute.toString().padStart(2, "0")} ${ampm}`
        );
      }
    }
    return times;
  };
  // ===== Helpers =====
  const renderFieldValue = (value: unknown): React.ReactNode => {
    if (value === null || value === undefined) return <em>Not provided</em>;
    if (typeof value === "string" || typeof value === "number") return value;
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) return value.join(", ");
    if (value instanceof File) return value.name;
    if (typeof value === "object") return JSON.stringify(value);
    return <em>Unsupported</em>;
  };

  const countPerDay = (rows: AcceptedStudent[]): Record<string, number> => {
    const counts: Record<string, number> = {};
    rows.forEach((s) => {
      const date = new Date(s.createdAt).toLocaleDateString();
      counts[date] = (counts[date] || 0) + 1;
    });
    return counts;
  };

  const acceptedCounts = countPerDay(students);

  // ===== Auth gate =====
  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) {
      router.push("/lic-auth-v9v3tz");
    } else {
      setAuthenticated(true);
    }
  }, [router]);

  // ===== Initial data fetch (GET only) =====
  useEffect(() => {
    setLoadingStudents(true);

    // We still load /form-fields to render field labels in the same style
    fetch(`http://localhost:3000/form-fields`)
      .then((res) => res.json())
      .then((data: FormField[]) => setFormFields(data))
      .catch((err: unknown) =>
        console.error("Failed to fetch form fields", err)
      );

    // Load accepted students list
    fetch(`http://localhost:3000/accepted-student`)
      .then((res) => res.json())
      .then((rows: AcceptedStudent[]) => {
        const normalized = rows.map((s) => ({ ...s, files: s.files ?? [] }));
        setStudents(normalized);
      })
      .catch((err: unknown) =>
        console.error("Failed to fetch accepted students", err)
      )
      .finally(() => setLoadingStudents(false));
  }, []);

  // Keep smooth scroll on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  if (!authenticated) return null;

  // ===== Expand (no extra GET needed; we already have full object) =====
  const handleExpand = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    if (!expandedData[id]) {
      const found = students.find((s) => s._id === id);
      if (found) {
        setExpandedData((prev) => ({ ...prev, [id]: found }));
      }
    }
    setExpandedId(id);
  };

  // ===== Delete an accepted student =====
  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to remove this student from the accepted list?"
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/accepted-student/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete accepted student");
      }

      // Remove from state without re-fetch
      setStudents((prev) => prev.filter((s) => s._id !== id));
      alert("Student removed from accepted list.");
    } catch (err) {
      console.error(err);
      alert("Error deleting student. Please try again.");
    }
  };

  // ===== Form structure editor (optional — same as applications page) =====

  // ===== CSV export (same layout; new filename) =====
  const exportToExcel = () => {
    const csvRows: string[] = [];
    const headers = [
      ...formFields.map((f) => f.label),
      "Accepted At",
      "Last Updated",
      "Uploaded Files",
    ];
    csvRows.push(headers.join(","));

    students.forEach((s) => {
      const row: string[] = [];

      formFields.forEach((field) => {
        const val = s?.data?.[field.field_name];

        if (
          field.type === "date" &&
          typeof val === "string" &&
          val.trim() !== ""
        ) {
          try {
            const formatted = new Date(val).toLocaleDateString("en-GB");
            row.push(`"${formatted}"`);
          } catch {
            row.push(`"${val}"`);
          }
        } else if (Array.isArray(val)) {
          row.push(`"${val.join(",").replace(/"/g, '""')}"`);
        } else if (typeof val === "object" && val !== null) {
          row.push(`"${JSON.stringify(val).replace(/"/g, '""')}"`);
        } else {
          row.push(`"${String(val ?? "Not provided").replace(/"/g, '""')}"`);
        }
      });

      row.push(`"${new Date(s.createdAt).toISOString()}"`);
      row.push(`"${new Date(s.updatedAt).toISOString()}"`);

      if (Array.isArray(s.files) && s.files.length > 0) {
        const fileLinks = s.files
          .map((file) =>
            file?.path ? `http://localhost:3000/${file.path}` : "Invalid file"
          )
          .join(", ");
        row.push(`"${fileLinks.replace(/"/g, '""')}"`);
      } else {
        row.push(`"No files uploaded"`);
      }

      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "accepted_students.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  function normalizePhoneNumber(input: string): string {
    // Remove all non-digit characters
    let digits = input.replace(/\D/g, "");

    // If starts with 0, replace with country code (Egypt example: 20)
    if (digits.startsWith("0")) {
      digits = "20" + digits.slice(1);
    }

    // If already has +20 or 20, just ensure no plus sign
    if (digits.startsWith("20") && digits.length > 10) {
      return digits;
    }

    return digits;
  }

  const handleSendMessage = async (
    student: AcceptedStudent,
    date: string,
    time: string,
    onSuccess: () => void
  ): Promise<WhatsAppAPIResponse | undefined> => {
    const fatherName = student.data?.father_name || "Parent";
    const studentName = student.data?.student_name || "Student";
    const rawPhoneNumber = student.data?.father_phone || "";

    const phoneNumber = normalizePhoneNumber(String(rawPhoneNumber));

    if (!date || !time) {
      alert("Please select both date and time.");
      return;
    }

    if (!phoneNumber) {
      alert("No valid phone number found for this student.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/accepted-student/${student._id}/send-assessment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fatherName,
            studentName,
            date,
            time,
            phoneNumber,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to send");

      const data = await res.json();
      console.log("WhatsApp API response:", data);

      onSuccess(); // Close modal + update UI to "Message Sent"
      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.error(err);
      alert("Failed to send message.");
      return { error: { message } };
    }
  };

  return (
    <>
      <AdminHeader />

      <div
        style={{
          backgroundColor: "#f5f9f9",
          minHeight: "100vh",
          padding: "2rem",
          marginTop: "100px",
        }}
      >
        <div className="container section-title" style={{ marginTop: "60px" }}>
          <h2>Accepted Students</h2>
          <p>View and manage accepted students.</p>
        </div>

        {/* Tabs (outside shadow box) */}
        <div className="tabs-container">
          <button
            className={`tab-btn ${
              activeTab === "accepted" ? "active-tab" : ""
            }`}
            onClick={() => setActiveTab("accepted")}
          >
            Accepted Students
          </button>
        </div>

        {/* Shadowed content box */}
        <div
          style={{
            background: "#ffffff",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
            maxWidth: "1300px",
            margin: "0 auto",
          }}
        >
          {/* === Accepted Tab === */}
          {activeTab === "accepted" && (
            <>
              {loadingStudents ? (
                <>
                  <button
                    onClick={exportToExcel}
                    className="btn-primary mb-4"
                    style={{ display: "block", marginLeft: "auto" }}
                  >
                    📥 Export All as CSV
                  </button>

                  <div className="loader-container">
                    <div className="spinner" />
                    <p className="loading-text">Loading accepted students...</p>
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
                      border-top: 6px solid #3999ddff;
                      border-radius: 50%;
                      animation: spin 0.9s linear infinite;
                    }
                    .loading-text {
                      margin-top: 1rem;
                      font-size: 1.1rem;
                      font-weight: 500;
                      color: #2a7db8ff;
                    }
                    @keyframes spin {
                      to {
                        transform: rotate(360deg);
                      }
                    }
                  `}</style>
                </>
              ) : (
                <>
                  {students.length === 0 ? (
                    <p className="text-center text-muted mt-4">
                      No accepted students yet.
                    </p>
                  ) : (
                    <>
                      <button
                        onClick={exportToExcel}
                        className="btn-primary mb-4"
                        style={{ display: "block", marginLeft: "auto" }}
                      >
                        📥 Export All as CSV
                      </button>

                      <div className="application-stats mt-4">
                        <h4>📊 Accepted Students Per Day</h4>
                        <ul>
                          {Object.entries(acceptedCounts).map(
                            ([date, count]) => (
                              <li key={date}>
                                <strong>{date}:</strong> {count} student
                                {count > 1 ? "s" : ""}
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "1.5rem",
                        }}
                      >
                        {currentStudents.map((s) => {
                          const displayName =
                            typeof s?.data?.student_name === "string" &&
                            s.data.student_name.trim() !== ""
                              ? s.data.student_name.trim()
                              : Object.entries(s?.data || {}).find(
                                  ([key, val]) =>
                                    key.toLowerCase().includes("name") &&
                                    typeof val === "string" &&
                                    (val as string).trim() !== ""
                                )?.[1] || "Unnamed Student";

                          return (
                            <div
                              key={s._id}
                              style={{
                                background: "#fff",
                                borderRadius: "10px",
                                padding: "1.5rem",
                                width: "100%",
                                maxWidth: "600px",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              {/* Header */}
                              <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-blue-700">
                                  {renderFieldValue(displayName)}
                                </h3>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleExpand(s._id)}
                                    className="icon-button"
                                    aria-label={
                                      expandedId === s._id
                                        ? "Collapse"
                                        : "Expand"
                                    }
                                    title={
                                      expandedId === s._id
                                        ? "Collapse"
                                        : "Expand"
                                    }
                                    type="button"
                                  >
                                    {expandedId === s._id ? (
                                      <EyeOff />
                                    ) : (
                                      <Eye />
                                    )}
                                  </button>

                                  {/* Keep delete button for design parity, no API call yet */}
                                  <button
                                    onClick={() => handleDelete(s._id)}
                                    className="icon-button text-red-600"
                                    aria-label="Remove accepted student (coming soon)"
                                    title="Remove accepted student (coming soon)"
                                    type="button"
                                  >
                                    <Trash2 />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (!s.assessmentMessageSent) {
                                        setSelectedStudent(s);
                                        setShowModal(true);
                                      }
                                    }}
                                    className={`btn btn-sm ${
                                      s.assessmentMessageSent
                                        ? "btn-secondary"
                                        : "btn-success"
                                    }`}
                                    disabled={s.assessmentMessageSent}
                                  >
                                    {s.assessmentMessageSent
                                      ? "✅ Assesment Message Already Sent"
                                      : "📩 Send Assessment Message"}
                                  </button>
                                </div>
                              </div>

                              {/* Basic Info */}
                              <p className="text-sm text-gray-600 mb-2">
                                <strong>Accepted At:</strong>{" "}
                                {s.createdAt
                                  ? new Date(
                                      String(s.createdAt)
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </p>

                              {/* Files */}
                              {Array.isArray(s.files) && s.files.length > 0 && (
                                <div className="text-sm text-gray-600 mb-4">
                                  <strong>Files:</strong>
                                  <ul className="list-disc ml-5">
                                    {s.files.map((file, idx) =>
                                      file?.path ? (
                                        <li key={idx}>
                                          <a
                                            href={`http://localhost:3000/${file.path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline"
                                          >
                                            {file.originalname ||
                                              "Download file"}
                                          </a>
                                        </li>
                                      ) : (
                                        <li key={idx} className="text-red-500">
                                          Invalid file reference
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}

                              {/* Expanded View */}
                              {expandedId === s._id && (
                                <>
                                  {!expandedData[s._id] ? (
                                    <p>Loading full data...</p>
                                  ) : (
                                    <div className="mt-2">
                                      {formFields.length > 0
                                        ? formFields.map((field) => (
                                            <p key={field.field_name}>
                                              <strong>{field.label}:</strong>{" "}
                                              {renderFieldValue(
                                                expandedData[s._id]?.data?.[
                                                  field.field_name
                                                ]
                                              )}
                                            </p>
                                          ))
                                        : // Fallback if no form fields present
                                          Object.entries(s.data || {}).map(
                                            ([key, value]) => (
                                              <p key={key}>
                                                <strong>{key}:</strong>{" "}
                                                {renderFieldValue(value)}
                                              </p>
                                            )
                                          )}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="pagination-wrapper">
                          <button
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            className="btn btn-sm btn-outline-primary"
                            disabled={currentPage === 1}
                          >
                            ⬅ Prev
                          </button>

                          {getPaginationRange(currentPage, totalPages).map((item, index) =>
                            item === "ellipsis" ? (
                              <span
                                key={`ellipsis-${index}`}
                                className="btn btn-sm"
                                style={{ cursor: "default", pointerEvents: "none" }}
                              >
                                …
                              </span>
                            ) : (
                              <button
                                key={item}
                                onClick={() => setCurrentPage(item)}
                                className={`btn btn-sm ${
                                  currentPage === item
                                    ? "btn-primary"
                                    : "btn-outline-secondary"
                                }`}
                              >
                                {item}
                              </button>
                            )
                          )}

                          <button
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                              )
                            }
                            className="btn btn-sm btn-outline-primary"
                            disabled={currentPage === totalPages}
                          >
                            Next ➡
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
      {showModal && selectedStudent && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <h3 className="modal-title">📅 Schedule Assessment</h3>

            <label className="form-label">Select Date</label>
            <input
              type="date"
              className="custom-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <label className="form-label mt-3">Select Time</label>
            <select
              className="custom-input"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              <option value="">-- Select Time --</option>
              {generateTimeSlots().map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button
                className="btn-primary"
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  setErrorMessage(""); // clear previous errors
                  try {
                    const res = await handleSendMessage(
                      selectedStudent,
                      date,
                      time,
                      () => {}
                    );

                    // Check if API returned an error
                    if (res?.error) {
                      setErrorMessage(
                        `❌ Cannot send message: ${
                          res.error.message || "Unknown error"
                        }`
                      );
                    } else {
                      setMessageSent(true);
                      setTimeout(() => {
                        setShowModal(false);
                        setMessageSent(false);
                      }, 1500);
                    }
                  } catch (err) {
                    setErrorMessage(
                      `❌ Cannot send message: ${
                        err instanceof Error ? err.message : String(err)
                      }`
                    );
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {loading ? <span className="spinner" /> : "Send Message"}
              </button>

              <button
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>

            {messageSent && (
              <p className="success-msg">✅ Message has been sent!</p>
            )}

            {errorMessage && <p className="error-msg">{errorMessage}</p>}
          </div>

          {/* Styles inline with JSX */}
          <style jsx>{`
            .custom-modal-overlay {
              position: fixed;
              inset: 0;
              background: rgba(0, 0, 0, 0.45);
              backdrop-filter: blur(4px);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 999;
              animation: fadeIn 0.3s ease-in-out;
            }
            .custom-modal {
              background: #fff;
              padding: 2rem;
              border-radius: 16px;
              width: 95%;
              max-width: 420px;
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
              animation: slideUp 0.3s ease-in-out;
            }
            .modal-title {
              font-size: 1.4rem;
              font-weight: 600;
              margin-bottom: 1rem;
              color: #333;
              text-align: center;
            }
            .form-label {
              font-weight: 500;
              margin-top: 0.5rem;
              display: block;
              color: #555;
            }
            .custom-input {
              width: 100%;
              padding: 0.65rem 0.75rem;
              border: 1px solid #ccc;
              border-radius: 10px;
              margin-top: 0.4rem;
              font-size: 0.95rem;
              transition: border 0.2s ease-in-out;
            }
            .custom-input:focus {
              outline: none;
              border-color: #007bff;
            }
            .modal-actions {
              display: flex;
              justify-content: space-between;
              margin-top: 1.5rem;
              gap: 0.5rem;
            }
            .btn-primary {
              flex: 1;
              background: #28a745;
              color: #fff;
              border: none;
              padding: 0.6rem;
              border-radius: 8px;
              font-size: 0.95rem;
              cursor: pointer;
              transition: background 0.3s;
            }
            .btn-primary:hover {
              background: #218838;
            }
            .btn-secondary {
              flex: 1;
              background: #6c757d;
              color: white;
              border: none;
              padding: 0.6rem;
              border-radius: 8px;
              font-size: 0.95rem;
              cursor: pointer;
            }
            .btn-secondary:hover {
              background: #5a6268;
            }
            .spinner {
              border: 3px solid #fff;
              border-top: 3px solid rgba(255, 255, 255, 0.3);
              border-radius: 50%;
              width: 18px;
              height: 18px;
              animation: spin 0.7s linear infinite;
              display: inline-block;
            }
            .success-msg {
              color: #28a745;
              margin-top: 1rem;
              text-align: center;
              font-weight: 500;
            }
            .error-msg {
              color: #dc3545;
              margin-top: 1rem;
              text-align: center;
              font-weight: 500;
            }
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            @keyframes slideUp {
              from {
                transform: translateY(20px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
            @keyframes spin {
              0% {
                transform: rotate(0);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      )}

      <AdminFooter />
    </>
  );
}
