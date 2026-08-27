"use client";
import React, { useState, useEffect } from "react";
import { Trash2, Search, AlertTriangle } from "lucide-react";

export default function ReportsRegistry() {
  const [reports, setReports] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("jadd-admin-token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/report`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filtered = reports.filter(r => 
    r.reporter?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.reportedUser?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => { {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/report/${id}`, { method: "DELETE" });
        setReports(reports.filter(r => r._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="p-20 text-center text-white">Loading...</div>;

  return (
    <div className="p-6 space-y-6 bg-[#080808] min-h-screen text-white font-sans">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <AlertTriangle className="text-red-500" size={20} /> System Reports
        </h2>
        <div className="relative w-96">
          <Search className="absolute left-3 top-3 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Search reports..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-[#D4AF37] transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-zinc-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-5">Reporter</th>
              <th className="p-5">Reported User</th>
              <th className="p-5">Report Content</th>
              <th className="p-5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((r) => (
              <tr key={r._id} className="hover:bg-white/[0.03] transition-colors">
                <td className="p-5">
                  <div className="font-medium">{r.reporter?.fullName}</div>
                  <div className="text-xs text-zinc-500">{r.reporter?.email}</div>
                  <div className="text-xs font-mono text-zinc-600">{r.reporter?.phone}</div>
                </td>
                <td className="p-5">
                  <div className="font-medium text-red-400">{r.reportedUser?.fullName}</div>
                  <div className="text-xs text-zinc-500">{r.reportedUser?.email}</div>
                  <div className="text-xs font-mono text-zinc-600">{r.reportedUser?.phone}</div>
                </td>
                <td className="p-5 max-w-[250px] text-sm text-zinc-300 italic">
                  "{r.content}"
                </td>
                <td className="p-5 text-center">
                  <button 
                    onClick={() => handleDelete(r._id)} 
                    className="text-zinc-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}