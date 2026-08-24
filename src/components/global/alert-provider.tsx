"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, Info, CheckCircle2, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertType = "info" | "success" | "error" | "warning";

interface AlertOptions {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  type?: AlertType;
}

interface AlertState {
  isOpen: boolean;
  message: string;
  title: string;
  type: AlertType;
  onConfirm?: () => void;
  onCancel?: () => void;
  isConfirm: boolean;
}

interface AlertContextType {
  showAlert: (message: string, options?: AlertOptions) => void;
  showConfirm: (message: string, options?: AlertOptions) => Promise<boolean>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AlertState>({
    isOpen: false,
    message: "",
    title: "",
    type: "info",
    isConfirm: false,
  });

  const showAlert = useCallback((message: string, options?: AlertOptions) => {
    setState({
      isOpen: true,
      message,
      title: options?.title || "System Alert",
      type: options?.type || "info",
      isConfirm: false,
    });
  }, []);

  const showConfirm = useCallback((message: string, options?: AlertOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        message,
        title: options?.title || "Verification Required",
        type: options?.type || "warning",
        isConfirm: true,
        onConfirm: () => {
          setState((prev) => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setState((prev) => ({ ...prev, isOpen: false }));
          resolve(false);
        },
      });
    });
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <AnimatePresence>
        {state.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={state.onCancel || (() => setState((prev) => ({ ...prev, isOpen: false })))}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden shadow-2xl"
            >
              {/* Scanline Effect */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] z-10" />

              <div className="p-1 bg-white/5 border-b border-white/10 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  {state.type === "error" && <ShieldAlert size={12} className="text-red-500" />}
                  {state.type === "success" && <CheckCircle2 size={12} className="text-emerald-500" />}
                  {state.type === "warning" && <AlertCircle size={12} className="text-amber-500" />}
                  {state.type === "info" && <Info size={12} className="text-blue-500" />}
                  <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/40">
                    {state.title}
                  </span>
                </div>
                <button
                  onClick={state.onCancel || (() => setState((prev) => ({ ...prev, isOpen: false })))}
                  className="p-1 hover:bg-white/5 text-white/20 hover:text-white transition-all"
                >
                  <X size={12} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <p className="text-[12px] font-mono text-white/80 leading-relaxed uppercase tracking-wider">
                      {state.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  {state.isConfirm ? (
                    <>
                      <button
                        onClick={state.onConfirm}
                        className="flex-1 bg-white text-black py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-scarab-gold transition-all rounded-sm shadow-lg shadow-white/5"
                      >
                        Execute
                      </button>
                      <button
                        onClick={state.onCancel}
                        className="flex-1 bg-white/5 text-white/40 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all rounded-sm border border-white/5"
                      >
                        Abort
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setState((prev) => ({ ...prev, isOpen: false }))}
                      className="w-full bg-white text-black py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-scarab-gold transition-all rounded-sm"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>

              {/* Status bar */}
              <div className="h-1 bg-white/5 w-full overflow-hidden">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="h-full w-1/3 bg-white/20 blur-sm"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
