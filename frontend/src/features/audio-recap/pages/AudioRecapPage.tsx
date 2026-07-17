import Header from "../components/Header";
import Breadcrumb from "../components/Breadcrumb";
import Toolbar from "../components/Toolbar";
import EmptyState from "../components/EmptyState";
// import NavigationTabs from "../components/NavigationTabs";

export default function AudioRecapPage() {
  return (
    <div className=" ">
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
        <div className="flex  items-center justify-center ">
          <EmptyState />
        </div>
      </main>
    </div>
  );
}
