import { pgTable, text, timestamp, boolean, uuid, integer } from "drizzle-orm/pg-core";

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
  phoneNumber: text("phone_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tickets = pgTable("tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id).notNull(),
  ticketType: text("ticket_type").notNull(), // e.g., "Regular", "VIP"
  status: text("status").notNull().default("confirmed"), // pending, confirmed, cancelled
  day0Scan: boolean("day0_scan").notNull().default(false),
  day1Scan: boolean("day1_scan").notNull().default(false),
  day2Scan: boolean("day2_scan").notNull().default(false),
  day3Scan: boolean("day3_scan").notNull().default(false),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: text("id").primaryKey(), // Custom ID like 'flag-1'
  name: text("name").notNull(),
  organizer: text("organizer"),
  venue: text("venue"),
  category: text("category"), // Flagship, Formal, Informal
  about: text("about"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const teams = pgTable("teams", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(), // Team joining code
  leaderId: text("leader_id").references(() => users.id).notNull(),
  points: integer("points").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const teamEvents = pgTable("team_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  teamId: uuid("team_id").references(() => teams.id).notNull(),
  eventId: text("event_id").references(() => events.id).notNull(),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
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
export type TeamEvent = typeof teamEvents.$inferSelect;
export type NewTeamEvent = typeof teamEvents.$inferInsert;
export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
