"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Search, CheckCircle, XCircle, FileImage, Loader2 } from "lucide-react";

export default function VendorRequestsRegistry() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://api.joinjadd.com/admin/Identitie")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRequests(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch:", err);
        setLoading(false);
      });
  }, []);

  const handleAction = async (item: any, action: string) => {
    if (action === "delete") {
      await fetch(`https://api.joinjadd.com/admin/Identitie/${item._id}`, { method: "DELETE" });
      setRequests(requests.filter((r) => r._id !== item._id));
    } else {
      const newStatus = action === 'activate' ? 'verified' : 'unverified';
      try {
        const response = await fetch(`https://api.joinjadd.com/admin/status/${item.userId._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        
        if (response.ok) {
          setRequests(requests.map(r => 
            r._id === item._id ? { ...r, userId: { ...r.userId, verificationStatus: newStatus } } : r
          ));
        }
      } catch (err) {
        console.error("Update failed:", err);
      }
    }
  };

  const filtered = requests.filter((r) =>
    r.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-[#080808] min-h-screen text-white font-sans">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-tight">Vendor Activation Requests</h2>
        <div className="relative w-96">
          <Search className="absolute left-3 top-3 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-[#D4AF37] transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-[#D4AF37]" size={32} /></div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-white/5 text-zinc-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-5">Full Name</th>
                <th className="p-5">Email</th>
                <th className="p-5">Phone</th>
                <th className="p-5">ID Card</th>
                <th className="p-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((r) => (
                <tr key={r._id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="p-5 font-medium">{r.userId?.fullName || "Unknown"}</td>
                  <td className="p-5 text-zinc-400">{r.userId?.email || "N/A"}</td>
                  <td className="p-5 font-mono">{r.userId?.phone || "N/A"}</td>
                  <td className="p-5">
                    <a href={r.idImages[0]} target="_blank" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                      <FileImage size={18} /> <span className="text-xs">View ID</span>
                    </a>
                  </td>
                  <td className="p-5 flex justify-center gap-3">
                    <button 
                      onClick={() => handleAction(r, 'activate')} 
                      className={`${r.userId?.verificationStatus === 'verified' ? 'text-emerald-500' : 'text-zinc-600'} hover:text-emerald-400 transition-colors`} 
                      title="Activate"
                    >
                      <CheckCircle size={20} />
                    </button>
                    <button 
                      onClick={() => handleAction(r, 'deactivate')} 
                      className={`${r.userId?.verificationStatus === 'unverified' ? 'text-amber-500' : 'text-zinc-600'} hover:text-amber-400 transition-colors`} 
                      title="Deactivate"
                    >
                      <XCircle size={20} />
                    </button>
                    {/* <button onClick={() => handleAction(r, 'delete')} className="text-zinc-600 hover:text-red-500 transition-colors" title="Delete">
                      <Trash2 size={20} />
                    </button> */}
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