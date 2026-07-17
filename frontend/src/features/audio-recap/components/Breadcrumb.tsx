import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  studySet?: string;
}

export default function Breadcrumb({
  studySet = "My First Study Set",
}: BreadcrumbProps) {
  return (
    <div className="mb-8 flex items-center gap-2 text-[15px]">
      <button className="font-medium text-[#2563EB] transition hover:text-[#1D4ED8] hover:underline">
        {studySet}
      </button>

      <ChevronRight size={16} className="text-[#9CA3AF]" strokeWidth={2} />

      <span className="font-medium text-[#6B7280]">Audio Recap List</span>
    </div>
  );
}
