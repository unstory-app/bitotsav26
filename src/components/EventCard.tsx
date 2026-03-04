"use client";

import { motion } from "framer-motion";
import { MapPin, Users, ArrowRight } from "lucide-react";
import { Event } from "@/types";
import Link from "next/link";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`} className="block h-full group">
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -5 }}
        viewport={{ once: true }}
        className="relative bg-black border-2 border-white/10 h-full flex flex-col group transition-all duration-500 overflow-hidden"
      >
        {/* Texture Overlay (Scanned/Paper) */}
        <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat mix-blend-overlay" />
        
        {/* VIP PASS Label (Vertical) */}
        <div className="absolute top-0 right-0 h-full w-8 border-l border-white/10 flex items-center justify-center pointer-events-none">
            <span className="text-[10px] font-black italic uppercase tracking-[0.5em] text-white/20 rotate-180 [writing-mode:vertical-lr]">
              VIP_PASS_ACCESS_2026
            </span>
        </div>

        <div className="p-10 flex flex-col h-full relative z-10 pr-16 text-left">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div className="flex flex-col">
              <span className="text-[#DFFF00] text-[10px] font-black italic uppercase tracking-[0.4em] mb-1">
                {"// "}{event.category.toUpperCase()}
              </span>
              <div className="h-1 w-12 bg-[#DFFF00] group-hover:w-24 transition-all duration-500" />
            </div>
            <div className="w-14 h-14 border-2 border-[#DFFF00]/20 flex items-center justify-center group-hover:bg-[#DFFF00] group-hover:border-transparent transition-all duration-500 rounded-full hover:scale-110">
               <ArrowRight className="w-6 h-6 -rotate-45 group-hover:rotate-0 group-hover:text-black transition-transform duration-500" />
            </div>
          </div>
          
          {/* Title - Concert Poster Style */}
          <div className="mb-8">
            <h3 className="text-4xl md:text-5xl font-black italic text-white uppercase leading-[0.85] tracking-tighter group-hover:text-[#DFFF00] transition-colors duration-500 break-words">
              {event.name}
            </h3>
          </div>
          
          {/* Description Snippet */}
          <p className="text-white/40 text-[10px] font-black italic uppercase tracking-widest mb-10 leading-relaxed border-l-2 border-[#DFFF00]/30 pl-4 group-hover:border-[#DFFF00] transition-colors">
            JOIN_US_AT_{event.venue.toUpperCase()}_FOR_AN_UNFORGETTABLE_EXPERIENCE.
          </p>
          
          {/* Footer Info / Ticker-Tape Look */}
          <div className="mt-auto pt-8 border-t-2 border-white/10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-[#DFFF00]" />
                <span className="text-[10px] font-black italic uppercase text-white/80 tracking-[0.2em]">{event.organizer}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#DFFF00]" />
                <span className="text-[10px] font-black italic uppercase text-white/80 tracking-[0.2em]">{event.venue}</span>
              </div>
            </div>

            {/* Micro Ticker Decor */}
            <div className="h-6 bg-[#DFFF00]/5 flex items-center overflow-hidden pointer-events-none group-hover:bg-[#DFFF00]/10 transition-colors">
              <div className="whitespace-nowrap flex gap-8 animate-marquee-fast">
                {[...Array(3)].map((_, i) => (
                  <span key={i} className="text-[8px] font-black italic text-[#DFFF00]/40 uppercase tracking-widest">
                    ★ ADMIT_ONE ★ CONFIRMED ★ 2026_BITOTSAV ★ SECURE_ENTRY ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hover "Scanned" Overlay */}
        <div className="absolute inset-0 bg-[#DFFF00] opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500 pointer-events-none" />
        <div className="absolute -bottom-full left-0 w-full h-full bg-[#DFFF00] group-hover:bottom-0 transition-all duration-700 ease-[0.16,1,0.3,1] opacity-0 group-hover:opacity-5 flex items-end p-10 pointer-events-none">
            <span className="text-8xl font-black italic text-white/10 leading-none uppercase">DETAILS</span>
        </div>
      </motion.div>
    </Link>
  );
}
