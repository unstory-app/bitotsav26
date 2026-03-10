"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { stackServerApp } from "@/stack/server";

const BIT_MESRA_DOMAIN = "@bitmesra.ac.in";

function isValidImageUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateUserDetails(details: {
  displayName?: string;
  collegeName?: string;
  rollNo?: string;
  idCardImageUrl?: string;
  password?: string;
  phoneNumber?: string;
}) {
  const displayName = details.displayName?.trim() ?? "";
  const rollNo = details.rollNo?.trim() ?? "";
  const idCardImageUrl = details.idCardImageUrl?.trim() ?? "";
  const password = details.password?.trim() ?? "";
  const phoneNumber = details.phoneNumber?.trim() ?? "";
  const phoneDigits = phoneNumber.replace(/\D/g, "");

  if (!displayName || displayName.length < 3 || !/^[A-Z][A-Z .'-]{2,}$/i.test(displayName)) {
    return "INVALID_DISPLAY_NAME";
  }

  if (!(phoneDigits.length === 10 || (phoneDigits.length === 12 && phoneDigits.startsWith("91")))) {
    return "INVALID_PHONE_NUMBER";
  }

  if (!rollNo || !/^[A-Z0-9/-]{6,20}$/i.test(rollNo)) {
    return "INVALID_ROLL_NUMBER";
  }

  if (!idCardImageUrl || !isValidImageUrl(idCardImageUrl)) {
    return "INVALID_ID_CARD_IMAGE_URL";
  }

  if (!password || password.length < 6) {
    return "INVALID_RECOVERY_SEAL";
  }

  return null;
}

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
  phoneNumber?: string;
}) {
  try {
    const stackUser = await stackServerApp.getUser();
    if (!stackUser || stackUser.id !== userId) {
      return { success: false, message: "UNAUTHORIZED_ACCESS" };
    }

    const validationError = validateUserDetails(details);
    if (validationError) {
      return { success: false, message: validationError };
    }

    const sanitizedDetails = {
      ...details,
      displayName: details.displayName?.trim(),
      collegeName: details.collegeName?.trim(),
      rollNo: details.rollNo?.trim().toUpperCase(),
      idCardImageUrl: details.idCardImageUrl?.trim(),
      password: details.password?.trim(),
      phoneNumber: details.phoneNumber?.trim(),
    };

    await db.update(users)
      .set({
        ...sanitizedDetails,
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

export async function verifyTicketUnlockPassword(userId: string, password: string) {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser || stackUser.id !== userId) {
    return { success: false, message: "UNAUTHORIZED_ACCESS" };
  }

  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const existingUser = result[0];

  if (!existingUser?.password) {
    return { success: false, message: "RECOVERY_SEAL_NOT_SET" };
  }

  if (existingUser.password.trim() !== password.trim()) {
    return { success: false, message: "INVALID_RECOVERY_SEAL" };
  }

  return { success: true };
}

/**
 * Gets a user from the database by their Stack Auth ID.
 */
export async function getUser(id: string) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  const existingUser = result[0];

  if (!existingUser) {
    return null;
  }

  const { password: _password, ...safeUser } = existingUser;
  return safeUser;
}
