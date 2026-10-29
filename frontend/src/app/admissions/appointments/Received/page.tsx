import Link from "next/link";
import "./page.css";

// Shown when a parent paid but the time couldn't be booked automatically
// (it was taken while they paid), or when the payment couldn't be confirmed
// yet (?status=checking). Admissions is emailed in both cases.
export default async function ReceivedPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const checking = status === "checking";

  return (
    <div className="received-container">
      <div className="received-card">
        <img
          src="/assets/img/Whatapp_LIC.png"
          alt="School Logo"
          className="received-logo"
        />

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
            {/* clock hands */}
            <path className="checkmark-check" fill="none" d="M26 14v13l8 6" />
          </svg>
        </div>

        {checking ? (
          <>
            <h1 className="received-title">Confirming Your Payment</h1>
            <p className="received-message">
              We’re confirming your payment with the payment provider.
            </p>
            <p className="received-subtext">
              If your payment went through, our Admissions team will contact
              you to confirm your child’s assessment time.{" "}
              <strong>Please don’t pay again</strong> until you hear from us.
            </p>
          </>
        ) : (
          <>
            <h1 className="received-title">Payment Received</h1>
            <p className="received-message">
              Thank you, we have received your payment.
            </p>
            <p className="received-subtext">
              The time you chose was no longer available, so it couldn’t be
              booked automatically. Our Admissions team has been notified and
              will contact you shortly to confirm your child’s assessment time.{" "}
              <strong>Please don’t pay again.</strong>
            </p>
          </>
        )}

        <Link href="/" className="received-btn">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
