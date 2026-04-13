import { Outlet, useLocation } from "react-router";
import { BottomNav } from "./BottomNav";

export function RootLayout() {
  const location = useLocation();
  const isProductDetail = location.pathname.startsWith('/product/');

  return (
    <div className={`min-h-screen bg-[#F8F7FF] ${isProductDetail ? '' : 'pb-16'}`}>
      <div className="max-w-md mx-auto">
        <Outlet />
      </div>
      {!isProductDetail && <BottomNav />}
    </div>
  );
}
