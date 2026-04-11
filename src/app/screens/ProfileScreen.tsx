import { useState, useEffect } from "react";
import { User, LogOut, Gift, ChevronRight, Star, Settings, Mail, Lock, UserPlus } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import api from "../../lib/api";
import logo from "figma:asset/c67b6433ddedf46738312a77f1fae7b733129f87.png";

type AuthMode = "login" | "register";

export function ProfileScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [userData, setUserData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Auth Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      fetchProfileData();
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const [profileRes, ordersRes] = await Promise.all([
        api.get('/profile'),
        api.get('/orders')
      ]);
      setUserData(profileRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error("Error fetching profile data:", err);
      // If 401, logout
      if ((err as any).response?.status === 401) {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const endpoint = authMode === "login" ? "/login" : "/register";
      const payload = authMode === "login" ? { email, password } : { name, email, password };
      
      const res = await api.post(endpoint, payload);
      localStorage.setItem("token", res.data.token);
      setIsLoggedIn(true);
      setAuthError("");
    } catch (err: any) {
      console.error("Auth error:", err);
      setAuthError(err.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      console.error("Logout failed", e);
    }
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserData(null);
    setOrders([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-[#6367FF] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#2D2B55]/60">Memuat profil...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] flex items-center justify-center px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-[#2D2B55]/5"
        >
          <div className="text-center mb-8">
            <img src={logo} alt="Logo" className="w-20 h-20 rounded-full mx-auto mb-4 bg-[#6367FF]/10 p-2" />
            <h1 className="text-[#2D2B55] font-black text-3xl">PICPIC</h1>
            <p className="text-[#2D2B55]/60">Kembali untuk kopi favoritmu</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === "register" && (
              <div className="relative">
                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D2B55]/30" size={20} />
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#F8F7FF] rounded-2xl text-[#2D2B55] placeholder:text-[#2D2B55]/30 border-none focus:outline-none focus:ring-2 focus:ring-[#6367FF]/20"
                  required
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D2B55]/30" size={20} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#F8F7FF] rounded-2xl text-[#2D2B55] placeholder:text-[#2D2B55]/30 border-none focus:outline-none focus:ring-2 focus:ring-[#6367FF]/20"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D2B55]/30" size={20} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#F8F7FF] rounded-2xl text-[#2D2B55] placeholder:text-[#2D2B55]/30 border-none focus:outline-none focus:ring-2 focus:ring-[#6367FF]/20"
                required
              />
            </div>

            {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}

            <button
              type="submit"
              className="w-full bg-[#6367FF] text-white py-4 rounded-full font-bold active:scale-95 transition-transform"
            >
              {authMode === "login" ? "Masuk" : "Daftar"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#2D2B55]/60 text-sm">
              {authMode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}
              <button 
                onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                className="ml-2 text-[#6367FF] font-bold"
              >
                {authMode === "login" ? "Daftar Sekarang" : "Masuk Sekarang"}
              </button>
            </p>
          </div>
        </motion.div>
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
          <h1 className="text-white font-bold text-2xl mb-6">Profil</h1>

          {/* Profile Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <User className="text-white" size={32} />
            </div>
            <div className="flex-1">
              <h2 className="text-white font-bold text-xl mb-1">{userData?.name || "Pengguna PICPIC"}</h2>
              <p className="text-white/80 text-sm">{userData?.email || "picpic@example.com"}</p>
            </div>
          </div>

          {/* Loyalty Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xl shadow-[#6367FF]/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <img src={logo} alt="PICPIC" className="w-8 h-8 rounded-lg" />
                <span className="text-[#2D2B55] font-bold">Loyalty Points</span>
              </div>
              <Gift className="text-[#6367FF]" size={20} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[#6367FF] font-black text-4xl">520</span>
              <span className="text-[#2D2B55]/60 text-sm">poin tersedia</span>
            </div>
          </div>
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
          </div>
          
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-[#2D2B55]/5">
               <p className="text-[#2D2B55]/40 text-sm">Belum ada riwayat pesanan.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-white rounded-2xl p-4 flex gap-3 border border-[#2D2B55]/5"
                >
                  <div className="w-16 h-16 rounded-xl bg-[#F8F7FF] flex items-center justify-center flex-shrink-0">
                    <img src={logo} alt="Order" className="w-10 h-10 object-contain opacity-20" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className="text-[#2D2B55] font-semibold text-sm">{order.order_number}</h3>
                        <p className="text-[#2D2B55]/60 text-xs">{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'completed' ? 'text-green-600 bg-green-50' : 'text-[#6367FF] bg-[#6367FF]/10'
                      }`}>
                        {order.status === 'pending' ? 'Menunggu' : order.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[#2D2B55]/60 text-xs">{order.order_items?.length || 0} item</span>
                      <span className="text-[#2D2B55] font-bold text-sm">
                        Rp {Number(order.total).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Menu Options */}
        <div className="mb-8">
          <h2 className="text-[#2D2B55] font-bold text-lg mb-4">Lainnya</h2>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-4 bg-white rounded-xl hover:bg-[#F8F7FF] transition-colors border border-[#2D2B55]/5">
              <div className="w-10 h-10 bg-[#F8F7FF] rounded-xl flex items-center justify-center">
                <Settings className="text-[#6367FF]" size={20} />
              </div>
              <span className="text-[#2D2B55] font-semibold flex-1 text-sm text-left">Pengaturan Akun</span>
              <ChevronRight className="text-[#2D2B55]/40" size={18} />
            </button>
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