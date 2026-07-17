import { Clapperboard, Plus } from "lucide-react";

const Header = () => {
  return (
    <header className="mb-8 flex items-center justify-between border-b border-slate-200 pb-8">
      {/* Left */}
      <div className="flex items-center gap-5">
        {/* Icon */}
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100">
          <Clapperboard className="h-10 w-10 text-blue-600" />
        </div>

        {/* Text */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Turn your files into{" "}
            <span className="text-blue-600">Videos</span>
          </h1>

          <p className="mt-2 text-base text-slate-500">
            Transform your study materials into fun video explainers.
          </p>
        </div>
      </div>

      {/* Button */}
      <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md">
        <Plus size={18} />
        Create Video
      </button>
    </header>
  );
};

export default Header;