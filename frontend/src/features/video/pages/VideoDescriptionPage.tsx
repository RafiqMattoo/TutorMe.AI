import { useParams } from "react-router-dom";
import { mockVideos } from "../data/mockVideos";
import KeepWatching from "../components/VideoDescriptionPage/KeepWatching ";
import MasterTopic from "../components/VideoDescriptionPage/MasterTopic";
import DescriptionCard from "../components/VideoDescriptionPage/DescriptionCard";
import VideoInfo from "../components/VideoDescriptionPage/VideoInfo";
import VideoPlayer from "../components/VideoDescriptionPage/VideoPlayer";
import { Grid2X2 } from "lucide-react";

export default function VideoDescriptionPage() {
  const { id } = useParams<{ id: string }>();

  const video = mockVideos.find((item) => item.id === id);

  if (!video) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <h2 className="text-xl font-semibold">Video not found</h2>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-6">
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[2fr_420px]">
        {/* Left */}
        <div className="space-y-6">
          <VideoPlayer video={video} />
          <VideoInfo video={video} />
          <DescriptionCard video={video} />
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-8">
          <MasterTopic/>

<button
  className="
    mt-4
    flex
    h-11
    w-full
    items-center
    justify-center
    gap-2
    rounded-xl
    bg-[#F3F4F6]
    text-[15px]
    font-medium
    text-[#111827]
    transition-colors
    hover:bg-[#E5E7EB]
  "
>
  <Grid2X2 size={18} />
  View All
</button>
          <KeepWatching currentVideoId={video.id} />
        </aside>
      </div>
    </div>
  );
}