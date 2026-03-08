"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap,
  CheckCircle, 
  XCircle, 
  RefreshCcw,
  User,
  ShieldCheck
} from "lucide-react";
import { recordScan, getScanStats } from "@/app/actions/scan";
import { cn } from "@/lib/utils";
import { useCallback } from "react";

interface ScanResult {
  success: boolean;
  message: string;
  user?: {
    name: string | null;
    email: string;
  };
}

export default function ScannerContent() {
  const [passkey, setPasskey] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [selectedDay, setSelectedDay] = useState<0 | 1 | 2 | 3>(0);
  const [stats, setStats] = useState<[number, number, number, number]>([0, 0, 0, 0]);
  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);
  const [lastScanned, setLastScanned] = useState<{ email: string; time: number } | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // Auto-fetch stats on mount
  useEffect(() => {
    if (isAuthorized) {
        getScanStats("17092006").then(res => {
            if (res.success) setStats(res.counts as [number, number, number, number]);
        });
    }
  }, [isAuthorized]);

  const onScanSuccess = useCallback(async (decodedText: string) => {
    // If not authorized or already processing, skip
    if (!isAuthorized) return;

    try {
        // 1. Parse Data
        let parsedData;
        try {
            parsedData = JSON.parse(decodeURIComponent(decodedText));
        } catch {
            setScanResult({ success: false, message: "INVALID_QR: CORRUPTED" });
            return;
        }

        const email = atob(parsedData.id);

        // Cooldown: Don't scan the same person within 5 seconds
        if (lastScanned?.email === email && Date.now() - lastScanned.time < 5000) {
            return;
        }

        // 2. Call Server Action
        const result = await recordScan({ email, day: selectedDay, passkey: "17092006" });

        setLastScanned({ email, time: Date.now() });

        if (result.success) {
            const successRes = result as ScanResult;
            setScanResult(successRes);
            setRecentScans(prev => [successRes, ...prev.slice(0, 4)]);
            
            // Update stats
            setStats(prev => {
                const next = [...prev] as [number, number, number, number];
                // index matches day: day 0 -> index 0, day 1 -> index 1, etc.
                next[selectedDay]++;
                return next;
            });

            // Clear result after 2 seconds for rapid-fire
            setTimeout(() => setScanResult(null), 2000);
        } else {
            const failRes = { success: false, message: result.message, user: result.user } as ScanResult;
            setScanResult(failRes);
            setRecentScans(prev => [failRes, ...prev.slice(0, 4)]);
            setTimeout(() => {
                setScanResult(null);
            }, 3000);
        }
    } catch (err) {
        console.error("Scan processing error:", err);
        setScanResult({ success: false, message: "SYSTEM_FAILURE" });
    }
  }, [selectedDay, isAuthorized, lastScanned]);

  useEffect(() => {
    if (isAuthorized && !scannerRef.current) {
        scannerRef.current = new Html5QrcodeScanner(
          "reader",
          { fps: 15, qrbox: { width: 250, height: 250 } },
          /* verbose= */ false
        );

        scannerRef.current.render(onScanSuccess, onScanFailure);
    }

    return () => {
        if (scannerRef.current) {
            scannerRef.current.clear().catch(() => {});
            scannerRef.current = null;
        }
    };
  }, [isAuthorized, onScanSuccess]);

  function onScanFailure() {}

  if (!isAuthorized) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white/5 border-2 border-white/10 p-10 space-y-8"
            >
                <div className="text-center space-y-2">
                    <Zap className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
                    <h2 className="text-3xl font-black italic uppercase text-white">SCANNER LOCK</h2>
                    <p className="text-white/40 text-[10px] font-black italic uppercase tracking-widest">ENTER PROTOCOL KEY 001</p>
                </div>
                <input 
                    type="password"
                    placeholder="PASSKEY REQUIRED"
                    className="w-full bg-black border-2 border-white/10 p-4 font-black italic text-[#D4AF37] placeholder:text-white/10 uppercase tracking-widest focus:border-[#D4AF37] outline-none transition-all"
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && passkey === "17092006") setIsAuthorized(true);
                    }}
                />
                <button 
                    onClick={() => passkey === "17092006" && setIsAuthorized(true)}
                    className="w-full py-4 bg-[#D4AF37] text-[#1A0505] font-black italic uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all"
                >
                    INITIALIZE CONSOLE
                </button>
            </motion.div>
        </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 bg-black relative overflow-hidden px-4 md:px-6">
        {/* Background Grids */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
        
        <div className="max-w-6xl mx-auto relative z-10">
            {/* Header */}
            <div className="mb-8 md:mb-16 border-l-4 md:border-l-8 border-[#DFFF00] pl-4 md:pl-8 py-2 md:py-4">
                <h1 className="text-4xl md:text-7xl font-black italic text-white uppercase tracking-tighter leading-none mb-2">
                    SCANNER <span className="text-[#D4AF37]">CONSOLE.</span>
                </h1>
                <p className="text-white/40 font-black italic uppercase tracking-[0.2em] md:tracking-[0.3em] text-[8px] md:text-xs">
                    GATE VALIDATION PROTOCOL // SECTOR ALPHA
                </p>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-4 gap-2 md:gap-4 mb-8 md:mb-12">
                {[0, 1, 2, 3].map((d) => (
                    <div key={d} className={cn(
                        "p-3 md:p-6 border-2 transition-all",
                        selectedDay === d ? "bg-[#D4AF37]/10 border-[#D4AF37]" : "bg-white/5 border-white/10"
                    )}>
                        <p className={cn(
                            "text-[8px] md:text-[10px] font-black italic uppercase tracking-widest mb-1",
                            selectedDay === d ? "text-[#D4AF37]" : "text-white/30"
                        )}>DAY 0{d} TOTAL</p>
                        <p className="text-xl md:text-3xl font-black italic text-white">{stats[d]}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 items-start">
                
                {/* Visual Scanner Area - TOP on Mobile */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-6">
                    {/* Day Selector - Inline on Mobile */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {[0, 1, 2, 3].map((d) => (
                            <button
                                key={d}
                                onClick={() => setSelectedDay(d as 0 | 1 | 2 | 3)}
                                className={cn(
                                    "px-6 py-3 font-black italic uppercase tracking-widest text-[10px] border-2 transition-all whitespace-nowrap",
                                    selectedDay === d 
                                        ? "bg-[#D4AF37] text-[#1A0505] border-[#D4AF37]" 
                                        : "bg-white/5 text-white/40 border-white/10"
                                )}
                            >
                                SELECT_DAY_0{d}
                            </button>
                        ))}
                    </div>

                    <div className={cn(
                        "aspect-square max-w-lg mx-auto md:mx-0 w-full bg-black border-4 transition-colors duration-300 overflow-hidden relative",
                        scanResult?.success ? "border-[#D4AF37]" : scanResult === null ? "border-white/10" : "border-red-600"
                    )}>
                        <div id="reader" className="w-full h-full" />
                        
                        {/* Rapid Fire Feedback Overlay */}
                        <AnimatePresence>
                            {scanResult && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className={cn(
                                        "absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm",
                                        scanResult.success ? "bg-[#D4AF37]/80" : "bg-red-600/80"
                                    )}
                                >
                                    {scanResult.success ? (
                                        <CheckCircle className="w-24 h-24 text-black mb-4" />
                                    ) : (
                                        <XCircle className="w-24 h-24 text-white mb-4" />
                                    )}
                                    <h3 className={cn(
                                        "text-3xl font-black italic uppercase leading-none mb-2",
                                        scanResult.success ? "text-black" : "text-white"
                                    )}>
                                        {scanResult.success ? "VALIDATED" : "REJECTED"}
                                    </h3>
                                    <p className={cn(
                                        "text-xs font-black italic uppercase tracking-widest opacity-60",
                                        scanResult.success ? "text-black" : "text-white"
                                    )}>
                                        {scanResult.message}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right: Scanned User Info Display & Recent Scans */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-6 md:space-y-8">
                    {/* Active Info */}
                    <AnimatePresence mode="wait">
                        {scanResult?.user ? (
                            <motion.div 
                                key="userinfo"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white/5 border-2 border-white/10 p-6 md:p-10 space-y-6 md:space-y-8"
                            >
                                <div className="flex items-center gap-4 md:gap-6">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-[#D4AF37] flex items-center justify-center">
                                        <User className="w-8 h-8 md:w-10 md:h-10 text-black" />
                                    </div>
                                    <div className="space-y-1 overflow-hidden">
                                        <p className="text-white font-black italic uppercase leading-none text-xl md:text-2xl tracking-tighter truncate">
                                            {scanResult.user.name || "UNIT_00"}
                                        </p>
                                        <p className="text-[#D4AF37] font-black italic uppercase text-[8px] md:text-[10px] tracking-widest truncate">
                                            {scanResult.user.email}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="p-10 md:p-20 border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center space-y-4">
                                <RefreshCcw className="w-10 h-10 text-white/10 animate-spin-slow" />
                                <p className="text-white/20 font-black italic uppercase tracking-widest text-[10px]">AWAITING INPUT STREAM...</p>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Recent History */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white/40 px-2">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-[10px] font-black italic uppercase tracking-widest">RECENT LOGS</span>
                        </div>
                        <div className="space-y-2">
                            {recentScans.map((scan, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i} 
                                    className="p-4 bg-white/2 border border-white/5 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        {scan.success ? <CheckCircle className="w-4 h-4 text-[#D4AF37]" /> : <XCircle className="w-4 h-4 text-red-600" />}
                                        <div className="space-y-0.5">
                                            <p className="text-white text-[10px] font-bold italic uppercase">{scan.user?.name || "GUEST"}</p>
                                            <p className="text-white/20 text-[8px] font-black italic">{scan.user?.email}</p>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "text-[8px] font-black italic uppercase",
                                        scan.success ? "text-[#D4AF37]" : "text-red-600"
                                    )}>{scan.success ? "OK" : "ERR"}</span>
                                </motion.div>
                            ))}
                            {recentScans.length === 0 && (
                                <p className="text-center py-8 text-white/10 text-[10px] font-black italic uppercase border border-dashed border-white/5">NO SCAN HISTORY</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
