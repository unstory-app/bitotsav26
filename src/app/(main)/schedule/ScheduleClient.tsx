"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/config/site";

const scheduleData = [
  {
    day: "DAY 01",
    date: "MAR 19",
    fullDate: "March 19, 2026 — Wednesday",
    events: [
      { time: "10:00 AM", name: "Inauguration Ceremony", venue: "GP Birla Auditorium", type: "Opening" },
      { time: "02:00 PM", name: "Dance Saga Prelims", venue: "Open Air Theatre", type: "Cultural" },
      { time: "05:00 PM", name: "Battle of Bands", venue: "Main Stage", type: "Music" },
      { time: "08:00 PM", name: "Night Cultural Show", venue: "Main Grounds", type: "Flagship" },
    ]
  },
  {
    day: "DAY 02",
    date: "MAR 20",
    fullDate: "March 20, 2026 — Thursday",
    events: [
      { time: "09:00 AM", name: "Hackathon 24H Begin", venue: "Lab Complex", type: "Technical" },
      { time: "11:00 AM", name: "Robo Wars", venue: "SAC Grounds", type: "Technical" },
      { time: "03:00 PM", name: "Natsamrat", venue: "Main Stage", type: "Drama" },
      { time: "07:00 PM", name: "Fashion Show", venue: "GP Birla Auditorium", type: "Cultural" },
    ]
  },
  {
    day: "DAY 03",
    date: "MAR 21",
    fullDate: "March 21, 2026 — Friday",
    events: [
      { time: "10:00 AM", name: "Quiz Games", venue: "Open Air Theatre", type: "Technical" },
      { time: "01:00 PM", name: "Music Solo", venue: "Mini Auditorium", type: "Music" },
      { time: "04:00 PM", name: "Sports Finals", venue: "Athletic Ground", type: "Sports" },
      { time: "08:00 PM", name: "Celebrity Night", venue: "Main Stage", type: "Flagship" },
    ]
  },
  {
    day: "DAY 04",
    date: "MAR 22",
    fullDate: "March 22, 2026 — Saturday",
    events: [
      { time: "10:00 AM", name: "Valedictory Ceremony", venue: "GP Birla Auditorium", type: "Closing" },
      { time: "12:00 PM", name: "Prize Distribution", venue: "GP Birla Auditorium", type: "Closing" },
      { time: "04:00 PM", name: "Cultural Fiesta", venue: "Open Air Theatre", type: "Cultural" },
      { time: "08:00 PM", name: "Grand Finale Concert", venue: "Main Stage", type: "Flagship" },
    ]
  }
];

const typeColors: Record<string, string> = {
  Opening:   "text-[#D4AF37]",
  Cultural:  "text-orange-400",
  Music:     "text-purple-400",
  Flagship:  "text-rose-400",
  Technical: "text-blue-400",
  Drama:     "text-teal-400",
  Sports:    "text-green-400",
  Closing:   "text-[#D4AF37]",
};

export default function ScheduleClient() {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <PageWrapper className="bg-[#1A0505] min-h-screen tapestry-bg">
      <div className="absolute inset-0 z-0 pointer-events-none tapestry-pattern opacity-10" />

      {/* Header with folk dancers art */}
      <div className="relative pt-24 md:pt-32 pb-8 md:pb-16 px-4 md:px-6 max-w-7xl mx-auto z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-16">
          <div className="border-l-4 md:border-l-8 border-[#D4AF37] pl-6 md:pl-10 py-4 md:py-6 flex-1">
            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37] mb-2 md:mb-4 font-heading">
              {SITE_CONFIG.shortName} MMXXVI • The 35th Edition
            </p>
            <h1 className="text-4xl md:text-7xl lg:text-9xl font-black text-[#FDF5E6] uppercase leading-none tracking-tighter mb-2 md:mb-4 font-heading">
              SCHEDULE.
            </h1>
            <p className="text-sm md:text-lg text-[#FDF5E6]/40 font-black uppercase tracking-[0.3em] font-heading">
              March 19 — 22, 2026 • BIT Mesra, Ranchi
            </p>
          </div>
          {/* Folk dancers illustration */}
          <div className="w-48 md:w-64 shrink-0 opacity-80">
            <Image
              src="/assets/folks.png"
              alt="Folk Dancers"
              width={300}
              height={240}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Day Selector */}
      <div className="max-w-7xl mx-auto mb-12 px-4 md:px-6 flex flex-wrap justify-start gap-3 relative z-10">
        {scheduleData.map((data, index) => (
          <button
            key={data.day}
            onClick={() => setActiveDay(index)}
            className={cn(
              "relative px-6 md:px-10 py-4 md:py-6 border-2 transition-all duration-300 group overflow-hidden font-heading",
              activeDay === index
                ? "border-[#D4AF37] bg-[#D4AF37]/10 z-10"
                : "border-[#D4AF37]/20 text-[#FDF5E6]/30 hover:border-[#D4AF37]/50 bg-[#1A0505]"
            )}
          >
            <div className={cn(
              "text-xl md:text-3xl font-black mb-1 transition-colors uppercase leading-none font-heading",
              activeDay === index ? "text-[#D4AF37]" : "group-hover:text-[#FDF5E6]"
            )}>{data.day}</div>
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FDF5E6]/50 font-heading">{data.date}</div>

            {activeDay === index && (
              <div className="absolute top-0 right-0 w-6 h-6 bg-[#D4AF37]" />
            )}
          </button>
        ))}
      </div>

      {/* Active Day Info */}
      <div className="max-w-7xl mx-auto px-6 mb-8 relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]/50 font-heading">
          {scheduleData[activeDay].fullDate}
        </p>
      </div>

      {/* Timeline Display */}
      <div className="max-w-5xl mx-auto relative px-6 pb-40 z-10">
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
                <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/15 p-6 md:p-12 lg:p-16 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12">
                  <div className="space-y-3 md:space-y-4 flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 bg-[#D4AF37]" />
                      <div className="text-[#D4AF37] font-black uppercase tracking-[0.3em] text-[10px] md:text-sm font-heading">
                        {event.time}
                      </div>
                    </div>
                    <h3 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-[#FDF5E6] group-hover:text-[#D4AF37] transition-colors leading-tight font-heading">
                      {event.name}
                    </h3>
                  </div>

                  <div className="text-left md:text-right border-l-2 md:border-l-0 md:border-r-4 border-[#D4AF37]/40 pl-4 md:pl-0 md:pr-6">
                    <div className="text-[#FDF5E6]/30 text-[8px] md:text-[9px] font-black uppercase tracking-widest mb-1 font-heading">VENUE</div>
                    <div className="text-[#FDF5E6] font-black uppercase text-base md:text-lg tracking-tighter font-heading">{event.venue}</div>
                    <div className={cn("text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] mt-2 md:mt-3 font-heading", typeColors[event.type] ?? "text-[#D4AF37]")}>
                      {event.type}
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
