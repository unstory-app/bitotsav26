"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowDownAZ,
  ArrowUpAZ,
  Download,
  FolderTree,
  Search,
  Users,
} from "lucide-react";
import { getAdminTeamEventMatrix } from "@/app/actions/admin";
import { PageWrapper } from "@/components/ui/page-wrapper";

export type TeamEventRow = {
  teamId: string;
  teamName: string;
  teamCode: string;
  teamPoints: number;
  teamRank: number | null;
  memberCount: number;
  teamCreatedAt: Date | string;
  leaderId: string;
  leaderName: string | null;
  leaderEmail: string;
  leaderPhoneNumber: string | null;
  leaderRollNo: string | null;
  eventId: string;
  eventName: string;
  organizer: string | null;
  venue: string | null;
  category: string | null;
  registeredAt: Date | string;
  memberDigest: string;
  members: Array<{
    userId: string;
    displayName: string | null;
    email: string;
    phoneNumber: string | null;
    rollNo: string | null;
    collegeName: string | null;
    isBitMesra: boolean;
    profileImageUrl: string | null;
    idCardImageUrl: string | null;
    joinedAt: Date | string;
  }>;
};

type SortKey = "teamName" | "eventName" | "leaderName" | "teamPoints" | "teamRank" | "memberCount" | "registeredAt";

type TeamEventMatrixClientProps = {
  title: string;
  accentTitle: string;
  subtitle: string;
  emptyLabel: string;
  showExport?: boolean;
};

function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString();
}

function escapeCsvValue(value: unknown) {
  const normalized = String(value ?? "").replace(/"/g, '""');
  return `"${normalized}"`;
}

export function TeamEventMatrixClient({
  title,
  accentTitle,
  subtitle,
  emptyLabel,
  showExport = true,
}: TeamEventMatrixClientProps) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<TeamEventRow[]>([]);
  const [search, setSearch] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("registeredAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const fetchRows = async (searchValue: string) => {
    setLoading(true);
    const result = await getAdminTeamEventMatrix(searchValue);

    if (result.success) {
      setRows((result.data || []) as TeamEventRow[]);
      setError(null);
    } else {
      setError(result.message || "Failed to fetch team-event mapping.");
    }

    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchRows(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const eventOptions = useMemo(() => {
    const map = new Map<string, string>();

    for (const row of rows) {
      if (!map.has(row.eventId)) {
        map.set(row.eventId, row.eventName);
      }
    }

    return [...map.entries()]
      .map(([eventId, eventName]) => ({ eventId, eventName }))
      .sort((left, right) => left.eventName.localeCompare(right.eventName));
  }, [rows]);

  const sortedRows = useMemo(() => {
    const next = [...rows];

    next.sort((left, right) => {
      const leftValue = left[sortKey];
      const rightValue = right[sortKey];

      if (sortKey === "teamPoints" || sortKey === "teamRank" || sortKey === "memberCount") {
        const result = Number(leftValue ?? 0) - Number(rightValue ?? 0);
        return sortDirection === "asc" ? result : -result;
      }

      if (sortKey === "registeredAt") {
        const result = new Date(left.registeredAt).getTime() - new Date(right.registeredAt).getTime();
        return sortDirection === "asc" ? result : -result;
      }

      const result = String(leftValue ?? "").localeCompare(String(rightValue ?? ""));
      return sortDirection === "asc" ? result : -result;
    });

    return next;
  }, [rows, sortDirection, sortKey]);

  const eventTeams = useMemo(() => {
    if (!selectedEventId) {
      return [];
    }

    return sortedRows.filter((row) => row.eventId === selectedEventId);
  }, [selectedEventId, sortedRows]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection(key === "teamPoints" || key === "teamRank" || key === "memberCount" || key === "registeredAt" ? "desc" : "asc");
  };

  const exportCsv = () => {
    const header = [
      "Team Name",
      "Team Code",
      "Team Rank",
      "Team Points",
      "Member Count",
      "Leader Name",
      "Leader Email",
      "Leader Phone",
      "Leader Roll No",
      "Event Name",
      "Event ID",
      "Event Category",
      "Event Organizer",
      "Event Venue",
      "Registered At",
      "Team Created At",
      "Members",
    ];

    const lines = sortedRows.map((row) => [
      row.teamName,
      row.teamCode,
      row.teamRank ?? "",
      row.teamPoints,
      row.memberCount,
      row.leaderName || "",
      row.leaderEmail,
      row.leaderPhoneNumber || "",
      row.leaderRollNo || "",
      row.eventName,
      row.eventId,
      row.category || "",
      row.organizer || "",
      row.venue || "",
      formatDate(row.registeredAt),
      formatDate(row.teamCreatedAt),
      row.memberDigest,
    ]);

    const csvContent = [header, ...lines]
      .map((line) => line.map(escapeCsvValue).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `bitotsav-team-events-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const sortLabel = `${sortKey.toUpperCase()} ${sortDirection === "asc" ? "ASC" : "DESC"}`;

  return (
    <PageWrapper className="pt-12 pb-20 px-8 relative">
      <div className="absolute inset-0 z-0 pointer-events-none tapestry-pattern opacity-5" />

      <div className="max-w-[92rem] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
          <div>
            <h1 className="text-6xl font-black italic text-[#FDF5E6] uppercase tracking-tighter mb-1 select-none">
              {title} <span className="text-[#D4AF37]">{accentTitle}</span>
            </h1>
            <p className="text-[10px] text-[#D4AF37]/40 font-black uppercase tracking-[0.3em]">{subtitle}</p>
          </div>

          {showExport ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={exportCsv}
                disabled={loading || sortedRows.length === 0}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-[0.28em] hover:bg-[#e3bc45] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white/5 border border-white/10 p-6">
            <p className="text-[8px] font-black uppercase tracking-[0.28em] text-[#D4AF37]/60">Mapped Rows</p>
            <p className="mt-3 text-4xl font-black italic text-[#FDF5E6]">{sortedRows.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6">
            <p className="text-[8px] font-black uppercase tracking-[0.28em] text-[#D4AF37]/60">Distinct Teams</p>
            <p className="mt-3 text-4xl font-black italic text-[#FDF5E6]">{new Set(sortedRows.map((row) => row.teamId)).size}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6">
            <p className="text-[8px] font-black uppercase tracking-[0.28em] text-[#D4AF37]/60">Distinct Events</p>
            <p className="mt-3 text-4xl font-black italic text-[#FDF5E6]">{new Set(sortedRows.map((row) => row.eventId)).size}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6">
            <p className="text-[8px] font-black uppercase tracking-[0.28em] text-[#D4AF37]/60">Sort Mode</p>
            <p className="mt-3 text-sm font-black uppercase tracking-[0.2em] text-[#FDF5E6]">{sortLabel}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_280px] gap-6 mb-10">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]/40 group-focus-within:text-[#D4AF37] transition-colors" />
            <input
              type="text"
              placeholder="SEARCH TEAM, EVENT, LEADER, MEMBER, VENUE..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full bg-white/5 border border-white/10 p-5 pl-14 text-xs font-black uppercase tracking-widest text-[#FDF5E6] outline-hidden focus:border-[#D4AF37]/50 transition-all font-heading"
            />
          </div>

          <select
            value={selectedEventId}
            onChange={(event) => setSelectedEventId(event.target.value)}
            className="bg-white/5 border border-white/10 p-5 text-xs font-black uppercase tracking-widest text-[#FDF5E6] outline-hidden focus:border-[#D4AF37]/50 transition-all font-heading"
          >
            <option value="">FILTER TEAMS BY EVENT</option>
            {eventOptions.map((event) => (
              <option key={event.eventId} value={event.eventId} className="bg-[#0A0505] text-[#FDF5E6]">
                {event.eventName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          {[
            ["teamName", "Team"],
            ["eventName", "Event"],
            ["leaderName", "Leader"],
            ["teamPoints", "Points"],
            ["teamRank", "Rank"],
            ["memberCount", "Members"],
            ["registeredAt", "Registered"],
          ].map(([key, label]) => {
            const active = sortKey === key;
            return (
              <button
                key={key}
                onClick={() => handleSort(key as SortKey)}
                className={`inline-flex items-center gap-2 px-4 py-3 border text-[10px] font-black uppercase tracking-[0.24em] transition-all ${
                  active
                    ? "border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]"
                    : "border-white/10 bg-white/5 text-[#FDF5E6]/60 hover:border-[#D4AF37]/20 hover:text-[#FDF5E6]"
                }`}
              >
                {sortDirection === "asc" && active ? <ArrowUpAZ className="w-4 h-4" /> : <ArrowDownAZ className="w-4 h-4" />}
                {label}
              </button>
            );
          })}
        </div>

        {selectedEventId ? (
          <div className="mb-10 bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#D4AF37]/60">Selected Event Teams</p>
                <h2 className="text-3xl font-black italic text-[#FDF5E6] uppercase tracking-tighter mt-2">
                  {eventOptions.find((event) => event.eventId === selectedEventId)?.eventName || "EVENT"}
                </h2>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#FDF5E6]/50">
                {eventTeams.length} team{eventTeams.length === 1 ? "" : "s"} participating
              </p>
            </div>

            {eventTeams.length === 0 ? (
              <div className="p-8 border border-dashed border-white/10 text-center text-[#FDF5E6]/35 text-xs font-black uppercase tracking-[0.28em]">
                No teams found for this event.
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {eventTeams.map((row) => (
                  <div key={`selected-${row.teamId}-${row.eventId}`} className="bg-white/5 border border-white/10 p-5 space-y-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="px-2 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">
                            {row.teamCode}
                          </span>
                          <span className="px-2 py-1 bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-[#FDF5E6]/60">
                            Rank #{row.teamRank ?? "--"}
                          </span>
                        </div>
                        <h3 className="text-xl font-black uppercase text-[#FDF5E6]">{row.teamName}</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]/60 mt-2">
                          Leader {row.leaderName || "UNKNOWN"}
                        </p>
                      </div>

                      <div className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-[#FDF5E6]/50">
                        <p>{row.memberCount} members</p>
                        <p className="mt-2 text-[#D4AF37]">{row.teamPoints} pts</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {row.members.map((member) => (
                        <div key={`${row.teamId}-${member.userId}`} className="border border-white/10 bg-black/20 p-4">
                          <p className="text-[10px] font-black uppercase text-[#FDF5E6]">{member.displayName || "UNKNOWN"}</p>
                          <p className="text-[8px] font-black uppercase text-[#D4AF37]/60 mt-1">{member.email}</p>
                          <p className="text-[8px] font-black uppercase text-[#FDF5E6]/45 mt-2">{member.phoneNumber || "NO PHONE"}</p>
                          <p className="text-[8px] font-black uppercase text-[#FDF5E6]/30 mt-1">
                            {member.rollNo || member.collegeName || "NO ACADEMIC DATA"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        <div className="bg-white/2 border-2 border-white/5 relative overflow-hidden min-h-[420px]">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 bg-[#0A0505]/50 backdrop-blur-sm z-20">
              <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-black text-[#D4AF37] uppercase tracking-[0.5em] animate-pulse">SYNCING TEAM MATRIX...</p>
            </div>
          ) : error ? (
            <div className="p-40 flex flex-col items-center justify-center text-center space-y-4">
              <AlertTriangle className="w-16 h-16 text-red-600" />
              <p className="text-red-600 font-black uppercase tracking-widest font-heading">ERROR: {error}</p>
              <button onClick={() => void fetchRows(search)} className="px-6 py-2 bg-red-600 text-white font-black uppercase text-[10px] font-heading">
                Retry Sync
              </button>
            </div>
          ) : sortedRows.length === 0 ? (
            <div className="p-40 flex flex-col items-center justify-center text-center space-y-4">
              <FolderTree className="w-16 h-16 text-[#D4AF37]/30" />
              <p className="text-[#FDF5E6]/30 font-black uppercase tracking-widest font-heading">{emptyLabel}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1500px]">
                <thead>
                  <tr className="border-b-2 border-white/5">
                    <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">Team</th>
                    <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">Event</th>
                    <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">Leader</th>
                    <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">Members</th>
                    <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">Strength</th>
                    <th className="p-6 text-[8px] font-black uppercase tracking-widest text-[#D4AF37] text-right">Timeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-heading">
                  <AnimatePresence mode="popLayout">
                    {sortedRows.map((row, index) => (
                      <motion.tr
                        key={`${row.teamId}-${row.eventId}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.015 }}
                        className="align-top hover:bg-white/2 transition-colors"
                      >
                        <td className="p-6">
                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">
                                {row.teamCode}
                              </span>
                              <span className="px-2 py-1 bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-[#FDF5E6]/60">
                                Rank #{row.teamRank ?? "--"}
                              </span>
                            </div>
                            <div>
                              <p className="text-xs font-black uppercase text-[#FDF5E6]">{row.teamName}</p>
                              <p className="text-[8px] font-black uppercase text-[#D4AF37]/60 mt-1">{row.teamPoints} points</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="space-y-2 max-w-[260px]">
                            <p className="text-xs font-black uppercase text-[#FDF5E6]">{row.eventName}</p>
                            <p className="text-[8px] font-black uppercase text-[#D4AF37]/60">{row.eventId}</p>
                            <div className="flex flex-wrap gap-2 pt-1">
                              {row.category ? (
                                <span className="px-2 py-1 bg-white/5 border border-white/10 text-[7px] font-black uppercase text-[#FDF5E6]/50">{row.category}</span>
                              ) : null}
                              {row.organizer ? (
                                <span className="px-2 py-1 bg-white/5 border border-white/10 text-[7px] font-black uppercase text-[#FDF5E6]/50">{row.organizer}</span>
                              ) : null}
                              {row.venue ? (
                                <span className="px-2 py-1 bg-white/5 border border-white/10 text-[7px] font-black uppercase text-[#FDF5E6]/50">{row.venue}</span>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="space-y-1 max-w-[240px]">
                            <p className="text-[10px] font-black uppercase text-[#FDF5E6]">{row.leaderName || "UNKNOWN"}</p>
                            <p className="text-[8px] font-black uppercase text-[#D4AF37]/60">{row.leaderEmail}</p>
                            <p className="text-[8px] font-black uppercase text-[#FDF5E6]/40">{row.leaderPhoneNumber || "NO PHONE"}</p>
                            <p className="text-[8px] font-black uppercase text-[#FDF5E6]/30">{row.leaderRollNo || "NO ROLL"}</p>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="space-y-2 max-w-[420px]">
                            {row.members.map((member) => (
                              <div key={`${row.teamId}-${row.eventId}-${member.userId}`} className="p-3 bg-white/5 border border-white/10">
                                <div className="flex items-center justify-between gap-4">
                                  <div>
                                    <p className="text-[10px] font-black uppercase text-[#FDF5E6]">{member.displayName || "UNKNOWN"}</p>
                                    <p className="text-[8px] font-black uppercase text-[#D4AF37]/60">{member.email}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[8px] font-black uppercase text-[#FDF5E6]/50">{member.phoneNumber || "NO PHONE"}</p>
                                    <p className="text-[8px] font-black uppercase text-[#FDF5E6]/35">{member.rollNo || member.collegeName || "NO ACADEMIC DATA"}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="space-y-3 min-w-[120px]">
                            <div className="flex items-center gap-2 text-[#D4AF37]">
                              <Users className="w-4 h-4" />
                              <span className="text-xs font-black uppercase">{row.memberCount} members</span>
                            </div>
                            <div className="text-[8px] font-black uppercase tracking-widest text-[#FDF5E6]/40">
                              FULL DIGEST AVAILABLE IN CSV EXPORT
                            </div>
                          </div>
                        </td>
                        <td className="p-6 text-right">
                          <div className="space-y-2 text-[8px] font-black uppercase tracking-widest">
                            <p className="text-[#D4AF37]">Registered {formatDate(row.registeredAt)}</p>
                            <p className="text-[#FDF5E6]/30">Team Minted {formatDate(row.teamCreatedAt)}</p>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}