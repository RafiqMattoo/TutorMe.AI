import { CircleX } from "lucide-react";
export default function VerificationLinkExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-lg text-center">
        <div className="mb-2 flex justify-center">
          <CircleX className="h-12 w-14 text-[var(--color-danger)]" />
        </div>

        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          Invalid or Expired Link
        </h1>
        <p className="mt-4 text-[var(--color-text-muted)]">
          This verification link is invalid or has expired. Please request a new
          verification email to continue.
        </p>
        <div className="mt-8 flex justify-center">
          <button className="rounded-lg bg-[var(--color-primary-600)] px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-[var(--color-primary-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]">
            Resend Verification Email
          </button>
        </div>
      </div>
    </div>
  );
}
