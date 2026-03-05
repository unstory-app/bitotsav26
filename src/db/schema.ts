import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Stack Auth user ID
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  profileImageUrl: text("profile_image_url"),
  qrData: text("qr_data"),
  isBitMesra: boolean("is_bit_mesra").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
