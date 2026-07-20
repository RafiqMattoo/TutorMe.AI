import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clapperboard, X, FileText, Sparkles } from "lucide-react";

import VideoPreview from "./VideoPreview";
import CreateOptionCard from "./CreateoptionCard";

export default function CreateVideoPage() {
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState<
    "materials" | "topic" | null
  >(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50">
            <Clapperboard className="text-indigo-600" size={22} />
          </div>

          <h2 className="text-3xl font-bold text-slate-900">
            Create an Explainer Video
          </h2>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2 font-medium text-slate-700 hover:bg-slate-50"
        >
          <X size={18} />
          Exit
        </button>
      </header>

      {/* Body */}
      <div className="grid min-h-[calc(100vh-85px)] grid-cols-1 lg:grid-cols-2">
        {/* Left */}
        <div className="px-16 py-14">
          <h3 className="max-w-xl text-2xl font-bold leading-tight text-slate-900">
            How would you like to create your Explainer Video?
          </h3>

          <p className="mt-5 max-w-lg text-lg text-slate-500">
            Choose one of the options below to generate an AI-powered
            explainer video from your learning content.
          </p>

          <div className="mt-14 flex flex-wrap gap-8">
            <CreateOptionCard
              icon={<FileText size={30} />}
              title="From Materials"
              description="Upload PDFs, notes or documents and transform them into engaging explainer videos."
              selected={selectedOption === "materials"}
            //   onClick={() => setSelectedOption("materials")}
            onClick={() => navigate("/video/materials")}
            />

            <CreateOptionCard
              icon={<Sparkles size={30} />}
              title="From Topic"
              description="Type any topic and let AI automatically generate a complete educational explainer video."
              selected={selectedOption === "topic"}
              onClick={() => setSelectedOption("topic")}
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center justify-center bg-slate-50 p-10">
          <VideoPreview />
        </div>
      </div>
    </div>
  );
}