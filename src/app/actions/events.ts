"use server";

import { db } from "@/db";
import { events, type Event as DBEvent } from "@/db/schema";
import { desc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getEvents = unstable_cache(
  async () => {
    try {
      return await db.select().from(events).orderBy(desc(events.createdAt));
    } catch (error) {
      console.error("Failed to fetch events:", error);
      return [];
    }
  },
  ["events-list"],
  { revalidate: 3600, tags: ["events"] }
);

export async function createEvent(data: {
  id: string;
  name: string;
  organizer?: string;
  venue?: string;
  category?: string;
  about?: string;
  imageUrl?: string;
}) {
  try {
    const [newEvent] = await db.insert(events).values(data).returning();
    return { success: true, data: newEvent };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to create event" };
  }
}
