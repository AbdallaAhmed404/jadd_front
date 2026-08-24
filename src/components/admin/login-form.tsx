"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Logo from "@/src/components/global/logo";

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
    console.log("AUTHENTICATION_SEQUENCE: Initializing for", data.username);
    
    // STUB: For decoupled frontend development, we simulate a successful login.
    setTimeout(() => {
        router.push("/admin");
    }, 800);
  };

  return (
    <div className="w-full max-w-sm">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="flex flex-col space-y-8"
      >

        <div className="flex flex-col items-center text-center space-y-6">
          <Logo className="w-24 h-24 md:w-32 md:h-32 mb-2" />
          <div className="space-y-2">
            <h1 className="text-2xl font-medium tracking-tight text-white">
              Command Center
            </h1>
            <p className="text-xs text-white/40 font-mono uppercase tracking-[0.2em]">
              Identity Verification Required
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 p-3 text-[10px] text-red-500 font-mono uppercase tracking-widest text-center"
            >
              Error: {serverError}
            </motion.div>
          )}
          <div className="space-y-1">
            <input
              {...register("username", { required: true })}
              type="text"
              placeholder="Username"
              className={cn(
                "w-full bg-white/3 border border-white/10 py-3 px-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/30 focus:bg-white/5 transition-all duration-300 rounded-sm",
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
            className="w-full bg-white text-black py-3 text-sm font-semibold rounded-sm flex items-center justify-center gap-2 hover:bg-scarab-gold transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed group"
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

        <div className="flex justify-center pt-4">
          <div className="text-[10px] text-white/20 font-mono uppercase tracking-widest border-t border-white/5 pt-4 w-full text-center">
            Secured by Scarabix Protocol // 2026
          </div>
        </div>
      </motion.div>
    </div>
  );
}
