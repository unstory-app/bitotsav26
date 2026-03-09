"use server";

import { db } from "@/db";
import { users, tickets, teams, teamMembers } from "@/db/schema";
import { eq, desc, count, sql } from "drizzle-orm";
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
  } catch (error: any) {
    return { success: false, message: error.message };
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
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getAdminTeams(page: number = 1) {
  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    
    const data = await db.select({
      id: teams.id,
      name: teams.name,
      code: teams.code,
      eventId: teams.eventId,
      leaderName: users.displayName,
      createdAt: teams.createdAt,
    })
    .from(teams)
    .innerJoin(users, eq(teams.leaderId, users.id))
    .orderBy(desc(teams.createdAt))
    .limit(ITEMS_PER_PAGE)
    .offset(offset);

    const [totalResult] = await db.select({ value: count() }).from(teams);
    
    return { 
      success: true, 
      data, 
      totalPages: Math.ceil(Number(totalResult.value) / ITEMS_PER_PAGE) 
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateTicketStatus(ticketId: string, status: string) {
  try {
    await db.update(tickets)
      .set({ status })
      .where(eq(tickets.id, ticketId as any));
    
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
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
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
