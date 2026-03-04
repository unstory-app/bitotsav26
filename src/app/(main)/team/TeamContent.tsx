"use client";

import { TeamMemberCard } from "@/components/TeamMemberCard";
import { TeamMember } from "@/types";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { SITE_CONFIG } from "@/config/site";
import Link from "next/link";

// Static data based on fetched content
const coreTeam: TeamMember[] = [
  { name: "John Doe", role: "Festival President", socials: { linkedin: "#" } },
  { name: "Jane Smith", role: "Vice President", socials: { linkedin: "#" } },
  { name: "Alex Johnson", role: "General Secretary", socials: { linkedin: "#" } },
  { name: "Emily Brown", role: "Treasurer", socials: { linkedin: "#" } },
];

const developers: TeamMember[] = [
  { name: "Shaswat Raj", role: "Lead Systems Architect", socials: { linkedin: "#", github: "https://github.com/sh20raj" } },
  { name: "Manoj Kumar", role: "Technical Team Lead", socials: { linkedin: "#" } },
  { name: "Venkat Saahit Kamu", role: "Core Systems Engineer", socials: { linkedin: "#" } },
  { name: "Mritunjay Raj", role: "Systems Engineer", socials: { linkedin: "#" } },
  { name: "Abhinav Kumar Choudhary", role: "Creative Lead", socials: { linkedin: "#" } },
  { name: "Raghav Bajaj", role: "Neural Networks Lead", socials: { linkedin: "#" } },
];

export default function TeamContent() {
  return (
    <PageWrapper className="pt-32 pb-20 bg-black min-h-screen relative overflow-hidden">
      {/* Texture Overlays */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
      <div className="absolute top-0 right-0 w-1/2 h-full z-0 pointer-events-none bg-linear-to-l from-[#DFFF00]/5 to-transparent" />
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 mb-32 relative z-10">
          <div className="border-l-12 border-[#DFFF00] pl-10 py-6">
              <h1 className="text-7xl md:text-9xl font-black italic text-white uppercase leading-none tracking-tighter mb-4">
                  THE <span className="text-[#DFFF00]">CREW.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/40 font-black italic uppercase tracking-[0.3em]">
                  OPERATIONAL ARCHITECTS AND CORE PROTOCOL MAINTAINERS.
              </p>
          </div>
      </div>

      <div className="space-y-48 relative z-10">
        
        {/* Core Team Section */}
        <div className="max-w-7xl mx-auto px-6 relative">
            <div className="absolute -top-32 -right-10 text-[15vw] font-black italic text-white/2 select-none pointer-events-none uppercase tracking-tighter">
                COUNCIL
            </div>
            
            <div className="flex items-center gap-6 mb-16">
                <div className="w-12 h-1 bg-[#DFFF00]" />
                <h3 className="text-4xl md:text-6xl font-black italic text-white uppercase tracking-tighter leading-none">
                    CORE LEADERSHIP
                </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {coreTeam.map((member, i) => (
                <TeamMemberCard key={i} member={member} />
              ))}
            </div>
        </div>

        {/* Development Team Section */}
        <div className="max-w-7xl mx-auto px-6 relative">
            <div className="absolute -top-32 -left-10 text-[15vw] font-black italic text-white/2 select-none pointer-events-none uppercase tracking-tighter">
                ARCHITECTS
            </div>

            <div className="flex items-center gap-6 mb-16">
                <div className="w-12 h-1 bg-[#DFFF00]" />
                <h3 className="text-4xl md:text-6xl font-black italic text-white uppercase tracking-tighter leading-none">
                    TECH DEPARTMENTS
                </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {developers.map((member, i) => (
                <TeamMemberCard key={i} member={member} />
              ))}
            </div>
        </div>
      </div>

      {/* Join the Team CTA */}
      <div className="max-w-7xl mx-auto px-6 mt-48 pb-40 relative z-10">
        <div className="p-16 md:p-24 bg-white/5 border-2 border-white/10 relative group overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-tr from-[#DFFF00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Decors */}
            <div className="absolute top-0 right-0 p-8 border-l border-b border-white/10 text-[8px] font-black italic text-white/20 uppercase tracking-[0.5em]">
                UPLINK_STATUS: READY
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-6xl md:text-8xl font-black italic text-white uppercase tracking-tighter leading-[0.85] mb-8">
                        WANT TO <br /><span className="text-[#DFFF00]">JOIN CREW?</span>
                    </h2>
                    <p className="max-w-xl text-lg font-black italic uppercase tracking-widest text-white/40 leading-relaxed border-l-4 border-white/10 pl-8">
                        The {SITE_CONFIG.shortName} protocol maintenance group is always looking for new visionaries to scale the experience.
                    </p>
                </div>
                
                <Link 
                    href="/helpdesk" 
                    className="shrink-0 w-full md:w-auto px-16 py-10 bg-[#DFFF00] text-black font-black italic uppercase tracking-[0.5em] text-xl transform hover:scale-105 transition-all shadow-[10px_10px_0px_white]"
                >
                    INITIALIZE SYNC
                </Link>
            </div>

            <div className="absolute -bottom-10 -right-10 text-[15vw] font-black italic text-white/2 select-none pointer-events-none uppercase tracking-tighter leading-none">
                UPLINK
            </div>
        </div>
      </div>
    </PageWrapper>
  );
}
