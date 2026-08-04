import KeepWatchingCard from "./KeepWatchingCard";
import { mockVideos } from "../../data/mockVideos";

interface KeepWatchingProps {
  currentVideoId?: string;
}

const KeepWatching = ({ currentVideoId }: KeepWatchingProps) => {
  const videos = mockVideos.filter(
    (video) => video.id !== currentVideoId
  );

  return (
    <div className="rounded-3xl border border-gray-100 bg-[#F9FAFB] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#23274D]">
          Keep Watching
        </h2>

      
      </div>

      <div className="space-y-4">
        {videos.slice(0, 5).map((video) => (
          <KeepWatchingCard
            key={video.id}
            video={video}
          />
        ))}
      </div>
    </div>
  );
};

export default KeepWatching;