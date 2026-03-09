"use server";

import { db } from "@/db";
import { teams, teamMembers, users, teamEvents } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Helper to generate a unique team code
async function generateTeamCode(): Promise<string> {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  let isUnique = false;

  while (!isUnique) {
    code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Check if code exists
    const existing = await db.select().from(teams).where(eq(teams.code, code)).limit(1);
    if (existing.length === 0) {
      isUnique = true;
    }
  }

  return code;
}
export async function createTeam(name: string, eventId: string, leaderId: string) {
  try {
    // 0. Enforce "One Person, One Team" rule
    const existingMembership = await db.select().from(teamMembers).where(eq(teamMembers.userId, leaderId)).limit(1);
    if (existingMembership.length > 0) {
      return { success: false, message: "A user can only be part of one team across the event." };
    }

    const code = await generateTeamCode();
    
    // 1. Create the team
    const [newTeam] = await db.insert(teams).values({
      name,
      leaderId,
      code,
    }).returning();

    if (!newTeam) {
      return { success: false, message: "Failed to create team record." };
    }

    // 2. Add leader as the first member
    await db.insert(teamMembers).values({
      teamId: newTeam.id,
      userId: leaderId,
    });

    // 3. Register team for the initial event
    await db.insert(teamEvents).values({
      teamId: newTeam.id,
      eventId: eventId,
    });

    revalidatePath("/profile");
    revalidatePath(`/events/${eventId}`);
    
    return { success: true, team: newTeam, code };
  } catch (error) {
    console.error("Create team error:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error creating team." };
  }
}

export async function joinTeam(code: string, userId: string) {
  try {
    // 1. Find team by code
    const [team] = await db.select().from(teams).where(eq(teams.code, code.toUpperCase())).limit(1);
    
    // 1.5 Enforce "One Person, One Team" rule
    const userMembership = await db.select().from(teamMembers).where(eq(teamMembers.userId, userId)).limit(1);
    if (userMembership.length > 0) {
      return { success: false, message: "You are already a member of a team. Leave your current team to join another." };
    }

    if (!team) {
      return { success: false, message: "Invalid team code." };
    }

    // 2. Check if user is already in this team
    const existingMember = await db.select()
      .from(teamMembers)
      .where(and(eq(teamMembers.teamId, team.id), eq(teamMembers.userId, userId)))
      .limit(1);

    if (existingMember.length > 0) {
      return { success: false, message: "You are already a member of this team." };
    }

    // 3. Add user to team
    await db.insert(teamMembers).values({
      teamId: team.id,
      userId: userId,
    });

    revalidatePath("/profile");
    
    return { success: true, team };
  } catch (error) {
    console.error("Join team error:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error joining team." };
  }
}

export async function getTeamDetails(teamId: string) {
  try {
    const [team] = await db.select().from(teams).where(eq(teams.id, teamId)).limit(1);
    if (!team) return null;

    const members = await db.select({
      id: users.id,
      displayName: users.displayName,
      email: users.email,
      profileImageUrl: users.profileImageUrl,
    })
    .from(teamMembers)
    .innerJoin(users, eq(teamMembers.userId, users.id))
    .where(eq(teamMembers.teamId, teamId));

    const events = await db.select({
      eventId: teamEvents.eventId,
    })
    .from(teamEvents)
    .where(eq(teamEvents.teamId, teamId));

    return { ...team, members, events };
  } catch (error) {
    console.error("Get team details error:", error);
    return null;
  }
}

export async function getUserTeams(userId: string) {
  try {
    const userTeamsList = await db.select({
      id: teams.id,
      name: teams.name,
      code: teams.code,
      leaderId: teams.leaderId,
      points: teams.points,
      createdAt: teams.createdAt,
    })
    .from(teamMembers)
    .innerJoin(teams, eq(teamMembers.teamId, teams.id))
    .where(eq(teamMembers.userId, userId));

    const teamPromises = userTeamsList.map(async (t) => {
      const events = await db.select({
        eventId: teamEvents.eventId,
      })
      .from(teamEvents)
      .where(eq(teamEvents.teamId, t.id));
      
      return {
        ...t,
        events: events.map(e => e.eventId)
      };
    });

    return await Promise.all(teamPromises);
  } catch (error) {
    console.error("Get user teams error:", error);
    return [];
  }
}

export async function getLeaderboard(limit = 50) {
  try {
    const leaderboardData = await db.select({
      id: teams.id,
      name: teams.name,
      points: teams.points,
      leaderName: users.displayName,
    })
    .from(teams)
    .innerJoin(users, eq(teams.leaderId, users.id))
    .orderBy(desc(teams.points))
    .limit(limit);

    return { success: true, data: leaderboardData };
  } catch (error) {
    console.error("Get leaderboard error:", error);
    return { success: false, message: "Failed to fetch leaderboard." };
  }
}
