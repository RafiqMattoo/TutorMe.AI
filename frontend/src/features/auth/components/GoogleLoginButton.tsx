import { FcGoogle } from "react-icons/fc";

interface GoogleLoginButtonProps {
  onClick?: () => void;
}

export default function GoogleLoginButton({
  onClick,
}: GoogleLoginButtonProps) {
  return (
  <button
  type="button"
  onClick={onClick}
  className="
    btn-secondary
    flex-1
    rounded-md
    border
    border-[var(--color-border)]
    bg-[var(--color-surface-muted)]
    transition-all
    duration-200
    hover:border-[var(--color-primary-200)]
    hover:bg-[var(--color-hover)]
    hover:shadow-sm
    active:scale-[0.98]
  "
>
  <FcGoogle className="h-5 w-5 shrink-0" />
  <span className="font-medium text-[var(--color-text)]">
    Google
  </span>
</button>
  );
}