import { Plus } from "lucide-react";

export default function UploadMaterialCard() {
  return (
    <div className="flex h-60 w-44 cursor-pointer flex-col overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-white transition hover:border-blue-500">

      <div className="flex flex-1 items-center justify-center">

        <Plus
          size={54}
          strokeWidth={1.5}
          className="text-slate-400"
        />

      </div>

      <div className="border-t border-slate-200 px-4 py-4">

        <p className="text-sm font-medium text-slate-700">
          Upload New Material
        </p>

      </div>

    </div>
  );
}