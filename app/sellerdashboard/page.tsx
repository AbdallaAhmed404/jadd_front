"use client";
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowLeftRight, Heart, TrendingUp, Package, Trash2, RefreshCw, Check, X, Star } from "lucide-react";
import { useChat } from "../../src/components/ChatDrawerProvider";

export default function SellerDashboard() {
  const [data, setData] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductForBuyer, setSelectedProductForBuyer] = useState<string | null>(null);
  const { openChat } = useChat();

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
      statisticsTitle: "Statistics",
      viewsLabel: "Views",
      favoritesLabel: "Favorites",
      revenueLabel: "Total Revenue",
      myAdsTitle: "My Ads",
      activeAdsTitle: "Active Ads",
      soldProductsTitle: "Sold Products",
      nameCol: "Name",
      statusCol: "Status",
      actionsCol: "Actions",
      recentOffersTitle: "Recent Offers",
      productCol: "Product",
      buyerCol: "Buyer",
      offerPriceCol: "Offer Price",
      selectBuyerTitle: "Select Accepted Buyer",
      cancel: "Cancel",
      statusMap: {
        Available: "Available",
        Reserved: "Reserved",
        Sold: "Sold"
      }
    },
    ar: {
      loadingText: "جاري التحميل...",
      statisticsTitle: "الإحصائيات",
      viewsLabel: "المشاهدات",
      favoritesLabel: "المفضلة",
      revenueLabel: "إجمالي الأرباح",
      myAdsTitle: "إعلاناتي",
      activeAdsTitle: "الإعلانات النشطة",
      soldProductsTitle: "المنتجات المباعة",
      nameCol: "الاسم",
      statusCol: "الحالة",
      actionsCol: "الإجراءات",
      recentOffersTitle: "العروض الأخيرة",
      productCol: "المنتج",
      buyerCol: "المشتري",
      offerPriceCol: "سعر العرض",
      selectBuyerTitle: "اختر المشتري المقبول",
      cancel: "إلغاء",
      statusMap: {
        Available: "متاح",
        Reserved: "محجوز",
        Sold: "مباع"
      }
    }
  };

  const currentText = t[lang];

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("jadd-token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/seller-dashboard-data`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await res.json();
      setData(result);

      const offersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/my-offers`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const offersResult = await offersRes.json();
      setOffers(offersResult);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleStatusChange = async (productId: string, buyerId?: string) => {
    const token = localStorage.getItem("jadd-token");
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/updatestatus/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ buyerId })
    });
    setSelectedProductForBuyer(null);
    fetchDashboard();
  };

  const handleToggleHidden = async (productId: string) => {
    const token = localStorage.getItem("jadd-token");
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/toggle-hidden/${productId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      fetchDashboard();
    } catch (err) {
      console.error("Error toggling hidden status:", err);
    }
  };

  const handleDelete = async (productId: string) => {
    const token = localStorage.getItem("jadd-token");
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/deleteproduct/${productId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    fetchDashboard();
  };

  const handleOfferStatus = async (offerId: string, status: string, buyerId?: string, productId?: string) => {
    const token = localStorage.getItem("jadd-token");

    // 1. تحديث الواجهة فوراً (Optimistic Update) قبل انتظار السيرفر
    setOffers((prevOffers) =>
      prevOffers.map((offer) =>
        offer._id === offerId ? { ...offer, status } : offer
      )
    );

    try {
      // 1. إرسال طلب تحديث حالة العرض للسيرفر
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/update-status/${offerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      // 2. إذا وافق البائع (accepted)، نقوم بفتح الشات تلقائياً مع المشتري
      if (status === "accepted") {
        const chatRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/access`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            receiverId: buyerId, // معرف المشتري صاحب العرض
            productId: productId // معرف المنتج المرتبط بالعرض
          })
        });

        const conversation = await chatRes.json();
        if (conversation && conversation._id) {
          openChat(conversation._id); // فتح درج الشات بالكود الخاص بالمحادثة
        }
      }

      fetchDashboard();
    } catch (err) {
      console.error("Error updating offer status:", err);
      fetchDashboard(); // إعادة الجلب في حالة حدوث خطأ شبكي
    }
  };

  if (loading) return <div className="p-20 text-center dark:text-white">{currentText.loadingText}</div>;

  const products = data?.products || [];
  const seller = data?.seller || { name: "Seller", views: 0, reviewsCount: 0 };

  const activeProducts = products.filter((p: any) => p.status === "Available" || p.status === "Reserved");
  const soldProducts = products.filter((p: any) => p.status === "Sold");

  const totalRevenue = soldProducts.reduce((sum: number, p: any) => sum + (p.price || 0), 0);
  const totalFavorites = products.reduce((sum: number, p: any) => sum + (p.favoritesCount || 0), 0);

  const renderTable = (title: string, color: string, filteredProducts: any[]) => {
    return (
      <div className="bg-zinc-100 dark:bg-[#121212] rounded-2xl border-zinc-200 dark:border-white/10 overflow-visible relative">
        <div className="p-4 border-b border-zinc-200 dark:border-white/10 font-bold flex items-center gap-2">
          <div className={color}></div>
          {title} ({filteredProducts.length})
        </div>
        <table className={`w-full ${lang === "ar" ? "text-right" : "text-left"} text-sm`}>
          <thead>
            <tr className="text-zinc-500 text-[10px] uppercase ">
              <th className="p-4">{currentText.nameCol}</th>
              <th className="p-4">{currentText.statusCol}</th>
              <th className="p-4">{currentText.actionsCol}</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((item: any) => {
              const productAcceptedOffers = offers.filter(
                (o: any) => (o.productId?._id === item._id || o.productId === item._id) && o.status === "accepted"
              );

              // استخراج اسم المشتري بأكثر من احتمال لتفادي ظهور خانة فارغة
              const buyerName =
                item.buyer?.fullName ||
                item.buyer?.name ||
                item.buyerFullName ||
                (typeof item.buyer === 'string' ? null : "Buyer");

              return (
                <tr key={item._id} className="border-b border-zinc-200 dark:border-white/5 last:border-0 hover:bg-zinc-100 dark:hover:bg-white/5 relative">
                  <td className="p-4 font-bold flex items-center gap-2">
                    <span>{item.title}</span>
                    {item.isFeatured && (
                      <Star size={16} className="text-yellow-500 fill-yellow-500 inline-block" />
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold bg-[#1F1547] dark:bg-[#D6C88A] text-white dark:text-[#1F1547]`}>
                        {currentText.statusMap[item.status as keyof typeof currentText.statusMap] || item.status}
                      </span>
                      {/* عرض اسم المشتري بوضوح عند Sold */}
                      {item.status === "Sold" && (
                        <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                          {buyerName ? `(${buyerName})` : "(Buyer)"}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 flex items-center gap-2 relative">
                    {item.status === "Reserved" && (
                      <div className="relative">
                        <button
                          onClick={() => setSelectedProductForBuyer(selectedProductForBuyer === item._id ? null : item._id)}
                          className="text-[#1F1547] dark:text-[#D6C88A] p-1"
                          title="Toggle to Sold with Buyer"
                        >
                          <ArrowLeftRight size={16} />
                        </button>

                        {selectedProductForBuyer === item._id && (
                          <div className={`absolute z-50 mt-2 w-56 bg-white dark:bg-[#1a1a1a] border border-zinc-200 dark:border-white/10 rounded-xl shadow-xl p-2 ${lang === "ar" ? "left-0" : "right-0"}`}>
                            <p className="text-[11px] font-bold text-zinc-400 mb-2 px-2">{currentText.selectBuyerTitle}</p>
                            {productAcceptedOffers.length > 0 ? (
                              productAcceptedOffers.map((offer: any) => (
                                <button
                                  key={offer._id}
                                  onClick={() => handleStatusChange(item._id, offer.buyerId?._id || offer.buyerId)}
                                  className="w-full text-start px-3 py-2 text-xs rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 font-semibold text-zinc-700 dark:text-zinc-200 flex justify-between items-center"
                                >
                                  <span>{offer.buyerId?.fullName || offer.buyerId?.name || "Buyer"}</span>
                                  <div className="text-xs font-bold h-7 rounded-lg flex items-center gap-1.5">
                                    <span>{offer.offerPrice}</span>

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
                                </button>
                              ))
                            ) : (
                              <p className="text-xs text-zinc-400 px-2 py-1">No accepted offers</p>
                            )}
                            <button
                              onClick={() => setSelectedProductForBuyer(null)}
                              className="w-full text-center mt-2 pt-1 border-t border-zinc-100 dark:border-white/5 text-[11px] text-red-500"
                            >
                              {currentText.cancel}
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {item.status === "Sold" && (
                      <button onClick={() => handleStatusChange(item._id)} className="text-[#1F1547] dark:text-[#D6C88A] p-1" title="Toggle to Reserved">
                        <ArrowLeftRight size={16} />
                      </button>
                    )}

                    <button
                      onClick={() => handleToggleHidden(item._id)}
                      className={`${item.isHidden ? 'text-amber-500' : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'} p-1`}
                      title="Toggle Hidden Status"
                    >
                      {item.isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>

                    <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-400 p-1" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-6 bg-white dark:bg-[#080808] min-h-screen transition-colors duration-300 " dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto">

        <h2 className="text-lg font-bold mb-4 text-[#1F1547] dark:text-[#D6C88A]">{currentText.statisticsTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { title: currentText.viewsLabel, value: seller.views, icon: Eye, color: "text-blue-500" },
            { title: currentText.favoritesLabel, value: totalFavorites, icon: Heart, color: "text-red-500" },
            { title: currentText.revenueLabel, value: `${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-yellow-500" },
          ].map((item, i) => (
            <div key={i} className="bg-zinc-100 dark:bg-[#121212] p-6 rounded-2xl border-zinc-200 dark:border-white/10 flex items-center gap-4">
              <div className={`p-4 rounded-xl bg-[#1F1547] dark:bg-[#D6C88A] text-white dark:text-[#1F1547]`}><item.icon size={24} /></div>
              <div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{item.title}</p>
                <h3 className="text-2xl font-bold text-[#232152] dark:text-white">{item.value}</h3>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold mb-4 text-zinc-800 text-[#1F1547] dark:text-[#D6C88A]">{currentText.myAdsTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {renderTable(currentText.activeAdsTitle, "text-green-500", activeProducts)}
          {renderTable(currentText.soldProductsTitle, "text-blue-500", soldProducts)}
        </div>

        <h2 className="text-lg font-bold mb-4 text-zinc-800 text-[#1F1547] dark:text-[#D6C88A]">{currentText.recentOffersTitle}</h2>
        <div className="bg-zinc-100 dark:bg-[#121212] rounded-2xl border-zinc-200 dark:border-white/10 overflow-hidden">
          <table className={`w-full ${lang === "ar" ? "text-right" : "text-left"} text-sm`}>
            <thead>
              <tr className="text-zinc-400 text-[10px] border-b border-zinc-200 dark:border-white/10 uppercase">
                <th className="p-4">{currentText.productCol}</th>
                <th className="p-4">{currentText.buyerCol}</th>
                <th className="p-4">{currentText.offerPriceCol}</th>
                <th className="p-4">{currentText.actionsCol}</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer: any) => (
                <tr key={offer._id} className="border-b border-zinc-200 dark:border-white/10 last:border-0">
                  <td className="p-4 font-bold">{offer.productId?.title}</td>
                  <td className="p-4 font-bold">{offer.buyerId?.fullName || offer.buyerId?.name}</td>
                  <td className="p-4 font-bold text-black dark:text-white"><span> {offer.offerPrice} </span>

                    {lang === "ar" ? (
                      <img
                        src="/oman-riyal.svg"
                        alt="ريال عماني"
                        // استخدمنا الكلاسات لتغيير الفلتر أو اللون حسب الثيم مباشرة
                        className="w-4 h-4 object-contain inline-block dark:invert"
                      />
                    ) : (
                      <span>OMR</span>
                    )}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          const buyerId = offer.buyerId?._id || offer.buyerId;
                          const productId = offer.productId?._id || offer.productId;
                          handleOfferStatus(offer._id, 'accepted', buyerId, productId);
                        }}
                        className={`p-2 rounded-full transition-all ${offer.status === 'accepted'
                          ? 'bg-[#1F1547] dark:bg-[#D6C88A] text-white dark:text-[#1F1547]'
                          : 'text-zinc-400 hover:text-green-500 hover:bg-green-500/10'
                          }`}
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => handleOfferStatus(offer._id, 'rejected')}
                        className={`p-2 rounded-full transition-all ${offer.status === 'rejected'
                          ? 'bg-[#1F1547] dark:bg-[#D6C88A] text-white dark:text-[#1F1547]'
                          : 'text-zinc-400 hover:text-red-500 hover:bg-red-500/10'
                          }`}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}