"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@stackframe/stack";
import { SITE_CONFIG } from "@/config/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { X, Zap, Activity } from "lucide-react";

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
    { name: "LEGEND", link: "/leaderboard" },
    { name: "HELPDESK", link: "/helpdesk" },
    ...(user
      ? [{ name: "PROFILE", link: SITE_CONFIG.links.profile }]
      : [{ name: "ACCESS", link: SITE_CONFIG.links.registration }]),
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b",
        isScrolled 
          ? "bg-black/80 backdrop-blur-xl border-white/10 py-4" 
          : "bg-transparent border-transparent py-8"
      )}
    >
      {/* Technical Background Details */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
      
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-10">
        
        {/* Left: Brand & Status */}
        <div className="flex items-center gap-8">
            <Link href="/" className="group flex items-center gap-4">
                <div className="w-10 h-10 bg-[#DFFF00] flex items-center justify-center rotate-45 group-hover:rotate-0 transition-transform duration-500">
                    <Zap className="w-6 h-6 text-black -rotate-45 group-hover:rotate-0 transition-transform" />
                </div>
                <div className="flex flex-col">
                    <span className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">
                        BITOTSAV&apos;26
                    </span>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#DFFF00] animate-pulse" />
                        <span className="text-[8px] font-black italic text-[#DFFF00]/60 uppercase tracking-widest">STATUS: ONLINE</span>
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
                        "px-6 py-2 text-xs font-black italic uppercase tracking-[0.2em] transition-all relative group",
                        pathname === item.link ? "text-[#DFFF00]" : "text-white/40 hover:text-white"
                    )}
                >
                    <span className="relative z-10">{item.name}</span>
                    {pathname === item.link && (
                        <motion.div 
                            layoutId="navUnderline"
                            className="absolute inset-0 bg-white/5 border border-white/10 z-0"
                        />
                    )}
                    <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#DFFF00] group-hover:w-full transition-all duration-500" />
                </Link>
            ))}
        </div>

        {/* Right: Mobile Trigger & Access */}
        <div className="flex items-center gap-4">
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 text-white hover:bg-[#DFFF00] hover:text-black transition-all"
            >
                {isMobileMenuOpen ? <X /> : <Activity className="animate-pulse" />}
            </button>

            {/* Terminal Access Button (Desktop Only) */}
            <Link 
                href={SITE_CONFIG.links.registration}
                className="hidden lg:flex px-8 py-3 bg-[#DFFF00] text-black text-xs font-black italic uppercase tracking-[0.3em] hover:bg-white transition-all shadow-[10px_10px_0px_rgba(223,255,0,0.1)] hover:shadow-none translate-x-[-10px] hover:translate-x-0"
            >
                {user ? "DASHBOARD" : "ACCESS CONSOLE"}
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
            className="fixed inset-0 z-60 bg-black block lg:hidden overflow-hidden"
          >
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
            
            <div className="p-8 flex flex-col h-full">
                <div className="flex justify-between items-center mb-20">
                    <span className="text-2xl font-black italic text-white uppercase">MENU.</span>
                    <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 text-[#DFFF00]"
                    >
                        <X />
                    </button>
                </div>

                <div className="space-y-4 flex-1">
                    {navItems.map((item, idx) => (
                        <motion.div
                            key={item.name}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Link 
                                href={item.link}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block text-5xl md:text-7xl font-black italic text-white/20 hover:text-[#DFFF00] uppercase tracking-tighter leading-none transition-colors"
                            >
                                {item.name}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-auto pt-10 border-t border-white/10 flex justify-between items-end">
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-black italic text-[#DFFF00] uppercase tracking-widest">ACCESS CODE</span>
                        <span className="text-2xl font-black italic text-white uppercase tracking-tighter leading-none">B26-SAGA</span>
                    </div>
                    <div className="w-16 h-16 bg-[#DFFF00] flex items-center justify-center rotate-45">
                        <Zap className="w-8 h-8 text-black -rotate-45" />
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
