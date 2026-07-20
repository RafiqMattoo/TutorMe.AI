import { Eye } from "lucide-react";
import { Video } from "../../../../shared/types";
import { useNavigate } from "react-router-dom";

// export interface Video {
//   id: string;
//   title: string;
//   author: string;
//   thumbnail: string;
//   views: string;
//   createdAt: string;
// }

interface VideoCardProps {
  video: Video;
}

const VideoCard = ({ video }: VideoCardProps) => {
  const navigate = useNavigate();
  return (
    <div
      className="group cursor-pointer"
      onClick={() => navigate(`/video/${video.id}`)}
    >
      {/* Thumbnail */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="aspect-video w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="mt-4">
        <h3
  className="
mt-3
line-clamp-1
text-[18px]
font-semibold
leading-6
tracking-normal
text-[#23274D]
"
        >
          {video.title}
        </h3>

        <p
          className="
mt-1
text-[15px]
font-normal
text-[#8A91A8]
"
        >
          {video.author}
        </p>

        <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
          <span>{video.createdAt}</span>

          <span>•</span>

          <Eye size={15} />

          <span>{video.views}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
