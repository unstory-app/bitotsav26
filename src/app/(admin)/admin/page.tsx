"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Ticket, 
  Trophy, 
  Calendar,
  Activity,
  ArrowUpRight,
  ShieldAlert,
  FolderTree
} from "lucide-react";
import { 
  getAdminUsers, 
  getAdminTickets, 
  getAdminTeams, 
  getAdminEvents 
} from "@/app/actions/admin";
import { PageWrapper } from "@/components/ui/page-wrapper";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    users: 0,
    tickets: 0,
    teams: 0,
    events: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [u, tk, tm, ev] = await Promise.all([
        getAdminUsers(1),
        getAdminTickets(1),
        getAdminTeams(1),
        getAdminEvents(1)
      ]);
      
      setStats({
        users: u.success ? (u as any).totalRows || 0 : 0, // Need to add totalRows to actions or use default
        tickets: tk.success ? (tk as any).totalRows || 0 : 0,
        teams: tm.success ? (tm as any).totalRows || 0 : 0,
        events: ev.success ? (ev as any).totalRows || 0 : 0
      });
      setLoading(false);
    }
    loadStats();
  }, []);

  const cards = [
    { label: "Total Architects", value: stats.users, icon: Users, color: "text-blue-500", href: "/admin/users" },
    { label: "Tickets Minted", value: stats.tickets, icon: Ticket, color: "text-[#D4AF37]", href: "/admin/tickets" },
    { label: "Active Squadrons", value: stats.teams, icon: Trophy, color: "text-purple-500", href: "/admin/teams" },
    { label: "Gaatha Events", value: stats.events, icon: Calendar, color: "text-green-500", href: "/admin/events" },
    { label: "Team Event Matrix", value: "CSV", icon: FolderTree, color: "text-cyan-400", href: "/admin/team-events" },
  ];

  return (
    <PageWrapper className="pt-12 pb-20 px-8 relative">
      <div className="absolute inset-0 z-0 pointer-events-none tapestry-pattern opacity-5" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12">
          <h1 className="text-6xl font-black italic text-[#FDF5E6] uppercase tracking-tighter mb-1">
            NEXUS <span className="text-[#D4AF37]">OVERVIEW.</span>
          </h1>
          <p className="text-[10px] text-[#D4AF37]/40 font-black uppercase tracking-[0.3em]">COMMAND CENTER // OPERATIONAL INTELLIGENCE</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 p-8 group hover:border-[#D4AF37]/50 transition-all cursor-pointer"
              onClick={() => window.location.href = card.href}
            >
              <div className="flex justify-between items-start mb-6">
                <card.icon className={cn("w-8 h-8", card.color)} />
                <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-[#D4AF37] transition-all" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{card.label}</p>
              <h3 className="text-4xl font-black text-white italic tracking-tighter">
                {loading ? "---" : card.value}
              </h3>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
             <div className="bg-white/5 border border-white/10 p-10 h-96 flex flex-col justify-center items-center text-center">
                <Activity className="w-12 h-12 text-[#D4AF37] mb-6 animate-pulse" />
                <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter mb-2">SYSTEM TELEMETRY</h3>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest max-w-xs leading-relaxed">
                  Real-time analytics and user behavior patterns will manifest here as the Gaatha unfolds.
                </p>
             </div>
          </div>

          <div className="space-y-6">
             <div className="bg-[#D4AF37]/5 border-2 border-[#D4AF37]/20 p-8 space-y-6">
                <div className="flex items-center gap-3">
                   <ShieldAlert className="w-5 h-5 text-[#D4AF37]" />
                   <h4 className="text-xs font-black text-white uppercase tracking-widest">SECURITY PROTOCOLS</h4>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-white/60">
                      <span>Access Level</span>
                      <span className="text-[#D4AF37]">ROOT</span>
                   </div>
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-white/60">
                      <span>Session Entropy</span>
                      <span className="text-[#D4AF37]">HIGH</span>
                   </div>
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-white/60">
                      <span>Encryption</span>
                      <span className="text-[#D4AF37]">AES-256</span>
                   </div>
                </div>
                <button className="w-full py-4 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all">
                   AUDIT LOGS
                </button>
             </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

// Helper for classes in Overview
import { cn } from "@/lib/utils";
