import {
  ArrowUpDown,
  Star,
  BarChart3,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const options = [
  {
    label: "Most Viewed",
    icon: BarChart3,
  },
  {
    label: "Best Rated",
    icon: Star,
  },
  {
    label: "Newest",
    icon: ArrowDownWideNarrow,
  },
  {
    label: "Oldest",
    icon: ArrowUpNarrowWide,
  },
];

export default function SortDropdown() {
  const [selected, setSelected] = useState(options[0]);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
   <button
  onClick={() => setOpen(!open)}
  className="
    flex
    h-10
    items-center
    gap-2
    rounded-xl
    border
    border-slate-200
    bg-white
    px-4
    text-[14px]
    font-medium
    text-slate-700
    shadow-sm
    transition-all
    hover:bg-slate-50
  "
>
        <ArrowUpDown size={16} />

        <span>{selected.label}</span>

        <ChevronDown
  size={15}
  className={`transition-transform duration-200 ${
    open ? "rotate-180" : ""
  }`}
/>
      </button>

      {open && (
        <div
          className="
          absolute
          left-0
          top-12
          z-50
          w-44
          overflow-hidden
          rounded-xl
          border
          border-slate-200
          bg-white
          shadow-xl
        "
        >
          {options.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                onClick={() => {
                  setSelected(item);
                  setOpen(false);
                }}
                className="
                flex
                w-full
                items-center
                gap-3
                px-4
                py-3
                text-[15px]
                text-slate-700
                transition
                hover:bg-slate-100
              "
              >
                <Icon size={18} />

                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}