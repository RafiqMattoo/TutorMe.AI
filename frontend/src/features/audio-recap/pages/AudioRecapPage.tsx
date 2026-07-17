import Header from "../components/Header";
import Breadcrumb from "../components/Breadcrumb";
import Toolbar from "../components/Toolbar";
import EmptyState from "../components/EmptyState";
// import NavigationTabs from "../components/NavigationTabs";

export default function AudioRecapPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Navigation Tabs (Uncomment if needed) */}
      {/* <NavigationTabs /> */}

      {/* Main Content */}
      <main className="px-8 pt-0">
        {/* Breadcrumb */}
        {/* <Breadcrumb /> */}

        {/* Toolbar */}
        <div className="mt-8">
          <Toolbar />
        </div>

        {/* Empty State */}
        <div className="flex min-h-[calc(100vh-320px)] items-center justify-center">
          <EmptyState />
        </div>
      </main>
    </div>
  );
}
