"use client";

import { motion } from "framer-motion";
import { PageWrapper } from "@/components/ui/page-wrapper";
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
    <PageWrapper className="pt-32 pb-20 bg-black min-h-screen relative overflow-hidden">
      {/* Texture Overlays */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none bg-linear-to-b from-transparent via-[#DFFF00]/5 to-transparent" />
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 mb-32 relative">
            <motion.div 
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute -top-20 -left-20 text-[20vw] font-black italic text-white/2 select-none pointer-events-none uppercase tracking-tighter"
            >
                ALLIANCE
            </motion.div>
            
            <div className="relative z-10 border-l-12 border-[#DFFF00] pl-12 py-10">
                <h1 className="text-8xl md:text-10xl font-black italic text-white uppercase leading-none tracking-tighter mb-6">
                    GLOBAL <span className="text-[#DFFF00]">PARTNER ARENA.</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/40 font-black italic uppercase tracking-tighter max-w-2xl border-l-2 border-white/10 pl-8">
                    POWERING THE SAGA THROUGH STRATEGIC PARTNERSHIPS AND GLOBAL COLLABORATION.
                </p>
            </div>
      </div>

      <div className="space-y-64 relative z-10">
        
        {/* Title Sponsor - "The Main Stage" */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-[10px] font-black italic uppercase tracking-[0.5em] text-[#DFFF00] mb-8 border-b border-[#DFFF00]/20 pb-4 inline-block">
            {"// MAIN STAGE HEADLINER"}
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative group overflow-hidden bg-[#DFFF00] p-12 md:p-32 flex flex-col md:flex-row items-center justify-between gap-16 shadow-[0_0_100px_rgba(223,255,0,0.1)]"
          >
            {/* Scanned Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat mix-blend-overlay" />
            
            <div className="absolute top-0 right-0 p-10 border-l-2 border-b-2 border-black/10">
                <Trophy className="w-12 h-12 text-black/20" />
            </div>
            
            <div className="space-y-10 relative z-10">
                <div className="inline-flex items-center gap-4 bg-black text-[#DFFF00] px-6 py-2 text-xs font-black italic uppercase tracking-[0.3em]">
                    <Star className="w-4 h-4 fill-current" />
                    PREMIUM ACCESS TITLE
                </div>
                <h2 className="text-7xl md:text-10xl font-black italic text-black leading-[0.8] tracking-tighter uppercase break-words">
                    JHARKHAND<br/>TOURISM.
                </h2>
                <div className="flex flex-col gap-2">
                    <div className="w-24 h-2 bg-black/40" />
                    <p className="text-black font-black italic uppercase tracking-[0.2em] text-xl">EXPLORE THE UNEXPLORED</p>
                </div>
            </div>

            <div className="w-64 h-64 md:w-[450px] md:h-[450px] border-[20px] border-black/5 flex items-center justify-center relative z-10 rotate-3 hover:rotate-0 transition-transform duration-700">
                <Zap className="w-32 h-32 md:w-64 md:h-64 text-black/10" />
                <div className="absolute inset-0 flex items-center justify-center font-black italic text-black/2 text-[15vw] select-none pointer-events-none uppercase tracking-widest -rotate-45">BOSS</div>
            </div>
          </motion.div>
        </div>

        {/* Global Partner Ticker - "The Backstage Pass" */}
        <div className="relative overflow-hidden py-32 bg-white/2 border-y-2 border-white/5">
            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-transparent via-[#DFFF00]/20 to-transparent" />
            <div className="max-w-7xl mx-auto px-6 mb-20 flex items-end justify-between">
                <div>
                   <h3 className="text-5xl md:text-7xl font-black italic text-white uppercase tracking-tighter leading-none">LINEUP PARTNERS</h3>
                   <div className="h-2 w-32 bg-[#DFFF00] mt-4" />
                </div>
                <div className="text-[10px] font-black italic uppercase tracking-[0.5em] text-[#DFFF00]/40">EST. 2026 // ACCESS STRATEGIC</div>
            </div>

            <div className="flex gap-12 animate-marquee hover:[animation-play-state:paused] py-10">
                {[...strategicPartners, ...strategicPartners].map((partner, i) => (
                    <div 
                        key={`${partner.name}-${i}`}
                        className="flex-shrink-0 w-80 p-12 bg-black border-2 border-white/10 group hover:border-[#DFFF00] transition-all duration-500 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="w-6 h-6 text-[#DFFF00] -rotate-45 group-hover:rotate-0 transition-transform" />
                        </div>
                        <div className="text-4xl font-black italic text-white group-hover:text-[#DFFF00] transition-colors mb-2">{partner.name}</div>
                        <div className="text-[10px] font-black italic text-white/30 uppercase tracking-[0.3em]">{partner.tier}</div>
                        <div className="mt-12 h-[1px] bg-white/10 group-hover:bg-[#DFFF00]/40 w-full transition-colors" />
                    </div>
                ))}
            </div>
        </div>

        {/* Legacy Archive - "Tour History" */}
        <div className="max-w-7xl mx-auto px-6">
           <div className="p-12 border-l-4 border-white/10 mb-24">
              <h3 className="text-2xl font-black italic text-white/30 uppercase tracking-[0.8em]">LEGACY ARCHIVE</h3>
           </div>
           
           <div className="grid grid-cols-2 lg:grid-cols-5 gap-y-20 gap-x-12">
                {pastSponsors.map((name, i) => (
                    <motion.div 
                        key={name}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.3 }}
                        whileHover={{ opacity: 1, y: -5 }}
                        className="flex flex-col gap-4 group cursor-pointer border-b border-white/5 pb-8 transition-all"
                    >
                        <span className="text-xs font-black italic text-[#DFFF00]/40 uppercase tracking-widest group-hover:text-[#DFFF00]">VOL {26 - i}</span>
                        <span className="text-3xl font-black italic text-white uppercase tracking-tighter transition-colors group-hover:text-[#DFFF00]">{name}</span>
                    </motion.div>
                ))}
           </div>
        </div>

        {/* Global CTA - "Backstage Access" */}
        <div className="max-w-7xl mx-auto px-6 pb-40">
            <Link href="mailto:sponsorship@bitotsav.in" className="group block relative overflow-hidden">
                <div className="p-20 md:p-40 bg-white text-black text-center relative overflow-hidden flex flex-col items-center gap-12 transition-all duration-700 group-hover:bg-[#DFFF00]">
                    <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
                    
                    <h2 className="text-7xl md:text-12xl font-black italic leading-[0.7] tracking-tighter uppercase relative z-10 group-hover:scale-105 transition-transform duration-700">
                        JOIN THE <br/>SAGA.
                    </h2>
                    
                    <div className="flex flex-col items-center gap-8 relative z-10">
                        <p className="max-w-2xl text-xl md:text-2xl font-black italic uppercase tracking-tighter opacity-70">
                            BECOME A PERMANENT NODE IN THE BIGGEST CONCERT NETWORK.
                        </p>
                        <div className="px-16 py-8 bg-black text-[#DFFF00] text-2xl font-black italic uppercase tracking-widest flex items-center gap-8 shadow-[20px_20px_0px_rgba(0,0,0,0.1)] group-hover:shadow-[20px_20px_0px_#000] transition-all">
                            COLLABORATE NOW
                            <ArrowRight className="w-10 h-10 group-hover:translate-x-4 transition-transform duration-500" />
                        </div>
                    </div>

                    {/* Watermark Section */}
                    <div className="absolute -bottom-20 -right-20 text-[40vw] font-black italic text-black/3 select-none pointer-events-none uppercase tracking-tighter leading-none group-hover:text-black/5 transition-colors">
                        SAGA
                    </div>
                </div>
            </Link>
        </div>

      </div>
    </PageWrapper>
  );
}
