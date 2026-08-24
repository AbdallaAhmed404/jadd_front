"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  Users,
  Package,
  IdCard,
  AlertTriangle,
  Tag,
  Zap,
  Eye,
  LogOut,
  ChevronLeft,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAlert } from "@/src/components/global/alert-provider";

const NAV_ITEMS = [
  { label: "Overview", icon: Activity, href: "/admin" },
  { label: "Users", icon: Users, href: "/admin/team" },
  { label: "Products", icon: Package, href: "/admin/clients" },
  { label: "Categories", icon: Tag, href: "/admin/finance" },
  { label: "Identity", icon: IdCard, href: "/admin/projects" },
  { label: "Reports", icon: AlertTriangle, href: "/admin/planning" },
  // { label: "Time Logs", icon: Zap, href: "/admin/time-logs" },
  // { label: "Audit Logs", icon: Eye, href: "/admin/audit-logs" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { showConfirm } = useAlert();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const handleLogout = async () => {
    const confirmed = await showConfirm("Terminate current administrative session?", {
      title: "Logout Authorization",
      type: "warning"
    });

    if (confirmed) {
      router.push("/admin/login");
    }
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="border-r border-white/10 flex flex-col bg-black h-screen sticky top-0"
    >
      {/* Sidebar Header: Toggle Button */}
      <div className="p-6 flex items-center justify-center border-b border-white/5">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-center w-full p-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all"
        >
          {isCollapsed ? <Menu size={20} /> : <div className="flex items-center gap-2"><ChevronLeft size={20} /> <span>Collapse</span></div>}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-6 py-4 transition-all duration-200 group relative border-l-4",
                isActive ? "text-white bg-white/5 border-[#D4AF37]" : "text-zinc-500 border-transparent hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={20} />
              {!isCollapsed && (
                <span className="text-sm font-semibold tracking-wide">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-6 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 text-zinc-500 hover:text-red-400 transition-colors w-full px-2"
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-sm font-semibold">Disconnect</span>}
        </button>
      </div>
    </motion.aside>
  );
}