import { useState, useEffect } from "react";
import { ArrowLeft, Trash2, Tag, ChevronRight, Banknote, QrCode, Building2, CheckCircle2, MapPin, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import api from "../../lib/api";

const paymentMethods = [
  { id: "cash", name: "Cash", icon: Banknote, detail: "Bayar di Kasir" },
  { id: "qris", name: "QRIS", icon: QrCode, detail: "Otomatis & Cepat" },
  { id: "transfer", name: "Transfer", icon: Building2, detail: "Konfirmasi Manual" },
];

export function CartScreen() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedPayment, setSelectedPayment] = useState("cash");
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [notes, setNotes] = useState("");
  const [bankInfo, setBankInfo] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [tableNumber, setTableNumber] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchCart();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      setUserData(res.data);
    } catch (err) {
      console.error("Gagal ambil profil", err);
    }
  };

  useEffect(() => {
    if (selectedPayment === 'transfer' && !bankInfo) {
      fetchBankInfo();
    }
  }, [selectedPayment]);

  const fetchBankInfo = async () => {
    try {
      const res = await api.get('/settings/bank-info');
      setBankInfo(res.data);
    } catch (err) {
      console.error("Gagal ambil bank info", err);
    }
  };

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/cart');
      setCartItems(res.data);
    } catch (err) {
      console.error("Error fetching cart API, fallback to localStorage:", err);
      const localCart = JSON.parse(localStorage.getItem('picpic_cart') || '[]');
      setCartItems(localCart);
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.menu?.price || 0) * item.quantity), 0);
  const deliveryFee = 0; // Free for now as it's a cafe
  const discount = 0;
  const total = subtotal + deliveryFee - discount;

  const removeItem = async (id: number) => {
    try {
      await api.delete(`/cart/${id}`);
      setCartItems(cartItems.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error removing item API, fallback to localStorage:", err);
      const newLocalCart = cartItems.filter((item) => item.id !== id);
      setCartItems(newLocalCart);
      localStorage.setItem('picpic_cart', JSON.stringify(newLocalCart));
    }
  };

  const handleCheckout = async () => {
    if (!selectedPayment) return;
    
    try {
      setIsCheckingOut(true);
      const res = await api.post('/orders', { 
        customer_name: userData?.name || 'Customer',
        table_number: tableNumber || null,
        notes, 
        payment_method: selectedPayment,
        total: total 
      });
      
      setLastOrder(res.data);
      
      // Clear cart on backend
      try { await api.delete('/cart/clear'); } catch(e) { console.error("Clear cart failed", e); }
      
      localStorage.removeItem('picpic_cart');
      setCartItems([]);
      
      // Success interaction
      setShowSuccessModal(true);
      
      setTimeout(() => {
        navigate("/"); 
      }, 2500);

    } catch (err: any) {
      console.error("Error checking out:", err);
      alert(err.response?.data?.message || "Gagal memproses pesanan.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-[#6367FF] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#2D2B55]/85">Memuat keranjang...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 bg-[#F8F7FF]">
      {/* Clean Header */}
      <div className="bg-white sticky top-0 z-20 border-b border-[#2D2B55]/5">
        <div className="px-6 pt-10 pb-3">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-[#F8F7FF] rounded-full transition-colors">
              <ArrowLeft className="text-[#2D2B55]" size={24} />
            </Link>
            <div className="flex-1">
              <h1 className="text-[#2D2B55] font-black text-2xl tracking-tighter">Keranjang</h1>
              <p className="text-[#2D2B55]/40 text-[10px] font-black uppercase tracking-widest leading-none mt-1">{cartItems.length} item tersimpan</p>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-6 mt-6"
      >
        {/* Cart Items */}
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#C9BEFF]/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Tag className="text-[#6367FF]" size={32} />
            </div>
            <p className="text-[#2D2B55]/85 text-base mb-6">Keranjang masih kosong</p>
            <Link
              to="/menu"
              className="inline-block px-8 py-3 bg-[#6367FF] text-white rounded-full font-bold active:scale-95 transition-transform"
            >
              Belanja Sekarang
            </Link>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="mb-6">
              <h2 className="text-[#2D2B55] font-black text-sm uppercase tracking-widest opacity-40 mb-3">Daftar Pesanan</h2>
              <div className="space-y-3">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-[28px] p-4 flex gap-4 shadow-sm shadow-[#2D2B55]/5 border border-[#2D2B55]/5 group"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.menu?.image ? (
                        <img
                          src={item.menu.image}
                          alt={item.menu.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#2D2B55]/20">No pic</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#2D2B55] font-bold text-sm mb-0.5 line-clamp-1">
                        {item.menu?.name || "Menu tidak dikenal"}
                      </h3>
                      <p className="text-[#6367FF] font-black text-base mb-2 tracking-tighter">
                        Rp {Number(item.menu?.price || 0).toLocaleString("id-ID")}
                      </p>
                      <span className="text-[#2D2B55] font-black text-[10px] bg-[#F8F7FF] px-3 py-1.5 rounded-full uppercase tracking-widest">
                        {item.quantity}x Pesanan
                      </span>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="self-start p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="text-red-500" size={18} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Table Number & Notes */}
            <div className="mb-8 space-y-4">
              <div>
                <h2 className="text-[#2D2B55] font-black text-sm uppercase tracking-widest opacity-40 mb-3">Informasi Meja</h2>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6367FF]/40" size={18} />
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Contoh: 5, A3, VIP (Opsional)"
                    className="w-full pl-11 pr-4 py-2.5 bg-white rounded-2xl text-[#2D2B55] font-bold placeholder:text-[#2D2B55]/30 border border-[#2D2B55]/10 focus:outline-none focus:border-[#6367FF] shadow-sm shadow-[#2D2B55]/5 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-[#2D2B55] font-black text-sm uppercase tracking-widest opacity-40 mb-3">Instruksi Tambahan</h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Es batu dipisah, kurangin gula, dll."
                  rows={2}
                  className="w-full px-4 py-3 bg-white rounded-2xl text-[#2D2B55] font-medium placeholder:text-[#2D2B55]/30 border border-[#2D2B55]/10 focus:outline-none focus:border-[#6367FF] shadow-sm shadow-[#2D2B55]/5 transition-all resize-none text-sm"
                />
              </div>
            </div>

            {/* Payment */}
            <div className="mb-6">
              <h2 className="text-[#2D2B55] font-black text-sm uppercase tracking-widest opacity-40 mb-3">Metode Pembayaran</h2>
              <div className="grid grid-cols-3 gap-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all border-2 ${
                        selectedPayment === method.id
                          ? "bg-[#6367FF] border-[#6367FF] shadow-lg shadow-[#6367FF]/30 scale-[1.02]"
                          : "bg-white border-transparent shadow-sm shadow-[#2D2B55]/5"
                      }`}
                    >
                      <div className={`p-1.5 rounded-xl mb-1 transition-all ${
                        selectedPayment === method.id ? "bg-white text-[#6367FF]" : "bg-[#F8F7FF] text-[#6367FF]"
                      }`}>
                        <Icon size={18} />
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-widest ${
                        selectedPayment === method.id ? "text-white" : "text-[#2D2B55]/30"
                      }`}>{method.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Payment Details */}
              <AnimatePresence mode="wait">
                {selectedPayment === 'qris' && (
                  <motion.div
                    key="qris-box"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 bg-white rounded-3xl p-6 border border-[#2D2B55]/5 text-center shadow-lg shadow-[#2D2B55]/5"
                  >
                    <p className="text-[#2D2B55]/40 text-[10px] font-black uppercase tracking-widest mb-4">Scan QRIS Untuk Bayar</p>
                    <div className="bg-[#F8F7FF] p-4 rounded-2xl mb-4 inline-block">
                      <img src="/qris.png" alt="QRIS" className="w-48 h-48 object-contain" />
                    </div>
                    <p className="text-[#2D2B55] font-black text-xl mb-1">Rp {total.toLocaleString("id-ID")}</p>
                    <p className="text-[#2D2B55]/85 text-xs">Simpan QR dan scan di aplikasi e-wallet kamu</p>
                  </motion.div>
                )}

                {selectedPayment === 'transfer' && (
                  <motion.div
                    key="transfer-box"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 bg-[#2D2B55] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-6">Informasi Rekening</p>
                    
                    {bankInfo ? (
                      <div className="space-y-4 relative z-10">
                        <div>
                          <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-1">Nama Bank</p>
                          <p className="text-xl font-black">{bankInfo.bank_name}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-1">Nomor Rekening</p>
                            <p className="text-2xl font-black tracking-tighter">{bankInfo.bank_account_number}</p>
                          </div>
                          <button 
                            onClick={() => navigator.clipboard.writeText(bankInfo.bank_account_number)}
                            className="bg-white/10 p-3 rounded-2xl hover:bg-white/20 transition-all active:scale-95"
                          >
                            <Tag size={18} className="text-white rotate-45" />
                          </button>
                        </div>
                        <div className="pt-4 border-t border-white/10">
                          <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-1">Atas Nama</p>
                          <p className="text-sm font-bold opacity-90">{bankInfo.bank_account_name}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 py-6">
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span className="text-xs font-bold opacity-60">Mengambil info bank...</span>
                      </div>
                    )}
                  </motion.div>
                )}

                {selectedPayment === 'cash' && (
                  <motion.div
                    key="cash-box"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 bg-[#6367FF]/10 border border-[#6367FF]/20 rounded-3xl p-6 flex flex-col items-center gap-2"
                  >
                    <Banknote className="text-[#6367FF] mb-2" size={32} />
                    <p className="text-[#6367FF] font-black text-sm uppercase tracking-widest">Bayar di Kasir</p>
                    <p className="text-[#2D2B55]/85 text-xs text-center">Silakan selesaikan pesanan dan lakukan pembayaran di kasir outlet kami.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="mb-6 bg-white rounded-[32px] p-6 border border-[#2D2B55]/5 shadow-sm shadow-[#2D2B55]/5">
              <h2 className="text-[#2D2B55] font-black text-lg tracking-tight mb-4">Ringkasan Pembayaran</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-[#2D2B55]/85 text-sm">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-[#2D2B55]/85 text-sm">
                    <span>Pengiriman</span>
                    <span>Rp {deliveryFee.toLocaleString("id-ID")}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-[#6367FF] text-sm">
                    <span>Diskon</span>
                    <span>- Rp {discount.toLocaleString("id-ID")}</span>
                  </div>
                )}
              </div>
              <div className="pt-3 border-t border-[#2D2B55]/10 flex justify-between items-center">
                <span className="text-[#2D2B55] font-black text-sm uppercase tracking-widest opacity-40">Total Tagihan</span>
                <span className="text-[#6367FF] font-black text-2xl tracking-tighter">Rp {total.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Expandable Checkout Button Above BottomNav */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-24 inset-x-0 z-[51] flex justify-center px-5 pointer-events-none">
          <div className="w-full max-w-md flex justify-end">
            <motion.div
              layout
              initial={false}
              animate={{ 
                width: isExpanded ? "100%" : "64px",
              }}
              className="bg-[#6367FF] rounded-[32px] shadow-[0_20px_50px_rgba(99,103,255,0.4)] overflow-hidden pointer-events-auto relative"
            >
              <div className="flex items-center h-16 w-full">
                {/* Trigger Button (On the LEFT when expanded) */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-16 h-16 flex-shrink-0 flex items-center justify-center text-white relative z-20"
                >
                  {isExpanded ? (
                    <motion.div
                      initial={{ rotate: -180 }}
                      animate={{ rotate: 0 }}
                    >
                      <ChevronRight size={28} strokeWidth={3} />
                    </motion.div>
                  ) : (
                    <div className="relative">
                      <ShoppingCart size={24} strokeWidth={2.5} />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-[#6367FF] text-[10px] font-black rounded-full flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    </div>
                  )}
                </button>

                {/* Expanded Content - Content on the right of the arrow */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-1 flex items-center justify-between pr-4 overflow-hidden whitespace-nowrap"
                    >
                      <div className="flex flex-col items-start mr-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white/90">Total Tagihan</span>
                        <span className="text-lg font-black tracking-tight text-white">Rp {total.toLocaleString("id-ID")}</span>
                      </div>
                      
                      <button
                        onClick={handleCheckout}
                        disabled={isCheckingOut || !selectedPayment}
                        className="bg-white text-[#6367FF] px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                      >
                        {isCheckingOut ? "..." : "Bayar"}
                        <ChevronRight size={14} strokeWidth={4} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Shimmer Effect */}
                {!isExpanded && (
                  <motion.div 
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full skew-x-[-20deg]"
                  />
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-gradient-to-br from-[#6367FF] to-[#8B5CF6] flex flex-col items-center justify-center p-8 text-center"
          >
            {/* Sparkling Circles Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.3, 0.1],
                    x: [0, Math.random() * 20 - 10, 0],
                    y: [0, Math.random() * 20 - 10, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: Math.random() * 100 + 50,
                    height: Math.random() * 100 + 50,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    filter: 'blur(40px)'
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 w-full max-w-sm">
              {/* Animated Checkmark */}
              <motion.div
                initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 12, delay: 0.3 }}
                className="w-28 h-28 bg-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-indigo-900/40"
              >
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <CheckCircle2 size={56} className="text-[#6367FF]" strokeWidth={3} />
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-white font-black text-4xl mb-3 tracking-tighter">Pesanan Berhasil! 🎉</h2>
                <p className="text-white/80 text-sm mb-12 font-medium">Barista kami sedang menyiapkan pesananmu</p>
              </motion.div>

              {/* Order Info Card */}
              <motion.div
                initial={{ y: 40, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="bg-white rounded-[32px] p-8 text-left shadow-2xl shadow-indigo-900/30 mb-12"
              >
                <div className="space-y-6">
                  <div>
                    <p className="text-[#2D2B55]/40 text-[10px] uppercase font-black tracking-widest mb-1.5">No. Order</p>
                    <p className="text-[#2D2B55] font-black text-lg tracking-tight">{lastOrder?.order_number || 'ORD-000000'}</p>
                  </div>
                  <div className="flex justify-between items-end border-t border-[#F8F7FF] pt-5">
                    <div>
                      <p className="text-[#2D2B55]/40 text-[10px] uppercase font-black tracking-widest mb-1">Metode Bayar</p>
                      <p className="text-[#2D2B55] font-bold text-sm uppercase tracking-wide">{lastOrder?.payment_method || 'CASH'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#2D2B55]/40 text-[10px] uppercase font-black tracking-widest mb-1">Total</p>
                      <p className="text-[#6367FF] font-black text-2xl tracking-tighter">Rp {Number(lastOrder?.total || total).toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center justify-center gap-3"
              >
                <span className="text-white/60 font-bold text-xs tracking-widest uppercase">Mengalihkan ke beranda</span>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1.5 h-1.5 bg-white rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
