import { Metadata } from "next";
import EventsClient from "./EventsClient";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "Events",
  description: "Explore the official lineup of flagship competitions, cultural performances, and technical challenges at Bitotsav 2026.",
  alternates: {
    canonical: '/events',
  },
  openGraph: {
    title: `Events | ${SITE_CONFIG.name}`,
    description: "North India's largest stage for artistic and technical brilliance.",
    url: `${SITE_CONFIG.url}/events`,
  },
};

import { getEvents } from "@/app/actions/events";
import { type Event as DBEvent } from "@/db/schema";

export default async function EventsPage() {
  const eventsData = await getEvents();
  return <EventsClient events={eventsData as DBEvent[]} />;
}
