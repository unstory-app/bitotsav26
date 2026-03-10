"use client";

import { FocusRail, FocusRailItem } from "@/components/ui/focus-rail";

const galleryItems: FocusRailItem[] = [
  {
    id: 1,
    title: "The Royal Stage",
    description: "Where the night comes alive with star-studded performances.",
    imageSrc: "/assets/Concrt.jpg", // Concert
    meta: "Pro Nite",
  },
  {
    id: 2,
    title: "Rhythm of Culture",
    description: "A celebration of dance traditions from across the globe.",
    imageSrc: "/assets/dramaticDance.jpg", // Dance dramatic
    meta: "Dance Saga",
  },
  {
    id: 3,
    title: "Battle of Bands",
    description: "Electrifying riffs and thundering beats echoing through the night.",
    imageSrc: "/assets/Band_Night.jpg", // Band dark
    meta: "Band Nite",
  },
  {
    id: 4,
    title: "Dramatic Arts",
    description: "Stories unfolding on stage, capturing hearts and minds.",
    imageSrc: "/assets/Copy of _DSC0140.jpg", // Drama
    meta: "Natsamrat",
  },
   {
    id: 5,
    title: "Fashion & Flare",
    description: "Walking the ramp with elegance and panache.",
    imageSrc: "/assets/fashionFlare.jpg", // Fashion
    meta: "Saptak",
  },
];

export function Gallery() {
  return (
    <section className="py-0 relative z-20 -mt-20">
        <FocusRail items={galleryItems} />
    </section>
  );
}
