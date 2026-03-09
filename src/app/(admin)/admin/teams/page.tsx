"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  Plus, 
  Minus,
  Users
} from "lucide-react";
import { getAdminTeams, updateTeamPoints } from "@/app/actions/admin";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { cn } from "@/lib/utils";

export default function AdminTeams() {
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = async () => {
    setLoading(true);
    const res = await getAdminTeams(page, search);
    if (res.success) {
      setTeams(res.data || []);
      setTotalPages((res as any).totalPages || 1);
    } else {
      setError(res.message || "Failed to fetch squadrons");
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchTeams(), 500);
    return () => clearTimeout(timer);
  }, [page, search]);

  const handleUpdatePoints = async (teamId: string, currentPoints: number, delta: number) => {
    const newPoints = Math.max(0, currentPoints + delta);
    const res = await updateTeamPoints(teamId, newPoints);
    if (res.success) fetchTeams();
  };

  return (
    <PageWrapper className="pt-12 pb-20 px-8 relative">
      <div className="absolute inset-0 z-0 pointer-events-none tapestry-pattern opacity-5" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-6xl font-black italic text-[#FDF5E6] uppercase tracking-tighter mb-1 select-none">
              SQUADRON <span className="text-[#D4AF37]">COMMAND.</span>
            </h1>
            <p className="text-[10px] text-[#D4AF37]/40 font-black uppercase tracking-[0.3em]">TEAM COORDINATION // COMPETITIVE TELEMETRY</p>
          </div>
        </div>

        <div className="flex gap-6 mb-12">
           <div className="flex-1 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]/40 group-focus-within:text-[#D4AF37] transition-colors" />
              <input 
               type="text" 
               placeholder="SEARCH BY TEAM NAME, CODE OR LEADER..."
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
              <p className="text-xs font-black text-[#D4AF37] uppercase tracking-[0.5em] animate-pulse">SYNCHRONIZING squadrons...</p>
            </div>
          ) : error ? (
            <div className="p-40 flex flex-col items-center justify-center text-center space-y-4">
              <AlertTriangle className="w-16 h-16 text-red-600" />
              <p className="text-red-600 font-black uppercase tracking-widest font-heading">ERROR: {error}</p>
              <button onClick={fetchTeams} className="px-6 py-2 bg-red-600 text-white font-black uppercase text-[10px] font-heading">RETRY SYNC</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-white/5">
                    <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">CODE</th>
                    <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">SQUADRON IDENTITY</th>
                    <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">COMMANDER</th>
                    <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">ENGAGEMENTS</th>
                    <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37] text-right">MINTED</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-heading">
                  {teams.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-20 text-center text-[#FDF5E6]/20 font-black uppercase tracking-widest text-xs">NO SQUADRONS FORMED</td>
                    </tr>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {teams.map((team, idx) => (
                        <motion.tr 
                          key={team.id} 
                          initial={{ opacity: 0, x: -10 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          transition={{ delay: idx * 0.05 }} 
                          className="hover:bg-white/2 transition-colors group"
                        >
                          <td className="p-6 font-mono text-xs font-black text-[#D4AF37]">{team.code}</td>
                          <td className="p-6">
                            <div className="flex flex-col">
                              <span className="text-xs font-black uppercase text-[#FDF5E6]">{team.name}</span>
                              <div className="flex items-center gap-3 mt-3">
                                 <button 
                                   onClick={() => handleUpdatePoints(team.id, team.points, -10)} 
                                   className="w-8 h-8 bg-white/5 border border-white/10 text-[10px] flex items-center justify-center hover:bg-red-600/20 hover:text-red-600 transition-all font-heading"
                                 >
                                   <Minus className="w-3 h-3" />
                                 </button>
                                 <div className="px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-black min-w-[80px] text-center">
                                    {team.points} <span className="text-[7px] ml-1 opacity-60">VALOR</span>
                                 </div>
                                 <button 
                                   onClick={() => handleUpdatePoints(team.id, team.points, 10)} 
                                   className="w-8 h-8 bg-white/5 border border-white/10 text-[10px] flex items-center justify-center hover:bg-green-600/20 hover:text-green-600 transition-all font-heading"
                                 >
                                   <Plus className="w-3 h-3" />
                                 </button>
                              </div>
                            </div>
                          </td>
                          <td className="p-6 text-[10px] font-black uppercase text-[#FDF5E6]/60">
                             <div className="flex items-center gap-2">
                                <Users className="w-3 h-3 text-[#D4AF37]/40" />
                                {team.leaderName || "UNKNOWN"}
                             </div>
                          </td>
                          <td className="p-6">
                             <div className="flex flex-wrap gap-2 max-w-[200px]">
                                {team.events && team.events.length > 0 ? (
                                  team.events.map((ev: string) => (
                                    <span key={ev} className="px-2 py-1 bg-white/5 border border-white/10 text-[7px] font-black uppercase text-[#FDF5E6]/40">
                                      {ev}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-[7px] font-black uppercase text-white/10 tracking-widest italic">NO ACTIVE MISSIONS</span>
                                )}
                             </div>
                          </td>
                          <td className="p-6 text-right text-[10px] text-[#FDF5E6]/20 font-black font-heading">
                            {new Date(team.createdAt).toLocaleDateString()}
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
