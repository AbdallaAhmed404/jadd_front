"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Plus, Tag, Loader2, X } from "lucide-react";

export default function CategoryRegistry() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategoryAr, setNewCategoryAr] = useState("");
  const [newCategoryEn, setNewCategoryEn] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("https://api.joinjadd.com/admin/categories")
      .then((res) => res.json())
      .then((data) => { setCategories(data.data || []); setLoading(false); });
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryAr.trim() || !newCategoryEn.trim()) return;
    
    const res = await fetch("https://api.joinjadd.com/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        name: { 
          ar: newCategoryAr, 
          en: newCategoryEn 
        } 
      })
    });
    const result = await res.json();
    if (result.success) {
      setCategories([result.data, ...categories]);
      setNewCategoryAr("");
      setNewCategoryEn("");
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`https://api.joinjadd.com/admin/categories/${id}`, { method: "DELETE" });
    setCategories(categories.filter(c => c._id !== id));
  };

  return (
    <div className="p-6 space-y-6 bg-[#080808] min-h-screen text-white font-sans">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Tag className="text-[#D4AF37]" size={20} /> Category Registry
        </h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-white text-black px-4 py-2.5 rounded-xl font-bold hover:bg-zinc-200 flex items-center gap-2">
          <Plus size={18} /> Add Category
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleAdd} className="bg-[#121212] border border-white/10 p-6 rounded-2xl w-full max-w-md space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Add New Category</h3>
              <button type="button" onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </div>
            <input 
              autoFocus 
              type="text" 
              placeholder="Category name (Arabic)..." 
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#D4AF37]" 
              value={newCategoryAr} 
              onChange={(e) => setNewCategoryAr(e.target.value)} 
            />
            <input 
              type="text" 
              placeholder="Category name (English)..." 
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#D4AF37]" 
              value={newCategoryEn} 
              onChange={(e) => setNewCategoryEn(e.target.value)} 
            />
            <button type="submit" className="w-full bg-[#D4AF37] text-black py-3 rounded-xl font-bold hover:bg-[#b8962d]">Save Category</button>
          </form>
        </div>
      )}

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /></div> : (
          <table className="w-full text-left">
            <thead className="bg-white/5 text-zinc-400 text-xs uppercase tracking-wider">
              <tr><th className="p-5">Category Name (AR / EN)</th><th className="p-5 text-center">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categories.map((c) => (
                <tr key={c._id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="p-5 font-bold">
                    <span>{c.name?.ar} / {c.name?.en}</span>
                  </td>
                  <td className="p-5 text-center">
                    <button onClick={() => handleDelete(c._id)} className="text-zinc-600 hover:text-red-500">
                      <Trash2 size={20} />
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