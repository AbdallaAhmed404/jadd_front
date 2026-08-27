"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

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
      title: "Forgot Password",
      subTitle: "Enter your email address and we will send you a link to reset your password.",
      emailLabel: "Email Address",
      submitBtn: "Send Reset Link",
      backToLogin: "Back to Login",
      successToast: "Password reset link sent to your email.",
      serverError: "Error connecting to server",
      defaultError: "Failed to send reset link"
    },
    ar: {
      title: "نسيت كلمة المرور",
      subTitle: "أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور الخاصة بك.",
      emailLabel: "البريد الإلكتروني",
      submitBtn: "إرسال رابط الإعادة",
      backToLogin: "العودة لتسجيل الدخول",
      successToast: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.",
      serverError: "خطأ في الاتصال بالخادم",
      defaultError: "فشل في إرسال رابط إعادة التعيين"
    }
  };

  const currentText = t[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error(lang === "ar" ? "يرجى إدخال البريد الإلكتروني" : "Please enter email");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(currentText.successToast);
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error(data.message || currentText.defaultError);
      }
    } catch (error) {
      toast.error(currentText.serverError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-[-50] w-full h-screen bg-[#f8f9fa] dark:bg-zinc-950 text-[#1F1547] dark:text-[#F0F2E3] flex overflow-hidden select-none" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* الجزء الأيسر / نموذج الإدخال */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-between p-8 sm:p-16 relative z-10 bg-[#f8f9fa] dark:bg-zinc-950 transition-colors duration-300">
        <div className="absolute inset-x-0 top-1/4 bg-[#D6C88A]/5 blur-[120px] rounded-full pointer-events-none max-w-md mx-auto h-72" />
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto space-y-8 pt-15"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight">
              {currentText.title}
            </h2>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
              {currentText.subTitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">{currentText.emailLabel}</label>
              <div className="relative flex items-center">
                <Mail size={16} className={`absolute ${lang === "ar" ? "right-4" : "left-4"} text-zinc-400`} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full h-12 ${lang === "ar" ? "pr-12 pl-4" : "pl-12 pr-4"} rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-sm font-semibold focus:outline-hidden focus:border-[#D6C88A] transition-colors shadow-xs`}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#1F1547] dark:bg-[#D6C88A] text-white dark:text-[#1F1547] font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
            >
              {loading ? "..." : currentText.submitBtn} 
              <ArrowRight size={16} className={lang === "ar" ? "rotate-180" : ""} />
            </button>
          </form>
        </motion.div>

        <div className="text-center lg:text-left">
          <Link href="/login" className="text-xs font-bold text-zinc-400 hover:text-[#D6C88A] transition-colors flex items-center gap-1.5 inline-flex">
            {lang === "ar" ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
            {currentText.backToLogin}
          </Link>
        </div>
      </div>

      {/* الجزء الأيمن / الصور الترويجية */}
      <div className="hidden lg:block lg:w-1/2 relative h-full overflow-hidden">
        <div className="absolute inset-0 block dark:hidden">
          <Image src="/auth-light.jpg" alt="JADD Premium Space" fill priority className="object-cover object-center" />
        </div>
        <div className="absolute inset-0 hidden dark:block">
          <Image src="/auth-dark.jpg" alt="JADD Luxury Night" fill priority className="object-cover object-center" />
        </div>
        <div className="absolute inset-0 bg-[#1F1547]/5 dark:bg-black/20 mix-blend-multiply" />
      </div>
    </div>
  );
}