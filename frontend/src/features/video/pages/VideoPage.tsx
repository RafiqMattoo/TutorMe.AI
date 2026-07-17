import Header from "../components/Header";
import Toolbar from "../components/Toolbar";
import VideoGrid from "../components/VideoGrid";


const VideosPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
  <div className="mx-auto max-w-[1440px] px-8 py-8">
    <Header />
    <Toolbar />
    <VideoGrid />
  </div>
</div>
  );
};

export default VideosPage;