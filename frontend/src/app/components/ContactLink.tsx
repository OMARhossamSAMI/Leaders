"use client";

import type { ReactNode } from "react";
import { track } from "@/utils/analytics";

// A phone number or email that can be tapped (call / write an email).
// It keeps the text's look exactly as before (same colour, no underline).
type Props = {
  kind: "phone" | "email";
  /** phone: the number in international form, e.g. "+201272924777"; email: the address */
  to: string;
  children: ReactNode;
};

export default function ContactLink({ kind, to, children }: Props) {
  return (
    <a
      href={kind === "phone" ? `tel:${to}` : `mailto:${to}`}
      onClick={() => track("contact", { method: kind })}
      style={{ color: "inherit", textDecoration: "none" }}
    >
      {children}
    </a>
  );
}
