import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { TabsProvider } from "./components/TabsContext";
import { CurriculumProvider } from "./components/CurriculumContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Leaders International College",
  description: "Official website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Favicons */}
        <link href="/assets/img/lic_logo.png" rel="icon" />
        <link href="/assets/img/apple-touch-icon.png" rel="apple-touch-icon" />

        {/* ✅ Google Fonts */}
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          href="https://fonts.gstatic.com"
          rel="preconnect"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />

        {/* ✅ Vendor CSS */}
        <link
          href="/assets/vendor/bootstrap/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          href="/assets/vendor/bootstrap-icons/bootstrap-icons.css"
          rel="stylesheet"
        />
        <link
          href="/assets/vendor/swiper/swiper-bundle.min.css"
          rel="stylesheet"
        />
        <link
          href="/assets/vendor/glightbox/css/glightbox.min.css"
          rel="stylesheet"
        />
        <link href="/assets/vendor/aos/aos.css" rel="stylesheet" />

        {/* ✅ Main CSS */}
        <link href="/assets/css/main.css" rel="stylesheet" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TabsProvider>
          <CurriculumProvider>
            <Header />
            {children}
            <Footer />
          </CurriculumProvider>
        </TabsProvider>

        {/* ✅ Scripts */}
        <Script
          src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js"
          strategy="beforeInteractive"
        />
        <Script src="/assets/vendor/aos/aos.js" strategy="beforeInteractive" />
        <Script
          src="/assets/vendor/swiper/swiper-bundle.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/assets/vendor/glightbox/js/glightbox.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/assets/vendor/php-email-form/validate.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/assets/vendor/purecounter/purecounter_vanilla.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/assets/vendor/imagesloaded/imagesloaded.pkgd.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/assets/vendor/isotope-layout/isotope.pkgd.min.js"
          strategy="beforeInteractive"
        />

        <Script src="/assets/js/main.js" strategy="afterInteractive" />
        <Script id="aos-init" strategy="afterInteractive">
          {`
            AOS.init({
              duration: 800,
              once: true
            });
          `}
        </Script>
      </body>
    </html>
  );
}
