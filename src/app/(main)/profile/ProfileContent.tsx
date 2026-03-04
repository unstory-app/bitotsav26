"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  CheckCircle,
  Printer,
  AlertTriangle
} from "lucide-react";
import { useUser } from "@stackframe/stack";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { syncUser } from "@/app/actions/user";

export default function ProfileContent() {
  const user = useUser({ or: "redirect" });
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(false);
      // Sync user to DB on load
      if (!synced) {
        syncUser({
          id: user.id,
          email: user.primaryEmail || "",
          displayName: user.displayName,
          profileImageUrl: user.profileImageUrl,
        }).then((result) => {
          if (!result.success) {
            setSyncError(result.message);
          }
          setSynced(true);
        });
      }
    }
  }, [user, synced]);

  if (loading || !user) return null;

  const qrData = encodeURIComponent(JSON.stringify({ 
    id: btoa(user.primaryEmail || user.id), 
    name: user.displayName || "Guest", 
    type: "SECURED_VISITOR_PASS", 
    valid: true 
  }));
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrData}&bgcolor=DFFF00&color=000&format=svg`;

  return (
    <PageWrapper className="pt-32 pb-20 bg-black min-h-screen relative overflow-hidden">
      {/* Texture Overlays */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 z-0 pointer-events-none bg-linear-to-t from-[#DFFF00]/5 to-transparent" />

      {/* Sync Error Banner */}
      {syncError && (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-12 p-6 bg-red-600/10 border-2 border-red-600 text-red-600 font-black italic uppercase tracking-tighter flex items-center gap-6 relative z-50"
        >
          <AlertTriangle className="w-10 h-10 shrink-0" />
          <div>
            <p className="text-xl mb-1 font-black underline">SYSTEM_CRITICAL: ACCESS_SYNC_FAILED</p>
            <p className="opacity-70 text-sm tracking-widest">{syncError}</p>
          </div>
        </motion.div>
      )}

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 mb-24 relative z-10 print:hidden">
          <div className="border-l-12 border-[#DFFF00] pl-10 py-6">
              <h1 className="text-7xl md:text-9xl font-black italic text-white uppercase leading-none tracking-tighter mb-4">
                  ACCESS_<span className="text-[#DFFF00]">ID.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/40 font-black italic uppercase tracking-[0.3em]">
                  UNIQUE_AUTHENTICATION_TOKEN_LOGGED_EST_2026.
              </p>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-32 relative z-10 flex flex-col lg:flex-row gap-16 items-start">
        
        {/* The Pass Container - 3D Tilt Effect */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ rotateY: 5, rotateX: -5 }}
            style={{ perspective: 1000 }}
            className="w-full lg:w-3/5 bg-black border-4 border-white/10 relative overflow-hidden group shadow-[0_50px_100px_-20px_#DFFF00/10] transition-all duration-700 hover:border-[#DFFF00]/40"
        >
            {/* Scanned Texture */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat mix-blend-overlay" />
            
            {/* Top Ticker Tape */}
            <div className="h-10 bg-[#DFFF00] flex items-center overflow-hidden border-b-2 border-black/20">
                <div className="flex gap-12 animate-marquee-fast whitespace-nowrap">
                    {[...Array(6)].map((_, i) => (
                        <span key={i} className="text-[10px] font-black italic text-black uppercase tracking-[0.4em]">
                            ★ HIGH_SENSITIVITY_DATA ★ AUTH_LEVEL_VIP ★ BITOTSAV_2026 ★ SECURE_ID: {user.id.slice(0, 12).toUpperCase()} —
                        </span>
                    ))}
                </div>
            </div>

            <div className="p-10 md:p-20 relative">
                {/* Vertical Meta Label */}
                <div className="absolute top-0 right-0 h-full w-12 border-l border-white/5 flex items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-black italic uppercase tracking-[0.8em] text-white/5 rotate-180 [writing-mode:vertical-lr] group-hover:text-[#DFFF00]/10 transition-colors">
                        VIP_ACCESS_PROTOCOL_B26
                    </span>
                </div>

                <div className="flex flex-col md:flex-row gap-12 items-center md:items-start mb-20 relative z-10">
                    {/* Portrait Frame */}
                    <div className="relative">
                        <div className="w-48 h-48 md:w-64 md:h-64 bg-white/5 border-4 border-white/10 p-2 overflow-hidden group-hover:border-[#DFFF00] transition-all duration-700">
                           {user.profileImageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={user.profileImageUrl} alt="Avatar" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                            ) : (
                                <div className="w-full h-full bg-black flex items-center justify-center text-7xl font-black italic text-[#DFFF00]">
                                    {(user.displayName || user.primaryEmail || "?")[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>
                        {/* Status Blinker */}
                        <div className="absolute -top-4 -left-4 px-4 py-2 bg-[#DFFF00] text-black font-black italic text-[8px] uppercase tracking-widest flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                            ACTIVE
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-6">
                        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-1 text-[10px] font-black italic uppercase tracking-widest text-[#DFFF00]">
                           <Zap className="w-3 h-3 fill-current" />
                           PERFORMER_RANK: #001
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black italic text-white uppercase leading-[0.85] tracking-tighter group-hover:text-[#DFFF00] transition-colors">
                            {user.displayName || "UNIT_NAME_ERR"}
                        </h2>
                        <div className="flex flex-col gap-1 border-l-4 border-[#DFFF00] pl-6 py-2">
                           <span className="text-[10px] font-black italic text-white/30 uppercase tracking-[0.3em]">PRIMARY_UPLINK</span>
                           <span className="text-xl font-black italic text-white uppercase tracking-tighter break-all">
                                {user.primaryEmail}
                           </span>
                        </div>
                    </div>
                </div>

                {/* Footer Badges */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-12 border-t border-white/5 relative z-10">
                    <div className="space-y-2">
                        <div className="text-[8px] font-black italic text-white/20 uppercase tracking-[0.4em]">ISSUE_DATE</div>
                        <div className="text-sm font-black italic text-white uppercase">FEB_13_2026</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-[8px] font-black italic text-white/20 uppercase tracking-[0.4em]">AUTH_LEVEL</div>
                        <div className="text-sm font-black italic text-[#DFFF00] uppercase">ACCESS_LEVEL_VIP</div>
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8">
                        <div className="text-[8px] font-black italic text-white/20 uppercase tracking-[0.4em]">TRANSIT_KEY</div>
                        <div className="text-sm font-black italic text-white uppercase opacity-40">{user.id.slice(0, 12).toUpperCase()}</div>
                    </div>
                </div>
            </div>
            
            {/* Background Decor */}
            <div className="absolute -bottom-10 -left-10 text-[20vw] font-black italic text-white/2 select-none pointer-events-none uppercase">ACCESS</div>
        </motion.div>

        {/* QR Section & Actions */}
        <div className="w-full lg:w-2/5 space-y-12 shrink-0">
           <motion.div 
             initial={{ opacity: 0, x: 50 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-white p-2 relative shadow-[20px_20px_0px_rgba(223,255,0,0.1)] group hover:shadow-[20px_20px_0px_#DFFF00] transition-all duration-700"
            >
                <div className="absolute inset-x-0 -top-6 flex justify-center">
                    <div className="bg-black text-[#DFFF00] px-6 py-2 border-2 border-[#DFFF00] font-black italic uppercase tracking-widest text-[10px]">
                       GATE_SCANNER_PROTOCOL
                    </div>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                    src={qrUrl}
                    alt="QR Pass" 
                    className="w-full h-auto grayscale group-hover:grayscale-0 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <CheckCircle className="w-24 h-24 text-black" />
                </div>
           </motion.div>

           <div className="grid grid-cols-1 gap-4 print:hidden">
                <button 
                  onClick={() => window.print()}
                  className="w-full py-8 bg-white/2 border-2 border-white/10 text-white font-black italic uppercase tracking-widest text-lg flex items-center justify-center gap-6 hover:bg-[#DFFF00] hover:text-black hover:border-transparent transition-all active:scale-[0.98]"
                >
                    <Printer className="w-6 h-6" />
                    GENERATE_HARD_COPY
                </button>
           </div>

           <div className="p-10 border-2 border-white/5 space-y-6 bg-white/1">
                <div className="flex items-center gap-4 text-[#DFFF00]">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="text-[10px] font-black italic uppercase tracking-[0.2em]">SECURITY_NOTICE</span>
                </div>
                <p className="text-white/30 text-xs font-black italic uppercase leading-relaxed tracking-wider">
                    KEEP_THIS_SIGNAL_SECURE. AUTHORIZED_PERSONNEL_ONLY. ANY_MISUSE_WILL_RESULT_IN_IMMEDIATE_REVOCATION_OF_TRANSIT_CREDENTIALS.
                </p>
           </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body { background: white !important; }
          nav, footer { display: none !important; }
          .print\\:hidden { display: none !important; }
          .bg-black { background-color: white !important; color: black !important; }
          .text-white { color: black !important; }
          .text-white\\/40, .text-white\\/30, .text-white\\/20, .text-white\\/10 { color: #666 !important; }
          .border-white\\/10, .border-white\\/5 { border-color: black !important; }
          .bg-[#DFFF00] { background-color: #DFFF00 !important; border: 4px solid black !important; }
          .shadow-\\[0_50px_100px_-20px_#DFFF00\\/10\\] { shadow: none !important; }
          .grayscale { filter: none !important; }
          .group-hover\\:text-\\[#DFFF00\\] { color: black !important; }
        }
      `}</style>
    </PageWrapper>
  );
}
