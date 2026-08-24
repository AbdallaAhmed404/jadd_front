import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Command Center",
  description: "Secure node for system administration.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-scarab-gold selection:text-black admin-mode font-sans">
      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {children}
      </div>
    </div>
  );
}
