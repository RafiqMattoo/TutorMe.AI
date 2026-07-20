import { Mic } from "lucide-react";

export default function MaterialCard() {
  return (
    <div className="flex h-60 w-44 cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-lg">

      <div className="flex flex-1 items-center justify-center">

        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">

          <Mic
            className="text-red-500"
            size={34}
          />

        </div>

      </div>

      <div className="border-t border-slate-200 px-4 py-4">

        <p className="truncate text-sm font-semibold text-slate-800">
          Untitled Lecture
        </p>

      </div>

    </div>
  );
}