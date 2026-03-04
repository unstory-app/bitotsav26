"use client";

import * as React from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type FocusRailItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc: string;
  href?: string;
  meta?: string;
};

interface FocusRailProps {
  items: FocusRailItem[];
  initialIndex?: number;
  loop?: boolean;
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

/**
 * Helper to wrap indices (e.g., -1 becomes length-1)
 */
function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

/**
 * Physics Configuration
 * Base spring for spatial movement (x/z)
 */
const BASE_SPRING = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1,
} as const;

/**
 * Scale Spring
 * Bouncier spring specifically for the visual "Click/Tap" feedback on the center card
 */
const TAP_SPRING = {
  type: "spring",
  stiffness: 450,
  damping: 18, // Lower damping = subtle overshoot/wobble "tap"
  mass: 1,
} as const;

export function FocusRail({
  items,
  initialIndex = 0,
  loop = true,
  autoPlay = false,
  interval = 4000,
  className,
}: FocusRailProps) {
  const [active, setActive] = React.useState(initialIndex);
  const [isHovering, setIsHovering] = React.useState(false);
  const lastWheelTime = React.useRef<number>(0);

  const count = items.length;
  const activeIndex = wrap(0, count, active);
  const activeItem = items[activeIndex];

  // --- NAVIGATION HANDLERS ---
  const handlePrev = React.useCallback(() => {
    if (!loop && active === 0) return;
    setActive((p) => p - 1);
  }, [loop, active]);

  const handleNext = React.useCallback(() => {
    if (!loop && active === count - 1) return;
    setActive((p) => p + 1);
  }, [loop, active, count]);

  // --- MOUSE WHEEL / TRACKPAD LOGIC ---
  const onWheel = React.useCallback(
    (e: React.WheelEvent) => {
      const now = Date.now();
      // Debounce: prevent rapid firing from inertia scrolling (400ms lockout)
      if (now - lastWheelTime.current < 400) return;

      // Detect horizontal scroll primarily, but also fallback to vertical if shift is held
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = isHorizontal ? e.deltaX : e.deltaY;

      // Threshold to avoid accidental micro-scrolls
      if (Math.abs(delta) > 20) {
        if (delta > 0) {
          handleNext();
        } else {
          handlePrev();
        }
        lastWheelTime.current = now;
      }
    },
    [handleNext, handlePrev]
  );

  // Autoplay logic
  React.useEffect(() => {
    if (!autoPlay || isHovering) return;
    const timer = setInterval(() => handleNext(), interval);
    return () => clearInterval(timer);
  }, [autoPlay, isHovering, handleNext, interval]);

  // Keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  };

  // --- SWIPE / DRAG LOGIC ---
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const onDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      handleNext();
    } else if (swipe > swipeConfidenceThreshold) {
      handlePrev();
    }
  };

  const visibleIndices = [-2, -1, 0, 1, 2];

  return (
    <div
      className={cn(
        "group relative flex h-[700px] w-full flex-col overflow-hidden bg-black text-white outline-none select-none overflow-x-hidden",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onWheel={onWheel}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`bg-${activeItem.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={activeItem.imageSrc}
              alt=""
              fill
              className="object-cover blur-2xl opacity-40 saturate-200 transition-opacity duration-1000"
              priority={false}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Stage */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-4 md:px-8">
        {/* DRAGGABLE RAIL CONTAINER */}
        <motion.div
          className="relative mx-auto flex h-[360px] w-full max-w-6xl items-center justify-center perspective-distant cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={onDragEnd}
        >
          {visibleIndices.map((offset) => {
            const absIndex = active + offset;
            const index = wrap(0, count, absIndex);
            const item = items[index];

            if (!loop && (absIndex < 0 || absIndex >= count)) return null;

            const isCenter = offset === 0;
            const dist = Math.abs(offset);

            // Dynamic transforms
            const xOffset = offset * 320;
            const zOffset = -dist * 180;
            const scale = isCenter ? 1 : 0.85;
            const rotateY = offset * -20;

            const opacity = isCenter ? 1 : Math.max(0.4, 1 - dist * 0.3);
            const blur = isCenter ? 0 : dist * 2;
            const brightness = isCenter ? 1 : 0.7;

            return (
              <motion.div
                key={absIndex}
                className={cn(
                  "absolute aspect-3/4 w-[280px] md:w-[340px] bg-white text-black shadow-2xl transition-all duration-300 will-change-transform",
                  isCenter ? "z-20 border-4 border-[#DFFF00]" : "z-10 border border-white/10"
                )}
                initial={false}
                animate={{
                  x: xOffset,
                  z: zOffset,
                  scale: scale, // Trigger "tap" via TAP_SPRING when this changes
                  rotateY: rotateY,
                  opacity: opacity,
                  filter: `blur(${blur}px) brightness(${brightness})`,
                }}
                transition={{
                    scale: TAP_SPRING,
                    default: BASE_SPRING
                }}
                style={{
                  transformStyle: "preserve-3d",
                }}
                onClick={() => {
                  if (offset !== 0) setActive((p) => p + offset);
                }}
              >
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  fill
                  className="object-cover pointer-events-none grayscale group-hover:grayscale-0 transition-all duration-500"
                />

                {/* Lighting layers */}
                <div className="absolute inset-0 bg-linear-to-b from-white/10 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-black/5 pointer-events-none mix-blend-multiply" />
                
                {/* Decorative border if center */}
                {isCenter && (
                    <div className="absolute inset-0 border-8 border-black/5 pointer-events-none" />
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Info & Controls */}
        <div className="mx-auto mt-12 flex w-full max-w-4xl flex-col items-center justify-between gap-6 md:flex-row pointer-events-auto">
          <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left h-32 justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                {activeItem.meta && (
                  <span className="text-xs font-black italic uppercase tracking-[0.3em] text-[#DFFF00]">
                    {activeItem.meta}
                  </span>
                )}
                <h2 className="text-4xl font-black italic tracking-tighter md:text-6xl text-white uppercase leading-none">
                  {activeItem.title}
                </h2>
                {activeItem.description && (
                  <p className="max-w-md text-white/50 font-black italic uppercase tracking-tighter text-sm">
                    {activeItem.description}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-white p-1">
              <button
                onClick={handlePrev}
                className="p-3 text-black transition hover:bg-black hover:text-[#DFFF00] active:scale-95"
                aria-label="Previous"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <span className="min-w-[60px] text-center text-sm font-black italic text-black uppercase">
                {activeIndex + 1} / {count}
              </span>
              <button
                onClick={handleNext}
                className="p-3 text-black transition hover:bg-black hover:text-[#DFFF00] active:scale-95"
                aria-label="Next"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {activeItem.href && (
              <Link
                href={activeItem.href}
                className="group flex items-center gap-3 bg-[#DFFF00] px-8 py-4 text-sm font-black italic uppercase tracking-widest text-black transition-transform hover:scale-105 active:scale-95"
              >
                Explore Session
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}