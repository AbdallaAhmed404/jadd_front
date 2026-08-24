"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Eye, Star, HeartHandshake, ArrowUpRight, ShieldAlert, MessageSquare } from "lucide-react";
import Link from "next/link";

// 1. بيانات أمان وضمان التعاملات داخل سلطنة عُمان
const safetyGuidelines = [
  {
    id: "SEC-01",
    title: "Inspect Before You Pay",
    description: "Always meet the seller in a public, well-lit place to fully check the item's condition before transferring any funds.",
    icon: <Eye size={20} className="text-indigo-500 dark:text-indigo-400" />,
  },
  {
    id: "SEC-02",
    title: "Keep Chats Inside JADD",
    description: "Use our secure, built-in chat engine for all communication. Keeping your chats here helps us ensure your safety.",
    icon: <MessageSquare size={20} className="text-violet-500 dark:text-violet-400" />,
  },
  {
    id: "SEC-03",
    title: "Verified Transactions",
    description: "Never share your banking OTP details with anyone. Follow our official verified guidelines for a completely secure swap.",
    icon: <ShieldCheck size={20} className="text-emerald-500 dark:text-emerald-400" />,
  },
];

// 2. مراجعات وتقييمات المجتمع
const testimonials = [
  {
    name: "Haitham Al-Balushi",
    role: "Verified Seller // Muscat",
    rating: 5,
    comment: "Listed my old PlayStation 5 on JADD, and within 3 hours I found a buyer from Seeb. The GPS tag made it super easy for him to reach my exact location without endless phone calls.",
    avatarBg: "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400",
    initials: "HB"
  },
  {
    name: "Muna Al-Riyami",
    role: "Verified Buyer // Salalah",
    rating: 5,
    comment: "I was looking for clean home furniture. Found an amazing minimalist coffee table listed nearby. The condition badge was 100% accurate, and the internal chat kept the bargain professional.",
    avatarBg: "bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400",
    initials: "MR"
  }
];

export default function TrustAndSocialProof() {
  return (
    <section
      id="trust-safety"
      className="py-20 md:py-32 bg-[#f8f9fa] dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 overflow-hidden font-sans border-t border-zinc-200/40 dark:border-zinc-900/60 transition-colors duration-300"
    >
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        
        {/* ==================== الـ HEADER الرئيسي للقسم ==================== */}
        <div className="mb-20 text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-500 dark:text-indigo-400 block">
            Community Shield & Verification
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Trust & <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">Safety.</span>
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 dark:text-zinc-500 font-medium leading-relaxed">
            We engineer secure connections. Learn how JADD keeps your neighborhood marketplace protected, friendly, and transparent.
          </p>
        </div>

        {/* مسار العرض التتابعي الرأسي (Vertical Stack Flow) */}
        <div className="space-y-24">
          
          {/* ---------------- PART 1: دليل أمان التعاملات ---------------- */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-200/60 dark:border-zinc-900">
              <ShieldAlert size={14} className="text-indigo-500" />
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Safe Trading Protocol</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {safetyGuidelines.map((guideline, index) => (
                <motion.div
                  key={guideline.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="flex flex-col sm:flex-row gap-5 p-6 rounded-[24px] bg-white dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-900/80 items-start hover:scale-[1.005] hover:border-zinc-300 dark:hover:border-zinc-800 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/30 dark:border-zinc-800/60 flex items-center justify-center shrink-0 shadow-xs">
                    {guideline.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                        {guideline.title}
                      </h4>
                      <span className="text-[9px] font-mono font-medium text-zinc-300 dark:text-zinc-700">| {guideline.id}</span>
                    </div>
                    <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                      {guideline.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ---------------- PART 2: تقييمات وآراء المجتمع ---------------- */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-200/60 dark:border-zinc-900">
              <HeartHandshake size={14} className="text-violet-500" />
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Voices From Oman</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-900/80 p-6 rounded-[28px] flex flex-col justify-between hover:scale-[1.005] transition-all duration-300"
                >
                  <div>
                    {/* النجوم وتقييم التجربة */}
                    <div className="flex items-center gap-0.5 mb-3 text-amber-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={12} fill="currentColor" />
                      ))}
                    </div>

                    {/* نص المراجعة والتعليق الهادئ */}
                    <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium tracking-tight pl-3 border-l-2 border-indigo-400/40 italic">
                      "{testimonial.comment}"
                    </p>
                  </div>

                  {/* بيانات وهوية المستخدم النظيفة */}
                  <div className="flex items-center gap-3 mt-6 pt-3 border-t border-zinc-100 dark:border-zinc-900/60">
                    <div className={`w-8 h-8 rounded-full ${testimonial.avatarBg} flex items-center justify-center font-mono font-bold text-[10px] shrink-0 border border-zinc-200/20`}>
                      {testimonial.initials}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        {testimonial.name}
                      </h5>
                      <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

       

      </div>
    </section>
  );
}