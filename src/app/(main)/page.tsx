import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} | BIT Mesra's Premier Festival`,
  description: `Experience the grand unification of Culture, Sports, and Technology at ${SITE_CONFIG.name}. The 35th Edition of BIT Mesra's Premier Festival.`,
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Bitotsav 2026",
    "description": "The Endless Saga - BIT Mesra's Premier Cultural, Sports & Technical Festival",
    "startDate": "2026-02-13",
    "endDate": "2026-02-16",
    "location": {
      "@type": "Place",
      "name": "BIT Mesra, Ranchi",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Ranchi",
        "addressRegion": "JH",
        "addressCountry": "IN"
      }
    },
    "image": "https://bitotsav.bitmesra.ac.in/og-main.png"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
