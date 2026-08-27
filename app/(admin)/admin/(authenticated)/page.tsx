"use client";

import React, { useEffect, useState } from "react";
import { Activity, Users, ShoppingBag, Eye, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("jadd-admin-token");
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        // جلب المستخدمين والمنتجات مع إرسال التوكن في الـ Headers
        const [usersRes, productsRes] = await Promise.all([
          fetch(`${baseUrl}/admin/user`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }),
          fetch(`${baseUrl}/admin/product`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }),
        ]);

        const usersData = await usersRes.json();
        const productsData = await productsRes.json();

        const usersList = Array.isArray(usersData) ? usersData : (usersData.data || []);
        const productsList = Array.isArray(productsData) ? productsData : (productsData.data || []);

        const totalUsers = usersList.length;
        const totalProducts = productsList.length;

        // ترتيب المنتجات حسب أكثر عدد مشاهدات viewsCount
        const topProducts = [...productsList]
          .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
          .slice(0, 3)
          .map((p: any) => ({
            name: p.title || "Untitled Product",
            views: p.viewsCount || 0,
          }));

        setStats({
          users: totalUsers,
          products: totalProducts,
          topProducts: topProducts as any,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-zinc-300 font-sans p-8">
      
      {/* EXECUTIVE HEADER */}
      <section className="mb-12">
        <div className="flex items-center gap-2 text-sm font-medium text-[#D4AF37] mb-4">
          <Activity size={18} />
          <span>System Overview</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>

        {/* STATS GRID - Total Users and Total Products only */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <StatCard title="Total Users" value={stats.users.toLocaleString()} icon={<Users size={20} />} />
          <StatCard title="Total Products" value={stats.products.toLocaleString()} icon={<ShoppingBag size={20} />} />
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
            {stats.topProducts.length > 0 ? (
              stats.topProducts.map((product: any, i: number) => (
                <div key={i} className="flex justify-between items-center p-4 bg-white/[0.02] rounded-xl border border-white/5 hover:border-white/10 transition-all">
                  <span className="font-medium text-white">{product.name}</span>
                  <span className="text-sm text-zinc-400">{product.views.toLocaleString()} views</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500 text-center py-4">No products found</p>
            )}
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