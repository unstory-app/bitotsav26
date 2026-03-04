import { Metadata } from "next";
import LeaderboardContent from "./LeaderboardContent";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "Legend",
  description: "Track the real-time rankings and competition standings of BIT Mesra's premier saga - Bitotsav 2026.",
  alternates: {
    canonical: '/leaderboard',
  },
  openGraph: {
    title: `Legend | ${SITE_CONFIG.name}`,
    description: "Real-time standings of artistic and technical champions.",
    url: `${SITE_CONFIG.url}/leaderboard`,
  },
};

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <LeaderboardContent />
    </div>
  );
}
