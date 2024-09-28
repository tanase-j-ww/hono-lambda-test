import { createRoute, RouteHandler } from "@hono/zod-openapi";
import {
  Task,
  taskCreateRequestSchema,
  TaskList,
  taskSchema,
  tasksSchema,
} from "../schemas/task_schema";
import {
  BAD_REQUEST_ERROR,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND_ERROR,
  UNAUTHORIZED_ERROR,
} from "../schemas/errors";

import { OpenAPIHono } from "@hono/zod-openapi";
import { TaskController } from "../controllers/taks_controller";
import { handlerGenerator } from "../handlers/base";

const taskController = new TaskController();

export const tasksApi = new OpenAPIHono();

const fetchTasksRoute = createRoute({
  method: "get",
  path: "/",
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
  summary: "全てのタスクを取得",
  description: "論理削除済みタスクを除いた全てのタスクを返します。",
  operationId: "fetchAllTasks",
  tags: ["Task"],
});
const fetchTasksHandler: RouteHandler<typeof fetchTasksRoute, {}> =
  handlerGenerator<TaskList>(taskController.fetchAllTasks);

const createTaskRoute = createRoute({
  method: "post",
  path: "/",
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
const createTaskHandler: RouteHandler<typeof createTaskRoute, {}> =
  handlerGenerator<Task>(({ body: task }) => taskController.createTask(task));

const fetchTaskRoute = createRoute({
  method: "get",
  path: "/:taskId",
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
const fetchTaskHandler: RouteHandler<typeof fetchTaskRoute, {}> =
  handlerGenerator<Task>(({ path: { taskId } }) =>
    taskController.fetchTask(taskId)
  );

tasksApi
  .openapi(fetchTasksRoute, fetchTasksHandler)
  .openapi(createTaskRoute, createTaskHandler)
  .openapi(fetchTaskRoute, fetchTaskHandler);
