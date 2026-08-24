"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Database,
  Globe,
  Shield,
  Terminal,
  Zap,
} from "lucide-react";
import Link from "next/link";

const PACKAGES = [
  {
    id: "Package-01",
    name: "Foundation",
    cost: "Custom",
    desc: "Bespoke digital architecture for static artifacts. Includes a grace period to ensure structural stability.",
    icon: <Globe size={20} />,
    specs: [
      "3-MONTH FREE BUG-FIX WARRANTY",
      "90D POST-LAUNCH STABILITY CHECK",
      "OPTIMIZED EDGE INFRASTRUCTURE",
      "NEXT.JS 15 DEPLOYMENT",
    ],
  },
  {
    id: "Package-02",
    name: "Evolution",
    cost: "EGP 15k+",
    desc: "Active system scaling and database management. Professional maintenance for dynamic environments.",
    icon: <Database size={20} />,
    active: true,
    specs: [
      "STANDARD: EGP 1,200 / HR",
      "BUSINESS: 10H/MO RETAINER",
      "MANAGED DATABASE & SECURITY",
      "48H GUARANTEED RESPONSE",
    ],
  },
  {
    id: "Package-03",
    name: "Legacy",
    cost: "Buyout",
    desc: "Total structural handover. 24/7 mission-critical monitoring and complete IP artifact transfer.",
    icon: <Terminal size={20} />,
    specs: [
      "40% TOTAL PROJECT BUYOUT FEE",
      "ENTERPRISE: 24/7 MONITORING",
      "PRIORITY 1 RESPONSE PROTOCOL",
      "FULL SOURCE CODE OWNERSHIP",
    ],
  },
];

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-32 md:pt-44 pb-24 font-linseed selection:bg-scarab-gold overflow-x-hidden transition-[background-color] duration-500 ease-in-out">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* HEADER PROTOCOL */}
        <header className="flex flex-col mb-16 md:mb-24 gap-8">
          <div className="border-l-2 border-scarab-gold pl-6 md:pl-8">
            <Link
              href="/terms"
              className="group inline-flex items-center gap-3 mb-6 transition-all"
            >
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-foreground/10 flex items-center justify-center group-hover:border-scarab-gold group-hover:bg-scarab-gold transition-[border-color,background-color] duration-300">
                <ArrowLeft
                  size={16}
                  strokeWidth={2.5}
                  /* Text color transitions are now fast (200ms) while background is slow */
                  className="text-foreground/70 group-hover:text-background transition-colors duration-200"
                />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-30 group-hover:opacity-100 group-hover:text-scarab-gold transition-opacity duration-200">
                Return to Terms
              </span>
            </Link>

            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.9] wrap-break-word transition-none">
              Service <br /> <span className="text-scarab-gold">PACKAGES.</span>
            </h1>
          </div>
        </header>

        {/* BLUEPRINT CARDS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {PACKAGES.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="relative h-full"
            >
              <Link
                href={`/contact?source=package&id=${pkg.id}&name=${pkg.name}`}
                className="block group h-full"
              >
                <div
                  className={`relative min-h-137.5 md:h-full bg-background border border-foreground/10 p-8 md:p-10 flex flex-col transition-[background-color,border-color,shadow] duration-500 hover:border-scarab-gold/50 ${pkg.active
                    ? "border-scarab-gold/30 shadow-[0_0_40px_rgba(233,185,73,0.05)]"
                    : ""
                    }`}
                >
                  <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-foreground/10 group-hover:border-scarab-gold transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-foreground/10 group-hover:border-scarab-gold transition-colors duration-300" />

                  <div className="flex justify-between items-center mb-10 md:mb-16">
                    <span className="text-[10px] md:text-[11px] font-bold uppercase text-scarab-gold tracking-[0.3em] transition-none">
                      {pkg.id}
                    </span>
                    <div className="text-foreground/20 group-hover:text-scarab-gold transition-colors duration-200 shrink-0">
                      {pkg.icon}
                    </div>
                  </div>

                  <div className="mb-10">
                    <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-4 group-hover:text-scarab-gold transition-colors duration-200">
                      {pkg.name}
                    </h2>
                    <p className="text-xs text-foreground/40 font-medium italic leading-relaxed max-w-xs transition-none">
                      {pkg.desc}
                    </p>
                  </div>

                  <div className="space-y-4 mb-auto">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap
                        size={12}
                        className="text-scarab-gold transition-none"
                      />
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-30 transition-none">
                        Technical Loadout
                      </span>
                    </div>
                    {pkg.specs.map((spec) => (
                      <div
                        key={spec}
                        className="text-[9px] font-bold tracking-[0.15em] opacity-60 border-b border-foreground/5 pb-2 group-hover:opacity-100 transition-opacity duration-200 uppercase"
                      >
                        {spec}
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-bold opacity-30 uppercase tracking-[0.2em] mb-1 transition-none">
                        Contract Type
                      </span>
                      <span className="text-xl md:text-2xl font-black italic tracking-tighter transition-none">
                        {pkg.cost}
                      </span>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full border border-foreground/10 flex items-center justify-center group-hover:bg-scarab-gold group-hover:text-black transition-[background-color,border-color,transform] group-hover:rotate-45 duration-500">
                      <ArrowUpRight
                        size={18}
                        className="text-foreground/70 group-hover:text-background transition-colors duration-200"
                      />
                    </div>
                  </div>

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] pointer-events-none transition-opacity duration-700 bg-size-[25px_25px] bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)]" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* SECURITY PROTOCOL BAR */}
        <div className="mt-24 border border-foreground/10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between opacity-40 hover:opacity-100 transition-[opacity,border-color] duration-500">
          <div className="flex items-center gap-4">
            <Shield
              className="text-scarab-gold shrink-0 transition-none"
              size={20}
            />
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] transition-none">
              Infrastructure Security Protocol Active
            </span>
          </div>
          <div className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest italic opacity-80 transition-none">
            Managed Hosting // AES-256 Encryption // sub-second latency
          </div>
        </div>
      </div>
    </div>
  );
}
