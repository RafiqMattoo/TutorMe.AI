import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clapperboard, X, FileText, Sparkles } from "lucide-react";

import VideoPreview from "../components/CreateVideo/VideoPreview";
import CreateOptionCard from "../components/CreateVideo/CreateoptionCard";

export default function CreateVideoPage() {
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState<
    "materials" | "topic" | null
  >(null);

  return (

   <div className="grid h-[calc(100vh-76px)] grid-cols-2 ">
  {/* Left */}
  <div className="px-14 pt-12">
    <div className="max-w-[430px]">
      <h3 className="text-[32px] font-semibold leading-[1.15] text-slate-900">
        How would you like to create your Explainer Video?
      </h3>

      <p className="mt-2 text-[15px] leading-2 text-slate-500">
        Choose one of the options below to generate an AI-powered explainer
        video from your learning content.
      </p>

      <div className="mt-14 flex gap-5">
        <CreateOptionCard
          icon={<FileText size={28} />}
          title="From Materials"
          // description="Upload PDFs, notes or documents and transform them into engaging explainer videos."
          // selected={selectedOption === "materials"}
          onClick={() => navigate("/video/materials")}
        />

        <CreateOptionCard
          icon={<Sparkles size={28} />}
          title="From Topic"
          // description="Type any topic and let AI automatically generate a complete educational explainer video."
          selected={selectedOption === "topic"}
          onClick={() => setSelectedOption("topic")}
        />
      </div>
    </div>
  </div>

  {/* Right */}
  <div className="relative border-l border-slate-200 bg-slate-50">
    <VideoPreview />
  </div>
</div>
  );
}