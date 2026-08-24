"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, Heart, MessageSquare, Plus, User } from "lucide-react";
import toast from "react-hot-toast";
import { useChat } from "@/src/components/ChatDrawerProvider";

export default function MobileBottomNav() {
    const router = useRouter();
    const { toggleChat } = useChat();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [lang, setLang] = useState<"en" | "ar">("en");
    const [userStatus, setUserStatus] = useState<string>("unverified");
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userImage, setUserImage] = useState<string | null>(null);
    const [hasUnreadChats, setHasUnreadChats] = useState(false);

    const checkUnreadChats = async () => {
        const token = localStorage.getItem("jadd-token");
        if (!token) return;

        try {
            const response = await fetch("https://jadd-production-275a.up.railway.app/user/unread-count", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setHasUnreadChats(data.hasUnread);
            }
        } catch (error) {
            console.error("Error checking unread chats", error);
        }
    };
    // دالة لجلب الحالة وتحديث الـ State فوراً
    const checkUserState = () => {
        const token = localStorage.getItem("jadd-token");
        if (token) {
            setIsLoggedIn(true);
            checkUnreadChats();
            fetch("https://jadd-production-275a.up.railway.app/user/profile", {
                headers: { "Authorization": `Bearer ${token}` }
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.verificationStatus) {
                        setUserStatus(data.verificationStatus);
                    }
                    if (data.profileImage) {
                        setUserImage(data.profileImage);
                    }
                })
                .catch((err) => {
                    console.error("Error fetching user profile status:", err);
                    setIsLoggedIn(false);
                    setUserStatus("unverified");
                    setUserImage(null);
                });
        } else {
            setIsLoggedIn(false);
            setUserStatus("unverified");
            setUserImage(null);
            setHasUnreadChats(false);
        }
    };

    useEffect(() => {
        setMounted(true);
        const savedLang = localStorage.getItem("jadd-lang") as "en" | "ar";
        if (savedLang) {
            setLang(savedLang);
        }

        checkUserState();

        // الاستماع لحدث تسجيل الدخول والخروج الفوري
        const handleCustomAuthChange = () => {
            checkUserState();
        };

        // الاستماع لحدث تغيير اللغة الفوري
        const handleLanguageChange = () => {
            const currentLang = localStorage.getItem("jadd-lang") as "en" | "ar";
            if (currentLang && (currentLang === "en" || currentLang === "ar")) {
                setLang(currentLang);
            }
        };

        window.addEventListener("userStateChanged", handleCustomAuthChange);
        window.addEventListener("languageChanged", handleLanguageChange);

        return () => {
            window.removeEventListener("userStateChanged", handleCustomAuthChange);
            window.removeEventListener("languageChanged", handleLanguageChange);
        };
    }, []);

    const t = {
        en: {
            home: "Home",
            favourites: "Favourites",
            chats: "Chats",
            profile: "Profile",
            verifyError: "Please verify your ID to add products.",
            reviewError: "Your ID is under review. Please wait.",
            serverError: "Error connecting to server",
            loginFirst: "Please login first to continue."
        },
        ar: {
            home: "الرئيسية",
            favourites: "المفضلة",
            chats: "المحادثات",
            profile: "الملف الشخصي",
            verifyError: "يرجى التحقق من هويتك لإضافة المنتجات.",
            reviewError: "هويتك قيد المراجعة. يرجى الانتظار.",
            serverError: "خطأ في الاتصال بالخادم",
            loginFirst: "يرجى تسجيل الدخول أولاً للمتابعة."
        }
    };

    const currentText = t[lang];

    const checkAuth = () => {
        const token = localStorage.getItem("jadd-token");
        if (!token) {
            toast.error(currentText.loginFirst);
            router.push("/login");
            return false;
        }
        return true;
    };

    const isAdminRoute = pathname.startsWith("/admin");
    if (!mounted || isAdminRoute) return null;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-white dark:bg-zinc-950 border-t border-border/40 h-16 px-6 flex items-center justify-between z-[9999] shadow-[0_-4px_20px_rgba(0,0,0,0.1)]" dir={lang === "ar" ? "rtl" : "ltr"}>

            {/* زر الرئيسية */}
            <button
                onClick={() => router.push("/")}
                className={`flex flex-col items-center gap-1 transition-colors ${pathname === "/" ? "text-jadd-gold" : "text-[#232152]/70 dark:text-foreground/70 hover:text-jadd-gold"}`}
            >
                <Home size={20} />
                <span className="text-[10px] font-bold">{currentText.home}</span>
            </button>

            {/* زر المفضلة */}
            <button
                onClick={() => {
                    if (checkAuth()) router.push("/favorites");
                }}
                className={`flex flex-col items-center gap-1 transition-colors ${pathname === "/favorites" ? "text-jadd-gold" : "text-[#232152]/70 dark:text-foreground/70 hover:text-jadd-gold"}`}
            >
                <Heart size={20} />
                <span className="text-[10px] font-bold">{currentText.favourites}</span>
            </button>

            {/* زر إضافة إعلان (في المنتصف) */}
            <button
                onClick={async () => {
                    const token = localStorage.getItem("jadd-token");
                    if (!checkAuth()) return;

                    try {
                        const response = await fetch(`https://jadd-production-275a.up.railway.app/user/profile-status`, {
                            headers: { "Authorization": `Bearer ${token}` }
                        });
                        const data = await response.json();

                        if (response.ok) {
                            if (data.status === 'unverified') {
                                toast.error(currentText.verifyError);
                                router.push("/verify-id");
                            } else if (data.status === 'pending') {
                                toast.error(currentText.reviewError);
                            } else if (data.status === 'verified') {
                                router.push("/add-product");
                            }
                        } else {
                            router.push("/login");
                        }
                    } catch (error) {
                        toast.error(currentText.serverError);
                    }
                }}
                className="w-10 h-10 -mt-2 bg-[#232152] dark:bg-jadd-gold text-white dark:text-[#232152] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            >
                <Plus size={24} />
            </button>

            {/* زر الشات */}
            {/* زر الشات */}
            <button
                onClick={() => {
                    if (checkAuth()) {
                        toggleChat();
                        setHasUnreadChats(false); // إخفاء النقطة الحمراء فور فتح الشات
                    }
                }}
                className="flex flex-col items-center gap-1 text-[#232152]/70 dark:text-foreground/70 hover:text-jadd-gold transition-colors relative"
            >
                <div className="relative">
                    <MessageSquare size={20} />
                    {hasUnreadChats && (
                        <span className="absolute -top-1 -right-1 bg-red-500 rounded-full h-2.5 w-2.5 ring-2 ring-white dark:ring-zinc-950 animate-pulse" />
                    )}
                </div>
                <span className="text-[10px] font-bold">{currentText.chats}</span>
            </button>

            {/* زر الملف الشخصي */}
            <button
                onClick={() => {
                    if (checkAuth()) router.push("/profile");
                }}
                className={`flex flex-col items-center gap-1 transition-colors ${pathname === "/profile" ? "text-jadd-gold" : "text-[#232152]/70 dark:text-foreground/70 hover:text-jadd-gold"}`}
            >
                {userImage ? (
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-border/40">
                        <img
                            src={userImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <User size={20} />
                )}
                <span className="text-[10px] font-bold">{currentText.profile}</span>
            </button>

        </div>
    );
}