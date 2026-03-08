"use client";

import { motion } from "framer-motion";
import { Users, Calendar, Trophy, Zap } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { SITE_CONFIG } from "@/config/site";

const stats = [
  { label: "Years of Legacy", value: "30+", icon: Calendar },
  { label: "Expected Footfall", value: "10,000+", icon: Users },
  { label: "Live Registrations", value: "1600+", icon: Trophy },
  { label: "Energy Level", value: "Absolute", icon: Zap },
];

export default function AboutContent() {
  return (
    <PageWrapper>
      <SectionHeader 
        title="THE PROTOCOL." 
        subtitle="Operational history and user engagement metrics of the saga."
      />

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-32">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative p-10 bg-white/5 border border-white/10 group overflow-hidden"
          >
            {/* Hover Background */}
            <div className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            
            <div className="relative z-10 space-y-4">
                <stat.icon className="w-8 h-8 text-[#D4AF37] group-hover:text-black transition-colors" />
                <div className="text-4xl md:text-6xl font-black italic tracking-tighter text-white group-hover:text-black transition-colors uppercase leading-none">
                {stat.value}
                </div>
                <div className="text-[10px] font-black italic uppercase tracking-[0.2em] text-white/40 group-hover:text-black/60 transition-colors">
                {stat.label}
                </div>
            </div>

            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>

      {/* Story Section */}
      <div className="max-w-5xl mx-auto mb-32 grid grid-cols-1 md:grid-cols-2 gap-20">
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
        >
            <h3 className="text-5xl md:text-7xl font-black italic text-white uppercase tracking-tighter leading-none">
                WHENCE IT <br/> <span className="text-[#D4AF37]">ORIGINATED.</span>
            </h3>
            <div className="w-20 h-2 bg-[#D4AF37]" />
        </motion.div>

        <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8 font-black italic uppercase tracking-tighter text-white/50 text-lg md:text-xl"
        >
            <p className="text-white">
                Since 1992, {SITE_CONFIG.shortName} has been the ultimate intersection of culture, technology, and sheer grit.
            </p>
            <p>
                From limited technical transmissions to a multi-dimensional saga, we have evolved into Eastern India&apos;s most formidable festival platform.
            </p>
            <p>
                Bitotsav is not just an event; it is a synchronized execution of talent, creativity, and legacy code passed down through generations.
            </p>
        </motion.div>
      </div>

      {/* Flagship Ticker */}
      <div className="w-full bg-white py-12 mb-32 overflow-hidden flex items-center">
            <div className="flex gap-20 animate-marquee whitespace-nowrap">
                {[...Array(10)].map((_, i) => (
                    <span key={i} className="text-4xl md:text-6xl font-black italic text-black uppercase tracking-tighter">
                        HERITAGE NITE — BAND NITE — EDM NITE — PRO NITE — 
                    </span>
                ))}
            </div>
      </div>

      {/* Night Events Teaser */}
      <div className="max-w-7xl mx-auto bg-black border-4 border-[#D4AF37] p-12 md:p-24 relative overflow-hidden group mb-32">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
             <div className="max-w-2xl text-center md:text-left">
                <div className="inline-block bg-[#D4AF37] px-3 py-1 mb-6 text-black text-[10px] font-black italic uppercase tracking-[0.2em]">
                    STAR_NIGHTS.2026
                </div>
                <h3 className="text-5xl md:text-8xl font-black italic text-white mb-6 uppercase tracking-tighter leading-none">THE MAIN <br className="hidden md:block" /> STAGE.</h3>
                <p className="text-lg md:text-xl text-white/40 font-black italic uppercase tracking-tighter">
                    Witness legendary performances from global icons. The lineup is strictly classified. Prepare for the impact.
                </p>
             </div>
             
             <div className="w-full md:w-auto">
                <div className="px-16 py-8 bg-[#D4AF37] text-black font-black italic text-2xl uppercase tracking-widest text-center">
                    AWAITING_SIGNAL
                </div>
             </div>
        </div>

        {/* Decorative Background Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black italic text-white/5 pointer-events-none select-none uppercase tracking-tighter leading-none">
            SAGA
        </div>
      </div>
    </PageWrapper>
  );
}
