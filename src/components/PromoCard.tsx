import React from 'react';

export default function PromoCard() {
  return (
    <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-5 mx-6 text-white shadow-lg overflow-hidden relative">
      {/* Decorative circles */}
      <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 bg-accent/20 rounded-full blur-xl"></div>
      
      <div className="relative z-10">
        <span className="inline-block bg-accent text-primary text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-[0_4px_10px_rgba(255,219,253,0.3)]">
          Promo Hari Ini
        </span>
        <h3 className="text-2xl font-bold mb-1 tracking-tight">Buy 1 Get 1 Free</h3>
        <p className="text-lavender text-sm mb-4 font-medium">Semua minuman coffee</p>
        <button className="bg-white text-primary font-bold py-2.5 px-5 rounded-full text-sm hover:bg-app-bg transition-colors shadow-md active:scale-95">
          Pesan Sekarang
        </button>
      </div>
      
      {/* Illustration placeholder */}
      <div className="absolute bottom-0 right-[-10px] w-32 h-32 opacity-20 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="40" />
        </svg>
      </div>
    </div>
  );
}
