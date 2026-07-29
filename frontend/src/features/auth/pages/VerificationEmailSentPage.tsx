import { useEffect, useState } from "react";
import { MailCheck } from "lucide-react";

export default function VerificationEmailSentPage() {
  const [seconds, setSeconds] = useState(60);
  useEffect(() => {
    if (seconds === 0) return;

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);
  const handleResendEmail = () => {
    setSeconds(60);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-lg text-center">
        <div className="mb-6 flex justify-center">
          <MailCheck className="h-16 w-16 text-[var(--color-success)]" />
        </div>

        <h1 className="text-3xl font-bold text-[var(--color-text)]">
          Verification Email Sent
        </h1>

        <p className="mt-4 text-[var(--color-text-muted)]">
          We've sent a verification email to your email address.
        </p>

        <p className="mt-4 text-lg font-semibold text-[var(--color-text)]">
          jo****@gmail.com
        </p>

        <p className="mt-4 text-sm leading-6 text-[var(--color-text-muted)]">
          Please check your inbox and click the verification link to verify your
          account. If you don't see the email, check your spam or junk folder.
        </p>

        <div className="mt-10 flex justify-center">
          <button
            onClick={handleResendEmail}
            disabled={seconds > 0}
            className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)] ${
              seconds > 0
                ? "cursor-not-allowed bg-[var(--color-border)] text-[var(--color-text-muted)]"
                : "bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)]"
            }`}
          >
            Resend Email
          </button>
        </div>

        <p className="mt-4 text-sm text-[var(--color-text-muted)]">
          Resend available in{" "}
          <span className="font-semibold">{seconds} seconds</span>
        </p>
      </div>
    </div>
  );
}
