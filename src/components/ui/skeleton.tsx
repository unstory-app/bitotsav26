"use client";

import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse bg-[#D4AF37]/5 border border-[#D4AF37]/10 relative overflow-hidden",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-linear-to-r before:from-transparent before:via-[#D4AF37]/10 before:to-transparent",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
