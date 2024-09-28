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

// const fetchTasksHandler: RouteHandler<typeof fetchTasksRoute, {}> = async (
//   c
// ) => {
//   console.log(
//     "Fetching tasks to u------------------------",
//     c.req,
//     c.req.method !== "GET" ? c.req.json() : Boolean(c.req.json)
//   );
//   return c.json([
//     {
//       id: "task1",
//       title: "Task 1",
//       description: "Task 1 description",
//       dueDate: new Date("2025-12-31").toISOString(),
//       priority: "High",
//       isCompleted: false,
//       isDeleted: false,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     },
//     {
//       id: "task2",
//       title: "Task 2",
//       description: "Task 2 description",
//       dueDate: new Date("2022-12-30").toISOString(),
//       priority: "Medium",
//       isCompleted: false,
//       isDeleted: false,
//       createdAt: new Date("2022-12-01").toISOString(),
//       updatedAt: new Date("2022-12-02").toISOString(),
//     },
//   ]);
// };
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
  path: "/{taskId}",
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
