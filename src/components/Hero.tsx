"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ShoppingBag, PlusCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

const customSlides = {
  en: [
    {
      id: 1,
      tag: "Premium Marketplace",
      tagIcon: <ShoppingBag size={12} className="text-[#C5B37D]" />,
      title: "Discover special offers near you",
      desc: "Discover a wide selection of furniture, electronics, and other products from trusted sellers across Oman.",
      ctaText: "Explore Marketplace",
      ctaLink: "/#marketplace",
      bgImage: "url('https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop')" 
    },
    {
      id: 2,
      tag: "Instant Liquidity",
      tagIcon: <PlusCircle size={12} className="text-[#C5B37D]" />,
      title: "Turn Unused Assets Into Cash Instantly",
      desc: "Give your items a new life. Jadd provides a dedicated, ad-free space that lets you list and sell your belongings in minutes.",
      ctaText: "List Your Product Now",
      ctaLink: "/add-product",
      bgImage: "url('https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1600&auto=format&fit=crop')" 
    }
  ],
  ar: [
    {
      id: 1,
      tag: "سوق مميز",
      tagIcon: <ShoppingBag size={12} className="text-[#C5B37D]" />,
      title: "اكتشف عروضا مميزة بالقرب منك ",
      desc: "استكشف تشكيلة واسعة من الأثاث والإلكترونيات وغيرها من المنتجات المعروضة من بائعين موثوقين في مختلف أنحاء عُمان.",
      ctaText: "استكشف السوق",
      ctaLink: "/#marketplace",
      bgImage: "url('https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop')" 
    },
    {
      id: 2,
      tag: "سيولة فورية",
      tagIcon: <PlusCircle size={12} className="text-[#C5B37D]" />,
      title: "حول أصولك غير المستخدمة إلى نقد فوراً",
      desc: "امنح أغراضك حياة جديدة. يقدم موقع جَدّد مساحة مخصصة وخالية من الإعلانات تتيح لك عرض ممتلكاتك وبيعها في دقائق.",
      ctaText: "أضف منتجك الآن",
      ctaLink: "/add-product",
      bgImage: "url('https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1600&auto=format&fit=crop')" 
    }
  ]
};

export default function HeroMinimalSlider() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();
  const [lang, setLang] = useState<"en" | "ar">("en");

  // قراءة ومزامنة اللغات تلقائياً من الـ localStorage (المتغيرة من النافبار)
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

  const slides = customSlides[lang];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const checkAuth = () => {
    const token = localStorage.getItem("jadd-token");
    if (!token) {
      toast.error(lang === "ar" ? "يرجى تسجيل الدخول أولاً للمتابعة." : "Please login first to continue.");
      router.push("/login");
      return false;
    }
    return true;
  };

  return (
    // الخلفية: كحلي #232152 في الفاتح، وتتحول لدرجة عميقة من الذهبي الفخم في الدارك مود
    <section className="relative w-full py-20 md:py-16 bg-[#232152] dark:bg-[#1a160e] flex items-center justify-center overflow-hidden select-none border-b border-border/10 transition-colors duration-500" dir={lang === "ar" ? "rtl" : "ltr"}>
      
      {/* ================= الصور الخلفية مع الـ Overlays المتغيرة ================= */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${lang}-${current}`}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 0.45, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: slides[current].bgImage }}
          />
        </AnimatePresence>
        
        {/* الـ Overlay المتدرج: يتحول ليعكس إضاءة الذهب الداكن الفخم في الدارك مود ليعطي عمقاً للصورة وتباين للنصوص */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#232152]/30 via-[#232152]/35 to-[#232152] dark:from-[#1a160e]/30 dark:via-[#1a160e]/40 dark:to-[#1a160e] transition-all duration-500" />
      </div>

      {/* ================= المحتوى الممركز تماماً في المنتصف ================= */}
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center flex flex-col items-center justify-center min-h-[350px]">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={`${lang}-${current}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 flex flex-col items-center justify-center"
          >
           

            {/* العنوان الرئيسي */}
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white dark:text-zinc-100 leading-tight max-w-2xl text-center">
              {slides[current].title}
            </h1>

            {/* الوصف النصي */}
            <p className="text-xs md:text-sm text-zinc-200 dark:text-[#C5B37D]/80 font-medium leading-relaxed max-w-xl text-center">
              {slides[current].desc}
            </p>

            {/* الزر الزجاجي الفخم المطور بالدرجة المطلوبة */}
            <div className="pt-2">
              <button
                onClick={async () => {
                  const targetLink = slides[current].ctaLink;

                  // إذا كان الزر خاص باستكشاف السوق، انتقل مباشرة بدون فحص الهوية
                  if (targetLink !== "/add-product") {
                    router.push(targetLink);
                    return;
                  }

                  // أما إذا كان زر إضافة منتج، فنطبق حماية وتسجيل الدخول والتحقق من الهوية
                  const token = localStorage.getItem("jadd-token");
                  if (!token) {
                    toast.error(lang === "ar" ? "يرجى تسجيل الدخول أولاً للمتابعة." : "Please login first to continue.");
                    router.push("/login");
                    return;
                  }

                  try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile-status`, {
                      headers: { "Authorization": `Bearer ${token}` }
                    });
                    const data = await response.json();

                    if (response.ok) {
                      if (data.status === 'unverified') {
                        toast.error(lang === "ar" ? "يرجى التحقق من هويتك لإضافة المنتجات." : "Please verify your ID to add products.");
                        router.push("/verify-id");
                      } else if (data.status === 'pending') {
                        toast.error(lang === "ar" ? "هويتك قيد المراجعة. يرجى الانتظار." : "Your ID is under review. Please wait.");
                      } else if (data.status === 'verified') {
                        router.push(targetLink);
                      }
                    } else {
                      router.push("/login");
                    }
                  } catch (error) {
                    toast.error(lang === "ar" ? "خطأ في الاتصال بالخادم" : "Error connecting to server");
                  }
                }}
                className="group inline-flex items-center gap-4 px-6 h-11 bg-white/10 dark:bg-[#C5B37D]/10 border border-white/20 dark:border-[#C5B37D]/30 text-white dark:text-[#C5B37D] hover:text-[#232152] dark:hover:text-[#1a160e] rounded-full font-bold text-xs tracking-wider shadow-lg backdrop-blur-xl hover:bg-white dark:hover:bg-[#C5B37D] transition-all duration-300"
              >
                {slides[current].ctaText}
                <div className={`w-5 h-5 rounded-full bg-white/10 dark:bg-[#C5B37D]/20 flex items-center justify-center group-hover:rotate-45 transition-transform duration-300 ${lang === "ar" ? "rotate-180" : ""}`}>
                  <ArrowUpRight size={12} strokeWidth={2.5} />
                </div>
              </button>
            </div>
            
            
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}