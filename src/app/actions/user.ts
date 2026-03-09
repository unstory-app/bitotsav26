"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { stackServerApp } from "@/stack/server";

const BIT_MESRA_DOMAIN = "@bitmesra.ac.in";

/**
 * Syncs user data from Stack Auth to the database on login.
 * Validates that the user has a @bitmesra.ac.in email.
 * Returns { success, message, isBitMesra }.
 */
export async function syncUser(userData: {
  id: string;
  email: string;
  displayName?: string | null;
  profileImageUrl?: string | null;
  qrData?: string | null;
}) {
  const { id, email, displayName, profileImageUrl, qrData } = userData;

  // 1. SECURE FROM BACKEND: Verify session on server
  const stackUser = await stackServerApp.getUser();
  
  if (!stackUser || stackUser.id !== id) {
    return { success: false, message: "UNAUTHORIZED_ACCESS: SESSION_MISMATCH", isBitMesra: false };
  }

  // 2. DOMAIN_PROTECTION: Refetch email from secure session if possible, or use provided
  const secureEmail = stackUser.primaryEmail || email;

  if (!secureEmail) {
    return { success: false, message: "No email provided.", isBitMesra: false };
  }

  const isBitMesra = secureEmail.toLowerCase().endsWith(BIT_MESRA_DOMAIN);

  try {
    // Upsert: insert or update on conflict
    await db
      .insert(users)
      .values({
        id,
        email: secureEmail.toLowerCase(),
        displayName: displayName ?? null,
        profileImageUrl: profileImageUrl ?? null,
        qrData: qrData ?? null,
        isBitMesra,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: secureEmail.toLowerCase(),
          displayName: displayName ?? null,
          profileImageUrl: profileImageUrl ?? null,
          isBitMesra,
          updatedAt: new Date(),
        },
      });

    return { success: true, message: "User synced successfully.", isBitMesra };
  } catch (error) {
    console.error("Failed to sync user:", error);
    return { success: false, message: "Failed to save user data.", isBitMesra };
  }
}

/**
 * Updates extended user details for the registration questionnaire.
 */
export async function updateUserDetails(userId: string, details: {
  displayName?: string;
  collegeName?: string;
  rollNo?: string;
  idCardImageUrl?: string;
  password?: string;
}) {
  try {
    const stackUser = await stackServerApp.getUser();
    if (!stackUser || stackUser.id !== userId) {
      return { success: false, message: "UNAUTHORIZED_ACCESS" };
    }

    await db.update(users)
      .set({
        ...details,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return { success: true, message: "Profile updated successfully." };
  } catch (error) {
    console.error("Failed to update user details:", error);
    return { success: false, message: "Update failed." };
  }
}

/**
 * Creates a ticket for a user.
 */
import { tickets } from "@/db/schema";
export async function createTicket(userId: string, ticketType: string = "Regular") {
  try {
    const stackUser = await stackServerApp.getUser();
    if (!stackUser || stackUser.id !== userId) {
      return { success: false, message: "UNAUTHORIZED_ACCESS" };
    }

    // Check if user already has a ticket
    const existing = await db.select().from(tickets).where(eq(tickets.userId, userId)).limit(1);
    if (existing.length > 0) {
      return { success: false, message: "ALREADY_HAS_TICKET" };
    }

    await db.insert(tickets).values({
      userId,
      ticketType,
    });

    return { success: true, message: "Ticket generated successfully." };
  } catch (error) {
    console.error("Failed to create ticket:", error);
    return { success: false, message: "Ticket generation failed." };
  }
}

/**
 * Checks if a user has a valid ticket.
 */
export async function hasTicket(userId: string) {
  const result = await db.select().from(tickets).where(eq(tickets.userId, userId)).limit(1);
  return result.length > 0;
}

/**
 * Gets a user from the database by their Stack Auth ID.
 */
export async function getUser(id: string) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] ?? null;
}
