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
import { syncUser, getUser, updateUserDetails, createTicket, hasTicket } from "@/app/actions/user";
import { getUserTeams, createTeam, joinTeam } from "@/app/actions/team";
import { cn } from "@/lib/utils";
import { User, Team } from "@/db/schema";
import { Upload, Key, School, User as UserIcon, Users, Plus, Link as LinkIcon, ExternalLink } from "lucide-react";
import { events } from "@/lib/data/events";

export default function ProfileContent() {
  const user = useUser({ or: "redirect" });
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [synced, setSynced] = useState(false);
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [hasUserTicket, setHasUserTicket] = useState(false);
  const [regStep, setRegStep] = useState(0);
  const [userTeams, setUserTeams] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [teamForm, setTeamForm] = useState({ name: "", eventId: "" });
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "info" });

  // Registration Form State
  const [regForm, setRegForm] = useState({
    displayName: "",
    collegeName: "",
    rollNo: "",
    password: "",
    idCardImageUrl: "",
  });

  const isBitMesra = user.primaryEmail?.toLowerCase().endsWith("@bitmesra.ac.in");

  useEffect(() => {
    if (user) {
      setLoading(false);
      
      const initializeUser = async () => {
        // First sync basic data
        const syncResult = await syncUser({
          id: user.id,
          email: user.primaryEmail || "",
          displayName: user.displayName,
          profileImageUrl: user.profileImageUrl,
        });

        if (!syncResult.success) {
          setSyncError(syncResult.message);
        }

        // Fetch DB data
        const existingDbUser = await getUser(user.id);
        setDbUser(existingDbUser);

        // Check for ticket
        const ticketExists = await hasTicket(user.id);
        setHasUserTicket(ticketExists);

        // Pre-fill form
        if (existingDbUser) {
          setRegForm({
            displayName: existingDbUser.displayName || user.displayName || "",
            collegeName: existingDbUser.collegeName || "",
            rollNo: existingDbUser.rollNo || "",
            password: existingDbUser.password || "",
            idCardImageUrl: existingDbUser.idCardImageUrl || user.profileImageUrl || "",
          });
        }
        
        // Fetch user teams
        const teamsData = await getUserTeams(user.id);
        setUserTeams(teamsData);

        setSynced(true);
      };

      if (!synced) {
        initializeUser();
      }
    }
  }, [user, synced]);

  const handleCreateTeam = async () => {
    if (!teamForm.name || !teamForm.eventId) {
      setStatusMessage({ text: "Please provide team name and select an event.", type: "error" });
      return;
    }
    setLoading(true);
    const result = await createTeam(teamForm.name, teamForm.eventId, user.id);
    if (result.success) {
      setStatusMessage({ text: `Team created! Code: ${result.code}`, type: "success" });
      setShowCreateModal(false);
      const updated = await getUserTeams(user.id);
      setUserTeams(updated);
    } else {
      setStatusMessage({ text: result.message || "Failed to create team.", type: "error" });
    }
    setLoading(false);
  };

  const handleJoinTeam = async () => {
    if (!joinCodeInput) return;
    setLoading(true);
    const result = await joinTeam(joinCodeInput, user.id);
    if (result.success) {
      setStatusMessage({ text: "Successfully joined the team!", type: "success" });
      setShowJoinModal(false);
      setJoinCodeInput("");
      const updated = await getUserTeams(user.id);
      setUserTeams(updated);
    } else {
      setStatusMessage({ text: result.message || "Invalid code or join failed.", type: "error" });
    }
    setLoading(false);
  };

  const handleFinishRegistration = async () => {
    setLoading(true);
    const updateResult = await updateUserDetails(user.id, {
      ...regForm,
      idCardImageUrl: regForm.idCardImageUrl || user.profileImageUrl || "",
    });

    if (updateResult.success) {
      const ticketResult = await createTicket(user.id);
      if (ticketResult.success) {
        setHasUserTicket(true);
        // Refresh local DB user data
        const updated = await getUser(user.id);
        setDbUser(updated);
      } else {
        setSyncError("Ticket generation failed: " + ticketResult.message);
      }
    } else {
      setSyncError("Registration update failed: " + updateResult.message);
    }
    setLoading(false);
  };

  const qrData = hasUserTicket ? encodeURIComponent(JSON.stringify({ 
    id: btoa(user.primaryEmail || user.id), 
    name: dbUser?.displayName || user.displayName || "Guest", 
    type: "HERITAGE_ARTISAN_PASS", 
    valid: true 
  })) : "";

  const qrUrl = hasUserTicket ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrData}&bgcolor=FDF5E6&color=1A0505&format=svg` : "";

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#1A0505] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
        
        {!hasUserTicket ? (
          /* Registration Wizard */
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto bg-[#D4AF37]/5 border-2 border-[#D4AF37]/20 p-8 md:p-16 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <ShieldCheck className="w-64 h-64 text-[#D4AF37]" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-12">
                {[0, 1, 2, 3].map((step) => (
                  <div key={step} className={cn(
                    "h-1 flex-1 transition-all duration-500",
                    regStep >= step ? "bg-[#D4AF37]" : "bg-white/10"
                  )} />
                ))}
              </div>

              {regStep === 0 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="p-4 bg-[#D4AF37] text-[#1A0505]">
                      <UserIcon className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black uppercase text-[#FDF5E6] font-heading">IDENTITY MINTING</h2>
                      <p className="text-[#D4AF37]/60 text-xs font-black uppercase tracking-widest font-heading">STEP 01 // PERSONAL SIGIL</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] font-heading">FULL LEGAL NAME</label>
                      <input 
                        type="text"
                        value={regForm.displayName}
                        onChange={(e) => setRegForm({...regForm, displayName: e.target.value})}
                        className="w-full bg-white/5 border-2 border-[#D4AF37]/20 p-6 text-[#FDF5E6] font-black uppercase tracking-tighter focus:border-[#D4AF37] transition-all outline-hidden font-heading"
                        placeholder="ENTER YOUR NAME"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] font-heading">PROFILE / ID IMAGE URL</label>
                      <input 
                        type="text"
                        value={regForm.idCardImageUrl}
                        onChange={(e) => setRegForm({...regForm, idCardImageUrl: e.target.value})}
                        className="w-full bg-white/5 border-2 border-[#D4AF37]/20 p-6 text-[#FDF5E6] font-black uppercase tracking-tighter focus:border-[#D4AF37] transition-all outline-hidden font-heading"
                        placeholder="PASTE IMAGE URL OR USE DEFAULT"
                      />
                    </div>
                  </div>
                </div>
              )}

              {regStep === 1 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="p-4 bg-[#D4AF37] text-[#1A0505]">
                      <School className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black uppercase text-[#FDF5E6] font-heading">GUILD AFFILIATION</h2>
                      <p className="text-[#D4AF37]/60 text-xs font-black uppercase tracking-widest font-heading">STEP 02 // ACADEMIC LINEAGE</p>
                    </div>
                  </div>
                  
                  {isBitMesra ? (
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] font-heading">BIT MESRA ROLL NO</label>
                       <input 
                        type="text"
                        value={regForm.rollNo}
                        onChange={(e) => setRegForm({...regForm, rollNo: e.target.value})}
                        className="w-full bg-white/5 border-2 border-[#D4AF37]/20 p-6 text-[#FDF5E6] font-black uppercase tracking-tighter focus:border-[#D4AF37] transition-all outline-hidden font-heading"
                        placeholder="BTECH/10000/22"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] font-heading">COLLEGE / INSTITUTION NAME</label>
                       <input 
                        type="text"
                        value={regForm.collegeName}
                        onChange={(e) => setRegForm({...regForm, collegeName: e.target.value})}
                        className="w-full bg-white/5 border-2 border-[#D4AF37]/20 p-6 text-[#FDF5E6] font-black uppercase tracking-tighter focus:border-[#D4AF37] transition-all outline-hidden font-heading"
                        placeholder="ENTER YOUR COLLEGE NAME"
                      />
                    </div>
                  )}
                </div>
              )}

              {regStep === 2 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="p-4 bg-[#D4AF37] text-[#1A0505]">
                      <Key className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black uppercase text-[#FDF5E6] font-heading">HERITAGE SEAL</h2>
                      <p className="text-[#D4AF37]/60 text-xs font-black uppercase tracking-widest font-heading">STEP 03 // SECURITY OVERRIDE</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="p-6 bg-[#D4AF37]/5 border-l-4 border-[#D4AF37]">
                      <p className="text-[#FDF5E6]/40 text-xs font-black uppercase leading-relaxed tracking-wider font-heading">
                        <span className="text-[#D4AF37]">GENUINE REASON:</span> WE REQUIRE THIS PASSWORD TO ENSURE YOU CAN RECOVER YOUR DIGITAL HERITAGE PASS SECURELY IN CASE OF SESSION LOSS OR DEVICE MIGRATION AT THE VENUE.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] font-heading">RECOVERY PASSWORD</label>
                      <input 
                        type="password"
                        value={regForm.password}
                        onChange={(e) => setRegForm({...regForm, password: e.target.value})}
                        className="w-full bg-white/5 border-2 border-[#D4AF37]/20 p-6 text-[#FDF5E6] font-black uppercase tracking-tighter focus:border-[#D4AF37] transition-all outline-hidden font-heading"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
              )}

              {regStep === 3 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="p-4 bg-green-500 text-[#1A0505]">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black uppercase text-[#FDF5E6] font-heading">VALIDATION READY</h2>
                      <p className="text-green-500/60 text-xs font-black uppercase tracking-widest font-heading">STEP 04 // FINAL SEALING</p>
                    </div>
                  </div>
                  <div className="p-8 bg-white/5 border-2 border-white/10 space-y-4">
                    <p className="text-[#FDF5E6]/60 text-sm font-black uppercase tracking-widest font-heading underline">REVIEW YOUR LINEAGE:</p>
                    <ul className="space-y-2 text-[#FDF5E6] font-black uppercase tracking-tighter text-lg font-heading">
                      <li>NAME: {regForm.displayName}</li>
                      <li>ORIGIN: {isBitMesra ? `BIT MESRA (${regForm.rollNo})` : regForm.collegeName}</li>
                      <li className="text-green-500">SECURITY: ACTIVATED</li>
                    </ul>
                  </div>
                  <p className="text-[#FDF5E6]/30 text-[10px] uppercase tracking-widest leading-relaxed font-heading">
                    By clicking finalize, you witness that the above data is authentic. Falsified lineage may result in forfeiture of your Artisan Pass.
                  </p>
                </div>
              )}

              <div className="mt-16 flex gap-6">
                {regStep > 0 && (
                  <button 
                    onClick={() => setRegStep(regStep - 1)}
                    className="flex-1 py-6 bg-white/5 border-2 border-white/10 text-[#FDF5E6] font-black uppercase tracking-widest hover:bg-white/10 transition-all font-heading"
                  >
                    PREVIOUS
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (regStep < 3) setRegStep(regStep + 1);
                    else handleFinishRegistration();
                  }}
                  className="flex-[2] py-6 bg-[#D4AF37] text-[#1A0505] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all font-heading"
                >
                  {regStep < 3 ? "CONTINUE" : "FINALIZE & GENERATE PASS"}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* The Pass Container - 3D Tilt Effect */
          <>
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
                              {dbUser?.idCardImageUrl || user.profileImageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={dbUser?.idCardImageUrl || user.profileImageUrl || ""} alt="Member" className="w-full h-full object-cover transition-all duration-700" />
                                ) : (
                                    <div className="w-full h-full bg-secondary flex items-center justify-center text-7xl font-black italic text-[#D4AF37] font-heading">
                                        {(dbUser?.displayName || user.displayName || user.primaryEmail || "?")[0]?.toUpperCase()}
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
                                {dbUser?.displayName || user.displayName || "GUEST ARTISAN"}
                            </h2>
                            <div className="flex flex-col gap-1 border-l-4 border-[#D4AF37] pl-4 md:pl-6 py-2">
                              <span className="text-[8px] md:text-[10px] font-black italic text-[#FDF5E6]/30 uppercase tracking-[0.3em] font-heading">ORIGIN // {isBitMesra ? "BIT MESRA" : dbUser?.collegeName}</span>
                              <span className="text-xl font-black italic text-[#FDF5E6] uppercase tracking-tighter break-all">
                                    {dbUser?.rollNo || user.primaryEmail}
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
                    "p-2 relative shadow-[20px_20px_0px_rgba(223,255,0,0.1)] group transition-all duration-700 bg-white hover:shadow-[20px_20px_0px_#D4AF37]"
                )}
                >
                    <div className="absolute inset-x-0 -top-6 flex justify-center">
                        <div className={cn(
                            "px-6 py-2 border-2 font-black italic uppercase tracking-widest text-[10px] font-heading bg-[#1A0505] text-[#D4AF37] border-[#D4AF37]"
                        )}>
                          HERITAGE VALIDATION
                        </div>
                    </div>
                    
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
              </motion.div>

              <div className="grid grid-cols-1 gap-4 print:hidden">
                    <button 
                      onClick={() => window.print()}
                      className={cn(
                          "w-full py-8 text-lg font-black italic uppercase tracking-widest flex items-center justify-center gap-6 transition-all active:scale-[0.98] font-heading bg-[#D4AF37]/5 border-2 border-[#D4AF37]/20 text-[#FDF5E6] hover:bg-[#D4AF37] hover:text-[#1A0505] hover:border-transparent" 
                      )}
                    >
                        <Printer className="w-6 h-6" />
                        GET PHYSICAL INVITE
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
          </>
        )}
      </div>

      {/* Teams Section */}
      {hasUserTicket && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 mb-32 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-[#D4AF37]" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-[#D4AF37]/60 font-heading">SQUADRON HUB</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black italic text-[#FDF5E6] uppercase tracking-tighter font-heading">YOUR <span className="text-[#D4AF37]">TEAMS.</span></h2>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button 
                onClick={() => setShowJoinModal(true)}
                className="flex-1 md:flex-none px-8 py-4 bg-white/5 border-2 border-white/10 text-[#FDF5E6] font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all font-heading"
              >
                JOIN TEAM
              </button>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex-1 md:flex-none px-8 py-4 bg-[#D4AF37] text-[#1A0505] font-black uppercase tracking-widest text-xs hover:scale-105 transition-all font-heading"
              >
                CREATE TEAM
              </button>
            </div>
          </div>

          {userTeams.length === 0 ? (
            <div className="p-20 border-2 border-dashed border-[#D4AF37]/20 flex flex-col items-center text-center space-y-6">
              <div className="p-8 bg-[#D4AF37]/5 rounded-full">
                <Users className="w-16 h-16 text-[#D4AF37]/20" />
              </div>
              <p className="text-[#FDF5E6]/40 font-black uppercase tracking-widest text-sm font-heading max-w-md">
                No active allegiances detected. Form a squadron or enter a recruitment code to begin your competitive heritage.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {userTeams.map((team) => {
                const event = events.find(e => e.id === team.eventId);
                return (
                  <motion.div 
                    key={team.id}
                    whileHover={{ y: -10 }}
                    className="bg-[#D4AF37]/5 border-2 border-[#D4AF37]/20 p-8 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Users className="w-12 h-12" />
                    </div>
                    <div className="space-y-6 relative z-10">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-1 font-heading">TEAM NAME</p>
                        <h3 className="text-2xl font-black italic text-[#FDF5E6] uppercase tracking-tighter font-heading truncate">{team.name}</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white/5 border border-white/10">
                          <p className="text-[8px] font-black uppercase tracking-widest text-[#FDF5E6]/30 mb-1 font-heading">TEAM CODE</p>
                          <p className="text-lg font-black italic text-[#D4AF37] font-heading">{team.code}</p>
                        </div>
                        <div className="p-3 bg-white/5 border border-white/10">
                          <p className="text-[8px] font-black uppercase tracking-widest text-[#FDF5E6]/30 mb-1 font-heading">ROLE</p>
                          <p className="text-lg font-black italic text-[#FDF5E6] font-heading">{team.leaderId === user.id ? "LEADER" : "MEMBER"}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/5">
                        <p className="text-[8px] font-black uppercase tracking-widest text-[#FDF5E6]/30 mb-2 font-heading">PARTICIPATING IN</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black italic text-[#FDF5E6] uppercase font-heading">{event?.name || team.eventId}</span>
                          <ExternalLink className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 bg-[#1A0505]/95 backdrop-blur-xl"
            onClick={() => setShowCreateModal(false)}
          />
          <motion.div 
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
            className="bg-[#1A0505] border-2 border-[#D4AF37] p-8 md:p-12 w-full max-w-lg relative z-10 shadow-[0_0_100px_rgba(212,175,55,0.1)]"
          >
            <h3 className="text-4xl font-black italic text-[#FDF5E6] uppercase tracking-tighter mb-8 font-heading">MINT NEW <span className="text-[#D4AF37]">SQUAD.</span></h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] font-heading">TEAM MONIKER</label>
                <input 
                  type="text"
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({...teamForm, name: e.target.value.toUpperCase()})}
                  className="w-full bg-white/5 border-2 border-[#D4AF37]/20 p-4 text-[#FDF5E6] font-black uppercase tracking-tighter focus:border-[#D4AF37] outline-hidden font-heading"
                  placeholder="CHOOSE A LEGENDARY NAME"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] font-heading">SELECT EVENT</label>
                <select 
                  value={teamForm.eventId}
                  onChange={(e) => setTeamForm({...teamForm, eventId: e.target.value})}
                  className="w-full bg-white/5 border-2 border-[#D4AF37]/20 p-4 text-[#FDF5E6] font-black uppercase tracking-tighter focus:border-[#D4AF37] outline-hidden font-heading appearance-none"
                >
                  <option value="">CHOOSE EVENT</option>
                  {events.map(e => (
                    <option key={e.id} value={e.id} className="bg-[#1A0505]">{e.name.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={handleCreateTeam}
                className="w-full py-6 bg-[#D4AF37] text-[#1A0505] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all mt-4 font-heading"
              >
                LEGITIMIZE TEAM
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Join Team Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 bg-[#1A0505]/95 backdrop-blur-xl"
            onClick={() => setShowJoinModal(false)}
          />
          <motion.div 
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
            className="bg-[#1A0505] border-2 border-[#D4AF37] p-8 md:p-12 w-full max-w-lg relative z-10 shadow-[0_0_100px_rgba(212,175,55,0.1)]"
          >
            <h3 className="text-4xl font-black italic text-[#FDF5E6] uppercase tracking-tighter mb-8 font-heading">RECRUITMENT <span className="text-[#D4AF37]">PORTAL.</span></h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] font-heading">SQUADRON CODE</label>
                <input 
                  type="text"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="w-full bg-white/5 border-2 border-[#D4AF37]/20 p-4 text-[#FDF5E6] font-black uppercase tracking-tighter text-center text-4xl focus:border-[#D4AF37] outline-hidden font-heading"
                  placeholder="X1Y2Z3"
                />
              </div>
              <button 
                onClick={handleJoinTeam}
                className="w-full py-6 bg-[#D4AF37] text-[#1A0505] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all mt-4 font-heading"
              >
                JOIN ALLEGANCE
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Status Toasts */}
      {statusMessage.text && (
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className={cn(
            "fixed bottom-10 right-10 p-6 border-2 font-black uppercase tracking-widest text-sm z-200 font-heading",
            statusMessage.type === "success" ? "bg-green-600/10 border-green-600 text-green-600" : "bg-red-600/10 border-red-600 text-red-600"
          )}
          onClick={() => setStatusMessage({ text: "", type: "info" })}
        >
          {statusMessage.text}
        </motion.div>
      )}

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
