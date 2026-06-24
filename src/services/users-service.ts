import { eq } from "drizzle-orm";
import { db } from "../db";
import { users, sessions } from "../db/schema";

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

export async function loginUser(
  email: string,
  password: string
): Promise<string> {
  // Find user by email
  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const user = existingUsers[0];
  if (!user) {
    throw new Error("Email atau password salah");
  }

  // Verify password using Bun's built-in bcrypt verify
  const isMatch = await Bun.password.verify(password, user.password);
  if (!isMatch) {
    throw new Error("Email atau password salah");
  }

  // Generate UUID token
  const token = crypto.randomUUID();

  // Save session to database
  await db.insert(sessions).values({
    token,
    userId: user.id,
  });

  return token;
}

export async function getCurrentUser(token: string) {
  // Find session by token
  const existingSessions = await db
    .select()
    .from(sessions)
    .where(eq(sessions.token, token))
    .limit(1);

  const session = existingSessions[0];
  if (!session) {
    throw new Error("Unauthorized");
  }

  // Find user by session.userId
  const existingUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  const user = existingUsers[0];
  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}


