"use client";

import React, { useState } from "react";
import {
  UserPlus,
  Search,
  Trash2,
  X,
  Mail,
  Briefcase,
  Activity,
  ChevronRight,
  ShieldAlert,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TeamMember, UserRole } from "@/src/types/backend";
import Link from "next/link";
import { useAlert } from "@/src/components/global/alert-provider";

export default function TeamRegistry({ initialMembers }: { initialMembers: TeamMember[] }) {
  const { showAlert, showConfirm } = useAlert();
  const [members, setMembers] = useState(initialMembers);
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = members.filter(m =>
    m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    const confirmed = await showConfirm("ARCHIVE_MEMBER: Confirm permanent removal from active directory?", {
      title: "Critical Authorization",
      type: "error"
    });

    if (confirmed) {
      console.log("DELETE_MEMBER:", id);
      setMembers(prev => prev.filter(m => m.id !== id));
      showAlert("Member purged from operational registry.", { type: "success" });
    }
  };

  const handleRestrict = async (id: number) => {
    const confirmed = await showConfirm("RESTRICT_ACCESS: Suspend this user's administrative privileges?", {
      title: "Security Override",
      type: "warning"
    });

    if (confirmed) {
      console.log("SECURITY_OVERRIDE: Restricting user", id);
      setMembers(prev => prev.map(m => m.id === id ? { ...m, status: "BANNED" } : m));
      showAlert("User status updated to restricted.", { type: "info" });
    }
  };

  const handleUnrestrict = async (id: number) => {
    const confirmed = await showConfirm("RESTORE_ACCESS: Reactivate this user's administrative privileges?", {
      title: "Access Restoration",
      type: "info"
    });

    if (confirmed) {
      console.log("ACCESS_RESTORED: Unrestricting user", id);
      setMembers(prev => prev.map(m => m.id === id ? { ...m, status: "ACTIVE" } : m));
      showAlert("User access rights restored.", { type: "success" });
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* ... header ... */}
      <section className="p-10 border-b border-white/10 bg-black flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight text-white uppercase">
            Team.
          </h1>
          <div className="flex items-center gap-6 mt-2">
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Active</span>
              <span className="text-[12px] font-bold text-emerald-500 font-mono">
                {members.filter(m => m.isActive && m.status !== "BANNED").length} MEMBERS
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center gap-3 px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-scarab-gold transition-all rounded-sm"
        >
          <UserPlus size={14} strokeWidth={3} />
          Add Member
        </button>
      </section>

      <div className="p-8">
        <div className="admin-panel">
          <div className="p-6 border-b border-white/10 bg-white/[0.01]">
            <div className="relative max-w-md">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-black border border-white/10 rounded-sm py-2.5 pl-10 pr-4 text-[10px] font-mono uppercase tracking-[0.2em] focus:border-white/40 transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] text-white/40 text-[9px] font-mono uppercase tracking-[0.3em] border-b border-white/10">
                  <th className="px-8 py-5 font-medium w-24">ID</th>
                  <th className="px-8 py-5 font-medium">Name</th>
                  <th className="px-8 py-5 font-medium">Email</th>
                  <th className="px-8 py-5 font-medium">Role</th>
                  <th className="px-8 py-5 font-medium">Status</th>
                  <th className="px-8 py-5 font-medium">Created</th>
                  <th className="px-8 py-5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filtered.map((member) => (
                  <tr key={member.id} className={cn(
                    "interactive-node group",
                    member.status === "BANNED" && "opacity-50"
                  )}>
                    <td className="px-8 py-6 font-mono text-[10px] text-white/20 uppercase tracking-widest">
                      #{member.id.toString().padStart(4, '0')}
                    </td>
                    <td className="px-8 py-6 text-[12px] font-black uppercase tracking-wider text-white/90">
                      {member.fullName}
                    </td>
                    <td className="px-8 py-6 text-[10px] font-mono text-white/30">
                      {member.email}
                    </td>
                    <td className="px-8 py-6 text-[11px] font-medium uppercase tracking-widest text-white/60">
                      {member.role}
                    </td>
                    <td className="px-8 py-6">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest",
                        member.status === "BANNED" ? "bg-rose-500/5 border-rose-500/20 text-rose-500" :
                          member.isActive ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500" :
                            "bg-white/5 border-white/10 text-white/40"
                      )}>
                        <Activity size={8} />
                        {member.status === "BANNED" ? "BANNED" : member.isActive ? "ACTIVE" : "INACTIVE"}
                      </div>
                    </td>
                    <td className="px-8 py-6 font-mono text-[9px] text-white/20 uppercase">
                      {new Date(member.createdAt).toISOString().split('T')[0]}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {member.status === "BANNED" ? (
                          <button
                            onClick={() => handleUnrestrict(member.id)}
                            className="p-2 text-white/10 hover:text-emerald-500 hover:bg-emerald-500/5 transition-all opacity-0 group-hover:opacity-100"
                            title="Restore_Access"
                          >
                            <ShieldCheck size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRestrict(member.id)}
                            className="p-2 text-white/10 hover:text-rose-500 hover:bg-rose-500/5 transition-all opacity-0 group-hover:opacity-100"
                            title="Restrict_Access"
                          >
                            <ShieldAlert size={14} />
                          </button>
                        )}

                        <Link
                          href={`/admin/team/${member.id}`}
                          className="p-2 text-white/20 hover:text-white hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <ChevronRight size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="p-2 text-white/10 hover:text-red-400 hover:bg-red-500/5 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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
                    <UserPlus className="text-scarab-gold" size={24} />
                    Add Member
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
                    fullName: fd.get("fullName") as string,
                    email: fd.get("email") as string,
                    username: fd.get("username") as string,
                    password: fd.get("password") as string || undefined,
                    role: fd.get("role") as UserRole,
                    isActive: fd.get("isActive") === "true"
                  };

                  console.log("CREATE_TEAM_MEMBER:", data);
                  const newMember = { 
                      id: Math.floor(Math.random() * 10000), 
                      ...data, 
                      createdAt: new Date().toISOString() 
                  } as unknown as TeamMember;
                  setMembers(prev => [newMember, ...prev]);
                  setIsAdding(false);
                  showAlert("New personnel registered successfully.", { type: "success" });
                } catch (err) {
                  showAlert("Protocol failure: Data injection aborted.", { type: "error" });
                } finally {
                  setIsPending(false);
                }
              }}>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/40 ml-1">Full Name</label>
                  <input name="fullName" required className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-[11px] font-mono text-white focus:border-white/40 outline-none transition-all rounded-sm" />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/40 ml-1">Email</label>
                  <input type="email" name="email" required className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-[11px] font-mono text-white focus:border-white/40 outline-none transition-all rounded-sm" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/40 ml-1">Username</label>
                    <input name="username" required className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-[11px] font-mono text-white focus:border-white/40 outline-none transition-all rounded-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/40 ml-1">Password</label>
                    <input type="password" name="password" placeholder="••••••••" className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-[11px] font-mono text-white focus:border-white/40 outline-none transition-all rounded-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/40 ml-1">Role</label>
                    <select name="role" className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-[11px] font-mono text-white focus:border-white/40 outline-none transition-all rounded-sm appearance-none cursor-pointer">
                      <option value="ADMIN" className="bg-black">ADMIN</option>
                      <option value="SUPERADMIN" className="bg-black">SUPERADMIN</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/40 ml-1">Status</label>
                    <select name="isActive" className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-[11px] font-mono text-white focus:border-white/40 outline-none transition-all rounded-sm appearance-none cursor-pointer">
                      <option value="true" className="bg-black">ACTIVE</option>
                      <option value="false" className="bg-black">INACTIVE</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 bg-white text-black py-4 text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-scarab-gold transition-all rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? "SYNCHRONIZING..." : "Add Member"}
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
