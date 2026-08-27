"use client";

import React, { useEffect, useState } from "react";
import { Heart, MessageSquare, Tag, ChevronLeft, Star, ChevronRight, Loader2, Video } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useChat } from "../../../src/components/ChatDrawerProvider";
import toast from "react-hot-toast";

export default function ProductDetailsPage() {
    const { id } = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [isFav, setIsFav] = useState(false);
    const router = useRouter();
    const { openChat } = useChat();
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [offerPrice, setOfferPrice] = useState("");
    const [myOffers, setMyOffers] = useState<any[]>([]);

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
            description: "Description",
            price: "Price",
            makeAnOffer: "Make an Offer",
            offerAccepted: "Offer Accepted",
            contactSeller: "Contact the seller.",
            offerPending: "Offer Pending: Awaiting response",
            verifiedSeller: "Verified Seller",
            chat: "Chat",
            removeFav: "Remove from Favorites",
            addFav: "Add to Favorites",
            moreFromSeller: "More from this seller",
            modalTitle: "Make an Offer",
            currentPrice: "Current Price",
            yourOfferPrice: "Your Offer Price (OMR)",
            enterPrice: "Enter your price",
            cancel: "Cancel",
            submitOffer: "Submit Offer",
            offerSent: "Offer sent!",
            offerFailed: "Failed to send offer",
            loginRequired: "Please login first to continue.",
            buyNow: "Buy Now",
            buyNowSent: "Purchase request sent successfully!",
            buyNowFailed: "Failed to send purchase request",
        },
        ar: {
            description: "الوصف",
            price: "السعر",
            makeAnOffer: "قدم عرضاً",
            offerAccepted: "تم قبول العرض",
            contactSeller: "تواصل مع البائع.",
            offerPending: "العرض قيد الانتظار: في انتظار الرد",
            verifiedSeller: "بائع معتمد",
            chat: "محادثة",
            removeFav: "إزالة من المفضلة",
            addFav: "إضافة إلى المفضلة",
            moreFromSeller: "المزيد من هذا البائع",
            modalTitle: "قدم عرضاً",
            currentPrice: "السعر الحالي",
            yourOfferPrice: "سعر العرض الخاص بك (رع)",
            enterPrice: "أدخل السعر الخاص بك",
            cancel: "إلغاء",
            submitOffer: "إرسال العرض",
            offerSent: "تم إرسال العرض!",
            offerFailed: "فشل إرسال العرض",
            loginRequired: "يرجى تسجيل الدخول أولاً للمتابعة.",
            buyNow: "شراء الآن",
            buyNowSent: "تم إرسال طلب الشراء بنجاح!",
            buyNowFailed: "فشل إرسال طلب الشراء",
        }
    };

    const currentText = t[lang];

    const conditionTranslations: Record<string, { en: string; ar: string }> = {
        "New": { en: "New", ar: "جديد" },
        "Like New": { en: "Like New", ar: "كانه جديد" },
        "Used - Clean": { en: "Used - Clean", ar: "مستعمل - نظيف" },
        "Used - Fair": { en: "Used - Fair", ar: "مستعمل - بحالة جيدة" }
    };

    const acceptedOffer = myOffers.find(o => o.status === 'accepted');
    const pendingOffer = myOffers.find(o => o.status === 'pending');

    const handleStartChat = async () => {
        const token = localStorage.getItem("jadd-token");
        if (!token) {
            router.push("/login");
            return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/access`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                senderId: "ID_المشتري_من_التوكن", // يفضل استخراجه من التوكن أو الـ Context
                receiverId: data.product.userId._id,
                productId: data.product._id
            })
        });

        const conversation = await res.json();
        if (conversation._id) {
            openChat(conversation._id);
        }
    }

    // تحديث: جلب المنتج + حالة المفضلة عند تحميل الصفحة
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const token = localStorage.getItem("jadd-token");

            // جلب بيانات المنتج
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/product/${id}`, {
                headers: token ? { "Authorization": `Bearer ${token}` } : {}
            });
            const productData = await res.json();
            setData(productData);
            setMyOffers(productData.myOffers || []);

            // جلب قائمة المفضلة للتأكد من حالة الزر عند الريفرش
            if (token) {
                const favRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/favorites`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (favRes.ok) {
                    const favorites = await favRes.json();
                    // التأكد إذا كان المنتج الحالي ضمن المفضلة
                    const isProductFav = favorites.some((p: any) => p._id === id);
                    setIsFav(isProductFav);
                }
            }
            setLoading(false);
        };
        fetchData();
    }, [id]);

    const toggleFavorite = async () => {
        const token = localStorage.getItem("jadd-token");
        if (!token) return alert("Please login");

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/favorites/toggle`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ productId: id })
        });
        setIsFav(!isFav);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-zinc-950"><Loader2 className="animate-spin text-[#1F1547] dark:text-[#D6C88A]" /></div>;

    const { product, relatedProducts } = data;
    const images = product.images?.length > 0 ? product.images : ["/placeholder.jpg"];

    const checkAuth = () => {
        const token = localStorage.getItem("jadd-token");
        if (!token) {
            toast.error(currentText.loginRequired);
            router.push("/login");
            return false;
        }
        return true;
    };





    return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-zinc-950 py-8 px-4 transition-colors" dir={lang === "ar" ? "rtl" : "ltr"}>
            <div className="max-w-6xl mx-auto">


                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 ">

                    <div className="md:col-span-6 order-1 md:order-2">
                        <div className="sticky top-35 space-y-4">
                            {/* قسم المعاينة الكبرى */}
                            <div className="relative aspect-[4/3] w-full bg-zinc-200 dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-sm">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeImage}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="w-full h-full"
                                    >
                                        {/* التحقق مما إذا كان العنصر الحالي عبارة عن فيديو أو صورة */}
                                        {product.video && activeImage === images.length ? (
                                            <video
                                                src={product.video}
                                                controls
                                                className="w-full h-full object-contain bg-black"
                                            />
                                        ) : (
                                            <img
                                                src={images[activeImage]}
                                                className="w-full h-full object-contain"
                                                alt="Product media"
                                            />
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                {/* أزرار التنقل (يتم حساب إجمالي العناصر ليشمل الصور والفيديو إن وجد) */}
                                {(images.length > 1 || product.video) && (
                                    <>
                                        <button
                                            onClick={() => setActiveImage(p => (p === 0 ? (product.video ? images.length : images.length - 1) : p - 1))}
                                            className={`absolute ${lang === "ar" ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 bg-white/90 dark:bg-white/20 p-2 rounded-full z-10`}
                                        >
                                            <ChevronLeft />
                                        </button>
                                        <button
                                            onClick={() => {
                                                const maxIndex = product.video ? images.length : images.length - 1;
                                                setActiveImage(p => (p === maxIndex ? 0 : p + 1));
                                            }}
                                            className={`absolute ${lang === "ar" ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 bg-white/50 dark:bg-white/20 p-2 rounded-full z-10`}
                                        >
                                            <ChevronRight />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* شريط الصور المصغرة + فيديو مصغر */}
                            <div className="grid grid-cols-6 gap-3">
                                {images.map((img: string, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`aspect-square bg-zinc-200 dark:bg-zinc-900 rounded-2xl overflow-hidden border-2 ${activeImage === i ? 'border-[#1F1547] dark:border-[#D6C88A]' : 'border-transparent'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                                    </button>
                                ))}

                                {/* زر مصغر للفيديو في حال وجود فيديو مرفق مع المنتج */}
                                {product.video && (
                                    <button
                                        onClick={() => setActiveImage(images.length)}
                                        className={`relative aspect-square bg-black rounded-2xl overflow-hidden border-2 flex items-center justify-center ${activeImage === images.length ? 'border-[#1F1547] dark:border-[#D6C88A]' : 'border-transparent'}`}
                                    >
                                        <video src={product.video} className="w-full h-full object-cover opacity-60" />
                                        <div className="absolute inset-0 flex items-center justify-center text-white">
                                            <Video size={20} />
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-6 space-y-5 order-2 md:order-1 ">
                        <div>
                            <div className="inline-block px-3 py-1 bg-[#1F1547]/5 dark:bg-[#D6C88A]/10 text-black dark:text-white rounded-full text-[10px] font-bold mb-4 uppercase tracking-wider">
                                {conditionTranslations[product.condition]
                                    ? conditionTranslations[product.condition][lang]
                                    : product.condition}
                            </div>
                            <h1 className="text-2xl md:text-4xl font-[600] text-[#1F1547] dark:text-[#D6C88A]">{product.title}</h1>
                        </div>

                        <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

                        <div className="space-y-3">
                            <h3 className="font-bold text-xs text-zinc-400 uppercase">{currentText.description}</h3>
                            <p className="text-1xl font-[600] text-[#232152]/70 dark:text-foreground/70">{product.description}</p>
                        </div>

                        <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

                        {/* قسم السعر */}
                        <div >
                            <h3 className="font-bold text-xs text-zinc-400 uppercase tracking-widest">{currentText.price}</h3>
                            <div className="flex items-center justify-between">
                                <div className="text-1xl font-bold h-7 rounded-lg flex items-center gap-1.5">
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
                                {!data?.isOwner && (
                                    !localStorage.getItem("jadd-token") ? (
                                        <button
                                            onClick={() => router.push("/login")}
                                            className="flex items-center gap-2 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 px-4 py-2 rounded-2xl font-bold hover:border-[#1F1547] hover:text-[#1F1547] dark:hover:border-[#D6C88A] dark:hover:text-[#D6C88A]  transition-all"
                                        >
                                            {currentText.makeAnOffer}
                                        </button>
                                    ) : acceptedOffer ? (
                                        <div className="px-4 py-2 rounded-2xl font-bold text-sm bg-green-100 text-green-700">
                                            {currentText.offerAccepted}: {acceptedOffer.offerPrice} {lang === "ar" ? "رع" : "OMR"}. {currentText.contactSeller}
                                        </div>
                                    ) : pendingOffer ? (
                                        <div className="px-4 py-2 rounded-2xl font-bold text-sm bg-amber-100 text-amber-700">
                                            {currentText.offerPending}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setShowOfferModal(true)}
                                            className="flex items-center gap-2 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 px-4 py-2 rounded-2xl font-bold hover:border-[#1F1547] hover:text-[#1F1547] dark:hover:border-[#D6C88A] dark:hover:text-[#D6C88A]  transition-all"
                                        >
                                            {currentText.makeAnOffer}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                        {showOfferModal && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4"
                            >
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-white dark:bg-zinc-900 p-6 rounded-3xl w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-2xl"
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-lg dark:text-white">{currentText.modalTitle}</h3>
                                        <button onClick={() => setShowOfferModal(false)} className="text-zinc-400 hover:text-red-500">✕</button>
                                    </div>

                                    {/* تفاصيل المنتج المرتبطة بالـ Modal */}
                                    <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl mb-6">
                                        <img src={images[0]} alt={product.title} className="w-16 h-16 rounded-xl object-cover" />
                                        <div>
                                            <h4 className="font-bold text-[#1F1547] dark:text-white">{product.title}</h4>
                                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">{currentText.currentPrice}: {product.price} {lang === "ar" ? "رع" : "OMR"}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-zinc-400 uppercase">{currentText.yourOfferPrice}</label>
                                        <input
                                            type="number"
                                            placeholder={currentText.enterPrice}
                                            className="w-full p-4 rounded-2xl border-2 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 focus:border-[#1F1547] dark:focus:border-[#D6C88A] outline-none transition-all text-lg font-bold"
                                            value={offerPrice}
                                            onChange={(e) => setOfferPrice(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <button
                                            onClick={() => setShowOfferModal(false)}
                                            className="flex-1 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 font-bold hover:bg-zinc-200 transition-colors"
                                        >
                                            {currentText.cancel}
                                        </button>
                                        <button
                                            onClick={async () => {
                                                const token = localStorage.getItem("jadd-token");
                                                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/create`, {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                        "Authorization": `Bearer ${token}`
                                                    },
                                                    body: JSON.stringify({
                                                        productId: product._id,
                                                        sellerId: product.userId._id,
                                                        offerPrice: Number(offerPrice)
                                                    })
                                                });
                                                if (res.ok) {
                                                    toast.success(currentText.offerSent);
                                                    setMyOffers(prev => [...prev, { status: 'pending', offerPrice: Number(offerPrice) }]);
                                                    setShowOfferModal(false);
                                                    setOfferPrice("");
                                                } else {
                                                    toast.error(currentText.offerFailed);
                                                }
                                            }}
                                            className="flex-1 py-3 rounded-2xl bg-[#1F1547] text-white dark:bg-[#D6C88A] dark:text-black font-bold hover:opacity-90 transition-all"
                                        >
                                            {currentText.submitOffer}
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* كرت البائع الموحد (تحسين الـ UX) */}
                        {/* ابحث عن هذا الجزء في الكود الخاص بك وقم بتعديله */}
                        {/* كرت البائع الموحد مع التقييمات */}
                        <Link
                            href={`/sellerProfile/${product.userId?._id}`}
                            className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:border-[#1F1547] dark:hover:border-[#D6C88A] transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center font-bold text-[#1F1547] dark:text-[#D6C88A] text-lg">
                                    {product.userId?.fullName[0]}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm dark:text-white flex items-center gap-2">
                                        {product.userId?.fullName}
                                    </h4>

                                    {/* عرض النجوم وعدد المراجعين */}
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="flex items-center text-amber-500">
                                            <Star size={14} className="fill-current" />
                                        </div>
                                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                            {data.sellerStats?.averageRating > 0 ? data.sellerStats.averageRating : "0.0"}
                                        </span>
                                        <span className="text-[10px] text-zinc-400">
                                            ({data.sellerStats?.reviewsCount || 0} {lang === "ar" ? "تقييم" : "reviews"})
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {!data?.isOwner && (
                                <div onClick={(e) => e.preventDefault()}>
                                    <button onClick={() => {
                                        if (checkAuth()) handleStartChat();
                                    }} className="bg-[#1F1547] dark:bg-[#D6C88A] text-white dark:text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-[#1F1547]/20 dark:shadow-[#D6C88A]/20 hover:scale-105 transition-transform">
                                        <MessageSquare size={18} /> {currentText.chat}
                                    </button>
                                </div>
                            )}
                        </Link>

                        {/* زر شراء الآن */}
                        {/* زر شراء الآن (يظهر فقط إذا لم يكن هناك عرض معلق أو مقبول) */}
                        {!data?.isOwner && !acceptedOffer && !pendingOffer && (
                            <button
                                onClick={async () => {
                                    if (!checkAuth()) return;
                                    const token = localStorage.getItem("jadd-token");
                                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/create`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "Authorization": `Bearer ${token}`
                                        },
                                        body: JSON.stringify({
                                            productId: product._id,
                                            sellerId: product.userId._id,
                                            offerPrice: Number(product.price) // إرسال السعر الأساسي للمنتج كطلب شراء
                                        })
                                    });
                                    if (res.ok) {
                                        toast.success(currentText.buyNowSent);
                                        setMyOffers(prev => [...prev, { status: 'pending', offerPrice: Number(product.price) }]);
                                    } else {
                                        toast.error(currentText.buyNowFailed);
                                    }
                                }}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#1F1547] text-white dark:bg-[#D6C88A] dark:text-black font-bold hover:opacity-90 transition-all shadow-lg"
                            >
                                {currentText.buyNow}
                            </button>
                        )}

                        <button onClick={() => {
                            if (checkAuth()) toggleFavorite();
                        }} className={`w-full flex items-center justify-center gap-2 py-3 border rounded-2xl transition-colors ${isFav ? 'bg-red-50 dark:bg-red-900/20  text-red-600' : 'text-zinc-500 border-zinc-200 dark:border-zinc-800'}`}>
                            <Heart className={isFav ? "fill-red-500 text-red-500" : ""} /> {isFav ? currentText.removeFav : currentText.addFav}
                        </button>
                    </div>
                </div>

                <div className="mt-20">
                    <h3 className="text-xl font-[800] mb-8 text-[#1F1547] dark:text-white">{currentText.moreFromSeller}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedProducts.map((item: any) => (
                            <Link href={`/product/${item._id}`} key={item._id} className="group bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                                <img src={item.images?.[0] || "/placeholder.jpg"} className="aspect-square rounded-2xl mb-4 object-cover" />
                                <h4 className="font-bold text-sm dark:text-white">{item.title}</h4>
                                <div className="text-xs font-bold h-7 rounded-lg flex items-center gap-1.5">
                                    <span>{item.price}</span>

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
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}