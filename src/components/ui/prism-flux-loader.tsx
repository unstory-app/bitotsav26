"use client";

import React, { useState, useEffect } from "react";
import {PlusIcon} from "lucide-react"
interface CubeLoaderProps {
  size?: number; // cube size
  speed?: number; // rotation speed
}

export const PrismFluxLoader: React.FC<CubeLoaderProps> = ({
  size = 30,
  speed = 5,
}) => {
  const [time, setTime] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  // Loader steps
  const statuses = ["Fetching", "Fixing", "Updating", "Placing", "Syncing", "Processing"];

  // Cube rotation timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 0.02 * speed);
    }, 16);
    return () => clearInterval(interval);
  }, [speed]);

  // Status text timer (changes every 600ms)
  useEffect(() => {
    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statuses.length);
    }, 600);
    return () => clearInterval(statusInterval);
  }, [statuses.length]);

  const half = size / 2;
  const currentStatus = statuses[statusIndex];

  return (
    <div className="flex flex-col items-center justify-center gap-8 h-[300px]">
      {/* Cube Container */}
      <div
        className="relative"
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
          transform: `rotateY(${time * 30}deg) rotateX(${time * 30}deg)`,
        }}
      >
        {/* Cube Faces */}
        {statuses.slice(0, 6).map((text, i) => {
          const faceTransforms = [
            `rotateY(0deg) translateZ(${half}px)`,   // front
            `rotateY(180deg) translateZ(${half}px)`, // back
            `rotateY(90deg) translateZ(${half}px)`,  // right
            `rotateY(-90deg) translateZ(${half}px)`, // left
            `rotateX(90deg) translateZ(${half}px)`,  // top
            `rotateX(-90deg) translateZ(${half}px)`, // bottom
          ];

          return (
             <div
               key={i}
               className={`absolute flex items-center justify-center border border-[#D4AF37]/40 bg-black/40 backdrop-blur-sm shadow-[0_0_20px_rgba(223,255,0,0.1)]`}
               style={{
                 width: size,
                 height: size,
                 transform: faceTransforms[i],
                 backfaceVisibility: "visible",
               }}
             >
              <PlusIcon className="text-[#D4AF37] w-8 h-8 opacity-60" />
             </div>
           );
         })}
       </div>
 
       {/* Status Text Below Cube */}
       <div className="flex flex-col items-center gap-3">
           <div className="text-2xl font-black italic text-white tracking-widest uppercase animate-pulse">
             LOADING BITOTSAV
           </div>
           <div className="text-[10px] font-black italic text-[#D4AF37]/40 uppercase tracking-[0.3em]">
             {currentStatus} IN PROGRESS...
           </div>
       </div>
    </div>
  );
};
