import { Clapperboard,Search,Grid2x2, List,X, FileText,  ChevronDown,} from "lucide-react";
import { useNavigate } from "react-router-dom";
import preview3 from "../../../public/images/preview3.jpeg";
import MaterialCard from "../components/CreateVideo/materialcard";
import UploadMaterialCard from "../components/CreateVideo/UploadMaterialCard";
import SearchBar from "../components/CreateVideo/SearchBar";

export default function SelectMaterialsPage() {
  const navigate = useNavigate();

  return (
    
      <div className="h-full overflow-hidden bg-white">

      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-slate-200 px-8">

        <div className="flex items-center gap-4">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50">
            <Clapperboard
              size={18}
              className="text-indigo-600"
            />
          </div>

          <h1 className="text-lg font-semibold text-slate-900">
            Create an Explainer Video
          </h1>

        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          <X size={16} />
          Exit
        </button>

      </header>

      {/* Main */}

      <div className="grid h-full grid-cols-[56%_44%] overflow-hidden">

        {/* LEFT */}

         <div className="flex h-full flex-col border-r border-slate-200 px-8 pt-6 pb-6">

          <div className="flex items-start justify-between gap-4">

            <div className="max-w-[300px]">

              <p className="text-sm font-medium text-indigo-600">
                Step 2 of 2
              </p>

              <h2 className="mt-2 text-[24px] font-semibold leading-8 text-slate-900">
                Select your  materials
              </h2>

              <p className="mt-3 text-[14px] leading-6 text-slate-500">
                Choose study materials from your library or upload a new
                document to generate an AI-powered explainer video.
              </p>

            </div>

            {/* Search */}

            <SearchBar/>
            {/* <div className="relative mt-1">

              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search..."
                className="h-10 w-60 rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-indigo-400"
              />

            </div> */}

          </div>

          {/* Toggle */}

          <div className="mt-3 flex justify-end gap-2">

            <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Grid2x2 size={16} />
            </button>

            <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <List size={16} />
            </button>

          </div>

          {/* Cards */}

          <div className="mt-2 flex gap-4">
            <UploadMaterialCard />
            <MaterialCard />
          </div>
                    {/* Bottom Buttons */}
          <div className="mt-2 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="rounded-xl border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Back
            </button>

            <button className="rounded-xl bg-blue-600 px-7 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700">
              Next
            </button>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="flex items-start justify-center bg-[#F7F8FC] pt-4">

          <div className="flex flex-col items-center">

            {/* Placeholder */}

            <div className="flex h-[160px] w-[150px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white">

              <FileText
                size={32}
                strokeWidth={1.7}
                className="text-slate-400"
              />

              <p className="mt-3 text-[13px] font-medium text-slate-400">
                Select a material
              </p>

            </div>

            {/* Arrow */}

            <div className="my-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">

              <ChevronDown
                size={18}
                className="text-indigo-600"
              />

            </div>

            {/* Preview */}

            <img
              src={preview3}
              alt="Preview"
              className="-mt-2 h-56 w-[250px] rounded-3xl object-cover shadow-lg"
            />

          </div>

        </div>

      </div>

    </div>
  );
}