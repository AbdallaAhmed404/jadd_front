"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function MonolithLoader() {
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
        document.body.classList.add("loading-monolith");

        const timer = setTimeout(() => {
            setLoading(false);
            document.body.classList.remove("loading-monolith");

            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
        }, 2000);

        return () => {
            clearTimeout(timer);
            document.body.classList.remove("loading-monolith");
        };
    }, []);

    if (!mounted) return null;

    // تم تعديل المسارات هنا لتطابق شعار JADD الجديد مباشرة في مجلد public
    const logoSrc = resolvedTheme === "dark" ? "/logo-black.png" : "/logo-light.png";

    return (
        <AnimatePresence mode="wait">
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 1.05,
                        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                    }}
                    className="fixed inset-0 z-9999 bg-background flex items-center justify-center overflow-hidden pointer-events-auto"
                >
                    {/* Your existing Symmetric Assembly Animation */}
                    <div className="relative w-72 h-24 md:w-125 md:h-32">
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "circOut" }}
                            className="absolute inset-0"
                            style={{ clipPath: 'inset(0 66% 0 0)' }}
                        >
                            <Image src={logoSrc} alt="" fill sizes="(max-width: 768px) 288px, 500px" className="object-contain" priority />
                        </motion.div>

                        <motion.div
                            initial={{ x: 30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "circOut" }}
                            className="absolute inset-0"
                            style={{ clipPath: 'inset(0 0 0 66%)' }}
                        >
                            <Image src={logoSrc} alt="" fill sizes="(max-width: 768px) 288px, 500px" className="object-contain" priority />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                            className="absolute inset-0"
                        >
                            <Image src={logoSrc} alt="JADD Logo" fill sizes="(max-width: 768px) 288px, 500px" className="object-contain" priority />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}