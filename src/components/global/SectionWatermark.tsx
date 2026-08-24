"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Logo from "./logo";

export default function SectionWatermark() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    // Subtle parallax: moves slower than the scroll for architectural depth
    const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

    return (
        <div
            ref={containerRef}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[30vh] overflow-hidden pointer-events-none select-none z-0 flex items-end justify-center"
        >
            <motion.div
                style={{ y }}
                className="opacity-[0.03] dark:opacity-[0.05] mix-blend-luminosity"
            >
                {/* Scale to 140% width to make it feel massive and "bigger than the screen" */}
                <Logo className="w-[140vw] h-[25vh] grayscale brightness-0 dark:brightness-200" />
            </motion.div>
        </div>
    );
}
