import { createRoute } from "@hono/zod-openapi";
import {
  taskCreateRequestSchema,
  taskSchema,
  tasksSchema,
} from "../schemas/task_schema";
import {
  BAD_REQUEST_ERROR,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND_ERROR,
  UNAUTHORIZED_ERROR,
} from "../schemas/errors";

export const fetchTasksRoute = createRoute({
  method: "get",
  path: "/tasks",
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

export const createTaskRoute = createRoute({
  method: "post",
  path: "/tasks",
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
