"use client";

import React, { useState, useEffect } from "react";
import { Event } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Users, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import Link from "next/link";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { SITE_CONFIG } from "@/config/site";
import { useUser } from "@stackframe/stack";
import { getUserTeams } from "@/app/actions/team";
import { registerTeamForEvent } from "@/app/actions/events";
import { type Team } from "@/db/schema";
import { cn } from "@/lib/utils";

interface EventDetailsProps {
  event: Event;
}

export default function EventDetails({ event }: EventDetailsProps) {
  const user = useUser();
  const [userTeams, setUserTeams] = useState<(Team & { events: string[] })[]>([]);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getUserTeams(user.id).then((data) => {
        setUserTeams(data as (Team & { events: string[] })[]);
        setLoading(false);
      });
    }
  }, [user]);

  const handleRegister = async (teamId: string) => {
    setRegistering(true);
    setMessage(null);
    const result = await registerTeamForEvent(teamId, event.id);
    if (result.success) {
      setMessage({ type: 'success', text: "Registration successful!" });
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
      // Refresh teams to show updated event list
      const data = await getUserTeams(user!.id);
      setUserTeams(data as (Team & { events: string[] })[]);
    } else {
      setMessage({ type: 'error', text: result.message || "Registration failed" });
    }
    setRegistering(false);
  };

  const isRegistered = userTeams.some(t => t.events.includes(event.id));
  const myTeam = userTeams[0]; // Since one person one team rule

  return (
    <PageWrapper>
      <SectionHeader title={event.name} subtitle={event.category} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl mx-auto mt-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Content */}
          <div className="lg:col-span-7 space-y-12">
            
            <div className="space-y-8">
              <div className="flex items-center space-x-3">
                <span className="h-2 w-12 bg-[#D4AF37]"></span>
                <span className="text-xs font-black italic tracking-[0.3em] uppercase text-[#D4AF37]">PROTOCOL_DETAILS</span>
              </div>
              <p className="text-2xl md:text-4xl text-white font-black italic uppercase leading-tight tracking-tighter">
                Access granted to <span className="text-[#D4AF37]">{event.name}</span>. 
                Experience the terminal point of {event.category.toLowerCase()} at {SITE_CONFIG.shortName} &apos;26. 
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-12 border-t border-white/10">
              <div className="space-y-2 group p-8 bg-white/5 border border-white/10 hover:border-[#D4AF37] transition-all">
                <div className="flex items-center space-x-3 text-white/30 mb-2">
                  <Users className="w-4 h-4" />
                  <span className="text-[10px] font-black italic uppercase tracking-widest">COMMANDER</span>
                </div>
                <p className="text-2xl font-black italic uppercase text-white group-hover:text-[#D4AF37] transition-colors tracking-tighter">
                    {event.organizer}
                </p>
              </div>
              
              <div className="space-y-2 group p-8 bg-white/5 border border-white/10 hover:border-[#D4AF37] transition-all">
                <div className="flex items-center space-x-3 text-white/30 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-[10px] font-black italic uppercase tracking-widest">VIRTUAL_ZONE</span>
                </div>
                <p className="text-2xl font-black italic uppercase text-white group-hover:text-[#D4AF37] transition-colors tracking-tighter">
                    {event.venue}
                </p>
              </div>

              <div className="space-y-2 group p-8 bg-white/5 border border-white/10 hover:border-[#D4AF37] transition-all">
                <div className="flex items-center space-x-3 text-white/30 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-[10px] font-black italic uppercase tracking-widest">SEQUENCE ID</span>
                </div>
                <p className="text-2xl font-black italic uppercase text-white group-hover:text-[#D4AF37] transition-colors tracking-tighter">
                    TBA SIGNAL
                </p>
              </div>
            </div>

            <div className="pt-12">
               <AnimatePresence>
                 {message && (
                   <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     className={cn(
                       "mb-6 p-4 flex items-center gap-3 font-black italic uppercase tracking-tighter",
                       message.type === 'success' ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                     )}
                   >
                     {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                     {message.text}
                   </motion.div>
                 )}
               </AnimatePresence>

               {!user ? (
                 <Link href="/login" className="inline-block px-12 py-6 bg-[#D4AF37] text-black font-black italic text-xl uppercase tracking-widest hover:scale-105 transition-all">
                      Login to Register
                 </Link>
               ) : loading ? (
                 <div className="inline-flex items-center gap-3 px-12 py-6 bg-[#D4AF37]/20 text-[#D4AF37] font-black italic text-xl uppercase tracking-widest">
                   <Loader2 className="w-6 h-6 animate-spin" />
                   Synchronizing...
                 </div>
               ) : isRegistered ? (
                 <div className="inline-flex items-center gap-3 px-12 py-6 bg-green-500/20 text-green-500 border-2 border-green-500/50 font-black italic text-xl uppercase tracking-widest cursor-default">
                   <CheckCircle2 className="w-6 h-6" />
                   Already Registered
                 </div>
               ) : myTeam ? (
                 <button 
                   onClick={() => handleRegister(myTeam.id)}
                   disabled={registering}
                   className="inline-flex items-center gap-3 px-12 py-6 bg-[#D4AF37] text-black font-black italic text-xl uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                 >
                   {registering ? <Loader2 className="w-6 h-6 animate-spin" /> : <Users className="w-6 h-6" />}
                   Register Team: {myTeam.name}
                 </button>
               ) : (
                 <Link href="/profile" className="inline-block px-12 py-6 bg-[#D4AF37] text-black font-black italic text-xl uppercase tracking-widest hover:scale-105 transition-all">
                      Create Team to Join
                 </Link>
               )}
            </div>
          </div>

          {/* Visual Side */}
          <div className="lg:col-span-5 relative mt-12 lg:mt-0">
            <div className="relative aspect-4/5 bg-black border-4 border-[#D4AF37] group overflow-hidden">
                <div className="absolute inset-0 bg-[#D4AF37]/5" />
                
                {/* Decorative Ticker */}
                <div className="absolute top-0 left-0 right-0 h-10 bg-[#D4AF37] flex items-center overflow-hidden">
                    <div className="flex gap-10 animate-marquee whitespace-nowrap">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-[10px] font-black italic text-black uppercase tracking-[0.3em]">
                                ACCESS_LIVE — SEQUENCE_INITIALIZED — {event.category.toUpperCase()} — 
                            </span>
                        ))}
                    </div>
                  {/* Hover Ticker */}
                  <div className="absolute right-0 bottom-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-[12rem] font-black italic text-white/3 leading-none uppercase translate-x-12 translate-y-12 select-none">
                        {/* scheduleData[activeDay].day is not defined in this component context. */}
                        {/* This line might be intended for a different component (e.g., ScheduleClient). */}
                        {/* Keeping it as per instruction, but it will cause a runtime error if scheduleData/activeDay are not provided. */}
                        {/* Placeholder for now to maintain syntax: */}
                        DAY_PLACEHOLDER
                      </div>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <h3 className="text-6xl font-black italic transition-colors duration-700 uppercase tracking-tighter text-center leading-none text-white/20 group-hover:text-[#D4AF37]/40">
                      {event.name}
                  </h3>
                </div>

                {/* Corner Accents */}
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#D4AF37] -rotate-45 translate-x-12 translate-y-12" />
            </div>
          </div>
        </div>
      </motion.div>
    </PageWrapper>
  );
}
