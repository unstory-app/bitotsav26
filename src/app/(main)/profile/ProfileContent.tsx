"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Star, 
  CheckCircle,
  Printer,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { useUser } from "@stackframe/stack";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { syncUser } from "@/app/actions/user";
import { cn } from "@/lib/utils";

export default function ProfileContent() {
  const user = useUser({ or: "redirect" });
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [synced, setSynced] = useState(false);

  const isBitMesra = user.primaryEmail?.toLowerCase().endsWith("@bitmesra.ac.in");

  const qrData = isBitMesra ? encodeURIComponent(JSON.stringify({ 
    id: btoa(user.primaryEmail || user.id), 
    name: user.displayName || "Guest", 
    type: "HERITAGE_ARTISAN_PASS", 
    valid: true 
  })) : "";

  const qrUrl = isBitMesra ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrData}&bgcolor=FDF5E6&color=1A0505&format=svg` : "";

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
          qrData,
        }).then((result) => {
          if (!result.success) {
            setSyncError(result.message);
          }
          setSynced(true);
        });
      }
    }
  }, [user, synced, qrData]);

  if (loading || !user) return null;

  return (
    <PageWrapper className="pt-32 pb-20 bg-[#1A0505] min-h-screen relative overflow-hidden tapestry-bg">
      {/* Texture Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none tapestry-pattern opacity-10" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 z-0 pointer-events-none bg-linear-to-t from-[#D4AF37]/5 to-transparent" />

      {/* Sync Error Banner */}
      {syncError && (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-12 p-6 bg-red-600/10 border-2 border-red-600 text-red-600 font-black italic uppercase tracking-tighter flex items-center gap-6 relative z-50"
        >
          <AlertTriangle className="w-10 h-10 shrink-0" />
          <div>
            <p className="text-xl mb-1 font-black underline font-heading">VALIDATION ERROR: ACCOUNT SYNC DELAYED</p>
            <p className="opacity-70 text-sm tracking-widest uppercase">{syncError}</p>
          </div>
        </motion.div>
      )}

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12 md:mb-24 relative z-10 print:hidden">
          <div className="border-l-8 md:border-l-12 border-[#D4AF37] pl-6 md:pl-10 py-4 md:py-6">
              <h1 className="text-5xl md:text-9xl font-black italic text-[#FDF5E6] uppercase leading-none tracking-tighter mb-4 font-heading">
                  ARTISAN <span className="text-[#D4AF37]">PASS.</span>
              </h1>
              <p className="text-sm md:text-xl text-[#FDF5E6]/40 font-black italic uppercase tracking-[0.2em] md:tracking-[0.3em] font-heading">
                  LEGACY ENTRANCE // THE 35TH EDITION
              </p>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-20 md:mb-32 relative z-10 flex flex-col lg:flex-row gap-10 md:gap-16 items-start">
        
        {/* The Pass Container - 3D Tilt Effect */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full lg:w-3/5 bg-[#1A0505] border-4 border-[#D4AF37]/20 relative overflow-hidden group shadow-[0_50px_100px_-20px_#D4AF37/10] transition-all duration-700 hover:border-[#D4AF37]/40 stamp-edge"
        >
            {/* Scanned Texture */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none tapestry-pattern mix-blend-overlay" />
            
            {/* Decoration Bar */}
            <div className="h-10 bg-[#D4AF37] flex items-center justify-center border-b-2 border-black/20">
                <span className="text-[10px] font-black italic text-[#1A0505] uppercase tracking-[0.4em] font-heading">
                    BITOTSAV MMXXVI • HERITAGE REVEALED
                </span>
            </div>

            <div className="p-6 md:p-20 relative">
                {/* Vertical Meta Label */}
                <div className="absolute top-0 right-0 h-full w-12 border-l border-[#D4AF37]/10 flex items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-black italic uppercase tracking-[0.8em] text-[#D4AF37]/10 rotate-180 [writing-mode:vertical-lr] group-hover:text-[#D4AF37]/20 transition-colors font-heading">
                        ARTISAN GUILD // MEMBER
                    </span>
                </div>

                <div className="flex flex-col md:flex-row gap-12 items-center md:items-start mb-20 relative z-10">
                    {/* Portrait Frame */}
                    <div className="relative">
                        <div className="w-48 h-48 md:w-64 md:h-64 bg-white/5 heritage-border p-2 overflow-hidden transition-all duration-700 group-hover:scale-[1.02]">
                           {user.profileImageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={user.profileImageUrl} alt="Member" className="w-full h-full object-cover transition-all duration-700" />
                            ) : (
                                <div className="w-full h-full bg-secondary flex items-center justify-center text-7xl font-black italic text-[#D4AF37] font-heading">
                                    {(user.displayName || user.primaryEmail || "?")[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>
                        {/* Status Blinker */}
                        <div className="absolute -top-4 -left-4 px-4 py-2 bg-[#D4AF37] text-[#1A0505] font-black italic text-[8px] uppercase tracking-widest flex items-center gap-2 font-heading">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1A0505] animate-pulse" />
                            CONFIRMED
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-6">
                        <div className="inline-flex items-center gap-3 bg-[#D4AF37]/5 border border-[#D4AF37]/20 px-4 py-1 text-[10px] font-black italic uppercase tracking-widest text-[#D4AF37] font-heading">
                           <Star className="w-3 h-3 fill-current" />
                           GAATHA GUEST #001
                        </div>
                        <h2 className="text-4xl md:text-8xl font-black italic text-[#FDF5E6] uppercase leading-[0.85] tracking-tighter group-hover:text-[#D4AF37] transition-colors font-heading">
                            {user.displayName || "GUEST ARTISAN"}
                        </h2>
                        <div className="flex flex-col gap-1 border-l-4 border-[#D4AF37] pl-4 md:pl-6 py-2">
                           <span className="text-[8px] md:text-[10px] font-black italic text-[#FDF5E6]/30 uppercase tracking-[0.3em] font-heading">DIGITAL LINEAGE</span>
                           <span className="text-xl font-black italic text-[#FDF5E6] uppercase tracking-tighter break-all">
                                {user.primaryEmail}
                           </span>
                        </div>
                    </div>
                </div>

                {/* Footer Badges */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 pt-10 md:pt-12 border-t border-white/5 relative z-10">
                    <div className="space-y-1 md:space-y-2">
                        <div className="text-[7px] md:text-[8px] font-black italic text-[#FDF5E6]/20 uppercase tracking-[0.4em] font-heading">ISSUE DATE</div>
                        <div className="text-xs md:text-sm font-black italic text-[#FDF5E6] uppercase">MAR 19 2026</div>
                    </div>
                    <div className="space-y-1 md:space-y-2">
                        <div className="text-[7px] md:text-[8px] font-black italic text-[#FDF5E6]/20 uppercase tracking-[0.4em] font-heading">INVITATION</div>
                        <div className="text-xs md:text-sm font-black italic text-[#D4AF37] uppercase">EXPERIENCE PASS</div>
                    </div>
                    <div className="space-y-1 md:space-y-2 col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-8">
                        <div className="text-[7px] md:text-[8px] font-black italic text-[#FDF5E6]/20 uppercase tracking-[0.4em] font-heading">SIGIL CODE</div>
                        <div className="text-xs md:text-sm font-black italic text-[#FDF5E6] uppercase opacity-40 leading-none truncate">{user.id.slice(0, 12).toUpperCase()}</div>
                    </div>
                </div>
            </div>
            
            {/* Background Decor */}
            <div className="absolute -bottom-10 -left-10 text-[20vw] font-black italic text-[#FDF5E6]/2 select-none pointer-events-none uppercase font-heading">HERITAGE</div>
        </motion.div>

        {/* QR Section & Actions */}
        <div className="w-full lg:w-2/5 space-y-12 shrink-0">
           <motion.div 
             initial={{ opacity: 0, x: 50 }}
             animate={{ opacity: 1, x: 0 }}
             className={cn(
                 "p-2 relative shadow-[20px_20px_0px_rgba(223,255,0,0.1)] group transition-all duration-700",
                 isBitMesra ? "bg-white hover:shadow-[20px_20px_0px_#D4AF37]" : "bg-red-600/10 border-2 border-red-600 shadow-none"
             )}
            >
                <div className="absolute inset-x-0 -top-6 flex justify-center">
                    <div className={cn(
                        "px-6 py-2 border-2 font-black italic uppercase tracking-widest text-[10px] font-heading",
                        isBitMesra ? "bg-[#1A0505] text-[#D4AF37] border-[#D4AF37]" : "bg-red-900 text-white border-red-600"
                    )}>
                       {isBitMesra ? "HERITAGE VALIDATION" : "DOMAIN RESTRICTED"}
                    </div>
                </div>
                
                {isBitMesra ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src={qrUrl}
                            alt="QR Pass" 
                            className="w-full h-auto grayscale group-hover:grayscale-0 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <CheckCircle className="w-24 h-24 text-black" />
                        </div>
                    </>
                ) : (
                    <div className="w-full aspect-square flex flex-col items-center justify-center p-8 text-center space-y-6">
                        <AlertTriangle className="w-20 h-20 text-red-600 animate-pulse" />
                        <div>
                            <p className="text-red-800 font-black italic uppercase text-lg leading-tight mb-2 font-heading">ACCESS RESTRICTED</p>
                            <p className="text-[#FDF5E6]/40 font-black italic uppercase text-[10px] tracking-widest leading-relaxed font-heading">
                                Pass Generation Restricted to <span className="text-red-600">@BITMESRA.AC.IN</span> Domains.
                            </p>
                        </div>
                    </div>
                )}
           </motion.div>

           <div className="grid grid-cols-1 gap-4 print:hidden">
                <button 
                  onClick={() => isBitMesra && window.print()}
                  disabled={!isBitMesra}
                  className={cn(
                      "w-full py-8 text-lg font-black italic uppercase tracking-widest flex items-center justify-center gap-6 transition-all active:scale-[0.98] font-heading",
                      isBitMesra 
                        ? "bg-[#D4AF37]/5 border-2 border-[#D4AF37]/20 text-[#FDF5E6] hover:bg-[#D4AF37] hover:text-[#1A0505] hover:border-transparent" 
                        : "bg-white/5 border-2 border-white/5 text-white/20 cursor-not-allowed"
                  )}
                >
                    <Printer className="w-6 h-6" />
                    {isBitMesra ? "GET PHYSICAL INVITE" : "RESTRICTED ACCESS"}
                </button>
           </div>

           <div className="p-6 md:p-10 border-2 border-[#D4AF37]/10 space-y-4 md:space-y-6 bg-[#D4AF37]/5">
                <div className="flex items-center gap-4 text-[#D4AF37]">
                    <ShieldCheck className="w-5 h-5 font-heading" />
                    <span className="text-[10px] font-black italic uppercase tracking-[0.2em] font-heading">HERITAGE ETIQUETTE</span>
                </div>
                <p className="text-[#FDF5E6]/30 text-[10px] md:text-xs font-black italic uppercase leading-relaxed tracking-wider font-heading">
                    This digital sigil is your entrance to the Gaatha. Present it with pride. Unauthorized transfer will result in exclusion from the 35th Edition events.
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
          .bg-[#D4AF37] { background-color: #D4AF37 !important; border: 4px solid black !important; }
          .shadow-\\[0_50px_100px_-20px_#D4AF37\\/10\\] { shadow: none !important; }
          .grayscale { filter: none !important; }
          .group-hover\\:text-\\[#D4AF37\\] { color: black !important; }
        }
      `}</style>
    </PageWrapper>
  );
}
