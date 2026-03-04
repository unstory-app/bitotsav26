"use client";

import { motion } from "framer-motion";
import { Ticket, Zap } from "lucide-react";
import { SignIn } from "@stackframe/stack";

export default function LoginContent() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ticker */}
      <div className="absolute top-10 left-0 right-0 h-20 bg-white/5 flex items-center overflow-hidden -rotate-2">
        <div className="flex gap-20 animate-marquee whitespace-nowrap opacity-20">
            {[...Array(10)].map((_, i) => (
                <span key={i} className="text-4xl font-black italic text-white uppercase tracking-tighter">
                    AUTHENTICATION_REQUIRED — ESTABLISHING_SEQUENCE — 
                </span>
            ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-black border-4 border-[#DFFF00] p-12 relative shadow-[20px_20px_0px_#DFFF00]"
      >
        <div className="text-center mb-12">
            <div className="flex justify-center mb-8">
                <div className="w-20 h-20 bg-[#DFFF00] flex items-center justify-center">
                    <Ticket className="w-12 h-12 text-black" />
                </div>
            </div>
            <h1 className="text-6xl font-black italic text-white mb-4 uppercase tracking-tighter leading-none">THE_GATEWAY</h1>
            <p className="text-[#DFFF00] font-black italic text-xs uppercase tracking-[0.3em] bg-white/5 py-2 inline-block px-4">BIT_MESRA_WEBMAIL_AUTH</p>
        </div>

        {/* Webmail Notice */}
        <div className="mb-10 p-8 border-2 border-white/10 flex items-start gap-4 hover:border-[#DFFF00] transition-colors">
            <Zap className="w-6 h-6 text-[#DFFF00] shrink-0" />
            <div className="text-sm">
                <p className="text-white font-black italic uppercase mb-2">RESTRICTED_ACCESS</p>
                <p className="text-white/40 leading-relaxed font-black italic uppercase text-[10px] tracking-widest">
                    Only <span className="text-[#DFFF00]">@bitmesra.ac.in</span> domains are authorized for pass generation. 
                    Contact ERP Office for credentials.
                </p>
            </div>
        </div>

        <div className="stack-auth-container">
          <SignIn />
        </div>

        {/* Decorative corner */}
        <div className="absolute bottom-0 right-0 w-12 h-12 bg-[#DFFF00] -rotate-45 translate-x-6 translate-y-6" />
      </motion.div>

      <style jsx global>{`
        .stack-auth-container {
          --stack-primary: #DFFF00;
          --stack-background: transparent;
          --stack-surface: rgba(255, 255, 255, 0.05);
          --stack-border: rgba(255, 255, 255, 0.1);
          --stack-text: #ffffff;
          --stack-text-muted: rgba(255, 255, 255, 0.5);
          --stack-radius: 0px;
        }
        .stack-auth-container button {
          text-transform: uppercase;
          font-weight: 900 !important;
          font-style: italic !important;
          letter-spacing: 0.2em;
          font-size: 14px !important;
          border-radius: 0px !important;
          padding: 20px !important;
          border: 4px solid #DFFF00 !important;
          color: black !important;
        }
        .stack-auth-container input {
          background-color: black !important;
          border: 2px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 0px !important;
          font-size: 16px !important;
          padding: 15px !important;
        }
        .stack-auth-container input:focus {
          border-color: #DFFF00 !important;
        }
      `}</style>
    </div>
  );
}
