import { Plus } from "lucide-react";

interface HeaderProps {
  onGenerate?: () => void;
}

export default function Header({ onGenerate }: HeaderProps) {
  return (
    <header className="border-b border-[#E5E7EB] bg-white">
      <div className="flex  items-end justify-between px-8 pb-5">
        {/* Left */}
        <div>
          <h1 className="text-[30px] font-bold leading-none tracking-[-0.02em] text-[#172554]">
            Audio Recaps
          </h1>
        </div>

        {/* Right */}
        <button
          onClick={onGenerate}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-[#1747FF]
            px-4
            py-2
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
          Generate Audio Recap
        </button>
      </div>
    </header>
  );
}
