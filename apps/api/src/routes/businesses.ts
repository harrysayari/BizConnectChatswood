import type { FastifyPluginAsync } from "fastify";
import { db } from "../db/client.js";
import { UpdateBusinessSchema } from "@bizconnect/shared";

export const businessesRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", async () => {
    return db`
      SELECT id, name, phone, address,
        ST_AsGeoJSON(location)::json AS location,
        trading_hours, services, verified_at, last_heartbeat_at
      FROM businesses
    `;
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const { id } = request.params;
    const [row] = await db`
      SELECT id, name, phone, address,
        ST_AsGeoJSON(location)::json AS location,
        trading_hours, services, verified_at, last_heartbeat_at
      FROM businesses WHERE id = ${id}
    `;
    if (!row) return reply.notFound("Business not found");
    return row;
  });

  fastify.put<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const { id } = request.params;
    const body = UpdateBusinessSchema.parse(request.body);
    await db`UPDATE businesses SET ${db(body as Record<string, unknown>)} WHERE id = ${id}`;
    return { success: true };
  });
};
