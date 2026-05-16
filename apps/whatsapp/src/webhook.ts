import type { FastifyPluginAsync } from "fastify";

interface VerifyQuery {
  "hub.mode": string;
  "hub.verify_token": string;
  "hub.challenge": string;
}

export const webhookRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Querystring: VerifyQuery }>("/webhook/whatsapp", async (request, reply) => {
    const { "hub.mode": mode, "hub.verify_token": token, "hub.challenge": challenge } = request.query;
    if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
      return reply.code(200).send(challenge);
    }
    return reply.code(403).send("Forbidden");
  });

  fastify.post("/webhook/whatsapp", async (request, reply) => {
    const body = request.body as { object: string; entry: unknown[] };
    if (body.object !== "whatsapp_business_account") return reply.code(400).send("Bad request");
    for (const _entry of body.entry) {
      // Message routing handled in future flow tasks
    }
    return reply.code(200).send("OK");
  });
};
