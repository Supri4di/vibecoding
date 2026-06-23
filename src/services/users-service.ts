import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<void> {
  // Check if email already exists
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    throw new Error("Email sudah terdaftar");
  }

  // Hash password using Bun's built-in bcrypt
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
  });

  // Insert new user
  await db.insert(users).values({ name, email, password: hashedPassword });
}
