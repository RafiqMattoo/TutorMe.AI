import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

export default function Toolbar() {
  const studySets = [
    "My First Study Set",
    "React Basics",
    "JavaScript",
    "TypeScript",
  ];

  const [selectedStudySet, setSelectedStudySet] = useState(studySets[0]);
  const [search, setSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <div className="flex items-end justify-between">
      {/* Left Side */}
      <div>
        <p className="mb-4 text-[18px] text-[#374151]">
          Viewing{" "}
          <span className="font-semibold text-[#2C2C6C]">Audio Recap</span> for
        </p>

        <div className="flex items-center gap-3">
          {/* Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className="flex h-11 w-[240px] items-center justify-between rounded-xl border border-gray-300 bg-white px-4 hover:border-blue-500"
            >
              <span className="text-[16px] font-medium">
                {selectedStudySet}
              </span>

              <ChevronDown
                size={18}
                className={`transition ${openDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {openDropdown && (
              <div className="absolute left-0 top-12 z-20 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
                {studySets.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setSelectedStudySet(item);
                      setOpenDropdown(false);
                    }}
                    className="block w-full px-4 py-3 text-left text-[15px] hover:bg-gray-100"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View All */}
          <button className="h-11 rounded-full bg-[#F3F4F6] px-6 text-[15px] font-medium text-[#374151] hover:bg-[#E8EAEE]">
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="h-11 w-[300px] rounded-xl border border-gray-300 bg-white pl-4 pr-11 text-[15px] outline-none transition focus:border-blue-600"
        />
      </div>
    </div>
  );
}
