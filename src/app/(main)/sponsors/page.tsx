import { Metadata } from "next";
import SponsorsContent from "./SponsorsContent";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "Partners",
  description: "Recognizing the corporate partners and visionary sponsors who empower Bitotsav 2026.",
  alternates: {
    canonical: '/sponsors',
  },
  openGraph: {
    title: `Partners | ${SITE_CONFIG.name}`,
    description: "The alliance that powers North India's largest socio-cultural saga.",
    url: `${SITE_CONFIG.url}/sponsors`,
  },
};

export default function SponsorsPage() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <SponsorsContent />
    </div>
  );
}
