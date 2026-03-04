export type EventCategory = "Flagship" | "Formal" | "Informal";

export interface Event {
  id: string;
  name: string;
  organizer: string;
  venue: string;
  category: EventCategory;
  description?: string;
  about?: string; // Short catchphrase or intro
  image?: string; // Potential future use
  date?: string;  // Potential future use
}

export interface TeamMember {
  name: string;
  role: string;
  image?: string;
  socials?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}
