import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { BottomNav } from "./BottomNav";

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isProductDetail = location.pathname.startsWith('/product/');

  useEffect(() => {
    const expiresAt = localStorage.getItem('token_expires_at');
    if (expiresAt && new Date() > new Date(expiresAt)) {
      localStorage.removeItem('picpic_auth_token');
      localStorage.removeItem('picpic_user');
      localStorage.removeItem('token_expires_at');
      alert('Sesi kamu telah berakhir, silakan login kembali');
      navigate('/login');
    }
  }, [location.pathname]);

  return (
    <div className={`min-h-screen bg-[#F8F7FF] ${isProductDetail ? '' : 'pb-24'}`}>
      <div className="max-w-md mx-auto">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
