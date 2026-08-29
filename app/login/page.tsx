"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"login" | "otp">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      welcomeBack: "Welcome Back",
      verifyAccount: "Verify Account",
      loginSub: "Sign in with your email and password to access your premium asset circle.",
      otpSub: (emailVal: string) => `We have sent a verification code to your email: ${emailVal || 'your email'}`,
      emailLabel: "Email Address",
      passwordLabel: "Password",
      signIn: "Sign In",
      checkEmail: "📩 Check your Email Inbox or Spam",
      verifyBtn: "Verify Email & Activate",
      editCreds: "Edit Credentials",
      newToJadd: "New to JADD?",
      createAcc: "Create an Account",
      welcomeToast: "Welcome back to JADD!",
      unverifiedToast: "Account not verified. Redirecting to verification...",
      defaultError: "Invalid credentials",
      serverError: "Error connecting to server",
      verifiedSuccess: "Verified successfully! Redirecting...",
      invalidOtp: "Invalid OTP",
      otpError: "Error verifying OTP"
    },
    ar: {
      welcomeBack: "أهلاً بعودتك",
      verifyAccount: "تحقق من الحساب",
      loginSub: "سجل الدخول باستخدام بريدك الإلكتروني و كلمة المرور للوصول الى حسابك",
      otpSub: (emailVal: string) => `لقد أرسلنا رمز التحقق إلى بريدك الإلكتروني: ${emailVal || 'بريدك الإلكتروني'}`,
      emailLabel: "البريد الإلكتروني",
      passwordLabel: "كلمة المرور",
      signIn: "تسجيل الدخول",
      checkEmail: "📩 تحقق من صندوق البريد الوارد أو البريد العشوائي (Spam)",
      verifyBtn: "تحقق من البريد وتفعيل الحساب",
      editCreds: "تعديل بيانات الاعتماد",
      newToJadd: "جديد في جدد؟",
      createAcc: "إنشاء حساب",
      welcomeToast: "مرحباً بك مجدداً في جدد!",
      unverifiedToast: "الحساب غير مفعل. يتم توجيهك إلى صفحة التحقق...",
      defaultError: "بيانات الاعتماد غير صالحة",
      serverError: "خطأ في الاتصال بالخادم",
      verifiedSuccess: "تم التحقق بنجاح! جاري التوجيه...",
      invalidOtp: "رمز التحقق غير صحيح",
      otpError: "خطأ أثناء التحقق من الرمز"
    }
  };

  const currentText = t[lang];

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(currentText.welcomeToast);
        localStorage.setItem("jadd-token", data.token);
        window.dispatchEvent(new Event("userStateChanged"));
        setTimeout(() => router.push("/"), 1500);
      } else if (response.status === 403 && data.needsVerification) {
        toast.error(currentText.unverifiedToast);
        setStep("otp");
      } else {
        toast.error(data.message || currentText.defaultError);
      }
    } catch (error) {
      toast.error(currentText.serverError);
    }
  };

  const handleVerify = async () => {
    try {
      const response = await fetch(`${API_URL}/user/verifyOtp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, otp: otp.join("") })
      });
      if (response.ok) {
        toast.success(currentText.verifiedSuccess);
        setTimeout(() => router.push("/login"), 1500);
      } else {
        toast.error(currentText.invalidOtp);
      }
    } catch (error) {
      toast.error(currentText.otpError);
    }
  };

  return (
    <div className=" mt-[-50] w-full h-screen bg-[#f8f9fa] dark:bg-zinc-950 text-[#1F1547] dark:text-[#F0F2E3] flex overflow-hidden select-none" dir={lang === "ar" ? "rtl" : "ltr"}>


      {/* الجزء الأيسر */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center p-8 sm:p-16 relative z-10 bg-[#f8f9fa] dark:bg-zinc-950 transition-colors duration-300">
        <div className="absolute inset-x-0 top-1/4 bg-[#D6C88A]/5 blur-[120px] rounded-full pointer-events-none max-w-md mx-auto h-72" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto space-y-6"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight">
              {step === "login" ? currentText.welcomeBack : currentText.verifyAccount}
            </h2>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
              {step === "login"
                ? currentText.loginSub
                : currentText.otpSub(email)}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === "login" ? (
              <motion.div
                key="login-stage"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-5"
              >
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

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">{currentText.passwordLabel}</label>
                    {/* رابط نسيت كلمة المرور */}
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-[#1F1547] dark:text-[#D6C88A] hover:underline transition-colors"
                    >
                      {lang === "ar" ? "نسيت كلمة المرور؟" : "Forgot Password?"}
                    </Link>
                  </div>
                  <div className="relative flex items-center">
                    <Lock size={16} className={`absolute ${lang === "ar" ? "right-4" : "left-4"} text-zinc-400`} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full h-12 ${lang === "ar" ? "pr-12 pl-4" : "pl-12 pr-4"} rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-sm font-semibold focus:outline-hidden focus:border-[#D6C88A] transition-colors shadow-xs`}
                    />
                  </div>
                </div>

                <button
                  onClick={handleLogin}
                  className="w-full h-12 rounded-xl bg-[#1F1547] dark:bg-[#D6C88A] text-white dark:text-[#1F1547] font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
                >
                  {currentText.signIn} <ArrowRight size={16} className={lang === "ar" ? "rotate-180" : ""} />
                </button>

                {/* رابط إنشاء حساب تم نقله ليصبح تحت زر تسجيل الدخول مباشرة */}
                <div className="text-center pt-2">
                  <p className="text-xs font-semibold text-zinc-400">
                    {currentText.newToJadd}{" "}
                    <Link href="/signup" className="text-[#D6C88A] font-bold hover:underline">{currentText.createAcc}</Link>
                  </p>
                </div>

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
                    onClick={() => setStep("login")}
                    className="text-xs font-bold text-zinc-400 hover:text-[#D6C88A] transition-colors"
                  >
                    {currentText.editCreds}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
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