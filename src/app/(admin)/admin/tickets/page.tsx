"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trash2, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle, 
  Scan,
  MoreVertical,
  XCircle
} from "lucide-react";
import { getAdminTickets, deleteTicket, toggleTicketScan, updateTicketStatus } from "@/app/actions/admin";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { cn } from "@/lib/utils";

export default function AdminTickets() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    setLoading(true);
    const res = await getAdminTickets(page, search);
    if (res.success) {
      setTickets(res.data || []);
      setTotalPages((res as any).totalPages || 1);
    } else {
      setError(res.message || "Failed to fetch tickets");
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchTickets(), 500);
    return () => clearTimeout(timer);
  }, [page, search]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? This action is IRREVOCABLE.")) {
       const res = await deleteTicket(id);
       if (res.success) fetchTickets();
    }
  };

  const handleToggleScan = async (id: string, day: string, currentStatus: boolean) => {
    const res = await toggleTicketScan(id, day, !currentStatus);
    if (res.success) fetchTickets();
  };

  const handleStatusUpdate = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "confirmed" ? "pending" : "confirmed";
    const res = await updateTicketStatus(id, nextStatus);
    if (res.success) fetchTickets();
  };

  return (
    <PageWrapper className="pt-12 pb-20 px-8 relative">
      <div className="absolute inset-0 z-0 pointer-events-none tapestry-pattern opacity-5" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-6xl font-black italic text-[#FDF5E6] uppercase tracking-tighter mb-1 select-none">
              HERITAGE <span className="text-[#D4AF37]">SIGILS.</span>
            </h1>
            <p className="text-[10px] text-[#D4AF37]/40 font-black uppercase tracking-[0.3em]">TICKET AUTHENTICATION // ACCESS MANIFEST</p>
          </div>
        </div>

        <div className="flex gap-6 mb-12">
           <div className="flex-1 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]/40 group-focus-within:text-[#D4AF37] transition-colors" />
              <input 
               type="text" 
               placeholder="SEARCH BY NAME OR EMAIL..."
               value={search}
               onChange={(e) => { setSearch(e.target.value); setPage(1); }}
               className="w-full bg-white/5 border border-white/10 p-5 pl-14 text-xs font-black uppercase tracking-widest text-[#FDF5E6] outline-hidden focus:border-[#D4AF37]/50 transition-all font-heading"
              />
           </div>
        </div>

        <div className="bg-white/2 border-2 border-white/5 relative overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 bg-[#0A0505]/50 backdrop-blur-sm z-20">
              <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-black text-[#D4AF37] uppercase tracking-[0.5em] animate-pulse">SYNCHRONIZING SIGILS...</p>
            </div>
          ) : error ? (
            <div className="p-40 flex flex-col items-center justify-center text-center space-y-4">
              <AlertTriangle className="w-16 h-16 text-red-600" />
              <p className="text-red-600 font-black uppercase tracking-widest font-heading">ERROR: {error}</p>
              <button onClick={fetchTickets} className="px-6 py-2 bg-red-600 text-white font-black uppercase text-[10px] font-heading">RETRY SYNC</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-white/5">
                    <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">PASS ID</th>
                    <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">BEARER</th>
                    <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">TYPE / STATUS</th>
                    <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">SCAN STATUS (D0-D3)</th>
                    <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37] text-right">OVERRIDE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-heading">
                  {tickets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-20 text-center text-[#FDF5E6]/20 font-black uppercase tracking-widest text-xs">NO SIGILS REVEALED</td>
                    </tr>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {tickets.map((ticket, idx) => (
                        <motion.tr 
                          key={ticket.id} 
                          initial={{ opacity: 0, x: -10 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          transition={{ delay: idx * 0.05 }} 
                          className="hover:bg-white/2 transition-colors group"
                        >
                          <td className="p-6 font-mono text-[10px] text-[#FDF5E6]/40">{ticket.id.slice(0, 8)}</td>
                          <td className="p-6">
                            <div className="flex flex-col">
                              <span className="text-xs font-black uppercase text-[#FDF5E6]">{ticket.userName || "UNKNOWN"}</span>
                              <span className="text-[8px] text-[#D4AF37]/60 font-black uppercase">{ticket.userEmail}</span>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex flex-col gap-2">
                              <span className="px-2 py-0.5 bg-[#D4AF37]/5 border border-[#D4AF37]/20 text-[7px] font-black uppercase text-[#D4AF37] w-fit">
                                {ticket.ticketType}
                              </span>
                              <div className={cn(
                                "flex items-center gap-2 text-[9px] font-black uppercase tracking-tighter",
                                ticket.status === "confirmed" ? "text-green-500" : "text-yellow-500"
                              )}>
                                {ticket.status === "confirmed" ? <CheckCircle className="w-3 h-3" /> : <Scan className="w-3 h-3 animate-pulse" />}
                                {ticket.status}
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex gap-1.5">
                              {["day0Scan", "day1Scan", "day2Scan", "day3Scan"].map((day, dIdx) => (
                                <button
                                  key={day}
                                  onClick={() => handleToggleScan(ticket.id, day.replace("Scan", ""), ticket[day])}
                                  className={cn(
                                    "w-8 h-8 border-2 text-[8px] font-black flex items-center justify-center transition-all",
                                    ticket[day] 
                                      ? "bg-[#D4AF37] border-[#D4AF37] text-black" 
                                      : "bg-white/5 border-white/10 text-white/20 hover:border-[#D4AF37]/40"
                                  )}
                                >
                                  D{dIdx}
                                </button>
                              ))}
                            </div>
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleStatusUpdate(ticket.id, ticket.status)}
                                className="p-2 text-[8px] font-black uppercase border border-white/10 hover:bg-white/5 text-white/40 hover:text-white transition-all"
                              >
                                T-CONFIRM
                              </button>
                              <button 
                                onClick={() => handleDelete(ticket.id)} 
                                className="p-2 text-red-600 hover:bg-red-600 hover:text-white transition-all border border-red-600/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

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
