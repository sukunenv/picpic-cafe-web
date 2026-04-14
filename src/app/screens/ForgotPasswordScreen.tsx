import { useState } from "react";
import { Link } from "react-router";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import api from "../../lib/api";

export function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await api.post("/auth/forgot-password", { email });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengirim link reset. Pastikan email terdaftar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex flex-col px-6 pt-6 pb-10">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-md w-full mx-auto"
      >
        {/* Back Button */}
        <Link 
          to="/login" 
          className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#2D2B55] shadow-sm border border-gray-100 active:scale-95 transition-all mb-8"
        >
          <ArrowLeft size={20} />
        </Link>

        {/* Content Section */}
        <div className="flex flex-col items-center text-center mb-10">
          <img 
            src="https://res.cloudinary.com/dkcl8wzdc/image/upload/q_auto/f_auto/v1776032977/logo_apuccy.png" 
            alt="PicPic Logo" 
            className="w-20 h-20 rounded-3xl bg-white p-3 shadow-xl mb-6 shadow-[#6367FF]/10 border border-[#6367FF]/5"
          />
          
          {!isSuccess ? (
            <>
              <h1 className="text-[#2D2B55] font-black text-3xl tracking-tight mb-2">Lupa Password?</h1>
              <p className="text-[#2D2B55]/85 font-medium">Masukkan email kamu, kami kirim link reset</p>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-4"
              >
                <CheckCircle2 size={32} />
              </motion.div>
              <h1 className="text-[#2D2B55] font-black text-2xl tracking-tight mb-2">Berhasil Terkirim!</h1>
              <p className="text-[#2D2B55]/85 font-medium">
                Link reset telah dikirim ke <span className="text-[#2D2B55] font-bold">{email}</span>. <br/>
                Cek inbox atau folder spam kamu.
              </p>
            </>
          )}
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D2B55]/30 group-focus-within:text-[#6367FF] transition-colors" size={20} />
              <input
                type="email"
                placeholder="Email Akun"
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
              className="w-full bg-[#6367FF] text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-[#6367FF]/30 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:active:scale-100"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                "Kirim Link Reset"
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
             <button
              onClick={() => setIsSuccess(false)}
              className="w-full bg-white text-[#2D2B55] py-4 rounded-2xl font-black text-lg border border-gray-100 shadow-sm active:scale-95 transition-all"
            >
              Coba Email Lain
            </button>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/login" className="text-[#6367FF] font-black hover:underline flex items-center justify-center gap-2">
            Kembali ke Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
