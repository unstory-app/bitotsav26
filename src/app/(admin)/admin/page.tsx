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
  getAdminEvents,
  getAdminParticipants,
  updateTicketStatus,
  deleteUser,
  getAllDataForExport
} from "@/app/actions/admin";
import { createEvent as createEventAction } from "@/app/actions/events";
import { cn } from "@/lib/utils";
import { Download, Plus } from "lucide-react";

type Tab = "users" | "tickets" | "teams" | "events" | "participants";

interface AdminUser { id: string; displayName: string | null; email: string; isBitMesra: boolean; rollNo?: string | null; collegeName?: string | null; password?: string | null; createdAt: string | Date; }
interface AdminTicket { id: string; userName: string | null; userEmail: string; ticketType: string; status: string; issuedAt: string | Date; }
interface AdminTeam { id: string; name: string; code: string; events: string[]; leaderName: string | null; createdAt: string | Date; }
interface AdminEvent { id: string; name: string; organizer: string | null; venue: string | null; category: string | null; about: string | null; createdAt: string | Date; }
interface AdminParticipant { id?: string; userId: string; userName: string | null; userEmail: string; teamName: string; eventName: string; joinedAt: string | Date; }

type AdminDataRow = AdminUser | AdminTicket | AdminTeam | AdminEvent | AdminParticipant;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AdminDataRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ id: "", name: "", category: "Flagship", venue: "", organizer: "", about: "" });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    let result: { success: boolean; data?: AdminDataRow[]; totalPages?: number; message?: string };

    if (activeTab === "users") {
      result = await getAdminUsers(page);
    } else if (activeTab === "tickets") {
      result = await getAdminTickets(page);
    } else if (activeTab === "teams") {
      result = await getAdminTeams(page);
    } else if (activeTab === "events") {
      result = await getAdminEvents(page);
    } else {
      result = await getAdminParticipants(undefined, page);
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

  const handleExport = async () => {
    const rawData = await getAllDataForExport(activeTab as Tab);
    if (!rawData || rawData.length === 0) return alert("No data to export");
    
    // Simple CSV conversion
    const headers = Object.keys(rawData[0]).join(",");
    const rows = rawData.map(row => 
      Object.values(row).map(val => `"${val?.toString().replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bitotsav_${activeTab}_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createEventAction(newEvent);
    if (res.success) {
      setIsAddEventOpen(false);
      fetchData();
    } else {
      alert(res.message);
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 border-b-2 border-white/5">
          <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
            {(["users", "tickets", "teams", "events", "participants"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setPage(1); }}
                className={cn(
                  "pb-6 px-4 text-xs font-black uppercase tracking-widest transition-all relative whitespace-nowrap font-heading",
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
          
          <div className="flex gap-4 pb-6 md:pb-0">
            {activeTab === "events" && (
              <button 
                onClick={() => setIsAddEventOpen(true)}
                className="px-6 py-3 bg-[#D4AF37] text-[#1A0505] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all font-heading"
              >
                <Plus className="w-4 h-4" /> ADD EVENT
              </button>
            )}
            <button 
              onClick={handleExport}
              className="px-6 py-3 bg-white/5 border border-white/10 text-[#FDF5E6] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all font-heading"
            >
              <Download className="w-4 h-4" /> EXPORT CSV
            </button>
          </div>
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
                    {activeTab === "events" && (
                      <>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">EVENT ID</th>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">EVENT NAME</th>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">ORGANIZER</th>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">VENUE</th>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37] text-right">CATEGORY</th>
                      </>
                    )}
                    {activeTab === "teams" && (
                      <>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">TEAM CODE</th>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">TEAM NAME</th>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">LEADER</th>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">REGISTERED EVENTS</th>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37] text-right">CREATED</th>
                      </>
                    )}
                    {activeTab === "participants" && (
                      <>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">PARTICIPANT</th>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">TEAM</th>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">EVENT</th>
                        <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37] text-right">JOINED</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence mode="popLayout">
                    {data.map((item, idx) => {
                      if (activeTab === "users") {
                        const user = item as AdminUser;
                        return (
                          <motion.tr key={user.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="hover:bg-white/2 transition-colors group">
                            <td className="p-6 font-mono text-[10px] text-[#FDF5E6]/40">{user.id.slice(0, 8)}</td>
                            <td className="p-6">
                              <div className="flex flex-col">
                                <span className="text-xs font-black uppercase text-[#FDF5E6]">{user.displayName || "GUEST"}</span>
                                <span className="text-[8px] text-[#D4AF37]/60 font-black uppercase">{user.email}</span>
                              </div>
                            </td>
                            <td className="p-6">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-[#FDF5E6]/60">
                                  {user.isBitMesra ? `BIT MESRA (${user.rollNo})` : user.collegeName}
                                </span>
                                <span className="text-[8px] text-[#FDF5E6]/20 font-black uppercase">REJ. PASS: {user.password || "NONE"}</span>
                              </div>
                            </td>
                            <td className="p-6 text-[10px] text-[#FDF5E6]/40 font-black font-heading">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-6 text-right">
                              <button onClick={() => handleDeleteUser(user.id)} className="p-3 text-red-600 hover:bg-red-600 hover:text-white transition-all rounded-sm">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </motion.tr>
                        );
                      }
                      
                      if (activeTab === "tickets") {
                        const ticket = item as AdminTicket;
                        return (
                          <motion.tr key={ticket.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="hover:bg-white/2 transition-colors group">
                            <td className="p-6 font-mono text-[10px] text-[#FDF5E6]/40">{ticket.id.slice(0, 8)}</td>
                            <td className="p-6">
                               <div className="flex flex-col">
                                <span className="text-xs font-black uppercase text-[#FDF5E6]">{ticket.userName}</span>
                                <span className="text-[8px] text-[#D4AF37]/60 font-black uppercase">{ticket.userEmail}</span>
                              </div>
                            </td>
                            <td className="p-6">
                              <span className="px-2 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[8px] font-black uppercase text-[#D4AF37]">
                                {ticket.ticketType}
                              </span>
                            </td>
                            <td className="p-6 text-xs font-black italic uppercase">
                               <span className={cn(
                                 "flex items-center gap-2",
                                 ticket.status === "confirmed" ? "text-green-500" : "text-yellow-500"
                               )}>
                                 {ticket.status === "confirmed" ? <CheckCircle className="w-3 h-3" /> : <Database className="w-3 h-3" />}
                                 {ticket.status}
                               </span>
                            </td>
                            <td className="p-6 text-right">
                              <button onClick={() => handleStatusUpdate(ticket.id, ticket.status)} className="p-3 bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#1A0505] transition-all font-heading">
                                TOGGLE STATUS
                              </button>
                            </td>
                          </motion.tr>
                        );
                      }

                      if (activeTab === "events") {
                        const event = item as AdminEvent;
                        return (
                          <motion.tr key={event.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="hover:bg-white/2 transition-colors group">
                            <td className="p-6 font-mono text-[10px] text-[#FDF5E6]/40">{event.id}</td>
                            <td className="p-6 text-xs font-black uppercase text-[#FDF5E6]">{event.name}</td>
                            <td className="p-6 text-[10px] font-black uppercase text-[#D4AF37]/60">{event.organizer}</td>
                            <td className="p-6 text-[10px] font-black uppercase text-[#FDF5E6]/60">{event.venue}</td>
                            <td className="p-6 text-right">
                              <span className="px-2 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[8px] font-black uppercase text-[#D4AF37]">
                                {event.category}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      }
                      
                      if (activeTab === "teams") {
                        const team = item as AdminTeam;
                        return (
                          <motion.tr key={team.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="hover:bg-white/2 transition-colors group">
                            <td className="p-6 font-mono text-xs font-black text-[#D4AF37]">{team.code}</td>
                            <td className="p-6 text-xs font-black uppercase text-[#FDF5E6]">{team.name}</td>
                            <td className="p-6 text-[10px] font-black uppercase text-[#FDF5E6]/60">{team.leaderName}</td>
                            <td className="p-6">
                              <div className="flex flex-wrap gap-2">
                                {team.events?.map(ev => (
                                  <span key={ev} className="px-2 py-1 bg-[#D4AF37]/5 border border-[#D4AF37]/20 text-[7px] font-black uppercase text-[#D4AF37]">
                                    {ev}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-6 text-right text-[10px] text-[#FDF5E6]/20 font-black font-heading">
                              {new Date(team.createdAt).toLocaleDateString()}
                            </td>
                          </motion.tr>
                        );
                      }

                      if (activeTab === "participants") {
                        const participant = item as AdminParticipant;
                        return (
                          <motion.tr key={`${participant.userId}-${participant.eventName}-${idx}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="hover:bg-white/2 transition-colors group">
                            <td className="p-6">
                              <div className="flex flex-col">
                                <span className="text-xs font-black uppercase text-[#FDF5E6]">{participant.userName}</span>
                                <span className="text-[8px] text-[#D4AF37]/60 font-black uppercase">{participant.userEmail}</span>
                              </div>
                            </td>
                            <td className="p-6 text-xs font-black uppercase text-[#FDF5E6]/60">{participant.teamName}</td>
                            <td className="p-6 text-xs font-black uppercase text-[#D4AF37]/40">{participant.eventName}</td>
                            <td className="p-6 text-right text-[10px] text-[#FDF5E6]/20 font-black font-heading">
                              {new Date(participant.joinedAt).toLocaleDateString()}
                            </td>
                          </motion.tr>
                        );
                      }

                      return null;
                    })}
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

      {/* Add Event Modal */}
      <AnimatePresence>
        {isAddEventOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddEventOpen(false)} 
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-xl bg-[#1A0505] border-2 border-[#D4AF37]/30 p-8 tapestry-bg"
             >
               <h2 className="text-3xl font-black italic text-[#FDF5E6] uppercase tracking-tighter mb-8 font-heading">ADD NEW <span className="text-[#D4AF37]">EVENT.</span></h2>
               <form onSubmit={handleCreateEvent} className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-[#D4AF37]">EVENT ID (e.g. flag-1)</label>
                       <input type="text" required value={newEvent.id} onChange={(e) => setNewEvent({...newEvent, id: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 text-xs text-[#FDF5E6] outline-hidden focus:border-[#D4AF37]" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-[#D4AF37]">EVENT NAME</label>
                       <input type="text" required value={newEvent.name} onChange={(e) => setNewEvent({...newEvent, name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 text-xs text-[#FDF5E6] outline-hidden focus:border-[#D4AF37]" />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-[#D4AF37]">CATEGORY</label>
                       <select value={newEvent.category} onChange={(e) => setNewEvent({...newEvent, category: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 text-xs text-[#FDF5E6] outline-hidden focus:border-[#D4AF37]">
                         <option value="Flagship">FLAGSHIP</option>
                         <option value="Formal">FORMAL</option>
                         <option value="Informal">INFORMAL</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-[#D4AF37]">VENUE</label>
                       <input type="text" value={newEvent.venue} onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 text-xs text-[#FDF5E6] outline-hidden focus:border-[#D4AF37]" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-[#D4AF37]">ORGANIZER</label>
                    <input type="text" value={newEvent.organizer} onChange={(e) => setNewEvent({...newEvent, organizer: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 text-xs text-[#FDF5E6] outline-hidden focus:border-[#D4AF37]" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-[#D4AF37]">ABOUT (SHORT DESC)</label>
                    <textarea value={newEvent.about} onChange={(e) => setNewEvent({...newEvent, about: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 text-xs text-[#FDF5E6] outline-hidden focus:border-[#D4AF37] h-24 resize-none" />
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setIsAddEventOpen(false)} className="flex-1 py-4 border-2 border-white/10 text-white text-[10px] font-black uppercase hover:bg-white/5 transition-all font-heading">CANCEL</button>
                    <button type="submit" className="flex-1 py-4 bg-[#D4AF37] text-black text-[10px] font-black uppercase hover:scale-105 transition-all font-heading">DEPLOY EVENT</button>
                 </div>
               </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
