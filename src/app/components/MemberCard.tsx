import { useState } from "react";
import { motion } from "motion/react";
import { Award, Star, Crown } from "lucide-react";
import logo from "figma:asset/c67b6433ddedf46738312a77f1fae7b733129f87.png";

type TierType = "bronze" | "silver" | "gold";

interface MemberCardProps {
  tier: TierType;
  points: number;
  memberSince?: string;
  cardNumber?: string;
}

const tierConfig = {
  bronze: {
    name: "Bronze Member",
    gradient: "from-[#CD7F32] via-[#B87333] to-[#8B4513]",
    accentGradient: "from-[#FFB347] to-[#CD7F32]",
    icon: Star,
    bgPattern: "from-[#CD7F32]/20 to-transparent",
    textColor: "text-white",
    shine: "from-white/40 via-white/10 to-transparent",
  },
  silver: {
    name: "Silver Member",
    gradient: "from-[#C0C0C0] via-[#A8A8A8] to-[#808080]",
    accentGradient: "from-[#E8E8E8] to-[#C0C0C0]",
    icon: Award,
    bgPattern: "from-[#C0C0C0]/20 to-transparent",
    textColor: "text-white",
    shine: "from-white/60 via-white/20 to-transparent",
  },
  gold: {
    name: "Gold Member",
    gradient: "from-[#FFD700] via-[#FFA500] to-[#FF8C00]",
    accentGradient: "from-[#FFED4E] to-[#FFD700]",
    icon: Crown,
    bgPattern: "from-[#FFD700]/30 to-transparent",
    textColor: "text-[#8B4513]",
    shine: "from-white/70 via-white/30 to-transparent",
  },
};
export function MemberCard({ tier, points, memberSince = "Jan 2026", cardNumber = "4532 8976 1234" }: MemberCardProps) {
  const config = tierConfig[tier] || tierConfig.bronze;
  const Icon = config.icon;
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left;
    const y = e.clientY - card.top;
    const centerX = card.width / 2;
    const centerY = card.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const card = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - card.left;
    const y = touch.clientY - card.top;
    const centerX = card.width / 2;
    const centerY = card.height / 2;
    const rotateX = (y - centerY) / 8; // Slightly more sensitive on touch
    const rotateY = (centerX - x) / 8;
    setRotate({ x: rotateX, y: rotateY });
  };

  const resetRotate = () => setRotate({ x: 0, y: 0 });

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={resetRotate}
      onTouchMove={handleTouchMove}
      onTouchEnd={resetRotate}
      animate={{ 
        rotateX: rotate.x, 
        rotateY: rotate.y,
        scale: rotate.x !== 0 ? 1.02 : 1 
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="relative w-full aspect-[1.586/1] rounded-[24px] md:rounded-3xl overflow-hidden shadow-2xl cursor-pointer z-50 pointer-events-auto group touch-none"
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
    >
      {/* Main Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`} />

      {/* Decorative Patterns */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className={`absolute -right-16 md:-right-20 -top-16 md:-top-20 w-48 md:w-64 h-48 md:h-64 bg-gradient-to-br ${config.bgPattern} rounded-full blur-2xl md:blur-3xl`} />
        <div className={`absolute -left-12 md:-left-16 -bottom-12 md:-bottom-16 w-36 md:w-48 h-36 md:h-48 bg-gradient-to-br ${config.bgPattern} rounded-full blur-xl md:blur-2xl`} />
      </div>

      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-40 md:opacity-100" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                         radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)`
      }} />

      {/* Shine Effect */}
      <motion.div
        animate={{ x: rotate.x !== 0 ? ["-100%", "200%"] : "-100%" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className={`absolute inset-0 bg-gradient-to-r ${config.shine} opacity-20 md:opacity-30 -skew-x-12 pointer-events-none`}
      />

      {/* Card Content */}
      <div className="relative h-full p-4 md:p-6 flex flex-col justify-between select-none">
        {/* Top Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-9 h-9 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-lg md:rounded-xl flex items-center justify-center border border-white/10">
              <img src={logo} alt="PICPIC" className="w-7 h-7 md:w-10 md:h-10 rounded-md md:rounded-lg object-cover" />
            </div>
            <div>
              <p className={`${config.textColor} font-black text-[10px] md:text-sm opacity-90 tracking-tight`}>PICPIC</p>
              <p className={`${config.textColor} text-[8px] md:text-xs font-bold opacity-60 tracking-wider`}>Member Card</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2 md:gap-3">
            <div className={`bg-gradient-to-r ${config.accentGradient} px-2.5 md:px-4 py-1 md:py-2 rounded-full flex items-center gap-1 md:gap-2 shadow-lg border border-white/10`}>
              <Icon size={12} className={config.textColor} />
              <span className={`${config.textColor} font-black text-[9px] md:text-sm tracking-tight`}>{config.name.split(" ")[0]}</span>
            </div>
            
            {/* QR Code Section */}
            <div className="opacity-40 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">
              <div className="p-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-lg group-hover:bg-white/20 transition-all">
                <svg className={`h-7 w-7 md:h-10 md:w-10 fill-current ${config.textColor}`} viewBox="0 0 24 24">
                  <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 15h6v6H3v-6zm2 2v2h2v-2H5zm10 0h2v2h-2v-2zm2-2h2v2h-2v-2zm0 4h2v2h-2v-2zm-2 2h2v-2h-2v2zm2-6h2v-2h-2v2zm-2-4h2V7h-2V5zm-2 4h2V7h-2V5zm-2 4h2V7h-2V5zM7 7h1v1H7V7zm10 0h1v1h-1V7zm-10 10h1v1H7v-1z" />
                  <path d="M11 11h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm2-2h2v2h-2v-2zm0-4h2v2h-2V9zm2 2h2v2h-2v-2zm-4-4h2v2h-2V7zm2 2h2v2h-2V9z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section - Points */}
        <div className="translate-y-[-5%] md:translate-y-[-10%]">
          <p className={`${config.textColor} text-[9px] md:text-xs opacity-70 mb-0.5 md:mb-1.5 font-bold tracking-widest uppercase`}>Total Points</p>
          <div className="flex items-baseline gap-1 md:gap-2">
            <span className={`${config.textColor} font-black text-4xl md:text-6xl tracking-tighter leading-none`}>
              {points.toLocaleString("id-ID")}
            </span>
            <span className={`${config.textColor} text-sm md:text-xl font-black opacity-60`}>pts</span>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex items-end justify-between">
          <div className="space-y-0.5 md:space-y-1">
            <p className={`${config.textColor} text-[8px] md:text-[10px] opacity-60 font-bold uppercase tracking-wider`}>Card Number</p>
            <p className={`${config.textColor} font-mono text-[10px] md:text-[15px] font-black tracking-widest leading-none`}>
              {cardNumber}
            </p>
          </div>
          <div className="text-right space-y-0.5 md:space-y-1">
            <p className={`${config.textColor} text-[8px] md:text-[10px] opacity-60 font-bold uppercase tracking-wider`}>Member Since</p>
            <p className={`${config.textColor} font-black text-xs md:text-base leading-none`}>{memberSince}</p>
          </div>
        </div>
      </div>

      {/* Holographic Edge Glow */}
      <div className="absolute inset-0 rounded-[24px] md:rounded-3xl border border-white/10 md:border-2 md:border-white/20 pointer-events-none" />
    </motion.div>
  );
}
