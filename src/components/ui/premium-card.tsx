import React from "react";
import { cn } from "@/lib/utils";

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function PremiumCard({ children, className, ...props }: PremiumCardProps) {
  return (
    <div 
      className={cn(
        "relative rounded-2xl overflow-hidden bg-black/80 backdrop-blur-md border border-[#D4AF37]/30",
        "shadow-[0_0_20px_rgba(0,0,0,0.5)] group hover:border-[#D4AF37] hover:shadow-[0_0_30px_rgba(223,255,0,0.15)] transition-all duration-500",
        className
      )}
      {...props}
    >
      {/* Corner Trim */}
      <div className="absolute -top-1 -left-1 w-6 h-6 bg-[#D4AF37] rotate-45 -translate-x-3 -translate-y-3" />
      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#D4AF37] rotate-45 translate-x-3 translate-y-3" />
      
      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}
