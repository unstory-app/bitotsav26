"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

export function Hero() {
  return (
    <section className="relative min-h-screen bg-[#1A0505] flex flex-col justify-center overflow-hidden pt-20 tapestry-bg">
      <div className="absolute inset-0 z-0 pointer-events-none tapestry-pattern opacity-10" />

      {/* Folk dancer decoration */}
      <div className="absolute right-0 bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-48 md:w-72 opacity-20 pointer-events-none select-none">
        <Image
          src="/assets/folks.png"
          alt=""
          width={400}
          height={320}
          className="w-full h-auto"
        />
      </div>

      {/* Background Graphic Elements */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
        {/* Top Label */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-4 md:mb-8 font-heading"
        >
          <div className="px-4 py-1 border border-[#D4AF37] text-[#D4AF37] text-[10px] font-black tracking-[0.4em] uppercase">
            THE 35TH EDITION • SINCE 1991
          </div>
        </motion.div>

        {/* Massive Interlocking Titles */}
        <div className="text-center select-none relative mb-12">
          {/* Main Visual - The Stamp */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative z-20 mb-8 md:mb-12 max-w-[90vw] md:max-w-[40vw] mx-auto"
          >
            <div className="relative group perspective-1000">
              <motion.div
                whileHover={{ rotateY: 5, rotateX: -5 }}
                className="transition-transform duration-700 stamp-edge p-6 bg-[#D4AF37] flex flex-col items-center justify-center min-h-[280px] md:min-h-[360px]"
              >
                <Image
                  src="/assets/bitotsav.png"
                  alt="Bitotsav"
                  width={500}
                  height={250}
                  className="w-full max-w-[360px] h-auto object-contain"
                  priority
                />
                <p className="text-[#1A0505]/60 font-heading text-sm md:text-xl tracking-[0.6em] font-black mt-4">
                  MMXXVI
                </p>
                <div className="mt-2 text-[#1A0505]/40 text-[9px] font-heading tracking-[0.4em] uppercase">
                  The 35th Edition
                </div>
              </motion.div>
              {/* Corner label */}
              <div className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 bg-[#1A0505] border-2 border-[#D4AF37] px-4 py-3 shadow-2xl z-30">
                <p className="text-[#D4AF37] font-heading text-[9px] tracking-[0.5em] font-black uppercase">
                  BIT Mesra
                </p>
                <p className="text-[#FDF5E6] font-heading text-[9px] tracking-[0.3em] font-black">
                  Ranchi, India
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA Area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col md:flex-row items-center gap-12"
        >
          <Link href={SITE_CONFIG.links.registration}>
            <button className="px-12 py-6 bg-[#D4AF37] text-[#1A0505] font-black text-xl uppercase tracking-tighter hover:bg-[#FDF5E6] transition-all duration-500 group flex items-center gap-4 font-heading stamp-edge border-2 border-transparent">
              Claim Your Passage
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </Link>

          <div className="text-center md:text-left">
            <p className="text-[#D4AF37] font-black uppercase tracking-[0.2em] text-2xl font-heading">
              {SITE_CONFIG.dates.short}
            </p>
            <p className="text-[#FDF5E6]/40 font-bold uppercase text-[10px] tracking-[0.5em] font-heading">
              {SITE_CONFIG.venue.full}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Heritage Markings */}
      <div className="absolute bottom-12 left-0 w-full overflow-hidden whitespace-nowrap opacity-10 pointer-events-none font-heading">
        <div className="flex gap-20 animate-marquee text-[12vw] font-black text-[#FDF5E6] uppercase">
          {[...Array(4)].map((_, i) => (
            <span key={i}>HERITAGE • CULTURE • TRADITION •</span>
          ))}
        </div>
      </div>

      {/* Corner Labels */}
      <div className="absolute bottom-8 left-8 hidden md:block font-heading">
        <p className="text-[10px] text-[#D4AF37]/40 tracking-[0.5em] uppercase vertical-text origin-left rotate-180">
          Gaatha // The 35th Edition
        </p>
      </div>
      <div className="absolute top-24 right-8 hidden md:block border border-[#D4AF37]/20 p-2 heritage-border">
        <div className="w-32 h-32 flex items-center justify-center p-2 bg-[#1A0505] tapestry-bg">
          <div className="w-full h-full border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-black text-xs text-center leading-none uppercase font-heading tracking-widest">
            Artisan
            <br />
            Heritage
            <br />
            Pass
          </div>
        </div>
      </div>
    </section>
  );
}
