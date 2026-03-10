"use server";

import { db } from "@/db";
import { users, tickets, teams, teamMembers, events, teamEvents } from "@/db/schema";
import { eq, desc, count, ilike, or, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const ITEMS_PER_PAGE = 20;

export async function getAdminUsers(page: number = 1, search?: string) {
  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    
    let query = db.select({
      id: users.id,
      email: users.email,
      displayName: users.displayName,
      profileImageUrl: users.profileImageUrl,
      qrData: users.qrData,
      isBitMesra: users.isBitMesra,
      collegeName: users.collegeName,
      rollNo: users.rollNo,
      idCardImageUrl: users.idCardImageUrl,
      password: users.password,
      phoneNumber: users.phoneNumber,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    }).from(users);

    if (search) {
      query = query.where(
        or(
          ilike(users.displayName, `%${search}%`),
          ilike(users.email, `%${search}%`),
          ilike(users.rollNo, `%${search}%`)
        )
      ) as any;
    }

    const data = await query
      .orderBy(desc(users.createdAt))
      .limit(ITEMS_PER_PAGE)
      .offset(offset);

    let totalQuery = db.select({ value: count() }).from(users);
    if (search) {
      totalQuery = totalQuery.where(
        or(
          ilike(users.displayName, `%${search}%`),
          ilike(users.email, `%${search}%`),
          ilike(users.rollNo, `%${search}%`)
        )
      ) as any;
    }
    const [totalResult] = await totalQuery;
    
    return { 
      success: true, 
      data, 
      totalPages: Math.ceil(Number(totalResult.value) / ITEMS_PER_PAGE) 
    };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "An unknown error occurred" };
  }
}

export async function getAdminTickets(page: number = 1, search?: string) {
  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    
    let query = db.select({
      id: tickets.id,
      userId: tickets.userId,
      userEmail: users.email,
      userName: users.displayName,
      ticketType: tickets.ticketType,
      status: tickets.status,
      day0Scan: tickets.day0Scan,
      day1Scan: tickets.day1Scan,
      day2Scan: tickets.day2Scan,
      day3Scan: tickets.day3Scan,
      issuedAt: tickets.issuedAt,
    })
    .from(tickets)
    .innerJoin(users, eq(tickets.userId, users.id));

    if (search) {
      query = query.where(
        or(
          ilike(users.displayName, `%${search}%`),
          ilike(users.email, `%${search}%`)
        )
      ) as any;
    }

    const data = await query
    .orderBy(desc(tickets.issuedAt))
    .limit(ITEMS_PER_PAGE)
    .offset(offset);

    let totalQuery = db.select({ value: count() }).from(tickets).innerJoin(users, eq(tickets.userId, users.id));
    if (search) {
      totalQuery = totalQuery.where(
        or(
          ilike(users.displayName, `%${search}%`),
          ilike(users.email, `%${search}%`)
        )
      ) as any;
    }
    const [totalResult] = await totalQuery;
    
    return { 
      success: true, 
      data, 
      totalPages: Math.ceil(Number(totalResult.value) / ITEMS_PER_PAGE) 
    };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "An unknown error occurred" };
  }
}

export async function getAdminTeams(page: number = 1, search?: string) {
  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    
    let query = db.select({
      id: teams.id,
      name: teams.name,
      code: teams.code,
      leaderName: users.displayName,
      points: teams.points,
      createdAt: teams.createdAt,
    })
    .from(teams)
    .innerJoin(users, eq(teams.leaderId, users.id));

    if (search) {
      query = query.where(
        or(
          ilike(teams.name, `%${search}%`),
          ilike(teams.code, `%${search}%`),
          ilike(users.displayName, `%${search}%`)
        )
      ) as any;
    }

    const teamsList = await query
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

    let totalQuery = db.select({ value: count() }).from(teams).innerJoin(users, eq(teams.leaderId, users.id));
    if (search) {
      totalQuery = totalQuery.where(
        or(
          ilike(teams.name, `%${search}%`),
          ilike(teams.code, `%${search}%`),
          ilike(users.displayName, `%${search}%`)
        )
      ) as any;
    }
    const [totalResult] = await totalQuery;
    
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
    
    revalidatePath("/admin/tickets");
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "An unknown error occurred" };
  }
}

export async function deleteTicket(ticketId: string) {
  try {
    await db.delete(tickets).where(eq(tickets.id, ticketId));
    revalidatePath("/admin/tickets");
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to delete ticket" };
  }
}

export async function toggleTicketScan(ticketId: string, day: string, status: boolean) {
  try {
    const updateObj: any = {};
    if (day === "day0") updateObj.day0Scan = status;
    else if (day === "day1") updateObj.day1Scan = status;
    else if (day === "day2") updateObj.day2Scan = status;
    else if (day === "day3") updateObj.day3Scan = status;
    
    await db.update(tickets).set(updateObj).where(eq(tickets.id, ticketId));
    revalidatePath("/admin/tickets");
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to update scan status" };
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

export async function getAdminEvents(page: number = 1, search?: string) {
  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    let query = db.select().from(events);
    
    if (search) {
      query = query.where(
        or(
          ilike(events.name, `%${search}%`),
          ilike(events.organizer, `%${search}%`),
          ilike(events.id, `%${search}%`)
        )
      ) as any;
    }

    const data = await query.orderBy(desc(events.createdAt)).limit(ITEMS_PER_PAGE).offset(offset);
    
    let totalQuery = db.select({ value: count() }).from(events);
    if (search) {
      totalQuery = totalQuery.where(
        or(
          ilike(events.name, `%${search}%`),
          ilike(events.organizer, `%${search}%`),
          ilike(events.id, `%${search}%`)
        )
      ) as any;
    }
    const [totalResult] = await totalQuery;
    
    return { success: true, data, totalPages: Math.ceil(Number(totalResult.value) / ITEMS_PER_PAGE) };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to fetch events" };
  }
}

export async function getAllDataForExport(type: "users" | "tickets" | "teams" | "events" | "participants") {
  try {
    if (type === "users") {
      return await db.select({
        id: users.id,
        email: users.email,
        displayName: users.displayName,
        phoneNumber: users.phoneNumber,
        isBitMesra: users.isBitMesra,
        collegeName: users.collegeName,
        rollNo: users.rollNo,
        createdAt: users.createdAt,
      }).from(users);
    }
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

export async function getAdminParticipants(eventId?: string, page: number = 1, search?: string) {
  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    
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

    const filters = [];
    if (eventId) filters.push(eq(teamEvents.eventId, eventId));
    if (search) filters.push(or(
      ilike(users.displayName, `%${search}%`),
      ilike(users.email, `%${search}%`),
      ilike(teams.name, `%${search}%`)
    ));

    if (filters.length > 0) {
      // @ts-expect-error - drizzle type complexity
      query = query.where(and(...filters));
    }

    const data = await query.limit(ITEMS_PER_PAGE).offset(offset);
    
    let totalQuery = db.select({ value: count() })
      .from(teamMembers)
      .innerJoin(teams, eq(teamMembers.teamId, teams.id))
      .innerJoin(teamEvents, eq(teamEvents.teamId, teams.id));

    if (filters.length > 0) {
      // @ts-expect-error - drizzle type complexity
      totalQuery = totalQuery.where(and(...filters));
    }
    const [totalResult] = await totalQuery;
    
    return { 
      success: true, 
      data, 
      totalPages: Math.ceil(Number(totalResult?.value || 0) / ITEMS_PER_PAGE) 
    };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to fetch participants" };
  }
}

export async function updateTeamPoints(teamId: string, points: number) {
  try {
    await db.update(teams).set({ points }).where(eq(teams.id, teamId));
    revalidatePath("/admin");
    revalidatePath("/leaderboard");
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to update points" };
  }
}

export async function getAdminTeamEventMatrix(search?: string) {
  try {
    const teamRows = await db.select({
      teamId: teams.id,
      teamName: teams.name,
      teamCode: teams.code,
      teamPoints: teams.points,
      teamCreatedAt: teams.createdAt,
      leaderId: users.id,
      leaderName: users.displayName,
      leaderEmail: users.email,
      leaderPhoneNumber: users.phoneNumber,
      leaderRollNo: users.rollNo,
    })
    .from(teams)
    .innerJoin(users, eq(teams.leaderId, users.id))
    .orderBy(desc(teams.points), teams.name);

    const ranks = new Map(teamRows.map((team, index) => [team.teamId, index + 1]));

    const matrix = await Promise.all(
      teamRows.map(async (team) => {
        const [memberRows, eventRows] = await Promise.all([
          db.select({
            userId: users.id,
            displayName: users.displayName,
            email: users.email,
            phoneNumber: users.phoneNumber,
            rollNo: users.rollNo,
            collegeName: users.collegeName,
            isBitMesra: users.isBitMesra,
            profileImageUrl: users.profileImageUrl,
            idCardImageUrl: users.idCardImageUrl,
            joinedAt: teamMembers.joinedAt,
          })
          .from(teamMembers)
          .innerJoin(users, eq(teamMembers.userId, users.id))
          .where(eq(teamMembers.teamId, team.teamId)),
          db.select({
            eventId: events.id,
            eventName: events.name,
            organizer: events.organizer,
            venue: events.venue,
            category: events.category,
            registeredAt: teamEvents.registeredAt,
          })
          .from(teamEvents)
          .innerJoin(events, eq(teamEvents.eventId, events.id))
          .where(eq(teamEvents.teamId, team.teamId)),
        ]);

        const memberDigest = memberRows
          .map((member, index) => {
            const role = member.userId === team.leaderId ? "Leader" : `Member ${index + 1}`;
            return [
              role,
              member.displayName || "Unknown",
              member.email,
              member.phoneNumber || "No phone",
              member.rollNo || member.collegeName || "No academic data",
              member.isBitMesra ? "BIT Mesra" : "External",
            ].join(" | ");
          })
          .join(" ; ");

        return eventRows.map((event) => ({
          teamId: team.teamId,
          teamName: team.teamName,
          teamCode: team.teamCode,
          teamPoints: team.teamPoints,
          teamRank: ranks.get(team.teamId) ?? null,
          memberCount: memberRows.length,
          teamCreatedAt: team.teamCreatedAt,
          leaderId: team.leaderId,
          leaderName: team.leaderName,
          leaderEmail: team.leaderEmail,
          leaderPhoneNumber: team.leaderPhoneNumber,
          leaderRollNo: team.leaderRollNo,
          eventId: event.eventId,
          eventName: event.eventName,
          organizer: event.organizer,
          venue: event.venue,
          category: event.category,
          registeredAt: event.registeredAt,
          members: memberRows,
          memberDigest,
        }));
      })
    );

    const data = matrix.flat();

    if (!search?.trim()) {
      return { success: true, data };
    }

    const normalizedSearch = search.trim().toLowerCase();
    const filtered = data.filter((row) => {
      const haystack = [
        row.teamName,
        row.teamCode,
        row.leaderName,
        row.leaderEmail,
        row.eventName,
        row.organizer,
        row.venue,
        row.category,
        row.memberDigest,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });

    return { success: true, data: filtered };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to fetch team event matrix" };
  }
}
