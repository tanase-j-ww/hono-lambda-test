import { z } from "@hono/zod-openapi";

const taskIdSchema = z.string().openapi({
	title: "タスクのID",
	description: "タスクのIDです。",
	example: "9aa8caf4ca0c4963a9a035d76a3018fe",
});

const titleSchema = z.string().openapi({
	title: "タスクのタイトル",
	description: "タスクのタイトルです。",
	example: "TASK1",
});

const descriptionSchema = z.string().max(255).openapi({
	title: "タスクの詳細",
	description: "タスクの詳細です。",
	example: "わからないことがあれば上司に確認",
});

const dueDateSchema = z.string().openapi({
	title: "タスクの期日",
	description: "タスクの期日です。",
	example: "2022-12-31",
});

const prioritySchema = z.enum(["High", "Medium", "Low"]).openapi({
	title: "タスクの優先度",
	description: "タスクの優先度です。",
	example: "High",
});
const isCompletedSchema = z.boolean().openapi({
	title: "タスクの完了状態",
	description: "タスクの完了状態です。",
	example: false,
});
const isDeletedSchame = z.boolean().openapi({
	title: "タスクの削除フラグ",
	description: "タスクの削除フラグです。",
	example: false,
});
const createdAtSchema = z.string().openapi({
	title: "タスクの登録日",
	description: "タスクの登録日です。",
	example: "2022-12-01",
});
const updatedAtSchema = z.string().openapi({
	title: "タスクの更新日",
	description: "タスクの更新日です。",
	example: "2022-12-02",
});

export type Task = z.infer<typeof taskSchema>;

export const taskSchema = z.object({
	id: taskIdSchema,
	title: titleSchema,
	description: descriptionSchema,
	dueDate: dueDateSchema,
	priority: prioritySchema,
	isCompleted: isCompletedSchema,
	isDeleted: isDeletedSchame,
	createdAt: createdAtSchema,
	updatedAt: updatedAtSchema,
});

export type TaskList = z.infer<typeof tasksSchema>;

export const tasksSchema = z.array(taskSchema);

export type TaskCreateRequest = z.infer<typeof taskCreateRequestSchema>;

export const taskCreateRequestSchema = z.object({
	title: titleSchema,
	description: descriptionSchema,
	dueDate: dueDateSchema,
	priority: prioritySchema,
	isCompleted: isCompletedSchema,
});
