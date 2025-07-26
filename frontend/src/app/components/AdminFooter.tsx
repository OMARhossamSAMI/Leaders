// components/AdminFooter.tsx
import Link from "next/link";
import "./AdminFooter.css";

export default function AdminFooter() {
  return (
    <footer className="admin-footer dark-background text-white py-3 mt-5">
      <div className="container text-center">
        <div className="d-flex justify-content-center flex-wrap gap-3 mb-2">
          <Link href="/" className="footer-link">Home</Link>
          <Link href="/about" className="footer-link">About Us</Link>
          <Link href="/admissions" className="footer-link">Admissions</Link>
          <Link href="/curriculum" className="footer-link">Curriculum</Link>
          <Link href="/students-life" className="footer-link">Students Life</Link>
          <Link href="/hiring" className="footer-link">We Are Hiring</Link>
        </div>
        <p className="small mb-0">
          © {new Date().getFullYear()} Leaders International College — Preview Footer
        </p>
      </div>
    </footer>
  );
}
