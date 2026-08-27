"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Search, Loader2, Download, Star } from "lucide-react";

export default function ProductRegistry() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      // 1. جلب التوكن المخزن
      const token = localStorage.getItem("jadd-admin-token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/product`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // 2. إرسال التوكن مع الطلب
        }
      });

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch products");
      }

      if (result.success) setProducts(result.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/product/${id}`, { method: "DELETE" });
    setProducts(products.filter(p => p._id !== id));
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/toggle-featured/${id}`, {
        method: "PATCH"
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(products.map(p => p._id === id ? { ...p, isFeatured: data.isFeatured } : p));
      }
    } catch (error) {
      console.error("Error toggling featured status:", error);
    }
  };

  const handleExportExcel = () => {
    if (filteredProducts.length === 0) return;

    const headers = ["Added By", "Email", "Product Title", "Category", "Price", "Featured"];
    
    const rows = filteredProducts.map(p => [
      `"${p.userId?.fullName || "Unknown"}"`,
      `"${p.userId?.email || ""}"`,
      `"${p.title || ""}"`,
      `"${p.category?.name?.en || p.category?.name || ""}"`,
      `"${p.price || 0}"`,
      `"${p.isFeatured ? "Yes" : "No"}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "products_registry.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProducts = products.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-[#080808] min-h-screen text-white font-sans">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Product Registry</h2>
        <div className="flex items-center gap-3">
          <div className="relative w-96">
            <Search className="absolute left-3 top-3 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Search title or owner..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-[#D4AF37]"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 bg-white/[0.03] border border-white/10 hover:border-[#D4AF37] text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl transition-all text-sm font-medium"
          >
            <Download size={18} />
            Export Excel
          </button>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /></div> : (
          <table className="w-full text-left">
            <thead className="bg-white/5 text-zinc-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-5">Added By</th>
                <th className="p-5">Product Title</th>
                <th className="p-5">Category</th>
                <th className="p-5">Price</th>
                <th className="p-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((p) => (
                <tr key={p._id} className="hover:bg-white/[0.03]">
                  <td className="p-5">
                    <div className="font-medium">{p.userId?.fullName || "Unknown"}</div>
                    <div className="text-xs text-zinc-500">{p.userId?.email}</div>
                  </td>
                  <td className="p-5 font-semibold">{p.title}</td>
                  <td className="p-5 text-zinc-400">
                    {p.category?.name?.en || p.category?.name || "N/A"}
                  </td>
                  <td className="p-5 font-mono text-emerald-500">${p.price}</td>
                  <td className="p-5 flex justify-center items-center gap-3">
                    <button 
                      onClick={() => handleToggleFeatured(p._id)} 
                      className={`transition-colors ${p.isFeatured ? "text-amber-400 hover:text-amber-500" : "text-zinc-500 hover:text-zinc-300"}`}
                      title={p.isFeatured ? "Featured Product" : "Make Featured"}
                    >
                      <Star size={18} className={p.isFeatured ? "fill-amber-400" : ""} />
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="text-zinc-500 hover:text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}