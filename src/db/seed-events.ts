import { db } from "@/db";
import { events as eventsTable } from "@/db/schema";
import { events as staticEvents } from "@/lib/data/events";

async function seed() {
  console.log("Seeding events...");
  try {
    for (const event of staticEvents) {
      await db.insert(eventsTable).values({
        id: event.id,
        name: event.name,
        organizer: event.organizer || "Events Team",
        venue: event.venue || "TBD",
        category: event.category || "General",
        about: event.about || "",
        imageUrl: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(event.name)}`,
      }).onConflictDoUpdate({
        target: eventsTable.id,
        set: {
          name: event.name,
          organizer: event.organizer || "Events Team",
          venue: event.venue || "TBD",
          category: event.category || "General",
          about: event.about || "",
        }
      });
    }
    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seed();
