'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/src/components/global/logo';

export default function Error({
    error,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Structural Breach Detected:", error);
    }, [error]);

    return (
        <main
            id="system-breach"
            className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-6 overflow-hidden relative transition-colors duration-500"
        >
            {/* Header Logo */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 opacity-100 z-20">
                <Logo className="w-12 h-12 md:w-16 md:h-16" />
            </div>

            <div className="z-10 flex flex-col items-center text-center space-y-12">
                {/* Main Brand Focal Point */}
                <h1 className="text-[10rem] md:text-[18rem] font-black italic leading-none tracking-tighter text-scarab-gold select-none mb-6">
                    500
                </h1>

                <div className="space-y-10">
                    <p className="max-w-xs text-muted-foreground font-bold uppercase tracking-[0.3em] text-[10px] leading-relaxed mx-auto">
                        Structural breach detected // System integrity compromised.
                    </p>
                    <Link
                        href="/"
                        className="font-mono text-[8px] uppercase tracking-[0.4em] text-foreground/40 hover:text-scarab-gold transition-colors duration-500"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
