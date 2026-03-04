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
    <PageWrapper className="pt-32 pb-20">
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 mb-20 relative">
        <div className="absolute -top-10 -left-10 text-[15vw] font-black italic text-white/3 select-none pointer-events-none uppercase tracking-tighter">
            EVENTS
        </div>
        
        <div className="relative z-10 border-l-8 border-[#DFFF00] pl-8 py-4">
            <h1 className="text-6xl md:text-8xl font-black italic text-white uppercase leading-[0.85] tracking-tighter mb-4">
              THE <span className="text-[#DFFF00]">LINEUP.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/40 font-black italic uppercase tracking-tighter max-w-2xl">
              Competitive modules and flagship performance events of {SITE_CONFIG.shortName} 2026.
            </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
            <button
                key={category}
                onClick={() => setFilter(category)}
                className={cn(
                "relative px-8 py-4 overflow-hidden group transition-all duration-300",
                filter === category
                    ? "bg-[#DFFF00] text-black"
                    : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
                )}
            >
                <span className="relative z-10 text-sm font-black italic uppercase tracking-[0.2em]">
                    {category}
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
