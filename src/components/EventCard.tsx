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
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-black border border-white/10 h-full flex flex-col group-hover:border-[#DFFF00] transition-colors duration-500 overflow-hidden"
      >
        {/* Hover Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#DFFF00]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="p-8 flex flex-col h-full relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <span className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-black italic uppercase tracking-widest text-[#DFFF00] group-hover:bg-[#DFFF00] group-hover:text-black transition-all">
              {event.category}
            </span>
            <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover:bg-[#DFFF00] group-hover:border-transparent transition-all">
               <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 group-hover:text-black transition-transform" />
            </div>
          </div>
          
          {/* Title */}
          <h3 className="text-3xl font-black italic text-white uppercase leading-none tracking-tighter mb-4 group-hover:text-[#DFFF00] transition-colors">
            {event.name}
          </h3>
          
          {/* Description Snippet (Optional but good for layout) */}
          <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-8 line-clamp-2">
            JOIN US AT {event.venue.toUpperCase()} FOR AN UNFORGETTABLE EXPERIENCE.
          </p>
          
          {/* Footer Info */}
          <div className="mt-auto pt-6 border-t border-white/5 flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3 text-[#DFFF00]" />
              <span className="text-[10px] font-black italic uppercase text-white/60 tracking-widest">{event.organizer}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 text-[#DFFF00]" />
              <span className="text-[10px] font-black italic uppercase text-white/60 tracking-widest">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar Decorations */}
        <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#DFFF00] group-hover:w-full transition-all duration-700" />
      </motion.div>
    </Link>
  );
}
