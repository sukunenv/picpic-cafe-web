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
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="relative w-full">
      {/* The Card */}
      <motion.div
        initial={{ rotateY: -10, rotateX: 5 }}
        whileHover={{ rotateY: 0, rotateX: 0, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative w-full aspect-[1.586/1] rounded-3xl overflow-hidden shadow-2xl"
        style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
        onClick={() => setShowQR(true)}
      >
        {/* Main Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`} />

        {/* Decorative Patterns */}
        <div className="absolute inset-0 opacity-30">
          <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${config.bgPattern} rounded-full blur-3xl`} />
          <div className={`absolute -left-16 -bottom-16 w-48 h-48 bg-gradient-to-br ${config.bgPattern} rounded-full blur-2xl`} />
          <div className={`absolute right-10 bottom-10 w-32 h-32 bg-gradient-to-br ${config.bgPattern} rounded-full blur-xl`} />
        </div>

        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)`
        }} />

        {/* Auto Shine Effect */}
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
          className={`absolute inset-0 bg-gradient-to-r ${config.shine} opacity-30 -skew-x-12`}
        />

        {/* Card Content */}
        <div className="relative h-full p-4 md:p-6 flex flex-col justify-between">
          {/* Top Section */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <img src={logo} alt="PICPIC" className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-cover" />
              </div>
              <div>
                <p className={`${config.textColor} font-bold text-xs md:text-sm opacity-90`}>PICPIC</p>
                <p className={`${config.textColor} text-[10px] md:text-xs opacity-70`}>Member Card</p>
              </div>
            </div>
            <div className={`bg-gradient-to-r ${config.accentGradient} px-3 md:px-4 py-1.5 md:py-2 rounded-full flex items-center gap-1.5 md:gap-2 shadow-lg`}>
              <Icon size={14} className={config.textColor} />
              <span className={`${config.textColor} font-bold text-[10px] md:text-sm`}>{config.name.split(" ")[0]}</span>
            </div>
          </div>

          {/* Middle Section - Points */}
          <div className="py-2 md:py-4">
            <p className={`${config.textColor} text-[10px] md:text-xs opacity-80 mb-0.5 md:mb-1 font-medium`}>Total Points</p>
            <div className="flex items-baseline gap-1.5 md:gap-2">
              <span className={`${config.textColor} font-black text-4xl md:text-5xl tracking-tight`}>
                {points.toLocaleString("id-ID")}
              </span>
              <span className={`${config.textColor} text-sm md:text-lg opacity-80`}>pts</span>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex items-end justify-between">
            <div>
              <p className={`${config.textColor} text-[8px] md:text-xs opacity-70 mb-0.5 md:mb-1`}>Card Number</p>
              <p className={`${config.textColor} font-mono text-[10px] md:text-sm font-semibold tracking-wider`}>
                {cardNumber}
              </p>
            </div>
            <div className="text-right">
              <p className={`${config.textColor} text-[8px] md:text-xs opacity-70 mb-0.5 md:mb-1`}>Member Since</p>
              <p className={`${config.textColor} font-semibold text-[10px] md:text-sm`}>{memberSince}</p>
            </div>
          </div>
        </div>

        {/* Holographic Edge Glow */}
        <div className="absolute inset-0 rounded-3xl border border-white/10 md:border-2 md:border-white/20" />
      </motion.div>

      {/* QR Code Overlay - Tap to Show / Tap to Close */}
      {showQR && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowQR(false)}
          className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="bg-white p-4 rounded-2xl shadow-2xl relative overflow-hidden"
          >
            {/* Laser Line */}
            <motion.div
              animate={{ top: ["5%", "95%", "5%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute left-[8%] right-[8%] h-[2px] bg-green-500 shadow-[0_0_8px_#22c55e] z-10 rounded-full"
            />
            <svg className="h-24 w-24 fill-black" viewBox="0 0 24 24">
              <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 15h6v6H3v-6zm2 2v2h2v-2H5zm10 0h2v2h-2v-2zm2-2h2v2h-2v-2zm0 4h2v2h-2v-2zm-2 2h2v-2h-2v2zm2-6h2v-2h-2v2zm-2-4h2V7h-2V5zm-2 4h2V7h-2V5zm-2 4h2V7h-2V5zM7 7h1v1H7V7zm10 0h1v1h-1V7zm-10 10h1v1H7v-1z" />
              <path d="M11 11h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm2-2h2v2h-2v-2zm0-4h2v2h-2V9zm2 2h2v2h-2v-2zm-4-4h2v2h-2V7zm2 2h2v2h-2V9z" />
            </svg>
          </motion.div>
          <p className="text-white/70 text-xs font-medium mt-3">Tap untuk menutup</p>
        </motion.div>
      )}
    </div>
  );
}
