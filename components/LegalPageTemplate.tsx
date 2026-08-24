"use client";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface Section {
  id: string;
  title: string;
  content: string;
  href?: string;
}

export default function LegalPageTemplate({
  title,
  sections,
}: {
  title: string;
  sections: Section[];
}) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 pt-44 md:pt-52 pb-24 selection:bg-scarab-gold selection:text-black font-linseed overflow-hidden relative">
      <div className="absolute top-0 right-0 w-125 h-125 bg-scarab-gold/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[radial-gradient(#e9b949_1px,transparent_1px)] bg-size-[40px_40px]" />

      <div className="mx-auto max-w-6xl px-6 lg:px-12 relative z-10">
        <header className="mb-20 md:mb-32 border-l border-scarab-gold/30 pl-6 md:pl-12 relative">
          <div className="absolute top-0 -left-px w-px h-full bg-linear-to-b from-scarab-gold via-scarab-gold/40 to-transparent" />
          <div className="flex flex-col items-start gap-10 md:gap-12">
            <Link
              href="/#services"
              className="group inline-flex items-center gap-4 transition-all"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:border-scarab-gold group-hover:bg-scarab-gold transition-all duration-500">
                <ArrowLeft
                  size={18}
                  strokeWidth={2.5}
                  className="text-black/70 dark:text-white/70 group-hover:text-black transition-colors"
                />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-30 group-hover:opacity-100 dark:group-hover:text-scarab-gold transition-opacity">
                Return to Home
              </span>
            </Link>

            <div className="space-y-6 w-full">
              <h1 className="text-4xl sm:text-6xl md:text-9xl font-black uppercase tracking-tighter italic leading-[0.9] wrap-break-word">
                {title}
                <span className="text-scarab-gold">.</span>
              </h1>

              <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 opacity-50">
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">
                  Updated April 2026
                </span>
                <span className="hidden sm:block w-1 h-1 rounded-full bg-scarab-gold" />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">
                  Cairo // Egypt
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col border-t border-foreground/10">
          {sections.map((section, index) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className="group grid grid-cols-1 md:grid-cols-12 gap-6 py-16 border-b border-foreground/10 hover:bg-foreground/2 transition-colors duration-500 relative"
            >
              <div className="md:col-span-2 flex items-start md:pl-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-scarab-gold tracking-[0.5em] mb-2">
                    {section.id}
                  </span>
                  <div className="h-px w-6 bg-scarab-gold" />
                </div>
              </div>

              <div className="md:col-span-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {section.href ? (
                  <Link
                    href={section.href}
                    className="block group/link -ml-4 pl-4 border-l-2 border-transparent hover:border-scarab-gold transition-all duration-300"
                  >
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic flex items-center gap-3 transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:text-scarab-gold">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: section.title.replace(
                            /Support|Packages|Buyout/i,
                            (match) =>
                              `<span class="text-scarab-gold decoration-scarab-gold decoration-2 underline-offset-4 underline">${match}</span>`,
                          ),
                        }}
                      />

                      <div className="w-9 h-9 shrink-0 rounded-full border border-scarab-gold/30 bg-scarab-gold/5 flex items-center justify-center transition-all duration-300 group-hover/link:bg-scarab-gold group-hover/link:border-scarab-gold">
                        <ArrowUpRight
                          size={20}
                          strokeWidth={3}
                          className="text-scarab-gold transition-all duration-300 group-hover/link:text-black group-hover/link:scale-110"
                        />
                      </div>
                    </h2>
                  </Link>
                ) : (
                  <h2 className="text-3xl font-black uppercase tracking-tighter italic group-hover:text-scarab-gold transition-colors duration-300">
                    {section.title}
                  </h2>
                )}

                <p className="text-md leading-relaxed text-foreground/70 font-medium italic lg:pt-1">
                  {section.content}
                </p>
              </div>

              <div className="absolute left-0 top-0 bottom-0 w-1 bg-scarab-gold scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
            </motion.section>
          ))}
        </div>

        <footer className="mt-40 pt-16 flex flex-col md:flex-row justify-between items-end gap-12 border-t border-foreground/10">
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="text-3xl font-black italic uppercase tracking-tighter">
                Scarabix <span className="text-scarab-gold">Agency.</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40">
                Code and Craft Architecture
              </span>
            </div>
          </div>

          <Link href="/contact" className="group flex flex-col items-end gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-foreground/50 group-hover:text-scarab-gold transition-colors">
              Legal Support
            </span>
            <div className="flex items-center gap-6">
              <span className="text-lg font-light italic tracking-tight text-foreground/80 group-hover:text-foreground transition-opacity">
                scarabix.homa@gmail.com
              </span>
              <div className="w-12 h-12 rounded-full border border-foreground/20 flex items-center justify-center group-hover:bg-scarab-gold group-hover:border-scarab-gold group-hover:text-background group-hover:rotate-45 transition-all duration-500">
                <ArrowUpRight size={20} />
              </div>
            </div>
          </Link>
        </footer>
      </div>
    </div>
  );
}
