import Breadcrumb from "../components/Breadcrumb";
import Header from "../components/Header";
import Toolbar from "../components/Toolbar";
import EmptyState from "../components/EmptyState";

export default function AudioRecapPage() {
  return (
    <div className="flex bg-white overflow-hidden">
      {/* Left Content */}
      <div className="flex flex-1 flex-col border-r border-[#E5E7EB]">
        {/* Top Breadcrumb */}
        <div className="px-8 pt-6">
          <Breadcrumb />
        </div>

        {/* Page Header */}
        <Header />

        {/* Toolbar */}
        <div className="px-8 pt-8">
          <Toolbar />
        </div>

        {/* Empty State */}
        <div className="flex flex-1 items-center justify-center px-8 pb-10 mt-10">
          <EmptyState />
        </div>
      </div>
    </div>
  );
}
