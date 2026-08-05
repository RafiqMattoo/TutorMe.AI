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
  { label: "Most Viewed", icon: BarChart3 },
  { label: "Best Rated", icon: Star },
  { label: "Newest", icon: ArrowDownWideNarrow },
  { label: "Oldest", icon: ArrowUpNarrowWide },
];

export default function SortDropDown() {
  const [selected, setSelected] = useState(options[0]);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full sm:w-auto">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex
          h-10
          w-full
          min-w-[170px]
          items-center
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
          duration-200
          hover:bg-slate-50
          sm:w-auto
        "
      >
        <ArrowUpDown size={16} />

        <span className="ml-2">{selected.label}</span>

        <ChevronDown
          size={15}
          className={`ml-auto transition-transform duration-200 ${
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
            z-[100]
            w-full
            min-w-[170px]
            overflow-hidden
            rounded-xl
            border
            border-slate-200
            bg-white
            shadow-lg
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
                  py-2.5
                  text-left
                  text-[14px]
                  text-slate-700
                  transition-colors
                  duration-200
                  hover:bg-slate-100
                "
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}