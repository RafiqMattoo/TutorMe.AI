import MasterTopicCard from "./MasterTopicCard";
import { masterTopics } from "../../data/masterTopics";
 import { Grid2X2 } from "lucide-react";

const MasterTopic = () => {
  return (
    <div className="rounded-3xl border border-gray-100 bg-[#F9FAFB] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#23274D]">
          Master This Topic
        </h2>

        {/* <button className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
          View All

          <ChevronRight size={16} />
        </button> */}
      
      </div>

      <div className="space-y-4">
        {masterTopics.map((topic) => (
          <MasterTopicCard
            key={topic.id}
            title={topic.title}
            subtitle={topic.subtitle}
            thumbnail={topic.thumbnail} 

          />
        ))}
      </div>
    </div>
  );
};

export default MasterTopic;