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

  const isAdminPage = pathname.startsWith("/login/Admin");
  const isLogin = pathname.startsWith("/login");
  const isTestimonials = pathname.startsWith("/testimonials");
  const isSchool_app = pathname.startsWith("/login/Admin/school_app");
  const isVacancy = pathname.startsWith("/login/Admin/Vacancy");

  return (
    <>
      {!isAdminPage && !isLogin && !isTestimonials && !isSchool_app && !isVacancy && <Header />}
      {children}
      {!isAdminPage && !isLogin && !isTestimonials && !isSchool_app && !isVacancy &&<Footer />}
    </>
  );
}
