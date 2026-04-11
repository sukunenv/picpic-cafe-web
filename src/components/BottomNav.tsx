'use client';

import { Home, Coffee, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Menu', path: '/menu', icon: Coffee },
    { name: 'Cart', path: '/cart', icon: ShoppingCart },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 w-full max-w-[430px] bg-white border-t border-gray-100 flex justify-around items-center py-3 px-6 z-50 rounded-t-2xl shadow-[0_-5px_15px_-10px_rgba(0,0,0,0.1)]">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.name} 
            href={item.path}
            className={`flex flex-col items-center justify-center gap-1 w-16 transition-all ${
              isActive ? 'text-primary scale-110' : 'text-gray-400 hover:text-secondary'
            }`}
          >
            <Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-gray-400'}`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
