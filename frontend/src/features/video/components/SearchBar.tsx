import { ChevronDown, FileText } from "lucide-react";

export default function PreviewPanel() {
  return (
    <div className="flex h-full flex-col items-center justify-center border-l border-slate-200 bg-[#F8FAFC]">

      {/* Placeholder */}

      <div className="flex h-48 w-40 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300">

        <FileText
          size={42}
          className="text-slate-300"
        />

        <p className="mt-4 text-sm text-slate-400">
          Select a material
        </p>

      </div>

      {/* Arrow */}

      <div className="my-8 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">

        <ChevronDown
          size={22}
          className="text-indigo-600"
        />

      </div>

      {/* Preview */}

      <img
        src="/images/preview3.jpeg"
        alt="preview"
        className="w-[420px] rounded-3xl shadow-xl"
      />

    </div>
  );
}