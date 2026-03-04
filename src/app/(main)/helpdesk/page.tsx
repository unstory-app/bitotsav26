import { Metadata } from "next";
import HelpdeskContent from "./HelpdeskContent";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "Support",
  description: "Get immediate assistance, join our community, or contact the Bitotsav 2026 team for support.",
  alternates: {
    canonical: '/helpdesk',
  },
  openGraph: {
    title: `Support | ${SITE_CONFIG.name}`,
    description: "Dedicated assistance for North India's largest festival.",
    url: `${SITE_CONFIG.url}/helpdesk`,
  },
};

export default function HelpdeskPage() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <HelpdeskContent />
    </div>
  );
}
