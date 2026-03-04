'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import { ArrowUpRight, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/* ---------- Types ---------- */

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

/* ---------- Data ---------- */

interface KineticTeamHybridProps {
  title?: string;
  subtitle?: string;
  members: TeamMember[];
}

export default function KineticTeamHybrid({ 
  title = "THE ARCHITECTS.", 
  subtitle = "CODE PROTOCOL '26",
  members 
}: KineticTeamHybridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position resources (Global for the floating card)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth physics for the floating card
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Detect mobile for conditional rendering logic
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    // Offset the cursor card
    mouseX.set(e.clientX + 20); 
    mouseY.set(e.clientY + 20);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[50vh] w-full cursor-default px-6 py-24 bg-black text-white md:px-12"
    >
      <div className="mx-auto max-w-6xl relative z-10">
        <motion.header 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-32 flex flex-col gap-8 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-12"
        >
          <div>
            <h1 className="text-6xl font-black italic tracking-tighter text-white md:text-9xl uppercase leading-none">
              {title}
            </h1>
          </div>
          <p className="text-sm font-black italic uppercase tracking-[0.3em] text-[#DFFF00]">
            {subtitle}
          </p>
        </motion.header>

        {/* The List */}
        <div className="flex flex-col">
          {members.map((member, index) => (
            <TeamRow
              key={member.id}
              data={member}
              index={index}
              isActive={activeId === member.id}
              setActiveId={setActiveId}
              isMobile={isMobile}
              isAnyActive={activeId !== null}
            />
          ))}
        </div>
      </div>

      {/* DESKTOP ONLY: Global Floating Cursor Image */}
      {!isMobile && (
        <motion.div
          style={{ x: cursorX, y: cursorY }}
          className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
        >
          <AnimatePresence mode="wait">
            {activeId && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -100 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 100 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="relative h-80 w-64 overflow-hidden border-4 border-[#DFFF00] bg-black shadow-2xl"
              >
                <Image
                  src={members.find((t) => t.id === activeId)?.image || ""}
                  alt="Preview"
                  fill
                  className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
                
                {/* Overlay Metadata */}
                <div className="absolute bottom-0 w-full bg-black p-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-[#DFFF00]" />
                    <span className="text-[10px] font-black italic uppercase tracking-widest text-[#DFFF00]">LIVE_AUTH_ID: {activeId.toUpperCase()}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

/* ---------- Row Component ---------- */

function TeamRow({
  data,
  index,
  isActive,
  setActiveId,
  isMobile,
  isAnyActive,
}: {
  data: TeamMember;
  index: number;
  isActive: boolean;
  setActiveId: (id: string | null) => void;
  isMobile: boolean;
  isAnyActive: boolean;
}) {
  const isDimmed = isAnyActive && !isActive;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isDimmed ? 0.2 : 1, 
        y: 0,
        backgroundColor: isActive ? '#DFFF00' : 'transparent'
      }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseEnter={() => !isMobile && setActiveId(data.id)}
      onMouseLeave={() => !isMobile && setActiveId(null)}
      onClick={() => isMobile && setActiveId(isActive ? null : data.id)}
      className={cn(
        "group relative border-t border-white/10 transition-colors duration-300 last:border-b",
        isMobile ? 'cursor-pointer' : 'cursor-default'
      )}
    >
      <div className="relative z-10 flex flex-col py-10 md:flex-row md:items-center md:justify-between md:py-16 px-4">
        
        {/* Name & Index Section */}
        <div className="flex items-baseline gap-8 md:gap-16 transition-transform duration-500 group-hover:translate-x-6">
          <span className={cn(
            "font-black italic text-sm transition-colors",
            isActive ? "text-black" : "text-white/20 group-hover:text-[#DFFF00]"
          )}>
            PROTO_{index + 1}
          </span>
          <h2 className={cn(
              "text-4xl font-black italic tracking-tighter transition-colors duration-300 md:text-8xl uppercase leading-none",
              isActive ? "text-black" : "text-white/40 group-hover:text-white"
          )}>
            {data.name}
          </h2>
        </div>

        {/* Role & Icon Section */}
        <div className="mt-6 flex items-center justify-between md:mt-0 md:justify-end md:gap-16">
          <span className={cn(
            "text-[10px] font-black italic uppercase tracking-[0.3em] transition-colors",
            isActive ? "text-black/60" : "text-white/20 group-hover:text-[#DFFF00]"
          )}>
            {data.role}
          </span>
          
          {/* Mobile Toggle Icon */}
          <div className={cn(
            "block md:hidden",
            isActive ? "text-black" : "text-white/40"
          )}>
            {isActive ? <Minus size={20} strokeWidth={3} /> : <Plus size={20} strokeWidth={3} />}
          </div>

          {/* Desktop Arrow */}
          <motion.div
             animate={{ x: isActive ? 0 : -20, opacity: isActive ? 1 : 0 }}
             className="hidden md:block text-black"
          >
             <ArrowUpRight size={48} strokeWidth={3} />
          </motion.div>
        </div>
      </div>

      {/* MOBILE ONLY: Inline Accordion Image */}
      <AnimatePresence>
        {isMobile && isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden bg-black"
          >
            <div className="p-4">
              <div className="relative aspect-video w-full overflow-hidden border-4 border-[#DFFF00]">
                <Image 
                  src={data.image} 
                  alt={data.name} 
                  className="h-full w-full object-cover grayscale" 
                  fill
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4">
                   <p className="text-xs font-black italic uppercase tracking-widest text-[#DFFF00]">SECURED_ACCESS</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}