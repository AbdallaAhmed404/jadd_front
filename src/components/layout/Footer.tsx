"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Heart, MapPin } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

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

  const footerLinks = {
    marketplace: [
      { name: lang === "ar" ? "تصفح العناصر" : "Browse Items", href: "/#marketplace" },
      { name: lang === "ar" ? "أضف عنصرك" : "List Your Item", href: "/list-item" },
      { name: lang === "ar" ? "مركز الأمان" : "Safety Center", href: "/safety-center" },
      { name: lang === "ar" ? "قصص النجاح" : "Success Stories", href: "/#trust-safety" },
    ],
    support: [
      { name: lang === "ar" ? "مركز المساعدة / الأسئلة الشائعة" : "Help Center / FAQs", href: "/faq" },
      { name: lang === "ar" ? "اتصل بالدعم" : "Contact Support", href: "/support" },
      { name: lang === "ar" ? "إرشادات المجتمع" : "Community Guidelines", href: "/guidelines" },
    ],
    legal: [
      { name: lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy", href: "/privacy" },
      { name: lang === "ar" ? "شروط الاستخدام" : "Terms of Use", href: "/terms" },
    ],
  };

  const t = {
    en: {
      marketHeader: "Marketplace",
      supportHeader: "Support",
      legalHeader: "Legal",
      footprintHeader: "Footprint",
      footprintDesc1: "Serving All Governorates",
      footprintDesc2: "Sultanate of Oman"
    },
    ar: {
      marketHeader: "السوق",
      supportHeader: "الدعم",
      legalHeader: "الشؤون القانونية",
      footprintHeader: "نطاق الخدمة",
      footprintDesc1: "نخدم جميع المحافظات",
      footprintDesc2: "سلطنة عُمان"
    }
  };

  const currentText = t[lang];

  const isErrorPage = pathname === "/404" || pathname === "/500";
  if (isErrorPage) return null;

  return (
    <footer className="relative bg-white dark:bg-zinc-950 text-[#1F1547] dark:text-[#F0F2E3] font-sans pt-16 pb-28 md:pb-12 overflow-hidden transition-colors duration-300 border-zinc-200/50 dark:border-zinc-900 selection:bg-[#D6C88A] selection:text-[#1F1547]" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* تأثيرات خلفية ناعمة جداً ومريحة للعين تعكس ألوان الهوية */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D6C88A]/5 dark:bg-[#D6C88A]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        {/* شبكة الروابط: عمودين في الموبايل و 12 عمود في الشاشات الكبيرة */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-6 gap-y-10 pb-12 border-b border-zinc-100 dark:border-zinc-900">
          
          <div className="col-span-1 md:col-span-3 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">{currentText.marketHeader}</h4>
            <ul className="flex flex-col gap-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {footerLinks.marketplace.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-[#D6C88A] dark:hover:text-[#D6C88A] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-3 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">{currentText.supportHeader}</h4>
            <ul className="flex flex-col gap-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-[#D6C88A] dark:hover:text-[#D6C88A] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-3 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">{currentText.legalHeader}</h4>
            <ul className="flex flex-col gap-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-[#D6C88A] dark:hover:text-[#D6C88A] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={`col-span-1 md:col-span-3 flex flex-col items-start ${lang === "ar" ? "md:items-start md:text-right" : "md:items-end md:text-right"} space-y-3`}>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 md:flex-row-reverse">
              <MapPin size={12} className="text-zinc-400" /> {currentText.footprintHeader}
            </h4>
            <p className="text-xs font-semibold leading-relaxed text-zinc-500 dark:text-zinc-400">
              {currentText.footprintDesc1} <br />
              <span className="text-[#1F1547] dark:text-white font-bold">{currentText.footprintDesc2}</span>
            </p>
          </div>
        </div>

        {/* الشريط السفلي النهائي للحقوق والعلامة التجارية للشبكة */}
        <div className="flex items-center justify-between pt-6 opacity-60 hover:opacity-100 transition-all duration-500">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-foreground/70 whitespace-nowrap">
              Powered by scarabix
            </span>
        </div>
      </div>
    </footer>
  );
}