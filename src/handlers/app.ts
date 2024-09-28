import { handle } from "hono/aws-lambda";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { tasksApi } from "../routes/task_route";

const app = new OpenAPIHono();

app.route("/tasks", tasksApi);
app.doc("/swagger-json", {
  openapi: "3.1.0",
  info: {
    version: "1.0.0",
    title: "Hono lambda test api",
    description: "",
    contact: {
      name: "tanase-j-ww",
      email: "tanase.j@world-wing.com",
    },
  },
  servers: [{ url: "http://localhost:3333" }],
});
// Use the middleware to serve Swagger UI at /ui
app.get("/swagger", swaggerUI({ url: "/swagger-json" }));
app.get("/healthcheck", (c) => c.text("health check!"));

export const handler = handle(app);
