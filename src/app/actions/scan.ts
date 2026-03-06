"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

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

    // 2. Check if already scanned for that day
    const dayKey = `day${day}Scan` as keyof typeof user;
    if (user[dayKey]) {
      return { 
        success: false, 
        message: `ALREADY SCANNED FOR DAY ${day}`, 
        user: { name: user.displayName, email: user.email } 
      };
    }

    // 3. Record the scan
    const updateData: Partial<typeof users.$inferInsert> = { updatedAt: new Date() };
    if (day === 0) updateData.day0Scan = true;
    if (day === 1) updateData.day1Scan = true;
    if (day === 2) updateData.day2Scan = true;
    if (day === 3) updateData.day3Scan = true;

    await db.update(users)
      .set(updateData)
      .where(eq(users.id, user.id));

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
    return { success: false, message: "UNAUTHORIZED", counts: [0, 0, 0] };
  }

  try {
    const allUsers = await db.select().from(users);
    const day0 = allUsers.filter(u => u.day0Scan).length;
    const day1 = allUsers.filter(u => u.day1Scan).length;
    const day2 = allUsers.filter(u => u.day2Scan).length;
    const day3 = allUsers.filter(u => u.day3Scan).length;

    return { success: true, counts: [day0, day1, day2, day3] };
  } catch (error) {
    console.error("Failed to get stats:", error);
    return { success: false, message: "DB_ERROR", counts: [0, 0, 0, 0] };
  }
}
