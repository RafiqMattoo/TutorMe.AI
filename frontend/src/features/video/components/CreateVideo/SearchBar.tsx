import { Search } from "lucide-react";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value = "",
  onChange,
  // placeholder = "Search materials...",
}: SearchBarProps) {
  return (
    <div className="relative w-72">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        value={value}
        // placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-12 w-48 rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  );
}