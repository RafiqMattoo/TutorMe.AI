import { BookOpenCheck } from "lucide-react";

const Logo = () => {
  return (
// Logo.tsx
<div className="flex items-center gap-2.5 mb-4">
  <div
    className="
      flex 
      h-10 
      w-10 
      items-center 
      justify-center 
      rounded-xl
      bg-[var(--color-primary-600)]
      text-[var(--color-surface)]
    "
  >
    <BookOpenCheck size={20} />
  </div>

  <div>
    <div className="text-[16px] font-bold tracking-tight">
      VidyaAI
    </div>

    <div className="text-[11px] font-medium text-[var(--color-surface)]/45">
      Learning Platform
    </div>
  </div>
</div>
  );
};

export default Logo;