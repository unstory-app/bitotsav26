import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface PremiumButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
}

export function PremiumButton({ children, className, ...props }: PremiumButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative group px-10 py-5 font-black italic uppercase tracking-[0.2em] text-sm md:text-base overflow-hidden border-4 border-[#DFFF00] bg-black text-[#DFFF00] hover:bg-[#DFFF00] hover:text-black transition-all duration-300 shadow-[10px_10px_0px_rgba(223,255,0,0.2)]",
        className
      )}
      {...props}
    >
      {/* Glossy highlight */}
      <div className="absolute top-0 left-0 w-full h-[20%] bg-white/10 group-hover:bg-black/10 transition-colors" />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-3">
        {children}
      </span>
    </motion.button>
  );
}
