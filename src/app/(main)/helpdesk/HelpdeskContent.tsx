"use client";

import { motion } from "framer-motion";
import { Mail, ExternalLink, Send, ShieldAlert, Cpu, Network } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
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
      ease: [0.16, 1, 0.3, 1] as any
    } 
  }
};

export default function HelpdeskContent() {
  return (
    <PageWrapper>
      <div className="space-y-24">
        <SectionHeader 
          title="TERMINAL_SUPPORT." 
          subtitle="Direct uplink for operational assistance and community protocol."
          align="center"
        />

        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-1 space-y-6"
            >
              <motion.div variants={itemVariants} className="p-10 bg-black border-4 border-white/10 group hover:border-[#DFFF00] transition-all relative overflow-hidden">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-3 h-3 bg-green-500 animate-pulse shadow-[0_0_15px_#00ff00]" />
                   <span className="text-[10px] font-black italic uppercase tracking-[0.4em] text-[#DFFF00]">STATUS: UPLINK_ACTIVE</span>
                </div>
                <Network className="w-12 h-12 text-white mb-6 opacity-30 group-hover:text-[#DFFF00] transition-colors" />
                <h3 className="text-3xl font-black italic text-white mb-4 uppercase tracking-tighter">COMMS_HUB</h3>
                <p className="text-white/40 mb-8 text-xs font-black italic uppercase leading-relaxed tracking-widest">Join the primary signal group for real-time operational updates.</p>
                <Link href="https://chat.whatsapp.com/KOqn2PWDhQ1LGlGqSMU4SK" target="_blank" className="inline-flex items-center bg-[#DFFF00] text-black font-black italic uppercase tracking-[0.2em] text-xs py-5 px-10 hover:scale-105 transition-all">
                  <span>JOIN_WHATSAPP</span>
                  <ExternalLink className="w-4 h-4 ml-3" />
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="p-10 bg-black border-4 border-white/10 group hover:border-[#DFFF00] transition-all relative overflow-hidden">
                 <Mail className="w-12 h-12 text-white mb-6 opacity-30 group-hover:text-[#DFFF00] transition-colors" />
                 <h3 className="text-3xl font-black italic text-white mb-4 uppercase tracking-tighter">MAIL_UPLINK</h3>
                 <p className="text-white/40 mb-8 text-xs font-black italic uppercase leading-relaxed tracking-widest">Official protocol for formal inquiries and external coordination.</p>
                 <Link href="mailto:contact@bitotsav.com" className="text-[#DFFF00] text-sm font-black italic transition-colors uppercase tracking-widest border-b-2 border-transparent hover:border-[#DFFF00]">
                    contact@bitotsav.com
                 </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="p-10 bg-black border-4 border-red-900 group hover:border-red-600 transition-all relative overflow-hidden">
                 <ShieldAlert className="w-12 h-12 text-red-600 mb-6 opacity-30 group-hover:opacity-100 transition-opacity" />
                 <h3 className="text-3xl font-black italic text-white mb-4 uppercase tracking-tighter text-red-600">DISTRESS_SIG</h3>
                 <p className="text-red-900/60 mb-8 text-xs font-black italic uppercase leading-relaxed tracking-widest">Immediate response line for critical security or infrastructure failures.</p>
                 <div className="text-white font-black italic text-xl border-l-4 border-red-600 pl-6 py-2">
                    +91 94718 28932
                 </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 p-12 bg-black border-4 border-[#DFFF00] relative shadow-[30px_30px_0px_white/5]"
            >
               <div className="flex items-center gap-6 mb-16 relative z-10">
                  <div className="p-5 bg-[#DFFF00] border-4 border-[#DFFF00]">
                    <Cpu className="w-10 h-10 text-black" />
                  </div>
                  <h3 className="text-5xl font-black italic text-white uppercase tracking-tighter leading-none">TRANSMIT_DATA</h3>
               </div>

               <form className="space-y-12 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                      <label className="block text-[10px] text-white/40 mb-3 font-black italic uppercase tracking-[0.4em]">SOURCE_NAME</label>
                      <input type="text" className="w-full bg-black border-b-2 border-white/20 p-4 text-white focus:outline-none focus:border-[#DFFF00] transition-all placeholder:text-white/10 font-black italic uppercase text-lg" placeholder="INPUT_NAME" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-white/40 mb-3 font-black italic uppercase tracking-[0.4em]">UPLINK_ADDR</label>
                      <input type="email" className="w-full bg-black border-b-2 border-white/20 p-4 text-white focus:outline-none focus:border-[#DFFF00] transition-all placeholder:text-white/10 font-black italic uppercase text-lg" placeholder="INPUT_EMAIL" />
                    </div>
                  </div>

                  <div>
                     <label className="block text-[10px] text-white/40 mb-3 font-black italic uppercase tracking-[0.4em]">CATEGORY_ID</label>
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {['GENERAL', 'LOGIN_OPS', 'SPONSOR', 'CRITICAL'].map(topic => (
                          <button key={topic} type="button" className="py-4 px-2 border-2 border-white/10 bg-black text-[10px] text-white/40 hover:border-[#DFFF00] hover:text-[#DFFF00] transition-all font-black italic uppercase tracking-widest">
                            {topic}
                          </button>
                        ))}
                     </div>
                  </div>

                  <div>
                      <label className="block text-[10px] text-white/40 mb-3 font-black italic uppercase tracking-[0.4em]">MESSAGE_PACKET</label>
                      <textarea rows={6} className="w-full bg-black border-2 border-white/10 p-6 text-white focus:outline-none focus:border-[#DFFF00] transition-all placeholder:text-white/10 resize-none text-lg font-black italic uppercase tracking-tight leading-relaxed" placeholder="READY_TO_TRANSMIT..."></textarea>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button" 
                    className="w-full py-8 bg-[#DFFF00] text-black font-black italic uppercase tracking-[0.3em] text-xl hover:shadow-[0_0_50px_rgba(223,255,0,0.4)] transition-all flex items-center justify-center gap-6"
                  >
                      INITIALIZE_SEND
                      <Send className="w-6 h-6" />
                  </motion.button>
               </form>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-40">
          <div className="p-20 border-4 border-white/10 bg-black flex flex-col md:flex-row items-center justify-between gap-12 hover:border-[#DFFF00] transition-all duration-700">
            <div className="text-center md:text-left">
              <div className="text-[10px] text-white/30 font-black italic mb-4 tracking-[0.4em] uppercase">HQ_COORDINATES</div>
              <div className="text-4xl font-black italic text-white uppercase tracking-tighter">BIRLA INSTITUTE OF TECHNOLOGY, MESRA</div>
            </div>
            <div className="flex gap-16 text-[10px] text-[#DFFF00] uppercase tracking-[0.4em] font-black italic">
              <div>VER_2026.PROTO</div>
              <div>SIGNAL_STRENGTH_MAX</div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
