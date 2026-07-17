import { ChevronDown, Search } from "lucide-react";

export default function Filters() {
  return (
    <div className="mt-8 flex items-start justify-between">
      {/* Left Side */}
      <div>
        <p className="mb-3 text-[18px] text-gray-700">
          Viewing{" "}
          <span className="font-semibold text-[#2D2A6E]">Audio Recap</span> for
        </p>

        <div className="flex items-center gap-3">
          {/* Dropdown */}
          <button className="flex h-11 items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 hover:border-gray-400">
            <img
              src="https://placehold.co/20x20"
              alt=""
              className="rounded-full"
            />

            <span className="font-medium text-gray-800">
              My First Study Set
            </span>

            <ChevronDown size={18} className="text-gray-500" />
          </button>

          {/* View All */}
          <button className="h-11 rounded-full bg-gray-100 px-6 font-medium text-gray-700 hover:bg-gray-200">
            View All
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={20}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search..."
          className="h-11 w-[290px] rounded-xl border border-gray-300 pl-4 pr-10 outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
}
