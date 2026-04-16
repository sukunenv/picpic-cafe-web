import { Navigate, useLocation } from "react-router";
import { isAuthenticated } from "../../lib/auth";

/**
 * Guard untuk halaman yang butuh login.
 * Jika belum login → redirect ke /login dengan menyimpan path asal
 * agar setelah login bisa balik ke halaman yg diminta.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
