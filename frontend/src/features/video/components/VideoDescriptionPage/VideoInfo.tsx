import {
  Eye,
  ThumbsUp,
  ThumbsDown,
  Share2,
} from "lucide-react";
import { Video } from "../../../../shared/types";

interface VideoInfoProps {
  video: Video;
}

const VideoInfo = ({ video }: VideoInfoProps) => {
  return (
    <div className="space-y-5">
      {/* Title */}
    <h1 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-[#23274D] sm:text-[26px] md:text-[28px]">
  {video.title}
</h1>
      {/* Bottom Row */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <img
            src={
              video.authorAvatar ??
              "https://i.pravatar.cc/150?img=12"
            }
            alt={video.author}
            className="h-12 w-12 rounded-full object-cover"
          />

          <div>
            <h3 className="text-[17px] font-semibold text-[#23274D]">
              {video.author}
            </h3>

            <div className="mt-1 flex items-center gap-3 text-sm text-[#8A91A8]">
              <span>{video.createdAt}</span>

              <span className="h-1 w-1 rounded-full bg-gray-400" />

              <div className="flex items-center gap-1">
                <Eye size={15} />
                <span>{video.views}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Like/Dislike */}
          <div className="flex overflow-hidden rounded-full border border-gray-200 bg-white">
            <button className="flex items-center gap-2 px-5 py-3 transition hover:bg-gray-50">
              <ThumbsUp size={18} />
              <span className="text-sm font-medium">
  {video.likes ?? 0}
</span>
            </button>

            <div className="w-px bg-gray-200" />

            <button className="px-5 transition hover:bg-gray-50">
              <ThumbsDown size={18} />
            </button>
          </div>

          {/* Share */}
          <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 font-medium text-[#23274D] transition hover:bg-gray-50">
            <Share2 size={18} />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;