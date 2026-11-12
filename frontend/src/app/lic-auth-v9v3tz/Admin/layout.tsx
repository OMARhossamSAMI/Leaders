"use client";

import React from "react";
import { installAdminAuth } from "@/utils/adminAuth";

// Runs when this module loads, before any admin page makes its first request.
installAdminAuth();

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
