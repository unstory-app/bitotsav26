"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { Marquee } from "@/components/ui/marquee";

export function MobileHero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-black md:hidden pt-20">
      
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-[300px] bg-[#DFFF00]/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full px-6 flex flex-col items-center">
        
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 border border-white/20 px-4 py-1.5"
        >
          <span className="text-[10px] font-black italic tracking-[0.3em] text-white uppercase">
             {SITE_CONFIG.edition}
          </span>
        </motion.div>

        {/* Title */}
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-7xl font-black italic leading-[0.8] tracking-tighter text-white mb-2"
          >
            BITOTSAV
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-block bg-[#DFFF00] px-6 py-2 -rotate-2"
          >
            <h2 className="text-5xl font-black italic text-black">
              2026
            </h2>
          </motion.div>
        </div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-[#DFFF00] font-black italic uppercase text-lg">
            {SITE_CONFIG.dates.short}
          </p>
          <p className="text-white/40 font-bold uppercase text-[10px] tracking-widest mt-1">
            {SITE_CONFIG.venue.name}
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 w-full"
        >
          <Link href={SITE_CONFIG.links.registration}>
            <button className="w-full py-5 bg-white text-black font-black italic text-lg uppercase tracking-tighter hover:bg-[#DFFF00] transition-colors flex items-center justify-center gap-3">
              Register Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Marquee Ticker */}
      <div className="pb-10">
        <Marquee 
          items={["BITOTSAV", "2026", "REGISTER NOW", "LIVE SOON"]} 
          speed="fast" 
          variant="yellow" 
          className="py-3" 
        />
      </div>

    </section>
  );
}
