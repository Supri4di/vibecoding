import { mysqlTable, bigint, varchar, timestamp } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const sessions = mysqlTable("sessions", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  token: varchar("token", { length: 255 }).notNull(),
  userId: bigint("user_id", { mode: "number" }).references(() => users.id).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

