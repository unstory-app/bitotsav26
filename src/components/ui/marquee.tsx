"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  direction?: "left" | "right";
  speed?: "slow" | "medium" | "fast";
  className?: string;
  variant?: "yellow" | "outline" | "white";
}

export function Marquee({
  items,
  direction = "left",
  speed = "medium",
  className,
  variant = "yellow",
}: MarqueeProps) {
  const durationMap = {
    slow: "60s",
    medium: "40s",
    fast: "20s",
  };

  return (
    <div
      className={cn(
        "relative flex overflow-hidden whitespace-nowrap py-4 border-y border-black/10 select-none",
        variant === "yellow" && "bg-[#DFFF00] text-black font-black italic uppercase",
        variant === "outline" && "bg-transparent text-white font-black italic uppercase neon-stroke",
        variant === "white" && "bg-white text-black font-black italic uppercase",
        className
      )}
      style={{ "--duration": durationMap[speed] } as React.CSSProperties}
    >
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center justify-around gap-12 animate-marquee",
          direction === "right" && "direction-reverse"
        )}
      >
        {items.map((item, idx) => (
          <span key={idx} className="text-2xl md:text-4xl tracking-tighter">
            {item} <span className="mx-4 text-black/20">/</span>
          </span>
        ))}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "flex min-w-full shrink-0 items-center justify-around gap-12 animate-marquee",
          direction === "right" && "direction-reverse"
        )}
      >
        {items.map((item, idx) => (
          <span key={`dup-${idx}`} className="text-2xl md:text-4xl tracking-tighter">
            {item} <span className="mx-4 text-black/20">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
