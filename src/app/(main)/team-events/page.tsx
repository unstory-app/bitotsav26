import { Metadata } from "next";
import { TeamEventMatrixClient } from "@/components/team-events/TeamEventMatrixClient";

export const metadata: Metadata = {
  title: "Team Events",
  description: "See which teams are participating in which Bitotsav events and explore the team rosters for each event.",
  alternates: {
    canonical: "/team-events",
  },
};

export default function TeamEventsPage() {
  return (
    <TeamEventMatrixClient
      title="PUBLIC TEAM"
      accentTitle="EVENTS."
      subtitle="OPEN PARTICIPATION MAP // EVENT TO TEAM DISCOVERY"
      emptyLabel="NO PUBLIC TEAM EVENT LINKS FOUND"
      showExport
    />
  );
}