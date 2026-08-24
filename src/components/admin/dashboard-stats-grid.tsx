"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Box,
  Activity,
  ShieldAlert,
  ArrowUpRight
} from "lucide-react";

const ICON_MAP = {
  Users,
  Box,
  Activity,
  ShieldAlert
};

export interface Stat {
  label: string;
  value: string;
  icon: keyof typeof ICON_MAP;
  color: string;
}

export default function DashboardStatsGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => {
        const Icon = ICON_MAP[stat.icon];
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative group overflow-hidden bg-white/[0.03] border border-white/10 p-8 hover:border-scarab-gold/50 transition-colors"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight size={20} className="text-scarab-gold" />
            </div>
            <div className="flex flex-col gap-4">
              <div className={stat.color}>
                <Icon size={24} />
              </div>
              <div>
                <div className="text-3xl font-black font-mono tracking-tighter">
                  {stat.value}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 group-hover:text-white/60 transition-colors">
                  {stat.label}
                </div>
              </div>
            </div>
            {/* Subtle accent line */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-scarab-gold/20 to-transparent" />
          </motion.div>
        );
      })}
    </div>
  );
}
