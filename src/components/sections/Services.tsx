"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Heart, MessageSquare, ArrowRight, Loader2, Images } from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function MarketplaceSections() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userFavorites, setUserFavorites] = useState<string[]>([]);

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

  const t = {
    en: {
      viewAll: "View All",
      loginError: "Please login to add to favorites",
      uncategorized: "Uncategorized"
    },
    ar: {
      viewAll: "عرض الكل",
      loginError: "يرجى تسجيل الدخول لإضافة المنتجات إلى المفضلة",
      uncategorized: "أخرى"
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
    if (token) {
      const res = await fetch("https://jadd-production-275a.up.railway.app/user/favorites", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserFavorites(data.map((item: any) => item._id || item));
      }
    }
  };

  useEffect(() => {
    fetch("https://jadd-production-275a.up.railway.app/user/allproduct")
      .then((res) => res.json())
      .then((products) => {
        products.sort((a: any, b: any) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        const grouped = products.reduce((acc: any, product: any) => {
          // استخراج اسم القسم بناءً على اللغة المتاحة من الكائن المربوط (populate) أو النص القديم
          let catName = currentText.uncategorized;

          if (product.category) {
            if (typeof product.category === "object" && product.category.name) {
              catName = lang === "ar"
                ? (product.category.name.ar || product.category.name.en)
                : (product.category.name.en || product.category.name.ar);
            } else if (typeof product.category === "string") {
              catName = product.category;
            }
          }

          if (!acc[catName]) acc[catName] = [];

          if (acc[catName].length < 4) {
            acc[catName].push(product);
          }
          return acc;
        }, {});

        // نقوم بتخزين ربط بين اسم القسم المعروض والاسم الإنجليزي الأساسي له لتوجيه الرابط بشكل صحيح
        const formatted = Object.keys(grouped).map((cat) => {
          // نبحث عن أول منتج في هذا القسم يحمل كائن كاتيجوري حقيقي لنستخرج منه الاسم الإنجليزي الثابت
          const sampleProduct = grouped[cat].find((p: any) => p.category && typeof p.category === "object" && p.category.name);

          const englishName = sampleProduct
            ? (sampleProduct.category.name.en || cat)
            : cat;

          return {
            categoryName: cat, // الاسم الذي سيظهر للمستخدم (حسب اللغة الحالية)
            categoryId: englishName.toLowerCase().replace(/\s+/g, "-"), // الاسم الإنجليزي المنسق للرابط دايماً
            items: grouped[cat]
          };
        });

        setSections(formatted);
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
    fetchFavorites();
  }, [lang]);

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="animate-spin text-[#1F1547]" size={40} />
    </div>
  );

  const toggleFavorite = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();

    const token = localStorage.getItem("jadd-token");
    if (!token) {
      toast.error(currentText.loginError);
      return;
    }

    try {
      const res = await fetch("https://jadd-production-275a.up.railway.app/user/favorites/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });

      if (res.ok) {
        setUserFavorites(prev =>
          prev.includes(productId)
            ? prev.filter(id => id !== productId)
            : [...prev, productId]
        );
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <section id="marketplace" className="w-full bg-[#f8f9fa] dark:bg-zinc-950 py-20" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="container mx-auto px-6 max-w-7xl space-y-20">
        {sections.map((section) => (
          <div key={section.categoryId} className="space-y-6">

            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#1F1547] dark:text-[#F0F2E3]">
                {section.categoryName}
              </h2>
              <Link href={`/categories/${section.categoryId}`} className="text-xs font-bold text-[#D6C88A] hover:opacity-80 flex items-center gap-1">
                <span>{currentText.viewAll}</span>
                <ArrowRight size={14} className={`inline ${lang === "ar" ? "rotate-180" : ""}`} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {section.items.map((product: any) => (
                <Link href={`/product/${product._id}`} key={product._id} className="block group">
                  <motion.div
                    key={product._id}
                    whileHover={{ y: -5 }}
                    className={`bg-white dark:bg-zinc-900 rounded-[18px] p-3 flex flex-col transition-all duration-800 ${product.isFeatured
                      ? "border-2 border-[#D6C88A] shadow-[0_0_20px_rgba(214,200,138,0.8)] "
                      : " border-zinc-200/50 shadow-[0_4px_25px_rgba(0,0,0,0.01)]"
                      }`}
                  >
                    <div className="relative aspect-square rounded-t-[18px] overflow-hidden bg-zinc-100 m-[-11] mb-3">
                      <img
                        src={product.images?.[0] || "/placeholder.jpg"}
                        alt={product.title}
                        className="w-full h-full object-cover "
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(e, product._id);
                        }}
                        className={`absolute top-2.5 ${lang === "ar" ? "left-2.5" : "right-2.5"} h-7 px-2 rounded-full bg-white/80 dark:bg-zinc-800 flex items-center justify-center gap-1 transition-colors hover:text-red-500 z-10`}
                      >
                        <Heart
                          size={14}
                          className={`${userFavorites.includes(product._id) ? "fill-red-500 text-red-500" : "text-zinc-600 dark:text-zinc-300"}`}
                        />
                        <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300">
                          {product.favoritesCount || 0}
                        </span>
                      </button>

                      {/* عداد المشاهدات في الجهة المقابلة */}
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

                      {/* حالة المنتج */}
                      {/* حالة المنتج */}
                      <div className={`absolute bottom-2.5 ${lang === "ar" ? "right-2.5" : "left-2.5"} bg-[#1F1547]/60 text-white text-[9px] px-2 py-0.5 rounded-md`}>
                        {conditionTranslations[product.condition]
                          ? conditionTranslations[product.condition][lang]
                          : product.condition}
                      </div>

                      {/* عدد الصور */}
                      {product.images && product.images.length > 0 && (
                        <div className={`absolute bottom-2.5 ${lang === "ar" ? "left-2.5" : "right-2.5"} bg-black/65 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 font-medium z-10`}>
                          <Images size={10} />
                          <span>{product.images.length}</span>
                        </div>
                      )}
                    </div>

                    <div className="px-1 flex-1">
                      <h3 className={`font-bold text-sm line-clamp-2 flex items-center gap-1.5 ${product.isFeatured ? "text-[#D6C88A]" : "text-[#1F1547] dark:text-[#F0F2E3]"
                        }`}>
                        <span>{product.title}</span>
                      </h3>
                      <div className="pt-3 flex items-center justify-between border-t mt-3">
                        <div className="text-xs font-bold h-7 rounded-lg flex items-center gap-1.5">
                          <span>{product.price}</span>

                          {lang === "ar" ? (
                            <img
                              src="/oman-riyal.svg"
                              alt="ريال عماني"
                              // استخدمنا الكلاسات لتغيير الفلتر أو اللون حسب الثيم مباشرة
                              className="w-4 h-4 object-contain inline-block dark:invert"
                            />
                          ) : (
                            <span>OMR</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}