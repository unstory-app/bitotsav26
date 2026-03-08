"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center" | "right";
}

export function SectionHeader({ 
  title, 
  subtitle, 
  className,
  align = "center" 
}: SectionHeaderProps) {
  return (
    <div className={cn(
      "mb-24 space-y-6",
      align === "center" && "text-center",
      align === "right" && "text-right",
      className
    )}>
      <motion.div
        initial={{ opacity: 0, x: align === "left" ? -20 : align === "right" ? 20 : 0, y: align === "center" ? 20 : 0 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={cn(
            "inline-block border-l-4 border-[#D4AF37] pl-6 py-1",
            align === "center" && "border-l-0 border-b-4 border-t-4 px-8 py-2",
            align === "right" && "border-l-0 border-r-4 pr-6 pl-0"
        )}
      >
        <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase leading-none">
            {title}
        </h2>
      </motion.div>

      {subtitle && (
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={cn(
            "text-lg md:text-xl text-white/40 font-black italic uppercase tracking-tighter max-w-2xl",
            align === "center" && "mx-auto",
            align === "right" && "ml-auto"
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
