import { Home, UtensilsCrossed, ShoppingCart, User } from "lucide-react";
import { Link, useLocation } from "react-router";

export function BottomNav() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/menu", icon: UtensilsCrossed, label: "Menu" },
    { path: "/cart", icon: ShoppingCart, label: "Cart" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl border-t border-[#6367FF]/10 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0,05)]">
      <div className="max-w-md mx-auto flex justify-around items-center h-20 px-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-label={`Buka halaman ${item.label}`}
              className={`flex flex-col items-center justify-center gap-1.5 transition-all relative ${
                active ? "text-[#6367FF]" : "text-[#717182]"
              }`}
            >
              {active && (
                <div className="absolute -top-5 w-12 h-1 bg-gradient-to-r from-[#6367FF] to-[#8494FF] rounded-full" />
              )}
              <div className={`p-2.5 rounded-2xl transition-all ${
                active ? "bg-gradient-to-br from-[#C9BEFF]/30 to-[#FFDBFD]/30 scale-110" : ""
              }`}>
                <Icon size={24} strokeWidth={active ? 2.5 : 2} />
              </div>
              <span className={`text-xs ${active ? "font-bold" : "font-medium"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}