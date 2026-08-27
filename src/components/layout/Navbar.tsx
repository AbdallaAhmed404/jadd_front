"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Plus, Heart, MessageSquare, User, Sun, Moon, LogIn, LogOut, Settings, Globe, Menu, Share, MapPin, Bell } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
// استيراد الـ hook الخاص بالـ Chat
import { useChat } from "../ChatDrawerProvider";
import toast from "react-hot-toast";
import { useCategories } from "@/src/components/CategoriesDrawerProvider";

export default function Navbar() {
  const [allProducts, setAllProducts] = useState([]); // لتخزين كل المنتجات
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]); // النتائج المفلترة
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [unreadChats, setUnreadChats] = useState(16);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categoriesList, setCategoriesList] = useState<{ _id: string, name: { ar: string, en: string } }[]>([]);
  // استخدام الـ hook للتحكم في الشات
  const { toggleChat } = useChat();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState("");
  const menuRef = React.useRef<HTMLDivElement>(null);
  const { openCategories } = useCategories();
  // حالة ظهور نافذة إرشاد التثبيت
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [deviceType, setDeviceType] = useState<"ios" | "chrome" | null>(null);
  const [hasUnreadChats, setHasUnreadChats] = useState(false);
  const notificationMenuRef = React.useRef<HTMLDivElement>(null);
  const [isManualSubMenuOpen, setIsManualSubMenuOpen] = useState(false);

  // نظام اللغات (عربي / إنجليزي)
  const [lang, setLang] = useState<"en" | "ar">("en");

  // حالات الموقع الجغرافي
  const [userLocation, setUserLocation] = useState<{ address: string; latitude: number | null; longitude: number | null }>({
    address: lang === "ar" ? "الموقع الجغرافي" : "Location",
    latitude: null,
    longitude: null,
  });
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const locationMenuRef = React.useRef<HTMLDivElement>(null);

  // أضف هذه الـ states مع باقي الـ states الموجودة فوق
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false); // لقائمة الإشعارات

  // قائمة المدن للاختيار اليدوي
  const manualLocations = [
    { name: { ar: "مسقط", en: "Muscat" }, lat: 23.5859, lng: 58.4059 },
    { name: { ar: "ظفار", en: "Dhofar" }, lat: 17.0151, lng: 54.0924 },
     { name: { ar: "شمال الباطنة", en: "North Al Batinah" }, lat: 24.3473, lng: 56.7323 },
    { name: { ar: "جنوب الباطنة", en: "South Al Batinah" }, lat: 23.3911, lng: 57.8631 },
    { name: { ar: "الداخلية", en: "Al Dakhiliyah" }, lat: 22.9004, lng: 57.5332 },
    { name: { ar: "شمال الشرقية", en: "North Al Sharqiyah" }, lat: 22.6937, lng: 58.5306 },
    { name: { ar: "جنوب الشرقية", en: "South Al Sharqiyah" }, lat: 22.5667, lng: 59.5289 },
     { name: { ar: "الظاهرة", en: "Al Dhahirah" }, lat: 23.2353, lng: 56.5447 },
    { name: { ar: "البريمي", en: "Al Buraimi" }, lat: 24.2513, lng: 55.7932 },
    { name: { ar: "الوسطى", en: "Al Wusta" }, lat: 19.9575, lng: 57.0818 },
    { name: { ar: "مسندم", en: "Musandam" }, lat: 26.1985, lng: 56.2465 },
  ];

  // دالة الحفظ وإرسال الموقع للباك اند
  // دالة حفظ الموقع محلياً (تطبق على المستخدم المسجل والزائر بنفس الطريقة)
  const saveLocationLocally = (locData: { address: string; latitude: number; longitude: number }) => {
    localStorage.setItem("user-location", JSON.stringify(locData));
    setUserLocation(locData);
    setIsLocationDropdownOpen(false);
    toast.success(lang === "ar" ? "تم تحديد الموقع بنجاح" : "Location set successfully");

    // إطلاق حدث وهمي إذا احتجت لتحديث أي مكونات أخرى في الصفحة
    window.dispatchEvent(new Event("locationChanged"));
  };

  // دالة جلب الموقع عبر الـ GPS
  // دالة جلب الموقع عبر الـ GPS مع تحويل الإحداثيات لاسم مكان
  const handleGetGPSLocation = async () => {
    if (!navigator.geolocation) {
      toast.error(lang === "ar" ? "المتصفح لا يدعم تحديد الموقع" : "Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          // استخدام خدمة Nominatim لتحويل الإحداثيات لاسم مكان
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=${lang}`
          );
          const data = await response.json();

          // استخراج اسم المنطقة أو المدينة أو العنوان
          const address = data.address?.city || data.address?.town || data.address?.village || data.address?.state || "Unknown Location";

          saveLocationLocally({
            address: address, // الآن سيتم حفظ اسم المكان بدلاً من "Current Location"
            latitude: lat,
            longitude: lng
          });
        } catch (error) {
          // في حال فشل جلب الاسم، نكتفي بحفظ الإحداثيات أو رسالة افتراضية
          saveLocationLocally({
            address: lang === "ar" ? "الموقع الحالي" : "Current Location",
            latitude: lat,
            longitude: lng
          });
        }
      },
      () => {
        toast.error(lang === "ar" ? "فشل تحديد الموقع، تأكد من الصلاحيات" : "Failed to get location");
      }
    );
  };

  // تحديث كلمة الموقع الافتراضية فور تغيير اللغة إذا لم يتم اختيار موقع مخصص
  useEffect(() => {
    if (!userLocation.latitude && !userLocation.longitude) {
      setUserLocation(prev => ({
        ...prev,
        address: lang === "ar" ? "الموقع الجغرافي" : "Location"
      }));
    }
  }, [lang]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    if (isNotificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotificationsOpen]);

  // إغلاق قائمة الموقع عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationMenuRef.current && !locationMenuRef.current.contains(event.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
    };
    if (isLocationDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLocationDropdownOpen]);

  useEffect(() => {
    const savedLang = localStorage.getItem("jadd-lang") as "en" | "ar";
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "ar" : "en";
    setLang(newLang);
    localStorage.setItem("jadd-lang", newLang);
    window.dispatchEvent(new Event("languageChanged"));
  };

  // فحص الجهاز وإظهار النافذة الإرشادية مرة واحدة لكل جلسة
  useEffect(() => {
    const hasSeenInstallGuide = sessionStorage.getItem("jadd-install-guide-shown");
    if (hasSeenInstallGuide) return;

    // فحص إذا كان التطبيق مثبتاً بالفعل كـ PWA
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone;
    if (isStandalone) return;

    // فحص نوع الجهاز
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    const timer = setTimeout(() => {
      if (isIOS) {
        setDeviceType("ios");
        setShowInstallModal(true);
      } else if (isChrome) {
        setDeviceType("chrome");
        setShowInstallModal(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // النصوص المترجمة
  const t = {
    en: {
      searchPlaceholder: "Search products...",
      noProducts: "No products found",
      addListing: "Add Listing",
      favourites: "Favourites",
      chats: "Chats",
      profile: "Profile",
      controlCenter: "Control Center",
      logout: "Logout",
      login: "Login",
      lightMode: "Light Mode",
      darkMode: "Dark Mode",
      verifyError: "Please verify your ID to add products.",
      reviewError: "Your ID is under review. Please wait.",
      serverError: "Error connecting to server",
      loginFirst: "Please login first to continue.",
      notifications: "Notifications",
      noNotifications: "No notifications",
    },
    ar: {
      searchPlaceholder: "ابحث عن المنتجات...",
      noProducts: "لم يتم العثور على منتجات",
      addListing: "إضافة إعلان",
      favourites: "المفضلة",
      chats: "المحادثات",
      profile: "الملف الشخصي",
      controlCenter: "لوحة التحكم",
      logout: "تسجيل الخروج",
      login: "تسجيل الدخول",
      lightMode: "الوضع الفاتح",
      darkMode: "الوضع الداكن",
      verifyError: "يرجى التحقق من هويتك لإضافة المنتجات.",
      reviewError: "هويتك قيد المراجعة. يرجى الانتظار.",
      serverError: "خطأ في الاتصال بالخادم",
      loginFirst: "يرجى تسجيل الدخول أولاً للمتابعة.",
      notifications: "الإشعارات",
      noNotifications: "لا توجد إشعارات",
    }
  };

  const currentText = t[lang];

  // 2. أضف هذا الـ useEffect لمراقبة الضغطات خارج القائمة
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false); // إغلاق القائمة
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/allproduct`)
      .then((res) => res.json())
      .then((data) => {
        const products = Array.isArray(data) ? data : (data.data || []);
        setAllProducts(products);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setAllProducts([]);
      });
  }, []);

  const searchRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const query = searchQuery.toLowerCase().trim();
      const results = allProducts.filter((product: any) => {
        const titleMatch = product.title?.toLowerCase().includes(query);

        let categoryMatch = false;
        if (typeof product.category === 'string') {
          categoryMatch = product.category.toLowerCase().includes(query);
        } else if (product.category && typeof product.category === 'object') {
          // التعامل مع هيكل الـ Schema الجديد (name.ar و name.en)
          const catNameObj = product.category.name || product.category;
          const catAr = catNameObj.ar?.toLowerCase() || '';
          const catEn = catNameObj.en?.toLowerCase() || '';
          categoryMatch = catAr.includes(query) || catEn.includes(query);
        }

        return titleMatch || categoryMatch;
      });
      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  }, [searchQuery, allProducts]);

  const checkUnreadChats = async () => {
    const token = localStorage.getItem("jadd-token");
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/unread-count`, { // (تأكد أن هذا هو الـ Route الصحيح الذي قمت بإنبطاقه في الـ Backend)
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setHasUnreadChats(data.hasUnread); // ستكون true أو false
      }
    } catch (error) {
      console.error("Error checking unread chats", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      checkUnreadChats();
    }
  }, [isLoggedIn]);



  const fetchNotifications = async () => {
    const token = localStorage.getItem("jadd-token");
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/notification`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();

      setNotifications(data); // البيانات القادمة من السيرفر هي غير المقروءة فقط
      setUnreadCount(data.length); // العدد هو طول المصفوفة الحالية
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  const markAsRead = async (id: string) => {
    const token = localStorage.getItem("jadd-token");
    if (!token) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/notification/${id}`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
      });

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    const token = localStorage.getItem("jadd-token");
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/notification/read-all`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        // تحديث الحالة محلياً لتصفير العداد وتغيير شكل الإشعارات إلى مقروءة
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        toast.success(lang === "ar" ? "تم تحديد الكل كمقروء" : "All marked as read");
      }
    } catch (error) {
      console.error("Error marking all notifications as read", error);
    }
  };

  // استدعها داخل الـ useEffect الذي يتحقق من وجود التوكن
  useEffect(() => {
    if (isLoggedIn) fetchNotifications();
  }, [isLoggedIn]);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("jadd-token");

    if (token) {
      setIsLoggedIn(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.profileImage) {
            setUserImage(data.profileImage);
            setUserStatus(data.verificationStatus);
          }
        })
        .catch((err) => console.error("Error fetching user profile:", err));
    }

    // قراءة الموقع محلياً في كل الأحوال (سواء مسجل أو زائر)
    const savedLocalLoc = localStorage.getItem("user-location");
    if (savedLocalLoc) {
      try {
        const parsedLoc = JSON.parse(savedLocalLoc);
        setUserLocation(parsedLoc);
      } catch (e) {
        console.error("Error parsing local location", e);
      }
    }
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/categories`)
      .then((res) => res.json())
      .then((data) => {
        const allCats = [
          {
            _id: "all",
            name: { ar: "جميع الفئات", en: "All Categories" }
          },
          ...(data.data || [])
        ];
        setCategoriesList(allCats);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("jadd-token");
    setIsLoggedIn(!!token);

    const isDark = document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark";
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jadd-token");
    setIsLoggedIn(false);
    setIsProfileOpen(false);
    window.dispatchEvent(new Event("userStateChanged"));
    router.push("/login");
  };

  const isAdminRoute = pathname.startsWith("/admin");
  if (!mounted || isAdminRoute) return null;

  const checkAuthh = () => {
    const token = localStorage.getItem("jadd-token");
    if (!token) {
      toast.error(currentText.loginFirst);
      router.push("/login");
      return false;
    }
    return true;
  };

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 w-full bg-[white] dark:bg-background/95 backdrop-blur-md shadow-[0_4px_20px_rgba(17,16,42,0.03)] transition-colors duration-300" dir={lang === "ar" ? "rtl" : "ltr"}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">

          {/* ================= الصف العلوي (العناصر الأساسية) ================= */}
          <div className="h-20 flex items-center justify-between md:gap-8 border-b border-border/40">

            {/* اللوجو الحقيقي المعتمد على وضع الإضاءة */}
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/" className="group flex items-center">
                {isDarkMode ? (
                  <Image
                    src="/logo-dark.png"
                    alt="JADD Logo"
                    width={100}
                    height={40}
                    priority
                    className="object-contain group-hover:opacity-90 transition-opacity"
                  />
                ) : (
                  <Image
                    src="/logo-white.png"
                    alt="JADD Logo"
                    width={100}
                    height={40}
                    priority
                    className="object-contain group-hover:opacity-90 transition-opacity"
                  />
                )}
              </Link>
            </div>

            {/* شريط البحث الذكي */}
            <div className="flex-1 max-w-xl relative sm:mx-4" ref={searchRef}>
              <div className={`absolute ${lang === "ar" ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-[#232152]/40 dark:text-foreground/40 pointer-events-none`}>
                <Search size={18} strokeWidth={2.5} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={currentText.searchPlaceholder}
                className={`w-full h-11 ${lang === "ar" ? "pr-11 pl-4" : "pl-11 pr-4"} bg-jadd-ivory/50 dark:bg-muted rounded-full outline-none focus:ring-2 focus:ring-jadd-gold transition-all`}
              />

              {/* قائمة النتائج */}
              {searchQuery.length > 0 && (
                <div className="absolute top-14 left-0 w-full bg-white dark:bg-zinc-900 border-border shadow-xl z-50 py-2 max-h-60 overflow-y-auto">
                  {filteredResults.length > 0 ? (
                    filteredResults.map((product: any) => (
                      <Link
                        href={`/product/${product._id}`}
                        key={product._id}
                        onClick={() => { setSearchQuery(""); }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <span className="text-sm font-medium">{product.title}</span>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">{currentText.noProducts}</div>
                  )}
                </div>
              )}
            </div>

            {/* الروابط والأزرار جهة اليمين/اليسار */}
            <div className="flex items-center gap-3 md:gap-5 text-[#232152]/80 dark:text-foreground/80 shrink-0">



              {/* زر إضافة إعلان جديد */}
              <button
                onClick={async () => {
                  const token = localStorage.getItem("jadd-token");
                  checkAuthh();

                  try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile-status`, {
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
                className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-[#232152] dark:bg-jadd-gold text-white dark:text-[#232152] rounded-full hover:opacity-90 transition-all font-bold text-xs uppercase tracking-wider"
              >
                <Plus size={16} />
                <span className="hidden lg:inline">{currentText.addListing}</span>
              </button>

              <button
                onClick={() => {
                  if (checkAuthh()) router.push("/favorites");
                }}
                className="hidden md:flex items-center gap-1.5 text-[#232152]/90 dark:text-foreground/90 hover:text-jadd-gold transition-colors group py-2"
              >
                <Heart size={20} className="group-hover:scale-105 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-wider hidden lg:inline">{currentText.favourites}</span>
              </button>

              <button
                onClick={() => {
                  if (checkAuthh()) {
                    toggleChat();
                    setHasUnreadChats(false); // إخفاء النقطة الحمراء عند فتح الشات
                  }
                }}
                className="hidden md:flex items-center gap-1.5 text-[#232152]/90 dark:text-foreground/90 hover:text-jadd-gold transition-colors group relative py-2"
              >
                <div className="relative">
                  <MessageSquare size={20} className="group-hover:scale-105 transition-transform" />

                  {/* النقطة الحمراء تظهر فقط لو فيه رسالة واحدة على الأقل غير مقروءة */}
                  {hasUnreadChats && (
                    <span className="absolute -top-1 -right-1 bg-red-500 rounded-full h-2.5 w-2.5 ring-2 ring-white dark:ring-zinc-900 animate-pulse" />
                  )}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider hidden lg:inline">{currentText.chats}</span>
              </button>

              {/* مكان زر الإشعارات والقائمة المنسدلة */}
              <div className="relative">
                <button
                  onClick={() => {
                    if (checkAuthh()) setIsNotificationsOpen(!isNotificationsOpen);
                  }}
                  className="flex items-center gap-1.5 text-[#232152]/90 dark:text-foreground/90 hover:text-jadd-gold transition-colors group relative py-2"
                >
                  <div className="relative">
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </button>

                {/* القائمة المنسدلة للإشعارات متوافقة مع الثيمات واللغات */}
                {isNotificationsOpen && (
                  <div ref={notificationMenuRef} className={`absolute ${lang === "ar" ? "left-0" : "right-0"} mt-2 w-72 bg-white dark:bg-zinc-900 border border-border/60 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto`}>

                    {/* التعديل هنا: رأس القائمة يحتوي على العنوان وزر قراءة الكل */}
                    <div className="p-3 border-b border-border/40 flex items-center justify-between">
                      <span className="font-bold text-xs text-[#232152] dark:text-foreground">
                        {currentText.notifications}
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-[10px] text-jadd-gold hover:underline font-semibold bg-transparent border-none cursor-pointer"
                        >
                          {lang === "ar" ? "قراءة الكل" : "Mark all read"}
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-xs text-gray-500 dark:text-gray-400">{currentText.noNotifications}</p>
                    ) : (
                      notifications.map((notif: any) => (
                        <div
                          key={notif._id}
                          onClick={() => {
                            if (!notif.isRead) markAsRead(notif._id);
                            if (notif.type === 'review' && notif.userId) {
                              const targetUserId = typeof notif.userId === 'object' ? notif.userId._id : notif.userId;
                              setIsNotificationsOpen(false);
                              router.push(`/sellerProfile/${targetUserId}`);
                            }
                            if (notif.type === 'offer_received') {
                              setIsNotificationsOpen(false);
                              router.push('/sellerdashboard');
                            }
                          }}
                          className={`p-3 border-b border-border/40 text-xs cursor-pointer transition-colors ${!notif.isRead
                            ? 'bg-jadd-ivory/60 dark:bg-zinc-800/80 font-semibold'
                            : 'hover:bg-gray-50 dark:hover:bg-zinc-800/40 text-gray-600 dark:text-gray-300'
                            }`}
                        >
                          {/* اختيار العنوان بناءً على اللغة الحالية lang */}
                          <p className="font-bold text-[#232152] dark:text-foreground">
                            {typeof notif.title === 'object' ? notif.title[lang] : notif.title}
                          </p>

                          {/* اختيار الرسالة بناءً على اللغة الحالية lang */}
                          <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-0.5">
                            {typeof notif.message === 'object' ? notif.message[lang] : notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="h-6 w-[1px] bg-border/60 hidden sm:block" />

              {/* زر تبديل اللغة */}
              <button
                onClick={toggleLanguage}
                className="w-9 h-9 rounded-full bg-jadd-ivory/60 dark:bg-muted border border-border/40 hidden md:flex items-center justify-center text-[#232152]/70 dark:text-foreground/70 hover:text-jadd-gold transition-all text-xs font-bold"
              >
                <span>{lang === "en" ? "AR" : "EN"}</span>
              </button>

              {/* زر التبديل بين الثيمات */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-full bg-jadd-ivory/60 dark:bg-muted border border-border/40 hidden md:flex items-center justify-center text-[#232152]/70 dark:text-foreground/70 hover:text-jadd-gold transition-all"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* زر القائمة للموبايل فقط (ثلاث شرطات) */}
              <div className="relative">

                {/* 1. زر الموبايل فقط (أيقونة Menu - الثلاث شرطات) */}
                <div className="md:hidden">
                  <button
                    onClick={() => {
                      const token = localStorage.getItem("jadd-token");
                      setIsLoggedIn(!!token);
                      setIsProfileOpen(!isProfileOpen);
                    }}
                    className="relative flex items-center justify-center w-9 h-9 rounded-full bg-jadd-ivory/60 dark:bg-muted border border-border/40 overflow-hidden hover:ring-2 hover:ring-jadd-gold/50 transition-all"
                  >
                    <Menu size={18} className="text-[#232152]/70 dark:text-foreground/70" />
                  </button>
                </div>

                {/* 2. زر الديسكتوب فقط (صورة المستخدم أو أيقونة User) */}
                <div className="hidden md:block">
                  <button
                    onClick={() => {
                      const token = localStorage.getItem("jadd-token");
                      setIsLoggedIn(!!token);
                      setIsProfileOpen(!isProfileOpen);
                    }}
                    className="relative flex items-center justify-center w-9 h-9 rounded-full bg-jadd-ivory/60 dark:bg-muted border border-border/40 overflow-hidden hover:ring-2 hover:ring-jadd-gold/50 transition-all group"
                  >
                    {userImage ? (
                      <img
                        src={userImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={18} className="text-[#232152]/70 dark:text-foreground/70" />
                    )}
                  </button>
                </div>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div ref={menuRef} className={`absolute ${lang === "ar" ? "left-0" : "right-0"} top-12 w-48 bg-white dark:bg-zinc-900 border border-border rounded-xl shadow-xl p-2 z-50`}>

                    <div className="flex flex-col gap-1 border-b pb-2 mb-2">
                      {/* خيار الملف الشخصي يظهر في القائمة */}
                      {isLoggedIn && (
                        <Link
                          href="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="hidden md:flex items-center gap-2 px-3 py-2 text-xs font-bold hover:bg-jadd-ivory/50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                          <User size={14} /> {currentText.profile}
                        </Link>
                      )}

                      {/* خيار مركز التحكم (للبائعين الموثقين) */}
                      {isLoggedIn && userStatus === 'verified' && (
                        <Link
                          href="/sellerdashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-bold hover:bg-jadd-ivory/50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                          <Settings size={14} /> {currentText.controlCenter}
                        </Link>
                      )}


                      <button onClick={() => { toggleTheme(); setIsProfileOpen(false) }} className=" md:hidden  flex items-center gap-2 px-3 py-2 text-xs font-bold hover:bg-jadd-ivory/50 rounded-lg">
                        {isDarkMode ? <Sun size={14} /> : <Moon size={14} />} {isDarkMode ? currentText.lightMode : currentText.darkMode}
                      </button>
                      <button onClick={() => { toggleLanguage(); setIsProfileOpen(false) }} className=" md:hidden  flex items-center  gap-2 px-3 py-2 text-xs font-bold hover:bg-jadd-ivory/50 rounded-lg">
                        <Globe size={14} /> {lang === "en" ? "العربية" : "English"}
                      </button>
                    </div>

                    {isLoggedIn ? (
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <LogOut size={14} /> {currentText.logout}
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-jadd-gold hover:bg-jadd-ivory/50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <LogIn size={14} /> {currentText.login}
                      </Link>
                    )}


                  </div>
                )}

              </div>
            </div>
          </div>

          {/* ================= الصف السفلي (الكاتيجوري) ================= */}
          {/* ================= الصف السفلي (الكاتيجوري + زر الموقع) ================= */}
          <div className="h-14 flex items-center justify-between px-4 gap-3 relative">

            <div className="flex items-center gap-3 overflow-hidden w-full">
              {/* 1. الزر الأول الثابت (الكاتيجوري الرئيسية) */}
              {categoriesList.length > 0 && (
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={openCategories}
                    className="px-4 h-8 rounded-full text-[11px] font-bold tracking-tight whitespace-nowrap transition-all duration-200 border flex items-center justify-center cursor-pointer bg-jadd-ivory/40 dark:bg-muted border-border/30 text-[#232152]/70 dark:text-foreground/70 hover:border-jadd-gold hover:text-[#232152] dark:hover:border-jadd-gold dark:hover:text-foreground"
                  >
                    {categoriesList.length > 0 && (lang === "ar" ? categoriesList[0].name.ar : categoriesList[0].name.en)}
                  </button>
                  <div className="h-6 w-[1px] bg-border/60 dark:bg-zinc-800" />
                </div>
              )}

              {/* 2. باقي الكاتيجوري المتحركة (Scroll) */}
              <div className="overflow-x-auto no-scrollbar hidden md:flex items-center gap-2.5 w-full py-1 scroll-smooth">
                {categoriesList.slice(1).map((cat) => {
                  const categoryDisplayName = lang === "ar" ? cat.name.ar : cat.name.en;
                  const href = `/categories/${cat.name.en.toLowerCase().replace(/\s+/g, '-')}`;

                  return (
                    <Link
                      key={cat._id}
                      href={href}
                      className={`px-4 h-8 rounded-full text-[11px] font-bold tracking-tight whitespace-nowrap transition-all duration-200 border flex items-center justify-center ${pathname.includes(cat.name.en.toLowerCase().replace(/\s+/g, '-'))
                        ? "bg-[#232152] border-[#232152] text-white dark:bg-jadd-gold dark:border-jadd-gold dark:text-jadd-navy shadow-sm"
                        : "bg-jadd-ivory/40 dark:bg-muted border-border/30 text-[#232152]/70 dark:text-foreground/70 hover:border-jadd-gold hover:text-[#232152] dark:hover:border-jadd-gold dark:hover:text-foreground"
                        }`}
                    >
                      {categoryDisplayName}
                    </Link>
                  );
                })}
              </div>
            </div>



            {/* 3. زر الموقع الجغرافي والقائمة المندلعة في أقصى الشريط السفلي */}

            {/* 3. زر الموقع الجغرافي والقائمة المندلعة في أقصى الشريط السفلي */}
            <div className="relative shrink-0" ref={locationMenuRef}>
              <button
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="px-8 h-8 text-[11px] font-bold text-black dark:text-foreground flex items-center gap-1.5 hover:border-jadd-gold transition-all whitespace-nowrap"
              >
                <MapPin size={14} className="text-[#232152] dark:text-jadd-gold shrink-0" />
                <span className="max-w-[90px] truncate">
                  {userLocation.address}
                </span>
              </button>

              {/* القائمة الرئيسية المندلعة */}
              {isLocationDropdownOpen && (
                <div className={`absolute ${lang === "ar" ? "left-0" : "right-0"} top-10 w-48 bg-white dark:bg-zinc-900 border border-border rounded-xl shadow-xl p-2 z-50`}>

                  {/* زر GPS تلقائي */}
                  <button
                    onClick={() => {
                      handleGetGPSLocation();
                      setIsLocationDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#232152] dark:text-jadd-gold hover:bg-jadd-ivory/50 dark:hover:bg-zinc-800 rounded-lg transition-colors mb-1 border-b border-border/40 pb-2"
                  >
                    {lang === "ar" ? "تحديد الموقع تلقائياً" : "Auto-detect GPS"}
                  </button>

                  {/* زر "اختر يدوياً" مع سهم للتحكم في فتح/إغلاق قائمة الأماكن */}
                  <button
                    onClick={() => setIsManualSubMenuOpen(!isManualSubMenuOpen)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#232152] dark:text-jadd-gold hover:bg-jadd-ivory/50 dark:hover:bg-zinc-800 rounded-lg transition-colors mb-1 border-b border-border/40 pb-2"
                  >
                    <span>{lang === "ar" ? "أو اختر المحافظة:" : "Or select manually:"}</span>
                    {/* سهم يتغير اتجاهه بناءً على حالة الفتح والإغلاق */}
                    <span className={`transform transition-transform ${isManualSubMenuOpen ? (lang === "ar" ? "-rotate-90" : "rotate-90") : "rotate-0"}`}>
                      ▶
                    </span>
                  </button>

                  {/* قائمة الأماكن اليدوية الفرعية تظهر فقط عند الضغط على "اختر يدوياً" */}
                  {isManualSubMenuOpen && (
                    <div className="flex flex-col gap-1 mt-1 pt-1 border-t border-border/40">
                      {manualLocations.map((loc, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            saveLocationLocally({
                              address: lang === "ar" ? loc.name.ar : loc.name.en,
                              latitude: loc.lat,
                              longitude: loc.lng
                            });
                            setIsLocationDropdownOpen(false); // إغلاق القائمة الرئيسية بالكامل بعد الاختيار
                            setIsManualSubMenuOpen(false);   // إغلاق القائمة الفرعية
                          }}
                          className="w-full text-start px-3 py-1.5 text-xs font-medium hover:bg-jadd-ivory/50 dark:hover:bg-zinc-800 rounded-lg transition-colors text-[#232152] dark:text-foreground"
                        >
                          {lang === "ar" ? loc.name.ar : loc.name.en}
                        </button>
                      ))}
                    </div>
                  )}

                </div>
              )}
            </div>

          </div>
        </div>

      </header>


      {/* نافذة إرشاد التثبيت المنبثقة (Modal) أصبحت هنا خارج الهايدر لتغطي الشاشة بالكامل */}
      {showInstallModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60  animate-fadeIn" dir={lang === "ar" ? "rtl" : "ltr"}>
          <div className="bg-white dark:bg-zinc-900 shadow-2xl max-w-sm w-full p-6 relative flex flex-col items-center text-center">

            {/* العنوان */}
            <h3 className="text-base font-bold text-[#232152] dark:text-foreground mb-2">
              {lang === "ar" ? "تنبيه تثبيت التطبيق" : "Notification"}
            </h3>

            {/* الوصف حسب الجهاز */}
            <p className="text-xs text-[#232152]/70 dark:text-foreground/70 leading-relaxed mb-6 flex flex-wrap items-center justify-center gap-1">
              {deviceType === "ios" ? (
                lang === "ar" ? (
                  <>
                    اضغط على
                    <span className="inline-flex items-center justify-center p-1 mx-1 bg-jadd-ivory dark:bg-muted rounded-md border border-border/50">
                      <Share size={14} className="text-[#232152] dark:text-white" />
                    </span>
                    ثم اختر إضافة إلى الشاشة الرئيسية.
                  </>
                ) : (
                  <>
                    tap
                    <span className="inline-flex items-center justify-center p-1 mx-1 bg-jadd-ivory dark:bg-muted rounded-md border border-border/50">
                      <Share size={14} className="text-[#232152] dark:text-white" />
                    </span>
                    and select 'Add to Home Screen'.
                  </>
                )
              ) : (
                lang === "ar" ? (
                  "اضغط على (⋮) ثم اختر إضافة إلى الشاشة الرئيسية."
                ) : (
                  "click (⋮) and select Add to Home screen."
                )
              )}
            </p>

            {/* الأزرار */}
            <div className="flex items-center justify-end gap-3 w-full">
              <button
                onClick={() => {
                  setShowInstallModal(false);
                  sessionStorage.setItem("jadd-install-guide-shown", "true");
                }}
                className="text-[11px] text-gray-500 hover:text-[#232152] dark:hover:text-white transition-colors text-center underline bg-transparent border-none cursor-pointer py-1 font-semibold"
              >
                {lang === "ar" ? "ربما لاحقاً" : "Maybe Later"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}