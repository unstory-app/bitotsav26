import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Prefer direct connection (no pgbouncer) to avoid "Tenant or user not found"
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL!;
const isPooler = connectionString.includes("pooler.supabase.com");

const client = postgres(connectionString, {
  prepare: false,              // Required for pgbouncer
  ssl: { rejectUnauthorized: false }, // Required for Supabase SSL
  max: isPooler ? 1 : 10,     // Limit connections for pooler environments
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
