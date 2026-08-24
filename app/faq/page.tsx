"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus, ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    id: "01",
    category: "ENGINEERING",
    question: "What defines a 'High-End Web Solution'?",
    answer: "Unlike standard templates, our solutions are bespoke architectural builds. We prioritize Edge Runtime performance, structural SEO integrity, and high-fidelity UI engineering to ensure your digital presence is a permanent asset."
  },
  {
    id: "02",
    category: "INFRASTRUCTURE",
    question: "Why does Scarabix utilize Edge Runtime?",
    answer: "Speed is a pillar of legacy. By distributing your site across a global network of edge nodes, we eliminate latency and ensure near-instant load times for users regardless of their physical location."
  },
  {
    id: "03",
    category: "PROTOCOL",
    question: "How long does a typical project take?",
    answer: "Precision takes time. A standard architectural build typically spans 4 to 8 weeks, covering conceptual blueprints, technical engineering, and final stress-testing before deployment."
  },
  {
    id: "04",
    category: "LEGACY",
    question: "Does the Agency provide maintenance?",
    answer: "We build for permanence. Every project includes a structural handover. To ensure long-term stability and scaling, we offer three specialized maintenance tiers: Foundation, Evolution, and Legacy.",
    hasLink: true
  },
];

export default function FAQPage() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#F0EDE8] dark:bg-[#0A0A0A] text-black dark:text-white transition-colors duration-300 pt-32 pb-24 selection:bg-scarab-gold selection:text-black font-seed">
      <div className="max-w-4xl mx-auto px-6">

        {/* MINIMAL NAVIGATION */}
        <nav className="mb-24">
          <Link
            href="/"
            className="group inline-flex items-center gap-4 transition-all"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:border-scarab-gold group-hover:bg-scarab-gold transition-all duration-300">
              <ArrowLeft
                size={18}
                strokeWidth={2.5}
                className="text-black/70 dark:text-white/70 group-hover:text-black transition-colors"
              />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-30 group-hover:opacity-100 dark:group-hover:text-scarab-gold transition-opacity">
              Return to Node
            </span>
          </Link>
        </nav>

        {/* CENTERED HEADER */}
        <div className="text-center mb-32 space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none"
          >
            FA<span className="text-scarab-gold">Q</span>s
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-px w-12 bg-black/10 dark:bg-white/10 mx-auto"
          />
        </div>

        {/* ADAPTIVE ACCORDION */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-black/5 dark:border-white/5 last:border-0 transition-colors duration-300"
            >
              <button
                onClick={() => setActiveIdx(activeIdx === index ? null : index)}
                className="w-full py-10 flex items-start justify-between text-left group outline-none"
              >
                <div className="flex gap-8 md:gap-16 items-start">
                  <span className="text-[10px] font-mono pt-1.5 opacity-20 group-hover:opacity-100 transition-opacity">
                    {faq.id}
                  </span>
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold tracking-widest text-scarab-gold uppercase">
                      {faq.category}
                    </span>
                    <h3 className={`text-xl md:text-3xl font-bold uppercase tracking-tight transition-all duration-300 ${activeIdx === index
                      ? "text-black dark:text-white"
                      : "text-black/30 dark:text-white/20 group-hover:text-black/60 dark:group-hover:text-white/60"
                      }`}>
                      {faq.question}
                    </h3>
                  </div>
                </div>

                <div className="pt-1.5 shrink-0">
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <Plus
                      size={20}
                      className={`absolute transition-all duration-300 ease-[0.16,1,0.3,1] ${activeIdx === index ? "rotate-90 opacity-0" : "opacity-20 group-hover:opacity-100"}`}
                      strokeWidth={1.5}
                    />
                    <Minus
                      size={20}
                      className={`absolute transition-all duration-300 ease-[0.16,1,0.3,1] ${activeIdx === index ? "opacity-40" : "rotate-90 opacity-0"}`}
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {activeIdx === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pl-[58px] md:pl-[90px] pb-12 max-w-2xl">
                      <p className="text-black/50 dark:text-white/40 text-base md:text-lg leading-relaxed italic transition-colors duration-300">
                        {faq.answer}
                      </p>

                      {faq.hasLink && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="mt-10"
                        >
                          {/* OUTLINED BUTTON VARIANT */}
                          <Link
                            href="/packages"
                            className="group/btn inline-flex items-center justify-between gap-8 px-8 py-5 border-2 border-black/10 dark:border-white/10 rounded-full hover:border-scarab-gold transition-all duration-500 active:scale-95"
                          >
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors">
                              Explore Packages
                            </span>
                            <div className="w-8 h-8 rounded-full border-2 border-black/10 dark:border-white/10 flex items-center justify-center group-hover/btn:bg-scarab-gold group-hover/btn:border-scarab-gold group-hover/btn:text-black transition-all duration-500 group-hover/btn:rotate-45">
                              <ArrowUpRight size={16} strokeWidth={3} />
                            </div>
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* SOLID PRIMARY CTA (FOOTER) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-40 pt-20 border-t border-black/5 dark:border-white/5 text-center space-y-10"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.4em] opacity-80 transition-colors duration-300">
            Unresolved Technical Query?
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center justify-between gap-8 bg-black dark:bg-white text-white dark:text-black px-10 py-6 rounded-full hover:bg-scarab-gold dark:hover:bg-scarab-gold hover:text-black transition-all duration-500 active:scale-95 shadow-2xl shadow-black/10"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.3em]">
              Ask your question
            </span>
            <div className="w-10 h-10 rounded-full border border-white/20 dark:border-black/20 flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
              <ArrowUpRight size={20} strokeWidth={3} />
            </div>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
