import { useState, useEffect } from "react";
import { User, LogOut, Gift, ChevronRight, Star, Settings, Mail, Lock, UserPlus, QrCode } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import api from "../../lib/api";
const logo = "/logo.png";

export function ProfileScreen() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("picpic_auth_token"));
  const [userData, setUserData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [tierSettings, setTierSettings] = useState<any>(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchProfileData();
      fetchTierSettings();
    } else {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const fetchTierSettings = async () => {
    try {
      const res = await api.get('/settings/loyalty');
      setTierSettings(res.data);
    } catch (err) {
      console.error("Error fetching tier settings", err);
    }
  };

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const [profileRes, ordersRes] = await Promise.all([
        api.get('/profile'),
        api.get('/orders')
      ]);
      setUserData(profileRes.data);
      const ordersData = ordersRes.data;
      setOrders(Array.isArray(ordersData) ? ordersData : ordersData?.data ?? []);
    } catch (err) {
      console.error("Error fetching profile data:", err);
      if ((err as any).response?.status === 401) {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getUserTier = () => {
    if (!userData || !tierSettings) return { name: "Regular", color: "#9CA3AF" };
    const points = userData.points || 0;
    if (points >= Number(tierSettings.tier_gold_min)) {
      return { name: tierSettings.tier_gold_name, color: tierSettings.tier_gold_color };
    }
    if (points >= Number(tierSettings.tier_silver_min)) {
      return { name: tierSettings.tier_silver_name, color: tierSettings.tier_silver_color };
    }
    return { name: tierSettings.tier_regular_name, color: tierSettings.tier_regular_color };
  };

  const getTierConfig = () => {
    const tier = getUserTier();
    const name = tier.name.toUpperCase();
    
    if (name.includes('GOLD')) {
      return {
        cardClass: "bg-gradient-to-br from-yellow-100/90 via-amber-50/95 to-yellow-200/90 backdrop-blur-3xl border-2 border-yellow-400/40 shadow-yellow-400/20",
        badgeClass: "bg-gradient-to-r from-yellow-500 to-amber-400 shadow-lg shadow-yellow-500/20",
        initial: { opacity: 0, y: 20, scale: 0.9, rotateY: 5 },
        animate: { opacity: 1, y: 0, scale: 1, rotateY: 0 },
        transition: { type: 'spring', damping: 15, duration: 0.8 },
        shimmerDuration: 2,
        shimmerClass: "via-white/40",
        orbs: [
          { size: 'w-32 h-32', color: 'bg-yellow-400/20', position: '-top-10 -right-10' },
          { size: 'w-24 h-24', color: 'bg-amber-300/15', position: '-bottom-8 -left-8' },
          { size: 'w-20 h-20', color: 'bg-orange-300/10', position: 'top-1/2 right-1/4' },
        ],
        hover: { scale: 1.05, rotateY: -2 },
        glow: true
      };
    }
    
    if (name.includes('SILVER')) {
      return {
        cardClass: "bg-gradient-to-br from-gray-100/90 via-white/95 to-gray-200/90 backdrop-blur-2xl border border-gray-300/60 shadow-gray-300/20",
        badgeClass: "bg-gray-400 shadow-md",
        initial: { opacity: 0, y: 20, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.6 },
        shimmerDuration: 3,
        shimmerClass: "via-white/20",
        orbs: [
          { size: 'w-40 h-40', color: 'bg-gray-300/20', position: '-bottom-10 -left-10' }
        ],
        hover: { scale: 1.03 },
        glow: false
      };
    }
    
    return {
      cardClass: "bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-gray-200/10",
      badgeClass: "bg-gray-500",
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
      shimmerDuration: 0,
      shimmerClass: "",
      orbs: [],
      hover: { scale: 1.02 },
      glow: false
    };
  };

  const tierConfig = getTierConfig();

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      console.error("Logout failed", e);
    }
    localStorage.removeItem("picpic_auth_token");
    localStorage.removeItem("picpic_user");
    setIsLoggedIn(false);
    setUserData(null);
    setOrders([]);
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-[#6367FF] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#2D2B55]/85">Memuat profil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-[#F8F7FF]">
      {/* Header with Loyalty Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-[#6367FF] to-[#8494FF] pt-14 pb-24 px-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-white font-bold text-2xl">Profil</h1>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${tierConfig.badgeClass}`}>
              {getUserTier().name} member
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden border-2 border-white/30">
              {userData?.avatar ? (
                <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="text-white" size={32} />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-white font-black text-xl mb-0.5">{userData?.name || "Pengguna PICPIC"}</h2>
              <p className="text-white/80 text-sm font-medium">{userData?.email || "picpic@example.com"}</p>
            </div>
          </div>

          {/* New Premium Loyalty Card Tiered System */}
          <motion.div
            initial={tierConfig.initial}
            animate={tierConfig.animate}
            transition={tierConfig.transition}
            whileHover={tierConfig.hover}
            className={`relative h-56 group mt-2 perspective-1000`}
          >
            {/* Background Orbs */}
            <div className="absolute inset-0 overflow-hidden rounded-[32px]">
              {tierConfig.orbs.map((orb, i) => (
                <motion.div
                  key={i}
                  className={`absolute ${orb.size} ${orb.color} ${orb.position} rounded-full blur-2xl`}
                  animate={{
                    x: [0, 20 * (i + 1), -15 * (i + 1), 0],
                    y: [0, -15 * (i + 1), 10 * (i + 1), 0],
                    scale: [1, 1.1, 0.9, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 6 + i * 2,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>

            <motion.div
              animate={tierConfig.glow ? {
                boxShadow: [
                  '0 10px 30px -5px rgba(251,191,36,0.1)',
                  '0 20px 50px -5px rgba(251,191,36,0.3)',
                  '0 10px 30px -5px rgba(251,191,36,0.1)'
                ]
              } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`absolute inset-0 ${tierConfig.cardClass} shadow-2xl rounded-[32px] p-6 flex flex-col justify-between overflow-hidden`}
            >
              {/* Shimmer Effect */}
              {tierConfig.shimmerDuration > 0 && (
                <motion.div
                  className="absolute inset-0 overflow-hidden rounded-[32px]"
                  initial={{ x: '-100%' }}
                  animate={{ x: '150%' }}
                  transition={{ repeat: Infinity, duration: tierConfig.shimmerDuration, ease: 'linear' }}
                >
                  <div className={`w-1/2 h-full bg-gradient-to-r from-transparent ${tierConfig.shimmerClass} to-transparent skew-x-12`} />
                </motion.div>
              )}

              {/* Card Texture Layer */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <img 
                      src="https://res.cloudinary.com/dkcl8wzdc/image/upload/q_auto/f_auto/v1776032977/logo_apuccy.png" 
                      alt="PicPic Logo" 
                      className="w-10 h-10 rounded-full object-cover" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#2D2B55]/40 font-black text-[8px] uppercase tracking-[0.3em] leading-none mb-1">Official Member</span>
                    <span className="text-[#2D2B55] font-black text-sm tracking-tighter uppercase">{getUserTier().name} REWARDS</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <QrCode className="text-[#2D2B55]/20" size={28} strokeWidth={1.5} />
                  <span className="text-[6px] text-[#2D2B55]/30 font-black tracking-widest uppercase mt-1">Scan for points</span>
                </div>
              </div>

              <div className="relative z-10">
                <div className="flex items-end justify-between mb-4">
                  <div className="flex items-baseline gap-2">
                    <motion.span 
                      key={userData?.points}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-[#2D2B55] font-black text-6xl leading-none tracking-tighter"
                    >
                      {userData?.points || 0}
                    </motion.span>
                    <div className="flex flex-col">
                      <span className="text-[#2D2B55]/30 font-black text-[10px] uppercase tracking-[0.2em] leading-none mb-1">Total</span>
                      <span className="text-[#2D2B55]/85 font-black text-xs uppercase tracking-widest leading-none">Points</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-[#2D2B55]/20 text-[8px] font-black uppercase tracking-widest mb-0.5">Member ID</p>
                    <p className="text-[#2D2B55]/70 font-mono text-[9px] tracking-widest font-bold">
                      PIC • {new Date().getFullYear()} • {(userData?.id || 0).toString().padStart(4, '0')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="px-4 py-1.5 bg-[#6367FF]/5 border border-[#6367FF]/10 rounded-full flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6367FF] shadow-[0_0_8px_rgba(99,103,255,0.4)]" />
                    <span className="text-[#6367FF] text-[8px] font-black uppercase tracking-widest leading-none">
                      {userData?.point_expires_at ? `Expires ${new Date(userData.point_expires_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }).toUpperCase()}` : 'Active Status'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getUserTier().color }} />
                    <span className="text-[#2D2B55]/85 text-[9px] font-black uppercase tracking-widest">
                      {getUserTier().name}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-6 -mt-12 relative z-10"
      >
        {/* Order History */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#2D2B55] font-bold text-lg">Pesanan Terakhir</h2>
            {orders.length > 5 && (
              <span className="text-[10px] font-black text-[#6367FF] uppercase tracking-widest bg-[#6367FF]/10 px-3 py-1 rounded-full">
                Page {currentPage}/{Math.ceil(orders.length / 5)}
              </span>
            )}
          </div>
          
          {(!Array.isArray(orders) || orders.length === 0) ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-[#2D2B55]/5">
               <p className="text-[#2D2B55]/40 text-sm">Belum ada riwayat pesanan.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  {orders.slice((currentPage - 1) * 5, currentPage * 5).map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl p-4 flex gap-3 border border-[#2D2B55]/5 shadow-sm active:scale-[0.98] transition-all"
                    >
                      <div className="w-16 h-16 rounded-xl bg-[#F8F7FF] flex items-center justify-center flex-shrink-0">
                        <img src={logo} alt="Order" className="w-10 h-10 object-contain opacity-20" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h3 className="text-[#2D2B55] font-semibold text-sm">{order.order_number}</h3>
                            <p className="text-[#2D2B55]/85 text-xs">{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            order.status === 'completed' ? 'text-green-600 bg-green-50' : 'text-[#6367FF] bg-[#6367FF]/10'
                          }`}>
                            {order.status === 'pending' ? 'Menunggu' : order.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[#2D2B55]/85 text-xs">{order.order_items?.length || 0} item</span>
                          <span className="text-[#2D2B55] font-bold text-sm">
                            Rp {Number(order.total).toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Pagination Dots */}
              {orders.length > 5 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  {[...Array(Math.ceil(orders.length / 5))].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentPage === i + 1 ? "w-8 bg-[#6367FF]" : "w-2 bg-[#6367FF]/20"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Menu Options */}
        <div className="mb-8">
          <h2 className="text-[#2D2B55] font-bold text-lg mb-4">Lainnya</h2>
          <div className="space-y-2">
            <Link to="/account-settings" className="w-full flex items-center gap-3 px-4 py-4 bg-white rounded-xl hover:bg-[#F8F7FF] transition-colors border border-[#2D2B55]/5">
              <div className="w-10 h-10 bg-[#F8F7FF] rounded-xl flex items-center justify-center">
                <Settings className="text-[#6367FF]" size={20} />
              </div>
              <span className="text-[#2D2B55] font-semibold flex-1 text-sm text-left">Pengaturan Akun</span>
              <ChevronRight className="text-[#2D2B55]/40" size={18} />
            </Link>
            <button 
               onClick={handleLogout}
               className="w-full flex items-center gap-3 px-4 py-4 bg-white rounded-xl hover:bg-red-50 transition-colors border border-red-500/10 group"
            >
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                <LogOut className="text-red-500" size={20} />
              </div>
              <span className="text-red-500 font-semibold flex-1 text-sm text-left">Keluar Akun</span>
              <ChevronRight className="text-red-500/20" size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
