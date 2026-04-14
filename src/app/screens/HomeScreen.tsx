import { Search, ChevronRight, Heart, Star, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { useState, useEffect, useMemo } from "react";
import { useApiCache } from "../../lib/useApiCache";
import logo from "figma:asset/c67b6433ddedf46738312a77f1fae7b733129f87.png";

export function HomeScreen() {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Selamat Pagi"
      : currentHour < 18
      ? "Selamat Siang"
      : "Selamat Malam";

  // --- Cached API calls (stale after 5 minutes) ---
  const { data: categoriesData, isLoading: loadingCats } = useApiCache<any[]>(
    'categories',
    '/categories',
    { staleTime: 5 * 60 * 1000 }
  );
  const { data: menusData, isLoading: loadingMenus } = useApiCache<any[]>(
    'menus',
    '/menus',
    { staleTime: 5 * 60 * 1000 }
  );
  const { data: bannersData, isLoading: loadingBanners, error } = useApiCache<any[]>(
    'banners',
    '/banners',
    { staleTime: 5 * 60 * 1000 }
  );

  const isLoading = loadingCats || loadingMenus || loadingBanners;

  const categories = categoriesData ?? [];
  const popularMenu = useMemo(() => (menusData ?? []).slice(0, 4), [menusData]);

  const defaultBanners = [
    { id: 'def1', title: 'Buy 1 Get 1 Free', subtitle: 'Semua minuman coffee', tag: 'Promo Hari Ini', type: 'gradient', gradient_start: '#6367FF', gradient_end: '#8B5CF6' },
    { id: 'def2', title: 'Welcome Member', subtitle: 'Diskon 50% transaksi pertama', tag: 'New Offer', type: 'gradient', gradient_start: '#8B5CF6', gradient_end: '#EC4899' },
    { id: 'def3', title: 'Free Pastry', subtitle: 'Min. belanja 100k', tag: 'Special', type: 'gradient', gradient_start: '#2D2B55', gradient_end: '#6367FF' },
  ];

  const banners = useMemo(() => {
    const active = (bannersData ?? []).filter((b: any) => b.is_active);
    return active.length > 0 ? active : defaultBanners;
  }, [bannersData]);

  // Carousel logic snippet (simple auto-slide)
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const optimizeImage = (url: string | undefined, width = 500, height = 500) => {
    if (!url || !url.includes('res.cloudinary.com')) return url;
    if (url.includes('/upload/') && !url.includes('q_auto')) {
      return url.replace('/upload/', `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`);
    }
    return url;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] px-6 animate-pulse pt-10">
        <div className="flex justify-between items-center mb-10">
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full" />
            <div className="space-y-2">
              <div className="w-20 h-3 bg-gray-200 rounded-full" />
              <div className="w-32 h-4 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>
        <div className="w-full h-48 bg-gray-200 rounded-[30px] mb-12" />
        <div className="mb-8">
          <div className="w-32 h-6 bg-gray-200 rounded-full mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full aspect-square bg-gray-200 rounded-2xl" />
            <div className="w-full aspect-square bg-gray-200 rounded-2xl" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="w-full h-28 bg-gray-200 rounded-2xl" />
          <div className="w-full h-28 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] flex items-center justify-center p-6 text-center">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100">
          <p className="text-red-500 font-medium mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#6367FF] text-white rounded-full font-medium"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const activeBanner = banners[currentBannerIndex] || banners[0];

  return (
    <main className="min-h-screen bg-[#F8F7FF]">
      {/* FULL BLEED HERO */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[70vh] overflow-hidden"
      >
        {/* Hero Image */}
        <div className="absolute inset-0">
          <img
            fetchpriority="high"
            loading="eager"
            src={optimizeImage(banners[0]?.image, 1080, 1080) || "https://images.unsplash.com/photo-1766610953352-69d6f26d7f28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBsYXR0ZSUyMGFydCUyMGNhZmUlMjBpbnRlcmlvciUyMHdhcm0lMjBjb3p5fGVufDF8fHx8MTc3NTg4OTMwNHww&ixlib=rb-4.1.0&q=80&w=1080"}
            alt="Suasana nyaman di PicPic Cafe dengan kopi latte"
            onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1766610953352-69d6f26d7f28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBsYXR0ZSUyMGFydCUyMGNhZmUlMjBpbnRlcmlvciUyMHdhcm0lMjBjb3p5fGVufDF8fHx8MTc3NTg4OTMwNHww&ixlib=rb-4.1.0&q=80&w=1080")}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2D2B55]/70 via-[#6367FF]/50 to-[#6367FF]/80" />
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex flex-col justify-between p-6 pt-12">
          {/* Top Bar */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="w-12 h-12 rounded-full" />
              <div>
                <p className="text-white/80 text-xs">{greeting}</p>
                <p className="text-white text-sm">Selamat datang kembali</p>
              </div>
            </div>
            <button 
              aria-label="Tambah ke favorit"
              className="p-2.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
            >
              <Heart className="text-white" size={20} />
            </button>
          </motion.div>

          {/* Brand Section */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-white font-black text-6xl tracking-tight mb-2">
              PICPIC
            </h1>
            <p className="text-[#FFDBFD] text-lg font-medium mb-1">
              kumpul mencerita
            </p>
            <p className="text-white/80 text-sm max-w-[280px]">
              Tempat berkumpul sambil menikmati kopi dan cerita hangat
            </p>

            {/* Search */}
            <div className="mt-6 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D2B55]/85"
                size={20}
              />
              <input
                type="text"
                placeholder="Cari menu..."
                className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white/95 backdrop-blur-sm text-[#2D2B55] placeholder:text-[#2D2B55]/85 border-none focus:outline-none focus:ring-2 focus:ring-[#FFDBFD]"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* PROMO STRIP - CAROUSEL */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="-mt-6 mx-6 mb-8"
      >
        <Link to="/menu" className="block relative overflow-hidden rounded-3xl group h-32 shadow-xl shadow-[#6367FF]/20">
          <motion.div 
            key={activeBanner?.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute inset-0"
          >
            {activeBanner?.type === 'image' && activeBanner?.image ? (
              <>
                <img src={activeBanner.image} className="w-full h-full object-cover" alt="promo" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
              </>
            ) : (
              <div 
                className="w-full h-full" 
                style={{ background: `linear-gradient(to right, ${activeBanner?.gradient_start || '#6367FF'}, ${activeBanner?.gradient_end || '#8494FF'})` }}
              />
            )}
          </motion.div>

          <div className="relative px-6 py-5 flex items-center justify-between h-full">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#FFDBFD] text-[#2D2B55] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 shadow-sm">
                <Sparkles size={12} />
                {activeBanner?.tag || 'Promo'}
              </div>
              <p className="text-white font-black text-xl leading-tight drop-shadow-md">{activeBanner?.title || 'PicPic Promo'}</p>
              <p className="text-white/90 text-xs font-medium mt-0.5 drop-shadow-sm">{activeBanner?.subtitle}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ChevronRight
                className="text-white group-hover:translate-x-1 transition-transform"
                size={24}
              />
              {banners.length > 1 && (
                <div className="flex gap-1">
                  {banners.map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentBannerIndex ? 'bg-white w-3' : 'bg-white/40'}`} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Link>
      </motion.div>

      {/* CATEGORIES */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mb-12"
      >
        <div className="px-6 mb-4">
          <h2 className="text-[#2D2B55] font-bold text-2xl">Kategori</h2>
        </div>

        {categories.length === 0 ? (
          <div className="px-6 text-[#2D2B55]/85 text-sm">Tidak ada kategori.</div>
        ) : (
          <div className="grid grid-cols-2 gap-0 overflow-hidden">
            {categories.map((cat) => (
              <Link 
                to={`/menu?category=${cat.name}`}
                key={cat.id} 
                className="relative aspect-square overflow-hidden group"
              >
                <img 
                  loading="lazy"
                  src={optimizeImage(cat.image) || 'https://via.placeholder.com/400?text=Category'} 
                  alt={`Kategori menu ${cat.name}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 bg-gray-200"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D2B55]/80 via-[#2D2B55]/30 to-transparent group-hover:from-[#6367FF]/80 group-hover:to-[#6367FF]/30 transition-all duration-500" />
                
                {/* Text Content */}
                <span className="absolute bottom-4 left-4 text-white font-black text-2xl drop-shadow-lg z-10">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      {/* POPULAR MENU */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="px-6 mb-24"
      >
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-[#2D2B55] font-bold text-2xl">Menu Populer</h2>
            <p className="text-[#2D2B55]/85 text-sm mt-1">Paling disukai pelanggan</p>
          </div>
          <Link
            to="/menu"
            className="text-[#6367FF] font-bold text-sm flex items-center gap-1"
          >
            Lihat Semua
            <ChevronRight size={18} />
          </Link>
        </div>

        {popularMenu.length === 0 ? (
          <div className="text-[#2D2B55]/85 text-sm text-center py-8">
            Belum ada menu tersedia.
          </div>
        ) : (
          <div className="space-y-4">
            {popularMenu.slice(0, 3).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.1 + (Math.min(index, 5) * 0.1) }}
              >
                <Link to={`/product/${item.id}`} className="flex gap-4 group">
                  <div className="relative w-28 h-28 flex-shrink-0 rounded-2xl overflow-hidden">
                    {item.image ? (
                      <img
                        loading="lazy"
                        src={optimizeImage(item.image)}
                        alt={`Gambar menu ${item.name}`}
                        onError={(e) => (e.currentTarget.src = logo)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 bg-gray-200"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#6367FF] to-[#C9BEFF] flex items-center justify-center">
                        <img src={logo} className="w-10 h-10 object-contain opacity-50" alt="placeholder" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      {Number(item.rating) > 0 && (
                        <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                          <Star size={12} className="text-[#FFDBFD] fill-[#FFDBFD]" />
                          <span className="text-[#2D2B55] text-xs font-bold">
                            {Number(item.rating).toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-[#2D2B55] font-bold text-lg mb-1">{item.name}</h3>
                    <p className="text-[#2D2B55]/85 text-sm mb-2 line-clamp-1">
                      {item.description || "Menu spesial PicPic Cafe"}
                    </p>
                    <p className="text-[#6367FF] font-bold text-lg">
                      Rp {Number(item.price).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="p-2 bg-[#6367FF] rounded-full group-hover:scale-110 transition-transform">
                      <ChevronRight className="text-white" size={20} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}
