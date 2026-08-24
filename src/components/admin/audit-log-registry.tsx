"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronRight,
  Database,
  Shield,
  Activity,
  Code
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AuditLog, TeamMember } from "@/src/types/backend";

type AuditWithMember = AuditLog & { member: TeamMember | null };

export default function AuditLogRegistry({
  initialLogs
}: {
  initialLogs: AuditWithMember[]
}) {
  const [logs] = useState(initialLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredLogs = logs.filter(l =>
    l.tableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.member?.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-full font-mono">
      <section className="p-10 border-b border-white/10 bg-black flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight text-white uppercase">
            Activity.
          </h1>
        </div>

        <div className="flex gap-10">
          <div className="flex flex-col items-end">
            <span className="text-[8px] uppercase text-white/20 tracking-widest">Events</span>
            <span className="text-xl font-bold text-white">{logs.length}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] uppercase text-white/20 tracking-widest">Status</span>
            <span className="text-xl font-bold text-emerald-500">ACTIVE</span>
          </div>
        </div>
      </section>

      <div className="p-8">
        <div className="bg-white/[0.02] border border-white/10">
          <div className="p-6 border-b border-white/10 bg-white/[0.01] flex justify-between items-center gap-8">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-black border border-white/10 rounded-sm py-2.5 pl-10 pr-4 text-[10px] font-mono uppercase tracking-[0.2em] focus:border-white/40 transition-all outline-none text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest text-white/40">
              Logs
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/2 text-white/30 text-[9px] uppercase tracking-[0.3em] border-b border-white/10">
                  <th className="px-8 py-5 font-medium w-16">ID</th>
                  <th className="px-8 py-5 font-medium">Action</th>
                  <th className="px-8 py-5 font-medium">Entity</th>
                  <th className="px-8 py-5 font-medium">Member</th>
                  <th className="px-8 py-5 font-medium">Timestamp</th>
                  <th className="px-8 py-5 text-right font-medium">Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLogs.map((log) => {
                  const isExpanded = expandedId === log.id;

                  return (
                    <React.Fragment key={log.id}>
                      <tr
                        onClick={() => setExpandedId(isExpanded ? null : log.id)}
                        className={cn(
                          "interactive-node group cursor-pointer transition-colors",
                          isExpanded ? "bg-white/5" : "hover:bg-white/2"
                        )}
                      >
                        <td className="px-8 py-6 text-[10px] text-white/20">
                          {log.id.toString().padStart(4, '0')}
                        </td>
                        <td className="px-8 py-6">
                          <div className={cn(
                            "inline-flex items-center gap-2 px-2 py-0.5 rounded-sm border text-[8px] font-black uppercase tracking-widest",
                            log.action === "INSERT" ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500" :
                              log.action === "UPDATE" ? "bg-blue-500/5 border-blue-500/20 text-blue-500" :
                                "bg-rose-500/5 border-rose-500/20 text-rose-500"
                          )}>
                            {log.action}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <Database size={12} className="text-white/20" />
                            <div className="text-[11px] font-bold text-white uppercase tracking-widest">
                              {log.tableName}
                            </div>
                            <span className="text-[10px] text-white/20">#{log.recordId}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          {log.member ? (
                            <div className="flex items-center gap-3">
                              <Shield size={12} className="text-white/20" />
                              <span className="text-[10px] uppercase text-white/60">{log.member.fullName}</span>
                            </div>
                          ) : (
                            <span className="text-[9px] text-white/10 uppercase italic">SYSTEM_ROOT</span>
                          )}
                        </td>
                        <td className="px-8 py-6 text-[10px] text-white/40 uppercase">
                          {new Date(log.changeDate).toLocaleString()}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <ChevronRight
                            size={14}
                            className={cn(
                              "text-white/20 transition-transform ml-auto",
                              isExpanded && "rotate-90 text-scarab-gold"
                            )}
                          />
                        </td>
                      </tr>
                      <AnimatePresence>
                        {isExpanded && (
                          <tr>
                            <td colSpan={6} className="bg-black/40 border-t border-white/5">
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-10 grid grid-cols-2 gap-10">
                                  <div className="space-y-4">
                                    <h4 className="text-[9px] uppercase tracking-[0.3em] text-white/20 flex items-center gap-2">
                                      <Code size={12} />
                                      Before
                                    </h4>
                                    <pre className="p-6 bg-black border border-white/5 text-[10px] text-white/40 overflow-auto max-h-60 rounded-sm">
                                      {log.oldValues ? JSON.stringify(log.oldValues, null, 2) : "NULL"}
                                    </pre>
                                  </div>
                                  <div className="space-y-4">
                                    <h4 className="text-[9px] uppercase tracking-[0.3em] text-scarab-gold flex items-center gap-2">
                                      <Activity size={12} />
                                      After
                                    </h4>
                                    <pre className="p-6 bg-black border border-white/10 text-[10px] text-white/80 overflow-auto max-h-60 rounded-sm shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
                                      {log.newValues ? JSON.stringify(log.newValues, null, 2) : "NULL"}
                                    </pre>
                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
