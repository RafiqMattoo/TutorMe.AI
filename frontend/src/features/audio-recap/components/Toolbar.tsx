import { useState } from "react";
import { BookOpen, ChevronDown, LayoutGrid, Search } from "lucide-react";

export default function Toolbar() {
  const studySets = ["My First Study Set", "React Basics"];

  const [selectedStudySet, setSelectedStudySet] = useState(studySets[0]);
  const [search, setSearch] = useState("");
  const [dropdownSearch, setDropdownSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);

  const filteredStudySets = studySets.filter((item) =>
    item.toLowerCase().includes(dropdownSearch.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
      {/* LEFT */}
      <div>
        <p className="mb-4 text-[14px] text-[#64748B]">
          Viewing{" "}
          <span className="font-semibold text-[#172554]">Audio Recap</span> for
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {/* Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown((prev) => !prev)}
              className="
                flex
                h-10
                gap-2
                
                items-center
                justify-between
                rounded-xl
                border
                border-[#E5E7EB]
                bg-white
                px-4
                transition
                hover:border-[#1747FF]
              "
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex items-center justify-center rounded-full bg-[#FFF6D8]">
                  <BookOpen size={16} className="text-[#8A6C1B]" />
                </div>

                <span className="truncate text-[14px] font-medium text-[#111827]">
                  {selectedStudySet}
                </span>
              </div>

              <ChevronDown
                size={18}
                className={`text-[#6B7280] transition-transform ${
                  openDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {openDropdown && (
              <div
                className="
      absolute
      left-0
      top-12
      z-30
      w-[330px]
      overflow-hidden
      rounded-2xl
      border
      border-gray-200
      bg-white
      shadow-[0_10px_30px_rgba(0,0,0,0.08)]
    "
              >
                {/* Header */}
                <div className="border-b border-gray-100 px-4 py-1">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Your Study Sets
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Choose a study set
                  </p>
                </div>

                {/* Search */}
                <div className="border-t border-gray-100 p-1">
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      value={dropdownSearch}
                      onChange={(e) => setDropdownSearch(e.target.value)}
                      placeholder="Search..."
                      className="
            h-10
            w-full
            rounded-xl
            border
            border-gray-200
            bg-gray-50
            pl-10
            pr-3
            text-sm
            text-slate-700
            placeholder:text-gray-400
            outline-none
            transition
            focus:border-blue-500
            focus:bg-white
          "
                    />
                  </div>
                </div>

                {/* Study Sets */}
                <div className="max-h-64 overflow-y-auto p-2">
                  {filteredStudySets.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setSelectedStudySet(item);
                        setOpenDropdown(false);
                      }}
                      className={`
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-3
            py-2.5
            text-left
            transition-all
            ${selectedStudySet === item ? "bg-blue-50" : "hover:bg-gray-50"}
          `}
                    >
                      <div
                        className={`
              flex
              items-center
              justify-center
              rounded-lg
              ${selectedStudySet === item ? "bg-blue-100" : "bg-amber-100"}
            `}
                      >
                        <BookOpen
                          size={16}
                          className={
                            selectedStudySet === item
                              ? "text-blue-600"
                              : "text-amber-700"
                          }
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-800">
                          {item}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 p-3">
                  <button
                    className="
          flex
          py-2
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-gray-200
          bg-white
          text-sm
          font-medium
          text-slate-700
          transition
          hover:bg-gray-50
        "
                  >
                    <LayoutGrid size={16} />
                    View All Study Sets
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* View All */}
          <button
            className="
              flex
              h-10
              items-center
              rounded-full
              bg-[#F3F4F6]
              px-6
              text-[15px]
              font-medium
              text-[#475569]
              transition
              hover:bg-[#E5E7EB]
            "
          >
            View All
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full lg:w-[290px]">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="
            py-2
            w-full
            rounded-xl
            border
            border-[#E5E7EB]
            bg-white
            pl-4
            pr-10
            text-[15px]
            outline-none
            focus:border-[#1747FF]
            z-20
          "
        />

        <Search
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] z-20"
        />
      </div>
    </div>
  );
}
