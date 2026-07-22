import { Plus } from "lucide-react";

interface EmptyStateProps {
  onCreate?: () => void;
}

export default function EmptyState({ onCreate }: EmptyStateProps) {
  return (
    <div className="300 flex flex-col items-center justify-center pt-6 ">
      {/* Audio Icon */}
      <div className="mb-6">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="6" y="24" width="6" height="16" rx="3" fill="#1F2937" />
          <rect x="18" y="12" width="6" height="40" rx="3" fill="#1F2937" />
          <rect x="30" y="4" width="6" height="56" rx="3" fill="#1F2937" />
          <rect x="42" y="12" width="6" height="40" rx="3" fill="#1F2937" />
          <rect x="54" y="24" width="6" height="16" rx="3" fill="#1F2937" />
        </svg>
      </div>

      {/* Title */}
      <h2 className="text-[24px] font-bold text-[#1c2024]">Audio Recap</h2>

      {/* Description */}
      <p className="mt-4 max-w-[540px] text-center text-[18px] leading-8 text-[#6B7280]">
        Generate a helpful in-depth audio of any topic.
      </p>

      {/* Button */}
      <button
        onClick={onCreate}
        className="mt-6 flex items-center gap-2 rounded-xl bg-[#1747FF] px-6 py-3 text-[16px] font-semibold text-white hover:bg-[#0F3DE6]"
      >
        <Plus size={18} />
        Create New
      </button>
    </div>
  );
}
