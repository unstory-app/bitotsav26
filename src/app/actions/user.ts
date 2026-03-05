"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

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

  if (!email) {
    return { success: false, message: "No email provided.", isBitMesra: false };
  }

  const isBitMesra = email.toLowerCase().endsWith(BIT_MESRA_DOMAIN);

  if (!isBitMesra) {
    return {
      success: false,
      message:
        "Only BIT Mesra students are allowed to generate a pass. Please use your webmail (@bitmesra.ac.in). If you don't have one, contact the ERP office.",
      isBitMesra: false,
    };
  }

  try {
    // Upsert: insert or update on conflict
    await db
      .insert(users)
      .values({
        id,
        email: email.toLowerCase(),
        displayName: displayName ?? null,
        profileImageUrl: profileImageUrl ?? null,
        qrData: qrData ?? null,
        isBitMesra,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: email.toLowerCase(),
          displayName: displayName ?? null,
          profileImageUrl: profileImageUrl ?? null,
          qrData: qrData ?? null,
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
 * Gets a user from the database by their Stack Auth ID.
 */
export async function getUser(id: string) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] ?? null;
}
