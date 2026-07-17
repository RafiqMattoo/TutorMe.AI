import { Filter, Plus } from "lucide-react";

interface HeaderProps {
  onFilter?: () => void;
  onGenerate?: () => void;
}

export default function Header({ onFilter, onGenerate }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-8 py-6">
        {/* Left */}
        <div>
          <h1 className="text-[44px] font-bold leading-tight text-[#2C2C6C]">
            Audio Recaps
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button
            onClick={onFilter}
            className="flex h-11 items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 text-[15px] font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <Filter size={18} />
            Filter
          </button>

          <button
            onClick={onGenerate}
            className="flex h-11 items-center gap-2 rounded-xl bg-[#1747FF] px-6 text-[15px] font-semibold text-white transition hover:bg-[#0F3DE6]"
          >
            <Plus size={18} />
            Generate Audio Recap
          </button>
        </div>
      </div>
    </header>
  );
}
