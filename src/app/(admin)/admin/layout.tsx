"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ShieldCheck, AlertTriangle } from "lucide-react";
import { PageWrapper } from "@/components/ui/page-wrapper";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);

  // Check session storage for persistence within the session
  useEffect(() => {
    const isAuth = sessionStorage.getItem("admin_auth") === "true";
    if (isAuth) setAuthorized(true);
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toLowerCase() === "anwita") {
      setAuthorized(true);
      sessionStorage.setItem("admin_auth", "true");
    } else {
      setError(true);
      setPasscode("");
      setTimeout(() => setError(false), 2000);
    }
  };

  if (!authorized) {
    return (
      <PageWrapper className="min-h-screen bg-[#1A0505] flex items-center justify-center p-6 pt-32">
        <div className="absolute inset-0 z-0 pointer-events-none tapestry-pattern opacity-5" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-[#D4AF37]/5 border-2 border-[#D4AF37]/20 p-10 md:p-16 relative z-10"
        >
          <div className="flex flex-col items-center text-center space-y-8">
            <div className={`p-6 rounded-full transition-colors duration-500 ${error ? 'bg-red-600/20 text-red-600' : 'bg-[#D4AF37]/10 text-[#D4AF37]'}`}>
              {error ? <AlertTriangle className="w-12 h-12" /> : <Lock className="w-12 h-12" />}
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-black italic text-[#FDF5E6] uppercase tracking-tighter font-heading">RESTRICTED <span className="text-[#D4AF37]">ACCESS.</span></h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]/40 font-heading">ADMINISTRATIVE OVERRIDE REQUIRED</p>
            </div>

            <form onSubmit={handleVerify} className="w-full space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]/60 block font-heading">ENTER PASSCODE</label>
                <input 
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  autoFocus
                  className="w-full bg-white/5 border-2 border-[#D4AF37]/20 p-4 text-[#FDF5E6] font-black uppercase tracking-tighter text-center text-2xl focus:border-[#D4AF37] outline-hidden font-heading"
                  placeholder="••••••"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-5 bg-[#D4AF37] text-[#1A0505] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all font-heading"
              >
                AUTHORIZE SESSION
              </button>
            </form>
          </div>
        </motion.div>
      </PageWrapper>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A0505]">
       {children}
    </div>
  );
}
