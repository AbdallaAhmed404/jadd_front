"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Heart, MessageSquare, SlidersHorizontal, ArrowLeft, Loader2, X, Check, Images, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CategoryPage() {
  const params = useParams();
  const categoryParam = params?.category as string;

  const [products, setProducts] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userFavorites, setUserFavorites] = useState<string[]>([]);

  // حالات الفلتر والبوب أب
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [priceRange, setPriceRange] = useState(2000);
  const [maxDistance, setMaxDistance] = useState(100); // فلتر المسافة بالكيلومتر (افتراضياً 100 كم)
  const [condition, setCondition] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // newest, price, distance

  const searchParams = useSearchParams();

  // نظام اللغات المتزامن مع النافبار
  const [lang, setLang] = useState<"en" | "ar">("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("jadd-lang") as "en" | "ar";
    if (savedLang) {
      setLang(savedLang);
    }

    const handleLanguageChange = () => {
      const currentLang = localStorage.getItem("jadd-lang") as "en" | "ar";
      if (currentLang && (currentLang === "en" || currentLang === "ar")) {
        setLang(currentLang);
      }
    };

    window.addEventListener("languageChanged", handleLanguageChange);

    return () => {
      window.removeEventListener("languageChanged", handleLanguageChange);
    };
  }, []);

  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
  }

  const t = {
    en: {
      filter: "Filter",
      filters: "Filters",
      all: "All",
      price: "Price",
      max: "Max",
      condition: "Condition",
      new: "New",
      likeNew: "Like New",
      usedClean: "Used Clean",
      usedFair: "Used Fair",
      locationDistance: "Maximum Distance",
      km: "km",
      date: "Date Added",
      anyTime: "Any Time",
      today: "Today",
      thisWeek: "This Week",
      thisMonth: "This Month",
      sortBy: "Sort By",
      newest: "Newest",
      distance: "Nearest (GPS)",
      relevance: "Relevance",
      loginError: "Please login to add to favorites",
      kmAway: "km",
      applyFilters: "Apply Filters"
    },
    ar: {
      filter: "تصفية",
      filters: "الفلاتر",
      all: "الكل",
      price: "السعر",
      max: "الحد الأقصى",
      condition: "الحالة",
      new: "جديد",
      likeNew: "كأنه جديد",
      usedClean: "مستعمل نظيف",
      usedFair: "مستعمل مقبول",
      locationDistance: "أقصى مسافة للموقع",
      km: "كم",
      date: "تاريخ النشر",
      anyTime: "كل الأوقات",
      today: "اليوم",
      thisWeek: "هذا الأسبوع",
      thisMonth: "هذا الشهر",
      sortBy: "ترتيب حسب",
      newest: "الأحدث",
      distance: "الأقرب لك (GPS)",
      relevance: "الترتيب",
      loginError: "يرجى تسجيل الدخول لإضافة المنتجات إلى المفضلة",
      kmAway: "كم",
      applyFilters: "تطبيق الفلاتر"
    }
  };

  const currentText = t[lang];

  const conditionTranslations: Record<string, { en: string; ar: string }> = {
    "New": { en: "New", ar: "جديد" },
    "Like New": { en: "Like New", ar: "كانه جديد" },
    "Used - Clean": { en: "Used - Clean", ar: "مستعمل - نظيف" },
    "Used - Fair": { en: "Used - Fair", ar: "مستعمل - بحالة جيدة" }
  };

  const fetchFavorites = async () => {
    const token = localStorage.getItem("jadd-token");
    if (!token) return;
    try {
      const res = await fetch("https://api.joinjadd.com/user/favorites", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserFavorites(data.map((item: any) => item._id || item));
      }
    } catch (err) { console.error(err); }
  };

  const toggleFavorite = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    const token = localStorage.getItem("jadd-token");
    if (!token) { toast.error(currentText.loginError); return; }
    try {
      const res = await fetch("https://api.joinjadd.com/user/favorites/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ productId })
      });
      if (res.ok) {
        setUserFavorites(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
      }
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchFavorites(); }, []);

  // جلب بيانات القسم والمنتجات
  // جلب بيانات القسم والمنتجات وحساب المسافة محلياً
  useEffect(() => {
    if (!categoryParam) return;
    setLoading(true);

    const decodedParam = decodeURIComponent(categoryParam).replace(/-/g, " ").toLowerCase();
    const token = localStorage.getItem("jadd-token");

    // 1. قراءة موقع المستخدم المخزن محلياً (سواء زائر أو مسجل)
    let userLocation: { latitude: number; longitude: number } | null = null;
    const savedLocalLoc = localStorage.getItem("user-location");
    if (savedLocalLoc) {
      try {
        const parsed = JSON.parse(savedLocalLoc);
        if (parsed.latitude && parsed.longitude) {
          userLocation = { latitude: parsed.latitude, longitude: parsed.longitude };
        }
      } catch (e) {
        console.error("Error parsing local location", e);
      }
    }

    fetch("https://api.joinjadd.com/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        const categoriesList = data.data || data;
        const currentCat = categoriesList.find((cat: any) => {
          if (!cat.name) return false;
          if (typeof cat.name === "object") {
            return (
              cat.name.en?.toLowerCase() === decodedParam ||
              cat.name.ar?.toLowerCase() === decodedParam
            );
          }
          return String(cat.name).toLowerCase() === decodedParam;
        });

        if (currentCat) {
          setCategoryData(currentCat);
        }
      })
      .catch((err) => console.error("Error fetching category details:", err));

    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const endpoint = decodedParam === "products"
      ? "https://api.joinjadd.com/user/allproduct" // ضع هنا الـ endpoint الخاصة بكل المنتجات عندك لو مختلفة
      : `https://api.joinjadd.com/user/category/${decodedParam}`;

    fetch(endpoint, { headers })
      .then((res) => res.json())
      .then((data) => {
        const rawProducts = Array.isArray(data) ? data : (data.products || data.data || []);

        // 2. حساب المسافة محلياً لكل منتج بناءً على الـ localStorage
        const productsWithDistance = rawProducts.map((product: any) => {
          let distance = null;
          if (
            userLocation &&
            userLocation.latitude != null &&
            userLocation.longitude != null &&
            product.location &&
            product.location.latitude != null &&
            product.location.longitude != null
          ) {
            distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              product.location.latitude,
              product.location.longitude
            );
          }
          return { ...product, distance };
        });

        setProducts(productsWithDistance);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [categoryParam]);

  // منطق الفلترة والترتيب محلياً (يشمل السعر، المسافة بالكيلومتر، الحالة، والتاريخ)
  const filteredProducts = useMemo(() => {
    const now = new Date().getTime();

    return products
      .filter(p => {
        // فلتر السعر
        const matchesPrice = p.price <= priceRange;

        // فلتر الحالة
        const matchesCondition = condition === "all" || p.condition?.toLowerCase() === condition.toLowerCase();

        // فلتر المسافة بالكيلومتر (إذا كانت المسافة متوفرة للمنتج، يتم مقارنتها بالـ slider)
        let matchesDistance = true;
        if (p.distance !== null && p.distance !== undefined) {
          matchesDistance = p.distance <= maxDistance;
        }

        // فلتر التاريخ
        let matchesDate = true;
        if (dateFilter !== "all" && p.createdAt) {
          const productDate = new Date(p.createdAt).getTime();
          const diffDays = (now - productDate) / (1000 * 60 * 60 * 24);
          if (dateFilter === "today") matchesDate = diffDays <= 1;
          else if (dateFilter === "week") matchesDate = diffDays <= 7;
          else if (dateFilter === "month") matchesDate = diffDays <= 30;
        }

        return matchesPrice && matchesCondition && matchesDistance && matchesDate;
      })
      .sort((a, b) => {
        // الأولوية القصوى للمنتجات المميزة لتظهر في أول القائمة دائماً
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;

        // بعد كده يشتغل الترتيب العادي حسب اختيار المستخدم (سعر، مسافة، أو أحدث)
        if (sortBy === "price") return a.price - b.price;
        if (sortBy === "distance") {
          const distA = a.distance !== null && a.distance !== undefined ? a.distance : 999999;
          const distB = b.distance !== null && b.distance !== undefined ? b.distance : 999999;
          return distA - distB;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, priceRange, maxDistance, condition, dateFilter, sortBy]);

  const decodedParamCheck = decodeURIComponent(categoryParam || "").replace(/-/g, " ").toLowerCase();

  const displayCategoryName = decodedParamCheck === "products"
    ? (lang === "ar" ? "جميع المنتجات" : "All Products")
    : (categoryData?.name
      ? (typeof categoryData.name === "object"
        ? (lang === "ar" ? (categoryData.name.ar || categoryData.name.en) : (categoryData.name.en || categoryData.name.ar))
        : categoryData.name)
      : decodeURIComponent(categoryParam));

  return (
    <div className="w-full bg-[#f8f9fa] dark:bg-zinc-950 text-[#1F1547] dark:text-[#F0F2E3] min-h-screen py-6 md:py-12 transition-colors duration-300" dir={lang === "ar" ? "rtl" : "ltr"}>

      {/* شريط الفلتر والترتيب الثابت للموبايل في الأعلى تماماً */}
      <div className="z-30 md:hidden bg-[#f8f9fa] dark:bg-black backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 mt-[-15px]">
        <div className="grid grid-cols-2">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <SlidersHorizontal size={16} />
            <span>{currentText.filter}</span>
          </button>
          <button
            onClick={() => setIsSortOpen(true)}
            className="flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors border-s border-zinc-200 dark:border-zinc-800"
          >
            <ArrowUpDown size={16} />
            <span>{currentText.relevance}</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl space-y-10 pt-4 md:pt-0">

        <div className="flex justify-between items-end pb-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold capitalize">
              {displayCategoryName}
            </h1>
          </div>
          <button onClick={() => setIsFilterOpen(true)} className="hidden md:flex items-center gap-2 bg-white dark:bg-zinc-900 border px-4 h-10 rounded-xl text-xs font-bold">
            <SlidersHorizontal size={14} /> {currentText.filter}
          </button>
        </div>

        {/* بوب أب الفلتر المحدث */}
        <AnimatePresence>
          {isFilterOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsFilterOpen(false)} className="fixed inset-0 z-40" />
              <motion.div initial={{ x: lang === "ar" ? "-100%" : "100%" }} animate={{ x: 0 }} exit={{ x: lang === "ar" ? "-100%" : "100%" }} className={`fixed ${lang === "ar" ? "left-0" : "right-0"} bottom-0 h-auto md:h-auto max-h-[85vh] w-full md:max-w-sm bg-white dark:bg-zinc-900 z-50 p-6 shadow-2xl flex flex-col justify-between rounded-t-[24px] md:rounded-[20px] overflow-y-auto`}>

                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="font-bold text-lg">{currentText.filters}</h2>
                    <button onClick={() => setIsFilterOpen(false)}><X size={20} /></button>
                  </div>

                  {/* السعر */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase text-zinc-400">{currentText.price} ({currentText.max}: {priceRange} OMR)</label>
                    <input type="range" min="0" max="2000" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full accent-[#232152] dark:accent-[#D6C88A]" />
                  </div>

                  {/* فلتر المسافة بالكيلومتر (شبيه السعر) */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase text-zinc-400">{currentText.locationDistance} ({maxDistance} {currentText.km})</label>
                    <input type="range" min="5" max="500" step="5" value={maxDistance} onChange={(e) => setMaxDistance(Number(e.target.value))} className="w-full accent-[#232152] dark:accent-[#D6C88A]" />
                  </div>
                  {/* الحالة */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase text-zinc-400">{currentText.condition}</label>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { id: "all", label: currentText.all },
                        { id: "new", label: currentText.new },
                        { id: "Like New", label: currentText.likeNew },
                        { id: "Used - Clean", label: currentText.usedClean },
                        { id: "Used - Fair", label: currentText.usedFair }
                      ].map(c => (
                        <button
                          key={c.id}
                          onClick={() => setCondition(c.id)}
                          className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors text-center ${condition === c.id
                            ? "bg-[#232152] dark:bg-[#D6C88A] text-white dark:text-black border-transparent"
                            : "border-zinc-200 dark:border-zinc-800"
                            }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* فلتر التاريخ */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase text-zinc-400">{currentText.date}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "all", label: currentText.anyTime },
                        { id: "today", label: currentText.today },
                        { id: "week", label: currentText.thisWeek },
                        { id: "month", label: currentText.thisMonth },
                      ].map(d => (
                        <button
                          key={d.id}
                          onClick={() => setDateFilter(d.id)}
                          className={`py-2 px-3 rounded-lg text-xs font-bold border text-center transition-colors ${dateFilter === d.id ? "bg-[#232152] dark:bg-[#D6C88A] text-white dark:text-black" : "border-zinc-200 dark:border-zinc-800"}`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* الترتيب (شاشات كبيرة) */}
                  <div className="space-y-3 hidden md:block">
                    <label className="text-xs font-bold uppercase text-zinc-400">{currentText.sortBy}</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "newest", label: currentText.newest },
                        { id: "distance", label: currentText.distance },
                        { id: "price", label: currentText.price }
                      ].map(opt => (
                        <button key={opt.id} onClick={() => setSortBy(opt.id)} className={`h-9 rounded-lg text-[11px] font-bold border px-1 ${sortBy === opt.id ? "bg-[#232152] dark:bg-[#D6C88A] text-white dark:text-black" : ""}`}>{opt.label}</button>
                      ))}
                    </div>
                  </div>
                </div>



              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* بوب أب الترتيب للموبايل */}
        <AnimatePresence>
          {isSortOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSortOpen(false)} className="fixed inset-0  z-40" />
              <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed bottom-0 inset-x-0 bg-white dark:bg-zinc-900 z-50 p-6 shadow-2xl space-y-4 rounded-t-[24px]">
                <div className="flex justify-between items-center border-b pb-3">
                  <h2 className="font-bold text-base">{currentText.sortBy}</h2>
                  <button onClick={() => setIsSortOpen(false)} className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"><X size={20} /></button>
                </div>
                <div className="space-y-2 pb-4">
                  {[
                    { id: "newest", label: currentText.newest },
                    { id: "distance", label: currentText.distance },
                    { id: "price", label: currentText.price }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => { setSortBy(opt.id); setIsSortOpen(false); }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-colors ${sortBy === opt.id ? "bg-zinc-100 dark:bg-zinc-800 text-[#232152] dark:text-[#D6C88A]" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"}`}
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.id && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* عرض المنتجات */}
        {/* عرض المنتجات أو رسالة عدم وجود منتجات */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={40} /></div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center rounded-[24px]  border-border/40 shadow-sm space-y-4">
           
            <div className="space-y-1">
              <h3 className="text-lg font-bold">
                {lang === "ar" ? "لا توجد منتجات" : "No products found"}
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm">
                {lang === "ar" 
                  ? "عذراً، لا توجد منتجات تطابق بحثك أو أن هذا القسم خالي حالياً."
                  : "Sorry, no products match your search or this category is currently empty."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link href={`/product/${product._id}`} key={product._id} className="block group">
                <motion.div
                  whileHover={{ y: -5 }}
                  className={`bg-white dark:bg-zinc-900 rounded-[18px] p-3 flex flex-col transition-all duration-800 ${product.isFeatured
                      ? "border-2 border-[#D6C88A] shadow-[0_0_20px_rgba(214,200,138,0.8)]"
                      : " shadow-[0_4px_25px_rgba(0,0,0,0.01)]"
                    }`}
                >
                  <div className="relative aspect-square rounded-t-[18px] overflow-hidden bg-zinc-100 m-[-11] mb-3">
                    <img src={product.images?.[0] || "/placeholder.jpg"} alt={product.title} className="w-full h-full object-cover" />

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(e, product._id);
                      }}
                      className={`absolute top-2.5 ${lang === "ar" ? "left-2.5" : "right-2.5"} min-w-[32px] h-7 px-1.5 rounded-full bg-white/80 dark:bg-zinc-800 backdrop-blur-sm flex items-center justify-center gap-1 transition-colors hover:text-red-500 z-10 shadow-sm`}
                    >
                      <Heart
                        size={13}
                        className={userFavorites.includes(product._id) ? "fill-red-500 text-red-500 shrink-0" : "text-zinc-500 shrink-0"}
                      />
                      <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300">
                        {product.favoritesCount || 0}
                      </span>
                    </button>

                    <div className={`absolute top-2.5 ${lang === "ar" ? "right-2.5" : "left-2.5"} bg-black/65 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 font-medium z-10`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="shrink-0"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>{product.viewsCount || 0}</span>
                    </div>

                    <div className={`absolute bottom-2.5 ${lang === "ar" ? "right-2.5" : "left-2.5"} bg-[#1F1547]/60 text-white text-[9px] px-2 py-0.5 rounded-md`}>
                      {conditionTranslations[product.condition]
                        ? conditionTranslations[product.condition][lang]
                        : product.condition}
                    </div>

                    {product.images && product.images.length > 0 && (
                      <div className={`absolute bottom-2.5 ${lang === "ar" ? "left-2.5" : "right-2.5"} bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 font-medium z-10`}>
                        <Images size={10} />
                        <span>{product.images.length}</span>
                      </div>
                    )}
                  </div>

                  <div className="px-1 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className={`font-bold text-sm line-clamp-2 flex items-center gap-1.5 ${product.isFeatured ? "text-[#D6C88A]" : "text-[#1F1547] dark:text-[#F0F2E3]"
                        }`}>
                        <span>{product.title}</span>
                      </h3>
                    </div>

                    <div className="pt-2 border-t mt-3 flex items-center justify-between">
                      <div className="text-xs font-bold h-7 rounded-lg flex items-center gap-1.5">
                        <span>{product.price}</span>

                        {lang === "ar" ? (
                          <img
                            src="/oman-riyal.svg"
                            alt="ريال عماني"
                            className="w-4 h-4 object-contain inline-block dark:invert"
                          />
                        ) : (
                          <span>OMR</span>
                        )}
                      </div>
                      {product.distance !== null && product.distance !== undefined && (
                        <div className="mt-1.5 inline-flex items-center gap-1 text-[#232152] dark:text-jadd-gold text-[10px] px-2 py-0.5 rounded-md font-bold">
                          <span>{product.distance} {currentText.kmAway}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}