"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Camera, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCcw,
  User,
  ShieldCheck
} from "lucide-react";
import { recordScan } from "@/app/actions/scan";
import { cn } from "@/lib/utils";

export default function ScannerContent() {
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [selectedDay, setSelectedDay] = useState<1 | 2 | 3>(1);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (isScanning && !scannerRef.current) {
        scannerRef.current = new Html5QrcodeScanner(
          "reader",
          { fps: 10, qrbox: { width: 250, height: 250 } },
          /* verbose= */ false
        );

        scannerRef.current.render(onScanSuccess, onScanFailure);
    }

    return () => {
        if (scannerRef.current) {
            scannerRef.current.clear().catch(error => {
                console.error("Failed to clear scanner:", error);
            });
            scannerRef.current = null;
        }
    };
  }, [isScanning, selectedDay]);

  async function onScanSuccess(decodedText: string) {
    try {
        // Pause scanning to process
        setIsScanning(false);
        if (scannerRef.current) {
            await scannerRef.current.clear();
            scannerRef.current = null;
        }

        // 1. Parse Data
        let parsedData;
        try {
            parsedData = JSON.parse(decodeURIComponent(decodedText));
        } catch (e) {
            setError("INVALID_QR_FORMAT: DATA_CORRUPTED");
            return;
        }

        const email = atob(parsedData.id); // Assuming ID is base64 encoded email as per ProfileContent logic

        // 2. Call Server Action
        const result = await recordScan({ email, day: selectedDay });

        if (result.success) {
            setScanResult(result);
            setError(null);
        } else {
            setError(result.message || "SCAN_ERROR: UNKNOWN");
            setScanResult(result.user ? { user: result.user } : null);
        }
    } catch (err) {
        console.error("Scan processing error:", err);
        setError("SYSTEM_FAILURE: RECOVERY_REQUIRED");
    }
  }

  function onScanFailure(error: any) {
    // We intentionally ignore scanning failures (e.g. no QR in frame)
  }

  function resetScanner() {
    setScanResult(null);
    setError(null);
    setIsScanning(true);
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-black relative overflow-hidden px-6">
        {/* Background Grids */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#DFFF00]/5 blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
            {/* Header */}
            <div className="mb-16 border-l-8 border-[#DFFF00] pl-8 py-4">
                <h1 className="text-5xl md:text-7xl font-black italic text-white uppercase tracking-tighter leading-none mb-2">
                    SCANNER <span className="text-[#DFFF00]">CONSOLE.</span>
                </h1>
                <p className="text-white/40 font-black italic uppercase tracking-[0.3em] text-xs">
                    GATE_VALIDATION_PROTOCOL // SECTOR_ALPHA
                </p>
            </div>

            {/* Day Selector */}
            <div className="flex gap-4 mb-12">
                {[1, 2, 3].map((d) => (
                    <button
                        key={d}
                        onClick={() => {
                            setSelectedDay(d as 1 | 2 | 3);
                            resetScanner();
                        }}
                        className={cn(
                            "flex-1 py-4 font-black italic uppercase tracking-widest text-xs border-2 transition-all",
                            selectedDay === d 
                                ? "bg-[#DFFF00] text-black border-[#DFFF00] shadow-[10px_10px_0px_rgba(223,255,0,0.1)]" 
                                : "bg-white/5 text-white/40 border-white/10 hover:border-white/20"
                        )}
                    >
                        DAY 0{d}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* Visual Scanner Area */}
                <div className="relative group">
                    <div className={cn(
                        "aspect-square bg-black border-4 transition-colors duration-500 overflow-hidden relative",
                        isScanning ? "border-white/10" : scanResult?.success ? "border-[#DFFF00]" : "border-red-600"
                    )}>
                        <div id="reader" className={cn("w-full h-full", !isScanning && "hidden")} />
                        
                        {!isScanning && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                                {scanResult?.success ? (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="space-y-6">
                                        <CheckCircle className="w-24 h-24 text-[#DFFF00] mx-auto" />
                                        <div className="space-y-2">
                                            <p className="text-[#DFFF00] font-black italic uppercase text-2xl">ACCESS_GRANTED</p>
                                            <p className="text-white/40 text-[10px] font-black italic uppercase tracking-[0.2em]">IDENTITY_VERIFIED</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="space-y-6">
                                        <XCircle className="w-24 h-24 text-red-600 mx-auto" />
                                        <div className="space-y-2">
                                            <p className="text-red-600 font-black italic uppercase text-2xl font-black italic uppercase">ACCESS_DENIED</p>
                                            <p className="text-white/40 text-[10px] font-black italic uppercase tracking-[0.2em]">{error || "UNKNOWN_ERROR"}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}

                        {/* Corner Accents */}
                        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/20" />
                        <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/20" />
                        <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/20" />
                        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/20" />
                    </div>

                    <button 
                        onClick={resetScanner}
                        className="mt-6 w-full py-4 bg-white/5 border border-white/10 text-white font-black italic uppercase tracking-widest text-xs flex items-center justify-center gap-4 hover:bg-white/10 transition-all"
                    >
                        <RefreshCcw className={cn("w-4 h-4", !isScanning && "animate-spin")} />
                        RE-INITIALIZE SCANNER
                    </button>
                </div>

                {/* Right: Scanned User Info Display */}
                <div className="space-y-8">
                    <AnimatePresence mode="wait">
                        {scanResult?.user ? (
                            <motion.div 
                                key="userinfo"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white/5 border-2 border-white/10 p-10 space-y-8"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-[#DFFF00] flex items-center justify-center">
                                        <User className="w-10 h-10 text-black" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-white font-black italic uppercase leading-none text-2xl tracking-tighter">
                                            {scanResult.user.name || "UNIT_00"}
                                        </p>
                                        <p className="text-[#DFFF00] font-black italic uppercase text-[10px] tracking-widest">
                                            {scanResult.user.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="p-4 border border-white/5 bg-black/40 flex items-center justify-between">
                                        <span className="text-[10px] font-black italic text-white/40 uppercase tracking-widest">GATE_SECTOR</span>
                                        <span className="font-black italic text-white uppercase text-xs">MAIN_STAGE</span>
                                    </div>
                                    <div className="p-4 border border-white/5 bg-black/40 flex items-center justify-between">
                                        <span className="text-[10px] font-black italic text-white/40 uppercase tracking-widest">TOKEN_STATUS</span>
                                        <span className={cn(
                                            "font-black italic uppercase text-xs",
                                            scanResult.success ? "text-[#DFFF00]" : "text-red-600"
                                        )}>
                                            {scanResult.success ? "VALIDATED" : "REJECTED"}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                className="border-4 border-dashed border-white/5 p-20 flex flex-col items-center justify-center text-center space-y-6"
                            >
                                <Camera className="w-16 h-16 text-white/20" />
                                <p className="text-white/20 font-black italic uppercase tracking-widest text-xs">
                                    AWAITING_UPLINK...<br/>SCAN_QR_TO_VALIDATE
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="p-8 bg-[#DFFF00]/5 border border-[#DFFF00]/10 space-y-4">
                        <div className="flex items-center gap-4 text-[#DFFF00]">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="text-xs font-black italic uppercase tracking-widest">ORGANIZER_NOTICE</span>
                        </div>
                        <p className="text-[10px] text-white/40 font-black italic uppercase leading-relaxed tracking-wider">
                            SCAN THE UNIQUE PASS GENERATED BY STUDENTS. ENSURE YOU HAVE SELECTED THE CORRECT DAY (01-03) BEFORE PROCEEDING. SYSTEM LOGS ALL ACTIONS.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
