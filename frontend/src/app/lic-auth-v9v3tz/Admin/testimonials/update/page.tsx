"use client";
import React, { Suspense } from "react";
import UpdateForm from "./updateform";

export default function UpdateTestimonial() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <UpdateForm />
    </Suspense>
  );
}
