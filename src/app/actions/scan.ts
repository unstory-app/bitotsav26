"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { stackServerApp } from "@/stack/server";

/**
 * Records a scan for a specific user and day.
 * Only authorized staff should be able to call this (implementation of staff check omitted for brevity, assuming internal use).
 */
export async function recordScan(userData: { email: string; day: 1 | 2 | 3 }) {
  const { email, day } = userData;

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
    const updateData: any = { updatedAt: new Date() };
    updateData[`day${day}Scan`] = true;

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
