"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

export function CTA() {
  return (
    <section className="py-40 bg-[#DFFF00] relative overflow-hidden flex items-center justify-center">
      
      {/* Decorative Ticker Tape Borders */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-black flex items-center overflow-hidden">
        <div className="flex gap-20 animate-marquee whitespace-nowrap">
            {[...Array(10)].map((_, i) => (
                <span key={i} className="text-[10px] font-black italic text-[#DFFF00] uppercase tracking-[0.5em]">
                    SECURE ACCESS — AUTHORIZE NOW — {SITE_CONFIG.shortName.toUpperCase()} 2026 — 
                </span>
            ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-8 bg-black flex items-center overflow-hidden">
        <div className="flex gap-20 animate-marquee whitespace-nowrap direction-reverse">
            {[...Array(10)].map((_, i) => (
                <span key={i} className="text-[10px] font-black italic text-[#DFFF00] uppercase tracking-[0.5em]">
                    {SITE_CONFIG.edition.toUpperCase()} — THE ENDLESS SAGA — LIMITLESS ENERGY — 
                </span>
            ))}
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center px-6 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-10"
          >
              <div className="w-24 h-24 bg-black flex items-center justify-center transform rotate-45 border-4 border-black group-hover:rotate-90 transition-transform duration-700">
                  <Zap className="w-10 h-10 text-[#DFFF00] -rotate-45" />
              </div>

              <h2 className="text-6xl md:text-9xl font-black italic text-black uppercase tracking-tighter leading-[0.85]">
                THE SAGA <br className="hidden md:block"/> AWAITS YOU.
              </h2>
              
              <p className="max-w-2xl text-xl font-black italic uppercase tracking-tighter text-black/60">
                  Be part of the grandest unification of culture, sports, and tech. The protocol is open. Secure your digital pass today.
              </p>

              <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
                <Link href="/login" className="px-16 py-8 bg-black text-[#DFFF00] text-2xl font-black italic uppercase tracking-widest hover:scale-105 transition-all">
                    Get Digital Pass
                </Link>
                <Link href="/events" className="px-16 py-8 border-4 border-black text-black text-2xl font-black italic uppercase tracking-widest hover:bg-black hover:text-[#DFFF00] transition-all">
                    Explore Saga
                </Link>
              </div>
          </motion.div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center text-[30vw] font-black italic text-black/5 select-none pointer-events-none uppercase tracking-tighter leading-none">
        {SITE_CONFIG.shortName}
      </div>
    </section>
  );
}
