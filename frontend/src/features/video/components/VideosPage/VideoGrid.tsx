import VideoCard from "../VideoDescriptionPage/VideoCard";
import { mockVideos } from "../../data/mockVideos";

const VideoGrid = () => {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-x-6
        gap-y-8
        sm:grid-cols-2
        lg:grid-cols-3
        2xl:grid-cols-4
      "
    >
      {mockVideos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};

export default VideoGrid;