"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Cpu, Code2, Layout, Database, ArrowDownRight } from "lucide-react";

const team = [
  {
    name: "Hosnie",
    id: "ENG-01",
    role: "Founder // Lead Technical Engineer",
    specialty: "Full Stack • Next.js • UI/UX",
    icon: <Layout size={24} />,
    image: "/images/team/Hosnie.jpeg",
    isFounder: true,
  },
  {
    name: "Omar",
    id: "CRT-02",
    role: "Co-Founder // Creative Director",
    specialty: "Brand Identity • Strategy",
    icon: <Code2 size={24} />,
    image: "/images/team/Omar.jpeg",
  },
  {
    name: "Moataz",
    id: "DATA-03",
    role: "Co-Founder // Data Engineer",
    specialty: "PostgreSQL • Infrastructure",
    icon: <Database size={24} />,
    image: "/images/team/Moataz.jpeg",
  },
  {
    name: "Abdallah",
    id: "LOGIC-04",
    role: "Co-Founder // Backend Developer",
    specialty: "Node.js • API Architecture",
    icon: <Cpu size={24} />,
    image: "/images/team/Abdallah.jpeg",
  },
];

export default function Tribe() {
  const [activeMember, setActiveMember] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setActiveMember(activeMember === index ? null : index);
  };

  return (
    <section
      id="tribe"
      className="py-32 md:py-48 bg-background text-foreground font-linseed selection:bg-scarab-gold selection:text-black transition-colors duration-500 overflow-hidden relative"
    >
      {/* BACKGROUND DECOR */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none bg-[radial-gradient(#e9b949_1px,transparent_1px)] bg-size-[60px_60px]" />

      <div className="container mx-auto px-6 max-w-350 relative z-10">
        {/* STORY SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-40">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-scarab-gold" />
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-scarab-gold">
                  Sons of the First Engineers.
                </span>
              </div>

              <h2 className="text-5xl md:text-[8rem] font-black uppercase leading-[0.9] md:leading-[0.8] italic">
                BORN FROM <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-foreground via-scarab-gold to-foreground">
                  THE DUST.
                </span>
              </h2>

              <p className="text-lg md:text-xl text-foreground/70 leading-relaxed max-w-2xl font-medium italic">
                We are Egyptians. We build because permanence is in our
                architecture. We transformed the impossible into the eternal for
                millennia; now, we inscribe digital monuments into the fabric of
                the web.
              </p>
            </motion.div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-end space-y-6">
            <div className="p-8 border border-foreground/10 bg-foreground/3 rounded-sm backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 text-scarab-gold">
                Our Manifesto
              </p>
              <p className="text-sm leading-relaxed text-foreground/60 font-medium">
                In the shadow of the pyramids, we learned that true architecture
                survives the sands of time. Scarabix was founded to bring that
                same obsession with permanence to the modern code stack. From
                Cairo to the world, we are the New Architects.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION BREAK */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-12 bg-scarab-gold" />
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-scarab-gold">
            Node Architecture.
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-12 md:mb-20">
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] md:leading-[0.8] italic text-foreground">
            THE MONOLITHS<span className="text-scarab-gold">.</span>
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-foreground/50 max-w-xs md:max-w-70 leading-relaxed">
            Four discrete nodes. <br className="hidden md:block" />
            One synchronized architecture.
          </p>
        </div>

        {/* TEAM GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {team.map((member, index) => {
            const isTapped = activeMember === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className="group relative cursor-pointer"
                onClick={() => handleToggle(index)}
              >
                <div
                  className={`relative aspect-4/5 md:aspect-2/3 overflow-hidden rounded-sm bg-foreground/5 transition-all duration-700 ${member.isFounder
                    ? "border-2 border-scarab-gold shadow-[0_0_30px_rgba(233,185,73,0.15)]"
                    : "border border-foreground/10"
                    }`}
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className={`object-cover transition-transform duration-1000 group-hover:scale-105 ${isTapped ? "grayscale-0 scale-105" : ""}`}
                  />

                  <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none" />

                  {/* DEFAULT STATE NAME */}
                  <div
                    className={`absolute bottom-0 left-0 w-full p-8 transition-all duration-500 ${isTapped ? "opacity-0 -translate-y-4" : "opacity-100 group-hover:-translate-y-4 group-hover:opacity-0"}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[8px] font-mono font-bold tracking-[0.3em] text-scarab-gold bg-black/50 px-2 py-0.5 rounded-sm">
                        {member.id}
                      </span>
                    </div>
                    <h3
                      className={`text-3xl font-black uppercase tracking-tighter leading-none italic ${member.isFounder ? "text-scarab-gold" : "text-white"}`}
                    >
                      {member.name}
                    </h3>
                  </div>

                  {/* HOVER / TAB PANEL */}
                  <div
                    className={`absolute inset-0 bg-zinc-950/95 backdrop-blur-xl p-8 flex flex-col justify-between transition-transform duration-700 ease-[0.16,1,0.3,1] border-t border-white/10 ${isTapped ? "translate-y-0" : "translate-y-full group-hover:translate-y-0"}`}
                  >
                    <div className="space-y-6">
                      <div
                        className={`w-12 h-12 rounded-sm flex items-center justify-center ${member.isFounder ? "bg-scarab-gold text-black shadow-[0_0_20px_rgba(233,185,73,0.4)]" : "bg-white/10 text-scarab-gold"}`}
                      >
                        {member.icon}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h4 className="text-2xl font-black uppercase tracking-tighter italic text-white">
                            {member.name}
                          </h4>
                          {member.isFounder && (
                            <span className="px-2 py-1 bg-scarab-gold text-black text-[7px] font-black uppercase tracking-widest rounded-sm">
                              FOUNDER
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-scarab-gold italic">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-6 flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[8px] font-bold uppercase tracking-widest text-white/40">
                          Architecture Spec
                        </p>
                        <p className="text-sm font-bold uppercase tracking-tight text-white">
                          {member.specialty}
                        </p>
                      </div>
                      <ArrowDownRight size={24} className="text-scarab-gold" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="mt-32 pt-12 border-t border-foreground/10 flex justify-center text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.6em] text-foreground/40">
            Legacy is in the Blood. Crafted in Cairo.
          </p>
        </div>
      </div>
    </section>
  );
}
