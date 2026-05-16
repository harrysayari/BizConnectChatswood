import type { FastifyPluginAsync } from "fastify";
import { db } from "../db/client.js";
import { CreateAlertSchema } from "@bizconnect/shared";

export const alertsRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post("/", async (request, reply) => {
    const body = CreateAlertSchema.parse(request.body);
    const [alert] = await db`
      INSERT INTO alerts (title, body, polygon, created_by)
      VALUES (
        ${body.title},
        ${body.body},
        ST_GeomFromGeoJSON(${JSON.stringify(body.polygon)}),
        ${body.created_by ?? null}
      )
      RETURNING id
    `;
    return reply.code(201).send(alert);
  });

  fastify.post<{ Params: { id: string } }>("/:id/send", async (request, reply) => {
    const { id } = request.params;
    const [alert] = await db`SELECT id, title, body, sent_at, ST_AsGeoJSON(polygon) AS polygon FROM alerts WHERE id = ${id}`;
    if (!alert) return reply.notFound("Alert not found");

    const businesses = await db<{ id: string; phone: string; name: string }[]>`
      SELECT id, phone, name FROM businesses
      WHERE ST_Within(location::geometry, ST_SetSRID(ST_GeomFromGeoJSON(${alert.polygon}), 4326)::geometry)
    `;

    await db`UPDATE alerts SET sent_at = NOW() WHERE id = ${id}`;

    // WhatsApp sends are triggered here — actual Meta API calls handled by apps/whatsapp
    return { matched: businesses.length, businessIds: businesses.map((b) => b.id) };
  });
};
