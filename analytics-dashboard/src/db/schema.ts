/**
 * Read-only copy of the docs analytics tables from the Fossorial API
 * (api repo: src/services/db/schema.ts, `docs*` tables). The API owns these tables and
 * their migrations; keep this file in sync when they change. This app never writes.
 */
import { index, integer, jsonb, pgTable, primaryKey, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const docsPageVoteTable = pgTable(
  'docsPageVote',
  {
    page: text('page').notNull(),
    visitorId: varchar('visitor_id', { length: 64 }).notNull(),
    vote: integer('vote').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.page, t.visitorId] }), index('docsPageVote_updated_at_idx').on(t.updatedAt)],
);

export const docsChatThreadTable = pgTable(
  'docsChatThread',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    visitorId: varchar('visitor_id', { length: 64 }),
    page: text('page'),
    firstQuestion: text('first_question').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('docsChatThread_created_at_idx').on(t.createdAt)],
);

export const docsChatMessageTable = pgTable(
  'docsChatMessage',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    threadId: varchar('thread_id', { length: 64 })
      .notNull()
      .references(() => docsChatThreadTable.id, { onDelete: 'cascade' }),
    role: varchar('role', { length: 16 }).$type<'user' | 'assistant'>().notNull(),
    content: text('content').notNull(),
    tools: jsonb('tools').$type<{ name: string; input?: unknown }[]>(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('docsChatMessage_thread_idx').on(t.threadId, t.createdAt),
    index('docsChatMessage_created_at_idx').on(t.createdAt),
  ],
);

export const docsMessageVoteTable = pgTable(
  'docsMessageVote',
  {
    messageId: varchar('message_id', { length: 64 })
      .primaryKey()
      .references(() => docsChatMessageTable.id, { onDelete: 'cascade' }),
    threadId: varchar('thread_id', { length: 64 }).notNull(),
    visitorId: varchar('visitor_id', { length: 64 }),
    vote: integer('vote').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('docsMessageVote_updated_at_idx').on(t.updatedAt)],
);

export const docsSearchQueryTable = pgTable(
  'docsSearchQuery',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    visitorId: varchar('visitor_id', { length: 64 }),
    query: varchar('query', { length: 256 }).notNull(),
    results: integer('results').notNull(),
    clickedUrl: text('clicked_url'),
    page: text('page'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('docsSearchQuery_created_at_idx').on(t.createdAt)],
);
