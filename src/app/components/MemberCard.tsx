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

export function MemberCard({
  tier,
  points,
  memberSince = "Jan 2026",
  cardNumber = "4532 8976 1234",
}: MemberCardProps) {
  const config = tierConfig[tier] || tierConfig.bronze;
  const Icon = config.icon;

  // isTapped: mobile "hover" equivalent — toggle on tap
  const [isTapped, setIsTapped] = useState(false);

  // active = hovered (desktop) OR tapped (mobile)
  // We can't detect hover in JSX state, but whileHover handles desktop.
  // isTapped handles mobile.

  return (
    <motion.div
      // Default: slightly tilted for premium 3D feel
      initial={{ rotateY: -8, rotateX: 4 }}
      // Desktop hover: flatten + lift
      whileHover={{ rotateY: 0, rotateX: 0, scale: 1.02 }}
      // Mobile tap: same flatten effect via animate
      animate={
        isTapped
          ? { rotateY: 0, rotateX: 0, scale: 1.02 }
          : { rotateY: -8, rotateX: 4, scale: 1 }
      }
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="relative w-full rounded-3xl overflow-hidden shadow-2xl cursor-pointer select-none"
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
      onClick={() => setIsTapped((v) => !v)}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`} />

      {/* Decorative Blobs */}
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${config.bgPattern} rounded-full blur-3xl`} />
        <div className={`absolute -left-16 -bottom-16 w-48 h-48 bg-gradient-to-br ${config.bgPattern} rounded-full blur-2xl`} />
        <div className={`absolute right-10 bottom-10 w-32 h-32 bg-gradient-to-br ${config.bgPattern} rounded-full blur-xl`} />
      </div>

      {/* Radial Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)
          `,
        }}
      />

      {/* Auto-Shimmer (always running) */}
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
        className={`absolute inset-0 bg-gradient-to-r ${config.shine} opacity-30 -skew-x-12 pointer-events-none`}
      />

      {/* ── Card Content ── */}
      <div className="relative z-10 p-4 md:p-6 flex flex-col gap-3">

        {/* Row 1: Logo + Tier badge + QR */}
        <div className="flex items-start justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
              <img src={logo} alt="PICPIC" className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-cover" />
            </div>
            <div>
              <p className={`${config.textColor} font-bold text-xs md:text-sm leading-tight opacity-90`}>PICPIC</p>
              <p className={`${config.textColor} text-[10px] md:text-xs leading-tight opacity-70`}>Member Card</p>
            </div>
          </div>

          {/* Right: Tier badge + QR code */}
          <div className="flex flex-col items-end gap-2">
            {/* Tier Badge */}
            <div className={`bg-gradient-to-r ${config.accentGradient} px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg`}>
              <Icon size={12} className={config.textColor} />
              <span className={`${config.textColor} font-bold text-[10px] md:text-xs`}>
                {config.name.split(" ")[0]}
              </span>
            </div>

            {/* QR Code — always visible, glows on hover/tap */}
            <div
              className={`
                p-1.5 rounded-xl border transition-all duration-500
                ${isTapped
                  ? "bg-white/30 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                  : "bg-white/10 border-white/20"
                }
              `}
              style={{
                // Also react to CSS hover (desktop)
              }}
            >
              <svg
                className={`
                  h-9 w-9 md:h-11 md:w-11 fill-current transition-all duration-500
                  ${config.textColor}
                  ${isTapped ? "opacity-100 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" : "opacity-50"}
                `}
                viewBox="0 0 24 24"
              >
                <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 15h6v6H3v-6zm2 2v2h2v-2H5zm10 0h2v2h-2v-2zm2-2h2v2h-2v-2zm0 4h2v2h-2v-2zm-2 2h2v-2h-2v2zm2-6h2v-2h-2v2zm-2-4h2V7h-2V5zm-2 4h2V7h-2V5zm-2 4h2V7h-2V5zM7 7h1v1H7V7zm10 0h1v1h-1V7zm-10 10h1v1H7v-1z" />
                <path d="M11 11h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm2-2h2v2h-2v-2zm0-4h2v2h-2V9zm2 2h2v2h-2v-2zm-4-4h2v2h-2V7zm2 2h2v2h-2V9z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Row 2: Total Points */}
        <div className="mt-1">
          <p className={`${config.textColor} text-[10px] md:text-xs opacity-70 font-medium mb-0.5`}>Total Points</p>
          <div className="flex items-baseline gap-1.5">
            <span className={`${config.textColor} font-black text-4xl md:text-5xl tracking-tight leading-none`}>
              {points.toLocaleString("id-ID")}
            </span>
            <span className={`${config.textColor} text-sm md:text-base font-bold opacity-70`}>pts</span>
          </div>
        </div>

        {/* Row 3: Card Number + Member Since */}
        <div className="flex items-end justify-between mt-1 pt-3 border-t border-white/15">
          <div>
            <p className={`${config.textColor} text-[8px] md:text-[10px] opacity-60 font-medium mb-0.5`}>Card Number</p>
            <p className={`${config.textColor} font-mono text-[10px] md:text-sm font-semibold tracking-wider`}>
              {cardNumber}
            </p>
          </div>
          <div className="text-right">
            <p className={`${config.textColor} text-[8px] md:text-[10px] opacity-60 font-medium mb-0.5`}>Member Since</p>
            <p className={`${config.textColor} font-semibold text-[10px] md:text-sm`}>{memberSince}</p>
          </div>
        </div>

      </div>

      {/* Edge Glow */}
      <div className="absolute inset-0 rounded-3xl border border-white/15 pointer-events-none" />
    </motion.div>
  );
}
