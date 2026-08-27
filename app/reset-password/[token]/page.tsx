"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params?.token; // استخلاص الرمز (Token) من الـ URL

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      title: "Reset Password",
      subTitle: "Enter your new password below to secure your account.",
      passwordLabel: "New Password",
      confirmPasswordLabel: "Confirm New Password",
      submitBtn: "Update Password",
      passwordMismatch: "Passwords do not match",
      passwordLength: "Password must be at least 6 characters long",
      successToast: "Password updated successfully. Please log in.",
      serverError: "Error connecting to server",
      defaultError: "Failed to reset password"
    },
    ar: {
      title: "إعادة تعيين كلمة المرور",
      subTitle: "أدخل كلمة المرور الجديدة أدناه لتأمين حسابك.",
      passwordLabel: "كلمة المرور الجديدة",
      confirmPasswordLabel: "تأكيد كلمة المرور الجديدة",
      submitBtn: "تحديث كلمة المرور",
      passwordMismatch: "كلمتا المرور غير متطابقتين",
      passwordLength: "يجب ألا تقل كلمة المرور عن 6 أحرف",
      successToast: "تم تحديث كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.",
      serverError: "خطأ في الاتصال بالخادم",
      defaultError: "فشل في إعادة تعيين كلمة المرور"
    }
  };

  const currentText = t[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error(currentText.passwordLength);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(currentText.passwordMismatch);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
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
      {/* الجزء الأيسر / نموذج التغيير */}
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
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">{currentText.passwordLabel}</label>
              <div className="relative flex items-center">
                <Lock size={16} className={`absolute ${lang === "ar" ? "right-4" : "left-4"} text-zinc-400`} />
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full h-12 ${lang === "ar" ? "pr-12 pl-4" : "pl-12 pr-4"} rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-sm font-semibold focus:outline-hidden focus:border-[#D6C88A] transition-colors shadow-xs`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">{currentText.confirmPasswordLabel}</label>
              <div className="relative flex items-center">
                <Lock size={16} className={`absolute ${lang === "ar" ? "right-4" : "left-4"} text-zinc-400`} />
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
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
          {/* مساحة فارغة للحفاظ على التناسق */}
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