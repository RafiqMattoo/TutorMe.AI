import { Plus } from "lucide-react";

export default function UploadMaterialCard() {
  return (
    <div className="flex h-[180px] w-[170px] cursor-pointer flex-col overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-white transition-all duration-200 hover:border-blue-500 hover:shadow-sm">

      {/* Icon */}
      <div className="flex flex-1 items-center justify-center">

        <Plus
          size={40}
          strokeWidth={1.6}
          className="text-slate-400"
        />

      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 px-4 py-3">

        <p className="text-center text-[13px] font-medium text-slate-700">
          Upload New Material
        </p>

      </div>

    </div>
  );
}