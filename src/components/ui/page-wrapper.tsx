"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <main className={cn("relative min-h-screen w-full overflow-hidden bg-[#1a0505] text-white pt-24", className)}>
      {/* Premium Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Base Gradient */}
          <div className="absolute inset-0 bg-linear-to-b from-[#1a0505] via-[#2d0f0f] to-[#1a0505]" />
          
          {/* Radial Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.05),transparent_70%)] opacity-60" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-[radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.02),transparent_70%)]" />

          {/* Grain Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Content Layer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 container mx-auto px-4 md:px-8 pb-16"
      >
        {children}
      </motion.div>
    </main>
  );
}
