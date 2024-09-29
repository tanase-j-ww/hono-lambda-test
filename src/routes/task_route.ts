import { createRoute, type RouteHandler } from "@hono/zod-openapi";
import { OpenAPIHono } from "@hono/zod-openapi";

import { TaskController } from "../controllers/taks_controller";
import { handlerGenerator } from "../handlers/base";
import {
	BAD_REQUEST_ERROR,
	INTERNAL_SERVER_ERROR,
	NOT_FOUND_ERROR,
	UNAUTHORIZED_ERROR,
} from "../schemas/errors";
import {
	type Task,
	taskCreateRequestSchema,
	type TaskList,
	taskSchema,
	tasksSchema,
} from "../schemas/task_schema";

const taskController = new TaskController();

export const tasksApi = new OpenAPIHono();

const fetchTasksRoute = createRoute({
	method: "get",
	path: "/",
	summary: "全てのタスクを取得",
	description: "論理削除済みタスクを除いた全てのタスクを返します。",
	operationId: "fetchAllTasks",
	tags: ["Task"],
	responses: {
		200: {
			content: {
				"application/json": {
					schema: tasksSchema,
				},
			},
			description: "すべてのタスクを取得します。",
		},
		400: BAD_REQUEST_ERROR,
		401: UNAUTHORIZED_ERROR,
		500: INTERNAL_SERVER_ERROR,
	},
});
const fetchTasksHandler: RouteHandler<
	typeof fetchTasksRoute,
	Record<string, unknown>
> = handlerGenerator<TaskList>(taskController.fetchAllTasks);

const createTaskRoute = createRoute({
	method: "post",
	path: "/",
	summary: "新規タスクを作成",
	description: "タスクを登録します。",
	operationId: "createTask",
	tags: ["Task"],
	request: {
		body: {
			content: {
				"application/json": {
					schema: taskCreateRequestSchema,
				},
			},
		},
	},
	responses: {
		201: {
			description: "タスクを登録しました。",
			content: {
				"application/json": {
					schema: taskSchema,
				},
			},
		},
		400: BAD_REQUEST_ERROR,
		401: UNAUTHORIZED_ERROR,
		404: NOT_FOUND_ERROR,
		500: INTERNAL_SERVER_ERROR,
	},
});
const createTaskHandler: RouteHandler<
	typeof createTaskRoute,
	Record<string, unknown>
> = handlerGenerator<Task>(({ body: task }) => taskController.createTask(task));

const fetchTaskRoute = createRoute({
	method: "get",
	path: "/{taskId}",
	summary: "指定したタスクを取得",
	description: "指定したIDのタスクを取得します。",
	operationId: "fetchTask",
	tags: ["Task"],
	parameters: [
		{
			in: "path",
			name: "taskId",
			required: true,
		},
	],
	responses: {
		200: {
			content: {
				"application/json": {
					schema: taskSchema,
				},
			},
			description: "タスクを1件取得しました。",
		},
		400: BAD_REQUEST_ERROR,
		401: UNAUTHORIZED_ERROR,
		404: NOT_FOUND_ERROR,
		500: INTERNAL_SERVER_ERROR,
	},
});
const fetchTaskHandler: RouteHandler<
	typeof fetchTaskRoute,
	Record<string, unknown>
> = handlerGenerator<Task>(({ path: { taskId } }) => taskController.fetchTask(taskId));

tasksApi
	.openapi(fetchTasksRoute, fetchTasksHandler)
	.openapi(createTaskRoute, createTaskHandler)
	.openapi(fetchTaskRoute, fetchTaskHandler);
