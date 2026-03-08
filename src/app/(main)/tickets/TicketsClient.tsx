"use client";

import { motion } from "framer-motion";
import { Check, Ticket, Star, Crown, Zap } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { cn } from "@/lib/utils";
import { PageWrapper } from "@/components/ui/page-wrapper";

const ticketTiers = [
  {
     name: "DAY PASS",
    price: "TBD",
    description: "Single day authorization for the experience.",
    icon: Ticket,
    features: ["Access: 1 Selected Day", "Pro Nite: General Standing", "Stall Access: Included"],
    recommended: false,
  },
  {
    name: "FEST PASS PRO",
    price: "TBD",
    description: "Full system access for all 4 days.",
    icon: Star,
    features: ["Access: All 4 Days", "Pro Nite: Priority Standing", "Priority Entry", "Official Merch Kit"],
    recommended: true,
  },
  {
    name: "ELITE ACCESS",
    price: "TBD",
    description: "The ultimate concert override.",
    icon: Crown,
    features: ["Access: VIP Zone", "Artist Meet & Greet", "Exclusive Lounge", "Premium Merch Kit", "Backstage Experience"],
    recommended: false,
  },
];

export default function TicketsClient() {
  return (
    <PageWrapper className="pt-32 pb-20">
      
      <div className="max-w-7xl mx-auto px-6 mb-32">
        <SectionHeader 
            title="THE PASS." 
            subtitle="Secure your authorization level for the biggest saga of 2026."
            align="left"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {ticketTiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
              "relative p-12 flex flex-col transition-all duration-500 group",
              tier.recommended 
                ? "bg-[#D4AF37] text-black shadow-[0_0_80px_rgba(223,255,0,0.1)]" 
                : "bg-white/5 text-white border border-white/10 hover:border-[#D4AF37] hover:bg-white/10"
            )}
          >
            {tier.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-black text-[#D4AF37] text-[10px] font-black italic uppercase tracking-[0.3em]">
                MOST POPULAR
              </div>
            )}

            <div className="mb-10">
                <tier.icon className={cn("w-12 h-12 mb-8", tier.recommended ? "text-black" : "text-[#D4AF37]")} />
                <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-4">{tier.name}</h3>
                <p className={cn("text-xs font-black italic uppercase tracking-widest", tier.recommended ? "text-black/40" : "text-white/40")}>
                    {tier.description}
                </p>
            </div>

            <div className={cn("mb-12 pb-12 border-b", tier.recommended ? "border-black/10" : "border-white/10")}>
                <span className={cn("font-black italic tracking-tighter", tier.price === "TBD" ? "text-4xl" : "text-6xl")}>{tier.price}</span>
                <span className={cn("text-[10px] font-black italic uppercase ml-2", tier.recommended ? "text-black/40" : "text-white/40")}>/ AUTHORIZATION</span>
            </div>

            <ul className="space-y-6 mb-12 flex-1">
                {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-4">
                        <Check className={cn("w-4 h-4", tier.recommended ? "text-black" : "text-[#D4AF37]")} />
                        <span className={cn("text-[10px] font-black italic uppercase tracking-widest", tier.recommended ? "text-black/60" : "text-white/60")}>
                            {feature}
                        </span>
                    </li>
                ))}
            </ul>

            <button className={cn(
                "w-full py-6 text-lg font-black italic uppercase tracking-widest transition-all",
                tier.recommended 
                    ? "bg-black text-[#D4AF37] hover:scale-105" 
                    : "bg-[#D4AF37] text-black hover:scale-105"
            )}>
                Authorize Now
            </button>
          </motion.div>
        ))}
      </div>

      {/* Student Discount Override */}
      <div className="max-w-7xl mx-auto px-6 mt-32">
        <div className="bg-white text-black p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 group">
            <div className="space-y-6 relative z-10 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-[#D4AF37] px-3 py-1 text-[10px] font-black italic uppercase tracking-widest">
                    <Zap className="w-3 h-3 fill-current" />
                    EXCLUSIVE OVERRIDE
                </div>
                <h2 className="text-5xl md:text-7xl font-black italic leading-none tracking-tighter uppercase">
                    BIT MESRA <br/>DISCOUNT.
                </h2>
                <p className="max-w-lg text-lg font-black italic uppercase tracking-tighter opacity-60">
                    Students of BIT Mesra receive 50% flat discount on all passes. Decrypt your code now.
                </p>
            </div>
            
            <button className="px-12 py-6 bg-black text-white text-xl font-black italic uppercase tracking-tighter hover:bg-[#D4AF37] hover:text-black transition-all relative z-10">
                Verify Identity
            </button>

            <div className="absolute inset-0 flex items-center justify-center text-[15vw] font-black italic text-black/2 select-none pointer-events-none uppercase tracking-tighter leading-none">
                BITIAN
            </div>
        </div>
      </div>

    </PageWrapper>
  );
}
