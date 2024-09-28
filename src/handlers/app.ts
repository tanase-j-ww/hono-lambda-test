import { handle } from "hono/aws-lambda";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";

const app = new OpenAPIHono();

app.get("/", (c) => c.text("Hello Hono!"));
// Use the middleware to serve Swagger UI at /ui
app.get("/ui", swaggerUI({ url: "/doc" }));
app.get("/healthcheck", (c) => c.text("health check!"));

export const handler = handle(app);
