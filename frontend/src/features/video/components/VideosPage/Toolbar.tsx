import { Search } from "lucide-react";
import SortDropDown from "./SortDropDown";
import CategoryTabs from "./CategoryTabs";

const Toolbar = () => {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Left */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:gap-6">
        {/* Tabs */}
        <div className="flex w-fit rounded-xl bg-slate-100 p-1">
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
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Sort + Categories */}
        <div className="flex flex-wrap items-center gap-3">
          <SortDropDown />
          <CategoryTabs />
        </div>

        {/* Search */}
        <div className="flex h-10 w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 shadow-sm sm:w-64">
          <Search size={17} className="text-slate-400" />

          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent text-[14px] outline-none placeholder:text-slate-400"
          />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;