"use client";
import React, { Suspense } from "react";
import ApplyForm from "./Applyform";
export default function ApplyFormPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <ApplyForm />
    </Suspense>
  );
}
