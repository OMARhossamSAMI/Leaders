import Link from "next/link";
import "./page.css";

export default function DeclinedPage() {
  return (
    <div className="declined-container">
      <div className="declined-card">
        {/* School Logo */}
        <img
          src="/assets/img/Whatapp_LIC.png"
          alt="School Logo"
          className="declined-logo"
        />

        {/* Animated Error Cross */}
        <div className="crossmark-wrapper">
          <svg
            className="crossmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className="crossmark-circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="crossmark-cross"
              fill="none"
              d="M16 16 36 36 M36 16 16 36"
            />
          </svg>
        </div>

        {/* Title + Message */}
        <h1 className="declined-title">Payment Declined</h1>
        <p className="declined-message">
          Unfortunately, your payment attempt was not successful. Please try
          again or use another payment method.
        </p>
        <p className="declined-subtext">
          Our admissions team is available to assist if you continue to face
          issues.
        </p>

        {/* Button */}
        <Link href="/" className="declined-btn">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
