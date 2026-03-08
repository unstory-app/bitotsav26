"use client"

import * as React from "react"
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";
import { Magnet } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface MagnetizeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    particleCount?: number;
}

interface Particle {
    id: number;
    x: number;
    y: number;
}

function MagnetizeButton({
    className,
    particleCount = 12,
    children,
    ...props
}: MagnetizeButtonProps) {
    const [isAttracting, setIsAttracting] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);
    const particlesControl = useAnimation();

    useEffect(() => {
        const newParticles = Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            x: Math.random() * 360 - 180,
            y: Math.random() * 360 - 180,
        }));
        setParticles(newParticles);
    }, [particleCount]);

    const handleInteractionStart = useCallback(async () => {
        setIsAttracting(true);
        await particlesControl.start({
            x: 0,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 50,
                damping: 10,
            },
        });
    }, [particlesControl]);

    const handleInteractionEnd = useCallback(async () => {
        setIsAttracting(false);
        await particlesControl.start((i) => ({
            x: particles[i].x,
            y: particles[i].y,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        }));
    }, [particlesControl, particles]);

    return (
        <Button
            className={cn(
                "min-w-48 relative touch-none py-8 px-12",
                "bg-black border-4 border-[#D4AF37]",
                "hover:bg-[#D4AF37] hover:text-black transition-all duration-300",
                "text-[#D4AF37] font-black italic uppercase tracking-[0.2em] text-lg rounded-none",
                "shadow-[15px_15px_0px_rgba(223,255,0,0.1)]",
                className
            )}
            onMouseEnter={handleInteractionStart}
            onMouseLeave={handleInteractionEnd}
            onTouchStart={handleInteractionStart}
            onTouchEnd={handleInteractionEnd}
            {...props}
        >
            {particles.map((_, index) => (
                <motion.div
                    key={index}
                    custom={index}
                    initial={{ x: particles[index].x, y: particles[index].y }}
                    animate={particlesControl}
                    className={cn(
                        "absolute w-2 h-2",
                        "bg-[#D4AF37] transition-opacity duration-300",
                        isAttracting ? "opacity-100 scale-150" : "opacity-20"
                    )}
                />
            ))}
            {children || (
                <span className="relative w-full flex items-center justify-center gap-2">
                    <Magnet
                        className={cn(
                            "w-4 h-4 transition-transform duration-300",
                            isAttracting && "scale-110"
                        )}
                    />
                    {isAttracting ? "Attracting" : "Hover me"}
                </span>
            )}
        </Button>
    );
}

export { MagnetizeButton }