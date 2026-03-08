"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/SectionHeader";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/config/site";

const scheduleData = [
  {
    day: "DAY 01",
    date: "FEB 14",
    events: [
      { time: "10:00 AM", name: "INAUGURATION CEREMONY", venue: "GP BIRLA AUDITORIUM", type: "MAIN_SEQUENCE" },
      { time: "02:00 PM", name: "DANCE SAGA PRELIMS", venue: "OAT", type: "STAGE_OPS" },
      { time: "05:00 PM", name: "BATTLE OF BANDS", venue: "MAIN STAGE", type: "SONIC_WAR" },
      { time: "08:00 PM", name: "EDM NITE", venue: "MAIN GROUNDS", type: "ENERGY_PEAK" },
    ]
  },
  {
    day: "DAY 02",
    date: "FEB 15",
    events: [
      { time: "09:00 AM", name: "HACKATHON 24H BEGIN", venue: "LAB 1", type: "CODE_TRANSIT" },
      { time: "11:00 AM", name: "ROBOWARS", venue: "SAC", type: "MECH_COMBAT" },
      { time: "03:00 PM", name: "NATSAMRAT", venue: "MAIN STAGE", type: "DRAMA_CELL" },
      { time: "07:00 PM", name: "FASHION SHOW", venue: "GP BIRLA AUDITORIUM", type: "GLAM_PROTOCOL" },
    ]
  },
  {
    day: "DAY 03",
    date: "FEB 16",
    events: [
      { time: "10:00 AM", name: "SQUIZ GAMES", venue: "OAT", type: "INTEL_HUB" },
      { time: "01:00 PM", name: "MUSIC SOLO", venue: "MINI AUDITORIUM", type: "SONIC_SOLO" },
      { time: "04:00 PM", name: "CLOSING CEREMONY", venue: "MAIN STAGE", type: "TERMINAL_OPS" },
      { time: "08:00 PM", name: "LIVE CONCERT", venue: "MAIN STAGE", type: "ABSOLUTE_SAGA" },
    ]
  }
];

export default function ScheduleClient() {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <PageWrapper>
      <SectionHeader 
        title="TIMELINE." 
        subtitle={`Operational sequence for ${SITE_CONFIG.shortName} 2026 phase.`}
      />

      {/* Day Selector */}
      <div className="max-w-7xl mx-auto mb-32 flex flex-wrap justify-center gap-6">
        {scheduleData.map((data, index) => (
          <button
            key={data.day}
            onClick={() => setActiveDay(index)}
            className={cn(
              "relative px-12 py-8 bg-black border-4 transition-all duration-300 group overflow-hidden",
              activeDay === index 
                ? "border-[#D4AF37] z-10" 
                : "border-white/10 text-white/20 hover:border-white/40"
            )}
          >
            <div className={cn(
                "text-4xl font-black italic mb-2 transition-colors uppercase leading-none",
                activeDay === index ? "text-[#D4AF37]" : "group-hover:text-white"
            )}>{data.day}</div>
            <div className="text-[10px] font-black italic uppercase tracking-[0.4em]">{data.date}</div>
            
            {/* Background Accent if active */}
            {activeDay === index && (
                <div className="absolute top-0 right-0 w-8 h-8 bg-[#D4AF37] -rotate-45 translate-x-4 -translate-y-4" />
            )}
          </button>
        ))}
      </div>

      {/* Timeline Display */}
      <div className="max-w-5xl mx-auto relative px-6 pb-40">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {scheduleData[activeDay].events.map((event, idx) => (
              <div key={idx} className="group relative">
                <div className="bg-white/5 border border-white/10 p-10 md:p-16 hover:border-[#D4AF37] hover:bg-white/10 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-12 group">
                  <div className="space-y-6 flex-1">
                    <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-[#D4AF37]" />
                        <div className="text-[#D4AF37] font-black italic uppercase tracking-[0.3em] text-sm">
                            TIME_MARKER: {event.time}
                        </div>
                    </div>
                    <h3 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white group-hover:text-[#D4AF37] transition-colors leading-none">
                    {event.name}
                    </h3>
                  </div>
                  
                  <div className="text-left md:text-right border-l-4 md:border-l-0 md:border-r-4 border-[#D4AF37] pl-6 md:pl-0 md:pr-6">
                    <div className="text-white/40 text-sm font-black italic uppercase tracking-widest mb-1">LOCATION</div>
                    <div className="text-white font-black italic uppercase text-lg tracking-tighter">{event.venue}</div>
                    <div className="text-[10px] text-[#D4AF37] font-black italic uppercase tracking-[0.2em] mt-4">CLASS ID: {event.type}</div>
                  </div>

                  {/* Hover Ticker */}
                  <div className="absolute right-0 bottom-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-[12rem] font-black italic text-white/5 leading-none uppercase translate-x-12 translate-y-12 select-none">
                        {scheduleData[activeDay].day}
                      </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
