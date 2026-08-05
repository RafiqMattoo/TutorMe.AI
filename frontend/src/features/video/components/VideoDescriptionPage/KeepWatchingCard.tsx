import { Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Video } from "../../../../shared/types";

interface KeepWatchingCardProps {
  video: Video;
}

const KeepWatchingCard = ({ video }: KeepWatchingCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/video/${video.id}`)}
      className="flex cursor-pointer gap-3 rounded-2xl p-2 transition hover:bg-gray-50"
    >
      <img
        src={video.thumbnail}
        alt={video.title}
        className="h-20 w-32 rounded-xl object-cover"
      />

      <div className="flex flex-1 flex-col justify-between">
        <h3 className="line-clamp-2 text-sm font-semibold text-[#23274D]">
          {video.title}
        </h3>

        <p className="text-sm text-[#8A91A8]">
          {video.author}
        </p>

        <div className="flex items-center gap-1 text-xs text-[#8A91A8]">
          <Clock3 size={14} />
          <span>{video.duration}</span>
        </div>
      </div>
    </div>
  );
};

export default KeepWatchingCard;