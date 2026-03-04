"use client";

import { SectionHeader } from "@/components/SectionHeader";
import { TeamMemberCard } from "@/components/TeamMemberCard";
import { TeamMember } from "@/types";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { SITE_CONFIG } from "@/config/site";
import { Users, Code } from "lucide-react";

// Static data based on fetched content
const coreTeam: TeamMember[] = [
  { name: "John Doe", role: "President", socials: { linkedin: "#" } },
  { name: "Jane Smith", role: "Vice President", socials: { linkedin: "#" } },
  { name: "Alex Johnson", role: "General Secretary", socials: { linkedin: "#" } },
  { name: "Emily Brown", role: "Treasurer", socials: { linkedin: "#" } },
];

const developers: TeamMember[] = [
  { name: "Shaswat Raj", role: "Web Developer", socials: { linkedin: "#", github: "https://github.com/sh20raj" } },
  { name: "Manoj Kumar", role: "Tech Team Lead", socials: { linkedin: "#" } },
  { name: "Venkat Saahit Kamu", role: "Tech Team", socials: { linkedin: "#" } },
  { name: "Mritunjay Raj", role: "Tech Team", socials: { linkedin: "#" } },
  { name: "Abhinav Kumar Choudhary", role: "UI Designer", socials: { linkedin: "#" } },
  { name: "Raghav Bajaj", role: "AI/ML Developer", socials: { linkedin: "#" } },
];

export default function TeamContent() {
  return (
    <PageWrapper className="pt-32 pb-20">
      
      <div className="max-w-7xl mx-auto px-6 mb-32">
        <SectionHeader 
          title="THE CREW." 
          subtitle="The architects and maintainers of the biggest concert experience."
          align="left"
        />
      </div>

      <div className="space-y-40">
        
        {/* Core Team Section */}
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-6 mb-16 border-l-4 border-[#DFFF00] pl-6 py-2">
                <Users className="w-8 h-8 text-[#DFFF00]" />
                <h3 className="text-4xl md:text-5xl font-black italic text-white uppercase tracking-tighter">
                    CORE COUNCIL
                </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {coreTeam.map((member, i) => (
                <TeamMemberCard key={i} member={member} />
              ))}
            </div>
        </div>

        {/* Development Team Section */}
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-6 mb-16 border-l-4 border-[#DFFF00] pl-6 py-2">
                <Code className="w-8 h-8 text-[#DFFF00]" />
                <h3 className="text-4xl md:text-5xl font-black italic text-white uppercase tracking-tighter">
                    TECH ARCHITECTS
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
      <div className="max-w-7xl mx-auto px-6 mt-40">
        <div className="p-16 bg-[#DFFF00] text-black text-center relative overflow-hidden flex flex-col items-center gap-8">
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter relative z-10 leading-none">
                WANT TO <br className="md:hidden" />BUILD THIS?
            </h2>
            <p className="max-w-2xl text-lg font-black italic uppercase tracking-tighter opacity-70 relative z-10">
                The {SITE_CONFIG.shortName} tech team is always looking for visionaries. Join the protocol maintenance group now.
            </p>
            <div className="absolute inset-0 flex items-center justify-center text-[25vw] font-black italic text-black/5 select-none pointer-events-none uppercase tracking-tighter leading-none">
                JOIN
            </div>
        </div>
      </div>

    </PageWrapper>
  );
}
