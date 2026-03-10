export const SITE_CONFIG = {
  name: "Bitotsav 2026",
  shortName: "Bitotsav",
  edition: "The 35th Edition",
  tagline: "Where tradition meets tomorrow.",
  description:
    "Bitotsav 2026 is North India's largest socio-cultural fest at BIT Mesra. Experience the ultimate 4-day saga of music, dance, arts, and competitive excellence.",
  url: "https://bitotsav.bitmesra.ac.in", // Placeholder or official URL
  ogImage: "/og-image.png",
  keywords: [
    "Bitotsav",
    "BIT Mesra",
    "Bitotsav 2026",
    "BIT Mesra Ranchi",
    "Cultural Fest",
    "Engineering Fest India",
    "Ranchi Events",
    "North India Fest",
    "College Festival India",
  ],
  dates: {
    short: "Mar 19 — 22, 2026",
    long: "March 19th to 22nd, 2026",
    start: "2026-03-19",
    end: "2026-03-22",
  },
  venue: {
    name: "BIT Mesra",
    location: "Ranchi, Jharkhand",
    full: "BIT Mesra, Ranchi",
  },
  time: "10:00 AM IST",
  socials: {
    instagram: "https://www.instagram.com/bitotsav.2026/",
    linkedin: "https://www.linkedin.com/company/bitotsavbitmesra/",
    facebook: "https://facebook.com/bitotsav",
    youtube: "https://www.youtube.com/@bitotsav3377/",
    whatsapp: "https://chat.whatsapp.com/C8ICNlasuguC9g0EQ3HDy3",
  },
  whatsapp: {
    community: "https://chat.whatsapp.com/C8ICNlasuguC9g0EQ3HDy3",
    helpdesk: "https://chat.whatsapp.com/HKypzDR4x7N766Gn9PTDUx?mode=gi_t",
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
    name: "TITLE PARTNERS",
    partners: [
      {
        name: "SBI",
        logo: "https://api.dicebear.com/9.x/initials/svg?seed=SBI",
      },
    ],
  },
  {
    name: "POWERED BY",
    partners: [
      {
        name: "RedBull",
        logo: "https://api.dicebear.com/9.x/initials/svg?seed=RedBull",
      },
    ],
  },
  {
    name: "STRATEGIC PARTNERS",
    partners: [
      {
        name: "CMPDI",
        logo: "https://api.dicebear.com/9.x/initials/svg?seed=CMPDI",
      },
      {
        name: "NTPC",
        logo: "https://api.dicebear.com/9.x/initials/svg?seed=NTPC",
      },
    ],
  },
  {
    name: "MEDIA PARTNERS",
    partners: [
      {
        name: "Spotify",
        logo: "https://api.dicebear.com/9.x/initials/svg?seed=Spotify",
      },
    ],
  },
];

export type SiteConfig = typeof SITE_CONFIG;
