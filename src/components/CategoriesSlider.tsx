"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Category {
    _id: string;
    name: {
        ar: string;
        en: string;
    };
}

interface CategoriesSliderProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CategoriesSlider({ isOpen, onClose }: CategoriesSliderProps) {
    const pathname = usePathname();
    const [categoriesList, setCategoriesList] = useState<Category[]>([]);

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
            allCategories: "All Categories"
        },
        ar: {
            allCategories: "جميع الفئات"
        }
    };

    const currentText = t[lang];

    useEffect(() => {
        fetch("https://jadd-production-275a.up.railway.app/user/categories")
            .then((res) => res.json())
            .then((data) => {
                const cats = data.data || (Array.isArray(data) ? data : []);
                setCategoriesList(cats);
            })
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* خلفية معتمة تظهر وتختفي بنعومة */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-[99]"
                    />

                    {/* القائمة الجانبية بانزلاق سلس جداً باستخدام Framer Motion */}
                    <motion.div
                        initial={{ x: lang === "ar" ? "100%" : "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: lang === "ar" ? "100%" : "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={`fixed top-0 ${lang === "ar" ? "right-0" : "left-0"} z-[9999] h-full w-80 bg-white dark:bg-zinc-900 shadow-2xl flex flex-col`}
                        dir={lang === "ar" ? "rtl" : "ltr"}
                    >
                        {/* رأس القائمة */}
                        <div className="flex items-center justify-between p-4 border-b border-border/60">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-[#232152] dark:text-white">
                                {currentText.allCategories}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 transition-colors cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* محتوى القائمة (Scrollable) */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">

                            <div className="flex flex-col">
                                <div
                                    className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${pathname === "/products" || pathname === "/"
                                            ? "bg-[#232152]/10 dark:bg-jadd-gold/10 text-[#232152] dark:text-jadd-gold"
                                            : "hover:bg-gray-100 dark:hover:bg-zinc-800 text-[#232152]/80 dark:text-foreground/80"
                                        }`}
                                >
                                    <Link
                                        href="/categories/products" // عدل المسار إلى الصفحة الرئيسية أو صفحة كل المنتجات حسب مشروعك
                                        onClick={onClose}
                                        className="flex-1"
                                    >
                                        {lang === "ar" ? "جميع المنتجات" : "All Products"}
                                    </Link>
                                </div>
                            </div>

                            {categoriesList.map((cat) => {
                                const categoryName = lang === "ar" ? cat.name.ar : cat.name.en;
                                const isActive = pathname.includes(cat.name.en.toLowerCase());

                                return (
                                    <div key={cat._id} className="flex flex-col">
                                        {/* الفئة الرئيسية */}
                                        <div
                                            className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${isActive
                                                ? "bg-[#232152]/10 dark:bg-jadd-gold/10 text-[#232152] dark:text-jadd-gold"
                                                : "hover:bg-gray-100 dark:hover:bg-zinc-800 text-[#232152]/80 dark:text-foreground/80"
                                                }`}
                                        >
                                            <Link
                                                href={`/categories/${cat.name.en.toLowerCase().replace(/\s+/g, '-')}`}
                                                onClick={onClose}
                                                className="flex-1"
                                            >
                                                {categoryName}
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}