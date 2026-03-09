import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Stack Auth user ID
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  profileImageUrl: text("profile_image_url"),
  qrData: text("qr_data"),
  isBitMesra: boolean("is_bit_mesra").notNull().default(false),
  collegeName: text("college_name"),
  rollNo: text("roll_no"),
  idCardImageUrl: text("id_card_image_url"),
  password: text("password"), // Stored for manual verification/recovery (per request)
  day0Scan: boolean("day0_scan").notNull().default(false),
  day1Scan: boolean("day1_scan").notNull().default(false),
  day2Scan: boolean("day2_scan").notNull().default(false),
  day3Scan: boolean("day3_scan").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tickets = pgTable("tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id).notNull(),
  ticketType: text("ticket_type").notNull(), // e.g., "Regular", "VIP"
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
});

export const teams = pgTable("teams", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(), // Team joining code
  leaderId: text("leader_id").references(() => users.id).notNull(),
  eventId: text("event_id").notNull(), // Links to manual events data
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  teamId: uuid("team_id").references(() => teams.id).notNull(),
  userId: text("user_id").references(() => users.id).notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;
