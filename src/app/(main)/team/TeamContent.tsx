"use client";

import Image from "next/image";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { SITE_CONFIG } from "@/config/site";
import Link from "next/link";

// Faculty Coordinators
const facultyCoordinators = [
  { name: "OP Pandey", role: "Faculty Coordinator", image: "/team/oppandey.png" },
  { name: "Mrinal Pathak", role: "Faculty Coordinator", image: null },
  { name: "Sumit Srivastava", role: "Faculty Coordinator", image: null },
];

// Student Coordinators
const studentCoordinators = [
  { name: "Rohit Raj", role: "Student Coordinator", image: "/team/rohitraj.png" },
  { name: "Rohit Jain", role: "Finance Coordinator", image: "/team/ronitjain.png" },
  { name: "Soumya Prasad", role: "Student Coordinator", image: "/team/saumyaprasad.png" },
];

const developers = [
  { name: "Shaswat Raj", role: "Lead Developer", image: "/team/sh20raj.jpg", socials: { linkedin: "https://www.linkedin.com/in/sh20raj/", github: "https://github.com/sh20raj" } },
  { name: "Shivansh Kumar", role: "Developer", image: null, socials: { linkedin: "#" } },
];

function CoordinatorCard({ name, role, image }: { name: string; role: string; image: string | null }) {
  return (
    <div className="group relative flex flex-col items-center gap-6 p-8 border-2 border-[#D4AF37]/20 bg-[#1A0505] hover:border-[#D4AF37]/60 transition-all duration-500 hover:shadow-[0_0_40px_rgba(212,175,55,0.1)]">
      {/* Photo */}
      <div className="relative w-40 h-40 md:w-48 md:h-48 overflow-hidden heritage-border">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700 scale-105"
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center text-5xl font-black text-[#D4AF37] font-heading">
            {name[0]}
          </div>
        )}
      </div>
      {/* Info */}
      <div className="text-center">
        <h4 className="text-xl md:text-2xl font-black text-[#FDF5E6] font-heading tracking-wider uppercase leading-tight mb-2">
          {name}
        </h4>
        <div className="px-4 py-1 border border-[#D4AF37]/30 inline-block">
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#D4AF37] font-heading">
            {role}
          </span>
        </div>
      </div>
      {/* Corner ornaments */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]/40" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]/40" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]/40" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]/40" />
    </div>
  );
}

export default function TeamContent() {
  return (
    <PageWrapper className="pt-32 pb-20 bg-[#1A0505] min-h-screen relative overflow-hidden tapestry-bg">
      {/* Texture Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none tapestry-pattern opacity-10" />
      <div className="absolute top-0 right-0 w-1/2 h-full z-0 pointer-events-none bg-linear-to-l from-[#D4AF37]/5 to-transparent" />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-24 relative z-10">
        <div className="border-l-8 border-[#D4AF37] pl-10 py-6">
          <h1 className="text-7xl md:text-9xl font-black text-[#FDF5E6] uppercase leading-none tracking-tighter mb-4 font-heading">
            THE <span className="text-[#D4AF37]">GUILD.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#FDF5E6]/40 font-black uppercase tracking-[0.3em] font-heading">
            The Artisans Behind Bitotsav {new Date().getFullYear()}.
          </p>
        </div>
      </div>

      <div className="space-y-32 relative z-10">

        {/* Faculty Coordinators */}
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="absolute -top-20 -right-10 text-[15vw] font-black text-[#FDF5E6]/2 select-none pointer-events-none uppercase tracking-tighter font-heading">
            FACULTY
          </div>
          <div className="flex items-center gap-6 mb-16">
            <div className="w-12 h-1 bg-[#D4AF37]" />
            <h3 className="text-4xl md:text-5xl font-black text-[#FDF5E6] uppercase tracking-tighter leading-none font-heading">
              Faculty Coordinators
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {facultyCoordinators.map((member, i) => (
              <CoordinatorCard key={i} {...member} />
            ))}
          </div>
        </div>

        {/* Student Coordinators */}
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="absolute -top-20 -left-10 text-[15vw] font-black text-[#FDF5E6]/2 select-none pointer-events-none uppercase tracking-tighter font-heading">
            STUDENTS
          </div>
          <div className="flex items-center gap-6 mb-16">
            <div className="w-12 h-1 bg-[#D4AF37]" />
            <h3 className="text-4xl md:text-5xl font-black text-[#FDF5E6] uppercase tracking-tighter leading-none font-heading">
              Student Coordinators
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {studentCoordinators.map((member, i) => (
              <CoordinatorCard key={i} {...member} />
            ))}
          </div>
        </div>

        {/* Tech Team */}
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="absolute -top-20 -left-10 text-[15vw] font-black text-[#FDF5E6]/2 select-none pointer-events-none uppercase tracking-tighter font-heading">
            TECH
          </div>
          <div className="flex items-center gap-6 mb-16">
            <div className="w-12 h-1 bg-[#D4AF37]" />
            <h3 className="text-4xl md:text-5xl font-black text-[#FDF5E6] uppercase tracking-tighter leading-none font-heading">
              Tech Team
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {developers.map((member, i) => (
              <CoordinatorCard key={i} name={member.name} role={member.role} image={member.image} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-6 mt-32 pb-20 relative z-10">
        <div className="p-16 md:p-24 bg-[#D4AF37]/5 border-2 border-[#D4AF37]/20 relative group overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-tr from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute top-0 right-0 p-6 border-l border-b border-[#D4AF37]/20 text-[8px] font-black text-[#D4AF37]/30 uppercase tracking-[0.5em] font-heading">
            BITOTSAV MMXXVI
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-6xl md:text-8xl font-black text-[#FDF5E6] uppercase tracking-tighter leading-[0.85] mb-8 font-heading">
                JOIN THE <br /><span className="text-[#D4AF37]">GUILD?</span>
              </h2>
              <p className="max-w-xl text-lg font-black uppercase tracking-widest text-[#FDF5E6]/40 leading-relaxed border-l-4 border-[#D4AF37]/20 pl-8 font-heading">
                The {SITE_CONFIG.shortName} artisan circle is always looking for passionate creators and builders.
              </p>
            </div>
            <Link
              href="/helpdesk"
              className="shrink-0 w-full md:w-auto px-16 py-10 bg-[#D4AF37] text-[#1A0505] font-black uppercase tracking-[0.5em] text-xl transform hover:scale-105 transition-all font-heading"
            >
              GET IN TOUCH
            </Link>
          </div>
          <div className="absolute -bottom-10 -right-10 text-[15vw] font-black text-[#FDF5E6]/2 select-none pointer-events-none uppercase tracking-tighter leading-none font-heading">
            GUILD
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
