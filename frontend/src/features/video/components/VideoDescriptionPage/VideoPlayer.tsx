import { Video } from "../../../../shared/types";

interface VideoPlayerProps {
  video: Video;
}

const VideoPlayer = ({ video }: VideoPlayerProps) => {
  return (
    <div className="overflow-hidden rounded-3xl bg-black shadow-sm">
      <div className="aspect-video w-full">
        {video.videoUrl ? (
         <iframe
  className="aspect-video w-full"
  src={video.videoUrl}
  allowFullScreen
  title={video.title}
/>
        ) : (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;