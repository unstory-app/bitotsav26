"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  Plus,
  MapPin,
  User,
  Tag
} from "lucide-react";
import { getAdminEvents } from "@/app/actions/admin";
import { createEvent as createEventAction } from "@/app/actions/events";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { cn } from "@/lib/utils";

export default function AdminEvents() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ id: "", name: "", category: "Flagship", venue: "", organizer: "", about: "" });

  const fetchEvents = async () => {
    setLoading(true);
    const res = await getAdminEvents(page, search);
    if (res.success) {
      setEvents(res.data || []);
      setTotalPages((res as any).totalPages || 1);
    } else {
      setError(res.message || "Failed to fetch GAATHA events");
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchEvents(), 500);
    return () => clearTimeout(timer);
  }, [page, search]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createEventAction(newEvent);
    if (res.success) {
      setIsAddEventOpen(false);
      setNewEvent({ id: "", name: "", category: "Flagship", venue: "", organizer: "", about: "" });
      fetchEvents();
    } else {
      alert(res.message);
    }
  };

  return (
    <PageWrapper className="pt-12 pb-20 px-8 relative">
      <div className="absolute inset-0 z-0 pointer-events-none tapestry-pattern opacity-5" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-6xl font-black italic text-[#FDF5E6] uppercase tracking-tighter mb-1 select-none">
              GAATHA <span className="text-[#D4AF37]">CHRONICLES.</span>
            </h1>
            <p className="text-[10px] text-[#D4AF37]/40 font-black uppercase tracking-[0.3em]">EVENT ARCHITECTURE // CULTURAL PROGRAMMING</p>
          </div>
          
          <button 
            onClick={() => setIsAddEventOpen(true)}
            className="px-6 py-4 bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all font-heading"
          >
            <Plus className="w-4 h-4" /> REVEAL EVENT
          </button>
        </div>

        <div className="flex gap-6 mb-12">
           <div className="flex-1 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]/40 group-focus-within:text-[#D4AF37] transition-colors" />
              <input 
               type="text" 
               placeholder="SEARCH BY EVENT NAME, ORGANIZER OR ID..."
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
              <p className="text-xs font-black text-[#D4AF37] uppercase tracking-[0.5em] animate-pulse">SYNCHRONIZING GAATHA...</p>
            </div>
          ) : error ? (
            <div className="p-40 flex flex-col items-center justify-center text-center space-y-4">
              <AlertTriangle className="w-16 h-16 text-red-600" />
              <p className="text-red-600 font-black uppercase tracking-widest font-heading">ERROR: {error}</p>
              <button onClick={fetchEvents} className="px-6 py-2 bg-red-600 text-white font-black uppercase text-[10px] font-heading">RETRY SYNC</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-white/5">
                    <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">ID</th>
                    <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">EVENT IDENTITY</th>
                    <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">ORGANIZER</th>
                    <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">VENUE</th>
                    <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37] text-right">METADATA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-heading">
                  {events.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-20 text-center text-[#FDF5E6]/20 font-black uppercase tracking-widest text-xs">NO CHRONICLES UNVEILED</td>
                    </tr>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {events.map((event, idx) => (
                        <motion.tr 
                          key={event.id} 
                          initial={{ opacity: 0, x: -10 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          transition={{ delay: idx * 0.05 }} 
                          className="hover:bg-white/2 transition-colors group"
                        >
                          <td className="p-6 font-mono text-[10px] text-[#FDF5E6]/40">{event.id}</td>
                          <td className="p-6">
                            <div className="flex flex-col">
                              <span className="text-xs font-black uppercase text-[#FDF5E6]">{event.name}</span>
                              <span className="text-[7px] text-[#FDF5E6]/20 font-black uppercase mt-1 line-clamp-1 max-w-[250px]">
                                 {event.about || "NO DESCRIPTION PROVIDED"}
                              </span>
                            </div>
                          </td>
                          <td className="p-6 text-[10px] font-black uppercase text-[#D4AF37]/60">
                             <div className="flex items-center gap-2">
                                <User className="w-3 h-3 text-[#D4AF37]/40" />
                                {event.organizer || "GENERAL COUNCIL"}
                             </div>
                          </td>
                          <td className="p-6 text-[10px] font-black uppercase text-[#FDF5E6]/60">
                             <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-[#FDF5E6]/20" />
                                {event.venue || "TBA"}
                             </div>
                          </td>
                          <td className="p-6 text-right">
                             <div className="flex flex-col items-end gap-1">
                                <span className="px-2 py-0.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[7px] font-black uppercase text-[#D4AF37]">
                                  {event.category}
                                </span>
                                <span className="text-[7px] text-white/10 font-black uppercase tracking-widest">
                                   DECI: {new Date(event.createdAt).toLocaleDateString()}
                                </span>
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
               <h2 className="text-3xl font-black italic text-[#FDF5E6] uppercase tracking-tighter mb-8 font-heading">REVEAL NEW <span className="text-[#D4AF37]">CHRONICLE.</span></h2>
               <form onSubmit={handleCreateEvent} className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-[#D4AF37]">CHRONICLE ID (e.g. flag-1)</label>
                       <input type="text" required value={newEvent.id} onChange={(e) => setNewEvent({...newEvent, id: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 text-xs text-[#FDF5E6] outline-hidden focus:border-[#D4AF37] font-heading uppercase" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-[#D4AF37]">CHRONICLE NAME</label>
                       <input type="text" required value={newEvent.name} onChange={(e) => setNewEvent({...newEvent, name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 text-xs text-[#FDF5E6] outline-hidden focus:border-[#D4AF37] font-heading uppercase" />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-[#D4AF37]">CATEGORY</label>
                       <select value={newEvent.category} onChange={(e) => setNewEvent({...newEvent, category: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 text-xs text-[#FDF5E6] outline-hidden focus:border-[#D4AF37] font-heading uppercase">
                         <option value="Flagship">FLAGSHIP</option>
                         <option value="Formal">FORMAL</option>
                         <option value="Informal">INFORMAL</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-[#D4AF37]">VENUE</label>
                       <input type="text" value={newEvent.venue} onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 text-xs text-[#FDF5E6] outline-hidden focus:border-[#D4AF37] font-heading uppercase" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-[#D4AF37]">ORGANIZER</label>
                    <input type="text" value={newEvent.organizer} onChange={(e) => setNewEvent({...newEvent, organizer: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 text-xs text-[#FDF5E6] outline-hidden focus:border-[#D4AF37] font-heading uppercase" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-[#D4AF37]">SCROLL (ABOUT)</label>
                    <textarea value={newEvent.about} onChange={(e) => setNewEvent({...newEvent, about: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 text-xs text-[#FDF5E6] outline-hidden focus:border-[#D4AF37] h-24 resize-none font-heading uppercase" />
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setIsAddEventOpen(false)} className="flex-1 py-4 border-2 border-white/10 text-white text-[10px] font-black uppercase hover:bg-white/5 transition-all font-heading">ABANDON</button>
                    <button type="submit" className="flex-1 py-4 bg-[#D4AF37] text-black text-[10px] font-black uppercase hover:scale-105 transition-all font-heading">UNVEIL CHRONICLE</button>
                 </div>
               </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
