import { useState, useEffect } from "react";
import { ArrowLeft, Trash2, Tag, ChevronRight, Wallet, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import api from "../../lib/api";

const paymentMethods = [
  { id: "ewallet", name: "E-Wallet", icon: Wallet, detail: "GoPay, OVO, Dana" },
  { id: "card", name: "Credit Card", icon: CreditCard, detail: "Visa, Mastercard" },
];

export function CartScreen() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedPayment, setSelectedPayment] = useState("ewallet");
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/cart');
      setCartItems(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
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
      console.error("Error removing item:", err);
    }
  };

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      await api.post('/orders', { notes });
      alert("Pesanan berhasil! Terima kasih sudah memesan di PICPIC.");
      navigate("/profile"); // Go to profile to see orders
    } catch (err: any) {
      console.error("Error checking out:", err);
      alert(err.response?.data?.message || "Gagal membuat pesanan.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-[#6367FF] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#2D2B55]/60">Memuat keranjang...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 bg-[#F8F7FF]">
      {/* Clean Header */}
      <div className="bg-white sticky top-0 z-20 border-b border-[#2D2B55]/5">
        <div className="px-6 pt-12 pb-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-[#F8F7FF] rounded-full transition-colors">
              <ArrowLeft className="text-[#2D2B55]" size={24} />
            </Link>
            <div className="flex-1">
              <h1 className="text-[#2D2B55] font-bold text-2xl">Keranjang</h1>
              <p className="text-[#2D2B55]/60 text-sm">{cartItems.length} item</p>
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
            <p className="text-[#2D2B55]/60 text-base mb-6">Keranjang masih kosong</p>
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
            <div className="mb-8">
              <h2 className="text-[#2D2B55] font-bold text-lg mb-4">Pesanan Anda</h2>
              <div className="space-y-3">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-4 flex gap-3"
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
                      <h3 className="text-[#2D2B55] font-semibold text-sm mb-1 line-clamp-1">
                        {item.menu?.name || "Menu tidak dikenal"}
                      </h3>
                      <p className="text-[#6367FF] font-bold text-base mb-2">
                        Rp {Number(item.menu?.price || 0).toLocaleString("id-ID")}
                      </p>
                      <span className="text-[#2D2B55]/60 text-xs bg-[#F8F7FF] px-3 py-1 rounded-full">
                        {item.quantity}x
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

            {/* Notes */}
            <div className="mb-8">
              <h2 className="text-[#2D2B55] font-bold text-lg mb-4">Catatan Pesanan</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Es batu dipisah, kurangin gula, dll."
                rows={3}
                className="w-full px-4 py-3 bg-white rounded-xl text-[#2D2B55] placeholder:text-[#2D2B55]/40 border border-[#2D2B55]/10 focus:outline-none focus:border-[#6367FF] transition-colors resize-none"
              />
            </div>

            {/* Payment */}
            <div className="mb-8">
              <h2 className="text-[#2D2B55] font-bold text-lg mb-4">Pembayaran</h2>
              <div className="space-y-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`w-full bg-white rounded-xl p-4 flex items-center gap-3 transition-all ${
                        selectedPayment === method.id
                          ? "border-2 border-[#6367FF]"
                          : "border border-[#2D2B55]/10"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedPayment === method.id ? "bg-[#6367FF]" : "bg-[#F8F7FF]"
                      }`}>
                        <Icon className={selectedPayment === method.id ? "text-white" : "text-[#6367FF]"} size={20} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-[#2D2B55] font-semibold text-sm">{method.name}</p>
                        <p className="text-[#2D2B55]/60 text-xs">{method.detail}</p>
                      </div>
                      <ChevronRight className="text-[#2D2B55]/40" size={18} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <div className="mb-6 bg-white rounded-2xl p-5 border border-[#2D2B55]/5">
              <h2 className="text-[#2D2B55] font-bold text-lg mb-4">Ringkasan</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-[#2D2B55]/60 text-sm">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-[#2D2B55]/60 text-sm">
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
                <span className="text-[#2D2B55] font-bold">Total</span>
                <span className="text-[#6367FF] font-bold text-2xl">Rp {total.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Fixed Checkout */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#2D2B55]/5 p-6 z-20">
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full bg-[#6367FF] text-white py-4 rounded-full font-bold active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isCheckingOut && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            {isCheckingOut ? "Memproses..." : "Pesan Sekarang"}
          </button>
        </div>
      )}
    </div>
  );
}