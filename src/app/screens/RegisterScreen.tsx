import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import api from "../../lib/api";

export function RegisterScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    if (password !== passwordConfirm) {
      setErrors({ passwordConfirm: "Konfirmasi password tidak cocok." });
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/register", { name, email, password });
      localStorage.setItem("picpic_auth_token", res.data.token);
      localStorage.setItem("picpic_user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const backendErrors: any = {};
        Object.keys(err.response.data.errors).forEach(key => {
          backendErrors[key] = err.response.data.errors[key][0];
        });
        setErrors(backendErrors);
      } else {
        setErrors({ general: err.response?.data?.message || "Terjadi kesalahan saat pendaftaran." });
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
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-10">
          <img 
            src="https://res.cloudinary.com/dkcl8wzdc/image/upload/q_auto/f_auto/v1776032977/logo_apuccy.png" 
            alt="PicPic Logo" 
            className="w-20 h-20 rounded-3xl bg-white p-3 shadow-xl mb-6 shadow-[#6367FF]/10 border border-[#6367FF]/5"
          />
          <h1 className="text-[#2D2B55] font-black text-3xl tracking-tight mb-2">Buat Akun Baru</h1>
          <p className="text-[#2D2B55]/60 font-medium">Bergabung dengan PicPic</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <div className={`relative group transition-all`}>
              <User className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.name ? 'text-red-400' : 'text-[#2D2B55]/30 group-focus-within:text-[#6367FF]'} transition-colors`} size={20} />
              <input
                type="text"
                placeholder="Nama Lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-[#2D2B55] font-medium placeholder:text-[#2D2B55]/30 border-2 ${errors.name ? 'border-red-200 bg-red-50/30' : 'border-transparent focus:border-[#6367FF]/20'} focus:outline-none transition-all shadow-sm`}
                required
              />
            </div>
            {errors.name && <p className="text-red-500 text-[11px] font-bold pl-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <div className="relative group">
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.email ? 'text-red-400' : 'text-[#2D2B55]/30 group-focus-within:text-[#6367FF]'} transition-colors`} size={20} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-[#2D2B55] font-medium placeholder:text-[#2D2B55]/30 border-2 ${errors.email ? 'border-red-200 bg-red-50/30' : 'border-transparent focus:border-[#6367FF]/20'} focus:outline-none transition-all shadow-sm`}
                required
              />
            </div>
            {errors.email && <p className="text-red-500 text-[11px] font-bold pl-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="relative group">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.password ? 'text-red-400' : 'text-[#2D2B55]/30 group-focus-within:text-[#6367FF]'} transition-colors`} size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password (Min. 8 karakter)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-12 pr-12 py-4 bg-white rounded-2xl text-[#2D2B55] font-medium placeholder:text-[#2D2B55]/30 border-2 ${errors.password ? 'border-red-200 bg-red-50/30' : 'border-transparent focus:border-[#6367FF]/20'} focus:outline-none transition-all shadow-sm`}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2D2B55]/30 hover:text-[#2D2B55]/60 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-[11px] font-bold pl-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <div className="relative group">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.passwordConfirm ? 'text-red-400' : 'text-[#2D2B55]/30 group-focus-within:text-[#6367FF]'} transition-colors`} size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Konfirmasi Password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-[#2D2B55] font-medium placeholder:text-[#2D2B55]/30 border-2 ${errors.passwordConfirm ? 'border-red-200 bg-red-50/30' : 'border-transparent focus:border-[#6367FF]/20'} focus:outline-none transition-all shadow-sm`}
                required
              />
            </div>
            {errors.passwordConfirm && <p className="text-red-500 text-[11px] font-bold pl-1">{errors.passwordConfirm}</p>}
          </div>

          {errors.general && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm font-bold text-center bg-red-50 py-3 rounded-xl border border-red-100"
            >
              {errors.general}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#6367FF] text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-[#6367FF]/30 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:active:scale-100 mt-4"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                Daftar Sekarang <UserPlus size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[#2D2B55]/60 font-medium">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-[#6367FF] font-black hover:underline px-1">
              Masuk
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
