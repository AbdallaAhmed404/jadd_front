"use client";

import React from "react";
import {
  User,
  Mail,
  Briefcase,
  Clock,
  Shield,
  Activity,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { TeamMember } from "@/src/types/backend";
import { cn } from "@/lib/utils";

export default function TeamMemberView({ member }: { member: TeamMember }) {
  return (
    <div className="flex flex-col min-h-full bg-black">
      {/* HEADER */}
      <section className="p-12 border-b-2 border-white grid grid-cols-1 lg:grid-cols-4 gap-0">
        <div className="lg:col-span-2 border-r-0 lg:border-r-2 border-white pb-8 lg:pb-0 pr-0 lg:pr-12">
          <Link
            href="/admin/team"
            className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.4em] text-white/40 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={12} />
            Back_To_Registry
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <User size={20} className="text-scarab-gold" />
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/40">Personnel_Profile</span>
          </div>
          <h1 className="text-6xl font-black uppercase italic tracking-tighter mb-4 leading-none">
            {member.fullName}<span className="text-scarab-gold">.</span>
          </h1>
          <div className="flex items-center gap-4">
            <div className={cn(
              "inline-block px-4 py-2 border font-black uppercase tracking-widest text-[11px]",
              member.isActive ? "border-emerald-500 bg-emerald-500/10 text-emerald-500" : "border-rose-500 bg-rose-500/10 text-rose-500"
            )}>
              {member.isActive ? "ACTIVE_DUTY" : "INACTIVE"}
            </div>
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              ID_NODE: <span className="text-white/80">#{member.id.toString().padStart(4, '0')}</span>
            </div>
          </div>
        </div>

        <div className="border-t-2 lg:border-t-0 border-white p-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail size={14} className="text-white/40" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Communication</span>
            </div>
            <div className="text-[13px] font-mono text-white break-all">{member.email}</div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Briefcase size={14} className="text-white/40" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Specialization</span>
            </div>
            <div className="text-xl font-black font-mono text-white uppercase tracking-tighter">{member.role}</div>
          </div>
        </div>

        <div className="border-t-2 lg:border-t-0 border-l-0 lg:border-l-2 border-white p-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Clock size={14} className="text-white/40" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Initialization_Date</span>
            </div>
            <div className="text-[12px] font-mono text-white/80 uppercase">
              {new Date(member.createdAt).toLocaleString()}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield size={14} className="text-white/40" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Clearance_Level</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1 flex-1 bg-white/10">
                <div className="h-full bg-scarab-gold w-1/3" />
              </div>
              <span className="text-[9px] font-black text-scarab-gold">LVL_01</span>
            </div>
          </div>
        </div>
      </section>

      {/* ADDITIONAL INFO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 border-b border-white/10">
        <section className="p-12 border-r-2 border-white bg-white/[0.01] space-y-8">
          <div className="flex items-center gap-4">
            <Activity size={18} className="text-scarab-gold" />
            <h2 className="text-xs font-black uppercase tracking-[0.4em]">Activity_Snapshot</h2>
          </div>
          <div className="p-8 border border-white/10 bg-black text-center space-y-2">
            <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Aggregate_Uptime</div>
            <div className="text-4xl font-black text-white">0.0<span className="text-white/20">H</span></div>
            <p className="text-[9px] font-mono text-white/10 uppercase tracking-widest">No active logs found</p>
          </div>
        </section>

        <section className="lg:col-span-2 p-12 space-y-8">
          <div className="flex items-center gap-4">
            <Shield size={18} className="text-white" />
            <h2 className="text-xs font-black uppercase tracking-[0.4em]">Administrative_Notes</h2>
          </div>
          <div className="font-mono text-[11px] text-white/30 leading-relaxed uppercase tracking-wider border-l-2 border-white/10 pl-8">
            [SYSTEM_MEMO]: Member initialized in structural registry. No restricted incidents logged. Clearance pending for root level artifacts.
          </div>
        </section>
      </div>
    </div>
  );
}
