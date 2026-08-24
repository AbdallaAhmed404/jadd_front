"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// قم بتحديث هذا الرابط بعنوان السيرفر الخاص بك
const API_URL = "https://jadd-production-275a.up.railway.app";

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [emailInput, setEmailInput] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);

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
      createMembership: "Create Membership",
      formSub: "Inscribe your profile details to join our localized Omani network.",
      otpSub: (emailVal: string) => `We have sent a verification code to your email: ${emailVal || 'your email'}`,
      fullNameLabel: "Full Name",
      fullNamePlaceholder: "Abdalla Ahmed",
      mobileLabel: "Mobile Number",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      registerBtn: "Register & Send Code",
      checkEmail: "📩 Check your Email Inbox or Spam",
      verifyBtn: "Verify Email & Activate",
      editDetails: "Edit Registration Details",
      alreadyMember: "Already a Member?",
      secureSignIn: "Secure Sign In",
      regSuccess: "Verification code sent to your email!",
      regFailed: "Registration failed",
      serverError: "Error connecting to server",
      verifiedSuccess: "Verified successfully! Redirecting...",
      invalidOtp: "Invalid OTP",
      verifyError: "Error verifying OTP"
    },
    ar: {
      createMembership: "إنشاء عضوية",
      formSub: "قم بتدوين تفاصيل ملفك الشخصي للانضمام إلى شبكتنا العمانية المحلية.",
      otpSub: (emailVal: string) => `لقد أرسلنا رمز التحقق إلى بريدك الإلكتروني: ${emailVal || 'بريدك الإلكتروني'}`,
      fullNameLabel: "الاسم الكامل",
      fullNamePlaceholder: "عبدالله أحمد",
      mobileLabel: "رقم الجوال",
      emailLabel: "البريد الإلكتروني",
      passwordLabel: "كلمة المرور",
      registerBtn: "التسجيل وإرسال الرمز",
      checkEmail: "📩 تحقق من صندوق البريد الوارد أو البريد العشوائي (Spam)",
      verifyBtn: "تحقق من البريد وتفعيل الحساب",
      editDetails: "تعديل تفاصيل التسجيل",
      alreadyMember: "هل أنت عضوبالفعل؟",
      secureSignIn: "تسجيل الدخول الآمن",
      regSuccess: "تم إرسال رمز التحقق إلى بريدك الإلكتروني!",
      regFailed: "فشل التسجيل",
      serverError: "خطأ في الاتصال بالخادم",
      verifiedSuccess: "تم التحقق بنجاح! جاري التوجيه...",
      invalidOtp: "رمز التحقق غير صحيح",
      verifyError: "خطأ أثناء التحقق من الرمز"
    }
  };

  const currentText = t[lang];

  // States للبيانات
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    password: ""
  });

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  // دالة التسجيل
  const handleRegister = async () => {
    try {
      const response = await fetch(`${API_URL}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, email: emailInput })
      });
      if (response.ok) {
        setStep("otp");
        toast.success(currentText.regSuccess);
      } else {
        toast.error(currentText.regFailed);
      }
    } catch (error) {
      toast.error(currentText.serverError);
    }
  };

  // دالة التحقق
  const handleVerify = async () => {
    try {
      const response = await fetch(`${API_URL}/user/verifyOtp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, otp: otp.join("") })
      });
      if (response.ok) {
        toast.success(currentText.verifiedSuccess);
        setTimeout(() => router.push("/login"), 1500);
      } else {
        toast.error(currentText.invalidOtp);
      }
    } catch (error) {
      toast.error(currentText.verifyError);
    }
  };

  return (
    <div className=" mt-[-50] w-full h-screen bg-[#f8f9fa] dark:bg-zinc-950 text-[#1F1547] dark:text-[#F0F2E3] flex overflow-hidden select-none" dir={lang === "ar" ? "rtl" : "ltr"}>
      <Toaster
        position="bottom-right"
        toastOptions={{
          // هنا نقوم بتعريف الألوان بشكل ثابت يغطي على الإعدادات الافتراضية
          style: {
            borderRadius: '10px',
            padding: '10px',
          },
          success: {
            style: {
              background: '#1F1547', // كحلي
              color: '#fff',
            },
            // إضافة كلاس خاص للدارك مود داخل الـ toast
            className: 'dark:!bg-[#D6C88A] dark:!text-[#1F1547]',
          },
          error: {
            style: {
              background: '#1F1547',
              color: '#fff',
            },
            className: 'dark:!bg-[#D6C88A] dark:!text-[#1F1547]',
          },
        }}
      />

      {/* الجزء الأيسر: ممتد بالكامل وبدون كارد */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-between p-8 sm:p-16 relative z-10 bg-[#f8f9fa] dark:bg-zinc-950 transition-colors duration-300">
        <div className="absolute inset-x-0 top-1/4 bg-[#D6C88A]/5 blur-[120px] rounded-full pointer-events-none max-w-md mx-auto h-72" />

        {/* المحتوى المتغير في المنتصف تماماً */}
        <div className="w-full max-w-md mx-auto space-y-6  pt-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight">{currentText.createMembership}</h2>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
              {step === "form"
                ? currentText.formSub
                : currentText.otpSub(emailInput)}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === "form" ? (
              <motion.div
                key="form-stage"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4 "
              >
                {/* الاسم الكلي */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{currentText.fullNameLabel}</label>
                  <div className="relative flex items-center">
                    <User size={15} className={`absolute ${lang === "ar" ? "right-4" : "left-4"} text-zinc-400`} />
                    <input type="text" onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder={currentText.fullNamePlaceholder} className={`w-full h-11 ${lang === "ar" ? "pr-11 pl-4" : "pl-11 pr-4"} rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-xs font-semibold focus:outline-hidden focus:border-[#D6C88A] transition-colors shadow-xs`} />
                  </div>
                </div>

                {/* رقم الهاتف */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{currentText.mobileLabel}</label>
                  <div className="relative flex items-center">
                    <Phone size={15} className={`absolute ${lang === "ar" ? "right-4" : "left-4"} text-zinc-400`} />
                    <span className={`absolute ${lang === "ar" ? "right-10 border-l" : "left-10 border-r"} text-[11px] font-bold text-zinc-400 border-zinc-200 dark:border-zinc-800 px-2`}>+968</span>
                    <input type="tel" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="7XXXXXXX" className={`w-full h-11 ${lang === "ar" ? "pr-22 pl-4" : "pl-22 pr-4"} rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-xs font-semibold focus:outline-hidden focus:border-[#D6C88A] transition-colors shadow-xs`} />
                  </div>
                </div>

                {/* البريد الإلكتروني */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{currentText.emailLabel}</label>
                  <div className="relative flex items-center">
                    <Mail size={15} className={`absolute ${lang === "ar" ? "right-4" : "left-4"} text-zinc-400`} />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className={`w-full h-11 ${lang === "ar" ? "pr-11 pl-4" : "pl-11 pr-4"} rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-xs font-semibold focus:outline-hidden focus:border-[#D6C88A] transition-colors shadow-xs`}
                    />
                  </div>
                </div>

                {/* كلمة المرور */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{currentText.passwordLabel}</label>
                  <div className="relative flex items-center">
                    <Lock size={15} className={`absolute ${lang === "ar" ? "right-4" : "left-4"} text-zinc-400`} />
                    <input type="password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" className={`w-full h-11 ${lang === "ar" ? "pr-11 pl-4" : "pl-11 pr-4"} rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-xs font-semibold focus:outline-hidden focus:border-[#D6C88A] transition-colors shadow-xs`} />
                  </div>
                </div>

                {/* زر المتابعة */}
                <button
                  onClick={handleRegister}
                  className="w-full h-12 rounded-xl bg-[#1F1547] dark:bg-[#D6C88A] text-white dark:text-[#1F1547] font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity pt-1 shadow-sm"
                >
                  {currentText.registerBtn}
                  <ArrowRight size={16} className={lang === "ar" ? "rotate-180" : ""} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="otp-stage"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <p className="text-[11px] text-center font-bold uppercase tracking-wider bg-white dark:bg-zinc-900 py-2 rounded-lg text-zinc-400 border border-zinc-200 dark:border-zinc-800">
                  {currentText.checkEmail}
                </p>

                <div className="flex justify-center gap-3 dir-ltr">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={data}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onFocus={(e) => e.target.select()}
                      className="w-14 h-14 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 text-center font-black text-xl bg-white dark:bg-zinc-900 text-[#1F1547] dark:text-[#F0F2E3] focus:outline-hidden focus:border-[#D6C88A] transition-colors shadow-xs"
                    />
                  ))}
                </div>

                <button
                  onClick={handleVerify}
                  className="w-full h-12 rounded-xl bg-[#1F1547] dark:bg-[#D6C88A] text-white dark:text-[#1F1547] font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
                >
                  <ShieldCheck size={16} />
                  {currentText.verifyBtn}
                </button>

                <div className="text-center">
                  <button
                    onClick={() => setStep("form")}
                    className="text-xs font-bold text-zinc-400 hover:text-[#D6C88A] transition-colors"
                  >
                    {currentText.editDetails}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* الفوتر في الأسفل */}
        <div className="text-center lg:text-left">
          <p className="text-xs font-semibold text-zinc-400">
            {currentText.alreadyMember}{" "}
            <Link href="/login" className="text-[#D6C88A] font-bold hover:underline">
              {currentText.secureSignIn}
            </Link>
          </p>
        </div>
      </div>

      {/* الجزء الأيمن */}
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