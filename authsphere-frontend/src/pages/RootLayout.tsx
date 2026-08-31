import { Outlet } from "react-router";
import Navbar from "@/components/Navbar";

function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Public Navbar */}
      <Navbar />

      {/* Public Page */}
      <main>
        <Outlet />
      </main>

    </div>
  );
}

export default RootLayout;