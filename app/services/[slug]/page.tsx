"use client";
import React from "react";
import { motion } from "framer-motion";
import { serviceDetails } from "@/lib/services";
import {
  ArrowLeft,
  Fingerprint,
  Activity,
  Cpu,
  Zap,
  Command,
} from "lucide-react";
import Link from "next/link";

export default function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;
  const service = serviceDetails[slug as keyof typeof serviceDetails];

  if (!service)
    return (
      <div className="h-screen flex items-center justify-center font-black uppercase text-scarab-gold transition-colors duration-500">
        404
      </div>
    );

  return (
    <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0A0A0A] text-[#1a1a18] dark:text-[#EEEEEE] font-linseed selection:bg-scarab-gold selection:text-black overflow-x-hidden relative transition-colors duration-500 pt-24 md:pt-32">
      <div className="container mx-auto px-5 md:px-12 relative z-10">
        {/* 1. NAVIGATION */}
        <nav className="mb-10 md:mb-16">
          <Link
            href="/#services"
            className="group inline-flex items-center gap-4 transition-all"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:border-scarab-gold group-hover:bg-scarab-gold transition-all duration-500">
              <ArrowLeft
                size={18}
                strokeWidth={2.5}
                className="text-black/70 dark:text-white/70 group-hover:text-black transition-colors"
              />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-30 group-hover:opacity-100 dark:group-hover:text-scarab-gold transition-opacity">
              Return to Home
            </span>
          </Link>
        </nav>

        {/* 2. HERO SECTION */}
        <section className="pb-20 md:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-6 bg-scarab-gold/40" />
              <span className="text-scarab-gold text-[8px] md:text-[10px] font-bold uppercase tracking-[0.8em]">
                {slug.replace("-", " ").toUpperCase()}
              </span>
            </div>
            <h1 className="text-[13vw] md:text-[9.5rem] font-black uppercase italic leading-[0.85] tracking-tighter mb-10 wrap-break-word">
              {service.title.split(" ")[0]} <br />
              <span className="text-scarab-gold">
                {service.title.split(" ")[1]}
              </span>
            </h1>

            <div className="max-w-2xl border-l-2 border-scarab-gold pl-6 md:pl-8">
              <p className="text-lg md:text-3xl font-bold uppercase leading-tight italic opacity-80 dark:opacity-90">
                &quot;{service.description}&quot;
              </p>
            </div>
          </motion.div>
        </section>

        {/* 3. PHASE GRID */}
        <section className="mb-32 md:mb-40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-12">
            {service.phases.map((phase, i) => (
              <div key={i} className="space-y-5 group">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black italic text-scarab-gold">
                    0{i + 1}
                  </span>
                  <div className="h-px flex-1 bg-black/10 dark:bg-white/10 group-hover:bg-scarab-gold/50 transition-colors duration-500" />
                </div>
                <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tight">
                  {phase.name}
                </h3>
                <p className="text-sm font-bold uppercase leading-relaxed opacity-40 group-hover:opacity-70 transition-opacity">
                  {phase.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. THE ANCHOR: UNBREAKABLE SYSTEMS - Content optimized */}
        <section className="pb-24 relative">
          <div className="bg-[#0f0f0f] text-[#fafaf9] p-6 md:p-24 border border-white/5 relative overflow-hidden shadow-2xl rounded-sm">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Fingerprint size={120} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center relative z-10">
              <div className="space-y-6">
                <h2 className="text-[10vw] md:text-7xl font-black uppercase italic leading-[0.9] tracking-tighter">
                  Unbreakable <br />{" "}
                  <span className="text-scarab-gold">Systems.</span>
                </h2>
                <p className="max-w-md text-xs md:text-sm uppercase font-bold tracking-widest leading-loose opacity-60">
                  Engineering hardened architectures that maximize operational
                  logic.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 border border-white/10 overflow-hidden rounded-sm">
                {[
                  {
                    label: "Visual Performance",
                    icon: <Zap size={18} />,
                    val: "Instant Loading",
                    desc: "Your site appears in under 1.2 seconds.",
                  },
                  {
                    label: "Interaction Speed",
                    icon: <Activity size={18} />,
                    val: "Real-time Touch",
                    desc: "Zero delay between clicks and actions.",
                  },
                  {
                    label: "Global Availability",
                    icon: <Cpu size={18} />,
                    val: "Always Online",
                    desc: "Distributed servers prevent system crashes.",
                  },
                  {
                    label: "Visual Stability",
                    icon: <Command size={18} />,
                    val: "Fluid Layout",
                    desc: "Mathematical precision in every pixel.",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-[#0f0f0f] p-6 md:p-8 flex flex-col gap-3 group hover:bg-[#1a1a18] transition-all duration-500"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold uppercase opacity-40 group-hover:text-scarab-gold transition-colors tracking-widest">
                        {stat.label}
                      </span>
                      <div className="text-scarab-gold/30 group-hover:text-scarab-gold transition-colors">
                        {stat.icon}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-lg md:text-xl font-black italic uppercase tracking-widest text-scarab-gold/90">
                        {stat.val}
                      </span>
                      <p className="text-[8px] font-bold uppercase opacity-20 group-hover:opacity-40 transition-opacity">
                        {stat.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
