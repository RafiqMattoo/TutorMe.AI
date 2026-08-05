import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Video } from "../../../../shared/types";

interface DescriptionCardProps {
  video: Video;
}

const DescriptionCard = ({ video }: DescriptionCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const isLongDescription = video.description.length > 280;

  return (
    <div className="rounded-3xl bg-[#F3F4F6] p-8 hover:bg-[#E5E7EB] transition-colors">
      <h2 className="mb-5 text-xl font-semibold text-[#23274D]">
        Description
      </h2>

      <p
        className={`text-[16px] leading-8 text-[#5B6475] transition-all ${
          expanded ? "" : "line-clamp-4"
        }`}
      >
        {video.description}
      </p>

      {isLongDescription && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-6 flex items-center gap-2 font-medium text-[#4F46E5] transition hover:text-[#4338CA]"
        >
          {expanded ? (
            <>
              <span className="text-black">Show Less</span>
             <ChevronUp size={18} className="text-black" />
            </>
          ) : (
            <>
              <span className="text-black">Show More</span>
           <ChevronUp size={18} className="text-black" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default DescriptionCard;