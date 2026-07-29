import { FaApple } from "react-icons/fa";

interface AppleLoginButtonProps {
  onClick?: () => void;
}

export default function AppleLoginButton({
  onClick,
}: AppleLoginButtonProps) {
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
    hover:bg-[var(--color-hover)]
    hover:shadow-sm
    active:scale-[0.98]
  "
>
  <FaApple
    className="h-5 w-5 shrink-0"
    style={{ color: "var(--color-text)" }}
  />
  <span className="font-medium text-[var(--color-text)]">
    Apple
  </span>
</button>
  );
}