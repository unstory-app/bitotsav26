"use server";

import { db } from "@/db";
import { users, tickets, teams, teamMembers, events, teamEvents } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const ITEMS_PER_PAGE = 20;

export async function getAdminUsers(page: number = 1) {
  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    
    const data = await db.select()
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(ITEMS_PER_PAGE)
      .offset(offset);

    const [totalResult] = await db.select({ value: count() }).from(users);
    
    return { 
      success: true, 
      data, 
      totalPages: Math.ceil(Number(totalResult.value) / ITEMS_PER_PAGE) 
    };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "An unknown error occurred" };
  }
}

export async function getAdminTickets(page: number = 1) {
  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    
    const data = await db.select({
      id: tickets.id,
      userId: tickets.userId,
      userEmail: users.email,
      userName: users.displayName,
      ticketType: tickets.ticketType,
      status: tickets.status,
      issuedAt: tickets.issuedAt,
    })
    .from(tickets)
    .innerJoin(users, eq(tickets.userId, users.id))
    .orderBy(desc(tickets.issuedAt))
    .limit(ITEMS_PER_PAGE)
    .offset(offset);

    const [totalResult] = await db.select({ value: count() }).from(tickets);
    
    return { 
      success: true, 
      data, 
      totalPages: Math.ceil(Number(totalResult.value) / ITEMS_PER_PAGE) 
    };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "An unknown error occurred" };
  }
}

export async function getAdminTeams(page: number = 1) {
  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    
    const teamsList = await db.select({
      id: teams.id,
      name: teams.name,
      code: teams.code,
      leaderName: users.displayName,
      createdAt: teams.createdAt,
    })
    .from(teams)
    .innerJoin(users, eq(teams.leaderId, users.id))
    .orderBy(desc(teams.createdAt))
    .limit(ITEMS_PER_PAGE)
    .offset(offset);

    const data = await Promise.all(teamsList.map(async (team) => {
      const e = await db.select({ eventName: events.name })
        .from(teamEvents)
        .innerJoin(events, eq(teamEvents.eventId, events.id))
        .where(eq(teamEvents.teamId, team.id));
      return { ...team, events: e.map(ev => ev.eventName) };
    }));

    const [totalResult] = await db.select({ value: count() }).from(teams);
    
    return { success: true, data, totalPages: Math.ceil(Number(totalResult.value) / ITEMS_PER_PAGE) };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "An unknown error occurred" };
  }
}

export async function updateTicketStatus(ticketId: string, status: string) {
  try {
    await db.update(tickets)
      .set({ status })
      .where(eq(tickets.id, ticketId));
    
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "An unknown error occurred" };
  }
}

export async function deleteUser(userId: string) {
  try {
    // Cascade delete manually if not set in DB
    await db.delete(teamMembers).where(eq(teamMembers.userId, userId));
    await db.delete(tickets).where(eq(tickets.userId, userId));
    await db.delete(teams).where(eq(teams.leaderId, userId));
    await db.delete(users).where(eq(users.id, userId));
    
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to delete user" };
  }
}

export async function getAdminEvents(page: number = 1) {
  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const data = await db.select().from(events).orderBy(desc(events.createdAt)).limit(ITEMS_PER_PAGE).offset(offset);
    const [totalResult] = await db.select({ value: count() }).from(events);
    return { success: true, data, totalPages: Math.ceil(Number(totalResult.value) / ITEMS_PER_PAGE) };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to fetch events" };
  }
}

export async function getAllDataForExport(type: "users" | "tickets" | "teams" | "events" | "participants") {
  try {
    if (type === "users") return await db.select().from(users);
    if (type === "tickets") return await db.select().from(tickets);
    if (type === "teams") {
      const teamsList = await db.select().from(teams);
      return await Promise.all(teamsList.map(async (t) => {
        const e = await db.select({ eventName: events.name })
          .from(teamEvents)
          .innerJoin(events, eq(teamEvents.eventId, events.id))
          .where(eq(teamEvents.teamId, t.id));
        return { ...t, events: e.map(ev => ev.eventName).join("; ") };
      }));
    }
    if (type === "events") return await db.select().from(events);
    if (type === "participants") {
      return await db.select({
        userName: users.displayName,
        userEmail: users.email,
        teamName: teams.name,
        eventName: events.name,
        joinedAt: teamMembers.joinedAt
      })
      .from(teamMembers)
      .innerJoin(users, eq(teamMembers.userId, users.id))
      .innerJoin(teams, eq(teamMembers.teamId, teams.id))
      .innerJoin(teamEvents, eq(teamEvents.teamId, teams.id))
      .innerJoin(events, eq(teamEvents.eventId, events.id));
    }
    return [];
  } catch (error) {
    console.error(`Export failed for ${type}:`, error);
    return [];
  }
}

export async function getAdminParticipants(eventId?: string, page: number = 1) {
  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    
    // If eventId provided, filter by event
    let query = db.select({
      userId: users.id,
      userName: users.displayName,
      userEmail: users.email,
      teamName: teams.name,
      eventName: events.name,
      joinedAt: teamMembers.joinedAt
    })
    .from(teamMembers)
    .innerJoin(users, eq(teamMembers.userId, users.id))
    .innerJoin(teams, eq(teamMembers.teamId, teams.id))
    .innerJoin(teamEvents, eq(teamEvents.teamId, teams.id))
    .innerJoin(events, eq(teamEvents.eventId, events.id));

    if (eventId) {
      // @ts-expect-error - drizzle type complexity
      query = query.where(eq(teamEvents.eventId, eventId));
    }

    const data = await query.limit(ITEMS_PER_PAGE).offset(offset);
    
    let totalCount = 0;
    if (eventId) {
      const [totalResult] = await db.select({ value: count() })
        .from(teamMembers)
        .innerJoin(teams, eq(teamMembers.teamId, teams.id))
        .innerJoin(teamEvents, eq(teamEvents.teamId, teams.id))
        .where(eq(teamEvents.eventId, eventId));
      totalCount = Number(totalResult?.value || 0);
    } else {
      const [totalResult] = await db.select({ value: count() }).from(teamMembers);
      totalCount = Number(totalResult?.value || 0);
    }

    return { 
      success: true, 
      data, 
      totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE) 
    };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to fetch participants" };
  }
}
