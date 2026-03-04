"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/SectionHeader";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { SITE_CONFIG } from "@/config/site";
import { ArrowRight, Star, Trophy, Zap } from "lucide-react";
import Link from "next/link";

const pastSponsors = [
  "Jharkhand Tourism", "CMPDI", "SBI", "RedBull", "Nestle", "Coca Cola", "NTPC", "SAIL", "Jio", "Radio Mirchi"
];

const strategicPartners = [
  { name: "CMPDI", tier: "Gold Partner" },
  { name: "SBI", tier: "Banking Partner" },
  { name: "RedBull", tier: "Energy Partner" },
  { name: "Nestle", tier: "Food Partner" },
];

export default function SponsorsContent() {
  return (
    <PageWrapper className="pt-32 pb-20">
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 mb-32">
        <SectionHeader 
          title="THE ALLIANCE." 
          subtitle="Strategic partners powering the biggest concert interface in the region."
          align="left"
        />
      </div>

      <div className="space-y-40">
        
        {/* Title Sponsor - High Impact Banner */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative group overflow-hidden bg-[#DFFF00] p-12 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="absolute top-0 right-0 p-6 border-l border-b border-black/10">
                <span className="text-[10px] font-black italic uppercase tracking-[0.5em] text-black/40">Title Sponsor 2026</span>
            </div>
            
            <div className="space-y-6 relative z-10">
                <div className="inline-flex items-center gap-2 bg-black text-[#DFFF00] px-3 py-1 text-[10px] font-black italic uppercase tracking-widest">
                    <Star className="w-3 h-3 fill-current" />
                    PREMIUM PARTNER
                </div>
                <h2 className="text-6xl md:text-9xl font-black italic text-black leading-none tracking-tighter uppercase">
                    JHARKHAND<br/>TOURISM.
                </h2>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-1 bg-black/20" />
                    <p className="text-black font-black italic uppercase tracking-widest">Explore the Unexplored</p>
                </div>
            </div>

            <div className="w-48 h-48 md:w-80 md:h-80 border-8 border-black/5 flex items-center justify-center relative z-10">
                <Zap className="w-24 h-24 md:w-40 md:h-40 text-black/10" />
                <div className="absolute inset-0 flex items-center justify-center font-black italic text-black/5 text-[10vw] select-none pointer-events-none">TITLE</div>
            </div>

            {/* Decorative Marquee in Header BG if we had space, but let's keep it clean */}
          </div>
        </div>

        {/* Strategic Grid */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-6 mb-16">
              <Trophy className="w-8 h-8 text-[#DFFF00]" />
              <h3 className="text-4xl md:text-5xl font-black italic text-white uppercase tracking-tighter">Lineup Partners</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {strategicPartners.map((partner, i) => (
              <motion.div 
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group p-10 bg-white/5 border border-white/10 hover:border-[#DFFF00] transition-all relative overflow-hidden"
              >
                <div className="text-3xl font-black italic text-white mb-2 group-hover:text-[#DFFF00] transition-colors uppercase leading-none">{partner.name}</div>
                <div className="text-[10px] font-black italic text-[#DFFF00]/40 uppercase tracking-[0.2em] group-hover:text-[#DFFF00] transition-colors">{partner.tier}</div>
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] font-black italic text-white uppercase tracking-widest">Partner Profile</span>
                    <ArrowRight className="w-4 h-4 text-[#DFFF00]" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Legacy Partners (Past) */}
        <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-40">
           <h3 className="text-xl font-black italic text-white/20 uppercase tracking-[1em] mb-20 text-center">Legacy Alliance</h3>
           <div className="flex flex-wrap justify-center gap-x-20 gap-y-12">
                {pastSponsors.map((name) => (
                    <div key={name} className="flex flex-col items-center gap-2 group cursor-pointer opacity-30 hover:opacity-100 transition-all">
                        <span className="text-2xl font-black italic text-white uppercase tracking-tighter group-hover:text-[#DFFF00]">{name}</span>
                        <div className="w-0 h-1 bg-[#DFFF00] group-hover:w-full transition-all duration-500" />
                    </div>
                ))}
           </div>
        </div>

        {/* Partnership High-Impact CTA */}
        <div className="max-w-7xl mx-auto px-6">
            <Link href="mailto:sponsorship@bitotsav.in" className="group block">
                <div className="p-16 md:p-32 bg-white text-black text-center relative overflow-hidden flex flex-col items-center gap-8 hover:bg-[#DFFF00] transition-colors">
                    <h2 className="text-6xl md:text-9xl font-black italic leading-none tracking-tighter uppercase relative z-10">
                        JOIN THE <br/>SAGA.
                    </h2>
                    <p className="max-w-xl text-lg md:text-xl font-black italic uppercase tracking-tighter opacity-60 relative z-10">
                        Become a part of the legacy. Partner with {SITE_CONFIG.name} and reach 20k+ premium attendees.
                    </p>
                    <div className="px-12 py-6 bg-black text-white text-xl font-black italic uppercase tracking-tighter flex items-center gap-6 group-hover:translate-y-[-10px] transition-transform relative z-10">
                        Collaborate Now
                        <ArrowRight className="w-8 h-8 group-hover:translate-x-4 transition-transform" />
                    </div>

                    {/* BG Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center text-[30vw] font-black italic text-black/5 select-none pointer-events-none uppercase tracking-tighter leading-none">
                        ALLIANCE
                    </div>
                </div>
            </Link>
        </div>

      </div>
    </PageWrapper>
  );
}
