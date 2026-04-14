import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import api from "../../lib/api";

export function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("picpic_auth_token", res.data.token);
      localStorage.setItem("picpic_user", JSON.stringify(res.data.user));
      localStorage.setItem("token_expires_at", res.data.expires_at);
      navigate("/");
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError("Terlalu banyak percobaan login. Coba lagi dalam 1 menit.");
        setCountdown(60);
      } else {
        setError(err.response?.data?.message || "Email atau password salah. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex flex-col px-6 pt-12 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mx-auto"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center text-center mb-10">
          <img 
            src="https://res.cloudinary.com/dkcl8wzdc/image/upload/q_auto/f_auto/v1776032977/logo_apuccy.png" 
            alt="PicPic Logo" 
            className="w-20 h-20 rounded-3xl bg-white p-3 shadow-xl mb-6 shadow-[#6367FF]/10 border border-[#6367FF]/5"
          />
          <h1 className="text-[#2D2B55] font-black text-3xl tracking-tight mb-2">Selamat Datang</h1>
          <p className="text-[#2D2B55]/60 font-medium">Masuk ke akun kamu</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D2B55]/30 group-focus-within:text-[#6367FF] transition-colors" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-[#2D2B55] font-medium placeholder:text-[#2D2B55]/30 border-2 border-transparent focus:border-[#6367FF]/20 focus:outline-none transition-all shadow-sm"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D2B55]/30 group-focus-within:text-[#6367FF] transition-colors" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl text-[#2D2B55] font-medium placeholder:text-[#2D2B55]/30 border-2 border-transparent focus:border-[#6367FF]/20 focus:outline-none transition-all shadow-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2D2B55]/30 hover:text-[#2D2B55]/60 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex justify-end pr-2">
            <Link to="/forgot-password" size={14} className="text-[#6367FF] font-bold text-sm hover:underline">
              Lupa Password?
            </Link>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-red-500 text-sm font-bold text-center bg-red-50 py-3 rounded-xl border border-red-100"
            >
              {error} 
              {countdown > 0 && (
                <span className="block mt-1 font-black text-xs underline uppercase tracking-widest">
                  Tunggu {countdown} detik lagi
                </span>
              )}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isLoading || countdown > 0}
            className="w-full bg-[#6367FF] text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-[#6367FF]/30 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:grayscale disabled:active:scale-100 mt-2"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : countdown > 0 ? (
              `Tunggu ${countdown}s`
            ) : (
              <>
                Masuk <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[#2D2B55]/60 font-medium">
            Belum punya akun?{' '}
            <Link to="/register" className="text-[#6367FF] font-black hover:underline px-1">
              Daftar
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
