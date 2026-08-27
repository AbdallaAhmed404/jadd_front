"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface LoginFormValues {
  username: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const [serverError, setServerError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.username,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      // تخزين التوكن بالاسم الجديد المطلوب
      localStorage.setItem("jadd-admin-token", result.token);

      router.push("/admin");
    } catch (error: any) {
      setServerError(error.message || "Failed to connect to server");
    }
  };

  return (
    <div className="w-full max-w-sm">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="flex flex-col space-y-8"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 p-3 text-[10px] text-red-500 font-mono uppercase tracking-widest text-center rounded-sm"
            >
              Error: {serverError}
            </motion.div>
          )}
          <div className="space-y-1">
            <input
              {...register("username", { required: true })}
              type="text"
              placeholder="Email / Username"
              className={cn(
                "w-full bg-white/[0.03] border border-white/10 py-3 px-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/30 focus:bg-white/5 transition-all duration-300 rounded-sm",
                errors.username && "border-red-900/50"
              )}
            />
          </div>

          <div className="space-y-1 relative group/pass">
            <input
              {...register("password", { required: true })}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={cn(
                "w-full bg-white/[0.03] border border-white/10 py-3 pl-4 pr-12 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/30 focus:bg-white/5 transition-all duration-300 rounded-sm",
                errors.password && "border-red-900/50"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-white text-black py-3 text-sm font-semibold rounded-sm flex items-center justify-center gap-2 hover:bg-[#D4AF37] transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}