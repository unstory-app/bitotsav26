"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { SITE_CONFIG } from "@/config/site";

const locations = [
  "RANCHI", "BIT MESRA", "MAIN ATHLETIC GROUND", "BITOTSAV ARENA", 
  "CULTURAL SPECTACLE", "TECHNICAL EXPLOSION", "SPORTS MANIA"
];

export function Hero() {
  return (
    <section className="relative min-h-screen bg-black flex flex-col justify-between overflow-hidden pt-20">
      
      {/* Background Graphic Elements */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-[#DFFF00]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
        
        {/* Top Label */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-12 h-12 rounded-full bg-[#DFFF00] flex items-center justify-center text-black">
            <Play className="w-5 h-5 fill-current ml-1" />
          </div>
          <span className="text-sm font-black italic tracking-widest text-white/60 uppercase">
             Live Experience / {SITE_CONFIG.edition}
          </span>
        </motion.div>

        {/* Massive Interlocking Titles */}
        <div className="text-center select-none">
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[12vw] md:text-[8vw] font-black leading-[0.8] tracking-tighter text-white mb-2 italic"
          >
            BITOTSAV
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
            className="inline-block bg-[#DFFF00] px-6 py-2 md:px-12 md:py-4 -mt-4 mb-4"
          >
            <h2 className="text-[10vw] md:text-[6vw] font-black leading-none text-black italic">
              2026
            </h2>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-[12vw] md:text-[8vw] font-black leading-[0.8] tracking-tighter text-white italic outline-text neon-stroke"
          >
            FESTIVAL
          </motion.h1>
        </div>

        {/* CTA Area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 flex flex-col md:flex-row items-center gap-8"
        >
          <Link href={SITE_CONFIG.links.registration}>
            <button className="px-12 py-6 bg-white text-black font-black italic text-xl uppercase tracking-tighter hover:bg-[#DFFF00] transition-colors group flex items-center gap-4">
              Get Your Pass
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </Link>
          
          <div className="text-left">
            <p className="text-[#DFFF00] font-black italic uppercase tracking-tight text-xl">
              {SITE_CONFIG.dates.short}
            </p>
            <p className="text-white/40 font-bold uppercase text-xs tracking-[0.2em]">
              {SITE_CONFIG.venue.full}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Marquee Ticker at Bottom */}
      <div className="pb-12 -rotate-1 scale-105">
        <Marquee items={locations} speed="medium" variant="yellow" />
      </div>

      {/* Corner Labels (Concert Style) */}
      <div className="absolute bottom-8 left-8 hidden md:block">
        <p className="text-[10px] text-white/30 tracking-[0.5em] uppercase vertical-text origin-left rotate-180">
          Cultural / Technical / Sports
        </p>
      </div>
      <div className="absolute top-24 right-8 hidden md:block border border-[#DFFF00]/20 p-4">
        <div className="w-32 h-32 border-2 border-[#DFFF00] flex items-center justify-center p-2">
           <div className="w-full h-full bg-[#DFFF00]/10 flex items-center justify-center text-[#DFFF00] font-black italic text-lg text-center leading-none">
             WORLD<br/>CLASS<br/>STAGE
           </div>
        </div>
      </div>

    </section>
  );
}
