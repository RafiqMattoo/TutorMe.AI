import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
export default function VerificationSuccessPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-lg text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="h-16 w-16 text-[var(--color-success)]" />
        </div>

        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          Email Verified Successfully
        </h1>

        <p className="mt-4 text-[var(--color-text-muted)]">
          Your email has been verified successfully. You can now log in to your
          account.
        </p>
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/login")}
            className="rounded-lg bg-[var(--color-primary-600)] px-6 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-[var(--color-primary-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]"
          >
            Continue to Login
          </button>
        </div>
      </div>
    </div>
  );
}
