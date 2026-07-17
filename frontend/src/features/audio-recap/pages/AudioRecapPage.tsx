import Header from "../components/Header";
import Toolbar from "../components/Toolbar";
import EmptyState from "../components/EmptyState";

export default function AudioRecapPage() {
  return (
    <div className=" flex flex-col bg-white overflow-hidden bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-8 pt-0 overflow-hidden">
        {/* Toolbar */}
        <div className="mt-8 shrink-0">
          <Toolbar />
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center">
          <EmptyState />
        </div>
      </main>
    </div>
  );
}
