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
    <PageWrapper className="pt-32 pb-20 bg-black min-h-screen relative overflow-hidden">
      {/* Texture Overlays */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none bg-linear-to-b from-transparent via-[#DFFF00]/5 to-transparent" />

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 mb-32 relative">
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute -top-16 -left-16 text-[20vw] font-black italic text-white/2 select-none pointer-events-none uppercase tracking-tighter"
        >
            LINEUP
        </motion.div>
        
        <div className="relative z-10 border-l-12 border-[#DFFF00] pl-12 py-8 group">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-7xl md:text-9xl font-black italic text-white uppercase leading-[0.8] tracking-tighter mb-6">
                THE <br /> <span className="text-[#DFFF00] drop-shadow-[0_0_30px_rgba(223,255,0,0.3)]">LINEUP.</span>
              </h1>
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <p className="text-xl md:text-2xl text-white/50 font-black italic uppercase tracking-tighter max-w-xl border-l border-white/10 pl-6">
                  {SITE_CONFIG.shortName} 2026: THE ULTIMATE STAGE FOR COMPETITIVE EXCELLENCE.
                </p>
                <div className="hidden md:block h-px flex-1 bg-white/10" />
                <div className="text-[10px] font-black italic uppercase tracking-[0.4em] text-[#DFFF00]/40 rotate-180 [writing-mode:vertical-lr]">
                  EST. 2026 / BITOTSAV
                </div>
              </div>
            </motion.div>
        </div>
      </div>

      {/* Filter Tabs - Backstage Pass Style */}
      <div className="max-w-7xl mx-auto px-6 mb-24 relative z-10">
        <div className="flex flex-wrap items-center gap-4 border-y border-white/10 py-8">
            <span className="text-[10px] font-black italic uppercase tracking-[0.3em] text-[#DFFF00] mr-8">FILTER BY DEPT:</span>
            {categories.map((category) => (
            <button
                key={category}
                onClick={() => setFilter(category)}
                className={cn(
                "relative px-10 py-4 overflow-hidden group transition-all duration-300 border-2",
                filter === category
                    ? "bg-[#DFFF00] border-[#DFFF00] text-black"
                    : "bg-transparent border-white/10 text-white/40 hover:text-white hover:border-white/30"
                )}
            >
                <span className="relative z-10 text-xs font-black italic uppercase tracking-[0.2em] transition-transform group-hover:scale-110 block">
                    {category === "All" ? "ACCESS ALL" : category}
                </span>
                
                {filter === category && (
                    <motion.div
                        layoutId="activeEventFilter"
                        className="absolute inset-0 bg-[#DFFF00]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
            </button>
            ))}
        </div>
      </div>

      {/* Event Grid */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
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
