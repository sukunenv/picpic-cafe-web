import { useState } from "react";
import { Link } from "react-router";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import api from "../../lib/api";

export function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await api.post("/auth/forgot-password", { email });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan. Pastikan email Anda benar.");
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
        <Link to="/login" className="inline-flex items-center gap-2 text-[#2D2B55]/50 font-bold text-sm mb-10 hover:text-[#6367FF] transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Login
        </Link>

        <div className="mb-10 text-center">
            <h1 className="text-[#2D2B55] font-black text-3xl tracking-tight mb-3">Lupa Password?</h1>
            <p className="text-[#2D2B55]/70 font-medium">Jangan khawatir! Masukkan email kamu di bawah untuk mereset password.</p>
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
            <h2 className="text-[#2D2B55] font-black text-xl mb-3">Email Terkirim!</h2>
            <p className="text-[#2D2B55]/70 text-sm leading-relaxed mb-6">
                Silakan cek kotak masuk email <span className="text-[#6367FF] font-bold">{email}</span>. Klik link yang kami kirim untuk membuat password baru.
            </p>
            <Link to="/login" className="inline-block w-full bg-[#6367FF] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-[#6367FF]/30 active:scale-95 transition-all">
              Oke, Mengerti
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D2B55]/30 group-focus-within:text-[#6367FF] transition-colors" size={20} />
              <input
                type="email"
                placeholder="Masukkan Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              className="w-full bg-[#6367FF] text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-[#6367FF]/30 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                "Kirim Link Reset"
              )}
            </button>
          </form>
        )}

      </motion.div>
    </div>
  );
}
