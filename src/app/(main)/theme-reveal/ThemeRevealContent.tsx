"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

export default function ThemeRevealContent() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* Background Graphic */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vh] bg-[#D4AF37]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] bg-white/5 blur-[120px] pointer-events-none" />

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center max-w-5xl mx-auto"
        >
          {/* Overline */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-[#D4AF37]/30 mb-8">
            <Zap className="w-3 h-3 text-[#D4AF37] fill-current" />
            <p className="text-[10px] uppercase font-black italic tracking-[0.4em] text-white">
              {SITE_CONFIG.edition}
            </p>
          </div>

          {/* Massive Title */}
          <h1 className="text-[12vw] md:text-[8vw] font-black italic text-white leading-[0.85] tracking-tighter mb-4">
             {SITE_CONFIG.shortName.toUpperCase()} <br/>
             <span className="text-[#D4AF37]">STORY UNVEILED.</span>
          </h1>

          {/* Subheader */}
          <p className="text-xl md:text-3xl text-white font-black italic uppercase tracking-tighter max-w-2xl mx-auto mb-16 border-l-4 border-[#D4AF37] pl-6 py-2 ml-auto mr-auto md:ml-0 md:mr-0 text-left">
            {SITE_CONFIG.tagline}
          </p>

          {/* Primary CTA */}
          <Link href={SITE_CONFIG.links.registration}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-6 bg-white text-black text-xl font-black italic uppercase tracking-tighter hover:bg-[#D4AF37] transition-colors flex items-center gap-4 mx-auto"
            >
              Secure Your Pass
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
           <span className="text-[10px] font-black italic uppercase tracking-widest text-white/20">Discovery</span>
           <div className="w-px h-12 bg-linear-to-b from-[#D4AF37] to-transparent" />
        </motion.div>
      </section>

      {/* ── Details Section ── */}
      <section className="relative py-40 px-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto">

          {/* Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24 mb-40">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
               <h3 className="text-[#D4AF37] font-black italic uppercase text-sm tracking-widest">Chronicle</h3>
               <p className="text-4xl md:text-5xl font-black italic text-white leading-none">{SITE_CONFIG.dates.short}</p>
               <p className="text-white/40 font-bold uppercase text-xs tracking-widest">{SITE_CONFIG.dates.long}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
               <h3 className="text-[#D4AF37] font-black italic uppercase text-sm tracking-widest">Territory</h3>
               <p className="text-4xl md:text-5xl font-black italic text-white leading-none">{SITE_CONFIG.venue.name}</p>
               <p className="text-white/40 font-bold uppercase text-xs tracking-widest">{SITE_CONFIG.venue.location}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
               <h3 className="text-[#D4AF37] font-black italic uppercase text-sm tracking-widest">Commencement</h3>
               <p className="text-4xl md:text-5xl font-black italic text-white leading-none">{SITE_CONFIG.time}</p>
               <p className="text-white/40 font-bold uppercase text-xs tracking-widest">INDIAN STANDARD TIME</p>
            </motion.div>
          </div>

          {/* Mission Block */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-start gap-12 md:gap-24"
          >
            <div className="w-32 h-32 md:w-64 md:h-64 border-4 border-[#D4AF37] flex items-center justify-center shrink-0">
               <Sparkles className="w-16 h-16 md:w-32 md:h-32 text-[#D4AF37] p-4" />
            </div>
            <div className="space-y-8">
              <h2 className="text-5xl md:text-7xl font-black italic text-white leading-none tracking-tighter uppercase">
                 Defining the <span className="text-[#D4AF37]">Standards</span> for 35 Years.
              </h2>
              <p className="text-xl md:text-2xl text-white/60 font-medium leading-relaxed max-w-3xl italic">
                 Bitotsav is not just a fest; it&apos;s a legacy that pulsates through the heart of Jharkhand. 
                 FOUR DAYS of relentless energy, world-class stages, and the brightest minds competing for the throne.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Action Section ── */}
      <section className="relative py-40 px-6 bg-[#D4AF37]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-left py-4">
                <h2 className="text-6xl md:text-8xl font-black italic text-black leading-none tracking-tighter mb-4 uppercase">
                    ARE YOU <br/>IN?
                </h2>
                <p className="text-black font-black italic uppercase text-lg tracking-widest opacity-60">
                    Registration Closing Soon for BIT Students
                </p>
            </div>

            <div className="flex flex-col gap-4 w-full md:w-auto">
                <Link href={SITE_CONFIG.links.registration} className="group">
                    <div className="px-16 py-8 bg-black text-white font-black italic text-3xl uppercase tracking-tighter flex items-center justify-between gap-12 hover:bg-white hover:text-black transition-all">
                        Register Now
                        <ArrowRight className="w-10 h-10 group-hover:translate-x-4 transition-transform" />
                    </div>
                </Link>
                <Link href={SITE_CONFIG.links.events} className="group">
                    <div className="px-16 py-8 border-4 border-black/10 text-black font-black italic text-3xl uppercase tracking-tighter flex items-center justify-between gap-12 hover:border-black transition-all">
                        Browse Events
                        <ArrowRight className="w-10 h-10 group-hover:translate-x-4 transition-transform" />
                    </div>
                </Link>
            </div>
        </div>
      </section>

      {/* ── Bottom Text ── */}
      <div className="py-20 text-center border-t border-white/5">
          <p className="text-[10px] font-black italic uppercase tracking-[1em] text-white/20">
             BITOTSAV 2026 / {SITE_CONFIG.edition} / {SITE_CONFIG.venue.name}
          </p>
      </div>

    </div>
  );
}