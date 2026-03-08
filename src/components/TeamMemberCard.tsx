"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, User } from "lucide-react";
import { TeamMember } from "@/types";
import Link from "next/link";
import Image from "next/image";

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-[#0A0A0A] border-2 border-white/5 p-8 flex flex-col transition-all duration-700 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 overflow-hidden"
    >
      {/* Card ID Decor */}
      <div className="absolute top-0 right-0 flex border-l border-b border-white/5">
          <div className="px-3 py-1 text-[8px] font-black italic text-white/20 uppercase">ID_TX_{member.name.slice(0, 3).toUpperCase()}</div>
      </div>

      {/* Access Vertical Metadata */}
      <div className="absolute top-0 left-0 h-full w-8 border-r border-white/5 hidden md:flex items-center justify-center">
          <span className="text-[8px] font-black italic uppercase tracking-[0.5em] text-white/5 rotate-180 [writing-mode:vertical-lr] group-hover:text-[#D4AF37]/20 transition-colors">
              CREW ACCESS PERMIT 2026
          </span>
      </div>

      <div className="md:pl-10 space-y-8">
        <div className="relative">
            {/* Portrait Frame */}
            <div className="w-full aspect-square bg-white/5 border-2 border-white/10 p-1 relative overflow-hidden group-hover:border-[#D4AF37] transition-all duration-700">
                <div className="w-full h-full relative grayscale group-hover:grayscale-0 transition-all duration-700 scale-[1.01] group-hover:scale-110">
                    {member.image ? (
                        <Image src={member.image} alt={member.name} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full bg-black flex items-center justify-center">
                            <User className="w-16 h-16 text-white/5 group-hover:text-[#D4AF37]/20" />
                            <div className="absolute inset-0 flex items-center justify-center text-4xl font-black italic text-[#D4AF37]/5">
                                {member.name[0]}
                            </div>
                        </div>
                    )}
                </div>
                {/* Glitch Overlay */}
                <div className="absolute inset-0 bg-linear-to-tr from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            {/* Rank Badge */}
            <div className="absolute -bottom-4 -left-4 px-4 py-2 bg-[#D4AF37] text-black font-black italic text-[8px] uppercase tracking-widest shadow-[5px_5px_0px_black]">
                RANK: 0{Math.floor(Math.random() * 9) + 1}
            </div>
        </div>
        
        <div className="space-y-4">
            <div>
              <h3 className="text-3xl font-black italic text-white uppercase leading-none tracking-tighter group-hover:text-[#D4AF37] transition-colors">
                {member.name}
              </h3>
              <div className="h-0.5 w-12 bg-[#D4AF37] mt-3 group-hover:w-full transition-all duration-700" />
            </div>
            
            <div className="flex flex-col gap-1">
                <span className="text-[8px] font-black italic text-white/20 uppercase tracking-[0.3em]">ASSIGNED ROLE</span>
                <span className="text-xs font-black italic text-[#D4AF37] uppercase tracking-widest">
                    {member.role}
                </span>
            </div>
        </div>
        
        {member.socials && (
          <div className="flex gap-4 pt-6 border-t border-white/5">
            {member.socials.linkedin && (
              <Link href={member.socials.linkedin} className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/30 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all">
                <Linkedin className="w-4 h-4" />
              </Link>
            )}
            {member.socials.github && (
              <Link href={member.socials.github} className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/30 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all">
                <Github className="w-4 h-4" />
              </Link>
            )}
            {member.socials.twitter && (
              <Link href={member.socials.twitter} className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/30 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all">
                <Twitter className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
