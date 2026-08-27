"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Search, CheckCircle, XCircle, FileImage, Loader2, Filter, X } from "lucide-react";

export default function VendorRequestsRegistry() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPendingOnly, setFilterPendingOnly] = useState(false);

  // حالات خاصة بالـ Modal الخاص بسبب الرفض
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemForRejection, setSelectedItemForRejection] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [submittingReject, setSubmittingReject] = useState(false);

 useEffect(() => {
    const token = localStorage.getItem("jadd-admin-token");

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/Identitie`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
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

  const handleAction = async (item: any, action: string, reason: string = "") => {
    if (action === "delete") {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/Identitie/${item._id}`, { method: "DELETE" });
      setRequests(requests.filter((r) => r._id !== item._id));
    } else {
      const newStatus = action === 'activate' ? 'verified' : 'unverified';
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/updateVendorStatus/${item.userId._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            status: newStatus,
            rejectionReason: reason 
          }),
        });
        
        if (response.ok) {
          setRequests(requests.map(r => 
            r._id === item._id 
              ? { 
                  ...r, 
                  rejectionReason: reason || r.rejectionReason, // تحديث السبب في الـ state ليظهر في الجدول فوراً
                  userId: { ...r.userId, verificationStatus: newStatus } 
                } 
              : r
          ));
        }
      } catch (err) {
        console.error("Update failed:", err);
      }
    }
  };

  const openRejectModal = (item: any) => {
    setSelectedItemForRejection(item);
    setRejectionReason("");
    setIsModalOpen(true);
  };

  const submitRejection = async () => {
    if (!selectedItemForRejection) return;
    setSubmittingReject(true);
    await handleAction(selectedItemForRejection, 'deactivate', rejectionReason);
    setSubmittingReject(false);
    setIsModalOpen(false);
    setSelectedItemForRejection(null);
  };

  const filtered = requests.filter((r) => {
    const matchesSearch = 
      r.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.nationalId?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterPendingOnly) {
      return matchesSearch && r.userId?.verificationStatus === 'pending';
    }
    return matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 bg-[#080808] min-h-screen text-white font-sans relative">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold tracking-tight">Vendor Activation Requests</h2>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setFilterPendingOnly(!filterPendingOnly)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
              filterPendingOnly 
                ? 'bg-[#D4AF37] text-black border-[#D4AF37]' 
                : 'bg-white/[0.03] text-zinc-300 border-white/10 hover:border-white/20'
            }`}
          >
            <Filter size={16} />
            <span>Pending Only</span>
          </button>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-3 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Search by name, email or national ID..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#D4AF37] transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
                <th className="p-5">Rejection Reason</th>
                <th className="p-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-zinc-500 text-sm">
                    No requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r._id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="p-5 font-medium">{r.userId?.fullName || "Unknown"}</td>
                    <td className="p-5">
                      {r.userId?.email ? (
                        <a 
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${r.userId.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-400 hover:text-[#D4AF37] transition-colors underline decoration-dotted underline-offset-4"
                          title="Open in Gmail"
                        >
                          {r.userId.email}
                        </a>
                      ) : (
                        <span className="text-zinc-500">N/A</span>
                      )}
                    </td>
                    <td className="p-5 font-mono">{r.userId?.phone || "N/A"}</td>
                    <td className="p-5">
                      <a href={r.idImages[0]} target="_blank" className="inline-block group">
                        <div className="relative w-20 h-12 rounded-lg overflow-hidden border border-white/10 group-hover:border-[#D4AF37] transition-colors bg-white/5">
                          <img 
                            src={r.idImages[0]} 
                            alt="ID Card" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </a>
                      <div className="text-xs text-zinc-400 mt-1">
                        {r.nationalId || "N/A"}
                      </div>
                    </td>
                    {/* عمود عرض سبب الرفض */}
                    <td className="p-5 text-sm text-zinc-400 max-w-xs truncate">
                      {r.rejectionReason ? (
                        <span className="text-red-400 bg-red-500/10 px-2 py-1 rounded-md  border border-red-500/20 inline-block">
                          {r.rejectionReason}
                        </span>
                      ) : (
                        <span className="text-zinc-600">-</span>
                      )}
                    </td>
                    <td className="p-5 flex justify-center gap-3 items-center">
                      <button 
                        onClick={() => handleAction(r, 'activate')} 
                        className={`${r.userId?.verificationStatus === 'verified' ? 'text-emerald-500' : 'text-zinc-600'} hover:text-emerald-400 transition-colors`} 
                        title="Activate"
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button 
                        onClick={() => openRejectModal(r)} 
                        className={`${r.userId?.verificationStatus === 'unverified' ? 'text-amber-500' : 'text-zinc-600'} hover:text-amber-400 transition-colors`} 
                        title="Deactivate / Reject"
                      >
                        <XCircle size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal نافذة كتابة سبب الرفض */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Rejection Reason</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="text-xs text-zinc-400">
              Please write the reason for rejection. An email will be sent to <span className="text-[#D4AF37]">{selectedItemForRejection?.userId?.email}</span> with this note.
            </p>

            <textarea
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Type the reason here..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-[#D4AF37] transition-all text-white resize-none"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 text-zinc-300 hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={submitRejection}
                disabled={submittingReject}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-500 transition-all flex items-center gap-2"
              >
                {submittingReject && <Loader2 className="animate-spin" size={14} />}
                Send & Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}