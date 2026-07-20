import Header from "../components/VideosPage/Header";
import Toolbar from "../components/VideosPage/Toolbar";
import VideoGrid from "../components/VideosPage/VideoGrid";

const VideosPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
        <Header />

        <div className="mt-6 sm:mt-8">
          <Toolbar />
        </div>

        <div className="mt-6 sm:mt-8">
          <VideoGrid />
        </div>
      </div>
    </div>
  );
};

export default VideosPage;