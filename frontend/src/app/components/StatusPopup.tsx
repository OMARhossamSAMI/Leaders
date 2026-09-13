"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { capitalizeFirst } from "../../utils/text";

export type StatusPopupKind = "success" | "error";

export interface StatusPopupState {
  kind: StatusPopupKind;
  title: string;
  message: string | string[];
}

interface StatusPopupProps extends StatusPopupState {
  open: boolean;
  onClose: () => void;
  /** Ignored when kind === "error" — errors always require an explicit dismissal. */
  autoDismissMs?: number;
}

export default function StatusPopup({
  open,
  kind,
  title,
  message,
  onClose,
  autoDismissMs,
}: StatusPopupProps) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open || kind !== "success" || !autoDismissMs) return;
    const timer = window.setTimeout(() => onCloseRef.current(), autoDismissMs);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, kind, autoDismissMs]);

  if (!open || typeof document === "undefined") return null;

  const lines = Array.isArray(message) ? message : [message];
  const iconBg = kind === "success" ? "#e8f8ff" : "#ffeaea";
  const iconColor = kind === "success" ? "#0aa2d1" : "#c32626";
  const actionColor = kind === "success" ? "var(--accent-color)" : "#c32626";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="statusPopupTitle"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        display: "grid",
        placeItems: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          width: "min(380px, 92vw)",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 14px 44px rgba(0,0,0,.25)",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          aria-hidden
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            background: iconBg,
            color: iconColor,
            fontSize: 28,
            fontWeight: 800,
            marginBottom: 10,
          }}
        >
          {kind === "success" ? "✓" : "!"}
        </div>

        <h4 id="statusPopupTitle" style={{ margin: 0 }}>
          {title}
        </h4>

        {lines.length > 1 ? (
          <ul
            style={{
              textAlign: "left",
              margin: "12px 0",
              paddingLeft: 20,
              alignSelf: "stretch",
            }}
          >
            {lines.map((line, i) => (
              <li key={i}>{capitalizeFirst(line)}</li>
            ))}
          </ul>
        ) : (
          <p style={{ textAlign: "center", margin: "12px 0" }}>
            {capitalizeFirst(lines[0] ?? "")}
          </p>
        )}

        <button
          type="button"
          style={{
            backgroundColor: actionColor,
            color: "#fff",
            borderRadius: 8,
            padding: "10px 18px",
            fontWeight: 600,
            border: "none",
          }}
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>,
    document.body
  );
}
