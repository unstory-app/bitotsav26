"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  Medal,
  Award,
  Users,
  Zap,
} from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { SITE_CONFIG } from "@/config/site";

const teams = [
  { rank: 1, name: "Bits & Bytes", score: 12500, institute: "BIT Mesra", status: "Active" },
  { rank: 2, name: "Quantum Coders", score: 11200, institute: "IIT Kharagpur", status: "Active" },
  { rank: 3, name: "Neural Network", score: 10800, institute: "NIT Trichy", status: "Active" },
  { rank: 4, name: "Cyber Punks", score: 9500, institute: "BIT Mesra", status: "Active" },
  { rank: 5, name: "Tech Titans", score: 9200, institute: "IIIT Hyderabad", status: "Active" },
  { rank: 6, name: "Logic Legends", score: 8800, institute: "DTU", status: "Active" },
  { rank: 7, name: "Code Crusaders", score: 8500, institute: "NSUT", status: "Active" },
  { rank: 8, name: "Pixel Perfect", score: 8100, institute: "BIT Mesra", status: "Active" },
];

export default function LeaderboardContent() {
  return (
    <PageWrapper className="pt-32 pb-20">
      
      <div className="max-w-7xl mx-auto px-6 mb-32">
        <SectionHeader
          title="THE LEGEND."
          subtitle="Real-time competitive metrics and the hall of fame."
          align="left"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-40">
        
        {/* Top 3 Podium - High Energy Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-end">
          
          {/* Rank 2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:order-1 bg-white/5 border border-white/10 p-12 text-center space-y-6 relative overflow-hidden"
          >
             <div className="absolute top-0 left-0 w-full h-1 bg-white/20" />
             <Medal className="w-16 h-16 text-white/40 mx-auto" />
             <div className="space-y-2">
                <div className="text-xl font-black italic text-white/40 uppercase tracking-widest">Rank 02</div>
                <h3 className="text-4xl font-black italic text-white leading-none uppercase">{teams[1].name}</h3>
                <p className="text-[10px] font-black italic text-white/20 tracking-widest uppercase">{teams[1].institute}</p>
             </div>
             <div className="text-2xl font-black italic text-white bg-white/5 py-4 border border-white/5">
                {teams[1].score.toLocaleString()} PTS
             </div>
          </motion.div>

          {/* Rank 1 - Primary Yellow */}
          <motion.div
            initial={{ opacity: 0, scale: 1 }}
            whileInView={{ opacity: 1, scale: 1.05 }}
            viewport={{ once: true }}
            className="md:order-2 bg-[#DFFF00] p-16 text-center space-y-8 relative overflow-hidden shadow-[0_0_80px_rgba(223,255,0,0.15)] z-10"
          >
             <div className="absolute top-0 left-0 w-full h-2 bg-black/10" />
             <Trophy className="w-24 h-24 text-black mx-auto" />
             <div className="space-y-4">
                <div className="text-2xl font-black italic text-black/40 uppercase tracking-[0.3em]">CHAMPION</div>
                <h3 className="text-6xl font-black italic text-black leading-none uppercase tracking-tighter">{teams[0].name}</h3>
                <p className="text-[12px] font-black italic text-black/60 tracking-widest uppercase">{teams[0].institute}</p>
             </div>
             <div className="text-4xl font-black italic text-black bg-black/5 py-6 border border-black/10">
                {teams[0].score.toLocaleString()} PTS
             </div>
          </motion.div>

          {/* Rank 3 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:order-3 bg-white/5 border border-white/10 p-12 text-center space-y-6 relative overflow-hidden"
          >
             <div className="absolute top-0 left-0 w-full h-1 bg-white/10" />
             <Award className="w-16 h-16 text-white/20 mx-auto" />
             <div className="space-y-2">
                <div className="text-xl font-black italic text-white/40 uppercase tracking-widest">Rank 03</div>
                <h3 className="text-4xl font-black italic text-white leading-none uppercase">{teams[2].name}</h3>
                <p className="text-[10px] font-black italic text-white/20 tracking-widest uppercase">{teams[2].institute}</p>
             </div>
             <div className="text-2xl font-black italic text-white bg-white/5 py-4 border border-white/5">
                {teams[2].score.toLocaleString()} PTS
             </div>
          </motion.div>

        </div>

        {/* Global Standings Table */}
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b-4 border-white/5 pb-8">
                <div className="space-y-2">
                    <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">GLOBAL STANDINGS</h2>
                    <p className="text-white/40 font-black italic uppercase text-xs tracking-[0.2em]">{SITE_CONFIG.shortName} Live Metrics Engine</p>
                </div>
                <div className="flex gap-4">
                    {[
                        { icon: Users, label: "Active", val: "1.4k" },
                        { icon: Zap, label: "Ping", val: "12ms" }
                    ].map((stat, i) => (
                        <div key={i} className="px-6 py-3 bg-white/5 border border-white/10 flex items-center gap-4">
                            <stat.icon className="w-4 h-4 text-[#DFFF00]" />
                            <div className="text-left">
                                <div className="text-[8px] font-black italic text-white/20 uppercase tracking-widest">{stat.label}</div>
                                <div className="text-sm font-black italic text-white uppercase">{stat.val}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
              {teams.slice(3).map((team) => (
                <motion.div
                  key={team.rank}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="group grid grid-cols-12 gap-8 px-10 py-8 bg-white/2 border border-white/5 items-center hover:bg-[#DFFF00] transition-all duration-500 cursor-default"
                >
                  <div className="col-span-1 text-2xl font-black italic text-white/20 group-hover:text-black/20">
                    #{team.rank.toString().padStart(2, "0")}
                  </div>
                  <div className="col-span-7 md:col-span-5">
                    <div className="text-2xl font-black italic text-white group-hover:text-black uppercase leading-none mb-1">
                      {team.name}
                    </div>
                    <div className="text-[10px] font-black italic text-white/40 group-hover:text-black/40 uppercase tracking-widest">
                      {team.institute}
                    </div>
                  </div>
                  <div className="col-span-4 md:col-span-3 text-right md:text-left text-sm font-black italic text-white/20 uppercase tracking-widest hidden md:block group-hover:text-black/20">
                    STATUS: {team.status}
                  </div>
                  <div className="col-span-4 md:col-span-3 text-right text-3xl font-black italic text-white group-hover:text-black tabular-nums">
                    {team.score.toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center pt-10">
                <button className="px-12 py-5 border-2 border-white/10 text-white font-black italic uppercase text-lg tracking-widest hover:bg-white hover:text-black transition-all">
                    Load More Standings
                </button>
            </div>
        </div>

      </div>
    </PageWrapper>
  );
}
