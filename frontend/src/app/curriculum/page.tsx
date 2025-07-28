"use client";
import React, { Suspense } from "react";
import CurriculumForm from "./CurriculumForm";
export default function ApplyFormPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <CurriculumForm />
    </Suspense>
  );
}
