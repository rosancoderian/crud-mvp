import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer, blob, primaryKey } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull()
});

export const instruction = sqliteTable('instruction', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	duration: integer('duration'),
	previewFile: text('preview_file'),
	createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' }),
	deletedAt: integer('deleted_at', { mode: 'timestamp_ms' }),
	createdBy: text('created_by').references(() => user.id),
	updatedBy: text('updated_by').references(() => user.id),
	deletedBy: text('deleted_by').references(() => user.id)
});

export const step = sqliteTable('step', {
	id: text('id').primaryKey(),
	instructionId: text('instruction_id')
		.notNull()
		.references(() => instruction.id),
	type: text('type').notNull(),
	title: text('title').notNull(),
	description: text('description'),
	stepNr: integer('step_nr').notNull(),
	attachedFile: text('attached_file'),
	createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' }),
	deletedAt: integer('deleted_at', { mode: 'timestamp_ms' }),
	createdBy: text('created_by').references(() => user.id),
	updatedBy: text('updated_by').references(() => user.id),
	deletedBy: text('deleted_by').references(() => user.id)
});

export const asset = sqliteTable('asset', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	assetFile: text('asset_file'),
	createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' }),
	deletedAt: integer('deleted_at', { mode: 'timestamp_ms' }),
	createdBy: text('created_by').references(() => user.id),
	updatedBy: text('updated_by').references(() => user.id),
	deletedBy: text('deleted_by').references(() => user.id)
});

// Relations

export const instructionRelations = relations(instruction, ({ many, one }) => ({
	instructionToAsset: many(instructionToAsset),
	creator: one(user, { fields: [instruction.createdBy], references: [user.id] }),
	updater: one(user, { fields: [instruction.updatedBy], references: [user.id] }),
	deleter: one(user, { fields: [instruction.deletedBy], references: [user.id] })
}));

export const stepRelations = relations(step, ({ many, one }) => ({
	instructionToAsset: many(instructionToAsset),
	creator: one(user, { fields: [step.createdBy], references: [user.id] }),
	updater: one(user, { fields: [step.updatedBy], references: [user.id] }),
	deleter: one(user, { fields: [step.deletedBy], references: [user.id] })
}));

export const assetRelations = relations(asset, ({ one }) => ({
	creator: one(user, { fields: [asset.createdBy], references: [user.id] }),
	updater: one(user, { fields: [asset.updatedBy], references: [user.id] }),
	deleter: one(user, { fields: [asset.deletedBy], references: [user.id] })
}));

export const instructionToAsset = sqliteTable(
	'instruction_to_asset',
	{
		instructionId: text('instruction_id').references(() => instruction.id),
		assetId: text('asset_id').references(() => asset.id)
	},
	(t) => ({
		pk: primaryKey({ columns: [t.instructionId, t.assetId] })
	})
);

export const instructionToStepRelations = relations(instructionToAsset, ({ one }) => ({
	instruction: one(instruction, {
		fields: [instructionToAsset.instructionId],
		references: [instruction.id]
	}),
	asset: one(asset, {
		fields: [instructionToAsset.assetId],
		references: [asset.id]
	})
}));

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Instruction = typeof instruction.$inferSelect;
export type Step = typeof step.$inferSelect;
export type Asset = typeof asset.$inferSelect;

export type NewInstruction = typeof instruction.$inferInsert;
export type NewStep = typeof step.$inferInsert;
export type NewAsset = typeof asset.$inferInsert;
