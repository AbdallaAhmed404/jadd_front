"use client";

import React, { useState, useEffect } from "react";
import { Upload, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";

export default function IDVerificationPage() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);

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
      successTitle: "Request Submitted!",
      successDesc: "Our team will review your ID shortly.",
      pageTitle: "Verify Your Identity",
      pageDesc: "To ensure a safe environment, please upload a clear photo of your ID card. Our team will review it manually.",
      uploadPrompt: "Upload ID Photo",
      submitBtn: "Submit for Review",
      alertMsg: "Something went wrong, please try again."
    },
    ar: {
      successTitle: "تم إرسال الطلب!",
      successDesc: "سيقوم فريقنا بمراجعة هويتك قريباً.",
      pageTitle: "تحقق من هويتك",
      pageDesc: "لضمان بيئة آمنة، يرجى رفع صورة واضحة لبطاقة هويتك. سيتم التحقق من طلبك يدويًا.",
      uploadPrompt: "رفع صورة الهوية",
      submitBtn: "إرسال للمراجعة",
      alertMsg: "حدث خطأ ما، يرجى المحاولة مرة أخرى."
    }
  };

  const currentText = t[lang];

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);

    try {
      // 1. طلب الـ Signed URL من السيرفر
      const res = await fetch("https://jadd-production-275a.up.railway.app/user/get-upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          folder: "identities", 
          filename: file.name, 
          contentType: file.type 
        }),
      });
      const { signedUrl, publicUrl } = await res.json();

      // 2. الرفع المباشر لـ Cloudflare R2
      await fetch(signedUrl, { method: "PUT", body: file });

      // 3. إرسال الرابط للسيرفر لحفظه في قاعدة البيانات
      const token = localStorage.getItem("jadd-token");
      const submitRes = await fetch("https://jadd-production-275a.up.railway.app/user/submit", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ idImages: [publicUrl] }),
      });

      if (submitRes.ok) setSuccess(true);
    } catch (err) {
      console.error(err);
      alert(currentText.alertMsg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] dark:bg-zinc-950 p-6 flex items-center justify-center" dir={lang === "ar" ? "rtl" : "ltr"}>
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-xl font-bold dark:text-white">{currentText.successTitle}</h2>
          <p className="text-sm text-zinc-400">{currentText.successDesc}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-zinc-950 p-6 md:p-12 flex items-center justify-center" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-[#D6C88A]/10 rounded-full flex items-center justify-center text-[#D6C88A]">
          <ShieldCheck size={32} />
        </div>
        
        <h1 className="text-xl font-black text-[#1F1547] dark:text-white">{currentText.pageTitle}</h1>
        <p className="text-xs font-semibold text-zinc-400">
          {currentText.pageDesc}
        </p>

        <label className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-10 flex flex-col items-center justify-center text-zinc-400 hover:border-[#D6C88A] transition-colors cursor-pointer bg-white dark:bg-zinc-900/50">
          {file ? (
            <span className="text-sm font-bold text-emerald-500">{file.name}</span>
          ) : (
            <>
              <Upload size={32} />
              <span className="text-xs font-bold mt-2">{currentText.uploadPrompt}</span>
            </>
          )}
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={(e) => e.target.files && setFile(e.target.files[0])} 
          />
        </label>

        <button 
          onClick={handleSubmit}
          disabled={!file || loading}
          className="w-full h-12 rounded-xl bg-[#1F1547] dark:bg-[#D6C88A] text-white dark:text-[#1F1547] font-bold text-sm disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : currentText.submitBtn}
        </button>
      </div>
    </div>
  );
}