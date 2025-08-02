"use client";
import React, { Suspense } from "react";
import EditForm from "./editform";

export default function EditPopupPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <EditForm />
    </Suspense>
  );
}
