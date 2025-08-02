"use client";

import { useEffect, useState } from "react";
import "./page.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Trash2,
  Plus,
  ToggleLeft,
  ToggleRight,
  GraduationCap,
  Megaphone,
  CalendarClock,
  Tag,
  Info,
  Star,
} from "lucide-react";

import AdminHeader from "../../../components/AdminHeader";
import AdminFooter from "../../../components/AdminFooter";

interface Popup {
  _id: string;
  title: string;
  category: string;
  message: string;
  path: string;
  status: "on" | "off";
  buttons?: string[];
  imagePath?: string;
}

export default function PopupPage() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loadingPopups, setLoadingPopups] = useState(true);

  const router = useRouter();

  const fetchPopups = async () => {
    try {
      const res = await axios.get<Popup[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/popup`
      );
      setPopups(res.data);
    } catch {
      setError("Failed to load popups.");
    } finally {
      setLoadingPopups(false);
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/popup/toggle/${id}`
      );
      fetchPopups();
    } catch (err: unknown) {
      let message = "Could not toggle status.";

      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as Record<string, unknown>).response === "object"
      ) {
        const response = (
          err as {
            response?: { data?: { message?: unknown } };
          }
        ).response;

        const rawMessage = response?.data?.message;
        if (typeof rawMessage === "string") {
          message = rawMessage;
        } else if (Array.isArray(rawMessage)) {
          message = rawMessage.join(" \n ");
        }
      }

      setError(message);
      setTimeout(() => setError(""), 3000);
    }
  };

  const deletePopup = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/popup/${id}`);
      fetchPopups();
    } catch {
      setError("Failed to delete popup.");
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconProps = { size: 48, color: "rgb(168, 131, 255)" };
    switch (category.toLowerCase()) {
      case "admission":
        return <GraduationCap {...iconProps} />;
      case "announcement":
        return <Megaphone {...iconProps} />;
      case "event":
        return <CalendarClock {...iconProps} />;
      case "discount":
        return <Tag {...iconProps} />;
      case "deadline":
        return <Info {...iconProps} />;
      default:
        return <Star {...iconProps} />;
    }
  };

  useEffect(() => {
    fetchPopups();
  }, []);
  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");

    if (!token) {
      router.push("/lic-auth-v9v3tz");
    } else {
      setAuthenticated(true);
    }
  }, [router]);
  if (!authenticated) return null; // prevent flashing
  return (
    <>
      <AdminHeader />
      <div
        style={{
          paddingTop: "130px",
          background: "#f5f9fa",
          minHeight: "100vh",
        }}
      >
        {/* Header outside the shadow box */}
        <div className="container section-title mb-4">
          <h2>Popup Manager</h2>
          <p>Manage and control website popup banners.</p>
        </div>

        {/* Shadow box */}
        <div className="popup-shadow-box">
          <div className="header-row">
            <button
              className="add-btn"
              onClick={() => router.push("/lic-auth-v9v3tz/Admin/popup/create")}
            >
              <Plus size={18} /> Create Popup
            </button>
          </div>

          {error && <div className="error-box">{error}</div>}

          {loadingPopups ? (
            <>
              <div className="loader-container">
                <div className="spinner" />
                <p className="loading-text">Loading Pop Up messages...</p>
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
          ) : (
            <div className="cards-wrapper">
              {popups.length === 0 ? (
                <p
                  style={{
                    color: "#888",
                    fontStyle: "italic",
                    padding: "1rem",
                  }}
                >
                  No popups created yet.
                </p>
              ) : (
                popups.map((popup) => (
                  <div className="notificationCard" key={popup._id}>
                    {/* Image Banner if exists */}

                    {/* Top Controls */}
                    <div className="popup-top-bar">
                      <div className="card-actions">
                        <button
                          className="toggle-btn"
                          onClick={() => toggleStatus(popup._id)}
                        >
                          {popup.status === "on" ? (
                            <ToggleRight color="#10b981" size={32} />
                          ) : (
                            <ToggleLeft color="#d1d5db" size={32} />
                          )}
                        </button>
                        <p className="toggle-label">
                          {popup.status === "on"
                            ? "Currently Live"
                            : "Make Live"}
                        </p>
                      </div>

                      <div className="popup-icons-right">
                        <button
                          className="icon-btn"
                          onClick={() =>
                            router.push(
                              `/lic-auth-v9v3tz/Admin/popup/edit?id=${popup._id}`
                            )
                          }
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="icon-btn danger"
                          onClick={() => deletePopup(popup._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="notificationHeading">{popup.title}</p>

                    {popup.imagePath && (
                      <div className="popupImageWrapper">
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${popup.imagePath}`}
                          alt="Popup"
                          className="popupImage"
                        />
                      </div>
                    )}

                    {/* Text Content */}

                    <div className="popup-icon-wrapper">
                      {getCategoryIcon(popup.category)}
                    </div>

                    <p className="notificationPara">{popup.message}</p>

                    <div className="buttonContainer">
                      {popup.buttons?.slice(0, 3).map((btnText, i) => (
                        <button
                          key={i}
                          className={i === 0 ? "AllowBtn" : "NotnowBtn"}
                        >
                          {btnText}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <AdminFooter />
    </>
  );
}
