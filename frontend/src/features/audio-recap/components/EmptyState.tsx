import { Plus } from "lucide-react";

interface EmptyStateProps {
  onCreate?: () => void;
}

export default function EmptyState({ onCreate }: EmptyStateProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center">
      {/* Waveform Icon */}
      <div className="mb-2 flex items-end gap-[6px]">
        <span className="h-5 w-[6px] rounded-full bg-[#111827]" />
        <span className="h-11 w-[6px] rounded-full bg-[#111827]" />
        <span className="h-16 w-[6px] rounded-full bg-[#111827]" />
        <span className="h-11 w-[6px] rounded-full bg-[#111827]" />
        <span className="h-5 w-[6px] rounded-full bg-[#111827]" />
      </div>

      {/* Title */}
      <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#172554]">
        Audio Recap
      </h2>

      {/* Description */}
      <p className="mt-2 max-w-[560px] text-[14px] leading-7 text-[#64748B] -mb-[20px]">
        Generate a helpful in-depth audio of any topic.
      </p>

      {/* Button */}
      <button
        onClick={onCreate}
        className="
          mt-8
          flex
          py-2
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-[#1747FF]
          px-6
          text-[12px]
          font-semibold
          text-white
          transition
          duration-200
          hover:bg-[#0F3DE6]
          active:scale-[0.98]
        "
      >
        <Plus size={18} strokeWidth={2.5} />
        Create New
      </button>
    </div>
  );
}
