import Link from "next/link";
import "./page.css";

export default function ThankYouPage() {
  return (
    <div className="thankyou-container">
      <div className="thankyou-card">
        {/* School Logo inside the card */}
        <img
          src="/assets/img/Whatapp_LIC.png"
          alt="School Logo"
          className="thankyou-logo"
        />

        {/* Animated Success Checkmark */}
        <div className="checkmark-wrapper">
          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className="checkmark-circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="checkmark-check"
              fill="none"
              d="M14 27l7 7 16-16"
            />
          </svg>
        </div>

        {/* Title + Message */}
        <h1 className="thankyou-title">Payment Approved</h1>
        <p className="thankyou-message">
          Your payment has been successfully processed and your child’s
          assessment booking is confirmed.
        </p>
        <p className="thankyou-subtext">
          We will send you an Email confirmation with all details shortly.
        </p>

        {/* Button */}
        <Link href="/" className="thankyou-btn">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
