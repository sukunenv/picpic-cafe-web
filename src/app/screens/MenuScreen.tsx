import { useState, useEffect } from "react";
import { Search, Heart, ArrowLeft, Star } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { motion } from "motion/react";
import api from "../../lib/api";

export function MenuScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories([{ id: 'all', name: 'Semua', slug: 'Semua' }, ...res.data]);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch menus when category changes
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let url = '/menus';
        if (selectedCategory !== "all") {
          url = `/menus/category/${selectedCategory}`;
        }
        
        const res = await api.get(url);
        setMenuItems(res.data);
      } catch (err: any) {
        console.error("Error fetching menus:", err);
        setError("Gagal memuat menu. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenus();
  }, [selectedCategory]);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    if (slug === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", slug);
    }
    setSearchParams(searchParams);
  };

  const optimizeImage = (url: string | undefined, width = 500, height = 500) => {
    if (!url || !url.includes('res.cloudinary.com')) return url;
    if (url.includes('/upload/') && !url.includes('q_auto')) {
      return url.replace('/upload/', `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`);
    }
    return url;
  };

  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24 bg-[#F8F7FF]">
      {/* Clean Header */}
      <div className="bg-white sticky top-0 z-20 border-b border-[#2D2B55]/5">
        <div className="px-6 pt-12 pb-4">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/" className="p-2 hover:bg-[#F8F7FF] rounded-full transition-colors">
              <ArrowLeft className="text-[#2D2B55]" size={24} />
            </Link>
            <h1 className="text-[#2D2B55] font-bold text-2xl flex-1">Menu</h1>
            <button className="p-2 hover:bg-[#F8F7FF] rounded-full transition-colors">
              <Heart className="text-[#6367FF]" size={24} />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D2B55]/40" size={20} />
            <input
              type="text"
              placeholder="Cari menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-[#F8F7FF] text-[#2D2B55] placeholder:text-[#2D2B55]/40 border-none focus:outline-none focus:ring-2 focus:ring-[#6367FF]/20"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-6 pb-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.name || category.slug)}
                className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                  selectedCategory === (category.name || category.slug)
                    ? "bg-[#6367FF] text-white"
                    : "bg-[#F8F7FF] text-[#2D2B55]/60 hover:bg-[#C9BEFF]/30"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="px-6 mt-6">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 animate-pulse pt-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="mb-3">
                <div className="relative aspect-[3/4] rounded-2xl bg-gray-200 mb-3" />
                <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-1" />
                <div className="h-3 bg-gray-200 rounded-md w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#6367FF] text-white rounded-full text-sm font-medium"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <>
            <p className="text-[#2D2B55]/60 text-sm mb-4">
              {filteredItems.length} item ditemukan
            </p>
            {filteredItems.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-3xl">
                  <p className="text-[#2D2B55]/40">Tidak ada menu yang sesuai.</p>
               </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index, 5) * 0.05 }}
                  >
                    <Link
                      to={`/product/${item.id}`}
                      className="block group"
                    >
                      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 bg-gray-100">
                        {item.image ? (
                          <img
                            loading="lazy"
                            src={optimizeImage(item.image)}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 bg-gray-200"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#2D2B55]/20">
                             No image
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2D2B55]/60 via-transparent to-transparent" />

                        {/* Rating Badge */}
                        {Number(item.rating) > 0 && (
                          <div className="absolute top-3 left-3">
                            <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
                              <Star size={12} className="text-[#FFDBFD] fill-[#FFDBFD]" />
                              <span className="text-[#2D2B55] text-xs font-bold">{Number(item.rating).toFixed(1)}</span>
                            </div>
                          </div>
                        )}

                        {/* Heart */}
                        <button className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <Heart size={14} className="text-[#6367FF]" />
                        </button>

                        {/* Price on Image */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-white font-bold text-lg">Rp {Number(item.price).toLocaleString("id-ID")}</p>
                        </div>
                      </div>

                      <h3 className="text-[#2D2B55] font-semibold text-sm line-clamp-2 leading-tight">
                        {item.name}
                      </h3>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}