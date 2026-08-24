"use client";

import React, { useState } from "react";
import {
  Box,
  Clock,
  Zap,
  Lock,
  Terminal,
  Eye,
  EyeOff,
  ChevronRight,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Project,
  Client,
  Milestone,
  Task,
  TimeLog,
  ProjectMetadata,
  Invoice,
  Expense
} from "@/src/types/backend";
import { useAlert } from "@/src/components/global/alert-provider";

type FullProject = Project & {
  client: Client;
  milestones: (Milestone & {
    tasks: (Task & {
      timeLogs: TimeLog[];
    })[];
  })[];
  invoices: Invoice[];
  expenses: Expense[];
  metadata: Partial<ProjectMetadata>[];
};

interface ProjectDetailViewProps {
  project: FullProject;
}

export default function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const { showAlert } = useAlert();
  const [authRequired, setAuthRequired] = useState<{ id: number, name: string } | null>(null);
  const [revealedSecrets, setRevealedSecrets] = useState<{ [key: string]: string }>({});
  const [pin, setPin] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);

  // CALCULATIONS
  const totalInvoiced = project.invoices
    ?.reduce((acc: number, curr) => acc + Number(curr.amount), 0) || 0;

  const totalExpenses = project.expenses
    ?.reduce((acc: number, curr) => acc + Number(curr.amount), 0) || 0;

  const totalHours = project.milestones
    ?.flatMap((m) => m.tasks || [])
    ?.flatMap((t) => t?.timeLogs || [])
    ?.reduce((acc: number, curr) => acc + Number(curr.hoursLogged), 0) || 0;

  const handleReveal = (metadata: Partial<ProjectMetadata>) => {
    if (metadata.id && revealedSecrets[metadata.id]) {
      setRevealedSecrets(prev => {
        const next = { ...prev };
        delete next[metadata.id!];
        return next;
      });
    } else if (metadata.id && metadata.environment) {
      setAuthRequired({ id: metadata.id, name: metadata.environment });
    }
  };

  const confirmAuth = async () => {
    if (authRequired) {
      setIsDecrypting(true);
      console.log("VAULT_AUTH_REVEAL: Decoupled mode, revealing mock secret.");
      setRevealedSecrets(prev => ({ ...prev, [authRequired.id]: "DECOUPLED_MOCK_SECRET" }));
      setAuthRequired(null);
      setPin("");
      setIsDecrypting(false);
    }
  };

  return (
    <div className="p-0 flex flex-col min-h-full bg-black">
      {/* SECTION A: THE CORE */}
      <section className="p-12 border-b-2 border-white grid grid-cols-1 lg:grid-cols-4 gap-0">
        <div className="lg:col-span-2 border-r-0 lg:border-r-2 border-white pb-8 lg:pb-0 pr-0 lg:pr-12">
          <div className="flex items-center gap-4 mb-4">
            <Box size={20} className="text-scarab-gold" />
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/40">Project_Intelligence</span>
          </div>
          <h1 className="text-6xl font-black uppercase italic tracking-tighter mb-4 leading-none">
            {project.title}<span className="text-scarab-gold">.</span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="inline-block px-4 py-2 border border-white bg-white/10 text-[11px] font-black uppercase tracking-widest">
              {project.status}
            </div>
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              CLIENT: <span className="text-white/80">{project.client.name}</span>
            </div>
          </div>
        </div>

        <div className="border-t-2 lg:border-t-0 border-white p-8 space-y-4">
          <div className="flex items-center gap-3">
            <Activity size={14} className="text-white/40" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Deployment_Metrics</span>
          </div>
          <div className="space-y-1">
            <div className="text-[9px] font-mono text-white/20 uppercase">Invoiced</div>
            <div className="text-2xl font-black font-mono text-emerald-500">EGP {totalInvoiced.toLocaleString()}</div>
          </div>
          <div className="space-y-1">
            <div className="text-[9px] font-mono text-white/20 uppercase">Expenses</div>
            <div className="text-2xl font-black font-mono text-rose-500">EGP {totalExpenses.toLocaleString()}</div>
          </div>
        </div>

        <div className="border-t-2 lg:border-t-0 border-l-0 lg:border-l-2 border-white p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Clock size={14} className="text-white/40" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Temporal_Registry</span>
          </div>
          <div className="space-y-1">
            <div className="text-[9px] font-mono text-white/20 uppercase">Velocity</div>
            <div className="text-3xl font-black font-mono text-white">{totalHours.toFixed(1)} <span className="text-[10px] font-normal text-white/40 tracking-widest uppercase">HRS</span></div>
          </div>
          <div className="pt-2 border-t border-white/10">
            <div className="text-[9px] font-mono text-white/40">INIT: {new Date(project.createdAt).toISOString().split('T')[0]}</div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 flex-1">

        {/* SECTION C: THE VAULT */}
        <section className="border-r-2 border-white flex flex-col">
          <div className="p-8 border-b-2 border-white bg-scarab-gold/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Lock size={18} className="text-scarab-gold" />
              <h2 className="text-xs font-black uppercase tracking-[0.4em]">The_Vault {"//"} Secured_Metadata</h2>
            </div>
            <div className="text-[9px] font-mono uppercase text-scarab-gold">Access_Registry_Locked</div>
          </div>

          <div className="flex-1 p-0">
            {project.metadata?.map((meta) => (
              <div key={meta.id} className="flex items-center justify-between border-b border-white/20 px-8 py-8 group hover:bg-white/5 transition-colors">
                <div className="space-y-1 flex-1">
                  <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{meta.environment}</div>
                  <div className="flex flex-col gap-1">
                    {meta.username && <div className="text-[11px] font-mono text-white/60">{meta.username}</div>}
                    <div className={cn(
                      "text-[14px] font-mono font-bold tracking-widest transition-all",
                      meta.id && revealedSecrets[meta.id] ? "text-scarab-gold" : "text-white/20 select-none"
                    )}>
                      {(meta.id && revealedSecrets[meta.id]) || "••••••••••••••••"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleReveal(meta)}
                  className="w-12 h-12 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                >
                  {meta.id && revealedSecrets[meta.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            ))}
            {(!project.metadata || project.metadata.length === 0) && (
              <div className="p-12 text-center text-[10px] font-mono text-white/20 uppercase tracking-[0.5em]">
                No_Metadata_Records_Found
              </div>
            )}
          </div>
        </section>

        {/* SECTION D: THE BLUEPRINT (Milestones & Tasks) */}
        <section className="flex flex-col">
          <div className="p-8 border-b-2 border-white bg-white/5 flex items-center gap-4">
            <Zap size={18} className="text-white" />
            <h2 className="text-xs font-black uppercase tracking-[0.4em]">Blueprint {"//"} Relational_Hierarchy</h2>
          </div>

          <div className="flex-1 p-8 space-y-12">
            {project.milestones?.map((milestone) => (
              <div key={milestone.id} className="space-y-6">
                <div className="flex items-center justify-between border-l-4 border-white pl-6">
                  <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-white">{milestone.title}</h3>
                  <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">
                    ID_NODE: {String(milestone.id).padStart(4, '0')}
                  </span>
                </div>

                <div className="ml-10 space-y-4">
                  {milestone.tasks?.map((task) => (
                    <div key={task.id} className="flex items-center justify-between border-b border-white/10 pb-4 group">
                      <div className="flex items-center gap-4">
                        <ChevronRight size={14} className="text-white/20 group-hover:text-scarab-gold transition-colors" />
                        <span className={cn(
                          "text-[11px] font-bold uppercase tracking-widest transition-all",
                          task.priority === "CRITICAL" ? "text-scarab-gold" : "text-white/80"
                        )}>
                          {task.title}
                        </span>
                        {task.priority === "CRITICAL" && (
                          <span className="text-[8px] font-black px-1 bg-scarab-gold text-black uppercase">Critical</span>
                        )}
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-[8px] font-mono text-white/20 uppercase">Workload</div>
                          <div className="text-[10px] font-mono text-white/60">
                            {task.timeLogs?.reduce((a: number, c: TimeLog) => a + Number(c.hoursLogged), 0).toFixed(1)}H
                          </div>
                        </div>
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-2 py-1 border",
                          task.status === "DONE" ? "border-emerald-500/20 text-emerald-500/40" : "border-white/10 text-white/20"
                        )}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {(!project.milestones || project.milestones.length === 0) && (
              <div className="p-12 text-center text-[10px] font-mono text-white/20 uppercase tracking-[0.5em]">
                No_Blueprint_Mapped
              </div>
            )}
          </div>
        </section>
      </div>

      {/* RE-AUTH MODAL (Comfortable Brutalist) */}
      <AnimatePresence>
        {authRequired && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 1, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1, opacity: 0, y: 20 }}
              className="w-full max-w-md bg-black border-2 border-white p-12 shadow-[20px_20px_0px_0px_rgba(212,175,55,0.1)]"
            >
              <div className="flex items-center gap-4 mb-8 border-b-2 border-white pb-6">
                <Terminal size={18} className="text-scarab-gold" />
                <span className="text-[12px] font-black uppercase tracking-[0.4em]">Vault_Re-Auth</span>
              </div>

              <div className="space-y-8 font-mono">
                <p className="text-[11px] text-white/40 leading-relaxed uppercase tracking-wider">
                  [SECURITY_GATE]: Decryption required for index:
                  <span className="text-white font-black block mt-1 tracking-widest">&quot;{authRequired.name}&quot;</span>
                </p>

                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] uppercase tracking-widest text-white/30 ml-1">Access_Pin</label>
                    <input
                      type="password"
                      autoFocus
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="••••"
                      maxLength={4}
                      className="bg-white/5 border border-white px-6 py-4 text-white text-[16px] tracking-[1em] focus:border-scarab-gold outline-none transition-colors text-center font-black"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 pt-4">
                  <button
                    onClick={confirmAuth}
                    disabled={isDecrypting || pin.length < 4}
                    className="w-full bg-white text-black py-5 text-[12px] font-black uppercase tracking-[0.4em] hover:bg-scarab-gold transition-all disabled:opacity-20"
                  >
                    {isDecrypting ? "DECRYPTING..." : "Execute_Access"}
                  </button>
                  <button
                    onClick={() => { setAuthRequired(null); setPin(""); }}
                    className="w-full border-2 border-white text-white py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-colors"
                  >
                    Abort_Sequence
                  </button>
                </div>

                <div className="text-[8px] text-white/10 uppercase tracking-[0.6em] text-center pt-8">
                  Scarabix_Vault_Protection_V2
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
