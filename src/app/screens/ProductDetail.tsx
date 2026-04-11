import { useState, useEffect } from "react";
import { ArrowLeft, Heart, Minus, Plus, ShoppingCart, Star, Clock } from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
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
        // Assuming your backend returns a single menu object for this route
        const res = await api.get(`/menus/${id}`);
        // Support common Laravel patterns (res.data or res.data.data)
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

  const handleAddToCart = () => {
    // Add to cart logic here
    navigate("/cart");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-[#6367FF] border-t-transparent animate-spin" />
        <p className="text-[#6367FF] font-semibold">Memuat menu...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] flex items-center justify-center p-6 text-center">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100">
          <p className="text-red-500 font-medium mb-4">{error || "Produk tidak ditemukan."}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-[#6367FF] text-white rounded-full font-medium"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7FF]">
      {/* Full Screen Hero Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[55vh]"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => (e.currentTarget.src = logo)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#6367FF] to-[#C9BEFF] flex items-center justify-center">
            <span className="text-white/50 text-xl font-bold">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2D2B55]/70 via-transparent to-[#2D2B55]/30" />

        {/* Top Navigation */}
        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 bg-white/95 backdrop-blur-sm rounded-full"
          >
            <ArrowLeft className="text-[#2D2B55]" size={22} />
          </button>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2.5 bg-white/95 backdrop-blur-sm rounded-full"
          >
            <Heart
              className={isFavorite ? "text-[#6367FF] fill-[#6367FF]" : "text-[#2D2B55]"}
              size={22}
            />
          </button>
        </div>

        {/* Info Badges */}
        <div className="absolute bottom-6 left-6 right-6 flex gap-3">
          {Number(product.rating) > 0 && (
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
              <Star size={16} className="text-[#FFDBFD] fill-[#FFDBFD]" />
              <span className="text-[#2D2B55] font-bold text-sm">{Number(product.rating).toFixed(1)}</span>
              {product.reviews && <span className="text-[#2D2B55]/60 text-sm">({product.reviews})</span>}
            </div>
          )}
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
            <Clock size={16} className="text-[#6367FF]" />
            <span className="text-[#2D2B55] font-bold text-sm">
              {product.preparationTime || "10-15 min"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-6 py-8 pb-36"
      >
        {/* Product Name & Price */}
        <div className="mb-8">
          {product.category && (
            <p className="text-[#6367FF] font-black uppercase tracking-widest text-xs mb-2">
              {product.category.name}
            </p>
          )}
          <h1 className="text-[#2D2B55] font-black text-4xl mb-4 leading-tight">
            {product.name}
          </h1>
          <p className="text-[#6367FF] font-bold text-3xl">
            Rp {Number(product.price).toLocaleString("id-ID")}
          </p>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-[#2D2B55] font-bold text-lg mb-3">Tentang</h2>
          <p className="text-[#2D2B55]/70 text-base leading-relaxed">
            {product.description || "Menu spesial The Picpic Cafe."}
          </p>
        </div>

        {/* Ingredients */}
        {product.ingredients && product.ingredients.length > 0 && (
          <div className="mb-8">
            <h2 className="text-[#2D2B55] font-bold text-lg mb-3">Bahan</h2>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map((ingredient: string) => (
                <span
                  key={ingredient}
                  className="px-4 py-2 bg-[#C9BEFF]/20 rounded-full text-[#2D2B55] text-sm font-medium"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="mb-6">
          <h2 className="text-[#2D2B55] font-bold text-lg mb-4">Jumlah</h2>
          <div className="flex items-center justify-center gap-8">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 bg-[#F8F7FF] rounded-full flex items-center justify-center border-2 border-[#2D2B55]/10 active:scale-95 transition-transform"
            >
              <Minus className="text-[#2D2B55]" size={20} />
            </button>
            <span className="text-[#2D2B55] font-bold text-3xl w-16 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-12 bg-[#6367FF] rounded-full flex items-center justify-center active:scale-95 transition-transform"
            >
              <Plus className="text-white" size={20} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#2D2B55]/5 p-6 z-20">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-[#2D2B55]/60 text-xs mb-1">Total</p>
            <p className="text-[#2D2B55] font-bold text-xl">
              Rp {(Number(product.price) * quantity).toLocaleString("id-ID")}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#6367FF] text-white py-4 rounded-full font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <ShoppingCart size={20} />
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
}