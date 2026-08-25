import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from "@/src/components/layout/Navbar";
import { cn } from "@/lib/utils";
import MonolithLoader from "@/src/components/global/monolith-loader";
import FooterRegistry from "@/src/components/layout/FooterRegistry";
import MobileBottomNav from "@/src/components/layout/MobileBottomNav";
// في أعلى الملف مع الاستيرادات الأخرى:
import ChatDrawerProvider from "@/src/components/ChatDrawerProvider";
import CategoriesDrawerProvider from "@/src/components/CategoriesDrawerProvider";
import { Toaster } from "react-hot-toast";

// ... بقية الكود كما هو

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1A160E" }, // تم التعديل: تكييف لون المتصفح مع الدارك مود الذهبي العميق لـ JADD
  ],
  viewportFit: "cover",
};

const lineSeed = localFont({
  src: [
    {
      path: "../public/fonts/LINESeedSans_W_Th.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/LINESeedSans_W_Rg.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/LINESeedSans_W_Bd.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/LINESeedSans_W_XBd.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/LINESeedSans_W_He.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-custom",
});

// تم التعديل بالكامل: نقل الـ Metadata لتعبر عن الهوية الفخمة لـ JADD وسوق سلطنة عُمان
export const metadata: Metadata = {
  metadataBase: new URL("https://joinjadd.com"), // تحديث النطاق لـ JADD
  title: {
    default: "JADD",
    template: "JADD // %s",
  },
  description:
    "Give your premium items a brilliant second cycle. JADD features a purely tailored, ad-free marketplace built for trusted neighborhood listings across the Sultanate of Oman.",
  keywords: [
    "Premium Marketplace Oman",
    "Jadd Marketplace",
    "Buy Used Furniture Muscat",
    "Luxury Second Hand Oman",
    "Trusted Local Sellers Oman",
    "Ad-free Listing Platform",
    "Oman Premium Classifieds",
  ],
  authors: [{ name: "JADD Team", url: "https://joinjadd.com/" }],
  creator: "JADD",
  manifest: "/manifest.json",
  openGraph: {
    title: "JADD // Find Premium Deals Just Around The Corner",
    description:
      "Explore a curated selection of furniture, electronics, and apparel from trusted sellers right in your neighborhood across Oman.",
    url: "https://joinjadd.com/",
    siteName: "JADD",
    locale: "en_OM", // تعديل الـ Locale لسلطنة عمان
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JADD // Premium Local Marketplace",
    description: "Turn unused assets into cash instantly with our tailored workspace.",
    creator: "@JaddMarketplace",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

import { AlertProvider } from "@/src/components/global/alert-provider";

export default async function RootLayout({

  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased transition-colors duration-300",
        lineSeed.variable,
      )}
      style={{ scrollBehavior: "smooth" }}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
          body.loading-monolith { 
            overflow: hidden !important; 
            background-color: #000000; 
          }
          body.loading-monolith main, 
          body.loading-monolith nav, 
          body.loading-monolith footer { 
            opacity: 0 !important; 
            visibility: hidden !important;
          }
        `}} />
      </head>
      {/* Initialize body with the loading class */}
      {/* تم التعديل: تغيير لون الـ Selection إلى لون براند جدد الذهبي الكود [#D6C88A] وربطه بالخط المخصص */}
      <body className={cn(
        "flex min-h-full flex-col bg-background text-foreground font-(family-name:--font-custom) selection:bg-[#D6C88A] selection:text-[#1F1547] pb-[env(safe-area-inset-bottom)]",
        "loading-monolith"
      )}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AlertProvider>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: { borderRadius: '10px', padding: '10px' },
                success: {
                  style: { background: '#1F1547', color: '#fff' },
                  className: 'dark:!bg-[#D6C88A] dark:!text-[#1F1547]',
                },
                error: {
                  style: { background: '#1F1547', color: '#fff' },
                  className: 'dark:!bg-[#D6C88A] dark:!text-[#1F1547]',
                },
              }}
              containerClassName="!bottom-[75px] md:!bottom-5"
            />
            <MonolithLoader />
            <ChatDrawerProvider>
              <CategoriesDrawerProvider>
                <Navbar />
                <main className="flex-1 relative">
                  {children}
                </main>
                <MobileBottomNav />
                <FooterRegistry />
              </CategoriesDrawerProvider>
            </ChatDrawerProvider>
            <Analytics />
          </AlertProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}