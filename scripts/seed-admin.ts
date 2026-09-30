import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import bcrypt from "bcryptjs";
import { users } from "../src/db/schema";

async function main() {
  const [username, password, name] = process.argv.slice(2);
  if (!username || !password) {
    console.error('Usage: npx tsx scripts/seed-admin.ts <username> <password> "<Full Name>"');
    process.exit(1);
  }
  const db = drizzle(neon(process.env.DATABASE_URL!));
  const passwordHash = await bcrypt.hash(password, 10);
  await db.insert(users).values({
    name: name || username,
    username,
    passwordHash,
    role: "admin",
  });
  console.log("Admin created:", username);
}

main();