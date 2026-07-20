import { useState } from "react";

export default function NavigationTabs() {
  const [activeTab, setActiveTab] = useState("Audio Recaps");

  const tabs = [
    "Recaps",
    "Quizzes",
    "Flashcards",
    "AI Chat",
    "Video Recaps",
    "Audio Recaps",
  ];

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex h-14 items-center gap-8 px-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative h-full text-[15px] font-medium transition-colors ${
              activeTab === tab
                ? "text-[#2563EB]"
                : "text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            {tab}

            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-[#2563EB]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
