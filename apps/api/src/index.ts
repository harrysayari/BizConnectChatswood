import Fastify from "fastify";
import sensible from "@fastify/sensible";
import { ZodError } from "zod";
import { healthRoute } from "./routes/health.js";
import { businessesRoute } from "./routes/businesses.js";
import { alertsRoute } from "./routes/alerts.js";
import { issuesRoute } from "./routes/issues.js";

export function buildServer() {
  const server = Fastify({ logger: process.env.NODE_ENV !== "test" });
  server.register(sensible);
  server.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.badRequest(error.issues.map((i) => i.message).join("; "));
    }
    reply.send(error);
  });
  server.register(healthRoute);
  server.register(businessesRoute, { prefix: "/businesses" });
  server.register(alertsRoute, { prefix: "/alerts" });
  server.register(issuesRoute, { prefix: "/issues" });
  return server;
}

const isMain = process.argv[1]?.endsWith("index.ts") || process.argv[1]?.endsWith("index.js");
if (isMain) {
  const server = buildServer();
  await server.listen({ port: Number(process.env.PORT ?? 3001), host: "0.0.0.0" });
}
