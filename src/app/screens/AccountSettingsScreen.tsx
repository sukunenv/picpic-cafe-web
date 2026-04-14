import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { 
  ArrowLeft, Camera, User, Phone, Mail, Lock, Eye, EyeOff, 
  Trash2, Loader2, CheckCircle2, AlertCircle, Save 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import api from "../../lib/api";

export function AccountSettingsScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Forms
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({ old_password: "", new_password: "", new_password_confirmation: "" });
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });
  
  // Feedback
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      setUserData(res.data);
      setProfileForm({ name: res.data.name, phone: res.data.phone || "" });
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "picpic_avatars");

    try {
      // 1. Upload to Cloudinary
      const cloudRes = await fetch("https://api.cloudinary.com/v1_1/dkcl8wzdc/image/upload", {
        method: "POST",
        body: formData
      });
      const cloudData = await cloudRes.json();
      const imageUrl = cloudData.secure_url.replace('/upload/', '/upload/w_400,h_400,c_fill,q_auto,f_auto/');

      // 2. Save URL to Laravel
      await api.put('/auth/profile', { avatar: imageUrl });
      setUserData({ ...userData, avatar: imageUrl });
      showToast('success', 'Foto profil berhasil diperbarui!');
    } catch (err) {
      showToast('error', 'Gagal mengunggah foto.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await api.put('/auth/profile', profileForm);
      showToast('success', 'Profil berhasil disimpan!');
    } catch (err) {
      showToast('error', 'Gagal menyimpan profil.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      showToast('error', 'Konfirmasi password tidak cocok.');
      return;
    }
    setIsChangingPassword(true);
    try {
      await api.put('/auth/change-password', passwordForm);
      showToast('success', 'Password berhasil diubah!');
      setPasswordForm({ old_password: "", new_password: "", new_password_confirmation: "" });
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Gagal mengubah password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await api.delete('/auth/account');
      localStorage.removeItem("picpic_auth_token");
      localStorage.removeItem("picpic_user");
      navigate("/login");
    } catch (err) {
      showToast('error', 'Gagal menghapus akun.');
      setIsDeletingAccount(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#6367FF]" size={40} />
        <p className="text-[#2D2B55]/85 font-medium">Memuat pengaturan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7FF] pb-10">
      {/* Header */}
      <div className="bg-white px-6 py-6 border-b border-gray-100 flex items-center gap-4 sticky top-0 z-20">
        <Link to="/profile" className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#2D2B55]">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-[#2D2B55] font-black text-xl">Pengaturan Akun</h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto px-6 pt-8 space-y-8"
      >
        {/* Section 1: Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white relative">
              {userData?.avatar ? (
                <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#6367FF]/5 flex items-center justify-center text-[#6367FF] font-black text-4xl uppercase">
                  {userData?.name?.charAt(0)}
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                  <Loader2 className="animate-spin text-white" size={24} />
                </div>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-10 h-10 bg-[#6367FF] text-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-white active:scale-95 transition-all"
            >
              <Camera size={18} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarUpload} 
              className="hidden" 
              accept="image/*" 
            />
          </div>
          <p className="mt-3 text-[#2D2B55]/40 text-[10px] font-black uppercase tracking-widest">Ketuk logo kamera untuk ganti foto</p>
        </div>

        {/* Section 2: Edit Profil */}
        <section className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
              <User size={18} />
            </div>
            <h2 className="text-[#2D2B55] font-black text-sm uppercase tracking-widest">Informasi Dasar</h2>
          </div>
          
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="text"
                  value={profileForm.name}
                  onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl text-sm font-bold text-[#2D2B55] focus:bg-white focus:ring-2 focus:ring-[#6367FF]/10 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Nomor HP</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="text"
                  placeholder="08xx-xxxx-xxxx"
                  value={profileForm.phone}
                  onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl text-sm font-bold text-[#2D2B55] focus:bg-white focus:ring-2 focus:ring-[#6367FF]/10 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5 opacity-60">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Email (Terkunci)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="email"
                  value={userData?.email}
                  disabled
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-100 rounded-2xl text-sm font-bold text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSavingProfile}
              className="w-full py-4 bg-[#6367FF] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#6367FF]/20 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
            >
              {isSavingProfile ? <Loader2 className="animate-spin" size={18} /> : <><Save size={16} /> Simpan Perubahan</>}
            </button>
          </form>
        </section>

        {/* Section 3: Ubah Password */}
        <section className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-purple-50 text-purple-500 rounded-lg flex items-center justify-center">
              <Lock size={18} />
            </div>
            <h2 className="text-[#2D2B55] font-black text-sm uppercase tracking-widest">Keamanan Akun</h2>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {[
              { id: 'old', label: 'Password Lama', field: 'old_password' },
              { id: 'new', label: 'Password Baru', field: 'new_password' },
              { id: 'confirm', label: 'Konfirmasi Password Baru', field: 'new_password_confirmation' }
            ].map(pwd => (
              <div key={pwd.id} className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">{pwd.label}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type={(showPasswords as any)[pwd.id] ? "text" : "password"}
                    value={(passwordForm as any)[pwd.field]}
                    onChange={e => setPasswordForm(p => ({ ...p, [pwd.field]: e.target.value }))}
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 rounded-2xl text-sm font-bold text-[#2D2B55] focus:bg-white focus:ring-2 focus:ring-[#6367FF]/10 outline-none transition-all"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPasswords(p => ({ ...p, [pwd.id]: !(showPasswords as any)[pwd.id] }))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                  >
                    {(showPasswords as any)[pwd.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            ))}

            <button 
              type="submit"
              disabled={isChangingPassword}
              className="w-full py-4 bg-[#2D2B55] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#2D2B55]/10 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
            >
              {isChangingPassword ? <Loader2 className="animate-spin" size={18} /> : 'Ubah Password'}
            </button>
          </form>
        </section>

        {/* Section 4: Danger Zone */}
        <section className="bg-red-50/50 rounded-[32px] p-6 border border-red-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
              <AlertCircle size={18} />
            </div>
            <h2 className="text-red-600 font-black text-sm uppercase tracking-widest">Zona Berbahaya</h2>
          </div>
          <p className="text-[11px] text-red-600/60 font-medium mb-5 leading-relaxed">
            Menghapus akun akan menghilangkan semua data poin, riwayat transaksi, dan keanggotaan Anda secara permanen.
          </p>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-4 border-2 border-red-100 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all hover:bg-red-50"
          >
            Hapus Akun Saya
          </button>
        </section>
      </motion.div>

      {/* Popups & Feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-10 left-6 right-6 z-[100]"
          >
            <div className={`flex items-center gap-3 p-4 rounded-2xl shadow-2xl ${toast.type === 'success' ? 'bg-[#2D2B55] text-white' : 'bg-red-600 text-white'}`}>
              {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <p className="font-bold text-sm tracking-tight">{toast.message}</p>
            </div>
          </motion.div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl overflow-hidden relative"
            >
              <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center text-red-600 mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className="text-[#2D2B55] font-black text-xl mb-2 tracking-tight">Hapus Akun?</h3>
              <p className="text-[#2D2B55]/85 text-sm font-medium leading-relaxed mb-8">
                Apakah Anda yakin ingin menghapus akun? Semua poin <span className="text-red-600 font-bold">{userData?.points} Pts</span> akan hangus selamanya.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleDeleteAccount}
                  disabled={isDeletingAccount}
                  className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
                >
                  {isDeletingAccount ? <Loader2 className="animate-spin" size={18} /> : 'Ya, Hapus Akun'}
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full py-4 bg-gray-50 text-[#2D2B55] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all font-bold"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
