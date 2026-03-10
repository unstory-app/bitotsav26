"use client";

import { TeamEventMatrixClient } from "@/components/team-events/TeamEventMatrixClient";

export default function AdminTeamEventsPage() {
  return (
    <TeamEventMatrixClient
      title="TEAM EVENT"
      accentTitle="MATRIX."
      subtitle="FULL PARTICIPATION MAP // TEAM TO EVENT INTELLIGENCE"
      emptyLabel="NO TEAM EVENT LINKS FOUND"
      showExport
    />
  );
}
