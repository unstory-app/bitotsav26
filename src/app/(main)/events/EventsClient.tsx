"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EventCard } from "@/components/EventCard";
import { events } from "@/lib/data/events";
import { cn } from "@/lib/utils";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { SITE_CONFIG } from "@/config/site";

const categories = ["All", "Flagship", "Formal", "Informal"];

export default function EventsClient() {
  const [filter, setFilter] = useState("All");

  const filteredEvents = filter === "All" 
    ? events 
    : events.filter(event => event.category === filter);

  return (
    <PageWrapper className="pt-32 pb-20 bg-[#1A0505] min-h-screen relative overflow-hidden tapestry-bg">
      {/* Texture Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none tapestry-pattern opacity-10" />
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none bg-linear-to-b from-transparent via-[#D4AF37]/5 to-transparent" />

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 mb-32 relative">
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute -top-10 -left-10 text-[15vw] font-black italic text-white/2 select-none pointer-events-none uppercase tracking-tighter"
        >
            LINEUP
        </motion.div>
        
        <div className="relative z-10 border-l-8 md:border-l-12 border-[#D4AF37] pl-6 md:pl-12 py-6 md:py-8 group">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-[#FDF5E6] uppercase leading-[0.8] tracking-tighter mb-4 md:mb-6 font-heading">
                THE <br /> <span className="text-[#D4AF37]">EVENTS.</span>
              </h1>
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
                <p className="text-lg md:text-xl lg:text-2xl text-[#FDF5E6]/50 font-black uppercase tracking-tighter max-w-xl border-l-2 border-[#D4AF37]/30 pl-4 md:pl-6 font-heading">
                  {SITE_CONFIG.shortName} 2026 — Gaatha of Culture, Talent &amp; Excellence.
                </p>
                <div className="hidden md:block h-px flex-1 bg-[#D4AF37]/10" />
                <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]/40 rotate-180 [writing-mode:vertical-lr] font-heading">
                  BITOTSAV MMXXVI
                </div>
              </div>
            </motion.div>
        </div>
      </div>

      {/* Filter Tabs - Backstage Pass Style */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-16 md:mb-24 relative z-10">
        <div className="flex flex-wrap items-center gap-3 md:gap-4 border-y border-[#D4AF37]/20 py-6 md:py-8">
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mr-4 md:mr-8 font-heading">FILTER:</span>
            {categories.map((category) => (
            <button
                key={category}
                onClick={() => setFilter(category)}
                className={cn(
                "relative px-6 md:px-10 py-3 md:py-4 overflow-hidden group transition-all duration-300 border-2 font-heading",
                filter === category
                    ? "bg-[#D4AF37] border-[#D4AF37] text-[#1A0505]"
                    : "bg-transparent border-[#D4AF37]/20 text-[#FDF5E6]/40 hover:text-[#FDF5E6] hover:border-[#D4AF37]/50"
                )}
            >
                <span className="relative z-10 text-xs font-black uppercase tracking-[0.2em] transition-transform group-hover:scale-110 block">
                    {category === "All" ? "ALL EVENTS" : category}
                </span>
                
                {filter === category && (
                    <motion.div
                        layoutId="activeEventFilter"
                        className="absolute inset-0 bg-[#D4AF37]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
            </button>
            ))}
        </div>
      </div>

      {/* Event Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10"
        >
            <AnimatePresence mode="popLayout">
            {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
            </AnimatePresence>
        </motion.div>
      </div>

    </PageWrapper>
  );
}
