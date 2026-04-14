import { useState, useEffect } from "react";
import { User, LogOut, History, ChevronRight, Settings, Info, CreditCard, ExternalLink, Star } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import api from "../../lib/api";
import { MemberCard } from "../components/MemberCard";

const logo = "/logo.png";

export function ProfileScreen() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("picpic_auth_token"));
  const [userData, setUserData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tierSettings, setTierSettings] = useState<any>(null);
  const [showAllOrders, setShowAllOrders] = useState(false);

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

  // Logic to determine current tier and progress
  const getCurrentTierData = () => {
    if (!userData || !tierSettings) return { tier: "bronze" as const, nextTierName: "Silver", pointsToNext: 0, progress: 0 };
    
    const points = userData.points || 0;
    const silverMin = Number(tierSettings.tier_silver_min || 501);
    const goldMin = Number(tierSettings.tier_gold_min || 1501);

    if (points >= goldMin) {
      return { 
        tier: "gold" as const, 
        nextTierName: "", 
        pointsToNext: 0, 
        progress: 100 
      };
    }

    if (points >= silverMin) {
      const progress = ((points - silverMin) / (goldMin - silverMin)) * 100;
      return { 
        tier: "silver" as const, 
        nextTierName: tierSettings.tier_gold_name || "Gold", 
        pointsToNext: goldMin - points, 
        progress: Math.min(progress, 100) 
      };
    }

    const progress = (points / silverMin) * 100;
    return { 
      tier: "bronze" as const, 
      nextTierName: tierSettings.tier_silver_name || "Silver", 
      pointsToNext: silverMin - points, 
      progress: Math.min(progress, 100) 
    };
  };

  const tierData = getCurrentTierData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-[#6367FF] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#2D2B55]/85 font-bold animate-pulse uppercase tracking-widest text-xs">Memuat profil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-[#F8F7FF]">
      {/* Header with Loyalty Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-[#6367FF] to-[#8494FF] pt-14 pb-32 px-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10"
        >
          <h1 className="text-white font-bold text-2xl mb-6">Profil</h1>

          {/* Profile Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30 overflow-hidden shadow-xl shadow-black/10">
              {userData?.avatar ? (
                <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="text-white" size={32} />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-white font-black text-xl mb-0.5 tracking-tight">{userData?.name || "Pengguna PICPIC"}</h2>
              <p className="text-white/70 text-sm font-medium">{userData?.email || "picpic@example.com"}</p>
            </div>
          </div>

          {/* Member Card Component */}
          <MemberCard
            tier={tierData.tier}
            points={userData?.points || 0}
            memberSince={userData?.created_at ? new Date(userData.created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) : "Jan 2026"}
            cardNumber={userData?.card_number || "GENERATING..."}
          />

          {/* Progress Bar - FIGMA_V6 style, di dalam header biru */}
          {tierData.tier !== "gold" && (
            <div className="bg-white rounded-2xl p-5 mt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#2D2B55] font-semibold text-sm">Progress ke {tierData.nextTierName}</span>
                <span className="text-[#6367FF] font-bold text-sm">{tierData.pointsToNext} poin lagi</span>
              </div>
              <div className="h-2.5 bg-[#F8F7FF] rounded-full overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${tierData.progress}%` }}
                  transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#6367FF] to-[#8494FF] rounded-full"
                />
              </div>
              
              {userData?.point_expires_at && (
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <p className="text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                    Poin kedaluwarsa: <span className="text-amber-800">{new Date(userData.point_expires_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </p>
                </div>
              )}
            </div>
          )}

        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-6 -mt-20 relative z-10"
      >
        {/* Order History */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#2D2B55] font-black text-lg flex items-center gap-2">
              <History size={20} className="text-[#6367FF]" />
              Riwayat Pesanan
            </h2>
          </div>
          
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm shadow-black/[0.01]">
              <div className="w-12 h-12 bg-[#F8F7FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <History className="text-[#2D2B55]/20" size={24} />
              </div>
              <p className="text-[#2D2B55]/40 text-sm font-bold uppercase tracking-widest">Belum ada riwayat.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, showAllOrders ? orders.length : 3).map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-white rounded-[24px] p-4 flex gap-4 border border-gray-100 shadow-sm shadow-black/[0.02] active:scale-[0.98] transition-all"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#F8F7FF] flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-50">
                    {order.order_items?.[0]?.menu?.image ? (
                        <img src={order.order_items[0].menu.image} alt="Order" className="w-full h-full object-cover" />
                    ) : (
                        <img src={logo} alt="Order" className="w-10 h-10 object-contain opacity-20" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className="text-[#2D2B55] font-black text-sm tracking-tight capitalize">{order.order_number}</h3>
                        <p className="text-[#2D2B55]/40 text-[10px] font-bold uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        order.status === 'completed' ? 'text-green-600 bg-green-50' : 'text-[#6367FF] bg-[#6367FF]/10'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[#2D2B55]/40 text-[10px] font-bold uppercase tracking-widest">{order.order_items?.length || 0} item dipesan</span>
                      <span className="text-[#2D2B55] font-black text-sm tracking-tight">
                        Rp {Number(order.total).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              {/* Tombol Lihat Semua / Sembunyikan */}
              {orders.length > 3 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  onClick={() => setShowAllOrders(!showAllOrders)}
                  className="w-full py-4 bg-white rounded-[24px] border border-[#6367FF]/20 text-[#6367FF] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm"
                >
                  <History size={14} />
                  {showAllOrders ? "Sembunyikan Pesanan" : `Lihat ${orders.length - 3} Pesanan Sebelumnya`}
                  <ChevronRight size={14} className={`transition-transform ${showAllOrders ? 'rotate-90' : ''}`} />
                </motion.button>
              )}
            </div>
          )}
        </div>

        {/* Menu Options */}
        <div className="mb-8">
          <h2 className="text-[#2D2B55] font-black text-lg mb-4">Lainnya</h2>
          <div className="space-y-2">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Link
                to="/member-cards"
                className="flex items-center gap-4 px-5 py-5 bg-white rounded-[24px] hover:bg-[#F8F7FF] transition-all border border-gray-100 shadow-sm shadow-black/[0.01] group"
              >
                <div className="w-10 h-10 bg-[#F8F7FF] rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                  <CreditCard className="text-[#6367FF]" size={20} />
                </div>
                <span className="text-[#2D2B55] font-black text-sm tracking-tight flex-1">Tier Member Cards</span>
                <ChevronRight className="text-[#2D2B55]/20" size={18} />
              </Link>
            </motion.div>

            <motion.a
              href="https://g.page/r/CRy-DYb1Cl-NEBM/review"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-4 px-5 py-5 bg-white rounded-[24px] hover:bg-[#F8F7FF] transition-all border border-gray-100 shadow-sm shadow-black/[0.01] group"
            >
              <div className="w-10 h-10 bg-[#F8F7FF] rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                <Star className="text-[#6367FF]" size={20} fill="white" strokeWidth={2} />
              </div>
              <span className="text-[#2D2B55] font-black text-sm tracking-tight flex-1">Review Kami di Google</span>
              <ChevronRight className="text-[#2D2B55]/20" size={18} />
            </motion.a>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <Link
                to="/account-settings"
                className="flex items-center gap-4 px-5 py-5 bg-white rounded-[24px] hover:bg-[#F8F7FF] transition-all border border-gray-100 shadow-sm shadow-black/[0.01] group"
              >
                <div className="w-10 h-10 bg-[#F8F7FF] rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                  <Settings className="text-[#6367FF]" size={20} />
                </div>
                <span className="text-[#2D2B55] font-black text-sm tracking-tight flex-1">Pengaturan Akun</span>
                <ChevronRight className="text-[#2D2B55]/20" size={18} />
              </Link>
            </motion.div>

            <motion.button
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="w-full flex items-center gap-4 px-5 py-5 bg-white rounded-[24px] hover:bg-red-50/50 transition-all border border-gray-100 shadow-sm shadow-black/[0.01] group"
              onClick={handleLogout}
            >
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                <LogOut className="text-red-500" size={20} />
              </div>
              <span className="text-red-500 font-black text-sm tracking-tight flex-1 text-left">Keluar Akun</span>
              <ChevronRight className="text-red-500/20" size={18} />
            </motion.button>
          </div>
        </div>

        {/* App Version */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center pt-8 pb-4"
        >
          <p className="text-[#2D2B55]/20 text-[10px] font-black uppercase tracking-[0.3em]">Powered by Kalify.dev</p>
          <p className="text-[#2D2B55]/20 text-[10px] font-black tracking-widest mt-1 uppercase">Version 3.1.0 Premium</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
