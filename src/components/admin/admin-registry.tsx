"use client";

import React, { useState, useEffect } from "react";
import { Trash2, CheckCircle2, XCircle, Search, Loader2, Download } from "lucide-react";

export default function AdminRegistry() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // جلب المستخدمين من الـ API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://jadd-production-275a.up.railway.app/admin/user"); // تأكد من مسار الراوت لديك
      const data = await res.json();
      setUsers(data.data || data); // حسب هيكل الـ response في الكنترولر الخاص بك
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // مسح مستخدم
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`https://jadd-production-275a.up.railway.app/admin/user/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // تحديث القائمة بعد المسح
        setUsers(users.filter(u => u._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  // تصدير البيانات إلى ملف CSV (إكسيل)
  const handleExportExcel = () => {
    if (filteredUsers.length === 0) return;

    // رؤوس الأعمدة
    const headers = ["Name", "Email", "Phone", "Seller Status"];
    
    // تحويل البيانات إلى صفوف
    const rows = filteredUsers.map(user => [
      `"${user.fullName || ""}"`,
      `"${user.email || ""}"`,
      `"${user.phone || "---"}"`,
      `"${user.verificationStatus || "Unverified"}"`
    ]);

    // تجميع المحتوى بصيغة CSV تدعمها برامج الإكسيل
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    // إنشاء ملف وهمي وتنزيله تلقائياً
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "users_registry.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter(user =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-[#080808] min-h-screen text-white font-sans">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-tight">User Registry</h2>
        <div className="flex items-center gap-3">
          <div className="relative w-96">
            <Search className="absolute left-3 top-3 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Search members..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-[#D4AF37] transition-all"
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
        {loading ? (
          <div className="p-20 flex justify-center text-zinc-500">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-white/5 text-zinc-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-5">Name</th>
                <th className="p-5">Email</th>
                <th className="p-5">Phone</th>
                <th className="p-5">Seller</th>
                <th className="p-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="p-5 font-medium">{user.fullName}</td>
                  <td className="p-5 text-zinc-400">{user.email}</td>
                  <td className="p-5 font-mono">{user.phone || "---"}</td>
                  <td className="p-5">
                    {user.verificationStatus === 'verified' ? (
                      <span className="flex items-center gap-1.5 text-emerald-500 text-sm">
                        <CheckCircle2 size={16} /> Verified
                      </span>
                    ) : user.verificationStatus === 'pending' ? (
                      <span className="flex items-center gap-1.5 text-amber-500 text-sm">
                        <Loader2 size={16} className="animate-spin" /> Pending
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-zinc-500 text-sm">
                        <XCircle size={16} /> Unverified
                      </span>
                    )}
                  </td>
                  <td className="p-5 flex justify-center">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-zinc-500 hover:text-red-500 transition-colors"
                    >
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