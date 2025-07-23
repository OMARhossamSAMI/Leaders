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

import AdminHeader from "@/app/components/AdminHeader";
import AdminFooter from "@/app/components/AdminFooter";

interface Popup {
  _id: string;
  title: string;
  category: string;
  message: string;
  path: string;
  status: "on" | "off";
  buttons?: string[];
}

export default function PopupPage() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchPopups = async () => {
    try {
      const res = await axios.get<Popup[]>("http://localhost:3000/popup");
      setPopups(res.data);
    } catch (err) {
      setError("Failed to load popups.");
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      await axios.patch(`http://localhost:3000/popup/toggle/${id}`);
      fetchPopups();
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Could not toggle status.");
      }
      setTimeout(() => setError(""), 3000);
    }
  };

  const deletePopup = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/popup/${id}`);
      fetchPopups();
    } catch (err) {
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

  return (
    <>
      <AdminHeader />
      <div style={{ paddingTop: "130px", background: "#f5f9fa", minHeight: "100vh" }}>
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
              onClick={() => router.push("/login/Admin/popup/create")}
            >
              <Plus size={18} /> Create Popup
            </button>
          </div>

          {error && <div className="error-box">{error}</div>}

          <div className="cards-wrapper">
            {popups.map((popup) => (
              <div className="notificationCard" key={popup._id}>
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
                      {popup.status === "on" ? "Currently Live" : "Make Live"}
                    </p>
                  </div>

                  <div className="popup-icons-right">
                    <button
                      className="icon-btn"
                      onClick={() =>
                        router.push(`/login/Admin/popup/edit?id=${popup._id}`)
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
                <div className="popup-icon-wrapper">
                  {getCategoryIcon(popup.category)}
                </div>

                <p className="notificationPara">{popup.message}</p>

                <div className="buttonContainer">
                  {popup.buttons?.slice(0, 3).map((btnText, i) => (
                    <button key={i} className={i === 0 ? "AllowBtn" : "NotnowBtn"}>
                      {btnText}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    <AdminFooter />
    </>
  );
}
