import { useState } from "react";

const categories = ["All", "Classic", "Animated"];

const CategoryTabs = () => {
  const [activeTab, setActiveTab] = useState("Animated");

  return (
    <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {categories.map((category, index) => (
        <button
          key={category}
          onClick={() => setActiveTab(category)}
   className={`
  flex
  h-10
  items-center
  px-5
  text-[14px]
  font-medium
  transition-all
  duration-200
  ${
    index !== categories.length - 1
      ? "border-r border-slate-200"
      : ""
  }
  ${
    activeTab === category
      ? "bg-slate-100 text-slate-900"
      : "bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100"
  }
`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;