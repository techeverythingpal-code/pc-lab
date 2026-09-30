import { pgTable, serial, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["admin", "user"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const schools = pgTable("schools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull().references(() => schools.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pcs = pgTable("pcs", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
  label: text("label"),
  brand: text("brand"),
  model: text("model"),
  cpu: text("cpu"),
  ramGb: integer("ram_gb"),
  storageType: text("storage_type"),
  storageGb: integer("storage_gb"),
  gpu: text("gpu"),
  os: text("os"),
  monitor: text("monitor"),
  status: text("status").notNull().default("working"),
  notes: text("notes"),
  addedBy: integer("added_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});