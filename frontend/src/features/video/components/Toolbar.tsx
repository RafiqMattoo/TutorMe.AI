import { ChevronDown, Search } from "lucide-react";
import SortDropdown from "./sortDropDown";
import CategoryTabs from "./CategoryTabs";

const Toolbar = () => {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      {/* Left */}
      <div className="flex items-center gap-6">
        {/* Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1">
          <button className="rounded-lg bg-white px-5 py-2 text-sm font-semibold shadow-sm">
            Explore
          </button>

          <button className="rounded-lg px-5 py-2 text-sm text-slate-500 transition hover:text-slate-900">
            My Videos
          </button>
        </div>

        <span className="text-sm text-slate-500">
          <span className="font-semibold text-slate-900">978</span> Results
        </span>
      </div>

      {/* Right */}
      <div className="flex flex-wrap items-center gap-3">
       <div className="flex items-center gap-3">
  <SortDropdown />

  <CategoryTabs />
</div>

        {/* Search */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
          <Search size={18} className="text-slate-400" />

          <input
            type="text"
            placeholder="Search"
            className="w-56 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;