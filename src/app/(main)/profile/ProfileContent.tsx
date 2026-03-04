"use client";

import { useEffect, useState } from "react";
import { Printer, CheckCircle, Zap, AlertTriangle } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
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
    <PageWrapper>
      {/* Sync Error Banner */}
      {syncError && (
        <div className="max-w-2xl mx-auto mb-12 p-6 bg-red-600 text-white font-black italic uppercase tracking-tighter flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <div>
            <p className="text-lg mb-1">PROTO_ERROR: ACCESS_DENIED</p>
            <p className="text-white/80 text-sm">{syncError}</p>
          </div>
        </div>
      )}

      <div className="print:hidden">
        <SectionHeader 
            title="THE PASS." 
            subtitle="Your unique access token for the endless saga."
            align="center"
        />
      </div>

      <div className="max-w-2xl mx-auto mb-32 group">
        <div className="bg-black border-4 border-[#DFFF00] shadow-[30px_30px_0px_#DFFF00] transition-transform hover:-translate-x-2 hover:-translate-y-2 overflow-hidden relative">
            
            {/* Ticker Border */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-[#DFFF00] flex items-center overflow-hidden">
                <div className="flex gap-10 animate-marquee whitespace-nowrap">
                    {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-[10px] font-black italic text-black uppercase tracking-[0.3em]">
                            SECURED_TRANSIT — AUTH_ID: {user.id.slice(0, 8).toUpperCase()} — BITOTSAW 2026 — 
                        </span>
                    ))}
                </div>
            </div>

            {/* Content Body */}
            <div className="p-12 pt-20">
                <div className="flex flex-col md:flex-row items-center gap-10 mb-12 border-b border-white/10 pb-12">
                    <div className="w-32 h-32 bg-[#DFFF00] p-1 border-4 border-[#DFFF00] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                        {user.profileImageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.profileImageUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-black flex items-center justify-center text-5xl font-black italic text-[#DFFF00]">
                                {(user.displayName || user.primaryEmail || "?")[0]?.toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h2 className="text-4xl md:text-6xl font-black italic text-white uppercase tracking-tighter leading-none mb-4">
                            {user.displayName || "GUEST_UNIT"}
                        </h2>
                        <p className="text-sm font-black italic text-[#DFFF00] uppercase tracking-widest bg-white/5 py-2 px-4 inline-block border border-white/10">
                            {user.primaryEmail}
                        </p>
                        
                        <div className="flex items-center justify-center md:justify-start gap-4 mt-6 text-[#DFFF00]">
                            <CheckCircle className="w-5 h-5 fill-current text-black" />
                            <span className="text-sm font-black italic uppercase tracking-[0.3em]">TRANSIT_VERIFIED</span>
                            <Zap className="w-4 h-4 fill-current ml-2 animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* QR Pass */}
                <div className="flex flex-col items-center">
                    <div className="p-8 bg-[#DFFF00] border-4 border-[#DFFF00] relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src={qrUrl}
                            alt="QR Pass" 
                            width={240}
                            height={240}
                            className="bg-black p-2"
                        />
                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-black border-4 border-[#DFFF00] flex items-center justify-center">
                            <Zap className="w-6 h-6 text-[#DFFF00]" />
                        </div>
                    </div>
                    <p className="mt-8 text-xs font-black italic text-white/30 uppercase tracking-[0.4em]">DIGITAL_SAGA_ENTRY_KEY</p>
                </div>
            </div>

            {/* Print Footer Button */}
            <div className="print:hidden p-10 bg-white/5 border-t border-white/10 flex justify-center">
                <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-4 px-12 py-6 bg-white text-black font-black italic text-xl uppercase tracking-widest hover:bg-[#DFFF00] transition-all active:scale-95"
                >
                    <Printer className="w-6 h-6" />
                    HARD_COPY
                </button>
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
          .border-[#DFFF00] { border-color: black !important; }
          .bg-[#DFFF00] { background-color: white !important; border: 4px solid black !important; }
        }
      `}</style>
    </PageWrapper>
  );
}
