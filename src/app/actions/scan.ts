"use server";

import { db } from "@/db";
import { users, tickets } from "@/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * Records a scan for a specific user and day.
 * Validates with a hardcoded passkey: 17092006
 */
export async function recordScan(userData: { email: string; day: 0 | 1 | 2 | 3; passkey: string }) {
  const { email, day, passkey } = userData;

  if (passkey !== "17092006") {
    return { success: false, message: "INVALID_PASSKEY: ACCESS_DENIED" };
  }

  if (!email) {
    return { success: false, message: "No email provided." };
  }

  try {
    // 1. Find the user
    const userResult = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    const user = userResult[0];

    if (!user) {
      return { success: false, message: "User not found in system." };
    }

    // 2. Find their confirmed ticket
    const ticketResult = await db.select().from(tickets).where(
      and(
        eq(tickets.userId, user.id),
        eq(tickets.status, "confirmed")
      )
    ).limit(1);
    const ticket = ticketResult[0];

    if (!ticket) {
      return { success: false, message: "No confirmed ticket found for this user." };
    }

    // 3. Check if already scanned for that day on this ticket
    const dayKey = `day${day}Scan` as keyof typeof ticket;
    if (ticket[dayKey]) {
      return { 
        success: false, 
        message: `ALREADY SCANNED FOR DAY ${day}`, 
        user: { name: user.displayName, email: user.email } 
      };
    }

    // 4. Record the scan on the ticket
    const updateData: any = {};
    updateData[`day${day}Scan`] = true;

    await db.update(tickets)
      .set(updateData)
      .where(eq(tickets.id, ticket.id));

    return { 
      success: true, 
      message: `SCAN SUCCESSFUL - DAY ${day}`, 
      user: { name: user.displayName, email: user.email } 
    };
  } catch (error) {
    console.error("Failed to record scan:", error);
    return { success: false, message: "Database error during scan." };
  }
}

/**
 * Gets total scans for each day.
 */
export async function getScanStats(passkey: string) {
  if (passkey !== "17092006") {
    return { success: false, message: "UNAUTHORIZED", counts: [0, 0, 0, 0] };
  }

  try {
    const allConfirmedTickets = await db.select().from(tickets).where(eq(tickets.status, "confirmed"));
    const day0 = allConfirmedTickets.filter(t => t.day0Scan).length;
    const day1 = allConfirmedTickets.filter(t => t.day1Scan).length;
    const day2 = allConfirmedTickets.filter(t => t.day2Scan).length;
    const day3 = allConfirmedTickets.filter(t => t.day3Scan).length;

    return { success: true, counts: [day0, day1, day2, day3] };
  } catch (error) {
    console.error("Failed to get stats:", error);
    return { success: false, message: "DB_ERROR", counts: [0, 0, 0, 0] };
  }
}
