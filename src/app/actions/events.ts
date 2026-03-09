import { db } from "@/db";
import { events, teamEvents } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { unstable_cache, revalidatePath } from "next/cache";

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
    revalidatePath("/events");
    return { success: true, data: newEvent };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to create event" };
  }
}

export async function registerTeamForEvent(teamId: string, eventId: string) {
  try {
    // Check if already registered
    const existing = await db.select().from(teamEvents).where(
      and(
        eq(teamEvents.teamId, teamId),
        eq(teamEvents.eventId, eventId)
      )
    ).limit(1);

    if (existing.length > 0) {
      return { success: false, message: "Team is already registered for this event." };
    }

    await db.insert(teamEvents).values({
      teamId,
      eventId
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Registration failed" };
  }
}
