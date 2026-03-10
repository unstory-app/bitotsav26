"use client";

import { useEffect, useState } from "react";
import NextImage from "next/image";
import {
  AlertTriangle,
  ArrowRight,
  Crown,
  Loader2,
  LogOut,
  MessageCircle,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Ticket,
  Trophy,
  UserMinus,
  Users,
} from "lucide-react";
import { useStackApp, useUser } from "@stackframe/stack";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { getUser, hasTicket, syncUser, updateUserPhoneNumber } from "@/app/actions/user";
import { addTeamEvent, createTeam, dismissTeam, getTeamDetails, getUserTeams, joinTeam, kickTeamMember, leaveTeam } from "@/app/actions/team";
import { cn } from "@/lib/utils";
import { Team } from "@/db/schema";
import { events } from "@/lib/data/events";
import { SITE_CONFIG } from "@/config/site";

type TeamSummary = Team & {
  events: string[];
  memberCount: number;
  rank: number | null;
};

type TeamMember = {
  id: string;
  displayName: string | null;
  email: string;
  profileImageUrl: string | null;
  idCardImageUrl: string | null;
  phoneNumber: string | null;
  rollNo: string | null;
  isBitMesra: boolean;
  joinedAt: Date | string;
};

type StatusTone = "info" | "success" | "error";

function hasValidPhoneNumber(value: string | null | undefined) {
  if (!value) {
    return false;
  }

  const digits = value.replace(/\D/g, "");
  return digits.length === 10 || (digits.length === 12 && digits.startsWith("91"));
}

function getInitials(value: string | null | undefined) {
  const source = value?.trim();
  if (!source) {
    return "BT";
  }

  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((token) => token[0]?.toUpperCase() ?? "")
    .join("") || "BT";
}

function mapServerMessage(message?: string) {
  switch (message) {
    case "ADD_PHONE_NUMBER_BEFORE_TEAM_CREATION":
      return "Add a valid phone number before creating a team.";
    case "INVALID_PHONE_NUMBER":
      return "Enter a valid 10-digit phone number.";
    case "TEAM_FULL":
      return "This team already has 8 members.";
    case "EVENT_ALREADY_ADDED":
      return "This team is already participating in that event.";
    case "ONLY_TEAM_LEADER_CAN_ADD_EVENTS":
      return "Only the team leader can add more events.";
    case "ONLY_TEAM_LEADER_CAN_KICK_MEMBERS":
      return "Only the team leader can remove members.";
    case "CANNOT_REMOVE_LEADER":
      return "The leader cannot be removed from the team.";
    default:
      return message || "Something went wrong.";
  }
}

export default function ProfileContent() {
  const user = useUser({ or: "redirect" });
  const stack = useStackApp();

  const [loading, setLoading] = useState(true);
  const [actionPending, setActionPending] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [hasUserTicket, setHasUserTicket] = useState(false);
  const [dbUser, setDbUser] = useState<any>(null);
  const [userTeams, setUserTeams] = useState<TeamSummary[]>([]);
  const [teamDetailsById, setTeamDetailsById] = useState<Record<string, TeamMember[]>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [continueToCreateAfterPhone, setContinueToCreateAfterPhone] = useState(false);
  const [teamForm, setTeamForm] = useState({ name: "", eventId: "" });
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [teamEventSelection, setTeamEventSelection] = useState<Record<string, string>>({});
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: StatusTone }>({ text: "", type: "info" });

  const isBitMesra = user.primaryEmail?.toLowerCase().endsWith("@bitmesra.ac.in");
  const hasPhoneNumber = hasValidPhoneNumber(dbUser?.phoneNumber);

  async function refreshDashboardData(userId: string) {
    const [ticketExists, existingDbUser, teamsData] = await Promise.all([
      hasTicket(userId),
      getUser(userId),
      getUserTeams(userId),
    ]);

    const typedTeams = teamsData as TeamSummary[];

    setHasUserTicket(ticketExists);
    setDbUser(existingDbUser);
    setUserTeams(typedTeams);
    setPhoneInput(existingDbUser?.phoneNumber || "");
    setTeamEventSelection((current) => {
      const next = { ...current };

      for (const team of typedTeams) {
        if (!(team.id in next)) {
          next[team.id] = "";
        }
      }

      return next;
    });

    if (!typedTeams.length) {
      setTeamDetailsById({});
      return;
    }

    const detailsEntries = await Promise.all(
      typedTeams.map(async (team) => {
        const details = await getTeamDetails(team.id);
        return [team.id, (details?.members ?? []) as TeamMember[]] as const;
      })
    );

    setTeamDetailsById(Object.fromEntries(detailsEntries));
  }

  useEffect(() => {
    let active = true;

    async function initialize() {
      if (!user) {
        return;
      }

      setLoading(true);
      setSyncError(null);

      const syncResult = await syncUser({
        id: user.id,
        email: user.primaryEmail || "",
        displayName: user.displayName,
        profileImageUrl: user.profileImageUrl,
      });

      if (!active) {
        return;
      }

      if (!syncResult.success) {
        setSyncError(syncResult.message);
      }

      await refreshDashboardData(user.id);

      if (active) {
        setLoading(false);
      }
    }

    void initialize();

    return () => {
      active = false;
    };
  }, [user]);

  const handleCheckEligibility = () => {
    if (isBitMesra) {
      window.location.href = "/tickets";
      return;
    }

    setStatusMessage({
      text: "Direct ticket generation is currently restricted to BIT Mesra students. External participants can still join teams and events.",
      type: "info",
    });
  };

  const openCreateFlow = () => {
    if (!hasPhoneNumber) {
      setContinueToCreateAfterPhone(true);
      setShowPhoneModal(true);
      setStatusMessage({ text: "Add your phone number before creating a team.", type: "info" });
      return;
    }

    setShowCreateModal(true);
  };

  const handleSavePhoneNumber = async () => {
    setActionPending(true);

    const result = await updateUserPhoneNumber(user.id, phoneInput);

    if (result.success) {
      await refreshDashboardData(user.id);
      setShowPhoneModal(false);
      setStatusMessage({ text: "Phone number saved successfully.", type: "success" });

      if (continueToCreateAfterPhone) {
        setContinueToCreateAfterPhone(false);
        setShowCreateModal(true);
      }
    } else {
      setStatusMessage({ text: mapServerMessage(result.message), type: "error" });
    }

    setActionPending(false);
  };

  const handleCreateTeam = async () => {
    if (!teamForm.name || !teamForm.eventId) {
      setStatusMessage({ text: "Provide a team name and select an event.", type: "error" });
      return;
    }

    if (!hasPhoneNumber) {
      setShowCreateModal(false);
      setContinueToCreateAfterPhone(true);
      setShowPhoneModal(true);
      setStatusMessage({ text: "Add your phone number before creating a team.", type: "info" });
      return;
    }

    setActionPending(true);
    const result = await createTeam(teamForm.name.trim(), teamForm.eventId, user.id);

    if (result.success) {
      await refreshDashboardData(user.id);
      setTeamForm({ name: "", eventId: "" });
      setShowCreateModal(false);
      setStatusMessage({ text: `Team created successfully. Code: ${result.code}`, type: "success" });
    } else {
      if (result.message === "ADD_PHONE_NUMBER_BEFORE_TEAM_CREATION") {
        setShowCreateModal(false);
        setContinueToCreateAfterPhone(true);
        setShowPhoneModal(true);
      }

      setStatusMessage({ text: mapServerMessage(result.message), type: "error" });
    }

    setActionPending(false);
  };

  const handleJoinTeam = async () => {
    if (!joinCodeInput.trim()) {
      setStatusMessage({ text: "Enter a valid team code.", type: "error" });
      return;
    }

    setActionPending(true);
    const result = await joinTeam(joinCodeInput.trim().toUpperCase(), user.id);

    if (result.success) {
      await refreshDashboardData(user.id);
      setJoinCodeInput("");
      setShowJoinModal(false);
      setStatusMessage({ text: "You joined the team successfully.", type: "success" });
    } else {
      setStatusMessage({ text: mapServerMessage(result.message), type: "error" });
    }

    setActionPending(false);
  };

  const handleLeaveTeam = async (teamId: string) => {
    if (!confirm("Leave this team?")) {
      return;
    }

    setActionPending(true);
    const result = await leaveTeam(teamId, user.id);

    if (result.success) {
      await refreshDashboardData(user.id);
      setStatusMessage({ text: "You have left the team.", type: "success" });
    } else {
      setStatusMessage({ text: mapServerMessage(result.message), type: "error" });
    }

    setActionPending(false);
  };

  const handleDismissTeam = async (teamId: string) => {
    if (!confirm("This will permanently delete the team and all linked registrations. Continue?")) {
      return;
    }

    setActionPending(true);
    const result = await dismissTeam(teamId, user.id);

    if (result.success) {
      await refreshDashboardData(user.id);
      setStatusMessage({ text: "Team dismissed successfully.", type: "success" });
    } else {
      setStatusMessage({ text: mapServerMessage(result.message), type: "error" });
    }

    setActionPending(false);
  };

  const handleAddTeamEvent = async (teamId: string) => {
    const eventId = teamEventSelection[teamId];

    if (!eventId) {
      setStatusMessage({ text: "Select an event first.", type: "error" });
      return;
    }

    setActionPending(true);
    const result = await addTeamEvent(teamId, eventId, user.id);

    if (result.success) {
      await refreshDashboardData(user.id);
      setTeamEventSelection((current) => ({ ...current, [teamId]: "" }));
      setStatusMessage({ text: "Team event added successfully.", type: "success" });
    } else {
      setStatusMessage({ text: mapServerMessage(result.message), type: "error" });
    }

    setActionPending(false);
  };

  const handleKickMember = async (teamId: string, memberId: string, memberName: string | null) => {
    if (!confirm(`Remove ${memberName || "this member"} from the team?`)) {
      return;
    }

    setActionPending(true);
    const result = await kickTeamMember(teamId, user.id, memberId);

    if (result.success) {
      await refreshDashboardData(user.id);
      setStatusMessage({ text: `${memberName || "Member"} was removed from the team.`, type: "success" });
    } else {
      setStatusMessage({ text: mapServerMessage(result.message), type: "error" });
    }

    setActionPending(false);
  };

  if (loading) {
    return (
      <PageWrapper className="min-h-screen bg-[#120606] px-4 pb-16 pt-28 md:px-6 md:pt-32">
        <div className="mx-auto max-w-7xl space-y-8">
          <Skeleton className="h-48 rounded-[32px]" />
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <Skeleton className="h-[420px] rounded-[32px]" />
            <div className="space-y-6">
              <Skeleton className="h-48 rounded-[32px]" />
              <Skeleton className="h-48 rounded-[32px]" />
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="min-h-screen bg-[#120606] pb-16 pt-28 md:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        {syncError && (
          <div className="mb-6 flex items-start gap-4 rounded-[28px] border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em]">Profile Sync Delayed</p>
              <p className="mt-1 text-sm text-red-200/70">{syncError}</p>
            </div>
          </div>
        )}

        <section className="overflow-hidden rounded-[40px] border border-[#D4AF37]/15 bg-linear-to-br from-white/[0.08] via-white/[0.04] to-transparent p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl md:p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-[#D4AF37]/10 to-transparent" />
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
            <div className="space-y-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-[30px] border border-[#D4AF37]/30 bg-[#D4AF37]/10 shadow-[0_14px_40px_rgba(212,175,55,0.18)]">
                    {dbUser?.profileImageUrl || user.profileImageUrl ? (
                      <NextImage
                        src={dbUser?.profileImageUrl || user.profileImageUrl || ""}
                        alt={dbUser?.displayName || user.displayName || "Profile"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xl font-black uppercase tracking-[0.2em] text-[#D4AF37]">
                        {getInitials(user.displayName || dbUser?.displayName)}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#D4AF37]">
                      <Sparkles className="h-3.5 w-3.5" />
                      Premium Identity Desk
                    </div>
                    <h1 className="mt-4 text-3xl font-black uppercase tracking-[0.04em] text-[#FDF5E6] md:text-5xl">
                      {dbUser?.displayName || user.displayName || "Bitotsav User"}
                    </h1>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-[#FDF5E6]/65">
                      Your Bitotsav identity hub for pass access, team command, rankings, and event participation.
                    </p>
                    <p className="mt-2 break-all text-sm text-[#FDF5E6]/50">{user.primaryEmail}</p>
                  </div>
                </div>

                <button
                  onClick={() => stack.signOut()}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.26em] text-[#FDF5E6]/75 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-200"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[28px] border border-white/10 bg-black/25 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]/60">Teams</p>
                  <p className="mt-3 text-3xl font-black uppercase text-[#FDF5E6]">{userTeams.length}</p>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-black/25 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]/60">Best Rank</p>
                  <p className="mt-3 text-3xl font-black uppercase text-[#FDF5E6]">
                    {userTeams.length
                      ? `#${Math.min(...userTeams.map((team) => team.rank ?? Number.POSITIVE_INFINITY).filter(Number.isFinite))}`
                      : "--"}
                  </p>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-black/25 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]/60">Team Cap</p>
                  <p className="mt-3 text-3xl font-black uppercase text-[#FDF5E6]">8</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]/60">Phone</p>
                  <p className="mt-3 text-lg font-semibold text-[#FDF5E6]">{dbUser?.phoneNumber || "Not added yet"}</p>
                  {!hasPhoneNumber && (
                    <button
                      onClick={() => {
                        setContinueToCreateAfterPhone(false);
                        setShowPhoneModal(true);
                      }}
                      className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]"
                    >
                      <Phone className="h-4 w-4" />
                      Add Phone Number
                    </button>
                  )}
                </div>

                <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]/60">Roll Number</p>
                  <p className="mt-3 text-lg font-semibold uppercase text-[#FDF5E6]">{dbUser?.rollNo || "Not submitted"}</p>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]/60">Affiliation</p>
                  <p className="mt-3 text-lg font-semibold text-[#FDF5E6]">{isBitMesra ? "BIT Mesra" : "External Participant"}</p>
                </div>
              </div>

              {!hasPhoneNumber && (
                <div className="rounded-[28px] border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">Action Required</p>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#FDF5E6]/70">
                    Add a valid phone number on this page before creating a team. This keeps team coordination and manual verification intact.
                  </p>
                </div>
              )}
            </div>

            <div className="grid gap-4">
              <div className="rounded-[30px] border border-white/10 bg-black/25 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]/60">Festival Pass</p>
                    <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.05em] text-[#FDF5E6]">
                      {hasUserTicket ? "Pass Active" : "Pass Pending"}
                    </h2>
                  </div>
                  <div
                    className={cn(
                      "rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em]",
                      hasUserTicket ? "bg-emerald-500/15 text-emerald-300" : "bg-white/10 text-[#FDF5E6]/65"
                    )}
                  >
                    {hasUserTicket ? "Ready" : "Not Minted"}
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-[#FDF5E6]/65">
                  {hasUserTicket
                    ? "Your digital pass is already issued. Open it directly or go explore events."
                    : isBitMesra
                      ? "You can mint your pass now using your BIT Mesra account."
                      : "External participants can continue through teams and event registrations."}
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={() => {
                      window.location.href = "/tickets";
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-5 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#1A0505] transition hover:bg-[#e3bc45]"
                  >
                    <Ticket className="h-4 w-4" />
                    {hasUserTicket ? "Open Pass" : "Generate Pass"}
                  </button>
                  {!isBitMesra && !hasUserTicket && (
                    <button
                      onClick={handleCheckEligibility}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#FDF5E6]/80 transition hover:border-[#D4AF37]/40 hover:text-[#FDF5E6]"
                    >
                      Learn Eligibility
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="rounded-[30px] border border-white/10 bg-black/25 p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]/60">Community</p>
                <div className="mt-5 space-y-3">
                  <a
                    href={SITE_CONFIG.whatsapp.community}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:border-[#25D366]/40 hover:bg-[#25D366]/10"
                  >
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FDF5E6]">Community Updates</p>
                      <p className="mt-1 text-xs text-[#FDF5E6]/55">Official notices and event news</p>
                    </div>
                    <MessageCircle className="h-5 w-5 text-[#25D366]" />
                  </a>
                  <a
                    href={SITE_CONFIG.whatsapp.helpdesk}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/10"
                  >
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FDF5E6]">Helpdesk</p>
                      <p className="mt-1 text-xs text-[#FDF5E6]/55">Reach the team for support</p>
                    </div>
                    <ShieldCheck className="h-5 w-5 text-[#D4AF37]" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[40px] border border-[#D4AF37]/15 bg-linear-to-br from-white/[0.08] via-white/[0.04] to-transparent p-6 shadow-[0_24px_80px_rgba(0,0,0,0.2)] backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]/70">Your Teams</p>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-[0.05em] text-[#FDF5E6] md:text-4xl">Team Control Center</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#FDF5E6]/60">
                Track your current team rank, roster, members, participation, and coordination details from one place.
              </p>
            </div>

            {userTeams.length === 0 ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setShowJoinModal(true)}
                  disabled={actionPending}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#FDF5E6]/75 transition hover:border-white/20 hover:text-[#FDF5E6] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Users className="h-4 w-4" />
                  Join Team
                </button>
                <button
                  onClick={openCreateFlow}
                  disabled={actionPending}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#1A0505] transition hover:bg-[#e3bc45] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  Create Team
                </button>
              </div>
            ) : (
              <div className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
                Already in a team
              </div>
            )}
          </div>

          {userTeams.length === 0 ? (
            <div className="mt-8 rounded-[30px] border border-dashed border-white/10 bg-black/20 px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-2xl font-black uppercase tracking-[0.08em] text-[#FDF5E6]">No Team Yet</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#FDF5E6]/60">
                Create a team or join one with an invite code. If you want to create a team, add your phone number first on this page.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-8">
              {userTeams.map((team) => {
                const members = teamDetailsById[team.id] || [];
                const availableEvents = events.filter((event) => !team.events.includes(event.id));
                const isLeader = team.leaderId === user.id;

                return (
                  <article key={team.id} className="overflow-hidden rounded-[32px] border border-white/10 bg-linear-to-br from-black/30 to-black/10">
                    <div className="grid gap-6 border-b border-white/10 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
                            Team Code {team.code}
                          </span>
                          {team.rank ? (
                            <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-300">
                              Current Rank #{team.rank}
                            </span>
                          ) : null}
                          {isLeader ? (
                            <span className="rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
                              Leader Access
                            </span>
                          ) : null}
                        </div>

                        <h3 className="mt-4 text-3xl font-black uppercase tracking-[0.05em] text-[#FDF5E6]">{team.name}</h3>
                        <p className="mt-3 text-sm leading-7 text-[#FDF5E6]/60">
                          Your current team standing is shown here along with live member details for coordination and verification.
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2">
                          {team.events.length ? (
                            team.events.map((eventId) => {
                              const event = events.find((entry) => entry.id === eventId);
                              return (
                                <span key={eventId} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#FDF5E6]/80">
                                  {event?.name || eventId}
                                </span>
                              );
                            })
                          ) : (
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#FDF5E6]/60">
                              No linked events
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]/60">Rank</p>
                          <p className="mt-3 text-2xl font-black uppercase text-[#FDF5E6]">{team.rank ? `#${team.rank}` : "--"}</p>
                        </div>
                        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]/60">Points</p>
                          <p className="mt-3 flex items-center gap-2 text-2xl font-black uppercase text-[#FDF5E6]"><Trophy className="h-5 w-5 text-[#D4AF37]" />{team.points}</p>
                        </div>
                        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]/60">Members</p>
                          <p className="mt-3 text-2xl font-black uppercase text-[#FDF5E6]">{team.memberCount}/8</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 border-b border-white/10 p-6 md:flex-row md:items-center md:justify-between lg:p-8">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]/70">Roster Table</p>
                        <p className="mt-2 text-sm text-[#FDF5E6]/60">All members are listed here with their phone number, profile image, email, roll number, and affiliation.</p>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        {isLeader && availableEvents.length > 0 ? (
                          <div className="flex flex-col gap-3 sm:flex-row">
                            <select
                              value={teamEventSelection[team.id] ?? ""}
                              onChange={(e) => setTeamEventSelection((current) => ({ ...current, [team.id]: e.target.value }))}
                              disabled={actionPending}
                              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#FDF5E6] outline-none transition focus:border-[#D4AF37]/50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="">Select event</option>
                              {availableEvents.map((event) => (
                                <option key={event.id} value={event.id} className="bg-[#120606] text-[#FDF5E6]">
                                  {event.name.toUpperCase()}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleAddTeamEvent(team.id)}
                              disabled={actionPending || !teamEventSelection[team.id]}
                              className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37] transition hover:bg-[#D4AF37]/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Add Event
                            </button>
                          </div>
                        ) : null}

                        {isLeader ? (
                          <button
                            onClick={() => handleDismissTeam(team.id)}
                            disabled={actionPending}
                            className="rounded-full border border-red-500/30 bg-red-500/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.26em] text-red-200 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Dismiss Team
                          </button>
                        ) : (
                          <button
                            onClick={() => handleLeaveTeam(team.id)}
                            disabled={actionPending}
                            className="rounded-full border border-red-500/30 bg-red-500/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.26em] text-red-200 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Leave Team
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="overflow-x-auto p-2 md:p-4">
                      <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-[24px]">
                        <thead>
                          <tr>
                            {["Member", "Role", "Phone", "Email", "Roll No", "Affiliation", "ID Proof", "Actions"].map((label) => (
                              <th
                                key={label}
                                className="border-b border-white/10 bg-white/[0.03] px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]/75"
                              >
                                {label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {members.length > 0 ? (
                            members.map((member) => {
                              const avatar = member.profileImageUrl || member.idCardImageUrl;
                              const memberIsLeader = member.id === team.leaderId;

                              return (
                                <tr key={member.id} className="align-top text-sm text-[#FDF5E6]/85">
                                  <td className="border-b border-white/10 px-4 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white/10 bg-white/5">
                                        {avatar ? (
                                          <NextImage src={avatar} alt={member.displayName || "Member"} fill className="object-cover" />
                                        ) : (
                                          <div className="flex h-full w-full items-center justify-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
                                            {getInitials(member.displayName)}
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <p className="font-semibold uppercase tracking-[0.08em] text-[#FDF5E6]">{member.displayName || "Unnamed member"}</p>
                                        <p className="mt-1 text-xs text-[#FDF5E6]/45">{member.id.slice(-8).toUpperCase()}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="border-b border-white/10 px-4 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#FDF5E6]/70">
                                    <span className="inline-flex items-center gap-2">
                                      {memberIsLeader ? <Crown className="h-3.5 w-3.5 text-[#D4AF37]" /> : null}
                                      {memberIsLeader ? "Leader" : "Member"}
                                    </span>
                                  </td>
                                  <td className="border-b border-white/10 px-4 py-4 text-xs text-[#FDF5E6]/70">{member.phoneNumber || "Not added"}</td>
                                  <td className="border-b border-white/10 px-4 py-4 text-xs text-[#FDF5E6]/70">{member.email}</td>
                                  <td className="border-b border-white/10 px-4 py-4 text-xs uppercase text-[#FDF5E6]/70">{member.rollNo || "Not added"}</td>
                                  <td className="border-b border-white/10 px-4 py-4 text-xs text-[#FDF5E6]/70">{member.isBitMesra ? "BIT Mesra" : "External"}</td>
                                  <td className="border-b border-white/10 px-4 py-4 text-xs">
                                    <span
                                      className={cn(
                                        "rounded-full px-3 py-1 font-semibold uppercase tracking-[0.18em]",
                                        member.idCardImageUrl ? "bg-emerald-500/15 text-emerald-300" : "bg-white/10 text-[#FDF5E6]/50"
                                      )}
                                    >
                                      {member.idCardImageUrl ? "Uploaded" : "Missing"}
                                    </span>
                                  </td>
                                  <td className="border-b border-white/10 px-4 py-4 text-xs">
                                    {isLeader && !memberIsLeader ? (
                                      <button
                                        onClick={() => handleKickMember(team.id, member.id, member.displayName)}
                                        disabled={actionPending}
                                        className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-2 font-semibold uppercase tracking-[0.18em] text-red-200 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                      >
                                        <UserMinus className="h-3.5 w-3.5" />
                                        Kick
                                      </button>
                                    ) : (
                                      <span className="text-[#FDF5E6]/40">--</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={8} className="px-4 py-8 text-center text-sm text-[#FDF5E6]/50">
                                Team details are loading or unavailable right now.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#120606]/85 backdrop-blur-md" onClick={() => setShowCreateModal(false)} />
            <div className="relative z-10 w-full max-w-xl rounded-[32px] border border-white/10 bg-[#160808] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]/70">Create Team</p>
              <h3 className="mt-3 text-3xl font-black uppercase tracking-[0.05em] text-[#FDF5E6]">Start a New Team</h3>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]/65">Team Name</label>
                  <input
                    type="text"
                    value={teamForm.name}
                    onChange={(e) => setTeamForm((prev) => ({ ...prev, name: e.target.value.toUpperCase() }))}
                    className="mt-2 w-full rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#FDF5E6] outline-none transition focus:border-[#D4AF37]/50"
                    placeholder="ENTER TEAM NAME"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]/65">Event</label>
                  <select
                    value={teamForm.eventId}
                    onChange={(e) => setTeamForm((prev) => ({ ...prev, eventId: e.target.value }))}
                    className="mt-2 w-full rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#FDF5E6] outline-none transition focus:border-[#D4AF37]/50"
                  >
                    <option value="">CHOOSE EVENT</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id} className="bg-[#120606] text-[#FDF5E6]">
                        {event.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleCreateTeam}
                  disabled={actionPending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-5 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#1A0505] transition hover:bg-[#e3bc45] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {actionPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Confirm Team
                </button>
              </div>
            </div>
          </div>
        )}

        {showJoinModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#120606]/85 backdrop-blur-md" onClick={() => setShowJoinModal(false)} />
            <div className="relative z-10 w-full max-w-xl rounded-[32px] border border-white/10 bg-[#160808] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]/70">Join Team</p>
              <h3 className="mt-3 text-3xl font-black uppercase tracking-[0.05em] text-[#FDF5E6]">Enter Team Code</h3>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]/65">Invite Code</label>
                  <input
                    type="text"
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="mt-2 w-full rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-4 text-center text-2xl font-black uppercase tracking-[0.3em] text-[#FDF5E6] outline-none transition focus:border-[#D4AF37]/50"
                    placeholder="X1Y2Z3"
                  />
                </div>

                <button
                  onClick={handleJoinTeam}
                  disabled={actionPending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-5 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#1A0505] transition hover:bg-[#e3bc45] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {actionPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
                  Join Team
                </button>
              </div>
            </div>
          </div>
        )}

        {showPhoneModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-[#120606]/85 backdrop-blur-md"
              onClick={() => {
                setShowPhoneModal(false);
                setContinueToCreateAfterPhone(false);
              }}
            />
            <div className="relative z-10 w-full max-w-xl rounded-[32px] border border-white/10 bg-[#160808] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]/70">Phone Verification</p>
              <h3 className="mt-3 text-3xl font-black uppercase tracking-[0.05em] text-[#FDF5E6]">Add Contact Number</h3>
              <p className="mt-3 text-sm leading-7 text-[#FDF5E6]/60">
                A valid phone number is required before team creation so coordinators can verify and reach your squad quickly.
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]/65">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value.replace(/[^\d+\s()-]/g, ""))}
                    className="mt-2 w-full rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-semibold tracking-[0.14em] text-[#FDF5E6] outline-none transition focus:border-[#D4AF37]/50"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <button
                  onClick={handleSavePhoneNumber}
                  disabled={actionPending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-5 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#1A0505] transition hover:bg-[#e3bc45] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {actionPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Phone className="h-4 w-4" />}
                  Save Phone Number
                </button>
              </div>
            </div>
          </div>
        )}

        {statusMessage.text && (
          <button
            type="button"
            onClick={() => setStatusMessage({ text: "", type: "info" })}
            className={cn(
              "fixed bottom-6 right-6 z-[110] max-w-md rounded-[24px] border px-5 py-4 text-left text-sm leading-6 shadow-[0_18px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl",
              statusMessage.type === "success" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
              statusMessage.type === "error" && "border-red-500/30 bg-red-500/10 text-red-200",
              statusMessage.type === "info" && "border-white/10 bg-white/10 text-[#FDF5E6]/80"
            )}
          >
            {statusMessage.text}
          </button>
        )}
      </div>
    </PageWrapper>
  );
}
