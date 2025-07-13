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

  return (
    <>
      {!isAdminPage && !isLogin && <Header />}
      {children}
      {!isAdminPage && !isLogin && <Footer />}
    </>
  );
}
