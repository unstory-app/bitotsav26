"use client";

import { motion } from "framer-motion";
import { SITEPARTNERS } from "@/config/site";
import Image from "next/image";

export function Sponsors() {
  return (
    <section className="py-40 relative overflow-hidden bg-black">
      
      <div className="max-w-7xl mx-auto px-6 text-center mb-24 relative z-10">
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 bg-[#DFFF00] px-3 py-1 text-[10px] font-black italic uppercase tracking-widest text-black mb-8">
                PARTNERS IN THE SAGA
            </div>
            <h2 className="text-6xl md:text-9xl font-black italic tracking-tighter text-white uppercase leading-none">
                THE ALLIANCE.
            </h2>
            <p className="mt-8 text-white/40 font-black italic uppercase tracking-tighter max-w-xl mx-auto text-sm">
                Powering the experience through strategic vision and unified support. Join the protocol partners.
            </p>
          </motion.div>
      </div>
      
      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden border-y border-white/10 py-20 bg-white/5">
          {/* Marquee Animation */}
          <div className="flex gap-20 animate-marquee whitespace-nowrap">
              {[...SITEPARTNERS, ...SITEPARTNERS].map((pkg, idx) => (
                  <div key={`${pkg.name}-${idx}`} className="flex gap-20 items-center">
                    {pkg.partners.map((sponsor, index) => (
                        <div 
                          key={`${sponsor.name}-${index}`}
                          className="relative flex flex-col items-center gap-4 group px-10"
                        >
                            <div className="w-48 h-24 bg-white p-6 flex items-center justify-center group-hover:bg-[#DFFF00] transition-all duration-500 grayscale group-hover:grayscale-0 transform group-hover:scale-110 relative">
                                <Image 
                                    src={sponsor.logo} 
                                    alt={sponsor.name} 
                                    fill
                                    className="p-4 object-contain" 
                                />
                            </div>
                            <span className="text-[10px] font-black italic tracking-[0.3em] text-[#DFFF00] uppercase opacity-40 group-hover:opacity-100 transition-all">
                                {pkg.name}
                            </span>
                        </div>
                    ))}
                  </div>
              ))}
          </div>
      </div>
    </section>
  );
}
