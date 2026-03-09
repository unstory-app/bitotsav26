"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trash2, 
  ChevronLeft,
  ChevronRight,
  Database,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { 
  getAdminUsers, 
  getAdminTickets, 
  getAdminTeams, 
  updateTicketStatus,
  deleteUser 
} from "@/app/actions/admin";
import { cn } from "@/lib/utils";

type Tab = "users" | "tickets" | "teams";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    let result: { success: boolean; data?: Record<string, any>[]; totalPages?: number; message?: string };

    if (activeTab === "users") {
      result = await getAdminUsers(page);
    } else if (activeTab === "tickets") {
      result = await getAdminTickets(page);
    } else {
      result = await getAdminTeams(page);
    }

    if (result.success) {
      setData(result.data || []);
      setTotalPages(result.totalPages || 1);
    } else {
      setError(result.message || "Unknown error occurred");
    }
    setLoading(false);
  }, [activeTab, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusUpdate = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "confirmed" ? "pending" : "confirmed";
    const res = await updateTicketStatus(id, nextStatus);
    if (res.success) fetchData();
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm("Are you sure? This will delete all user data, tickets, and teams led by this user.")) {
       const res = await deleteUser(id);
       if (res.success) fetchData();
    }
  };

  return (
    <PageWrapper className="min-h-screen bg-[#1A0505] pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none tapestry-pattern opacity-5" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="border-l-8 border-[#D4AF37] pl-8 py-4">
            <h1 className="text-5xl md:text-8xl font-black italic text-[#FDF5E6] uppercase tracking-tighter mb-2 font-heading">
              DATA <span className="text-[#D4AF37]">NEXUS.</span>
            </h1>
            <p className="text-xs text-[#D4AF37]/40 font-black uppercase tracking-[0.4em] font-heading">CORE ADMINISTRATIVE INTERFACE // BITOTSAV &apos;26</p>
          </div>
          
          <div className="flex gap-4">
             <div className="p-4 bg-white/5 border border-white/10 text-center">
                <p className="text-[8px] font-black uppercase text-[#D4AF37]">SYSTEM STATUS</p>
                <p className="text-xs font-black text-green-500 uppercase">OPERATIONAL</p>
             </div>
             <div className="p-4 bg-white/5 border border-white/10 text-center">
                <p className="text-[8px] font-black uppercase text-[#D4AF37]">REGISTRATIONS</p>
                <p className="text-xs font-black text-[#FDF5E6] uppercase">LIVE</p>
             </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-12 border-b-2 border-white/5">
          {(["users", "tickets", "teams"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setPage(1); }}
              className={cn(
                "pb-6 px-4 text-xs font-black uppercase tracking-widest transition-all relative font-heading",
                activeTab === tab ? "text-[#D4AF37]" : "text-[#FDF5E6]/30 hover:text-[#FDF5E6]/60"
              )}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-[#D4AF37]" />
              )}
            </button>
          ))}
        </div>

        {/* Filters/Search Placeholder */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
           <div className="flex-1 relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]/40" />
             <input 
              type="text" 
              placeholder={`SEARCH IN ${activeTab.toUpperCase()}...`}
              className="w-full bg-white/5 border-2 border-[#D4AF37]/10 p-4 pl-12 text-xs font-black uppercase tracking-widest text-[#FDF5E6] outline-hidden focus:border-[#D4AF37]/30 font-heading"
             />
           </div>
           <button className="px-6 py-4 bg-white/5 border-2 border-white/10 flex items-center gap-3 text-xs font-black uppercase text-[#FDF5E6]/40 hover:bg-white/10 transition-all font-heading">
             <Filter className="w-4 h-4" />
             FILTER
           </button>
        </div>

        {/* Data Table */}
        <div className="bg-white/2 border-2 border-white/5 relative overflow-hidden">
          {loading ? (
            <div className="p-40 flex flex-col items-center justify-center space-y-6">
              <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-black text-[#D4AF37] uppercase tracking-[0.5em] animate-pulse">SYNCHRONIZING...</p>
            </div>
          ) : error ? (
            <div className="p-40 flex flex-col items-center justify-center text-center space-y-4">
              <AlertTriangle className="w-16 h-16 text-red-600" />
              <p className="text-red-600 font-black uppercase tracking-widest">ERROR: {error}</p>
              <button onClick={fetchData} className="px-6 py-2 bg-red-600 text-white font-black uppercase text-[10px]">RETRY SYNC</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-white/5">
                    {activeTab === "users" && (
                      <>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">SIGIL</th>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">NAME / AFFILIATION</th>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">IDENTITY DATA</th>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">MINTED</th>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37] text-right">ACTIONS</th>
                      </>
                    )}
                    {activeTab === "tickets" && (
                      <>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">TICKET ID</th>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">OWNER</th>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">TYPE</th>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">STATUS</th>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37] text-right">OVERRIDE</th>
                      </>
                    )}
                    {activeTab === "teams" && (
                      <>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">TEAM CODE</th>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">MONIKER</th>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">LEADER</th>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">EVENT ID</th>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37] text-right">FORMED</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence mode="popLayout">
                    {data.map((item, idx) => (
                      <motion.tr 
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        {activeTab === "users" && (
                          <>
                            <td className="p-6 font-mono text-[10px] text-[#FDF5E6]/40">{item.id.slice(0, 8)}</td>
                            <td className="p-6">
                              <div className="flex flex-col">
                                <span className="text-xs font-black uppercase text-[#FDF5E6]">{item.displayName || "GUEST"}</span>
                                <span className="text-[8px] text-[#D4AF37]/60 font-black uppercase">{item.email}</span>
                              </div>
                            </td>
                            <td className="p-6">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-[#FDF5E6]/60">
                                  {item.isBitMesra ? `BIT MESRA (${item.rollNo})` : item.collegeName}
                                </span>
                                <span className="text-[8px] text-[#FDF5E6]/20 font-black uppercase">REJ. PASS: {item.password || "NONE"}</span>
                              </div>
                            </td>
                            <td className="p-6 text-[10px] text-[#FDF5E6]/40 font-black font-heading">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-6 text-right">
                              <button 
                                onClick={() => handleDeleteUser(item.id)}
                                className="p-3 text-red-600 hover:bg-red-600 hover:text-white transition-all rounded-sm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </>
                        )}
                        {activeTab === "tickets" && (
                          <>
                            <td className="p-6 font-mono text-[10px] text-[#FDF5E6]/40">{item.id.slice(0, 8)}</td>
                            <td className="p-6">
                               <div className="flex flex-col">
                                <span className="text-xs font-black uppercase text-[#FDF5E6]">{item.userName}</span>
                                <span className="text-[8px] text-[#D4AF37]/60 font-black uppercase">{item.userEmail}</span>
                              </div>
                            </td>
                            <td className="p-6">
                              <span className="px-2 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[8px] font-black uppercase text-[#D4AF37]">
                                {item.ticketType}
                              </span>
                            </td>
                            <td className="p-6 text-xs font-black italic uppercase">
                               <span className={cn(
                                 "flex items-center gap-2",
                                 item.status === "confirmed" ? "text-green-500" : "text-yellow-500"
                               )}>
                                 {item.status === "confirmed" ? <CheckCircle className="w-3 h-3" /> : <Database className="w-3 h-3" />}
                                 {item.status}
                               </span>
                            </td>
                            <td className="p-6 text-right">
                              <button 
                                onClick={() => handleStatusUpdate(item.id, item.status)}
                                className="p-3 bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#1A0505] transition-all font-heading"
                              >
                                TOGGLE STATUS
                              </button>
                            </td>
                          </>
                        )}
                        {activeTab === "teams" && (
                          <>
                            <td className="p-6 font-mono text-[10px] text-[#D4AF37] font-black">{item.code}</td>
                            <td className="p-6 text-xs font-black uppercase text-[#FDF5E6]">{item.name}</td>
                            <td className="p-6 text-[10px] font-black uppercase text-[#FDF5E6]/60">{item.leaderName}</td>
                            <td className="p-6 text-[10px] font-black uppercase text-[#FDF5E6]/40">{item.eventId}</td>
                            <td className="p-6 text-right text-[10px] text-[#FDF5E6]/20 font-black font-heading">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </td>
                          </>
                        )}
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-6">
             <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-4 border-2 border-white/10 text-[#FDF5E6] disabled:opacity-20 hover:border-[#D4AF37] transition-all"
             >
               <ChevronLeft className="w-6 h-6" />
             </button>
             <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37] font-heading">PAGE {page} OF {totalPages}</span>
             <button 
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="p-4 border-2 border-white/10 text-[#FDF5E6] disabled:opacity-20 hover:border-[#D4AF37] transition-all"
             >
               <ChevronRight className="w-6 h-6" />
             </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
