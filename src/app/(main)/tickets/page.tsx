import { Metadata } from "next";
import { SITE_CONFIG } from "@/config/site";
import TicketsClient from "./TicketsClient";

export const metadata: Metadata = {
  title: "Tickets & Passes",
  description: "Secure your access to Bitotsav '26. Choose from Day Passes, Fest Passes, and exclusive Royal Passes.",
  alternates: {
    canonical: '/tickets',
  },
  openGraph: {
    title: `Tickets & Passes | ${SITE_CONFIG.name}`,
    description: "Your gateway to the ultimate 4-day saga at BIT Mesra.",
    url: `${SITE_CONFIG.url}/tickets`,
  },
};

export default function TicketsPage() {
  return <TicketsClient />;
}
