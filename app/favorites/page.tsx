"use client";

import React, { useEffect, useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      pageTitle: "My Favorites",
      noFavorites: "No favorite items found.",
      currency: "OMR"
    },
    ar: {
      pageTitle: "المفضلة",
      noFavorites: "لا توجد عناصر في المفضلة.",
      currency: "رع"
    }
  };

  const currentText = t[lang];

  // جلب المفضلات عند تحميل الصفحة
  const fetchFavorites = async () => {
    const token = localStorage.getItem("jadd-token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("https://jadd-production-275a.up.railway.app/user/favorites", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // دالة إزالة المنتج من المفضلة
  const removeFromFavorites = async (productId: string) => {
    const token = localStorage.getItem("jadd-token");
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
        // تحديث القائمة فوراً في الفرونت إند
        setFavorites(favorites.filter(item => item._id !== productId));
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-[#1F1547]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-zinc-950 p-6 md:p-12" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-black text-[#1F1547] dark:text-white mb-8">{currentText.pageTitle}</h1>

      {favorites.length === 0 ? (
        <p className="text-zinc-500">{currentText.noFavorites}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <Link href={`/product/${product._id}`} key={product._id} className="block group">
              <div key={product._id} className="bg-white dark:bg-zinc-900 p-3 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
                <div className="h-40 bg-zinc-200 dark:bg-zinc-800 rounded-xl mb-3 relative overflow-hidden">
                  <img
                    src={product.images?.[0] || "/placeholder.jpg"}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                        e.preventDefault(); // يمنع الانتقال للمسار المحدد في Link
                        e.stopPropagation(); // يمنع وصول ضغطة الزر إلى الـ Link المحيط
                        removeFromFavorites(product._id);
                      }}
                    className={`absolute top-2 ${lang === "ar" ? "left-2" : "right-2"} p-2 bg-white dark:bg-zinc-800 rounded-full text-red-500 shadow-md hover:scale-105 transition-transform`}
                  >
                    <Heart size={16} fill="currentColor" />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-[#1F1547] dark:text-white truncate">
                  {product.title}
                </h3>
                <p className="text-xs font-bold text-[#232152] dark:text-[#D6C88A] mt-1">
                  {product.price} {currentText.currency}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}