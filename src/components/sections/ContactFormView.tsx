"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface ContactFormData {
  name: string;
  email: string;
  subject: string; // Added subject for package indexing
  message: string;
  access_token?: string;
}

// Separate component for the form content to handle Suspense (Next.js requirement for useSearchParams)
function FormFields() {
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<ContactFormData>();

  useEffect(() => {
    const pkgName = searchParams.get("name");
    const pkgId = searchParams.get("id");

    if (pkgName && pkgId) {
      setValue("subject", `INQUIRY: ${pkgName} PACKAGE (${pkgId})`);
      setValue(
        "message",
        `I would like to initialize the ${pkgName} package for my project. Please provide the technical onboarding roadmap.`,
      );
    }
  }, [searchParams, setValue]);

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    const currentTime = new Date().getTime();
    const lastSent =
      typeof window !== "undefined"
        ? localStorage.getItem("scarabix_sent_ts")
        : null;
    const COOLDOWN = 24 * 60 * 60 * 1000;

    if (lastSent && currentTime - parseInt(lastSent) < COOLDOWN) {
      setServerError("SYSTEM PROTOCOL: ONE TRANSMISSION AUTHORIZED PER 24H.");
      return;
    }

    try {
      setServerError(null);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("scarabix_sent_ts", currentTime.toString());
        reset();
      } else {
        setServerError(result.message || "Transmission Failed");
      }
    } catch (error) {
      setServerError("Protocol Error: Connection Failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2"
    >
      <input
        type="text"
        {...register("access_token")}
        tabIndex={-1}
        autoComplete="off"
        className="absolute opacity-0 -z-10 h-0 w-0 pointer-events-none"
      />

      {/* Box 01: Name */}
      <div className="border border-foreground/10 p-10 group bg-foreground/1 focus-within:bg-foreground/3 transition-colors">
        <label className="block text-[10px] font-bold uppercase tracking-widest mb-8 opacity-40 group-focus-within:opacity-100 group-focus-within:text-scarab-gold">
          01 / Identify
        </label>
        <input
          {...register("name", { required: true })}
          placeholder="Collaborator name"
          className="w-full bg-transparent text-2xl font-bold tracking-tight outline-none italic placeholder:text-foreground/30 text-foreground capitalize"
        />
      </div>

      {/* Box 02: Email */}
      <div className="border border-foreground/10 md:border-l-0 p-10 group bg-foreground/1 focus-within:bg-foreground/3 transition-colors">
        <label className="block text-[10px] font-bold uppercase tracking-widest mb-8 opacity-40 group-focus-within:opacity-100 group-focus-within:text-scarab-gold">
          02 / Email
        </label>
        <input
          {...register("email", { required: true })}
          type="email"
          placeholder="reach@example.com"
          className="w-full bg-transparent text-2xl tracking-tight outline-none italic placeholder:text-foreground/30 text-foreground lowercase"
        />
      </div>

      {/* Box 03: Subject (This fills with Package Info) */}
      <div className="md:col-span-2 border border-foreground/10 border-t-0 p-10 group bg-foreground/1 focus-within:bg-foreground/3 transition-colors">
        <label className="block text-[10px] font-bold uppercase tracking-widest mb-8 opacity-40 group-focus-within:opacity-100 group-focus-within:text-scarab-gold">
          03 / Objective
        </label>
        <input
          {...register("subject", { required: true })}
          placeholder="Project intent or package selection"
          className="w-full bg-transparent text-2xl font-black italic tracking-tighter outline-none placeholder:text-foreground/30 text-scarab-gold uppercase"
        />
      </div>

      {/* Box 04: Message */}
      <div className="md:col-span-2 border border-foreground/10 border-t-0 p-10 group bg-foreground/1 focus-within:bg-foreground/3 transition-colors">
        <label className="block text-[10px] font-bold uppercase tracking-widest mb-8 opacity-40 group-focus-within:opacity-100 group-focus-within:text-scarab-gold">
          04 / The Vision
        </label>
        <textarea
          {...register("message", { required: true })}
          rows={6}
          placeholder="Tell us about the project parameters..."
          className="w-full bg-transparent text-2xl tracking-tight outline-none placeholder:text-foreground/30 text-foreground resize-none"
        />
      </div>

      {/* SUBMISSION STRIP */}
      <div className="md:col-span-2 border border-foreground/10 border-t-0 flex flex-col md:flex-row items-stretch">
        <div className="flex-1 p-10 flex items-center border-b md:border-b-0 md:border-r border-foreground/10 bg-foreground/1">
          {isSubmitSuccessful ? (
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-scarab-gold rounded-full animate-pulse" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-scarab-gold">
                Success: Protocol Complete. Inquiry Indexed.
              </p>
            </div>
          ) : serverError ? (
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">
              {serverError}
            </p>
          ) : (
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
              Avg. response time: 24-48 hours / UTC+2
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isSubmitSuccessful}
          className={`group flex-1 p-10 flex items-center justify-between transition-all duration-700 ${isSubmitSuccessful ? "bg-scarab-gold text-black cursor-default" : "bg-foreground text-background hover:bg-scarab-gold hover:text-black"}`}
        >
          <span className="text-xl font-black uppercase tracking-[0.3em]">
            {isSubmitting
              ? "Processing"
              : isSubmitSuccessful
                ? "Sent"
                : "Send Message"}
          </span>
          <div
            className={`w-12 h-12 rounded-full border border-current/20 flex items-center justify-center transition-all duration-500 ${isSubmitting ? "animate-spin" : "group-hover:rotate-45"}`}
          >
            {isSubmitSuccessful ? (
              <Check size={24} strokeWidth={3} />
            ) : isSubmitting ? (
              <Loader2 size={24} />
            ) : (
              <ArrowUpRight size={24} />
            )}
          </div>
        </button>
      </div>
    </form>
  );
}

export default function ContactFormView() {
  return (
    <section className="min-h-screen bg-background text-foreground font-linseed pt-40 pb-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-foreground pb-8 mb-12 gap-8">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-scarab-gold">
              Inquiry
            </span>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">
              CONTACT<span className="text-scarab-gold">.</span>
            </h1>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-widest opacity-60 max-w-60 md:text-right">
            Based in Cairo. Operating globally.
          </p>
        </div>

        {/* Wrap in Suspense to satisfy Next.js CSR requirements for useSearchParams */}
        <Suspense
          fallback={
            <div className="text-scarab-gold opacity-50 uppercase text-[10px] tracking-widest">
              Initializing Terminal...
            </div>
          }
        >
          <FormFields />
        </Suspense>

        <div className="mt-12 flex justify-between items-center opacity-40 text-[9px] font-bold uppercase tracking-[0.5em]">
          <span>Cairo, Egypt</span>
          <span>
            <span className="text-scarab-gold">&copy;</span> 2026 Scarabix
          </span>
          <span>30.04° N, 31.23° E</span>
        </div>
      </div>
    </section>
  );
}
