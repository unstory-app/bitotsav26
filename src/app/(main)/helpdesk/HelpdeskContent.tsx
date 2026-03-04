"use client";

import { motion } from "framer-motion";
import { Mail, ExternalLink, Send, Cpu, Network } from "lucide-react";
import Link from "next/link";
import { PageWrapper } from "@/components/ui/page-wrapper";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: [0.16, 1, 0.3, 1] as const
    } 
  }
};

export default function HelpdeskContent() {
  return (
    <PageWrapper className="pt-32 pb-20 bg-black min-h-screen relative overflow-hidden">
      {/* Texture Overlays */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
      <div className="absolute top-0 right-0 w-1/2 h-full z-0 pointer-events-none bg-linear-to-l from-[#DFFF00]/5 to-transparent" />
      
      <div className="space-y-32 relative z-10">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-6 relative">
            <motion.div 
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute -top-20 -left-20 text-[20vw] font-black italic text-white/2 select-none pointer-events-none uppercase tracking-tighter"
            >
                SIGNAL
            </motion.div>
            
            <div className="relative z-10 border-l-12 border-[#DFFF00] pl-12 py-10">
                <h1 className="text-8xl md:text-10xl font-black italic text-white uppercase leading-none tracking-tighter mb-6">
                    SIGNAL_<span className="text-[#DFFF00]">CENTER.</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/40 font-black italic uppercase tracking-tighter max-w-2xl border-l-2 border-white/10 pl-8">
                    TECHNICAL_RIDER_SUBMISSION_AND_OPERATIONAL_UPLINK.
                </p>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Sidebar - Active Channels */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-4 space-y-8"
            >
              <div className="text-[10px] font-black italic uppercase tracking-[0.5em] text-[#DFFF00] mb-4">
                {"// ACTIVE_CHANNELS"}
              </div>

              <motion.div variants={itemVariants} className="p-8 bg-black border-2 border-white/10 group hover:border-[#DFFF00] transition-all relative overflow-hidden shadow-[10px_10px_0px_#DFFF00]/5">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-2 h-2 bg-green-500 animate-pulse shadow-[0_0_10px_#00ff00]" />
                   <span className="text-[8px] font-black italic uppercase tracking-[0.4em] text-[#DFFF00]/60">ENCRYPTED_SIGNAL_001</span>
                </div>
                <Network className="w-10 h-10 text-white mb-6 opacity-20 group-hover:text-[#DFFF00] transition-colors" />
                <h3 className="text-3xl font-black italic text-white mb-4 uppercase tracking-tighter">WHATSAPP_LINK</h3>
                <Link href="https://chat.whatsapp.com/KOqn2PWDhQ1LGlGqSMU4SK" target="_blank" className="flex items-center justify-between bg-white text-black font-black italic uppercase tracking-widest text-[10px] py-4 px-8 group-hover:bg-[#DFFF00] transition-colors">
                  <span>JOIN_CHNL</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="p-8 bg-black border-2 border-white/10 group hover:border-[#DFFF00] transition-all relative overflow-hidden">
                 <Mail className="w-10 h-10 text-white mb-6 opacity-20 group-hover:text-[#DFFF00] transition-colors" />
                 <h3 className="text-3xl font-black italic text-white mb-2 uppercase tracking-tighter">MAIL_UPLINK</h3>
                 <Link href="mailto:contact@bitotsav.com" className="text-[#DFFF00] text-sm font-black italic uppercase tracking-widest hover:underline decoration-2 underline-offset-8">
                    CONTACT@BITOTSAV.COM
                 </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="p-8 bg-red-950/20 border-2 border-red-900 group hover:border-red-600 transition-all relative overflow-hidden">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-3 h-3 bg-red-600 animate-ping" />
                    <span className="text-[8px] font-black italic uppercase tracking-[0.4em] text-red-600">CRITICAL_OVERRIDE</span>
                 </div>
                 <h3 className="text-3xl font-black italic text-red-600 mb-2 uppercase tracking-tighter">DISTRESS_SIG</h3>
                 <div className="text-white font-black italic text-xl border-l-4 border-red-600 pl-6 py-2">
                    +91 94718 28932
                 </div>
              </motion.div>
            </motion.div>

            {/* Main Console - Tech Rider Form */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-8 p-10 md:p-16 bg-white/5 border-2 border-white/10 relative group hover:border-[#DFFF00]/30 transition-colors"
            >
               {/* Console Decors */}
               <div className="absolute top-0 right-0 flex border-l border-b border-white/10">
                  <div className="w-12 h-12 border-r border-white/10 flex items-center justify-center text-[10px] font-black italic text-white/20">A1</div>
                  <div className="w-12 h-12 flex items-center justify-center text-[10px] font-black italic text-[#DFFF00] animate-pulse">●</div>
               </div>

               <div className="flex items-center gap-8 mb-20">
                  <div className="p-6 bg-[#DFFF00] -rotate-3 group-hover:rotate-0 transition-transform">
                    <Cpu className="w-10 h-10 text-black" />
                  </div>
                  <div>
                    <h3 className="text-4xl md:text-6xl font-black italic text-white uppercase tracking-tighter leading-none mb-2">TRANSMIT_REQUEST</h3>
                    <div className="h-1 w-full bg-linear-to-r from-[#DFFF00] to-transparent" />
                  </div>
               </div>

               <form className="space-y-16">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="relative">
                      <label className="text-[8px] text-[#DFFF00] mb-4 font-black italic uppercase tracking-[0.5em] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#DFFF00]/20" /> INPUT_SRC_NAME
                      </label>
                      <input type="text" className="w-full bg-black/40 border-l-4 border-white/10 p-5 text-white focus:outline-none focus:border-[#DFFF00] transition-all placeholder:text-white/5 font-black italic uppercase text-xl" placeholder="NAME_IDENTIFIER" />
                    </div>
                    <div className="relative">
                      <label className="text-[8px] text-[#DFFF00] mb-4 font-black italic uppercase tracking-[0.5em] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#DFFF00]/20" /> RETURN_PATH_ADDR
                      </label>
                      <input type="email" className="w-full bg-black/40 border-l-4 border-white/10 p-5 text-white focus:outline-none focus:border-[#DFFF00] transition-all placeholder:text-white/5 font-black italic uppercase text-xl" placeholder="EMAIL_ENCODING" />
                    </div>
                  </div>

                  {/* Channel Selection (Categories) */}
                  <div className="space-y-6">
                     <label className="text-[8px] text-[#DFFF00] mb-4 font-black italic uppercase tracking-[0.5em]">SELECT_CHANNEL</label>
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {['GENERAL_OP', 'LOGIN_CMD', 'VIP_QUERY', 'CORE_SYS'].map((topic) => (
                          <button key={topic} type="button" className="group/btn h-16 relative border-2 border-white/5 bg-black hover:border-[#DFFF00] transition-all flex items-center px-4 gap-4">
                            <div className="w-1 h-8 bg-white/10 group-hover/btn:bg-[#DFFF00] transition-colors" />
                            <span className="text-[10px] text-white/20 group-hover/btn:text-white font-black italic uppercase tracking-widest">{topic}</span>
                            <div className="ml-auto w-2 h-2 rounded-full bg-white/5 group-hover/btn:bg-[#DFFF00] group-hover/btn:shadow-[0_0_10px_#DFFF00]" />
                          </button>
                        ))}
                     </div>
                  </div>

                  {/* Message Packet (Textarea) */}
                  <div className="relative">
                      <label className="text-[8px] text-[#DFFF00] mb-4 font-black italic uppercase tracking-[0.5em] flex items-center justify-between">
                        READY_TO_ENCODE_MESSAGE
                        <span className="text-white/10">BUFFER: 100%</span>
                      </label>
                      <textarea rows={6} className="w-full bg-black/60 border-2 border-white/10 p-8 text-white focus:outline-none focus:border-[#DFFF00] transition-all placeholder:text-white/5 resize-none text-xl font-black italic uppercase tracking-tight leading-relaxed" placeholder="START_TRANSMISSION..."></textarea>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.01, filter: "brightness(1.2)" }}
                    whileTap={{ scale: 0.99 }}
                    type="button" 
                    className="w-full py-10 bg-[#DFFF00] text-black font-black italic uppercase tracking-[0.5em] text-2xl relative shadow-[0_30px_60px_-12px_rgba(223,255,0,0.3)] transition-all flex items-center justify-center gap-8 group"
                  >
                      <div className="absolute inset-0 bg-linear-to-r from-black/20 to-transparent" />
                      <span className="relative z-10">INITIALIZE_SEND</span>
                      <Send className="w-8 h-8 relative z-10 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />
                  </motion.button>
               </form>
            </motion.div>
          </div>
        </div>

        {/* Console Footprint */}
        <div className="max-w-7xl mx-auto px-6 pb-40">
          <div className="p-16 bg-white/2 border-x-2 border-white/5 flex flex-col md:flex-row items-center justify-between gap-12 group hover:bg-[#DFFF00]/5 hover:border-[#DFFF00]/20 transition-all duration-700">
            <div className="text-center md:text-left">
              <div className="text-[8px] text-white/20 font-black italic mb-4 tracking-[0.5em] uppercase">PHYSICAL_GRID_COORDINATES</div>
              <div className="text-3xl md:text-5xl font-black italic text-white uppercase tracking-tighter group-hover:text-white transition-colors">
                BIRLA_INSTITUTE_OF_TECHNOLOGY_MESRA
              </div>
            </div>
            <div className="flex gap-20 text-[10px] text-[#DFFF00]/40 uppercase tracking-[0.5em] font-black italic">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#DFFF00] shadow-[0_0_10px_#DFFF00]" />
                SYST_V2.0
              </div>
              <div>SIG_MAX</div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
