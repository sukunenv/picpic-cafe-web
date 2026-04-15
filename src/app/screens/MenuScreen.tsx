import { useState, useEffect } from "react";
import { Search, Heart, ArrowLeft, Star, Coffee, UtensilsCrossed, Plus, CheckCircle2 } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import api from "../../lib/api";

/* ─── Helpers ──────────────────────────────────────────── */

function toTitleCase(str: string): string {
  if (!str) return str;
  return str
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ─── Shimmer Skeleton Card ─────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden bg-white shadow-sm border border-gray-50">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <div className="absolute inset-0 shimmer-sweep" />
      </div>
      <div className="p-3 space-y-2">
        <div className="h-3.5 rounded bg-gray-200 w-4/5" />
        <div className="h-3 rounded bg-gray-100 w-full" />
        <div className="flex justify-between items-center pt-2">
           <div className="h-4 bg-gray-200 rounded w-1/3" />
           <div className="h-8 w-8 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

/* ─── Empty State ────────────────────────────────────────── */
function EmptyState({ query }: { query: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-[#F4F3FF] flex items-center justify-center mb-4">
        <Search size={28} className="text-[#6367FF]/40" />
      </div>
      <p className="text-gray-900 font-semibold text-base mb-1">
        {query ? "Pencarian tidak ditemukan" : "Menu belum tersedia"}
      </p>
      <p className="text-gray-500 text-xs max-w-[200px]">
        Coba gunakan kata kunci lain atau pilih kategori yang berbeda.
      </p>
    </motion.div>
  );
}

export function MenuScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{ show: boolean, message: string, image?: string }>({ show: false, message: "" });

  const showFeedback = (item: any) => {
    setToast({ show: true, message: item.name, image: item.image });
    setTimeout(() => setToast({ show: false, message: "", image: undefined }), 3000);
  };

  const handleAddToCart = async (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();

    const payload = {
      menu_id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    };

    try {
      await api.post('/cart', payload);
      showFeedback(item);
    } catch (err) {
      console.error("Gagal addToCart via API:", err);
      const existingCart = JSON.parse(localStorage.getItem('picpic_cart') || '[]');
      const newItem = { id: Date.now(), menu_id: item.id, quantity: 1, menu: { ...item } };
      const existingIndex = existingCart.findIndex((i: any) => i.menu_id === item.id);
      if (existingIndex >= 0) existingCart[existingIndex].quantity += 1;
      else existingCart.push(newItem);
      localStorage.setItem('picpic_cart', JSON.stringify(existingCart));
      showFeedback(item);
    }
  };

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories([{ id: "all", name: "Semua", slug: "all" }, ...res.data]);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch ALL menus once to enable smooth client-side filtering
  useEffect(() => {
    const fetchAllMenus = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Selalu ambil seluruh menu agar filtering client-side bisa berjalan mulus
        const res = await api.get("/menus");
        setMenuItems(res.data);
      } catch (err: any) {
        console.error("Error fetching menus:", err);
        setError("Gagal memuat menu.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllMenus();
  }, []); // Hanya fetch sekali saat mounting

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    if (slug === "all") searchParams.delete("category");
    else searchParams.set("category", slug);
    setSearchParams(searchParams);
  };

  const filteredItems = menuItems.filter((item) => {
    // 1. Cek Ketersediaan (Status Off / On)
    if (!item.is_available) return false;

    // 2. Pencarian dan Kategori
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
      selectedCategory === "all" || 
      item.category?.slug === selectedCategory || 
      item.category?.name === selectedCategory ||
      item.category_id?.toString() === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <style>{`
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .shimmer-sweep {
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.7) 50%, transparent 60%);
          background-size: 200% 100%;
          animation: shimmer 1.6s infinite;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <main className="min-h-screen pb-24 bg-gray-50">
        {/* Header */}
        <div className="bg-white px-4 pt-12 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/" className="p-2 -ml-2 text-gray-800">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-black text-[#2D2B55] flex-1 tracking-tight">Menu Kami</h1>
            <button className="p-2 text-gray-400">
              <Search size={22} />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari menu favoritmu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#6367FF]/20 transition-all"
            />
          </div>
        </div>

        {/* 1. Kategoti Filter (Sticky Horizontal Scroll) */}
        <div className="sticky top-0 z-20 bg-white shadow-sm pt-1">
          <div className="flex overflow-x-auto whitespace-nowrap gap-2 px-4 pb-3 scrollbar-hide">
            {categories.map((category) => {
              const isActive = selectedCategory === (category.name || category.slug);
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.slug || category.name)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    selectedCategory === (category.slug || category.name)
                      ? "bg-[#6367FF] text-white shadow-lg shadow-[#6367FF]/20 scale-105"
                      : "bg-gray-100 text-gray-500 active:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Menu Grid */}
        <div className="mt-4">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 px-4">
              {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredItems.length === 0 ? (
            <EmptyState query={searchQuery} />
          ) : (
            <div key={selectedCategory} className="grid grid-cols-2 gap-3 px-4">
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col border border-gray-100"
                  >
                  <Link to={`/product/${item.id}`} className="flex flex-col h-full">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Text Contents */}
                    <div className="p-3 flex-1 flex flex-col relative">
                       <h3 className="text-sm font-black text-[#2D2B55] line-clamp-1 mb-0.5 tracking-tight group-hover:text-[#6367FF] transition-colors">
                        {toTitleCase(item.name)}
                      </h3>
                      {/* Deskripsi 1 baris */}
                      <p className="text-[10px] text-gray-400 line-clamp-1 mb-2 font-medium">
                         {item.description || "Pilihan terbaik untuk hari ini"}
                      </p>

                      <div className="mt-auto flex justify-between items-end">
                        <p className="text-[#6367FF] font-black text-sm tracking-tighter">
                          Rp {Number(item.price).toLocaleString("id-ID")}
                        </p>

                        {/* 3. Tombol "+" (Add to Cart) */}
                        <button 
                          onClick={(e) => handleAddToCart(e, item)}
                          className="w-8 h-8 rounded-full bg-[#6367FF] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
                        >
                          <Plus size={18} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* FLOATING MINI-BAR (PROFESSIONAL VERSION) */}
        <AnimatePresence>
          {toast.show && (
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="fixed bottom-24 left-4 right-4 z-[100] pointer-events-none flex justify-center"
            >
              <div className="pointer-events-auto min-w-[280px] max-w-full bg-black/80 backdrop-blur-2xl text-white pl-2 pr-5 py-2 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center gap-3 border border-white/10">
                {/* Product Thumbnail */}
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0">
                   <img src={toast.image} className="w-full h-full object-cover" alt="Added" />
                </div>
                
                <div className="flex-1 flex flex-col justify-center overflow-hidden">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#6367FF] leading-none mb-0.5">Item Ditambahkan</span>
                  <span className="text-xs font-bold truncate tracking-tight">{toast.message}</span>
                </div>
                
                <div className="w-px h-6 bg-white/10 mx-1" />
                
                <Link 
                  to="/cart"
                  className="text-[#6367FF] text-[10px] font-black uppercase tracking-tighter whitespace-nowrap hover:text-[#8494FF] transition-colors"
                >
                  Checkout →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </>
  );
}
