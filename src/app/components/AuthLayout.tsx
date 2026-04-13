import { Outlet } from "react-router";

/**
 * Minimal layout for auth screens (Login / Register).
 * No BottomNav, no extra padding — just constrained width and solid background.
 */
export function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#F8F7FF]">
      <Outlet />
    </div>
  );
}
