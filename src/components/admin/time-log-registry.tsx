"use client";

import React, { useState } from "react";
import {
  Zap,
  Search,
  Trash2,
  X,
  Calendar,
  Plus,
  Clock,
  User,
  Briefcase,
  FileText,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TimeLog, Task, TeamMember, Project } from "@/src/types/backend";
import { useAlert } from "@/src/components/global/alert-provider";

type TimeLogWithData = TimeLog & {
  task: Task & { project: Project },
  member: TeamMember
};

export default function TimeLogRegistry({
  initialLogs,
  tasks,
  members
}: {
  initialLogs: TimeLogWithData[],
  tasks: (Task & { project: Project })[],
  members: TeamMember[]
}) {
  const { showAlert } = useAlert();
  const [logs, setLogs] = useState(initialLogs);
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = logs.filter(l =>
    l.task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.task.project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-full">
      <section className="p-10 border-b border-white/10 bg-black flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight text-white uppercase">
            Time Logs.
          </h1>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center gap-3 px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-scarab-gold transition-all rounded-sm"
        >
          <Clock size={14} strokeWidth={3} />
          Log Time
        </button>
      </section>

      <div className="p-8">
        <div className="admin-panel">
          <div className="p-6 border-b border-white/10 bg-white/[0.01] flex justify-between items-center">
            <div className="relative max-w-md w-full">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-black border border-white/10 rounded-sm py-2.5 pl-10 pr-4 text-[10px] font-mono uppercase tracking-[0.2em] focus:border-white/40 transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-8 px-6">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono uppercase text-white/20 tracking-widest">Total</span>
                <span className="text-sm font-bold text-white font-mono">
                  {logs.reduce((acc, curr) => acc + Number(curr.hoursLogged), 0).toFixed(1)} <span className="text-[8px] text-white/20">HRS</span>
                </span>
              </div>
              <div className="w-[1px] h-8 bg-white/10" />
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono uppercase text-white/20 tracking-widest">Logs</span>
                <span className="text-sm font-bold text-scarab-gold font-mono">
                  {logs.length} <span className="text-[8px] text-white/20">ENTRIES</span>
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] text-white/40 text-[9px] font-mono uppercase tracking-[0.3em] border-b border-white/10">
                  <th className="px-8 py-5 font-medium">Task</th>
                  <th className="px-8 py-5 font-medium">Member</th>
                  <th className="px-8 py-5 font-medium">Hours</th>
                  <th className="px-8 py-5 font-medium">Date</th>
                  <th className="px-8 py-5 text-right font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="interactive-node group">
                    <td className="px-8 py-6">
                      <div className="text-[11px] font-bold text-white/90 uppercase tracking-widest">
                        {log.task.title}
                      </div>
                      <div className="flex items-center gap-2 text-[9px] font-mono text-white/20 uppercase mt-1">
                        <Briefcase size={10} />
                        {log.task.project.title}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-white/5 border border-white/10 flex items-center justify-center text-[8px] font-bold text-white/40 uppercase">
                          {log.member.fullName[0]}
                        </div>
                        <span className="text-[10px] font-mono uppercase text-white/60">{log.member.fullName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-mono text-[12px] text-white font-bold">
                      {Number(log.hoursLogged).toFixed(1)} <span className="text-[8px] text-white/20 ml-1">HRS</span>
                    </td>
                    <td className="px-8 py-6 text-[10px] font-mono text-white/40 uppercase">
                      {new Date(log.dateLogged).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right font-mono text-[9px] text-white/20 uppercase tracking-widest max-w-[200px] truncate">
                      {log.notes || "NO_REMARKS"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-black border border-white/10 p-12 max-w-lg w-full space-y-8 shadow-2xl">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold uppercase tracking-tight text-white flex items-center gap-4">
                    <Clock className="text-scarab-gold" size={24} />
                    Log Time
                  </h2>
                </div>
                <button onClick={() => setIsAdding(false)} className="text-white/20 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form className="space-y-6" onSubmit={async (e) => {
                e.preventDefault();
                setIsPending(true);
                try {
                  const fd = new FormData(e.currentTarget);
                  const data = {
                    taskId: parseInt(fd.get("taskId") as string),
                    memberId: parseInt(fd.get("memberId") as string),
                    hoursLogged: parseFloat(fd.get("hoursLogged") as string),
                    dateLogged: fd.get("dateLogged") as string,
                    notes: fd.get("notes") as string,
                  };
                  console.log("CREATE_TIME_LOG:", data);
                  showAlert("Velocity metrics synchronized successfully.", { type: "success" });
                  setIsAdding(false);

                } catch (err) {
                  showAlert("Velocity synchronization failure: Ledger handshake aborted.", { type: "error" });
                } finally {
                  setIsPending(false);
                }
              }}>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/40 ml-1">Task</label>
                    <select name="taskId" required className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-[11px] font-mono text-white focus:border-white/40 outline-none transition-all rounded-sm appearance-none cursor-pointer">
                      <option value="" className="bg-black">SELECT TASK</option>
                      {tasks.map(t => (
                        <option key={t.id} value={t.id} className="bg-black">{t.project.title.toUpperCase()}{" // "}{t.title.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/40 ml-1">Member</label>
                    <select name="memberId" required className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-[11px] font-mono text-white focus:border-white/40 outline-none transition-all rounded-sm appearance-none cursor-pointer">
                      <option value="" className="bg-black">SELECT MEMBER</option>
                      {members.map(m => (
                        <option key={m.id} value={m.id} className="bg-black">{m.fullName.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/40 ml-1">Execution_Date</label>
                      <input type="date" name="dateLogged" required className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-[11px] font-mono text-white focus:border-white/40 outline-none transition-all rounded-sm invert" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/40 ml-1">Output (Hours)</label>
                      <input type="number" name="hoursLogged" step="0.1" required placeholder="0.0" className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-[11px] font-mono text-white focus:border-white/40 outline-none transition-all rounded-sm" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/40 ml-1">Notes</label>
                    <textarea name="notes" rows={2} placeholder="Brief work description..." className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-[11px] font-mono text-white focus:border-white/40 outline-none transition-all rounded-sm resize-none" />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-white text-black py-4 text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-scarab-gold transition-all rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? "SYNCHRONIZING..." : "Log Time"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
