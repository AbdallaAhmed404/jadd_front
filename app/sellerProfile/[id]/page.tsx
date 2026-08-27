"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { User, ShieldCheck, MapPin, Calendar, Star, Flag, Package, ShoppingBag } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function SellerProfile() {
  const { id } = useParams();
  const userId = id;
  const [data, setData] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [reportContent, setReportContent] = useState("");
  const [canReview, setCanReview] = useState(false);

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
      loadingText: "Loading...",
      errorText: "Error: ",
      joinedPrefix: "Joined ",
      noBio: "No bio provided.",
      verifiedSeller: "Verified Seller",
      reviewsTitle: "Reviews",
      cancelBtn: "Cancel",
      addReviewBtn: "+ Add Review",
      rateLabel: "Rate:",
      commentPlaceholder: "Write your comment...",
      submitReviewBtn: "Submit Review",
      activeListingsTitle: "Active Listings",
      noListings: "No active listings found.",
      reportTitle: "Report this seller",
      reportPlaceholder: "Please explain the reason for reporting...",
      sendReportBtn: "Send Report",
      reviewErrorToast: "Failed to add review",
      reportSuccessToast: "Report sent successfully",
      reportErrorToast: "Failed to send report",
      listingsCountLabel: "Listings",
      soldCountLabel: "Sold"
    },
    ar: {
      loadingText: "جاري التحميل...",
      errorText: "خطأ: ",
      joinedPrefix: "عضو منذ ",
      noBio: "لا يوجد نبذة تعريفية.",
      verifiedSeller: "بائع موثق",
      reviewsTitle: "التقييمات",
      cancelBtn: "إلغاء",
      addReviewBtn: "+ أضف تقييم",
      rateLabel: "التقييم:",
      commentPlaceholder: "اكتب تعليقك...",
      submitReviewBtn: "إرسال التقييم",
      activeListingsTitle: "الإعلانات النشطة",
      noListings: "لم يتم العثور على إعلانات نشطة.",
      reportTitle: "الإبلاغ عن هذا البائع",
      reportPlaceholder: "يرجى توضيح سبب الإبلاغ...",
      sendReportBtn: "إرسال البلاغ",
      reviewErrorToast: "فشل إضافة التقييم",
      reportSuccessToast: "تم إرسال البلاغ بنجاح",
      reportErrorToast: "فشل إرسال البلاغ",
      listingsCountLabel: "إعلان",
      soldCountLabel: "تم بيع"
    }
  };

  const currentText = t[lang];

  const fetchPageData = async () => {
    try {
      const token = localStorage.getItem("jadd-token");

      const [profileRes, reviewsRes, checkRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/sellerProfile/${userId}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/review/${userId}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/checkproduct/${userId}`, {
          headers: token ? { "Authorization": `Bearer ${token}` } : {}
        })
      ]);

      const profileData = await profileRes.json();
      const reviewsData = await reviewsRes.json();

      setData(profileData);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);

      if (checkRes.ok) {
        const checkData = await checkRes.json();
        setCanReview(checkData.exists);
      }

      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchPageData();
  }, [userId]);

  const handleAddReview = async () => {
    const token = localStorage.getItem("jadd-token");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/review/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newReview)
      });

      if (response.ok) {
        setNewReview({ rating: 5, comment: "" });
        setShowReviewForm(false);
        fetchPageData();
      } else {
        toast.error(currentText.reviewErrorToast);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReport = async () => {
    const token = localStorage.getItem("jadd-token");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/report/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ content: reportContent })
      });

      if (response.ok) {
        setReportContent("");
        toast.success(currentText.reportSuccessToast);
      } else {
        toast.error(currentText.reportErrorToast);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-20 text-center">{currentText.loadingText}</div>;
  if (error) return <div className="p-20 text-center text-red-500">{currentText.errorText}{error}</div>;
  if (!data || !data.seller) return <div className="p-20 text-center">No seller data found.</div>;

  const { seller, listings = [], stats = { totalListings: 0, soldListings: 0 } } = data;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black transition-colors p-6 md:p-12 text-zinc-900 dark:text-zinc-100" dir={lang === "ar" ? "rtl" : "ltr"}>
      <Toaster />
      <div className="max-w-4xl mx-auto space-y-12">

        <section className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 p-8 md:p-10 rounded-[2rem] flex flex-col md:flex-row gap-8 items-center shadow-sm">
          <div className="w-32 h-32 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center text-4xl text-zinc-400 overflow-hidden border-4 border-zinc-50 dark:border-black">
            {seller?.profileImage ? (
              <img src={seller.profileImage} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              <User size={48} />
            )}
          </div>

          <div className={`space-y-4 text-center ${lang === "ar" ? "md:text-right" : "md:text-left"} flex-1`}>
            <div>
              <h1 className="text-3xl font-bold">{seller?.fullName}</h1>
              
              {/* قسم التاريخ والإحصائيات الجديدة */}
              <div className={`flex flex-wrap items-center justify-center ${lang === "ar" ? "md:justify-start" : "md:justify-start"} gap-4 mt-2 text-sm text-zinc-500`}>
                <span className="flex items-center gap-1">
                   {currentText.joinedPrefix}{seller?.createdAt ? new Date(seller.createdAt).getFullYear() : ""}
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span className="flex items-center gap-1">
                   {stats.totalListings} {currentText.listingsCountLabel}
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span className="flex items-center gap-1">
                   {stats.soldListings} {currentText.soldCountLabel}
                </span>
              </div>
            </div>

            <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-lg">{seller?.bio || currentText.noBio}</p>
            
            <div className={`flex items-center justify-center ${lang === "ar" ? "md:justify-start" : "md:justify-start"} gap-2 text-[#232152] dark:text-[#D6C88A]`}>
              <ShieldCheck size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">{currentText.verifiedSeller}</span>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className={`flex justify-between items-center border-[#232152] dark:border-[#D6C88A] ${lang === "ar" ? "pr-4 border-r-2" : "pl-4 border-l-2"}`}>
            <h2 className="text-xl font-bold">{currentText.reviewsTitle}</h2>

            {canReview && (
              <button onClick={() => setShowReviewForm(!showReviewForm)} className="px-5 py-2 bg-[#232152] dark:bg-[#D6C88A] text-white dark:text-black text-xs font-bold rounded-full hover:opacity-90 transition">
                {showReviewForm ? currentText.cancelBtn : currentText.addReviewBtn}
              </button>
            )}
          </div>

          {showReviewForm && (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border dark:border-zinc-800 space-y-4">
              <div className="flex gap-1 text-[#232152] dark:text-[#D6C88A] font-bold "> {currentText.rateLabel}
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={24} className={`cursor-pointer ${star <= newReview.rating ? "text-[#D6C88A] fill-[#D6C88A]" : "text-zinc-400"}`} onClick={() => setNewReview({ ...newReview, rating: star })} />
                ))}
              </div>
              <textarea value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} className="w-full p-2 rounded-lg border dark:bg-zinc-800" placeholder={currentText.commentPlaceholder} rows={3} />
              <button onClick={handleAddReview} className="px-5 py-2 bg-[#232152] dark:bg-[#D6C88A] text-white dark:text-black rounded-lg font-bold">{currentText.submitReviewBtn}</button>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {reviews.map((rev: any) => (
              <div key={rev._id} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border dark:border-zinc-800">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <img src={rev.reviewer?.profileImage || "/default-avatar.png"} className="w-8 h-8 rounded-full object-cover" alt="Reviewer" />
                    <span className="font-bold text-sm">{rev.reviewer?.fullName}</span>
                  </div>
                  <div className="flex text-[#D6C88A]">
                    {[...Array(rev.rating || 0)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                </div>
                <p className="text-xs text-zinc-500">{rev.comment}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className={`text-xl font-bold mb-8 border-[#232152] dark:border-[#D6C88A] ${lang === "ar" ? "pr-4 border-r-2" : "pl-4 border-l-2"}`}>
            {currentText.activeListingsTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {listings.length > 0 ? listings.map((item: any) => (
              <Link href={`/product/${item._id}`} key={item._id} className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-4 hover:shadow-lg transition-shadow block">
                <img src={item.images?.[0] || "/placeholder.jpg"} className="w-full h-40 object-cover rounded-xl mb-4" alt={item.title} />
                <h3 className="font-bold text-sm">{item.title}</h3>
                <p className="text-[#232152] dark:text-[#D6C88A] font-bold mt-1">OMR {item.price}</p>
              </Link>
            )) : <p className="text-zinc-500">{currentText.noListings}</p>}
          </div>
        </section>

        <section className="bg-red-50 dark:bg-red-900/10 p-8 rounded-2xl border border-red-200 dark:border-red-900/30">
          <h3 className="flex items-center gap-2 font-bold text-red-600 mb-4">
            <Flag size={18} />
            {currentText.reportTitle}
          </h3>
          <textarea
            value={reportContent}
            onChange={(e) => setReportContent(e.target.value)}
            className="w-full p-4 rounded-xl bg-white dark:bg-zinc-950 border dark:border-zinc-800 text-sm mb-4 outline-none focus:ring-2 ring-red-500"
            placeholder={currentText.reportPlaceholder}
            rows={3}
          />
          <button onClick={handleReport} className="px-6 py-2 bg-red-600 text-white font-bold rounded-xl text-sm hover:bg-red-700 transition">
            {currentText.sendReportBtn}
          </button>
        </section>
      </div>
    </div>
  );
}