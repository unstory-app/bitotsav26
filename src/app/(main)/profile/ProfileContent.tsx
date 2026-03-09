"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Ticket,
  Users,
  AlertTriangle,
  LogOut,
  Trash2,
  UserMinus,
  Info,
  Trophy,
  Zap,
  MessageCircle
} from "lucide-react";
import { useUser, useStackApp } from "@stackframe/stack";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { syncUser, hasTicket } from "@/app/actions/user";
import { getUserTeams, createTeam, joinTeam, leaveTeam, dismissTeam, getTeamDetails } from "@/app/actions/team";
import { cn } from "@/lib/utils";
import { Team } from "@/db/schema";
import { events } from "@/lib/data/events";
import { SITE_CONFIG } from "@/config/site";

export default function ProfileContent() {
  const user = useUser({ or: "redirect" });
  const stack = useStackApp();
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [synced, setSynced] = useState(false);
  const [hasUserTicket, setHasUserTicket] = useState(false);
  const [userTeams, setUserTeams] = useState<(Team & { events: string[] })[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedTeamDetails, setSelectedTeamDetails] = useState<{ 
    id: string, 
    members: { id: string, displayName: string | null, email: string, profileImageUrl: string | null }[] 
  } | null>(null);
  const [teamForm, setTeamForm] = useState({ name: "", eventId: "" });
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "info" });

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

        // Check for ticket
        const ticketExists = await hasTicket(user.id);
        setHasUserTicket(ticketExists);

        // Fetch user teams
        const teamsData = await getUserTeams(user.id);
        setUserTeams(teamsData as (Team & { events: string[] })[]);

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

  const handleLeaveTeam = async (teamId: string) => {
    if (!confirm("Are you sure you want to leave this squadron?")) return;
    setLoading(true);
    const result = await leaveTeam(teamId, user.id);
    if (result.success) {
      setStatusMessage({ text: "You have left the squadron.", type: "success" });
      const updated = await getUserTeams(user.id);
      setUserTeams(updated);
    } else {
      setStatusMessage({ text: result.message || "Failed to leave team.", type: "error" });
    }
    setLoading(false);
  };

  const handleDismissTeam = async (teamId: string) => {
    if (!confirm("CRITICAL: This will PERMANENTLY DELETE the squadron and all event registrations. Proceed?")) return;
    setLoading(true);
    const result = await dismissTeam(teamId, user.id);
    if (result.success) {
      setStatusMessage({ text: "Squadron has been dismissed.", type: "success" });
      const updated = await getUserTeams(user.id);
      setUserTeams(updated);
    } else {
      setStatusMessage({ text: result.message || "Failed to dismiss team.", type: "error" });
    }
    setLoading(false);
  };

  const handleShowIntel = async (teamId: string) => {
    if (selectedTeamDetails?.id === teamId) {
      setSelectedTeamDetails(null);
      return;
    }
    setLoading(true);
    const details = await getTeamDetails(teamId);
    if (details) {
      setSelectedTeamDetails({ id: teamId, members: details.members });
    }
    setLoading(false);
  };

  const handleCheckEligibility = () => {
    if (isBitMesra) {
      window.location.href = "/tickets";
    } else {
      setStatusMessage({ 
        text: "Direct ticket generation is currently restricted to BIT Mesra students. External participants can join teams and participate in events.", 
        type: "info" 
      });
    }
  };

  if (loading) {
    return (
      <PageWrapper className="pt-32 pb-20 bg-[#1A0505] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 pb-16 border-b border-white/5">
            <div className="flex items-center gap-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="space-y-3">
                <Skeleton className="w-48 h-8" />
                <Skeleton className="w-32 h-4" />
              </div>
            </div>
            <Skeleton className="w-40 h-12" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <Skeleton className="lg:col-span-2 h-[400px] rounded-3xl" />
            <div className="space-y-6">
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
            </div>
          </div>
        </div>
      </PageWrapper>
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
          <div className="border-l-8 md:border-l-12 border-[#D4AF37] pl-6 md:pl-10 py-4 md:py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <h1 className="text-5xl md:text-9xl font-black italic text-[#FDF5E6] uppercase leading-none tracking-tighter mb-4 font-heading">
                    ARTISAN <span className="text-[#D4AF37]">PASS.</span>
                </h1>
                <p className="text-sm md:text-xl text-[#FDF5E6]/40 font-black italic uppercase tracking-[0.2em] md:tracking-[0.3em] font-heading">
                    LEGACY ENTRANCE // THE 35TH EDITION
                </p>
              </div>

              <button 
                onClick={() => stack.signOut()}
                className="px-8 py-4 bg-red-600/10 border-2 border-red-600 text-red-600 font-black italic uppercase tracking-widest text-xs hover:bg-red-600 hover:text-white transition-all flex items-center gap-3 font-heading"
              >
                <LogOut className="w-4 h-4" />
                LEGACY DISCONNECT
              </button>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-20 md:mb-32 relative z-10 flex flex-col lg:flex-row gap-10 md:gap-16 items-start">
        
        {hasUserTicket ? (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto bg-[#D4AF37]/5 border-2 border-[#D4AF37]/20 p-8 md:p-16 relative overflow-hidden mb-12 stamp-edge"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <ShieldCheck className="w-64 h-64 text-[#D4AF37]" />
            </div>

            <div className="relative z-10 text-center md:text-left space-y-8">
              <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                <div className="p-4 bg-[#D4AF37] text-[#1A0505]">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase text-[#FDF5E6] font-heading">HERITAGE PASS ACTIVE</h2>
                  <p className="text-[#D4AF37]/60 text-xs font-black uppercase tracking-widest font-heading">IDENTITY // VERIFIED</p>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-[#FDF5E6]/60 text-lg font-black uppercase tracking-tighter max-w-2xl font-heading">
                  Your <span className="text-[#D4AF37]">DIGITAL SIGIL</span> is minted and ready. Present it at the festival gates for seamless authorization.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => window.location.href = "/tickets"}
                    className="flex-1 px-12 py-6 bg-[#D4AF37] text-[#1A0505] font-black uppercase tracking-widest hover:scale-[1.05] transition-all font-heading shadow-[10px_10px_0px_rgba(212,175,55,0.2)] flex items-center justify-center gap-3"
                  >
                    <Ticket className="w-5 h-5" />
                    VIEW DIGITAL PASS
                  </button>
                  <button 
                    onClick={() => window.location.href = "/events"}
                    className="flex-1 px-12 py-6 bg-white/5 border-2 border-[#D4AF37]/20 text-[#D4AF37] font-black uppercase tracking-widest hover:bg-[#D4AF37]/10 transition-all font-heading flex items-center justify-center gap-3"
                  >
                    <Zap className="w-5 h-5" />
                    JOIN EVENTS
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto bg-[#D4AF37]/5 border-2 border-[#D4AF37]/20 p-8 md:p-16 relative overflow-hidden mb-12"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <ShieldCheck className="w-64 h-64 text-[#D4AF37]" />
            </div>

            <div className="relative z-10 text-center md:text-left space-y-8">
              <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                <div className="p-4 bg-[#D4AF37] text-[#1A0505]">
                  <Ticket className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase text-[#FDF5E6] font-heading">DIGITAL HERITAGE PASS</h2>
                  <p className="text-[#D4AF37]/60 text-xs font-black uppercase tracking-widest font-heading">STATUS: UNAUTHORIZED</p>
                </div>
              </div>

              {isBitMesra ? (
                <div className="space-y-6">
                  <p className="text-[#FDF5E6]/60 text-lg font-black uppercase tracking-tighter max-w-2xl font-heading">
                    Detecting <span className="text-[#D4AF37]">@BITMESRA.AC.IN</span> affiliation. You are eligible to generate your complimentary digital access pass.
                  </p>
                  <button 
                    onClick={handleCheckEligibility}
                    className="px-12 py-6 bg-[#D4AF37] text-[#1A0505] font-black uppercase tracking-widest hover:scale-[1.05] transition-all font-heading"
                  >
                    GENERATE PASS NOW
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-[#FDF5E6]/60 text-lg font-black uppercase tracking-tighter max-w-2xl font-heading">
                    Welcome, <span className="text-[#D4AF37]">ARTISAN</span>. You can join teams and participate in events. Full festival access passes for external participants may be released soon.*
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => window.location.href = "/events"}
                      className="px-12 py-6 bg-white/5 border-2 border-[#D4AF37]/20 text-[#D4AF37] font-black uppercase tracking-widest hover:bg-[#D4AF37]/10 transition-all font-heading flex items-center justify-center gap-3"
                    >
                      <Zap className="w-5 h-5" />
                      JOIN EVENTS WITH TEAMS
                    </button>
                  </div>
                  <div className="p-6 bg-white/5 border-l-4 border-[#D4AF37]">
                    <p className="text-[#FDF5E6]/40 text-xs font-black uppercase leading-relaxed tracking-wider font-heading">
                      Register your team below to start your Bitotsav journey.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
  {/* Teams Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-32 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-[#D4AF37]" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-[#D4AF37]/60 font-heading">SQUADRON HUB</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black italic text-[#FDF5E6] uppercase tracking-tighter font-heading">YOUR <span className="text-[#D4AF37]">TEAMS.</span></h2>
            </div>
            {userTeams.length === 0 && (
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
            )}
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
                        <div className="p-3 bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                          <p className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37] mb-1 font-heading">BITPOINTS</p>
                          <div className="flex items-center gap-2">
                             <Trophy className="w-3 h-3 text-[#D4AF37]" />
                             <p className="text-xl font-black italic text-[#FDF5E6] font-heading">{team.points || 0}</p>
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/5 space-y-4">
                        <p className="text-[8px] font-black uppercase tracking-widest text-[#FDF5E6]/30 mb-2 font-heading">PARTICIPATING IN</p>
                        <div className="flex flex-wrap gap-2">
                          {team.events?.map(evId => {
                             const ev = events.find(e => e.id === evId);
                             return (
                               <span key={evId} className="px-2 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-[9px] font-black uppercase tracking-tighter border border-[#D4AF37]/20">
                                 {ev?.name || evId}
                               </span>
                             );
                          })}
                          {(!team.events || team.events.length === 0) && (
                            <span className="text-xs font-black italic text-[#FDF5E6]/30 uppercase font-heading">NO EVENTS REG</span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-4">
                          <button 
                            onClick={() => handleShowIntel(team.id)}
                            className="px-4 py-2 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-[#FDF5E6] hover:bg-white/10 transition-all flex items-center justify-center gap-2 font-heading"
                          >
                            <Info className="w-3 h-3 text-[#D4AF37]" />
                            INTEL
                          </button>
                          {team.leaderId === user.id ? (
                            <button 
                              onClick={() => handleDismissTeam(team.id)}
                              className="px-4 py-2 bg-red-600/10 border border-red-600/20 text-[9px] font-black uppercase tracking-widest text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 font-heading"
                            >
                              <Trash2 className="w-3 h-3" />
                              DISMISS
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleLeaveTeam(team.id)}
                              className="px-4 py-2 bg-red-600/10 border border-red-600/20 text-[9px] font-black uppercase tracking-widest text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 font-heading"
                            >
                              <UserMinus className="w-3 h-3" />
                              LEAVE
                            </button>
                          )}
                        </div>

                        {selectedTeamDetails?.id === team.id && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="p-4 bg-white/5 border border-white/10 space-y-3"
                          >
                            <p className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37] font-heading">SQUADRON ROSTER</p>
                            {selectedTeamDetails.members.map(m => (
                              <div key={m.id} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
                                <span className="text-[10px] font-black uppercase text-[#FDF5E6] font-heading">{m.displayName || "Anonymous"}</span>
                                <span className="text-[8px] font-black uppercase text-[#FDF5E6]/20 font-heading">{m.id === team.leaderId ? "COMMANDER" : "OPERATIVE"}</span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      {/* WhatsApp Community Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-20 md:mb-32 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-6 h-6 text-[#D4AF37]" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-[#D4AF37]/60 font-heading">STAY CONNECTED</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black italic text-[#FDF5E6] uppercase tracking-tighter font-heading">WHATSAPP <span className="text-[#D4AF37]">HUB.</span></h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Community Link Card */}
          <motion.a
            href={SITE_CONFIG.whatsapp.community}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-[#D4AF37]/5 border-2 border-[#D4AF37]/20 p-8 md:p-10 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <MessageCircle className="w-32 h-32 text-[#D4AF37]" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-[#25D366] text-white rounded-full">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase text-[#FDF5E6] font-heading">COMMUNITY CHANNEL</h3>
                  <p className="text-[#D4AF37]/60 text-xs font-black uppercase tracking-widest font-heading">OFFICIAL UPDATES</p>
                </div>
              </div>

              <p className="text-[#FDF5E6]/60 text-lg font-black uppercase tracking-tighter font-heading">
                Join the official Bitotsav community for <span className="text-[#D4AF37]">REAL-TIME UPDATES</span>, announcements, and festival news.
              </p>

              <div className="flex items-center gap-2 text-[#25D366] font-black uppercase tracking-widest text-sm font-heading">
                <span>JOIN NOW</span>
                <MessageCircle className="w-4 h-4" />
              </div>
            </div>
          </motion.a>

          {/* Helpdesk Link Card */}
          <motion.a
            href={SITE_CONFIG.whatsapp.helpdesk}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-[#D4AF37]/5 border-2 border-[#D4AF37]/20 p-8 md:p-10 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldCheck className="w-32 h-32 text-[#D4AF37]" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-[#128C7E] text-white rounded-full">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase text-[#FDF5E6] font-heading">VIRTUAL HELPDESK</h3>
                  <p className="text-[#D4AF37]/60 text-xs font-black uppercase tracking-widest font-heading">SUPPORT & ASSISTANCE</p>
                </div>
              </div>

              <p className="text-[#FDF5E6]/60 text-lg font-black uppercase tracking-tighter font-heading">
                Get instant <span className="text-[#D4AF37]">SUPPORT & GUIDANCE</span> from our team. Ask questions, resolve queries.
              </p>

              <div className="flex items-center gap-2 text-[#128C7E] font-black uppercase tracking-widest text-sm font-heading">
                <span>GET HELP</span>
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
          </motion.a>
        </div>
      </div>

    

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
