import { Metadata } from "next";
import ScheduleClient from "./ScheduleClient";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "Schedule",
  description: "View the complete four-day timeline of Bitotsav 2026 events, from cultural nights to technical workshops.",
  alternates: {
    canonical: '/schedule',
  },
  openGraph: {
    title: `Festival Schedule | ${SITE_CONFIG.name}`,
    description: "4 days of an endless saga.",
    url: `${SITE_CONFIG.url}/schedule`,
  },
};

export default function SchedulePage() {
  return <ScheduleClient />;
}
