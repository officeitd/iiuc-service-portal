import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text({ enum: ['student', 'teacher', 'admin'] })
    .notNull()
    .default('student'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const refreshTokens = pgTable('refresh_tokens', {
  id: serial().primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
