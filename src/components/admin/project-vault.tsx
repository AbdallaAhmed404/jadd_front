"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  X,
  Plus,
  Trash2,
  Globe,
  User,
  Lock,
  Eye,
  EyeOff,
  ExternalLink,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Project, ProjectMetadata } from "@/src/types/backend";
import { useAlert } from "@/src/components/global/alert-provider";

export default function ProjectVault({
  project,
  onClose
}: {
  project: Project,
  onClose: () => void
}) {
  const { showAlert, showConfirm } = useAlert();
  const [metadata, setMetadata] = useState<ProjectMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [decryptedPasswords, setDecryptedPasswords] = useState<Record<number, string>>({});

  async function loadMetadata() {
    setIsLoading(true);
    console.log("VAULT_ACCESS: Loading metadata for project", project.id);
    // STUB: Return empty for decoupled mode.
    setMetadata([]);
    setIsLoading(false);
  }

  useEffect(() => {
    loadMetadata();
  }, [project.id]);

  const handleReveal = async (id: number, encryptedPayload: string) => {
    if (decryptedPasswords[id]) {
      setDecryptedPasswords(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }

    console.log("DECRYPTION_REQUEST: Decoupled mode, showing mock password.");
    setDecryptedPasswords(prev => ({ ...prev, [id]: "MOCK_PASSWORD_DECOUPLED" }));
  };

  const handleDelete = async (id: number) => {
    const confirmed = await showConfirm("PROTOCOL_WARNING: Permanently purge these credentials?", {
      title: "Security Purge",
      type: "error"
    });

    if (confirmed) {
      console.log("PURGE_CREDENTIALS:", id);
      setMetadata(prev => prev.filter(m => m.id !== id));
      showAlert("Credential node purged from the vault.", { type: "success" });
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/95 backdrop-blur-xl"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-[#080808] border border-white/10 w-full max-w-4xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
      >
        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-scarab-gold/10 border border-scarab-gold/20 rounded-sm">
              <Shield className="text-scarab-gold" size={20} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">
                Vault.
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white transition-colors p-2">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-20">
              <RefreshCw className="animate-spin" size={24} />
              <span className="text-[10px] font-mono uppercase tracking-widest text-white">Initializing...</span>
            </div>
          ) : metadata.length === 0 && !isAdding ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/5 rounded-sm bg-white/[0.01]">
              <Lock size={32} className="text-white/10 mb-4" />
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20">No credentials found.</p>
              <button
                onClick={() => setIsAdding(true)}
                className="mt-6 px-6 py-2 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-white/40 hover:text-white hover:border-white/40 transition-all"
              >
                Add Credentials
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {metadata.map((entry) => (
                <motion.div
                  layout
                  key={entry.id}
                  className="bg-white/[0.02] border border-white/5 p-6 space-y-6 group hover:border-white/10 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className={cn(
                      "px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border rounded-sm",
                      entry.environment === "Production" ? "bg-rose-500/5 border-rose-500/20 text-rose-500" : "bg-blue-500/5 border-blue-500/20 text-blue-500"
                    )}>
                      {entry.environment}
                    </div>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-white/10 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {entry.url && (
                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] font-mono uppercase tracking-widest text-white/20">URL</label>
                        <div className="flex items-center justify-between group/link">
                          <span className="text-[11px] font-mono text-white/80 truncate pr-4">{entry.url}</span>
                          <a href={entry.url} target="_blank" rel="noopener noreferrer" className="text-white/10 group-hover/link:text-scarab-gold transition-colors">
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] font-mono uppercase tracking-widest text-white/20">Username</label>
                        <div className="flex items-center gap-2">
                          <User size={10} className="text-white/20" />
                          <span className="text-[11px] font-mono text-white/80 truncate">{entry.username || "ANONYMOUS"}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] font-mono uppercase tracking-widest text-white/20">Password</label>
                        <div className="flex items-center justify-between bg-black/40 px-2 py-1 border border-white/5 rounded-sm">
                          <span className={cn(
                            "text-[11px] font-mono tracking-widest",
                            decryptedPasswords[entry.id] ? "text-emerald-500" : "text-white/20"
                          )}>
                            {decryptedPasswords[entry.id] || "••••••••"}
                          </span>
                          {entry.password && (
                            <button
                              onClick={() => handleReveal(entry.id, entry.password!)}
                              className="text-white/20 hover:text-white transition-colors"
                            >
                              {decryptedPasswords[entry.id] ? <EyeOff size={10} /> : <Eye size={10} />}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {entry.notes && (
                    <div className="pt-4 border-t border-white/5">
                      <p className="text-[9px] font-mono text-white/30 leading-relaxed italic line-clamp-2">
                        {entry.notes}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}

              {!isAdding && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="flex flex-col items-center justify-center gap-4 bg-white/[0.01] border border-dashed border-white/5 p-6 hover:bg-white/[0.02] hover:border-white/10 transition-all text-white/20 hover:text-white/40 group"
                >
                  <Plus size={24} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-mono uppercase tracking-widest">Authorize_New_Node</span>
                </button>
              )}
            </div>
          )}

          <AnimatePresence>
            {isAdding && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white/[0.03] border border-white/10 p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Initialize_Credential_Node</h3>
                    <button onClick={() => setIsAdding(false)} className="text-white/20 hover:text-white"><X size={14} /></button>
                  </div>

                  <form className="grid grid-cols-2 gap-6" onSubmit={async (e) => {
                    e.preventDefault();
                    setIsPending(true);
                    const fd = new FormData(e.currentTarget);
                    const data = {
                      projectId: project.id,
                      environment: fd.get("environment") as string,
                      url: fd.get("url") as string,
                      username: fd.get("username") as string,
                      password: fd.get("password") as string,
                      notes: fd.get("notes") as string,
                    };
                    console.log("CREATE_VAULT_ENTRY:", data);
                    showAlert("Credential node initialized in vault memory.", { type: "success" });
                    setIsAdding(false);
                    setIsPending(false);
                  }}>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono uppercase tracking-widest text-white/20 ml-1">Environment</label>
                        <select name="environment" required className="w-full bg-black border border-white/10 px-4 py-2.5 text-[10px] font-mono text-white focus:border-white/40 outline-none transition-all">
                          <option value="Staging" className="bg-black">Staging</option>
                          <option value="Production" className="bg-black">Production</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono uppercase tracking-widest text-white/20 ml-1">URL</label>
                        <input name="url" placeholder="https://..." className="w-full bg-black border border-white/10 px-4 py-2.5 text-[10px] font-mono text-white focus:border-white/40 outline-none transition-all" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono uppercase tracking-widest text-white/20 ml-1">Username</label>
                        <input name="username" placeholder="admin" className="w-full bg-black border border-white/10 px-4 py-2.5 text-[10px] font-mono text-white focus:border-white/40 outline-none transition-all" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono uppercase tracking-widest text-white/20 ml-1">Password</label>
                        <input type="password" name="password" placeholder="••••••••" className="w-full bg-black border border-white/10 px-4 py-2.5 text-[10px] font-mono text-white focus:border-white/40 outline-none transition-all" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono uppercase tracking-widest text-white/20 ml-1">Notes</label>
                        <textarea name="notes" rows={4} placeholder="Protocol notes..." className="w-full bg-black border border-white/10 px-4 py-2.5 text-[10px] font-mono text-white focus:border-white/40 outline-none transition-all resize-none" />
                      </div>
                    </div>
                    <div className="col-span-2 pt-4">
                      <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-white text-black py-4 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-scarab-gold transition-all rounded-sm disabled:opacity-50"
                      >
                        {isPending ? "SECURING_NODE..." : "Deploy_Credential_Protocol"}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-8 border-t border-white/10 bg-black/40 flex justify-between items-center">
          <div className="flex items-center gap-3 text-emerald-500/40">
            <Shield size={14} />
            <span className="text-[8px] font-mono uppercase tracking-widest">Encrypted</span>
          </div>
          <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Access: Admin</span>
        </div>
      </motion.div>
    </div>
  );
}
