import React from "react";
import { Activity, Users, ShoppingBag, Briefcase, TrendingUp, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // افترض أن هذه الداتا يتم جلبها من الـ Database
  const stats = {
    users: 1250,
    products: 480,
    orders: 3200,
    revenue: 850000,
    topProducts: [
      { name: "Mechanical Keyboard", views: 1250 },
      { name: "Wireless Mouse", views: 980 },
      { name: "Gaming Monitor", views: 850 },
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-zinc-300 font-sans p-8">
      
      {/* EXECUTIVE HEADER */}
      <section className="mb-12">
        <div className="flex items-center gap-2 text-sm font-medium text-[#D4AF37] mb-4">
          <Activity size={18} />
          <span>System Overview</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>

        {/* STATS GRID - Natural size and spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Total Users" value={stats.users.toLocaleString()} icon={<Users size={20} />} />
          <StatCard title="Total Products" value={stats.products.toLocaleString()} icon={<ShoppingBag size={20} />} />
          <StatCard title="Total Orders" value={stats.orders.toLocaleString()} icon={<Briefcase size={20} />} />
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        {/* Most Viewed Products */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-white/5 rounded-lg text-blue-400">
              <Eye size={20} />
            </div>
            <h2 className="text-lg font-semibold text-white">Most Viewed Products</h2>
          </div>
          
          <div className="space-y-4">
            {stats.topProducts.map((product, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white/[0.02] rounded-xl border border-white/5 hover:border-white/10 transition-all">
                <span className="font-medium text-white">{product.name}</span>
                <span className="text-sm text-zinc-400">{product.views.toLocaleString()} views</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// مكون StatCard بتنسيق طبيعي وخطوط واضحة
function StatCard({ title, value, icon, highlight }: { title: string, value: string, icon: React.ReactNode, highlight?: boolean }) {
  return (
    <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl hover:border-white/20 transition-all">
      <div className="flex items-center gap-3 mb-4 text-zinc-400">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <p className={cn(
        "text-3xl font-semibold", 
        highlight ? "text-[#D4AF37]" : "text-white"
      )}>
        {value}
      </p>
    </div>
  );
}