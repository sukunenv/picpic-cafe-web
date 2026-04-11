import { Search, ChevronRight, Heart, Star, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import api from "../../lib/api";
import logo from "figma:asset/c67b6433ddedf46738312a77f1fae7b733129f87.png";

export function HomeScreen() {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Selamat Pagi"
      : currentHour < 18
      ? "Selamat Siang"
      : "Selamat Malam";

  const [categories, setCategories] = useState<any[]>([]);
  const [popularMenu, setPopularMenu] = useState<any[]>([]);
  const [banner, setBanner] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [categoriesRes, menusRes, bannersRes] = await Promise.all([
          api.get("/categories"),
          api.get("/menus"),
          api.get("/banners"),
        ]);
        setCategories(categoriesRes.data);
        setPopularMenu(menusRes.data.slice(0, 4));
        if (bannersRes.data && bannersRes.data.length > 0) {
          setBanner(bannersRes.data[0]);
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#6367FF] border-t-transparent animate-spin" />
        <p className="text-[#6367FF] font-semibold">Memuat menu...</p>
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

  return (
    <div className="min-h-screen bg-[#F8F7FF]">
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
            src={banner?.image || "https://images.unsplash.com/photo-1766610953352-69d6f26d7f28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBsYXR0ZSUyMGFydCUyMGNhZmUlMjBpbnRlcmlvciUyMHdhcm0lMjBjb3p5fGVufDF8fHx8MTc3NTg4OTMwNHww&ixlib=rb-4.1.0&q=80&w=1080"}
            alt="Coffee"
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
                <p className="text-white/70 text-xs">{greeting}</p>
                <p className="text-white text-sm">Selamat datang kembali</p>
              </div>
            </div>
            <button className="p-2.5 bg-white/20 backdrop-blur-sm rounded-full">
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
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D2B55]/50"
                size={20}
              />
              <input
                type="text"
                placeholder="Cari menu..."
                className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white/95 backdrop-blur-sm text-[#2D2B55] placeholder:text-[#2D2B55]/50 border-none focus:outline-none focus:ring-2 focus:ring-[#FFDBFD]"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* PROMO STRIP */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="-mt-6 mx-6 mb-8"
      >
        <Link to="/menu" className="block relative overflow-hidden rounded-3xl group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6367FF] to-[#8494FF]" />
          <div className="relative px-6 py-5 flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#FFDBFD] text-[#2D2B55] px-3 py-1 rounded-full text-xs font-bold mb-2">
                <Sparkles size={12} />
                Promo Hari Ini
              </div>
              <p className="text-white font-bold text-xl">Buy 1 Get 1 Free</p>
              <p className="text-white/90 text-sm">Semua minuman coffee</p>
            </div>
            <ChevronRight
              className="text-white group-hover:translate-x-1 transition-transform"
              size={24}
            />
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
          <div className="px-6 text-[#2D2B55]/50 text-sm">Tidak ada kategori.</div>
        ) : (
          <div className="grid grid-cols-2 gap-0">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/menu?category=${category.name}`}
                className="relative aspect-square overflow-hidden group"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="h-full"
                >
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      onError={(e) => (e.currentTarget.src = logo)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#6367FF] to-[#C9BEFF] flex items-center justify-center p-4">
                      {/* Placeholder pattern if no image */}
                      <div className="w-full h-full border-4 border-white/20 rounded-full" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D2B55]/80 via-[#2D2B55]/30 to-transparent group-hover:from-[#6367FF]/80 transition-all duration-500" />
                  <div className="absolute inset-0 flex items-end p-6">
                    <p className="text-white font-bold text-2xl">{category.name}</p>
                  </div>
                </motion.div>
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
            <p className="text-[#2D2B55]/60 text-sm mt-1">Paling disukai pelanggan</p>
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
          <div className="text-[#2D2B55]/50 text-sm text-center py-8">
            Belum ada menu tersedia.
          </div>
        ) : (
          <div className="space-y-4">
            {popularMenu.slice(0, 3).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.1 + index * 0.1 }}
              >
                <Link to={`/product/${item.id}`} className="flex gap-4 group">
                  <div className="relative w-28 h-28 flex-shrink-0 rounded-2xl overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => (e.currentTarget.src = logo)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                    <p className="text-[#2D2B55]/60 text-sm mb-2 line-clamp-1">
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
    </div>
  );
}