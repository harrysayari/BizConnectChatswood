import Fastify from "fastify";
import sensible from "@fastify/sensible";
import { webhookRoute } from "./webhook.js";

export function buildServer() {
  const server = Fastify({ logger: process.env.NODE_ENV !== "test" });
  server.register(sensible);
  server.register(webhookRoute);
  return server;
}

const isMain = process.argv[1]?.endsWith("index.ts") || process.argv[1]?.endsWith("index.js");
if (isMain) {
  if (!process.env.VERIFY_TOKEN) throw new Error("VERIFY_TOKEN env var is required");
  const server = buildServer();
  await server.listen({ port: Number(process.env.PORT ?? 3002), host: "0.0.0.0" });
}
