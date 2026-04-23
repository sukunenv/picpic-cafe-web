import { useState, useEffect } from "react";
import { ArrowLeft, Heart, Minus, Plus, ShoppingCart, Star, Clock, ChevronRight, X } from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import api from "../../lib/api";
import logo from "figma:asset/c67b6433ddedf46738312a77f1fae7b733129f87.png";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [notes, setNotes] = useState("");

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)

  const getDiscountedPrice = (price: number, promo: any) => {
    if (!promo) return price;
    if (promo.type === 'percent') {
      return price * (1 - promo.value / 100);
    } else {
      return Math.max(0, price - promo.value);
    }
  };

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/menus/${id}`);
        setProduct(res.data.data || res.data);
      } catch (err: any) {
        console.error("Error fetching product detail:", err);
        setError("Gagal memuat detail menu.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    const payload = {
      menu_id: product.id,
      variant_id: selectedVariant?.id ?? null,
      name: product.name,
      price: selectedVariant ? selectedVariant.price : product.price,
      quantity: quantity,
      image: product.image,
      variant_name: selectedVariant?.name ?? null,
      notes: notes.trim() || null,
    };

    try {
      await api.post('/cart', payload);
    } catch (err) {
      console.error("Gagal addToCart via API, menyimpan ke localStorage:", err);
      const existingCart = JSON.parse(localStorage.getItem('picpic_cart') || '[]');
      const newItem = {
        id: Date.now(),
        menu_id: product.id,
        variant_id: selectedVariant?.id ?? null,
        quantity: quantity,
        menu: { ...product },
        variant: selectedVariant ? { ...selectedVariant } : null
      };

      const existingIndex = existingCart.findIndex((item: any) => item.menu_id === product.id && item.variant_id === (selectedVariant?.id ?? null));
      if (existingIndex >= 0) {
        existingCart[existingIndex].quantity += quantity;
      } else {
        existingCart.push(newItem);
      }
      localStorage.setItem('picpic_cart', JSON.stringify(existingCart));
    } finally {
      setNotes("");
      navigate("/cart");
    }
  };

  const optimizeImage = (url: string | undefined, width = 1000, height = 1000) => {
    if (!url || !url.includes('res.cloudinary.com')) return url;
    if (url.includes('/upload/') && !url.includes('q_auto')) {
      return url.replace('/upload/', `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`);
    }
    return url;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] p-0 animate-pulse">
        <div className="relative h-[55vh] w-full bg-gray-200" />
        <div className="relative -mt-16 px-6 pb-40">
          <div className="bg-white rounded-[40px] p-8 shadow-xl">
            <div className="w-24 h-6 bg-gray-200 rounded-full mb-4" />
            <div className="w-3/4 h-8 bg-gray-200 rounded-lg mb-2" />
            <div className="w-1/3 h-6 bg-gray-200 rounded-lg mb-6" />
            <div className="space-y-3">
              <div className="w-full h-4 bg-gray-200 rounded" />
              <div className="w-full h-4 bg-gray-200 rounded" />
              <div className="w-2/3 h-4 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-[#2D2B55]/5">
          <p className="text-red-500 font-bold text-lg mb-6">{error || "Produk tidak ditemukan."}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-[#6367FF] text-white rounded-full font-bold shadow-lg shadow-[#6367FF]/20"
          >
            Kembali ke Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7FF] font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-md mx-auto relative bg-white min-h-screen">
        
        {/* HERO IMAGE SECTION */}
        <div className="relative h-[55vh] w-full overflow-hidden">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            src={optimizeImage(product.image) || "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=1000&auto=format&fit=crop"}
            alt={product.name}
            onError={(e) => (e.currentTarget.src = logo)}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay Gradients */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#2D2B55]/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#F8F7FF] via-[#F8F7FF]/40 to-transparent" />

          {/* Top Buttons Overlay */}
          <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="w-12 h-12 bg-white/95 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg shadow-[#2D2B55]/10 active:scale-95 transition-transform"
            >
              <ArrowLeft className="text-[#2D2B55]" size={22} />
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-12 h-12 bg-white/95 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg shadow-[#2D2B55]/10 active:scale-95 transition-transform"
            >
              <Heart
                className={isFavorite ? "text-[#FF4D4D] fill-[#FF4D4D]" : "text-[#2D2B55]"}
                size={22}
              />
            </button>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          className="relative -mt-16 px-6 pb-40 bg-transparent"
        >
          {/* Main Info Card */}
          <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-[#2D2B55]/5 border border-[#2D2B55]/5">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-[#6367FF]/10 text-[#6367FF] text-[10px] font-black uppercase tracking-widest rounded-full">
                {product.category?.name || "Premium Cafe"}
              </span>
              {product.promo && (
                <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-orange-500/20">
                  {product.promo.name}
                </span>
              )}
              <div className="flex items-center gap-1 ml-auto">
                <Star size={14} className="text-[#FFB800] fill-[#FFB800]" />
                <span className="text-[#2D2B55] font-bold text-xs">{product.rating || "4.8"}</span>
              </div>
            </div>

            <h1 className="text-[#2D2B55] font-black text-3xl leading-tight mb-2 tracking-tighter">
              {product.name}
            </h1>
            
            <div className="mb-6">
              {product.promo && (
                <p className="text-[12px] text-gray-400 line-through leading-none mb-1">
                  {!selectedVariant && product.variants && product.variants.length > 0 && (
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mr-2">Mulai</span>
                  )}
                  {formatPrice(selectedVariant ? selectedVariant.price : (product.variants && product.variants.length > 0 ? Math.min(...product.variants.map((v: any) => v.price)) : Number(product.price)))}
                </p>
              )}
              <p className="text-[#6367FF] font-black text-2xl flex items-center">
                {!selectedVariant && product.variants && product.variants.length > 0 && (
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mr-2">Mulai dari</span>
                )}
                {formatPrice(getDiscountedPrice(selectedVariant ? selectedVariant.price : (product.variants && product.variants.length > 0 ? Math.min(...product.variants.map((v: any) => v.price)) : Number(product.price)), product.promo))}
              </p>
            </div>

            {/* INLINE VARIANT SELECTION */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <h3 className="text-[#2D2B55] font-black text-[10px] mb-3 uppercase tracking-[0.2em] opacity-30">Pilih Varian</h3>
                <div className="flex flex-col gap-2">
                  {product.variants.map((variant: any) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all text-left ${
                        selectedVariant?.id === variant.id 
                          ? 'border-[#6367FF] bg-[#6367FF]/5' 
                          : 'border-gray-100 hover:border-[#6367FF]/30 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`font-bold text-sm ${selectedVariant?.id === variant.id ? 'text-[#6367FF]' : 'text-[#2D2B55]'}`}>
                        {variant.name}
                      </span>
                      <div className="text-right">
                        {product.promo && (
                          <p className="text-[10px] text-gray-400 line-through leading-none mb-0.5">
                            {formatPrice(Number(variant.price))}
                          </p>
                        )}
                        <span className={`font-black text-sm ${selectedVariant?.id === variant.id ? 'text-[#6367FF]' : 'text-gray-500'}`}>
                          {formatPrice(getDiscountedPrice(Number(variant.price), product.promo))}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Slim Horizontal Quantity Selector */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#2D2B55]/5">
              <div className="flex flex-col">
                <span className="text-[#2D2B55] font-black text-sm uppercase tracking-tight">Jumlah</span>
                <span className="text-[#2D2B55]/40 text-[10px] font-bold">Sesuaikan pesanan</span>
              </div>
              <div className="flex items-center gap-5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#2D2B55]/5 text-[#2D2B55] active:scale-95 transition-all"
                >
                  <Minus size={16} strokeWidth={3} />
                </button>
                <span className="text-[#2D2B55] font-black text-xl min-w-[24px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-[#6367FF] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#6367FF]/20 active:scale-95 transition-all"
                >
                  <Plus size={16} strokeWidth={3} />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-[#2D2B55] font-black text-[10px] mb-2 uppercase tracking-[0.2em] opacity-30">Deskripsi Produk</h3>
                <p className="text-[#2D2B55]/70 text-sm leading-relaxed font-bold">
                  {product.description || "Rasakan kenikmatan racikan kopi spesial dari barisista ahli kami, dibuat khusus untuk menambah semangat harimu di PicPic Cafe."}
                </p>
              </div>

              {/* Badges */}
              <div className="flex gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase opacity-30">Waktu</span>
                    <span className="text-[#2D2B55] font-black text-xs tracking-tight">
                      <Clock size={14} className="text-[#6367FF] inline mr-1.5" />
                      ~12 Menit
                    </span>
                </div>
                <div className="w-px h-8 bg-[#2D2B55]/5" />
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase opacity-30">Suhu</span>
                    <span className="text-[#2D2B55] font-black text-xs tracking-tight">Panas / Dingin</span>
                </div>
              </div>

              {/* Notes Input */}
              <div>
                <h3 className="text-[#2D2B55] font-black text-[10px] mb-2 uppercase tracking-[0.2em] opacity-30">Catatan</h3>
                <input
                  type="text"
                  placeholder="Contoh: less sugar, extra shot, dll. (opsional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F8F7FF] rounded-2xl text-[#2D2B55] text-sm font-medium placeholder:text-[#2D2B55]/25 border border-[#2D2B55]/5 focus:outline-none focus:border-[#6367FF] transition-all"
                />
              </div>
            </div>
          </div>

        </motion.div>

        {/* Floating Expandable ADD TO CART Button Above BottomNav */}
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md px-5 z-[51] flex flex-col items-center pointer-events-none">
          <motion.div
            layout
            initial={false}
            animate={{ 
              width: isExpanded ? "100%" : "64px",
              x: isExpanded ? 0 : 140
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
                  <Plus size={28} strokeWidth={3} />
                )}
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex items-center justify-between pr-4 overflow-hidden whitespace-nowrap"
                  >
                    <div className="flex flex-col items-start mr-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white/90">Total Harga</span>
                      <span className="text-xl font-black tracking-tight text-white flex items-center">
                        {!selectedVariant && product.variants && product.variants.length > 0 && (
                          <span className="text-[8px] opacity-70 font-bold uppercase tracking-widest mr-1">Mulai</span>
                        )}
                        {formatPrice((selectedVariant ? selectedVariant.price : (product.variants && product.variants.length > 0 ? Math.min(...product.variants.map((v: any) => v.price)) : Number(product.price))) * quantity)}
                      </span>
                    </div>
                    
                    <button
                      onClick={handleAddToCart}
                      disabled={product.variants && product.variants.length > 0 && !selectedVariant}
                      className={`px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all shadow-lg ${
                        product.variants && product.variants.length > 0 && !selectedVariant 
                          ? 'bg-white/50 text-white/80 cursor-not-allowed' 
                          : 'bg-white text-[#6367FF]'
                      }`}
                    >
                      {product.variants && product.variants.length > 0 && !selectedVariant ? (
                        "Pilih Varian"
                      ) : (
                        <>
                          <ShoppingCart size={14} strokeWidth={4} />
                          Tambahkan
                        </>
                      )}
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
    </div>
  );
}
