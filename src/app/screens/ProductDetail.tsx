import { useState, useEffect } from "react";
import { ArrowLeft, Heart, Minus, Plus, ShoppingCart, Star, Clock } from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import api from "../../lib/api";
import logo from "figma:asset/c67b6433ddedf46738312a77f1fae7b733129f87.png";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

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
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
    };

    try {
      await api.post('/cart', payload);
    } catch (err) {
      console.error("Gagal addToCart via API, menyimpan ke localStorage:", err);
      const existingCart = JSON.parse(localStorage.getItem('picpic_cart') || '[]');
      const newItem = {
        id: Date.now(),
        menu_id: product.id,
        quantity: quantity,
        menu: { ...product }
      };

      const existingIndex = existingCart.findIndex((item: any) => item.menu_id === product.id);
      if (existingIndex >= 0) {
        existingCart[existingIndex].quantity += quantity;
      } else {
        existingCart.push(newItem);
      }
      localStorage.setItem('picpic_cart', JSON.stringify(existingCart));
    } finally {
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
      <div className="max-w-[390px] mx-auto relative bg-white min-h-screen shadow-2xl shadow-[#2D2B55]/5">
        
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
              <div className="flex items-center gap-1 ml-auto">
                <Star size={14} className="text-[#FFB800] fill-[#FFB800]" />
                <span className="text-[#2D2B55] font-bold text-xs">{product.rating || "4.8"}</span>
              </div>
            </div>

            <h1 className="text-[#2D2B55] font-black text-3xl leading-tight mb-2 uppercase">
              {product.name}
            </h1>
            
            <p className="text-[#6367FF] font-black text-2xl mb-6">
              Rp {Number(product.price).toLocaleString("id-ID")}
            </p>

            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-[#2D2B55] font-extrabold text-sm mb-2 uppercase tracking-wider opacity-40">Deskripsi</h3>
                <p className="text-[#2D2B55]/70 text-sm leading-relaxed font-medium">
                  {product.description || "Rasakan kenikmatan racikan kopi spesial dari barisista ahli kami, dibuat khusus untuk menambah semangat harimu di PicPic Cafe."}
                </p>
              </div>

              {/* Badges */}
              <div className="flex gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase opacity-30">Waktu</span>
                  <div className="flex items-center gap-1.5 text-[#2D2B55] font-bold text-xs">
                    <Clock size={14} className="text-[#6367FF]" />
                    <span>~12 Min</span>
                  </div>
                </div>
                <div className="w-px h-8 bg-[#2D2B55]/5" />
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase opacity-30">Suhu</span>
                  <div className="flex items-center gap-1.5 text-[#2D2B55] font-bold text-xs">
                    <span>Panas / Dingin</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mt-8 flex flex-col items-center">
            <h3 className="text-[#2D2B55] font-black text-[10px] uppercase tracking-widest mb-4 opacity-40">Jumlah Pesanan</h3>
            <div className="flex items-center gap-10 bg-white p-2 rounded-full shadow-lg shadow-[#2D2B55]/5 border border-[#2D2B55]/5">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-[#2D2B55]/5 text-[#2D2B55] hover:bg-[#F8F7FF] transition-colors active:scale-95"
              >
                <Minus size={20} strokeWidth={3} />
              </button>
              <span className="text-[#2D2B55] font-black text-2xl min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 bg-[#6367FF] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#6367FF]/30 hover:bg-[#4F53E8] transition-colors active:scale-95"
              >
                <Plus size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* FIXED BOTTOM CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-[390px] mx-auto px-6 pb-10 pt-6 bg-white/80 backdrop-blur-xl border-t border-[#2D2B55]/5 flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[#2D2B55]/40 text-[10px] font-black uppercase tracking-widest">Total Harga</span>
              <span className="text-[#2D2B55] font-black text-xl">
                Rp {(Number(product.price) * quantity).toLocaleString("id-ID")}
              </span>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="flex-1 h-16 bg-[#6367FF] text-white rounded-3xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-[#6367FF]/40 active:scale-95 transition-all hover:bg-[#4F53E8]"
            >
              <ShoppingCart size={18} strokeWidth={3} />
              Tambah
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}