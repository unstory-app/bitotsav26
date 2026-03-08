"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@stackframe/stack";
import { SITE_CONFIG } from "@/config/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { X, Star, Menu } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const user = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    { name: "HOME", link: "/" },
    { name: "EVENTS", link: SITE_CONFIG.links.events },
    { name: "SCHEDULE", link: "/schedule" },
    { name: "SPONSORS", link: SITE_CONFIG.links.sponsors },
    { name: "BOARD", link: "/leaderboard" },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b",
        isScrolled 
          ? "bg-[#1A0505]/90 backdrop-blur-xl border-[#D4AF37]/20 py-4" 
          : "bg-transparent border-transparent py-8"
      )}
    >
      {/* Heritage Backdrop Detail */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none tapestry-bg" />
      
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-10">
        
        {/* Left: Brand & Status */}
        <div className="flex items-center gap-8">
            <Link href="/" className="group flex items-center gap-4">
                <div className="w-10 h-10 bg-[#D4AF37] flex items-center justify-center rotate-45 group-hover:rotate-0 transition-transform duration-500">
                    <Star className="w-6 h-6 text-[#1A0505] -rotate-45 group-hover:rotate-0 transition-transform" />
                </div>
                <div className="flex flex-col">
                    <span className="text-2xl font-black italic tracking-tighter text-[#FDF5E6] uppercase leading-none font-heading">
                        BITOTSAV&apos;26
                    </span>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                        <span className="text-[8px] font-black tracking-widest text-[#D4AF37]/60 uppercase">HERITAGE LIVE</span>
                    </div>
                </div>
            </Link>
        </div>

        {/* Center: Navigation Links (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
                <Link 
                    key={item.name}
                    href={item.link}
                    className={cn(
                        "px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative group",
                        pathname === item.link ? "text-[#D4AF37]" : "text-[#FDF5E6]/40 hover:text-[#FDF5E6]"
                    )}
                >
                    <span className="relative z-10">{item.name}</span>
                    {pathname === item.link && (
                        <motion.div 
                            layoutId="navUnderline"
                            className="absolute inset-0 bg-[#D4AF37]/10 border border-[#D4AF37]/20 z-0"
                        />
                    )}
                    <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#D4AF37] group-hover:w-full transition-all duration-500" />
                </Link>
            ))}
        </div>

        {/* Right: Mobile Trigger & Access */}
        <div className="flex items-center gap-4">
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-12 h-12 flex items-center justify-center bg-[#FDF5E6]/5 border border-[#D4AF37]/20 text-[#FDF5E6] hover:bg-[#D4AF37] hover:text-[#1A0505] transition-all"
            >
                {isMobileMenuOpen ? <X /> : <Menu className="animate-pulse" />}
            </button>

            {/* Access Button */}
            <Link 
                href={SITE_CONFIG.links.registration}
                className="hidden lg:flex px-8 py-3 bg-[#D4AF37] text-[#1A0505] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#FDF5E6] transition-all heritage-border translate-x-[-10px] hover:translate-x-0"
            >
                {user ? "PROFILE" : "AUTHENTICATE"}
            </Link>
        </div>

      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-0 z-60 bg-[#1A0505] block lg:hidden overflow-hidden"
          >
            <div className="absolute inset-0 opacity-[0.1] pointer-events-none tapestry-bg" />
            
            <div className="p-8 flex flex-col h-full relative z-10">
                <div className="flex justify-between items-center mb-20 text-[#FDF5E6]">
                    <span className="text-2xl font-black italic uppercase font-heading">SAGA.</span>
                    <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-12 h-12 flex items-center justify-center bg-[#FDF5E6]/5 border border-[#D4AF37]/20 text-[#D4AF37]"
                    >
                        <X />
                    </button>
                </div>

                <div className="space-y-4 flex-1">
                    {[
                      ...navItems,
                      ...(user
                        ? [{ name: "PROFILE", link: SITE_CONFIG.links.profile }]
                        : [{ name: "AUTHENTICATE", link: SITE_CONFIG.links.registration }]),
                    ].map((item, idx) => (
                        <motion.div
                            key={item.name}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Link 
                                href={item.link}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block text-5xl md:text-7xl font-black italic text-[#FDF5E6]/10 hover:text-[#D4AF37] uppercase tracking-tighter leading-none transition-colors font-heading"
                            >
                                {item.name}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-auto pt-10 border-t border-[#D4AF37]/20 flex justify-between items-end">
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">EST. 2026</span>
                        <span className="text-2xl font-black italic text-[#FDF5E6] uppercase tracking-tighter leading-none font-heading">BITOTSAV</span>
                    </div>
                    <div className="w-16 h-16 bg-[#D4AF37] flex items-center justify-center rotate-45">
                        <Star className="w-8 h-8 text-[#1A0505] -rotate-45" />
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
