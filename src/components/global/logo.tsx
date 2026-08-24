"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
}

export default function Logo({ className }: LogoProps) {
    return (
        <Link
            href="/"
            className={cn(
                "group relative flex items-center transition-all hover:opacity-90 active:scale-[0.98]",
                "w-48 h-12 md:w-64 md:h-16",
                className
            )}
        >
            {/* DARK MODE ARTIFACT (White) */}
            <div className="hidden dark:block relative w-full h-full">
                <Image
                    src="/logos/logo-white.png"
                    alt="SCARABIX"
                    fill
                    sizes="(max-width: 768px)"
                    className="object-contain object-left"
                    priority
                />
            </div>

            {/* LIGHT MODE ARTIFACT (Black) */}
            <div className="block dark:hidden relative w-full h-full">
                <Image
                    src="/logos/logo-black.png"
                    alt="SCARABIX"
                    fill
                    sizes="(max-width: 768px)"
                    className="object-cover object-center"
                    priority
                />
            </div>
        </Link>
    );
}
