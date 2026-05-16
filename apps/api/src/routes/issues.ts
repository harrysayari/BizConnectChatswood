import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { db } from "../db/client.js";
import { CreateIssueSchema, IssueStatusSchema } from "@bizconnect/shared";

export const issuesRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post("/", async (request, reply) => {
    const body = CreateIssueSchema.parse(request.body);
    const [issue] = await db`
      INSERT INTO issues (business_id, category, description, status, location)
      VALUES (
        ${body.business_id},
        ${body.category},
        ${body.description},
        'open',
        ST_GeomFromGeoJSON(${JSON.stringify(body.location)})
      )
      RETURNING id
    `;
    return reply.code(201).send(issue);
  });

  fastify.put<{ Params: { id: string } }>("/:id/status", async (request, reply) => {
    const { status } = z.object({ status: IssueStatusSchema }).parse(request.body);
    const resolved_at = status === "resolved" ? new Date().toISOString() : null;
    await db`
      UPDATE issues
      SET status = ${status}, resolved_at = ${resolved_at}
      WHERE id = ${(request.params as { id: string }).id}
    `;
    return { success: true };
  });
};
