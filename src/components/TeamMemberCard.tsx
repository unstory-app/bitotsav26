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
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative bg-white/5 border border-white/10 p-8 flex flex-col items-center hover:bg-[#DFFF00] transition-all duration-500 cursor-default"
    >
      <div className="w-32 h-32 mb-6 p-2 border border-white/10 group-hover:border-black transition-colors relative">
        <div className="w-full h-full bg-black flex items-center justify-center relative grayscale group-hover:grayscale-0 transition-all duration-500">
             {member.image ? (
                <Image src={member.image} alt={member.name} fill className="object-cover" />
            ) : (
                <User className="w-12 h-12 text-white/10 group-hover:text-black/20" />
            )}
        </div>
        
        {/* Decorative corner accent */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#DFFF00] group-hover:border-black transition-colors" />
      </div>
      
      <h3 className="text-2xl font-black italic text-white mb-1 group-hover:text-black transition-colors uppercase leading-none text-center">
        {member.name}
      </h3>
      <p className="text-[10px] text-[#DFFF00] mb-8 font-black italic uppercase tracking-widest text-center group-hover:text-black/60 transition-colors">
        {member.role}
      </p>
      
      {member.socials && (
        <div className="flex justify-center gap-6 pt-6 border-t border-white/5 group-hover:border-black/20 w-full">
          {member.socials.linkedin && (
            <Link href={member.socials.linkedin} className="text-white hover:text-white group-hover:text-black transition-colors transform hover:scale-125">
              <Linkedin className="w-5 h-5 fill-current" />
            </Link>
          )}
          {member.socials.github && (
            <Link href={member.socials.github} className="text-white hover:text-white group-hover:text-black transition-colors transform hover:scale-125">
              <Github className="w-5 h-5 fill-current" />
            </Link>
          )}
          {member.socials.twitter && (
            <Link href={member.socials.twitter} className="text-white hover:text-white group-hover:text-black transition-colors transform hover:scale-125">
              <Twitter className="w-5 h-5 fill-current" />
            </Link>
          )}
        </div>
      )}
    </motion.div>
  );
}
