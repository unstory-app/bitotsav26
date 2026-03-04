import { Metadata } from "next";
import TeamContent from "./TeamContent";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "The Crew",
  description: "Meet the visionary organizers and core team members behind the Bitotsav 2026 saga.",
  openGraph: {
    title: `The Crew | ${SITE_CONFIG.name}`,
    description: "The minds behind the magic.",
    url: `${SITE_CONFIG.url}/team`,
  },
};

export default function TeamPage() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <TeamContent />
    </div>
  );
}
