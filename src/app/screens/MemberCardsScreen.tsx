import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Gift } from "lucide-react";
import { Link } from "react-router";
import api from "../../lib/api";
import { MemberCard } from "../components/MemberCard";

export function MemberCardsScreen() {
  const [loyaltySettings, setLoyaltySettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLoyaltySettings();
  }, []);

  const fetchLoyaltySettings = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/settings/loyalty');
      setLoyaltySettings(res.data);
    } catch (err) {
      console.error("Error fetching loyalty settings", err);
    } finally {
      setIsLoading(false);
    }
  };

  const parseBenefits = (benefitsString: string) => {
    if (!benefitsString) return [];
    return benefitsString.split('\n').filter(b => b.trim() !== '');
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F8F7FF]">
        <div className="w-10 h-10 border-4 border-[#6367FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7FF] pb-12">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 border-b border-[#2D2B55]/5">
        <div className="px-6 pt-12 pb-4">
          <div className="flex items-center gap-4">
            <Link to="/profile" className="p-2 hover:bg-[#F8F7FF] rounded-xl transition-all active:scale-95">
              <ArrowLeft className="text-[#2D2B55]" size={24} />
            </Link>
            <h1 className="text-[#2D2B55] font-black text-2xl tracking-tight">Member Cards</h1>
          </div>
        </div>
      </div>

      <div className="px-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h2 className="text-[#2D2B55] font-black text-xl mb-2 tracking-tight">Tier Membership PICPIC</h2>
          <p className="text-[#2D2B55]/50 text-xs font-bold uppercase tracking-widest">
            Kumpulkan poin untuk naik level dan dapatkan benefit eksklusif
          </p>
        </motion.div>

        {/* Bronze Tier */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-5 px-1">
            <div className="w-8 h-8 bg-gradient-to-br from-[#CD7F32] to-[#8B4513] rounded-full shadow-lg shadow-[#CD7F32]/20 border border-white/20" />
            <div>
              <h3 className="text-[#2D2B55] font-black text-lg tracking-tight">Bronze Member</h3>
              <p className="text-[#2D2B55]/30 text-[9px] font-black uppercase tracking-[0.1em]">
                {loyaltySettings?.tier_regular_min || 0} - {loyaltySettings?.tier_regular_max || 500} poin
              </p>
            </div>
          </div>
          <MemberCard tier="bronze" points={250} memberSince="Jan 2026" cardNumber="4231 2604 1001 8888" />
          <div className="mt-5 bg-white rounded-[28px] p-6 border border-gray-100 shadow-sm shadow-black/[0.01]">
            <p className="text-[#2D2B55] font-black text-[8px] uppercase tracking-[0.25em] mb-4 opacity-30">Exclusive Benefits:</p>
            <ul className="space-y-3">
              {parseBenefits(loyaltySettings?.tier_regular_benefits).map((benefit, i) => (
                <li key={i} className="flex items-start gap-4 text-[#2D2B55] font-bold text-[13px] leading-tight">
                  <div className="w-4 h-4 bg-[#CD7F32]/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                     <div className="w-1 h-1 bg-[#CD7F32] rounded-full" />
                  </div>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Silver Tier */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-5 px-1">
            <div className="w-8 h-8 bg-gradient-to-br from-[#C0C0C0] to-[#808080] rounded-full shadow-lg shadow-[#C0C0C0]/20 border border-white/20" />
            <div>
              <h3 className="text-[#2D2B55] font-black text-lg tracking-tight">Silver Member</h3>
              <p className="text-[#2D2B55]/30 text-[9px] font-black uppercase tracking-[0.1em]">
                {loyaltySettings?.tier_silver_min || 501} - {loyaltySettings?.tier_silver_max || 1500} poin
              </p>
            </div>
          </div>
          <MemberCard tier="silver" points={1250} memberSince="Jan 2026" cardNumber="4231 2604 2001 8888" />
          <div className="mt-5 bg-white rounded-[28px] p-6 border border-gray-100 shadow-sm shadow-black/[0.01]">
            <p className="text-[#2D2B55] font-black text-[8px] uppercase tracking-[0.25em] mb-4 opacity-30">Exclusive Benefits:</p>
            <ul className="space-y-3">
              {parseBenefits(loyaltySettings?.tier_silver_benefits).map((benefit, i) => (
                <li key={i} className="flex items-start gap-4 text-[#2D2B55] font-bold text-[13px] leading-tight">
                  <div className="w-4 h-4 bg-[#C0C0C0]/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                     <div className="w-1 h-1 bg-[#C0C0C0] rounded-full" />
                  </div>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Gold Tier */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-5 px-1">
            <div className="w-8 h-8 bg-gradient-to-br from-[#FFD700] to-[#FF8C00] rounded-full shadow-lg shadow-[#FFD700]/20 border border-white/20" />
            <div>
              <h3 className="text-[#2D2B55] font-black text-lg tracking-tight">Gold Member</h3>
              <p className="text-[#2D2B55]/30 text-[9px] font-black uppercase tracking-[0.1em]">
                {loyaltySettings?.tier_gold_min || 1501}+ poin
              </p>
            </div>
          </div>
          <MemberCard tier="gold" points={2850} memberSince="Jan 2026" cardNumber="4231 2604 3001 8888" />
          <div className="mt-5 bg-white rounded-[28px] p-6 border border-gray-100 shadow-sm shadow-black/[0.01]">
            <p className="text-[#2D2B55] font-black text-[8px] uppercase tracking-[0.25em] mb-4 opacity-30">Exclusive Benefits:</p>
            <ul className="space-y-3">
              {parseBenefits(loyaltySettings?.tier_gold_benefits).map((benefit, i) => (
                <li key={i} className="flex items-start gap-4 text-[#2D2B55] font-bold text-[13px] leading-tight">
                  <div className="w-4 h-4 bg-[#FFD700]/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                     <div className="w-1 h-1 bg-[#FFD700] rounded-full" />
                  </div>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-[#6367FF] to-[#8494FF] rounded-[28px] p-8 text-center shadow-xl shadow-[#6367FF]/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-5 border border-white/30">
            <Gift className="text-white" size={24} />
          </div>
          <p className="text-white font-black text-sm tracking-[0.15em] mb-3 uppercase">Cara Mendapat Poin</p>
          <p className="text-white/80 text-[13px] font-bold leading-relaxed max-w-[260px] mx-auto">
            Gunakan setiap <span className="text-white underline decoration-white/30 underline-offset-4">Rp {Number(loyaltySettings?.point_value || 10000).toLocaleString('id-ID')}</span> pembelanjaan untuk mendapatkan <span className="bg-white text-[#6367FF] px-2 py-1 rounded-lg ml-1 font-black shadow-sm">+{loyaltySettings?.point_multiplier || 1} Poin</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
