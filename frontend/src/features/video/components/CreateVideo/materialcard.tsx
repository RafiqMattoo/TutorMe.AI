import { Mic } from "lucide-react";

export default function MaterialCard() {
  return (
    <div className="flex h-[165px] w-[160px] cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-md">

      {/* Icon */}
      <div className="flex flex-1 items-center justify-center">

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">

          <Mic
            size={28}
            className="text-pink-500"
          />

        </div>

      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 px-4 py-3">

        <p className="truncate text-[13px] font-medium text-slate-700">
          Untitled Lecture
        </p>

      </div>

    </div>
  );
}