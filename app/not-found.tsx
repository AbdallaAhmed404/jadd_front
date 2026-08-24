import Link from 'next/link';
import Logo from '@/src/components/global/logo';

export default function NotFound() {
    return (
        <main
            id="decommissioned-node"
            className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-6 overflow-hidden relative transition-colors duration-500"
        >
            <div className="absolute top-12 left-1/2 -translate-x-1/2 opacity-100 z-20">
                <Logo className="w-12 h-12 md:w-16 md:h-16" />
            </div>

            <div className="z-10 flex flex-col items-center text-center space-y-12">
                <h1 className="text-[12rem] md:text-[20rem] font-black italic leading-none tracking-tighter text-scarab-gold select-none">
                    404
                </h1>

                <div className="space-y-8">
                    <p className="max-w-xs text-muted-foreground font-bold uppercase tracking-[0.2em] text-xs leading-relaxed">
                        The requested page could not be found.
                    </p>
                    <Link
                        href="/"
                        className="inline-block border-b border-foreground/20 pb-1 font-mono text-[10px] uppercase tracking-[0.4em] hover:text-scarab-gold hover:border-scarab-gold transition-all duration-500"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
