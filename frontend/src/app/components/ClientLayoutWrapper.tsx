"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ClientLayoutWrapper({ children }: Props) {
  const pathname = usePathname();

  const isAdminPage = pathname.startsWith("/lic-auth-v9v3tz/Admin");
  const isLogin = pathname.startsWith("/lic-auth-v9v3tz");
  const isTestimonials = pathname.startsWith("/testimonials");
  const isSchool_app = pathname.startsWith("/lic-auth-v9v3tz/Admin/school_app");
  const isVacancy = pathname.startsWith("/lic-auth-v9v3tz/Admin/Vacancy");
  // 🔹 NEW: hide header/footer on Thank You page
  const isThankYou = pathname
    .toLowerCase()
    .includes("/admissions/appointments/thankyou");
  const isDeclined = pathname.startsWith("/admissions/appointments/Declined");

  return (
    <>
      {!isAdminPage &&
        !isLogin &&
        !isTestimonials &&
        !isSchool_app &&
        !isVacancy &&
        !isThankYou &&
        !isDeclined && <Header />}
      {children}
      {!isAdminPage &&
        !isLogin &&
        !isTestimonials &&
        !isSchool_app &&
        !isVacancy &&
        !isThankYou &&
        !isDeclined && <Footer />}
    </>
  );
}
