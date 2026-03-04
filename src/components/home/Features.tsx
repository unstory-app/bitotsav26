"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, Trophy, Music } from "lucide-react";

const features = [
  {
    title: "CULTURAL SAGA",
    description: "Witness the grand unification of dance, music, and drama on the royal stage.",
    icon: Music,
    image: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/66822cd4-62e8-423e-8b97-8cecc2c46dac/anim=false,width=450,optimized=true/120489483.jpeg", 
  },
  {
    title: "TECHNICAL CORE",
    description: "Showcase your engineering mastery in the most intense tech battles.",
    icon: Star,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop", 
  },
  {
    title: "ARENA SPORTS",
    description: "The ultimate display of grit and glory across the sports arena.",
    icon: Trophy,
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop", 
  },
];

export function Features() {
  return (
    <section className="py-40 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-24 border-b border-white/10 pb-12">
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl"
            >
                <div className="inline-flex items-center gap-2 bg-[#DFFF00] px-3 py-1 text-[10px] font-black italic uppercase tracking-widest text-black mb-6">
                    <Star className="w-3 h-3 fill-current" />
                    THE FLAGSHIPS
                </div>
                <h2 className="text-6xl md:text-8xl font-black italic leading-none tracking-tighter uppercase text-white">
                    CHAPTERS <br className="hidden md:block" /> OF THE SAGA.
                </h2>
            </motion.div>
            
            <motion.p 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-white/40 font-black italic uppercase tracking-tighter text-right max-w-xs"
            >
                Three distinct realms converging for four days of pure absolute energy.
            </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative bg-white/5 border border-white/10 aspect-3/4 overflow-hidden flex flex-col justify-end p-10 hover:border-[#DFFF00] transition-all duration-500"
            >
              {/* Background revealed on hover */}
              <div className="absolute inset-0 opacity-20 grayscale group-hover:opacity-60 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700">
                <Image 
                    src={feature.image} 
                    alt={feature.title} 
                    fill 
                    className="object-cover" 
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
              </div>

              <div className="relative z-10 space-y-4">
                <feature.icon className="w-12 h-12 text-[#DFFF00]" />
                <h3 className="text-4xl font-black italic uppercase leading-none tracking-tighter text-white group-hover:text-[#DFFF00] transition-colors">
                    {feature.title}
                </h3>
                <p className="text-sm font-black italic uppercase tracking-tighter text-white/40 group-hover:text-white transition-colors">
                    {feature.description}
                </p>
              </div>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-white/0 group-hover:border-[#DFFF00] transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
