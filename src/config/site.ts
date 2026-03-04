export const SITE_CONFIG = {
  name: "Bitotsav 2026",
  shortName: "Bitotsav",
  edition: "The 35th Edition",
  tagline: "Where tradition meets tomorrow.",
  dates: {
    short: "Feb 13 — 16, 2026",
    long: "February 13th to 16th, 2026",
    start: "2026-02-13",
    end: "2026-02-16",
  },
  venue: {
    name: "BIT Mesra",
    location: "Ranchi, Jharkhand",
    full: "BIT Mesra, Ranchi",
  },
  time: "10:00 AM IST",
  socials: {
    instagram: "https://instagram.com/bitotsav",
    twitter: "https://twitter.com/bitotsav",
    facebook: "https://facebook.com/bitotsav",
  },
  links: {
    registration: "/login",
    events: "/events",
    sponsors: "/sponsors",
    profile: "/profile",
  },
};

export const SITEPARTNERS = [
  {
    name: "TITLE_PARTNERS",
    partners: [
      { name: "SBI", logo: "https://api.dicebear.com/9.x/initials/svg?seed=SBI" },
    ],
  },
  {
    name: "POWERED_BY",
    partners: [
      { name: "RedBull", logo: "https://api.dicebear.com/9.x/initials/svg?seed=RedBull" },
    ],
  },
  {
    name: "STRATEGIC_PARTNERS",
    partners: [
      { name: "CMPDI", logo: "https://api.dicebear.com/9.x/initials/svg?seed=CMPDI" },
      { name: "NTPC", logo: "https://api.dicebear.com/9.x/initials/svg?seed=NTPC" },
    ],
  },
  {
    name: "MEDIA_PARTNERS",
    partners: [
      { name: "Spotify", logo: "https://api.dicebear.com/9.x/initials/svg?seed=Spotify" },
    ],
  },
];

export type SiteConfig = typeof SITE_CONFIG;
