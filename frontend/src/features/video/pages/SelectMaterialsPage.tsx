import { Clapperboard, Search, Grid2x2, List, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import preview2 from "../../../public/images/preview2.jpeg";

export default function SelectMaterialsPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen overflow-hidden bg-white">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50">
            <Clapperboard className="h-5 w-5 text-indigo-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Create an Explainer Video
          </h1>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2 text-sm hover:bg-slate-50"
        >
          <X className="h-4 w-4" />
          Exit
        </button>
      </header>

      {/* Main */}
      <div className="grid h-[calc(100vh-64px)] grid-cols-[58%_42%]">
        {/* LEFT */}
        <div className="flex flex-col justify-between border-r border-slate-200 bg-white px-16 py-12">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  Step 2 of 2
                </p>

                <h2 className="mt-2 text-5xl font-bold leading-tight text-slate-900">
                  Select your materials
                </h2>

                <p className="mt-4 max-w-md text-lg leading-8 text-slate-500">
                  Choose study materials from your library or upload a new
                  document to generate an AI-powered explainer video.
                </p>
              </div>

              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />

                <input
                  placeholder="Search..."
                  className="h-12 w-64 rounded-xl border border-slate-300 pl-11 pr-4 outline-none"
                />
              </div>
            </div>

            <div className="mt-10 flex justify-end gap-3">
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Grid2x2 size={18} />
              </button>

              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <List size={18} />
              </button>
            </div>

            <div className="mt-8 flex gap-6">
              <div className="flex h-56 w-44 cursor-pointer flex-col overflow-hidden rounded-2xl border-2 border-dashed border-slate-300">
                <div className="flex flex-1 items-center justify-center text-6xl text-slate-400">
                  +
                </div>

                <div className="border-t px-4 py-4 text-center font-medium">
                  Upload New Material
                </div>
              </div>

              <div className="flex h-56 w-44 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="flex flex-1 items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-pink-100 text-4xl">
                    🎤
                  </div>
                </div>

                <div className="border-t px-4 py-4 font-medium">
                  Untitled Lecture
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => navigate(-1)}
              className="rounded-xl border border-slate-300 px-8 py-3 font-semibold"
            >
              Back
            </button>

            <button className="rounded-xl bg-blue-600 px-9 py-3 font-semibold text-white hover:bg-blue-700">
              Next
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
       {/* RIGHT PANEL */}

<div className="flex items-center justify-center bg-[#F7F8FC]">

  <div className="flex flex-col items-center">

    {/* Placeholder */}

    <div className="flex h-48 w-40 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white">

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="42"
        height="42"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="text-slate-400"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="13" y2="17"/>
      </svg>

      <p className="mt-5 text-sm text-slate-400">
        Select a material
      </p>

    </div>

    {/* Down Arrow */}

    <div className="my-8 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">

<div className="my-8 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
  <ChevronDown
    className="text-indigo-500"
    size={24}
    strokeWidth={2.5}
  />
</div>
    </div>

    {/* Preview Image */}

    <img
      src={preview2}
      alt="preview"
      className="w-[330px] rounded-3xl shadow-xl"
    />

  </div>

</div>
      </div>
    </div>
  );
}