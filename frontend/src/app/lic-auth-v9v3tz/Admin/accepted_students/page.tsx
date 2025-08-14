"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";
// ✅ Reuse the same CSS file from the Student Applications page
//    If your folder structure is different, just adjust the relative path.
import "../school_app/page.css";

import AdminHeader from "../../../components/AdminHeader";
import AdminFooter from "../../../components/AdminFooter";
import { useRouter } from "next/navigation";

type FieldValue = string | number | boolean | string[] | File | null;

interface AcceptedStudent {
  _id: string;
  createdAt: string;
  updatedAt: string;
  data: Record<string, FieldValue>;
  files?: { originalname: string; path: string }[];
}

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

  // Pagination (reuse same pattern)
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const totalPages = Math.ceil(students.length / perPage);
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentStudents = students.slice(indexOfFirst, indexOfLast);

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

  // ===== Delete (kept for design parity, but no DELETE call: GET-only phase) =====
  const handleDelete = () => {
    alert("Remove from accepted list: coming soon.");
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
                                    onClick={() => handleDelete()}
                                    className="icon-button text-red-600"
                                    aria-label="Remove accepted student (coming soon)"
                                    title="Remove accepted student (coming soon)"
                                    type="button"
                                  >
                                    <Trash2 />
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
                        <div className="pagination mt-4 d-flex justify-content-center gap-2">
                          <button
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            className="btn btn-sm btn-outline-primary"
                            disabled={currentPage === 1}
                          >
                            ⬅ Prev
                          </button>

                          {[...Array(totalPages)].map((_, i) => (
                            <button
                              key={i + 1}
                              onClick={() => setCurrentPage(i + 1)}
                              className={`btn btn-sm ${
                                currentPage === i + 1
                                  ? "btn-primary"
                                  : "btn-outline-secondary"
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}

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

      <AdminFooter />
    </>
  );
}
