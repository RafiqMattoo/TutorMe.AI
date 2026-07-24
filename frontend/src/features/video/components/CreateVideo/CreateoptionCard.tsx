import type { ReactNode } from "react";
import { Check } from "lucide-react";

interface CreateOptionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function CreateOptionCard({
  icon,
  title,
  description,
  selected = false,
  onClick,
}: CreateOptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex w-64 flex-col rounded-3xl border p-8 text-left transition-all duration-300
      ${
        selected
          ? "border-blue-600 bg-blue-50 shadow-xl"
          : "border-slate-200 bg-white shadow-sm hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl"
      }`}
    >
      {/* Selected Badge */}
      {selected && (
        <div className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
          <Check size={18} />
        </div>
      )}

      {/* Icon */}
      <div
        className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300
        ${
          selected
            ? "bg-blue-600 text-white"
            : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
        }`}
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-slate-900">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-4 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </button>
  );
}