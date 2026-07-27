interface DividerProps {
  text?: string;
}

export default function Divider({
  text = "OR",
}: DividerProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px flex-1 bg-[var(--color-border)]" />

      <span className="select-none text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
        {text}
      </span>

      <div className="h-px flex-1 bg-[var(--color-border)]" />
    </div>
  );
}