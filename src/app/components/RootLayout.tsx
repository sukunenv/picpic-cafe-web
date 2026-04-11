import { Outlet } from "react-router";
import { BottomNav } from "./BottomNav";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-[#F8F7FF] pb-16">
      <div className="max-w-md mx-auto">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
