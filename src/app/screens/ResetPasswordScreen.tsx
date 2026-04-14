import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import api from "../../lib/api";

export function ResetPasswordScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await api.post("/auth/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mereset password. Token mungkin kedaluwarsa.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
    return (
        <div className="min-h-screen bg-[#F8F7FF] flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-red-500 font-black text-xl mb-2">Link Tidak Valid</h1>
            <p className="text-[#2D2B55]/70 mb-6">Link reset password tidak lengkap atau sudah kedaluwarsa.</p>
            <button onClick={() => navigate("/forgot-password")} className="bg-[#6367FF] text-white px-8 py-3 rounded-xl font-bold">Minta Link Baru</button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex flex-col px-6 pt-12 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mx-auto"
      >
        <div className="mb-10 text-center">
            <h1 className="text-[#2D2B55] font-black text-3xl tracking-tight mb-3">Password Baru</h1>
            <p className="text-[#2D2B55]/70 font-medium">Buat password baru yang kuat dan mudah kamu ingat.</p>
        </div>

        {isSuccess ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[32px] p-8 text-center shadow-xl shadow-[#6367FF]/5 border border-[#6367FF]/10"
          >
            <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h2 className="text-[#2D2B55] font-black text-xl mb-3">Berhasil!</h2>
            <p className="text-[#2D2B55]/70 text-sm leading-relaxed mb-6">
              Password kamu sudah berhasil diperbarui. Silakan login kembali dengan password baru kamu.
            </p>
            <button onClick={() => navigate("/login")} className="w-full bg-[#6367FF] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-[#6367FF]/30 active:scale-95 transition-all">
              Buka Halaman Login
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D2B55]/30 group-focus-within:text-[#6367FF] transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password Baru"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl text-[#2D2B55] font-medium placeholder:text-[#2D2B55]/30 border-2 border-transparent focus:border-[#6367FF]/20 focus:outline-none transition-all shadow-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2D2B55]/30 hover:text-[#2D2B55]/85 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D2B55]/30 group-focus-within:text-[#6367FF] transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Konfirmasi Password Baru"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-[#2D2B55] font-medium placeholder:text-[#2D2B55]/30 border-2 border-transparent focus:border-[#6367FF]/20 focus:outline-none transition-all shadow-sm"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm font-bold text-center bg-red-50 py-3 rounded-xl border border-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6367FF] text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-[#6367FF]/30 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 mt-4"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                "Simpan Password Baru"
              )}
            </button>
          </form>
        )}

      </motion.div>
    </div>
  );
}
