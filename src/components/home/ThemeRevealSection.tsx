"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";
import { ArrowRight } from "lucide-react";

export function ThemeRevealSection() {
  return (
    <section className="relative py-32 overflow-hidden bg-black border-y border-white/5">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(223,255,0,0.03),transparent_50%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-end justify-between gap-12 text-left">
                
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex-1"
                >
                    <h2 className="text-6xl md:text-9xl font-black italic text-white leading-none tracking-tighter mb-8">
                        JOIN THE<br/>
                        <span className="text-[#DFFF00]">LEGACY.</span>
                    </h2>
                    
                    <div className="space-y-4 border-l-2 border-[#DFFF00] pl-6 max-w-md">
                        <p className="text-white font-black italic text-xl md:text-2xl uppercase">
                            {SITE_CONFIG.dates.long}
                        </p>
                        <p className="text-white/40 text-sm font-bold uppercase tracking-widest leading-relaxed">
                            Experience the 35th edition of BIT Mesra&apos;s premier festival. 
                            Cultural, Technical, and Sports events at the highest level.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col gap-4 w-full md:w-auto"
                >
                    <Link href={SITE_CONFIG.links.registration} className="group">
                        <div className="px-12 py-8 bg-[#DFFF00] text-black font-black italic text-2xl uppercase tracking-tighter flex items-center justify-between gap-8 hover:bg-white transition-colors">
                            Register Now
                            <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                        </div>
                    </Link>
                    
                    <Link href="/theme-reveal" className="group">
                        <div className="px-12 py-8 border-2 border-white/10 text-white font-black italic text-2xl uppercase tracking-tighter flex items-center justify-between gap-8 hover:border-[#DFFF00] hover:text-[#DFFF00] transition-all">
                            Theme Details
                            <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                        </div>
                    </Link>

                    <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.3em] font-sans mt-4 text-center md:text-right">
                        Only for @bitmesra.ac.in users
                    </p>
                </motion.div>

            </div>
        </div>
    </section>
  );
}
