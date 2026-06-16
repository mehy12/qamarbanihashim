import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const donations = pgTable('donations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  amount: integer('amount').notNull(),
  paymentMethod: text('payment_method'),
  utr: text('utr'),
  screenshotBase64: text('screenshot_base64'),
  status: text('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Donation = typeof donations.$inferSelect;
export type NewDonation = typeof donations.$inferInsert;
