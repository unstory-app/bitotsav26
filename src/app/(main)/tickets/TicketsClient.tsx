"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  Ticket, 
  ShieldCheck, 
  Zap, 
  User as UserIcon, 
  School, 
  Key, 
  ChevronRight, 
  ChevronLeft,
  Loader2,
  Lock,
  Phone
} from "lucide-react";
import { useUser } from "@stackframe/stack";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { cn } from "@/lib/utils";
import { getUser, updateUserDetails, createTicket, hasTicket } from "@/app/actions/user";

const steps = [
  { id: "identity", title: "IDENTITY MINTING", icon: UserIcon, subtitle: "STEP 01 // PERSONAL SIGIL" },
  { id: "contact", title: "CONTACT SIGIL", icon: Phone, subtitle: "STEP 02 // COMMUNICATION WAVE" },
  { id: "lineage", title: "PROOF OF LINEAGE", icon: School, subtitle: "STEP 03 // ACADEMIC BONDS" },
  { id: "sigil", title: "DIGITAL SIGIL", icon: Ticket, subtitle: "STEP 04 // VISUAL MARK" },
  { id: "security", title: "SECURITY OVERRIDE", icon: Key, subtitle: "STEP 05 // RECOVERY SEAL" },
  { id: "finalize", title: "FINAL SEALING", icon: ShieldCheck, subtitle: "STEP 06 // PASS GENERATION" },
];

export default function TicketsClient() {
  const user = useUser();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [hasUserTicket, setHasUserTicket] = useState(false);
  const [form, setForm] = useState({
    displayName: "",
    phoneNumber: "",
    rollNo: "",
    idCardImageUrl: "",
    password: "",
  });

  const isBitMesra = user?.primaryEmail?.toLowerCase().endsWith("@bitmesra.ac.in");

  useEffect(() => {
    async function checkStatus() {
      if (user) {
        const ticketExists = await hasTicket(user.id);
        const dbUser = await getUser(user.id);
        setHasUserTicket(ticketExists);
        if (dbUser) {
          setForm({
            displayName: dbUser.displayName || user.displayName || "",
            phoneNumber: dbUser.phoneNumber || "",
            rollNo: dbUser.rollNo || "",
            idCardImageUrl: dbUser.idCardImageUrl || user.profileImageUrl || "",
            password: dbUser.password || "",
          });
        }
      }
      setChecking(false);
    }
    checkStatus();
  }, [user]);

  const handleNext = () => setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setActiveStep(prev => Math.max(prev - 1, 0));

  const handleFinalize = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const updateResult = await updateUserDetails(user.id, form);
      if (updateResult.success) {
        const ticketResult = await createTicket(user.id);
        if (ticketResult.success) {
          window.location.href = "/profile";
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#1A0505] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <PageWrapper className="pt-32 pb-20 bg-[#1A0505] min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8 max-w-2xl px-6">
           <h1 className="text-6xl md:text-8xl font-black italic text-[#FDF5E6] uppercase tracking-tighter font-heading">
             ACCESS <span className="text-[#D4AF37]">DENIED.</span>
           </h1>
           <p className="text-[#FDF5E6]/40 text-xl font-black uppercase tracking-widest font-heading">
             LOG IN TO REVEAL YOUR AUTHORIZATION TIER.
           </p>
           <button 
             onClick={() => window.location.href = "/handler/sign-in"}
             className="px-12 py-6 bg-[#D4AF37] text-[#1A0505] font-black uppercase tracking-widest hover:scale-105 transition-all font-heading"
           >
             VERIFY IDENTITY
           </button>
        </div>
      </PageWrapper>
    );
  }

  if (hasUserTicket) {
    return (
      <PageWrapper className="pt-32 pb-20 bg-[#1A0505] min-h-screen flex items-center justify-center relative overflow-hidden tapestry-bg">
        <div className="absolute inset-0 z-0 pointer-events-none tapestry-pattern opacity-10" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-12 max-w-4xl px-6 relative z-10"
        >
           <div className="flex justify-center mb-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-[#D4AF37]/20 blur-3xl rounded-full group-hover:bg-[#D4AF37]/40 transition-all" />
                <div className="p-10 bg-[#1A0505] border-2 border-[#D4AF37] text-[#D4AF37] relative z-10">
                  <ShieldCheck className="w-20 h-20" />
                </div>
              </div>
           </div>
           
           <div className="space-y-4">
              <h1 className="text-7xl md:text-9xl font-black italic text-[#FDF5E6] uppercase tracking-tighter font-heading leading-none">
                HERITAGE <span className="text-[#D4AF37]">SEALED.</span>
              </h1>
              <p className="text-[#FDF5E6]/40 text-xl font-black uppercase tracking-[0.4em] font-heading">
                YOUR LINEAGE HAS BEEN VERIFIED // THE 35TH EDITION
              </p>
           </div>

           <div className="p-1 bg-[#D4AF37]/20 inline-block">
             <div className="px-8 py-4 bg-[#1A0505] border border-[#D4AF37]/40">
                <p className="text-[#D4AF37] text-xs font-black uppercase tracking-widest font-heading">ARTISAN PASS #35-{user.id.slice(-6).toUpperCase()}</p>
             </div>
           </div>

           <div className="pt-8">
             <button 
               onClick={() => window.location.href = "/profile"}
               className="px-16 py-8 bg-[#D4AF37] text-[#1A0505] font-black uppercase tracking-[0.3em] text-sm hover:scale-105 active:scale-95 transition-all font-heading shadow-[10px_10px_0px_rgba(212,175,55,0.2)]"
             >
               REVEAL PASS AT HUB
             </button>
           </div>
        </motion.div>
      </PageWrapper>
    );
  }

  if (!isBitMesra) {
    return (
      <PageWrapper className="pt-32 pb-20 bg-[#1A0505] min-h-screen relative overflow-hidden tapestry-bg">
        <div className="absolute inset-0 z-0 pointer-events-none tapestry-pattern opacity-10" />
        
        <div className="max-w-7xl mx-auto px-6 mb-24 relative z-10">
           <h1 className="text-5xl md:text-9xl font-black italic text-[#FDF5E6] uppercase tracking-tighter leading-none mb-4 font-heading">
             THE <span className="text-[#D4AF37]">STORY.</span>
           </h1>
           <p className="text-xl text-[#FDF5E6]/40 font-black uppercase tracking-[0.3em] font-heading">
             EXTERNAL PARTICIPATION // HERITAGE AWAITS
           </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="space-y-10">
                    <p className="text-2xl md:text-4xl text-[#FDF5E6]/60 font-black italic uppercase leading-tight font-heading">
                      The Gaatha is not built on <span className="text-[#D4AF37]">Isolation</span>, but on <span className="text-[#D4AF37]">Unity</span>. 
                    </p>
                    <div className="p-10 border-l-4 border-[#D4AF37] bg-white/5 space-y-6">
                        <p className="text-[#FDF5E6]/80 text-sm md:text-lg leading-relaxed font-heading uppercase font-black tracking-wider">
                           While direct ticket minting is currently reserved for the architects of the host ground, every squadron is welcome to the battlefield.
                        </p>
                        <div className="pt-4">
                           <button 
                             onClick={() => window.location.href = "/events"}
                             className="px-10 py-5 bg-[#D4AF37] text-[#1A0505] font-black uppercase tracking-widest text-xs hover:scale-105 transition-all font-heading"
                           >
                             JOIN THE SQUADRON HUB
                           </button>
                        </div>
                    </div>
                </div>
                <div className="relative aspect-square opacity-40 grayscale group hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
                    <div className="absolute inset-0 border-2 border-[#D4AF37]/20 group-hover:border-[#D4AF37] transition-all" />
                    <div className="absolute -top-4 -left-4 w-20 h-20 border-t-4 border-l-4 border-[#D4AF37]" />
                    <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-4 border-r-4 border-[#D4AF37]" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src="https://images.unsplash.com/photo-1514525253361-bee200e5728a?auto=format&fit=crop&q=80" 
                      alt="Heritage Heritage" 
                      className="w-full h-full object-cover p-4"
                    />
                </div>
            </div>
        </div>
      </PageWrapper>
    );
  }

  const StepIcon = steps[activeStep].icon;

  return (
    <PageWrapper className="pt-32 pb-20 bg-[#1A0505] min-h-screen relative overflow-hidden tapestry-bg">
      <div className="absolute inset-0 z-0 pointer-events-none tapestry-pattern opacity-15" />
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <Zap className="w-6 h-6 text-[#D4AF37] animate-pulse" />
            <span className="text-sm font-black uppercase tracking-[0.4em] text-[#D4AF37]">IDENTIFIED: BIT MESRA STUDENT</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic text-[#FDF5E6] uppercase leading-none tracking-tighter font-heading">
            MINT YOUR <br/> <span className="text-[#D4AF37]">ARTISAN PASS.</span>
          </h1>
        </div>

        <div className="bg-[#D4AF37]/5 border-2 border-[#D4AF37]/20 relative overflow-hidden">
          <div className="h-1 bg-white/10 flex">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "flex-1 h-full transition-all duration-700",
                  i <= activeStep ? "bg-[#D4AF37]" : "bg-transparent"
                )} 
              />
            ))}
          </div>

          <div className="p-8 md:p-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-12"
              >
                <div className="flex items-center gap-6">
                  <div className="p-5 bg-[#D4AF37] text-[#1A0505]">
                    <StepIcon className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black uppercase text-[#FDF5E6] font-heading">{steps[activeStep].title}</h2>
                    <p className="text-[#D4AF37]/60 text-xs font-black uppercase tracking-widest font-heading">{steps[activeStep].subtitle}</p>
                  </div>
                </div>

                <div className="min-h-[200px]">
                  {activeStep === 0 && (
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] font-heading">ENTER FULL LEGAL NAME</label>
                        <input 
                          type="text"
                          value={form.displayName}
                          onChange={(e) => setForm({...form, displayName: e.target.value})}
                          placeholder="AS PER UNIVERSITY RECORDS"
                          className="w-full bg-white/5 border-2 border-[#D4AF37]/20 p-8 text-[#FDF5E6] font-black uppercase tracking-tighter text-3xl focus:border-[#D4AF37] outline-hidden font-heading transition-all"
                        />
                     </div>
                  )}

                  {activeStep === 1 && (
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] font-heading">CONTACT NUMBER</label>
                        <input 
                          type="tel"
                          value={form.phoneNumber}
                          onChange={(e) => setForm({...form, phoneNumber: e.target.value})}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full bg-white/5 border-2 border-[#D4AF37]/20 p-8 text-[#FDF5E6] font-black uppercase tracking-tighter text-3xl focus:border-[#D4AF37] outline-hidden font-heading transition-all"
                        />
                     </div>
                  )}

                  {activeStep === 2 && (
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] font-heading">UNIVERSITY ROLL NUMBER</label>
                        <input 
                          type="text"
                          value={form.rollNo}
                          onChange={(e) => setForm({...form, rollNo: e.target.value.toUpperCase()})}
                          placeholder="E.G. BTECH/10000/22"
                          className="w-full bg-white/5 border-2 border-[#D4AF37]/20 p-8 text-[#FDF5E6] font-black uppercase tracking-tighter text-3xl focus:border-[#D4AF37] outline-hidden font-heading transition-all"
                        />
                     </div>
                  )}

                  {activeStep === 3 && (
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] font-heading">PROFILE / ID IMAGE URL</label>
                        <input 
                          type="text"
                          value={form.idCardImageUrl}
                          onChange={(e) => setForm({...form, idCardImageUrl: e.target.value})}
                          placeholder="PASTE DIRECT IMAGE LINK"
                          className="w-full bg-white/5 border-2 border-[#D4AF37]/20 p-8 text-[#FDF5E6] font-black uppercase tracking-tighter text-3xl focus:border-[#D4AF37] outline-hidden font-heading transition-all"
                        />
                        <p className="text-[#FDF5E6]/30 text-[10px] uppercase font-black font-heading mt-2">This image will be etched onto your digital Artisan Pass.</p>
                     </div>
                  )}

                  {activeStep === 4 && (
                     <div className="space-y-6">
                        <div className="p-8 bg-red-600/5 border-l-4 border-red-600 flex items-start gap-6">
                           <Lock className="w-8 h-8 text-red-600 shrink-0" />
                           <p className="text-red-600/60 text-xs font-black uppercase leading-relaxed tracking-wider font-heading">
                             <span className="text-red-600">CRITICAL:</span> WE REQUIRE A RECOVERY PASSWORD TO ENSURE YOU CAN RECLAIM YOUR PASS IF YOU LOSE ACCESS TO YOUR DEVICE DURING THE FESTIVAL. THIS IS NOT FOR LOGIN, BUT FOR ON-SITE VERIFICATION.
                           </p>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] font-heading">RECOVERY SEAL (PASSWORD)</label>
                           <input 
                             type="password"
                             value={form.password}
                             onChange={(e) => setForm({...form, password: e.target.value})}
                             placeholder="••••••••"
                             className="w-full bg-white/5 border-2 border-[#D4AF37]/20 p-8 text-[#FDF5E6] font-black uppercase tracking-tighter text-3xl focus:border-[#D4AF37] outline-hidden font-heading transition-all"
                           />
                        </div>
                     </div>
                  )}

                  {activeStep === 5 && (
                     <div className="space-y-8">
                        <div className="p-8 bg-white/5 border-2 border-white/10 relative">
                           <div className="absolute top-4 right-4 text-[#D4AF37]">
                              <ShieldCheck className="w-12 h-12 opacity-20" />
                           </div>
                           <h4 className="text-[#D4AF37] text-xs font-black uppercase tracking-[0.3em] mb-6">SUMMARY OF LINEAGE</h4>
                           <div className="space-y-4">
                              <div className="flex justify-between border-b border-white/5 pb-2">
                                 <span className="text-[#FDF5E6]/40 text-[10px] font-black uppercase font-heading">NAME</span>
                                 <span className="text-[#FDF5E6] font-black uppercase font-heading">{form.displayName}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-2">
                                 <span className="text-[#FDF5E6]/40 text-[10px] font-black uppercase font-heading">PHONE</span>
                                 <span className="text-[#FDF5E6] font-black uppercase font-heading">{form.phoneNumber}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-2">
                                 <span className="text-[#FDF5E6]/40 text-[10px] font-black uppercase font-heading">ROLL NO</span>
                                 <span className="text-[#FDF5E6] font-black uppercase font-heading">{form.rollNo}</span>
                              </div>
                              <div className="flex justify-between">
                                 <span className="text-[#FDF5E6]/40 text-[10px] font-black uppercase font-heading">STATUS</span>
                                 <span className="text-green-500 font-black uppercase font-heading">READY FOR SEALING</span>
                              </div>
                           </div>
                        </div>
                        <p className="text-[#FDF5E6]/30 text-[10px] uppercase tracking-widest leading-relaxed text-center font-heading">
                           By proceeding, you witness that all provided data is true. Falsification of heritage leads to immediate revocation of all festival privileges.
                        </p>
                     </div>
                  )}
                </div>

                <div className="flex gap-6 mt-12">
                   {activeStep > 0 && (
                      <button 
                        onClick={handleBack}
                        disabled={loading}
                        className="flex-1 py-8 bg-white/5 border-2 border-white/10 text-[#FDF5E6] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all font-heading flex items-center justify-center gap-4"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        PREVIOUS
                      </button>
                   )}
                   <button 
                     onClick={activeStep === steps.length - 1 ? handleFinalize : handleNext}
                     disabled={loading}
                     className="flex-2 py-8 bg-[#D4AF37] text-[#1A0505] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all font-heading flex items-center justify-center gap-4 group"
                   >
                     {loading ? (
                       <Loader2 className="w-6 h-6 animate-spin" />
                     ) : (
                       <>
                         {activeStep === steps.length - 1 ? "FINALIZE & MINT PASS" : "PROCEED TO NEXT"}
                         {activeStep < steps.length - 1 && <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
                       </>
                     )}
                   </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-12 text-center">
           <p className="text-[#FDF5E6]/20 text-[10px] font-black uppercase tracking-widest font-heading">
             SECURED BY BITOTSAV HERITAGE PROTOCOL MMXXVI
           </p>
        </div>
      </div>
    </PageWrapper>
  );
}
